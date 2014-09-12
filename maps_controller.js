var map = {};
var map_markers = [];

function initialize() {
  map = createMap();
  addNLMarker(map);
}

function createMap() {
  // centered on NL.
  var coords = countryCodes['NL'];

  var mapOptions = {
    center: { lat: coords[0], lng: coords[1] },
    zoom: 3
  };

  return new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function createMarker(country_code) {
  var coords = countryCodes[country_code];
  return new google.maps.Marker({
    position: { lat: coords[0], lng: coords[1] },
    title: coords[2]
  });
}

function addNLMarker(map) {
  var coords = countryCodes['NL'];
  new google.maps.Marker({
    position: { lat: coords[0], lng: coords[1] },
    map: map,
    title: 'Click to zoom'
  });
}

function loadScript() {
  var script  = document.createElement('script');
  script.type = 'text/javascript';
  script.src  = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=initialize';

  document.body.appendChild(script);
}

function countryCount(country_objects) {
  console.log(country_objects);
  var country_codes = _.keys(country_objects).map(function(key) { return country_objects[key]["country_code"]; });
  var counts = {};

  for(var i = 0; i< country_codes.length; i++) {
      var num = country_codes[i];
      counts[num] = counts[num] ? counts[num]+1 : 1;
  }
  return counts;
}

function remove_markers() {
  // TODO: this isn't the correct way to delete markers, fix it.
  map_markers.forEach(function(marker) {
    marker.setMap(null);
  });
  map_markers = [];
}

var countriesRef = new Firebase('https://popping-inferno-944.firebaseio.com/livecountries');

countriesRef.on('value', function (snapshot) {
  remove_markers();
  var country_count = countryCount(snapshot.val());
  console.log(country_count);
  var selected_countries = _.keys(country_count);

  selected_countries.map(function(country_code) {
    marker = createMarker(country_code);
    marker.setMap(map);
    map_markers.push(marker);
  });
}, function (errorObject) {
  console.log('The read failed: ' + errorObject.code);
});
