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

// Asks for user input for start date
function getStartDate() {
    const startDate = document.getElementById('start-date');
    return startDate;
}



// Refactor Elements
// class Fetch {
//     async fetchAPIData(endpoint) {
//         const response = await fetch(endpoint);

//         const { status } = response;


//         const data = await response.json();

//         return data;
//     }
// }

// fetchAPIData Async Function
// - Fetch Data from NASA API to access Data
// - Check if status is 200 or not and only proceed if status is 200
// - Dynamically add endpoint for different fetch requests
// - Turn response to json
// - Return data to be used in displaying each type of content
async function fetchAPIData(endpoint) {
    const response = await fetch(`${globalVars.api.apiURL}${endpoint}?api_key=${globalVars.api.apiKey}`);

    const data = await response.json();

    return data;
}

// displayApodData Async Function
async function displayApodData() {
    const apod = await fetchAPIData(`${globalVars.api.categories.pod}`);

    console.log(apod);
    // Create Cards
    const card = document.createElement('div');
    card.classList = 'card border border-0 mt-5';

    card.innerHTML = `
        <div class="card-body container">
            <div class="row">
                <div class="col-12 col-md-6">
                <img
                    class="card-img mb-5 img-fluid"
                    src="${apod.url}"
                    alt="${apod.title}"
                />
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
    const date = getSystemDate();
    const neows = await fetchAPIData(`${globalVars.api.categories.neows}`);

    let title = document.getElementById('title');
    title.innerHTML = `Near Earth Objects for ${date}`;
    
    console.log(neows);

    for (let i = 0; i < neows.near_earth_objects[date].length; i++) {
        
        // Create Cards
        const card = document.createElement('div');
        card.classList = 'card border p-2 mt-5';

        card.innerHTML = `
            <div class="card-body container">
                <div class="row">
                    <h2 class="card-title mb-4 fw-bold">Neo Name: ${neows.near_earth_objects[date][i].name}</h2>
                    
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



    console.log(neows.near_earth_objects[date][0].name);
}

// Get current date from system
function getSystemDate() {
    const date = new Date().toISOString().slice(0, 10);

    return date;
}

function getInputVal() {

}

function init() {
    switch (globalVars.currentPage) {
        case '/':
        case '/index.html':
            displayApodData();
            break;
        case '/neows.html':
            displayNeowsData();
            break;
    }
}

document.addEventListener('DOMContentLoaded', init);

