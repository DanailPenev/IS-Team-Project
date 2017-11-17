var mode = "<h1 class=\"cover-heading\">Select a mode</h1>\
            <p class=\"lead\">\
              <button onclick=\"map()\" class=\"btn btn-lg btn-secondary\">Map</button>\
              <button onclick=\"stats()\" class=\"btn btn-lg btn-secondary\">Stats</button>\
            </p>";

var xmlOpened;

$(document).ready(function() {
    var form = document.getElementById('my-form');
	if (form.attachEvent) {
    	form.attachEvent("submit", openFile);
	} else {
    	form.addEventListener("submit", openFile);
	}
});

function parseFile() {
	console.log(xmlOpened);
	document.getElementById("content").innerHTML = mode;
}

function newMap(xml) {
      var mapOptions = {
          zoom: 5,
          center: new google.maps.LatLng(46.003257147967815399169921875, 8.95168307237327098846435546875),
          mapTypeId: 'roadmap'
      };
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      var points = [];
        var bounds = new google.maps.LatLngBounds();
         $(xml).find("trkpt").each(function() {
                var lat = $(this).attr("lat");
                var lon = $(this).attr("lon");
                var p = new google.maps.LatLng(lat, lon);
                points.push(p);
                bounds.extend(p);
        });
         var poly = new google.maps.Polyline({
          path: points,
          strokeColor: '#FF00AA',
          strokeOpacity: .7,
          strokeWeight: 4
        });
        map.fitBounds(bounds);
        poly.setMap(map);
}

function initMap() {
	var mapOptions = {
			zoom: 5,
			center: new google.maps.LatLng(46.003257147967815399169921875, 8.95168307237327098846435546875),
			mapTypeId: 'roadmap'
	};
	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function openFile(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function() {
      xmlOpened = reader.result;
    };
    parseFile();
};