from flask import Blueprint, request, jsonify
from controllers import UserService, ProductService

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

# routes for product actions
@api.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()

    if not data or data.get('vendor_netid') is None or data.get('name') is None or data.get('price') is None or data.get('category') is None:
        return jsonify({"error": "Missing required fields."}), 400
    
    response, status = ProductService.add_product(
        vendor_netid=data['vendor_netid'],
        name=data['name'],
        price=data['price'],
        category=data['category'],
        image_id=data.get('image_id')
    )
    return jsonify(response), status


@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    response, status = ProductService.get_product(product_id)
    return jsonify(response), status


@api.route('/products', methods=['GET'])
def get_all_products():
    response, status = ProductService.get_all_products()
    return jsonify(response), status



@api.route('/products/vendor/<string:vendor_netid>', methods=['GET'])
def get_products_by_vendor(vendor_netid):
    response, status = ProductService.get_products_by_vendor(vendor_netid)
    return jsonify(response), status


@api.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    response, status = ProductService.delete_product(product_id)
    return jsonify(response), status


@api.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided."}), 400
    response, status = ProductService.update_product(
        product_id,
        name=data.get('name'),
        price=data.get('price'),
        category=data.get('category'),
        image_id=data.get('image_id')
    )
    return jsonify(response), status