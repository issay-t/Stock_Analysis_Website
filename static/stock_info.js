// Function that gets stock data from backend.
// Required: lengthTime must be: intraday, weekly, monthly, ... or overview.
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

// Function that gets UTD API call count from backend.
function getAPICount() {
    const callMessage = '/getAPICount';
    //console.log(callMessage);

    return fetch(callMessage)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); 
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // Rethrow the error for further handling
        });
}

// Function that displays the call count:
async function displayCallCount() {
    try {
        var count = await getAPICount();
        console.log('API Count:', count);
        document.getElementById('CallCount').innerText = "Current API Call Count - " + count + 
        ", Daily Limit - 25";
        CallCount.classList.add('CallCount');
    } catch(error) {
        console.error('Error fetching API count:', error);
    } 
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
            //console.log("Returning promise");
            return Promise.resolve();
        } catch (error) {
            console.error('Error displaying chart:', error);
            return Promise.reject(error);
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
                color: 'black',
                font: {
                    size: 20
                },
                padding: {
                    top: 20,
                    bottom: 20
                }
            }
        },
        scales: {
            x: {
                type: 'timeseries',
                time: {
                    unit: 'hour', // Display time only
                    tooltipFormat: 'MMM d, h:mm a', // Format for tooltips
                    displayFormats: {
                        hour: 'h:mm a', // Format for the x-axis labels
                    }
                }
            }
        }
    }
    const chart = await new create_chart('intraday', options);
    return new Promise(async (resolve) => {
        await chart.displayChart();
        //console.log("Good up to here.");
        resolve();
    });
}

async function display_week_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: '5-Day Trailing Close Prices:',
                color: 'black',
                font: {
                    size: 20
                },
                padding: {
                    top: 20,
                    bottom: 20
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
    return new Promise(async (resolve) => {
        await chart.displayChart();
        //console.log("Good up to here.");
        resolve();
    });
}

async function display_month_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: ' 1 Month Trailing Close Prices:',
                color: 'black',
                font: {
                    size: 20
                },
                padding: {
                    top: 20,
                    bottom: 20
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
    return new Promise(async (resolve) => {
        await chart.displayChart();
        //console.log("Good up to here.");
        resolve();
    });
}

async function display_ytd_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: 'YTD Close Prices:',
                color: 'black',
                font: {
                    size: 20
                },
                padding: {
                    top: 20,
                    bottom: 20
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
    return new Promise(async (resolve) => {
        await chart.displayChart();
        //console.log("Good up to here.");
        resolve();
    });
}

async function display_oneYear_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: '1 Year Close Prices: ',
                color: 'black',
                font: {
                    size: 20
                },
                padding: {
                    top: 20,
                    bottom: 20
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
    return new Promise(async (resolve) => {
        await chart.displayChart();
        //console.log("Good up to here.");
        resolve();
    });
}

async function display_fiveYear_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: '5 Year Close Prices: ',
                color: 'black',
                font: {
                    size: 20
                },
                padding: {
                    top: 20,
                    bottom: 20
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
    return new Promise(async (resolve) => {
        await chart.displayChart();
        //console.log("Good up to here.");
        resolve();
    });
}

async function display_allTime_chart(){
    var options = {
        plugins: {
            title: {
                display: true,
                text: 'All Time Close Prices: ',
                color: 'black',
                font: {
                    size: 20
                },
                padding: {
                    top: 20,
                    bottom: 20
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
    return new Promise(async (resolve) => {
        await chart.displayChart();
        //console.log("Good up to here.");
        resolve();
    });
}

async function display_overview() {
    try {
        const overview_data = await getStockData("overview");

        // Display title:
        document.getElementById('title').innerText = overview_data["Name"] + ' (' + overview_data["Symbol"] + ')';
        // Apply styles dynamically after adding content
        title.classList.add('title');

        // Display smaller info on stock:
        document.getElementById('sub_info').innerText = overview_data["Exchange"] + ': ' + overview_data["Symbol"] +
            ' - AlphaVantage 1D Delayed Trading Prices - ' + overview_data["Currency"];
        sub_info.classList.add('sub_info');

        // Display description of company:
        document.getElementById('company_description').innerText = overview_data["Description"];
        company_description.classList.add('company_description');

    } catch(error){
        console.error('Error displaying overview data:', error);
    }
}
   
// Handle button clicks
// 1 Day Button:
document.getElementById('btn-1day').addEventListener('click', function () {
    display_intraday_chart().then(() => {
        displayCallCount();
    });
});
// 5 Days Button:
document.getElementById('btn-5days').addEventListener('click', function () {
    //display_week_chart();
    display_week_chart().then(() => {
        displayCallCount();
    });
});

// 1 Month Button:
document.getElementById('btn-1month').addEventListener('click', function () {
    //display_month_chart();
    display_month_chart().then(() => {
        displayCallCount();
    });
});
// YTD Button:
document.getElementById('btn-ytd').addEventListener('click', function () {
    //display_ytd_chart();
    display_ytd_chart().then(() => {
        displayCallCount();
    });
});
// 1 Year Button:
document.getElementById('btn-1year').addEventListener('click', function () {
    //display_oneYear_chart();
    display_oneYear_chart().then(() => {
        displayCallCount();
    });
});
// 5 Year Button:
document.getElementById('btn-5year').addEventListener('click', function () {
    //display_fiveYear_chart();
    display_fiveYear_chart().then(() => {
        displayCallCount();
    });
});
// // All Time Button:
document.getElementById('btn-allTime').addEventListener('click', function () {
    //display_allTime_chart();
    display_allTime_chart().then(() => {
        displayCallCount();
    });
});

// // Get all elements with the class "button"
// const buttons = document.querySelectorAll('.button');
// // Add a click event listener to each button
// buttons.forEach(button => {
//     button.addEventListener('click', function() {
//         displayCallCount();
//     });
// });

// Basic EventListener for when stock_info.html first loads:
document.addEventListener('DOMContentLoaded', async function() {
    // Usage example
    //displayCallCount();
    // Display overview of company fundamentals:
    await display_overview();
    // Display intraday graph:
    await display_intraday_chart();
    console.log("Will display call Count");
    await displayCallCount();
})

