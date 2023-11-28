from flask import Blueprint, jsonify, request

api = Blueprint('api', __name__)

@api.route('/api/upload_data', methods=["POST"])
def process_user_data():
    user_data = request.get_json(force=True)
    client_ip = request.remote_addr
    print(user_data)

@api.route('/api/get_user_statistic', methods=["GET"])
def get_user_statistic():
    # Carmela
    pass

