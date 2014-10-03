var map = undefined;
var mapMarkers = [];
var mySocket = undefined;

function initialize() {
  map = createMap();
  hookBaseConnectionHandler();
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

function loadScript() {
  var script  = document.createElement('script');
  script.type = 'text/javascript';
  script.src  = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=initialize';

  document.body.appendChild(script);
}

function removeMarkers() {
  // TODO: this isn't the correct way to delete markers, fix it.
  mapMarkers.forEach(function(marker) {
    marker.setMap(null);
  });
  mapMarkers = [];
}


function hookBaseConnectionHandler() {
  mySocket = new HookBase("ws:0.0.0.0:8125");

  mySocket.onOpen(function() {
    mySocket.getAll(function(data) {
      populateMarkers(data);
    });
  });

  mySocket.onDataChange(function(data) {
    populateMarkers(data);
  });
}

function countryCount(country_objects) {
  var country_codes = _.values(country_objects).filter(function(key) {
    // TODO: fix this.
    return key != "dataChanged" && key != "respondingAll";
  });
  var counts = {};

  for(var i = 0; i< country_codes.length; i++) {
      var num = country_codes[i];
      counts[num] = counts[num] ? counts[num]+1 : 1;
  }
  return counts;
}

function populateMarkers(data) {
  removeMarkers();
  var country_count = countryCount(data);
  var selected_countries = _.keys(country_count);

  selected_countries.map(function(country_code) {
    var marker = createMarker(country_code);
    marker.setMap(map);
    mapMarkers.push(marker);
  });
}
