from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from process_data import *
import os

app = Flask(__name__)

# Declare global variables:
load_dotenv() # Load environment variables from .env file
api_key = os.getenv('ALPHA_VANTAGE_API_KEY') # Access the API key
ticker_symbol = 'AAPL' #Set as default until user changes it.

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/symbolProcess', methods=['GET'])
def symbolProcess():
    global ticker_symbol  # Access the global variable
    ticker_symbol = request.args.get('ticker_symbol')

@app.route('/stock_info.html')
def stock_info():
    return render_template("stock_info.html")

@app.route('/getData/<string:lengthTime>', methods=['GET'])
def send_data(lengthTime):
    global ticker_symbol  # Access the global ticker_symbol set previously

    # Call the backend function to get new data based on the ticker symbol
    if (lengthTime == "intraday") :
        return jsonify(getIntradayData(ticker_symbol))
    elif (lengthTime == "weekly") :
        return jsonify(getWeeklyData(ticker_symbol))
    elif (lengthTime == "monthly") :
        return jsonify(getMonthlyData(ticker_symbol))
    elif (lengthTime == "ytd") :
        return jsonify(getYTDData(ticker_symbol))
    elif (lengthTime == "year") :
        return jsonify(getOneYearData(ticker_symbol))
    elif (lengthTime == "5year") :
        return jsonify(getFiveYearData(ticker_symbol))

if __name__ == '__main__':
    app.run(debug=True)
    