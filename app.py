import os
import time
from flask import Flask
from dotenv import load_dotenv
from routes import api

# Load environment variable
load_dotenv()
app = Flask(__name__)



app.register_blueprint(api)