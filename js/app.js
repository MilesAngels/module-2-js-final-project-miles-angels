const globalVars = {
    currentPage: window.location.pathname,
    api: {
        apiURL: 'https://api.nasa.gov',
        apiKey: 'fs6RHwXud5zkYO58zcIHVBfKA2bGE5FLloRmVSJo',
        categories: {
            pod: '/planetary/apod',
            neows: '/neo/rest/v1/feed'
        },
        date: ''
    }

}

// displayApodData Async Function
async function displayApodData(start, end) {
    //console.log(start)

    if (start !== undefined && end !== '') {
        resetUI();
        displayApodRange(start, end);
    }
    else if (start !== '' && start !== undefined) {
        resetUI();
        displayApodStart(start);

    }
    else {
        displayApod();

    }

    resetUI();


}

// Display picture of the Day
async function displayApod() {
    let response = await fetch(`${globalVars.api.apiURL}${globalVars.api.categories.pod}?api_key=${globalVars.api.apiKey}`);
    let apod = await response.json();
    console.log(apod);
    const card = document.createElement('div');
    card.classList = 'card border border-0 mt-5';

    card.innerHTML = `
                <div class="card-body container">
                    <div class="row">
                        <div class="col-12 col-md-6">
                        ${apod.media_type === 'image'
            // If media type is image
            ? `<img
                                    class="card-img mb-5 img-fluid"
                                    src="${apod.url}"
                                    alt="${apod.title}"
                                    />`
            // If media type is video
            : `<div class="ratio ratio-16x9">
                                        <iframe src="${apod.url} title="${apod.title}" allowfullscreen" ></iframe>
                                    </div>`
        }
                        
                        </div>
                        <div class="col-12 col-md-6">
                        <h2 class="card-title mb-4">${apod.title}</h2>
                        <p class="card-text">
                            Featured Date: ${apod.date}
                        </p>
                        <p class="card-text">
                            ${apod.explanation}
                        </p>
                        </div>
                    </div>
                </div>
                `;

    document.getElementById('apod-content').appendChild(card);
}

// Display picture of the Day that user chose
async function displayApodRange(start, end) {
    let response = await fetch(`${globalVars.api.apiURL}${globalVars.api.categories.pod}?api_key=${globalVars.api.apiKey}&start_date=${start}&end_date=${end}`);
    let apod = await response.json();
    console.log(apod.url);
    for (let i = 0; i < apod.length; i++) {
        console.log(apod[i])
        const card = document.createElement('div');
        card.classList = 'card border border-0 mt-5';

        card.innerHTML = `
                    <div class="card-body container">
                        <div class="row">
                            <div class="col-12 col-md-6">
                            ${apod[i].media_type !== 'image'
                ? `<div class="ratio ratio-16x9">
                                            <iframe src="${apod[i].url} title="${apod[i].title}" allowfullscreen" ></iframe>
                                        </div>`
                : `<img
                                        class="card-img mb-5 img-fluid"
                                        src="${apod[i].url}"
                                        alt="${apod[i].title}"
                                        />`
            }
                            
                            </div>
                            <div class="col-12 col-md-6">
                            <h2 class="card-title mb-4">${apod[i].title}</h2>
                            <p class="card-text">
                                Featured Date: ${apod[i].date}
                            </p>
                            <p class="card-text">
                                ${apod[i].explanation}
                            </p>
                            </div>
                        </div>
                    </div>
                `;

        document.getElementById('apod-content').appendChild(card);
    }
}

// Display pictures within range of user input
async function displayApodStart(start) {
    let response = await fetch(`${globalVars.api.apiURL}${globalVars.api.categories.pod}?api_key=${globalVars.api.apiKey}&date=${start}`)
    let apod = await response.json();
    const card = document.createElement('div');
    card.classList = 'card border border-0 mt-5';

    card.innerHTML = `
                <div class="card-body container">
                    <div class="row">
                        <div class="col-12 col-md-6">
                        ${apod.media_type === 'image'
            // If media type is image
            ? `<img
                                    class="card-img mb-5 img-fluid"
                                    src="${apod.url}"
                                    alt="${apod.title}"
                                    />`
            // If media type is video
            : `<div class="ratio ratio-16x9">
                                        <iframe src="${apod.url} title="${apod.title}" allowfullscreen" ></iframe>
                                    </div>`
        }
                        </div>
                        <div class="col-12 col-md-6">
                        <h2 class="card-title mb-4">${apod.title}</h2>
                        <p class="card-text">
                            Featured Date: ${apod.date}
                        </p>
                        <p class="card-text">
                            ${apod.explanation}
                        </p>
                        </div>
                    </div>
                </div>
                `;

    document.getElementById('apod-content').appendChild(card);
}



// NeoWS
async function displayNeowsData() {

    // Get the system date
    const date = getSystemDate();

    // Instantiate a new Date object that is in UTC Date/Time (NASA API server time is in UTC time)
    let serverDate = new Date().toISOString().slice(0, 10);

    let title = document.getElementById('title');

    // Check if the system (local) date is equal or not equal to the NASA API's server time
    if (date !== serverDate) {
        title.innerHTML = `Near Earth Objects for ${date}`;
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=fs6RHwXud5zkYO58zcIHVBfKA2bGE5FLloRmVSJo`);
        const neows = await response.json();
        // Iterate through the items in the object
        neowsItemLoop(neows, date);
    }
    else {
        title.innerHTML = `Near Earth Objects for ${serverDate}`;
        const response = await fetch(`${globalVars.api.apiURL}${globalVars.api.categories.neows}?api_key=${globalVars.api.apiKey}`);
        const neows = await response.json();

        // Iterate through the items in the object
        neowsItemLoop(neows, serverDate);
    }

}

// Iterate through Neows Object
function neowsItemLoop(neows, date) {

    for (let i = 0; i < neows.near_earth_objects[date].length; i++) {

        // Create Cards
        const card = document.createElement('div');
        card.classList = 'card border p-2 mt-5';

        card.innerHTML = `
            <div class="card-body container">
                <div class="row">
                    <h2 class="card-title mb-4 fw-bold">Neo Name: ${neows.near_earth_objects[date][i].name}</h2>
                    <p>Neo Reference ID: ${neows.near_earth_objects[date][i].id}</p>
                    <table class="table">
                        <thead>
                            <th colspan="3" class="fs-3 fw-semibold">Information</th>
                        <thead>
                        <tbody>
                            <tr>
                            <th class="fw-medium" scope="row">Absolute Magnitude</th>
                            <td colspan="3">${neows.near_earth_objects[date][i].absolute_magnitude_h}</td>
                            </tr>
                            <tr>
                            <th class="fw-medium" scope="row">Minimum Estimated Diameter</th>
                            <td><em>KM:</em> ${neows.near_earth_objects[date][i].estimated_diameter.kilometers.estimated_diameter_min} km </td>
                            <td><em>Mi:</em> ${neows.near_earth_objects[date][i].estimated_diameter.miles.estimated_diameter_min} mi </td>
                            </tr>
                            <tr>
                            <th class="fw-medium" scope="row">Maximum Estimated Diameter</th>
                            <td><em>KM:</em> ${neows.near_earth_objects[date][i].estimated_diameter.kilometers.estimated_diameter_max} km </td>
                            <td><em>KM:</em> ${neows.near_earth_objects[date][i].estimated_diameter.miles.estimated_diameter_max} mi </td>
                            </tr>
                            <th class="fw-medium" scope="row">Potentially Hazardous</th>
                            <td colspan="3">${neows.near_earth_objects[date][i].is_potentially_hazardous_asteroid}</td>
                            </tr>
                            <th class="fw-medium" scope="row">Close Approach Date</th>
                            <td colspan="3"><em>Close Approach Date:</em> ${neows.near_earth_objects[date][i].close_approach_data[0].close_approach_date_full}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="card-text">
                        <a href="${neows.near_earth_objects[date][i].links.self}"> More information on ${neows.near_earth_objects[date][i].name}</a>
                    </p>
                </div>
            </div>
        `;
        document.getElementById('neows-content').appendChild(card);
    }
}

async function neowsSearch(event) {
    event.preventDefault();
    resetUI();
    const searchItem = document.getElementById('search')

    let item = '';
    
    // Evaluate search term
    // - Search term cannot be empty string and needs to be a 7-digit number
    const regex = new RegExp(/^\d{7}?$[^\s]*/);

    if (regex.test(searchItem.value)) {
        item = searchItem.value;
    }
    else {
        alert("Please enter a 7-digit number with no spaces!")
    }
    // Test Values: 3542519 2416801 3363908
    const response = await fetch(`${globalVars.api.apiURL}/neo/rest/v1/neo/${item}?api_key=${globalVars.api.apiKey}`);
    const data = await response.json();
    console.log(data)
    // Create Cards
    const card = document.createElement('div');
    card.classList = 'card border p-2 mt-5';

    card.innerHTML = `
        <div class="card-body container">
            <div class="row">
                <h2 class="card-title mb-4 fw-bold">Neo Name: ${data.name}</h2>
                <p>Neo Reference ID: ${data.id}</p>
                <table class="table">
                    <thead>
                        <th colspan="3" class="fs-3 fw-semibold">Information</th>
                    <thead>
                    <tbody>
                        <tr>
                        <th class="fw-medium" scope="row">Absolute Magnitude</th>
                        <td colspan="3">${data.absolute_magnitude_h}</td>
                        </tr>
                        <tr>
                        <th class="fw-medium" scope="row">Minimum Estimated Diameter</th>
                        <td><em>KM:</em> ${data.estimated_diameter.kilometers.estimated_diameter_min} km </td>
                        <td><em>Mi:</em> ${data.estimated_diameter.miles.estimated_diameter_min} mi </td>
                        </tr>
                        <tr>
                        <th class="fw-medium" scope="row">Maximum Estimated Diameter</th>
                        <td><em>KM:</em> ${data.estimated_diameter.kilometers.estimated_diameter_max} km </td>
                        <td><em>KM:</em> ${data.estimated_diameter.miles.estimated_diameter_max} mi </td>
                        </tr>
                        <th class="fw-medium" scope="row">Potentially Hazardous</th>
                        <td colspan="3">${data.is_potentially_hazardous_asteroid}</td>
                        </tr>
                        <th class="fw-medium" scope="row">Close Approach Date</th>
                        <td colspan="3"><em>Close Approach Date:</em> ${data.close_approach_data[0].close_approach_date_full}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="card-text">
                    <a href="${data.links.self}"> More information on ${data.name}</a>
                </p>
            </div>
        </div>
    `;
    document.getElementById('neows-content').appendChild(card);
    neowsForm.reset();
}

// Get current date from system
// - Get PDT offset to subtract from UTC
function getSystemDate() {
    const date = new Date()
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 10);
}

// Get date values from user from APOD Page
function getDateVal(event) {
    event.preventDefault();
    const start = document.getElementById('start-date');
    const end = document.getElementById('end-date');

    let endDate = '';
    let startDate = '';

    if (start.value !== '') {
        if (end.value !== '') {
            endDate = end.value;
        }
        startDate = start.value;
    }
    else {
        alert("Please enter a start date")
    }

    // Reset Form
    apodForm.reset();

    displayApodData(startDate, endDate);


}

// If apod content or neows content section has items, remove items
function resetUI() {
    const apodContent = document.getElementById('apod-content');

    const neowsContent = document.getElementById('neows-content');

    if (globalVars.currentPage === '/' || globalVars.currentPage === '/index.html') {
        [...apodContent.childNodes].forEach(el => el.remove()); // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    }
    else {
        [...neowsContent.childNodes].forEach(el => el.remove()); // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    }

}

const apodForm = document.getElementById('apod-date-form');
const neowsForm = document.getElementById('neows-date-form');

function init() {
    switch (globalVars.currentPage) {
        case '/':
        case '/index.html':
            apodForm.addEventListener('submit', getDateVal);
            displayApodData();
            break;
        case '/neows.html':
            neowsForm.addEventListener('submit', neowsSearch);
            displayNeowsData();
            break;
    }

}

document.addEventListener('DOMContentLoaded', init);

// create
resetUI();