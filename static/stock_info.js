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
            //Convert timestamps to js date objects and adjust for eastern time.
            data['timestamps'] = data['timestamps'].map(timestamp => new Date(timestamp));
            data['timestamps'].forEach((timestamp, index) => {
                const currentHours = timestamp.getHours();
                timestamps[index] = new Date(timestamp.setHours(currentHours + 5));
            });
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // Rethrow the error for further handling
        });
}

// Function to display intraday line graph of stock data:
async function display_intraday_chart(){
    try {
        const chart_data = await getStockData('intraday');
        //console.log(chart_data)
        // timestamps = chart_data['timestamps'].map(timestamp => new Date(timestamp));
        // // Adjust hours to match UTD.
        // timestamps.forEach((timestamp, index) => {
        //     const currentHours = timestamp.getHours();
        //     timestamps[index] = new Date(timestamp.setHours(currentHours + 5));
        // });
        timestamps = chart_data['timestamps'];
        closePrices = chart_data['closePrices'];

        for (i = 0; i < timestamps.length; i++) {
            console.log(timestamps[i] + ": " + closePrices[i]);
        }

        // Create and display chart.
        const ctx = document.getElementById("StockChart").getContext("2d");

        // Destroy old chart if it exists:
        var pos = $(document).scrollTop();
        if (window.myChart) {
            window.myChart.destroy();
        }
        window.myChart = new Chart(ctx, {
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
            options: {
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
                            },
                            timezone: 'UTC'
                        },
                        title: {
                            display: true
                            //text: 'Time',
                        }
                    },
                    y: {
                        title: {
                            display: true
                            //text: 'Close Price',
                        }
                    }
                }
            }
        });
        $(document).scrollTop(pos);
    } catch (error) {
        console.error('Error displaying chart:', error);
    }
}

// Handle button clicks
// 1 Day Button:
document.getElementById('btn-1day').addEventListener('click', function () {
    display_intraday_chart();
});
// // 5 Days Button:
// document.getElementById('btn-5days').addEventListener('click', function () {
//     display_week_chart(tickerSymbol);
// });
// // 1 Month Button:
// document.getElementById('btn-1month').addEventListener('click', function () {
//     display_month_chart(tickerSymbol);
// });
// // YTD Button:
// document.getElementById('btn-ytd').addEventListener('click', function () {
//     display_ytd_chart(tickerSymbol);
// });
// // 1 Year Button:
// document.getElementById('btn-1year').addEventListener('click', function () {
//     display_oneYear_chart(tickerSymbol);
// });
// // 5 Year Button:
// document.getElementById('btn-5year').addEventListener('click', function () {
//     display_fiveYear_chart(tickerSymbol);
// });
// // All Time Button:
// document.getElementById('btn-allTime').addEventListener('click', function () {
//     display_allTime_chart(tickerSymbol);
// });

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

