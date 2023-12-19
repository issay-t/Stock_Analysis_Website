#from flask import Flask
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access the API key
api_key = os.getenv('ALPHA_VANTAGE_API_KEY')

print(api_key)