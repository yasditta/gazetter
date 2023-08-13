import Ui from './ui.js';
import getData from './ajax.js';
import Storage from './storage.js';

// URL to php file
// on localhost use absolute path
const url = '../main.php';

$('document').ready(function () {
  // Hide main loader
  $('.main-loader-container').hide();

  if (navigator.geolocation) {
    let coords;
    navigator.geolocation.getCurrentPosition(pos => {
      coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      };
      // Save current coords to a session storage
      Storage.saveCoords(coords);
      // Set the values for hidden coords-form  (used to get the country data based on users coords )
      $('#lat').val(coords.latitude);
      $('#lng').val(coords.longitude);

      // If currentLocation obj exists in web storage, use it to display user's country data
      // ... else send request and display and save newly received country data in the web storage
      if (sessionStorage.currentLocation) {
        Ui.displayData(Storage.loadFromStorage(sessionStorage.currentLocation));
      } else {
        getData(url, $('#coords').serialize(), displayCurrentLocation);
      }
    });
  }

  $('#country-form').on('submit', function (e) {
    e.preventDefault();
    if ($('#country').val() !== '') {
      if (localStorage.countries) {
        // Search local storage for matching country name or code, if found display country data,
        // ... else send request fo get the country data
        const country = findCountryInStorage(localStorage.countries, $('#country').val());
        if (country) {
          // console.log(`Load ${country.name} data from storage`);
          Ui.displayData(country);
          return;
        } else {
          $('.modal-body').html(Ui.loader);
          getData(url, $('#country-form').serialize(), selectMatchingCountry);
          return;
        }
      }
      $('#display').html(Ui.loader);
      getData(url, $('#country-form').serialize(), selectMatchingCountry);
    } else {
      return;
    }
  });

  // Clear input field on focus
  $('#country').focus(function () {
    $('#country').val('');
  });

  $('#display').on('click', function (e) {
    // Display currency modal
    if (e.target.classList.contains('currency')) {
      try {
        // Search for currency obj in the web storage, if searched obj exists display data,
        if (sessionStorage.exchangeRates) {
          let arr = Storage.loadFromStorage(sessionStorage.exchangeRates);
          const currName = $('#currency-form [name=base]').val();
          if (arr.some(c => c.base === currName)) {
            arr = arr.filter(c => c.base === currName);
            Ui.displayCurrencyModal(arr[0]);
            return;
          }
        }
        //... else send http request to get the data, then display and save received data
        getData(url, $('#currency-form').serialize(), Ui.displayCurrencyModal);
      } catch (e) {
        console.log(e.message);
      }
    }

    // Display weather modal
    if (e.target.classList.contains('weather')) {
      try {
        if (sessionStorage.currentWeather) {
          let weatherArr = Storage.loadFromStorage(sessionStorage.currentWeather);
          let weatherFormLocation = $('#weather-form [name=location]').val();
          for (let l of weatherArr) {
            if (weatherFormLocation === `${l.name},${l.sys.country}`) {
              return Ui.displayWeatherModal(l);
            }
          }
        }
        getData(url, $('#weather-form').serialize(), Ui.displayWeatherModal);
      } catch (e) {
        console.log(e.message);
      }
    }
  });

  // 'About' modal
  $('#about').on('click', Ui.displayAbout);

  // Clear modal on close
  $('.modal-close').on('click', function () {
    $('.modal-title').html('');
    $('.modal-body').html(Ui.loader);
  });
});

// Save and display country data (current location)
function displayCurrentLocation(result) {
  Storage.saveCurrentLocation(result);
  Ui.displayData(result);
}

// Callback func. for http request. Select one country object from array by iso number or by name
function selectMatchingCountry(result) {
  if (result.status === 404) {
    $('#country').val('');
    return;
  }
  let nameOrCode = $('#country').val().toUpperCase();
  nameOrCode = nameOrCode.trim();
  if (result.length > 1) {
    result.forEach(country => {
      const countryName = country.name.toUpperCase();
      if (country.alpha2Code === nameOrCode || country.alpha3Code === nameOrCode) {
        result = country;
      } else if (countryName === nameOrCode) {
        result = country;
      } else if (countryName.startsWith(nameOrCode)) {
        result = country;
      } else {
        return;
      }
      return result;
    });
  } else {
    result = result[0];
  }
  // console.log(result);
  Ui.displayData(result);
}

// Find matching country in the array of objects stored in local storage
function findCountryInStorage(storageObj, formVal) {
  let storageObjArr = Storage.loadFromStorage(storageObj);
  let val = formVal.toUpperCase();
  val = val.trim();
  let result = null;
  storageObjArr.forEach(c => {
    const cName = c.name.toUpperCase();
    if (c.alpha2Code === val || c.alpha3Code === val) {
      result = c;
    } else if (cName === val) {
      result = c;
    } else if (cName.startsWith(val)) {
      result = c;
    } else {
      return;
    }
  });
  return result;
}
