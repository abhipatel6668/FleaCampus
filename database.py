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