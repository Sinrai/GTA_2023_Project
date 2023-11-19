#! /bin/env python

from shapely.geometry import Point
import psycopg2
import json
import numpy as np

db_gta = {"dbname": "gta",
          "port": "5432",
          "user": "gta_p4",
          "password": "***REMOVED***",
          "host": "ikgpgis.ethz.ch"}
conn = psycopg2.connect(**db_gta)
cur=conn.cursor()

for json_file in ['2G.json', '3G.json', '4G.json', '5G.json']:
    with open(json_file, 'r') as json:
        data = json.load(json_file)
        for i in range(len(data["features"])):
            coordinate=Point(np.array(data["features"])[i]["geometry"]["coordinates"][0],np.array(data["features"])[i]["geometry"]["coordinates"][1])
            power=data["features"][i]["properties"]["powercode_de"]
            cur.execute(f"INSERT INTO gta_p4.antenna_locations (radiated_power,geom,type) VALUES('{power}','{coordinate}','{json_file[0]}');")

conn.commit()
conn.close()
