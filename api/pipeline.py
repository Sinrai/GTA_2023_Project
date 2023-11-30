import psycopg2 #für die Datenbankverbindung
import json
import pytest
from flask import Blueprint, jsonify, request

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



# Carmela stuff here

# Funktion zur Berechnung der Linienlängen
def calculate_trajectory_length(user_id):
    conn = psycopg2.connect(
        dbname='gta',          #DB-Name
        user='gta_u20',        #Benutzername
        password='gta_pw',     #Passwort
        host='ikgpgis.ethz.ch',#Host
        port='5432'            #Port
    )

    cur = conn.cursor()
    query = f"SELECT distance FROM user_trajectory_data WHERE user_id = {user_id}"  # SQL-Abfrage zur Auswahl der Linienlängen basierend auf der user_id
    cur.execute(query)
    rows = cur.fetchall()
    total_length = 0

    # Berechnung der Gesamtlänge der Linien
    for row in rows:
        total_length += row[0]  # Annahme: 'distance' ist das Attribut vom Typ REAL

    conn.close()

    return total_length

# Flask-Routenfunktion
@api.route('/api/get_user_statistic', methods=["GET"])
def get_user_statistic():
    
    user_id = request.args.get('5')               # Beispiel: User-ID aus der GET-Anfrage erhalten
    total_length = calculate_trajectory_length(user_id) # Aufruf der Funktion zur Berechnung der Linienlängen
    print(json.dumps({"statistic": total_length}, indent=4)) # Ausgabe in der Python-Flask-Konsole für debuggen

    return jsonify({"statistic": total_length})         # Rückgabe der berechneten Gesamtlänge als JSON

