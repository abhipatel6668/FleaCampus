import os
import pymysql
from dotenv import load_dotenv

# Load environment variable
load_dotenv()


def get_connection():
    """Create and return a new database connection."""
    return pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )



# user related database operations
def get_user_by_netid(netid):
    dbconn = get_connection()
    with dbconn:
        with dbconn.cursor() as cursor:
            sql = "SELECT * FROM `users` WHERE `netid`=%s"
            cursor.execute(sql, (netid,))
            result = cursor.fetchone()
            return result
    return None
        

def insert_user(netid, email, phone=None):
    dbconn = get_connection()
    with dbconn:
        with dbconn.cursor() as cursor:
            sql = "INSERT INTO `users` (`netid`, `email`, `phone`) VALUES (%s, %s, %s)"
            cursor.execute(sql, (netid, email, phone))
        dbconn.commit()
        return True
    return False

def update_user(netid, email=None, phone=None):
    dbconn = get_connection()
    with dbconn:
        with dbconn.cursor() as cursor:
            fields = []
            values = []
            if email:
                fields.append("email=%s")
                values.append(email)
            if phone:
                fields.append("phone=%s")
                values.append(phone)
            values.append(netid)
            sql = f"UPDATE `users` SET {', '.join(fields)} WHERE `netid`=%s"
            cursor.execute(sql, tuple(values))
        dbconn.commit()
        return True
    return False



# product related database functions

def add_product(vendor_netid, name, price, category, image_id=None):
    dbconn = get_connection()
    with dbconn:
        with dbconn.cursor() as cursor:
            sql = """INSERT INTO `products` 
                     (`vendor_netid`, `name`, `price`, `category`, `image_id`) 
                     VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(sql, (vendor_netid, name, price, category, image_id))
        dbconn.commit()
        return True
    return False


def get_products_by_id(product_id):
    dbconn = get_connection()
    with dbconn:
        with dbconn.cursor() as cursor:
            sql = "SELECT * FROM `products` WHERE `product_id`=%s"
            cursor.execute(sql, (product_id,))
            result = cursor.fetchone()
            return result
    return None

def get_all_products():
    dbconn = get_connection()
    with dbconn:
        with dbconn.cursor() as cursor:
            sql = "SELECT * FROM `products` ORDER BY `created_at` DESC"
            cursor.execute(sql)
            result = cursor.fetchall()
            return result
    return []

def get_products_by_vendor(vendor_netid):
    dbconn = get_connection()
    with dbconn:
        with dbconn.cursor() as cursor:
            sql = "SELECT * FROM `products` WHERE `vendor_netid`=%s ORDER BY `created_at` DESC"
            cursor.execute(sql, (vendor_netid,))
            result = cursor.fetchall()
            return result
    return []


def delete_product(product_id):
    dbconn = get_connection()
    with dbconn:
        with dbconn.cursor() as cursor:
            sql = "DELETE FROM `products` WHERE `product_id`=%s"
            cursor.execute(sql, (product_id,))
        dbconn.commit()
        return True
    return False

def update_product(product_id, name=None, price=None, category=None, image_id=None):
    dbconn = get_connection()
    with dbconn:
        with dbconn.cursor() as cursor:
            fields = []
            values = []
            if name:
                fields.append("name=%s")
                values.append(name)
            if price:
                fields.append("price=%s")
                values.append(price)
            if category:
                fields.append("category=%s")
                values.append(category)
            if image_id:
                fields.append("image_id=%s")
                values.append(image_id)
            values.append(product_id)
            sql = f"UPDATE `products` SET {', '.join(fields)} WHERE `product_id`=%s"
            cursor.execute(sql, tuple(values))
        dbconn.commit()
        return True
    return False

# image related database functions

def add_image(img_url, time_stamp = None):
    dbconn = get_connection()
    with dbconn:
        with dbconn.cursor() as cursor:
            sql = """INSERT INTO `images` 
                     (`image_url`, `created_at`) 
                     VALUES (%s, %s)"""
            cursor.execute(sql, (img_url, time_stamp))
        dbconn.commit()
        return True
    return False
