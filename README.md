# Stock_Analysis_Website

Flask app which allows you to analyze stock close prices given a ticker-symbol over various time periods.
Information is requested using the free version of AlphaVantage API - allows 25 requests per day.
Designed a local data base which saves user requested data in files, such that if 
they request the same graph twice it won't waste an API call. The data base is reset every day as 
the stock information is new everyday. 







