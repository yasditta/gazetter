let map;
let border;
let citiesCG;
let earthquakesCG;
let airportsCG;
let restaurantsCG;
let hotelsCG;

$(window).on('load', function () {
    $(".loader-wrapper").fadeOut("slow");
    userLocation();
});

// Map Initialization
map = L.map('map').setView([22.00, -10.00], 3);

// Map Layers
const wsm = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    minZoom: 2,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});
wsm.addTo(map); 

const stadiaDark = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    minZoom: 2,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

 
const googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    minZoom: 2,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

//   googleStreets.addTo(map)



    
getCountries();
    
// Cluster Groups
citiesCG = L.markerClusterGroup();
map.addLayer(citiesCG);

earthquakesCG = L.markerClusterGroup();
map.addLayer(earthquakesCG);

airportsCG = L.markerClusterGroup();
map.addLayer(airportsCG);

restaurantsCG = L.markerClusterGroup();
map.addLayer(restaurantsCG);

hotelsCG = L.markerClusterGroup();
map.addLayer(hotelsCG);

// Layer Controller
const baseMaps = {
    "WSM": wsm,
    "Stadia Dark": stadiaDark,
    "Google Map":googleStreets
};

const markerLayers = {
    "Cities": citiesCG,
    "Earthquakes": earthquakesCG,
    "Airports": airportsCG,
    "Restaurants": restaurantsCG,
    "Hotels": hotelsCG
};

L.control.layers(baseMaps, markerLayers).addTo(map)
    .setPosition("bottomright");

L.control.scale().addTo(map);

// L.easyButtons
// button to show Modal with Country Info
const countryInfoButton = new L.easyButton('<i class="fas fa-info"></i>', function() {
    $("#countryModal").modal("show");
}, "Country Info");
countryInfoButton.addTo(map);

// button to show Modal with Weather Info
const weatherInfoButton = new L.easyButton('<i class="fas fa-cloud-sun"></i>', function() {
    $("#weatherModal").modal("show");
}, "Weather Info");
weatherInfoButton.addTo(map);

// button to show Modal with News Info
const newsInfoButton = new L.easyButton('<i class="far fa-newspaper"></i>', function() {
    $("#newsModal").modal("show");
}, "News Info");
newsInfoButton.addTo(map);

// Create Icons
const cityIcon = L.icon({
    iconUrl: 'images/cityIcon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 45],
    popupAnchor: [0, -40]
});

const earthquakeIcon = L.icon({
    iconUrl: 'images/earthquakeIcon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 45],
    popupAnchor: [0, -40]
});

const airportIcon = L.icon({
    iconUrl: 'images/airportIcon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 45],
    popupAnchor: [0, -40]
});

const restaurantIcon = L.icon({
    iconUrl: 'images/restaurantIcon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 45],
    popupAnchor: [0, -40]
});

const hotelIcon = L.icon({
    iconUrl: 'images/hotelIcon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 45],
    popupAnchor: [0, -40]
});

// Get User Location
function userLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser!");
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        $.ajax({
            url: "libs/php/getUserIsoA3.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: latitude,
                lng: longitude
            },
            success: function(result) {
                const userCountryIsoA3 = result.isoA3;
                $("#select-country").val(userCountryIsoA3).change();
            },
            error: function(err) {
                alert("Error: " + err);
            }
        });
    }
    
    function error() {
        alert("Unable to retrieve your location!");
    }
    navigator.geolocation.getCurrentPosition(success, error);
}

// Populate Select/Search Bar
function getCountries() {
    $.ajax({
        url: "libs/php/getCountries.php",
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {
            $("#loader").removeClass("hidden");
        },
        success: function(result) {    
            let selectSearchBar = $("#select-country");
            const countries = result.data;
            countries.forEach(country => {
            
                if (country.iso3 != "-99") {
                    selectSearchBar.append($(
                        `<option value="${country.iso3}">
                            ${country.name}
                        </option>`
                    ));
                }   
            });
        },
        complete: function () {
            $("#loader").addClass("hidden")
        },
        error: function(err) {
            alert("Error: " + err);
        }
    });
}

// Country Info
function countryInformation(country) {
    $.ajax({
        url: "libs/php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            code: country
        },
        beforeSend: function () {
            $("#loader").removeClass("hidden");
        },
        success: function(result) {

            const lat = result.latlng[0];
            const lng = result.latlng[1];
            const capital = result.capital;
    
            let countryInfo = $("#country-info");
            countryInfo.html("");

                countryInfo.append($(
                    `<div class="card h-100 country">
                            <img src="${result.flag}" alt="${result.name}"/>
                    </div>
                    <div class="card-body country">
                        <h4><a href="https://en.wikipedia.org/wiki/${result.name}" target="_blank">${result.name}</a></h4>
                    </div>
                    <div class="table-country">
                        <table class="table table-striped table-sm">
                            <tbody>
                                <tr>
                                    <th scope="row">Capital:</th><td>${result.capital}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Population:</th><td>${result.population.toLocaleString("en-US")}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Area:</th><td>${result.area.toLocaleString("en-US")} Km<sup>2</sup></td>
                                </tr>
                                <tr>
                                    <th scotde="row">Currencies:</th><td>${result.currencies.filter(c => c.name).map(c=> `${c.name}  (${c.symbol})`).join(", ")}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Languages:</th><td>${result.languages.map(l => l.name).join(", ")}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Region:</th><td>${result.region}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Subregion:</th><td>${result.subregion}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Timezone:</th><td>${result.timezones.map(t => t).join(", ")}</td>
                                <tr>
                            </tbody>
                        </table>
                    </div> `
                ));
                $("#countryModal").modal("show");
                addWeather(lat, lng);
                addNews(capital);
                addBorders(country);
                addAirports(lat, lng);
                addHotels(capital);
        },
        complete: function () {
            $("#loader").addClass("hidden")
        },
        error: function(textStatus, errorThrown) {
            alert("Error: " + errorThrown);
        }
    });    
}

// Get Weather
function addWeather(lat, lng) {
    $.ajax({
        url: "libs/php/getWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng
        },
        success: function(result) {
            const data = result.data.daily;

            let WeatherToday = $("#weather-today");
            let WeatherFuture = $("#weather-future");
            WeatherToday.html("");
            WeatherFuture.html("");    

            WeatherToday.append($(
                `<div class="p-2 weather-current">
                    <div class="text-center">
                        <p class="h6 mb-3"><span id="weather-location">${result.data.timezone}</span></p>
                        <p class="h2 mb-2">${data[0].weather[0].main}</p>
                        <p class="display-1 mb-0"><strong>${Math.round(data[0].temp.day)}°C</strong></p>
                        <p class="mb-0"><strong>${Math.round(data[0].temp.max)}°<span id="min-temp"> / ${Math.round(data[0].temp.min)}°</span></strong></p>
                        <img src="https://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png" class="mb-0"/>
                    </div>
                </div>`
            ));

            for (let i = 1; i < data.length; i++) {

                WeatherFuture.append($(    
                    `<tr>
                        <th class="align-middle">${window.moment(data[i].dt * 1000).format('ddd, MMM Do')}</th>
                        <td><img src="https://openweathermap.org/img/wn/${data[i].weather[0].icon}.png" alt="weather icon" id="w-icon"/></td>
                        <td class="h6 fw-bold align-middle text-end">${Math.round(data[i].temp.max)}° <span id="min-temp"> / ${Math.round(data[i].temp.min)}°</span></td>
                    </tr>`
                ));
            }           
        },
        error: function(textStatus, errorThrown) {
            alert("Error: " + errorThrown);
        }
    });
}

// Get News
function addNews(capital) {
    $.ajax({
        url: "libs/php/getNews.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryCapital: capital  
        },
        success: function(result) {
            
            if (result.status == "ok") {
                const newsData = result.articles;
               
                let newsCard = $("#news-info-card");
                newsCard.html("");
                
                newsData.forEach(news => {
                    newsCard.append($(
                        `<div class="col p-2">
                            <div class="card news h-100">
                                <img class="card-img" src="${news.urlToImage}" alt="News Image">
                                <div class="news card-img-overlay d-flex flex-column justify-content-end">
                                    <h6>${news.source.name}</h6>
                                    <a href="${news.url}" target="_blank">${news.title}</a>
                                </div>
                            </div>
                        </div>`
                    ));
                });
            }
        },
        error: function(textStatus, errorThrown) {
            // console.log(textStatus, errorThrown);
        }
    });    
}

// Get Borders
function addBorders(country) {
    $.ajax({
        url: "libs/php/getCountryBorder.php",
        type: 'POST',
        dataType: 'json',
        data: {
            isoA3: country
        },
        success: function(result) {
            const countryBorders = result.data;
            
            if (map.hasLayer(border)) {
                map.removeLayer(border);
            }
           border = L.geoJSON(countryBorders, {
               color: "#361999",
               wheight: 14,
               opacity: 1,
               fillOpacity: 0.1
           }).addTo(map);
            map.fitBounds(border.getBounds());  
            
            const bounds = border.getBounds();
            const north = bounds.getNorth();
            const south = bounds.getSouth();
            const east = bounds.getEast();
            const west = bounds.getWest();

            const blLat = bounds._southWest.lat;
            const trLat = bounds._northEast.lat;
            const blLng = bounds._southWest.lng;
            const trLng = bounds._northEast.lng;
            
            nearByCities(north, south, east, west);
            getEarthquakes(north, south, east, west);
            addRestaurants(blLat, trLat, blLng, trLng);
        },
        error: function(textStatus, errorThrown) {
            // console.log(textStatus, errorThrown);
        }
    });    
}

// Get Cities
function nearByCities(north, south, east, west) {
    citiesCG.clearLayers();
    $.ajax({
        url: "libs/php/getNearByCities.php",
        type: 'POST',
        dataType: 'json',
        data: {
            north: north,
            south: south,
            east: east,
            west: west
        },
        success: function(result) {   
            const nearByCities = result.data;
            // console.log(nearByCities)
            nearByCities.forEach(city => {
                const cityMarker = L.marker([`${city.lat}`, `${city.lng}`], {icon: cityIcon})
                    .bindPopup(`
                            <div class="container card h-100">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th><strong>City</strong></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Name:</th> <td class="text-end"> <strong>${city.name}</strong></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Population:</th> <td class="text-end"> ${city.population.toLocaleString("en-US")}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            `);
                citiesCG.addLayer(cityMarker);
            });
        },
        error: function(textStatus, errorThrown) {
            // console.log(textStatus, errorThrown);
        }
    });    
}

// Get Earthquakes
function getEarthquakes(north, south, east, west) {
    earthquakesCG.clearLayers();
    $.ajax({
        url: "libs/php/getEarthquakes.php",
        type: 'POST',
        dataType: 'json',
        data: {
            north: north,
            south: south,
            east: east,
            west: west
        },
        success: function(result) {    
            const earthquakes = result.data;
            
            earthquakes.forEach(earthquake => {
                const earthquakeMarker = L.marker([`${earthquake.lat}`, `${earthquake.lng}`], {icon: earthquakeIcon})
                    .bindPopup(`
                            <div class="container card h-100">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th><strong>Earthquake</strong></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Magnitude:</th> <td class="text-end"><strong>${earthquake.magnitude}</strong></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Depth:</th> <td class="text-end">${Math.round(earthquake.depth)} Km</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Date and Time:</th> <td class="text-end">${window.moment(earthquake.datetime).format('MMMM Do YYYY, h:mm:ss A')}<td>
                                        </tr>
                                    </tbody>
                                </table>
                            <div>`
                );
                earthquakesCG.addLayer(earthquakeMarker);
            });
        },
        error: function(textStatus, errorThrown) {
            // console.log(textStatus, errorThrown);
        }
    });    
}

// Get Airports
function addAirports(lat, lng) {
    airportsCG.clearLayers();
    $.ajax({
        url: "libs/php/getAirports.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng    
        },
        success: function(result) {
            const airports = result.items;
        
            airports.forEach(airport => {
                const airportMarker = L.marker([`${airport.location.lat}`, `${airport.location.lon}`], {icon: airportIcon})
                    .bindPopup(`
                                <div class="container card h-100">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th><strong>Airport</strong></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Name:</th> <td class="text-end"><strong>${airport.name}</strong></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">IATA Code:</th> <td class="text-end">${airport.iata}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            <div>
                            `
                );
                airportsCG.addLayer(airportMarker);
            });
        },
        error: function(textStatus, errorThrown) {
            // console.log(textStatus, errorThrown);
        }
    });    
}

// Get Restaurants
function addRestaurants(blLat, trLat, blLng, trLng) {
    restaurantsCG.clearLayers();
    $.ajax({
        url: "libs/php/getRestaurants.php",
        type: 'POST',
        dataType: 'json',
        data: {
            blLat: blLat,
            trLat: trLat,
            blLng: blLng,
            trLng: trLng       
        },
        success: function(result) {
            const restaurants = result.data;
            
            restaurants.forEach(restaurant => {
                const restaurantMarker = L.marker([`${restaurant.latitude}`, `${restaurant.longitude}`], {icon: restaurantIcon})
                    .bindPopup(`
                                <div class="container card h-100">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th><strong>${restaurant.category.name}</strong></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Name:</th> <td class="text-end"><strong>${restaurant.name}</strong></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Ranking:</th> <td class="text-end">${restaurant.ranking}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Rating:</th> <td class="text-end">${restaurant.rating} *<td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Address:</th> <td class="text-end">${restaurant.address}<td>
                                        </tr>
                                    </tbody>
                                </table>
                            <div>
                            `
                );
                restaurantsCG.addLayer(restaurantMarker);
            });    
        },
        error: function(textStatus, errorThrown) {
            // console.log(textStatus, errorThrown);
        }
    });    
}

// Get Hotels
function addHotels(capital) {
    hotelsCG.clearLayers();
    $.ajax({
        url: "libs/php/getHotels.php",
        type: 'POST',
        dataType: 'json',
        data: {
            capital: capital,       
        },
        success: function(result) {
            const hotels = result.suggestions[1].entities;

            if (hotels != "") {
                hotels.forEach(hotel => {
                    const hotelMarker = L.marker([`${hotel.latitude}`, `${hotel.longitude}`], {icon: hotelIcon})
                        .bindPopup(`${hotel.type}<br/>
                            <strong>${hotel.name}</strong>`
                    );
                    hotelsCG.addLayer(hotelMarker);
                });
            }    
        },
        error: function(textStatus, errorThrown) {
            // console.log(textStatus, errorThrown);
        }
    });    
}

// When a country is selected
$("#select-country").on("change", countrySelection);

function countrySelection(event) {
    countryInformation(event.target.value);
}