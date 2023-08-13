import CreateMap from './map.js';
import { timestampToHours } from './utils.js';
import Storage from './storage.js';

export default class Ui {
  static displayData(result) {
    // console.log(result);

    // Save country data to lacal storage
    Storage.saveToStorage('countries', result, 'name', localStorage);

    let languages = '';
    let regionalBlocs = '';
    result.languages.forEach(l => (languages += `<div>${l.name} (${l.nativeName})</div>`));
    result.regionalBlocs.forEach(b => (regionalBlocs += `<div>${b.name} (${b.acronym})</div>`));

    let currencyForm = `<form id="currency-form">
        <input type="hidden" name="base" value="${result.currencies[0].code}"/>
        <input type="button" class="currency btn btn-primary btn-sm p-1 my-2" data-toggle="modal" data-target="#modal"
          value="${result.currencies[0].code} exchange rates">
        </form>`;

    const weatherForm = `<form id="weather-form">
      <input type="hidden" name="location" value="${result.capital},${result.alpha2Code}"/>
      <input type="button" class="weather btn btn-primary btn-sm p-1 my-2" data-toggle="modal" data-target="#modal" 
       value="Get current weather">
      </form>`;

    let cards = `<div class="card card-map">
      <div class="card-body">
      <div class="card-title border border-dark p-3 country-name">
      <span class="lead p-3">${result.name}</span>
      <img class="card-img-top flag my-auto" src="${result.flag}" 
      alt="flag-${result.name}"/>
      </div>
      <div id="map" class="map"></div>
      </div>
      </div>
      
     <div class="card card-nam">
      <div class="card-body">
      <p class="card-title lead">Names & Codes</p>
      <table class="table  table-striped my-2">
        <tr><td class="w-50">Native name</td><td class="w-50">${result.nativeName}</td></tr>
        <tr><td class="w-50">Alternative spellings</td>
          <td class="w-50">${result.altSpellings.toString().replace(/,/g, ', ')}</td></tr>
        <tr><td class="w-50">ISO 3166 codes</td><td class="w-50">
          <div>${result.alpha2Code} / ${result.alpha3Code} / ${result.numericCode}</td></tr>
        <tr><td class="w-50">Calling code</td><td class="w-50">${
          result.callingCodes[0]
        }</td></tr>
        <tr><td class="w-50">TLD</td><td class="w-50">${result.topLevelDomain[0]}</td></tr>
      </table>
      </div>
      </div>
       
      <div class="card card-geo">
      <div class="card-body">
      <p class="card-title lead">Geography & Population</p>
      <table class="table  table-striped my-2">
      <tr><td class="w-50">Region</td><td class="w-50">${result.region}</td></tr>
      <tr><td class="w-50">Subregion</td><td class="w-50">${result.subregion}</td></tr>
      <tr><td class="w-50">Capital</td><td class="w-50">${
        result.capital
      }${weatherForm}</td></tr>
      <tr><td class="w-50">Area</td><td class="w-50">${result.area} km<sup>2</sup></td></tr>
      <tr><td class="w-50">Coordinates</td>
        <td class="w-50">Lat: ${result.latlng[0].toFixed(0)} 
        / Lng: ${result.latlng[1].toFixed(0)}</td></tr>
      <tr><td class="w-50">Land borders</td>
        <td class="w-50">${result.borders.toString().replace(/,/g, ', ')}</td></tr>
      <tr><td class="w-50">Population</td><td class="w-50">${result.population}</td></tr>
      <tr><td class="w-50">Languages</td><td class="w-50">${languages}</td></tr>
      <tr><td class="w-50">Demonym</td><td class="w-50">${result.demonym}</td></tr>
      </table>
      </div>
      </div>
      
      <div class="card card-eco">
      <div class="card-body">
      <p class="card-title lead">Economics & Geopolitics</p>
      <table class="table  table-striped my-2">
      <tr><td class="w-50">Currency</td>
        <td class="w-50"><div>${result.currencies[0].name}${currencyForm}</div>
        <div>Code: ${result.currencies[0].code} 
        ${result.currencies[0].symbol ? '( ' + result.currencies[0].symbol + ' )' : ''}
        </div></td>
      </tr>
      <tr><td class="w-50">Regional blocs</td>
        <td class="w-50">${regionalBlocs !== '' ? regionalBlocs : 'N\\A'}</td></tr>
      <tr><td class="w-50">Gini index</td>
        <td class="w-50">${result.gini ? result.gini : 'N\\A'}</td></tr>
      </table>
      </div>
      </div>`;

    $('#display').html(cards);

    const popup = `<div class="text-white text-center p-2 popup ">
    <div class="my-2">${result.name}</div>
    <div class="mb-1">Coordinates of a point: <div>Latitude : ${result.latlng[0]}, Longitude: ${result.latlng[1]}</div></div>
    </div>`;

    // Create map
    let countryMap = new CreateMap();
    countryMap.createMap();

    // Find and display geoJson polygon
    countryMap.getGeoJson(countryMap, result.alpha3Code);

    // Add map marker
    countryMap.setMarker(result.latlng[0], result.latlng[1], popup);
  }

  static displayWeatherModal(result) {
    // console.log(result);
    $('.modal-title').html(`Current Weather`);
    if (result.cod === '404') {
      $('.modal-body').html(`<p class="my-4">Sorry, ${result.message}</p>`);
    } else {
      // Save to web storage
      Storage.saveToStorage('currentWeather', result, 'name');

      $('.modal-body').html(`<p class="lead my-3 text-primary">${result.name}</p>
    <p class="my-0">${
      result.weather[0].description.charAt(0).toUpperCase() +
      result.weather[0].description.slice(1)
    }</p>
    <img src="http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png" 
      alt="${result.weather[0].description}"/>
    <p>Temperature: ${Math.round(result.main.temp)} &deg;C</p>
    <p>Feels like: ${Math.round(result.main.feels_like)} &deg;C</p><hr class="bg-primary mb-2"/>
    <p>Humidity: ${result.main.humidity}%</p>
    <p>Pressure: ${result.main.pressure} hPa</p>
    <p>Wind: ${result.wind.speed} km/h</p><hr class="bg-primary mb-2"/>
    <p>Sunrise: ${timestampToHours(result.sys.sunrise, result.timezone)}</p>
    <p>Sunset: ${timestampToHours(result.sys.sunset, result.timezone)}</p>
    `);
    }
  }

  static displayCurrencyModal(result) {
    // console.log(result);
    $('.modal-title').html('Exchange Rates');
    if (result.error) {
      $('.modal-body').html(`<p class="my-4">Sorry, ${result.error}<p>`);
    } else {
      // Save object to web storage
      Storage.saveToStorage('exchangeRates', result, 'base');

      $('.modal-title').html(
        `<span class="align-middle">Exchange Rates : </span>
        <img src="https://www.countryflags.io/${result.base.slice(0, 2)}/flat/64.png" width="32"
        class="align-middle"> <span class="lead align-middle">${result.base}</span>`
      );
      $('.modal-body').html(
        `<div class="my-3">Date: ${result.date}</div><table class="table table-sm" id="rates"></table>`
      );
      let currArr = [];
      let currStr = '';
      for (let rate in result.rates) {
        currArr.push({ base: rate, val: result.rates[rate].toFixed(2) });
      }
      currArr = currArr.filter(c => c.base !== result.base);
      currArr.forEach(
        c =>
          (currStr += `<tr class="w-50"><td class="w-50 pl-5">
          <img src="https://www.countryflags.io/${c.base.slice(0, 2)}/flat/64.png" width="32" 
          class="align-middle"> <span class="align-text-top">${c.base}</span></td>
          <td class="align-middle pl-5">${c.val}</td></tr>`)
      );
      $('#rates').html(currStr);
    }
  }

  static displayAbout() {
    $('.modal-title').html(`Gazetteer`);
    const about = `<Header class="lead my-2">About</Header>
        <p class="text-left">This site is intended as a simple, easy to use way to explore infomation about the countries of the world</p>
        <p class="text-left">Author: <a href="https://github.com/mjablonski984" class="text-decoration-none">mjablonski984</a></p>
        <Header class="lead my-2">Credits</Header>
        <p class="text-left">All data is courtesy of following :</p>
        <ul class="text-left">
        <li>REST Countries <a href="https://restcountries.eu/" class="text-decoration-none">https://restcountries.eu</a></li>
        <li>Geo Names <a href="https://www.geonames.org/" class="text-decoration-none">https://www.geonames.org</a></li>
        <li>Exchange Rates API <a href="https://exchangeratesapi.io/" class="text-decoration-none">https://exchangeratesapi.io</a></li>
        <li>Open Weather <a href="http://openweathermap.org/" class="text-decoration-none">http://openweathermap.org</a></li>
        </ul>`;
    $('.modal-body').html(about);
  }

  static loader() {
    const loader = `<div class="loader text-center lead text-primary m-auto p-5">Loading
    <span class="spinner-grow spinner-grow-sm"> </span>
    <span class="spinner-grow spinner-grow-sm"> </span>
    <span class="spinner-grow spinner-grow-sm"> </span> 
    </div>`;
    return loader;
  }
}
