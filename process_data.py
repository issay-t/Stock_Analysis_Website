import requests
from app import api_key

class stock:
    def __init__(self, symbol, function, interval):
        self.symbol = symbol
        self.function = function
        self.interval = interval
    def get_data(self):
        url = "https://www.alphavantage.co/query?"
        url = url + "function=" + self.function + "&symbol=" + self.symbol + "&interval=" + self.interval + "&apikey=" + api_key
        r = requests.get(url)
        data = r.json()
        return data

def print_stock_info(stock): 
    print(stock.get_data())

apple = stock("IBM", "TIME_SERIES_INTRADAY", "5min")
print_stock_info(apple)