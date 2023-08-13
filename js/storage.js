export default class Storage {
  //saveToStorage(searched object, object to compare, value to compare, [optional storage type - default : session storage])
  //create new object array in the web storage or add data to the existing array of objects
  static saveToStorage(storageObj, objToCompare, objKey, storage = sessionStorage) {
    if (storage[storageObj]) {
      const arr = JSON.parse(storage[storageObj]);
      if (!arr.some(item => item[objKey] === objToCompare[objKey])) {
        storage.setItem(`${storageObj}`, JSON.stringify([...arr, objToCompare]));
      }
    } else {
      storage.setItem(`${storageObj}`, JSON.stringify([objToCompare]));
    }
  }

  static saveCoords(coords) {
    sessionStorage.setItem('coords', JSON.stringify(coords));
  }

  static saveCurrentLocation(result) {
    sessionStorage.setItem('currentLocation', JSON.stringify(result));
  }

  static loadFromStorage(storageObj) {
    return JSON.parse(storageObj);
  }
}
