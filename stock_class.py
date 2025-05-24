import requests
from config import api_key

class stock:
    def __init__(self, symbol, function, interval='5min', outputsize='compact', extended_hours='false'):
        self.symbol = symbol
        self.function = function
        self.interval = interval
        self.outputsize = outputsize
        self.extended_hours = extended_hours
    def get_data(self):
        url = "https://www.alphavantage.co/query?"
        url += "function=" + self.function + "&symbol=" + self.symbol + "&interval=" + self.interval
        url += "&outputsize=" + self.outputsize + "&extended_hours=" + self.extended_hours
        url += "&apikey=" + api_key
        r = requests.get(url)
        data = r.json()
        return data
