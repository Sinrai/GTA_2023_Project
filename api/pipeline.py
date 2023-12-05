import json
from flask import Blueprint, jsonify, request
import sqlalchemy as db
import geopandas as gpd
from shapely.geometry import Point, LineString
from datetime import datetime as dt
import requests
import pyproj
import sqlalchemy.dialects.postgresql as pg_dialect
from geoalchemy2 import Geometry

api = Blueprint('api', __name__)
engine = db.create_engine("postgresql://gta_p4:***REMOVED***@ikgpgis.ethz.ch:5432/gta")
WGS_to_LV95 = pyproj.Transformer.from_crs('EPSG:4326', 'EPSG:2056', always_xy=True)


def get_train_tracks(trajectory):
    trajectory_lv95 = LineString(WGS_to_LV95.transform(x, y) for x, y in trajectory.coords)
    query = f"""
        SELECT *
        FROM gta_p4.train_tracks
        WHERE ST_DWithin(geometry, ST_GeomFromText('{trajectory_lv95.wkt}', 2056), 50)
    """
    return gpd.read_postgis(query, con=engine, geom_col='geometry', crs='EPSG:2056')


def get_provider(ip):
    re = requests.get(f'https://ipinfo.io/{ip}/json')
    return re.json()['org']

def load_data(data, client_ip):
    assert len(data) > 1
    columns = ['geometry', 'netspeed', 'ip', 'provider', 'time', 'username', 'in_train']
    gdf = gpd.GeoDataFrame(columns=columns)
    for line in data:
        user_point = {
            'geometry': Point(line['position']['longitude'],line['position']['latitude']),
            'netspeed': line['netinfo']['effectiveType'][0],
            'ip': client_ip,
            'time': dt.fromtimestamp(line['time']/1000),
            'username': line['username'],
        }
        gdf.loc[len(gdf)] = user_point
    gdf.crs = 'EPSG:4326'
    return gdf

@api.route('/api/upload_data', methods=["POST"])
def process_user_data():
    try:
        user_data = request.get_json(force=True)
        client_ip = request.remote_addr
        client_ip_from_proxy = request.headers.get('X-Forwarded-For')
        if client_ip == '127.0.0.1' and client_ip_from_proxy is not None:
            # Flask app deployed with proxy
            client_ip = client_ip_from_proxy

        user_data_gdf = load_data(user_data, client_ip)
        provider = get_provider(client_ip)

        user_trajectory = LineString(user_data_gdf['geometry'])
        train_tracks = get_train_tracks(user_trajectory)
        user_data_gdf = user_data_gdf.to_crs('EPSG:2056')

        traj_dist = 0

        for idx, row in user_data_gdf.iterrows():
            user_data_gdf.at[idx, 'provider'] = provider
            train_dist = train_tracks.distance(row.geometry).min()
            if idx < len(user_data_gdf)-1:
                time = (user_data_gdf.at[idx+1, 'time'] - row['time']).total_seconds()
                dist = user_data_gdf.geometry.distance(user_data_gdf.at[idx+1, 'geometry']).min()
                speed = dist/time
                in_train = (speed >= 60 and dist <= 10)
                user_data_gdf.at[idx, 'in_train'] = in_train
                if in_train:
                    traj_dist += dist
            else:
                user_data_gdf.at[idx, 'in_train'] = user_data_gdf.at[idx-1, 'in_train']

        with engine.connect() as conn:
            user_trajectory_id = conn.execute(db.text(f"INSERT INTO gta_p4.user_trajectory_data (distance,time,username,geometry) \
                                                        VALUES(\
                                                            '{traj_dist}',\
                                                            '{user_data_gdf.at[0, 'time']}',\
                                                            '{user_data_gdf.at[0, 'username']}',\
                                                            '{user_trajectory}'\
                                                        ) RETURNING user_trajectory_id;")).fetchone()[0]

        user_data_gdf['user_trajectory_id'] = [user_trajectory_id for i in range(len(user_data_gdf))]
        user_data_gdf = user_data_gdf.to_crs('EPSG:4326')
        user_data_gdf.to_postgis('user_point_data', con=engine, schema='gta_p4', if_exists='append',
                                 dtype={
                                     'geometry': Geometry,
                                     'netspeed': db.SmallInteger,
                                     'ip':       pg_dialect.VARCHAR(255),
                                     'provider': pg_dialect.VARCHAR(255),
                                     'time':     db.TIMESTAMP,
                                     'username': pg_dialect.VARCHAR(255),
                                     'in_train': db.Boolean
                                 })

        result = {"success": True, "message": "JSON data processed successfully"}
        status_code = 200
    except Exception as e:
        result = {"success": False, "message": str(e)}
        status_code = 400
    return jsonify(result), status_code

def execute_query(query):
    with engine.connect() as con:
        result = con.execute(query)
        return result.fetchall()


# Funktion zur Berechnung der Linienlängen
def calculate_trajectory_length(user_id):
    query = db.text(f"SELECT distance FROM gta_p4.user_trajectory_data WHERE username = '{user_id}'")  # SQL-Abfrage zur Auswahl der Linienlängen basierend auf der user_id
    rows = execute_query(query)
    total_length = 0

    # Berechnung der Gesamtlänge der Linien
    for row in rows:
        total_length += row[0]  # Annahme: 'distance' ist das Attribut vom Typ REAL

    return total_length

# Flask-Routenfunktion
@api.route('/api/get_user_statistic', methods=["GET"])
def get_user_statistic():
    user_id = request.args.get('user_id')               # Beispiel: User-ID aus der GET-Anfrage erhalten
    total_length = calculate_trajectory_length(user_id) # Aufruf der Funktion zur Berechnung der Linienlängen
    print(json.dumps({"statistic": total_length}, indent=4)) # Ausgabe in der Python-Flask-Konsole für debuggen

    return jsonify({"statistic": total_length})         # Rückgabe der berechneten Gesamtlänge als JSON

