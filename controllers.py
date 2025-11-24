from database import get_user_by_netid, insert_user, update_user


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