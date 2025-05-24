import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file
api_key = os.getenv('API_KEY') # Access the API key