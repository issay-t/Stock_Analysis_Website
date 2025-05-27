/*
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
*/

// Function that checks if the file wanted exists in the external database.
// Required: lengthTime must be: intraday, weekly, monthly, ... or overview.
// Will return true or false;
function checkFile(lengthTime) {
    const callMessage = '/checkFile/' + lengthTime;
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

// Function to handle general button clicks
function handleButtonClick(chartDisplayFunction, buttonId, lengthTime) {
    document.getElementById(buttonId).addEventListener('click', async function () {
        //var count = parseInt(await getAPICount());
        //console.log("up to here");
        var fileExists = await checkFile(lengthTime);
        //console.log("Now up to here");
        if (fileExists == 'Exists') {
            //await chartDisplayFunction();
            //displayCallCount();
        } else {
            alert("API Call Limit Reached. Please try again later.");
        }
    });
}

// Handle button clicks
// // 1 Day Button:
handleButtonClick(display_intraday_chart, 'btn-1day', 'intraday');
// 5 Days Button:
handleButtonClick(display_week_chart, 'btn-5days', 'weekly');
// 1 Month Button:
handleButtonClick(display_month_chart, 'btn-1month', 'monthly');
// YTD Button:
handleButtonClick(display_ytd_chart, 'btn-ytd', 'ytd');
// 1 Year Button:
handleButtonClick(display_oneYear_chart, 'btn-1year', 'year');
// 5 Year Button:
handleButtonClick(display_fiveYear_chart, 'btn-5year', '5year');
// // All Time Button:
handleButtonClick(display_allTime_chart, 'btn-allTime', 'allTime');

// Basic EventListener for when stock_info.html first loads:
document.addEventListener('DOMContentLoaded', async function() {
    // Display overview of company fundamentals:
    //await display_overview();
    // Display intraday graph:
    await display_intraday_chart();
    //console.log("Will display call Count");
    //await displayCallCount();
})