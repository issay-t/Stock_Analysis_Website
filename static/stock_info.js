// Function that gets stock data from backend.
// Required: lengthTime must be: intraday, weekly, monthly, ...
function getStockData(lengthTime) {
    const callMessage = '/getData/' + lengthTime;
    //console.log(callMessage);

    return fetch(callMessage)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // Rethrow the error for further handling
        });
}

// Class that assists in creating functions to display different charts.
class create_chart {
    constructor(lengthTime, options){
        this.lengthTime = lengthTime;
        this.options = options;
    }

    // Function to display the chart.
    async displayChart(){
        try {
            const chart_data = await getStockData(this.lengthTime);
            // console.log(chart_data['timestamps']);
            // console.log(chart_data['closePrices']);
            var timestamps = chart_data['timestamps'].map(timestamp => new Date(timestamp));
            // Adjust hours to match UTD.
            timestamps.forEach((timestamp, index) => {
                const currentHours = timestamp.getHours();
                timestamps[index] = new Date(timestamp.setHours(currentHours + 5));
            });
            //timestamps = chart_data['timestamps'];
            var closePrices = chart_data['closePrices'];
            //console.log("Up to here.");
            // for (var i = 0; i < closePrices.length; i++) {
            //     console.log(timestamps[i] + ': ' + closePrices[i]);
            // }
        
            // Create and display chart.
            const ctx = document.getElementById("StockChart").getContext("2d");
    
            // Destroy old chart if it exists:
            var pos = $(document).scrollTop();
            if (window.myChart) {
                window.myChart.destroy();
            }
            var windowSettings = {
                type: "line",
                data: {
                    labels: timestamps,
                    datasets: [{
                        label: "Close Prices",
                        data: closePrices,
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {}
            }
            windowSettings['options'] = this.options;
            window.myChart = new Chart(ctx, windowSettings);
            $(document).scrollTop(pos);
        } catch (error) {
            console.error('Error displaying chart:', error);
        }
    }
}

//Function to display intraday line graph of stock data:
async function display_intraday_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: 'Intraday Close Prices:',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        },
        scales: {
            x: {
                type: 'timeseries',
                time: {
                    unit: 'hour', // Display time only
                    tooltipFormat: 'h:mm a', // Format for tooltips
                    displayFormats: {
                        hour: 'h:mm a', // Format for the x-axis labels
                    }
                }
            }
        }
    }
    const chart = await new create_chart('intraday', options);
    chart.displayChart();
}

async function display_week_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: '5-Day Trailing Close Prices:',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        },
        scales: {
            x: {
                type: 'timeseries',
                time: {
                    unit: 'day', // Display time only
                    tooltipFormat: 'MMM d, h:mm a', // Format for tooltips
                    displayFormats: {
                        day: 'MMM d', // Format for the x-axis labels
                    }
                },
                ticks: {
                    source: 'data', // Automatically calculate the ticks based on the data range
                }
            }
        }
    }
    const chart = await new create_chart('weekly', options);
    chart.displayChart();
}

async function display_month_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: ' 1 Month Trailing Close Prices:',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        },
        scales: {
            x: {
                type: 'timeseries',
                time: {
                    unit: 'day', // Display time only
                    tooltipFormat: 'MMM d', // Format for tooltips
                    displayFormats: {
                        day: 'MMM d', // Format for the x-axis labels
                    }
                },
                ticks: {
                    source: 'data',
                    maxTicksLimit: 6, // to make x-axis less crowded.
                    autoSkip: true
                }
            }
        }
    }
    const chart = await new create_chart('monthly', options);
    chart.displayChart();
}

async function display_ytd_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: 'YTD Close Prices:',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        },
        scales: {
            x: {
                type: 'timeseries',
                time: {
                    unit: 'day', // Display time only
                    tooltipFormat: 'MMM d, y', // Format for tooltips
                    displayFormats: {
                        day: 'MMM', // Format for the x-axis labels
                    }
                },
                ticks: {
                    source: 'data',
                    maxTicksLimit: 5, // to make x-axis less crowded.
                    autoSkip: true
                }
            }
        }
    }
    const chart = await new create_chart('ytd', options);
    chart.displayChart();
}

async function display_oneYear_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: '1 Year Close Prices: ',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        },
        scales: {
            x: {
                type: 'timeseries',
                time: {
                    unit: 'day', // Display time only
                    tooltipFormat: 'MMM d, y', // Format for tooltips
                    displayFormats: {
                        day: 'MMM', // Format for the x-axis labels
                    }
                },
                ticks: {
                    source: 'data',
                    maxTicksLimit: 5, // to make x-axis less crowded.
                    autoSkip: true
                }
            }
        }
    }
    const chart = await new create_chart('year', options);
    chart.displayChart();
}

async function display_fiveYear_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: '5 Year Close Prices: ',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        },
        scales: {
            x: {
                type: 'timeseries',
                time: {
                    unit: 'day', // Display time only
                    tooltipFormat: 'MMM d, y', // Format for tooltips
                    displayFormats: {
                        day: 'y', // Format for the x-axis labels
                    }
                },
                ticks: {
                    source: 'data',
                    maxTicksLimit: 5, // to make x-axis less crowded.
                    autoSkip: true
                }
            }
        }
    }
    const chart = await new create_chart('5year', options);
    chart.displayChart();
}

async function display_allTime_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: 'All Time Close Prices: ',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        },
        scales: {
            x: {
                type: 'timeseries',
                time: {
                    unit: 'day', // Display time only
                    tooltipFormat: 'MMM d, y', // Format for tooltips
                    displayFormats: {
                        day: 'y', // Format for the x-axis labels
                    }
                },
                ticks: {
                    source: 'data',
                    maxTicksLimit: 5, // to make x-axis less crowded.
                    autoSkip: true
                }
            }
        }
    }
    const chart = await new create_chart('allTime', options);
    chart.displayChart();
}
   
// Handle button clicks
// 1 Day Button:
document.getElementById('btn-1day').addEventListener('click', function () {
    display_intraday_chart();
});
// 5 Days Button:
document.getElementById('btn-5days').addEventListener('click', function () {
    display_week_chart();
});
// 1 Month Button:
document.getElementById('btn-1month').addEventListener('click', function () {
    display_month_chart();
});
// YTD Button:
document.getElementById('btn-ytd').addEventListener('click', function () {
    display_ytd_chart();
});
// 1 Year Button:
document.getElementById('btn-1year').addEventListener('click', function () {
    display_oneYear_chart();
});
// 5 Year Button:
document.getElementById('btn-5year').addEventListener('click', function () {
    display_fiveYear_chart();
});
// // All Time Button:
document.getElementById('btn-allTime').addEventListener('click', function () {
    display_allTime_chart();
});

// Basic EventListener for when stock_info.html first loads:
document.addEventListener('DOMContentLoaded', function() {
    // // EDIT: TO VALIDATE TICKER SYMBOL
    // if (!tickerSymbol) {
    //     // Redirect to the index.html if no ticker symbol is provided
    //     window.location.href = 'index.html';
    // }
    // Display title of stock.
    //document.getElementById('title').innerText = tickerSymbol;

    // Display overview of company fundamentals:
    //display_overview(tickerSymbol);
    // Display intraday graph:
    display_intraday_chart();
})

