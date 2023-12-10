class Fetch {
    constructor() {
        this.currentPage = window.location.href;
        this._apiURL = 'https://api.nasa.gov';
        this._apiKey = 'fs6RHwXud5zkYO58zcIHVBfKA2bGE5FLloRmVSJo';
        this._categories = {
            apod: '/planetary/apod',
            neows: '/neo/rest/v1/feed'
        }

        // Private Methods

        // Fetch API Data
        
        // Display Apod
        // Display Neows Data
        // Get System Date
        // Get Start Date and End Date Value
        // Start Date

    }


    // Private Methods

    // Fetch API Data
    async displayApodData() {
        const response = await fetch(`${this._apiURL}${this._categories.apod}?api_key=${this._apiKey}`)
        const apod = response.json();
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
        //return data;
    }


        // Display Neows Data
        // Get System Date
        // Get Start Date and End Date Value
        // Start Date    
}

class App {
    constructor() {
        this._data = new Fetch();
        this._data.displayApodData();
    }


    
}

const app = new App();