const globalVars = {
    currentPage: window.location.pathname,
    api: {
        apiURL: 'https://api.nasa.gov',
        apiKey: 'fs6RHwXud5zkYO58zcIHVBfKA2bGE5FLloRmVSJo',
        categories: {
            pod: '/planetary/apod',
            neows: '/neo/rest/v1/feed'
        }

    }

}

const apodForm = document.getElementById('apod-date-form');
const neowsForm = document.getElementById('neows-date-form');
const neowsSearchForm = document.getElementById('neows-search');
const apodContent = document.getElementById('apod-content');

async function fetchAPI(endpoint) {

    try {
        let response = await fetch(`${globalVars.api.apiURL}${endpoint}?api_key=${globalVars.api.apiKey}`);
        
        if (response.error) {
            alert(error);
        }
        else {
            let data = await response.json();

            return data;
        }

    }
    catch (error) {
        console.log(error);
    }
}

// displayApodData Async Function
function displayApodData(start, end) {
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
        resetUI();
        displayApod();

    }
    resetUI();


}

// Display picture of the Day
async function displayApod() {
    const apod = await fetchAPI(globalVars.api.categories.pod);
    displayApodHTML(apod);
}

// Picture of the day cards HTML 
function displayApodHTML(apod) {
    const card = document.createElement('div');
    const button = document.createElement('button');
    const apodContent = document.getElementById('apod-content');
    button.type = 'button';
    button.classList = 'btn btn-dark add-to-favorite m-3'
    button.innerHTML = 'Add to Favorites';
    card.classList = 'card border border-0 mt-5 p-3';

    card.innerHTML = `
                <div class="card-body container">
                    <div class="row">
                        <div class="col-12 col-lg-6">
                        <figure class="mb-3">
                        ${apod.media_type === 'image'
            // If media type is image
            ? `<img class="card-img img-fluid" src="${apod.url}" alt="${apod.title}"/>`
            // If media type is video
            : `<div class="ratio ratio-16x9">
                                    <iframe src="${apod.url} title="${apod.title}" allowfullscreen" ></iframe>
                                </div>`
        }
                        ${apod.hasOwnProperty('copyright')
            // If apod has copyright display it
            ? `<figcaption class="text-muted"><em>Copyright: ${apod.copyright}</em></figcaption>`
            // else do not display it
            : `<figcaption class="d-none"></figcaption>`}
                        </figure>
                        </div>
                        <div class="information col-12 col-lg-6">
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
    card.appendChild(button);
    apodContent.appendChild(card);

    button.addEventListener('click', addFavToStorage);
}

// Display pictures within range of user input
async function displayApodRange(start, end) {
    globalVars.api.apiKey = globalVars.api.apiKey + `&start_date=${start}&end_date=${end}`;
    const apod = await fetchAPI(globalVars.api.categories.pod);

    for (let i = 0; i < apod.length; i++) {
        displayApodHTML(apod[i])
    }
}

// Display picture of the Day that user chose
async function displayApodStart(start) {
    globalVars.api.apiKey = globalVars.api.apiKey + `&start_date=${start}`;
    const apod = await fetchAPI(globalVars.api.categories.pod);
    for(let i = 0; i < apod.length; i++) {
        if(apod[i].date === start){
            displayApodHTML(apod[i]);
        }
    }
    
}

// Get date values from user from APOD Page
function getDateVal(event) {
    event.preventDefault();
    const start = document.getElementById('start-date');
    const end = document.getElementById('end-date');

    // Check if the difference between end date and start date are greater than 7
    let date1 = new Date(start.value);
    let date2 = new Date(end.value);

    let time_diff = date2.getTime() - date1.getTime();
    let result = time_diff / (1000 * 60 * 60 * 24);

    let endDate = '';
    let startDate = '';

    // Alert Message

    // Validation for user input
    // - start and end value cannot be empty
    // - Time / Date difference should be less than or equal to 7 and cannot be less than 0
    // - start date must be less than end date
    if (start.value !== '' && !end.value && start.value <= getSystemDate()) {
        startDate = start.value;
    }
    else if (start.value !== '' && end.value !== '' && start.value <= getSystemDate() && end.value <= getSystemDate()) {
        if (date2.getTime() >= date1.getTime()) {
            if (result <= 7 && result > 0) {
                startDate = start.value;
                endDate = end.value;
            }
            else {
                alert('Please keep range within 7 days.');
            }
        }
        else {
            alert('Sorry the start date must not be greater than your end date.')
        }
    }
    else {
        alert("Please enter a start date");
        //displayApod(getSystemDate);
    }

    // Reset Form
    apodForm.reset();

    displayApodData(startDate, endDate);

}

/******************** NeoWS ********************/

// Display Neows
async function displayNeowsData() {

    // Get the system date
    const systemDate = getSystemDate();

    // Instantiate a new Date object that is in UTC Date/Time (NASA API server time is in UTC time)
    let serverDate = new Date().toISOString().slice(0, 10);

    let title = document.getElementById('title');

    // Check if the system (local) date is equal or not equal to the NASA API's server time
    if (systemDate !== serverDate) {
        title.innerHTML = `Near Earth Objects for ${systemDate}`;
        const response = await fetch(`${globalVars.api.apiURL}${globalVars.api.categories.neows}?start_date=${systemDate}&end_date=${systemDate}&api_key=${globalVars.api.apiKey}`);
        const neows = await response.json();
        // Iterate through the items in the object
        neowsItemLoop(neows, systemDate);
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
                    <div class="row">
                        <img class="col-4 asteroid-img" src="./assets/img/dark-asteroid.png">
                        <div class="col">
                            <h2 class="card-title mb-4 fw-bold">Neo Name: ${neows.near_earth_objects[date][i].name}</h2>
                            <p>Neo Reference ID: ${neows.near_earth_objects[date][i].id}</p>
                        </div>
                        
                    </div>
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
                            <td colspan="3">${neows.near_earth_objects[date][i].close_approach_data[0].close_approach_date_full}</td>
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

// Neows Search
async function neowsSearch(event) {
    event.preventDefault();
    resetUI();

    const searchItem = document.getElementById('search')

    let item = '';
    let alertMessage = document.createElement('div');
    // Evaluate search term
    // - Search term cannot be empty string and needs to be a 7-digit number
    const regex = new RegExp(/^\d{7}?$[^\s]*/);

    if (regex.test(searchItem.value)) {
        if (neowsSearchForm.querySelector('#neows-alert') !== null) {
            neowsSearchForm.querySelector('#neows-alert').remove();
        }
        item = searchItem.value;
    }
    else {
        //alert("Please enter a 7-digit number with no spaces!");
        if (neowsSearchForm.querySelector('#neows-alert') === null) {
            // Add the alert message
            alertMessage.classList = 'alert alert-danger';
            alertMessage.id = 'neows-alert';
            alertMessage.innerText = 'Please enter a 7-digit number with no spaces!';
            neowsSearchForm.appendChild(alertMessage);
        }

    }
    // Test Values: 3542519 2416801 3363908
    const response = await fetch(`${globalVars.api.apiURL}/neo/rest/v1/neo/${item}?api_key=${globalVars.api.apiKey}`);
    const data = await response.json();


    // Create Cards - Change the card design
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
                        <td colspan="3">${data.close_approach_data[0].close_approach_date_full}</td>
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
    neowsSearchForm.reset();
}

// Search Date for Neows
async function neowsSearchDate(event) {
    event.preventDefault();
    resetUI();
    const searchDate = document.getElementById('neows-date');

    let title = document.getElementById('title');

    // Check if search value is not empty
    if (searchDate.value !== '') {
        const response = await fetch(`${globalVars.api.apiURL}${globalVars.api.categories.neows}?start_date=${searchDate.value}&end_date=${searchDate.value}&api_key=fs6RHwXud5zkYO58zcIHVBfKA2bGE5FLloRmVSJo`);
        const neows = await response.json();

        title.innerHTML = `Near Earth Objects for ${searchDate.value}`;
        neowsItemLoop(neows, searchDate.value);
    }
    else {
        alert('Please enter a date')
        displayNeowsData();
    }


    neowsForm.reset();
}


// Get current date from system
// - Get offset to subtract from UTC to have current Date
function getSystemDate() {
    const date = new Date()
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 10);
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

// Add favorites page
function displayFavorites() {
    let favoritesContent = document.getElementById('favorites-content');
    let items = getFavToStorage();
    const parser = new DOMParser();

    items.forEach(item => {
        let card = document.createElement('div');
        card.classList = 'card favorite';
        const html = parser.parseFromString(item, "text/html");
        card.appendChild(html.body.firstChild);
        favoritesContent.appendChild(card);
    })

}

// Get Item
function getFavToStorage() {
    let favorites;

    // Check if local storage is empty
    if (localStorage.getItem('items') === null) {
        // If local storage is empty, then set itemsFromStorage to an empty array
        favorites = [];
    }
    else {
        // If local storage has items in it, then parse its content and get the items
        favorites = JSON.parse(localStorage.getItem('items'));

    }

    return favorites;
}

// 
function addFavToStorage(event, item) {
    const favorites = getFavToStorage();
    item = event.target.parentElement.innerHTML;
    
    if(favorites.includes(item)) {
        alert("Item is already part of favorites list.")
    }
    else {
        favorites.push(item);
        localStorage.setItem('items', JSON.stringify(favorites));
    }
    
    //localStorage.removeItem('items');
}

function init() {
    switch (globalVars.currentPage) {
        case '/':
        case '/index.html':
            apodForm.addEventListener('submit', getDateVal);
            displayApodData();
            break;
        case '/neows.html':
        case 'neows':
            neowsSearchForm.addEventListener('submit', neowsSearch);
            neowsForm.addEventListener('submit', neowsSearchDate);
            displayNeowsData();
            break;
        case '/favorites.html':
        case 'favorites':
            displayFavorites();
            break;
    }

}

document.addEventListener('DOMContentLoaded', init);
