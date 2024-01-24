from flask import Flask, render_template, request, jsonify, make_response
from dotenv import load_dotenv
from process_data import *
from datetime import datetime
import os
import pickle


app = Flask(__name__)

# Declare global variables:
load_dotenv() # Load environment variables from .env file
api_key = os.getenv('ALPHA_VANTAGE_API_KEY') # Access the API key
ticker_symbol = 'AAPL' #Set as default until user changes it.
api_callCount = 0

# Function to get rid of outdated files in the local database.
def resetDataBase() :
    global api_callCount

    folder_path = 'local_database/'
    # List all files in the folder
    files = os.listdir(folder_path)

    # Iterate through each file
    for file_name in files:
        # Get the full path of the file
        filepath = os.path.join(folder_path, file_name)

        # Check if the path is a file (not a subdirectory)
        file_modified_time = datetime.fromtimestamp(os.path.getmtime(filepath))
        current_time = datetime.now()

        # If file is old remove it.
        if (current_time.date() != file_modified_time.date()):
           os.remove(filepath)
        else:
            api_callCount = api_callCount + 1

#Reset database when server runs.
resetDataBase()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/symbolProcess', methods=['GET'])
def symbolProcess():
    global ticker_symbol  # Access the global variable
    ticker_symbol = request.args.get('symbol')
    return render_template("stock_info.html")

@app.route('/getAPICount', methods=['GET'])
def send_apiCount():
    global api_callCount
    # folder_path = 'local_database/'
    # files = os.listdir(folder_path)
    
    response = make_response(str(api_callCount))
    return response

@app.route('/getData/<string:lengthTime>', methods=['GET'])
def send_data(lengthTime):
    global ticker_symbol  # Access the global ticker_symbol set previously
    global local_data
    global api_callCount

    # Specify the folder to store the files
    folder_path = 'local_database/'
    filepath = os.path.join(folder_path, f'{ticker_symbol}_{lengthTime}.pkl')

    # Check if the file exists
    if (os.path.exists(filepath)):
        # Note all old files are removed when the server starts up so no need to check.
        with open(filepath, 'rb') as file:
                cached_data = pickle.load(file)
                return jsonify(cached_data)
            
    # Else the file does not exist. Request new information.
    # Call the backend function to get new data based on the ticker symbol 
    # and save information into a file.
    stock_info = None
    if (lengthTime == "intraday") :
        stock_info = getIntradayData(ticker_symbol)
    elif (lengthTime == "weekly") :
        stock_info = getWeeklyData(ticker_symbol)
    elif (lengthTime == "monthly") :
        stock_info = getMonthlyData(ticker_symbol)
    elif (lengthTime == "ytd") :
        stock_info = getYTDData(ticker_symbol)
    elif (lengthTime == "year") :
        stock_info = getOneYearData(ticker_symbol)
    elif (lengthTime == "5year") :
        stock_info = getFiveYearData(ticker_symbol)
    elif (lengthTime == "allTime") :
        stock_info = getAllTimeData(ticker_symbol)
    else: 
        stock_info = getOverview(ticker_symbol)

    # Save the extracted python data to a pickle file in the local database.
    with open(filepath, 'wb') as file:
        pickle.dump(stock_info, file)

    # Update api_callCount
    api_callCount = api_callCount + 1

    return jsonify(stock_info)

if __name__ == '__main__':
    app.run(debug=True)
    