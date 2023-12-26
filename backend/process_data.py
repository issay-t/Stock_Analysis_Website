from stock_class import stock
from datetime import datetime

#New Concept:
#Use pandas data reader to extract data from alphavantage api
#Get each function (intraday, weekly, montly, ...) to spit out only the 
#x values, y-values
#Use flask to create the website.
# integrate your html with flask by passing the labels, values to the javascript.

class processData :
    def __init__(self, stock, numdays = 0, dtf = "%Y-%m-%d %H:%M:%S", typePrice = "4. close"):
        self.stock = stock
        self.numdays = numdays
        self.dtf = dtf
        self.typePrice = typePrice

    def getChartData(self) :
        chart_data = self.stock.get_data()
        # Extract start date of the data set for reference.
        last_refreshed_date = chart_data['Meta Data']['3. Last Refreshed'].split()[0]
        
        # Put timestamps and closePrices (x/y values) into separate arrays.
        timestamps = []
        closePrices = []
        keyIdentifier = list(chart_data.keys())[1] # Ex. "Time Series (5min)"
        currentNumDays = 1
        tempCurrDate = last_refreshed_date
        for time, price in chart_data[keyIdentifier].items() :
            date = time.split()[0]
            if (date != tempCurrDate) :
                tempCurrDate = date
                currentNumDays = currentNumDays + 1

            if (currentNumDays <= self.numdays) :
                # Convert string to datetime object
                timestamps.insert(0,datetime.strptime(time, self.dtf))
                closePrices.insert(0, price[self.typePrice])
            else :
                break
        return [timestamps, closePrices]
    def getYTDChartData(self) :
        chart_data = self.stock.get_data()
        # Extract start date of the data set for reference.
        last_refreshed_date = chart_data['Meta Data']['3. Last Refreshed'].split()[0]
        
        # Put timestamps and closePrices (x/y values) into separate arrays.
        timestamps = []
        closePrices = []
        keyIdentifier = list(chart_data.keys())[1] # Ex. "Time Series (5min)"
        for time, price in chart_data[keyIdentifier].items() :
            date = time.split()[0]
            if (datetime.strptime(date, "%Y-%m-%d").year() == 
                datetime.strptime(last_refreshed_date, "%Y-%m-%d").year()) :
                # Convert string to datetime object
                timestamps.insert(0,datetime.strptime(time, "%Y-%m-%d"))
                closePrices.insert(0, price[self.typePrice])
            else :
                break
        return [timestamps, closePrices]

# Required: symbol is a valid ticker symbol
# Returns an array containing [timestamps, closePrices].
def getIntradayData(symbol) :
    currStock = stock(symbol, 'TIME_SERIES_INTRADAY')
    return processData(currStock, 1).getChartData()

def getWeeklyData(symbol) :
    currStock = stock(symbol, 'TIME_SERIES_INTRADAY', '5min', 'full')
    return processData(currStock, 5).getChartData()

def getMonthlyData(symbol) :
    currStock = stock(symbol, 'TIME_SERIES_DAILY')
    return processData(currStock, 21, "%Y-%m-%d").getChartData()

def getYTDData(symbol) :
    currStock = stock(symbol, 'TIME_SERIES_DAILY', '5min', 'full')
    return processData(currStock, dtf = "%Y-%m-%d").getYTDChartData()

def getOneYearData(symbol) :
    currStock = stock(symbol, 'TIME_SERIES_DAILY', '5min', 'full')
    return processData(currStock, 260, "%Y-%m-%d").getChartData()

def getFiveYearData(symbol) :
    currStock = stock(symbol, 'TIME_SERIES_WEEKLY_ADJUSTED')
    return processData(currStock, 262, "%Y-%m-%d", "5. adjusted close").getChartData()

# symbol = 'AAPL'
# data = getFiveYearData(symbol)
# xvalues = data[0]
# yvalues = data[1]
# print(len(xvalues))
# for i in range(len(xvalues)) :
#     print(xvalues[i].strftime("%Y-%m-%d") + " : " + yvalues[i])
