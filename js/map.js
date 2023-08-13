export default class CreateMap {
  constructor() {
    this.map = L.map('map').setView([51.0, -1.0], 5);
    this.marker = L.marker();
    this.polyline = L.polyline([]);
  }

  createMap() {
    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, {
      attribution,
      noWrap: true,
      maxZoom: 17,
      minZoom: 2,
      worldCopyJump: true,
      maxBoundsViscosity: 1.0
    });
    this.map.setMaxBounds([
      [-90, -180],
      [90, 180]
    ]);
    tiles.addTo(this.map);
  }

  setMarker(lat, lng, popup = `<p>Lat:${lat}, Lng:${lng}</p>`) {
    this.map.setView([lat, lng], 5);
    this.marker.remove();

    const iconStyles = `
    background-color: #DF691A;
    width: 1.5rem;
    height: 1.5rem;
    display: block;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF`;

    const icon = L.divIcon({
      className: 'my-custom-pin',
      iconAnchor: [12, 26],
      labelAnchor: [-6, 0],
      popupAnchor: [0, -16],
      html: `<span style="${iconStyles}"></span>`
    });

    this.marker = L.marker([lat, lng], { icon: icon }).addTo(this.map);
    this.marker.bindPopup(popup.toString());
  }

  displayGeoJsonPolygon(array, obj) {
    const geojsonFeature = {
      type: 'Feature',
      properties: {
        name: obj.properties.ADMIN,
        amenity: obj.properties.ADMIN,
        popupContent: obj.properties.ADMIN
      },
      geometry: {
        type: 'Polygon',
        coordinates: array
      }
    };

    this.polyline.remove();
    this.polyline = L.geoJSON(geojsonFeature).addTo(this.map);
    // zoom in / out to fit country within the bounds of a map
    this.map.fitBounds(this.polyline.getBounds(), { padding: [0, 0] });

  }

  getGeoJson(map, code) {
    $.getJSON('../countries.geojson', function (result) {
      const polyObj = Array.from(result.features).filter(
        c => c.properties['ISO_A3'] === code
      )[0];
      const coordsArr = polyObj.geometry.coordinates;
      // some arrays in countries.geojson are one level deeper (3 levels)
      // - to  prevent errors and display polygon array must be flatten by 1 level
      try {
        map.displayGeoJsonPolygon(coordsArr, polyObj);
      } catch (error) {
        map.displayGeoJsonPolygon(coordsArr.flat(), polyObj);
      }
    });
  }
}
