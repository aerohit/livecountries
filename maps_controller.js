function initialize() {
  var map = createMap();
  addNLMarker(map);

  var selected_countries = ['IN', 'ES', 'FR'];

  selected_countries.map(function(country_code) {
    marker = createMarker(country_code);
    marker.setMap(map);
  });
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

var countriesRef = new Firebase('https://popping-inferno-944.firebaseio.com/livecountries');

countriesRef.on('value', function (snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log('The read failed: ' + errorObject.code);
});
