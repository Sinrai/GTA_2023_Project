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

@api.route('/api/get_user_statistic', methods=["GET"])
def get_user_statistic():
    # Carmela stuff here (if done with flask)
    return jsonify("statistic")

