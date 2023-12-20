from stock_class import stock

import os

from datetime import datetime

import pandas_datareader.data as web

#New Concept:
#Use pandas data reader to extract data from alphavantage api
#Get each function (intraday, weekly, montly, ...) to spit out only the 
#x values, y-values
#Use flask to create the website.
# integrate your html with flask by passing the labels, values to the javascript.

#Required: symbol is a valid ticker symbol
def getIntradayData(symbol) :
    #const chart_data = await new stock_data('TIME_SERIES_INTRADAY', symbol).request_data();
    #const lastRefreshedDate = new Date(chart_data["Meta Data"]["3. Last Refreshed"]);
    #var startingDate = new Date(num_weekdays_ago_date(lastRefreshedDate, 1));
    #console.log(startingDate.getDate());
    #const timeSeries = chart_data["Time Series (5min)"];

    #// Find/put time/price data in seperate arrays in chronological order.
    #let timestamps = Object.keys(timeSeries).map(timestamp => new Date(timestamp));    
    #let closePrices = Object.values(timeSeries).map(entry => parseFloat(entry["4. close"]));

    #// Ensure that timeSeries and timestamps only contain data from one day.
    #const start_date_index = starting_date_index(timestamps, startingDate);
    #timestamps = timestamps.slice(0, start_date_index).reverse();
    #closePrices = closePrices.slice(0, start_date_index).reverse();

    data = web.DataReader(symbol, "av-intraday", start=datetime(2017, 2, 9),
                          end=datetime(2017, 5, 24),
                          api_key=os.getenv('ALPHAVANTAGE_API_KEY'))
        
}

