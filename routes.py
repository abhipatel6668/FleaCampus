from flask import Blueprint, request, jsonify
from controllers import UserService

api = Blueprint('api', __name__, url_prefix='/api')

# routes for user actions
@api.route('/users/<string:netid>', methods=['GET'])
def get_user(netid):
    response, status = UserService.get_user(netid)
    return jsonify(response), status

@api.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if  not data or data.get('netid') is None or data.get('email') is None:
        return jsonify({"error": "Missing required fields."}), 400
    response, status = UserService.create_user(
        netid=data['netid'],
        email=data['email'],
        phone=data.get('phone')
    )
    return jsonify(response), status


@api.route('/users/<string:netid>', methods=['PUT'])
def update_user(netid):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided."}), 400
    response, status = UserService.update_user(
        netid,
        email=data.get('email'),
        phone=data.get('phone')
    )
    return jsonify(response), status