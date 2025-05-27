from flask import Flask, render_template, request, jsonify, make_response, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/symbolProcess', methods=['GET'])
def symbolProcess():
    global ticker_symbol  # Access the global variable
    ticker_symbol = request.args.get('symbol')

    #Check if data exists already:
    #filesStatus = 'DNE'
    #folder_path = 'local_database/'
    #intraday_filepath = os.path.join(folder_path, f'{ticker_symbol}_intraday.pkl')
    #overview_filepath = os.path.join(folder_path, f'{ticker_symbol}_overview.pkl')
    #if (os.path.exists(intraday_filepath) and os.path.exists(overview_filepath)):
    #    filesStatus = 'Exists'

    #if (api_callCount <= 23 or filesStatus == 'Exists') :
    #    return render_template("stock_info.html")
    #else :
    #    alert_message = "Daily API call limits have been reached. Only previously searched stocks may be analyzed."
    #    return render_template("index.html", alert_message = alert_message)

@app.route('/checkFile/<string:lengthTime>', methods=['GET'])
def checkFile(lengthTime):
    # global ticker_symbol
    global ticker_symbol

    folder_path = 'local_database/'
    filepath = os.path.join(folder_path, f'{ticker_symbol}_{lengthTime}.pkl')
    
    fileStatus = 'DNE'

    # Check if the file exists
    if (os.path.exists(filepath)):
        # Note all old files are removed when the server starts up so no need to check.
        fileStatus = 'Exists'
    
    response = make_response(fileStatus)
    return response