from flask import Flask, render_template
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
# Access the API key
api_key = os.getenv('ALPHA_VANTAGE_API_KEY')

app = Flask(__name__)
