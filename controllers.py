from database import get_user_by_netid, insert_user, update_user
from database import delete_product, add_product, get_products_by_id, get_all_products, get_products_by_vendor, update_product


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
    def add_product(vendor_netid, name, price, category, image_id=None):
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
        return product, 200
    
    @staticmethod
    def get_all_products():
        products = get_all_products()
        return products, 200
    
    @staticmethod
    def get_products_by_vendor(vendor_netid):
        products = get_products_by_vendor(vendor_netid)
        return products, 200
    
    @staticmethod
    def delete_product(product_id):
        success = delete_product(product_id)
        if success:
            return {"message": "Product deleted successfully."}, 200
        else:
            return {"error": "Failed to delete product."}, 500
        
    @staticmethod
    def update_product(product_id, name=None, price=None, category=None, image_id=None):
        success = update_product(product_id, name, price, category, image_id)
        if success:
            return {"message": "Product updated successfully."}, 200
        else:
            return {"error": "Failed to update product."}, 500