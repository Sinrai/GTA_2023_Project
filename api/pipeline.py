import json
import pytest
from flask import Blueprint, jsonify, request
import sqlalchemy as db

api = Blueprint('api', __name__)

@api.route('/api/upload_data', methods=["POST"])
def process_user_data():
    try:
        user_data = request.get_json(force=True)
        client_ip = request.remote_addr
        print(user_data)

        # Jiann stuff here

        result = {"success": True, "message": "JSON data processed successfully"}
        status_code = 200
    except Exception as e:
        result = {"success": False, "message": str(e)}
        status_code = 400
    return jsonify(result), status_code

def execute_query(query):
    engine = db.create_engine("postgresql://gta_p4:***REMOVED***@ikgpgis.ethz.ch:5432/gta")
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

