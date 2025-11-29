from database import get_user_by_netid, insert_user, update_user
from database import delete_product, add_product, get_products_by_id, get_all_products, get_products_by_vendor, update_product
from database import add_order, get_orders_by_user
from database import add_image_and_get_id


class UserService:
    @staticmethod
    def get_user(netid):
        user = get_user_by_netid(netid)
        if not user:
            return {"error": "User not found."}, 404
        
        return user, 200
    
    @staticmethod
    def create_user(netid, email, phone=None):
        user = UserService.get_user(netid)
        if user[1] == 200:
            return {"error": "User already exists."}, 400
        # no password hashing for simplicity
        success = insert_user(netid, email, phone)
        if success:
            return {"message": "User created successfully."}, 201
        else:
            return {"error": "Failed to create user."}, 500
        
    @staticmethod
    def update_user(netid, email=None, phone=None):
        if not UserService.get_user(netid)[1] == 200:
            return {"error": "User not found."}, 404
        
        success = update_user(netid, email, phone)
        if success:
            return {"message": "User updated successfully."}, 200
        else:
            return {"error": "Failed to update user."}, 500
        


# product related services can be added here
class ProductService:
    @staticmethod
    def add_product(vendor_netid, name, price, category, image_url=None):
        image_id = None
        if image_url:
            image_id = add_image_and_get_id(image_url)
        success = add_product(vendor_netid, name, price, category, image_id)
        if success:
            return {"message": "Product added successfully."}, 201
        else:
            return {"error": "Failed to add product."}, 500
        
    @staticmethod
    def get_product(product_id):
        product = get_products_by_id(product_id)
        if not product:
            return {"error": "Product not found."}, 404
        if product.get('price'):
            product['price'] = float(product['price'])
        return product, 200
    
    @staticmethod
    def get_all_products():
        products = get_all_products()
        for product in products:
            if product.get('price'):
                product['price'] = float(product['price'])
        return products, 200
    
    @staticmethod
    def get_products_by_vendor(vendor_netid):
        products = get_products_by_vendor(vendor_netid)
        for product in products:
            if product.get('price'):
                product['price'] = float(product['price'])
        return products, 200
    
    @staticmethod
    def delete_product(product_id):
        success = delete_product(product_id)
        if success:
            return {"message": "Product deleted successfully."}, 200
        else:
            return {"error": "Failed to delete product."}, 500
        
    @staticmethod
    def update_product(product_id, name=None, price=None, category=None, image_url=None):
        image_id = None
        if image_url:
            image_id = add_image_and_get_id(image_url)
        success = update_product(product_id, name, price, category, image_id)
        if success:
            return {"message": "Product updated successfully."}, 200
        else:
            return {"error": "Failed to update product."}, 500
        
# order related services can be added here
class OrderService:
    @staticmethod
    def create_order(user_id, product_id):
        if not get_user_by_netid(user_id):
            return {"error": "User not found."}, 404
        if not get_products_by_id(product_id):
            return {"error": "Product not found."}, 404

        success = add_order(user_id, product_id)
        if success:
            return {"message": "Order created successfully."}, 201
        else:
            return {"error": "Failed to create order."}, 500

    @staticmethod
    def get_orders_by_user(user_id):
        if not get_user_by_netid(user_id):
            return {"error": "User not found."}, 404
        
        orders = get_orders_by_user(user_id)
        return orders, 200
