// the next screen that will be loaded
var mode = "<h1 class=\"cover-heading\">Select a mode</h1>\
            <p class=\"lead\">\
              <button onclick=\"drawMap()\" class=\"btn btn-lg btn-secondary\">Map</button>\
              <button onclick=\"stats()\" class=\"btn btn-lg btn-secondary\">Stats</button>\
            </p>";

// Attach the form for file submission
$(document).ready(function() {
    var form = document.getElementById('my-form');
	if (form.attachEvent) {
    	form.attachEvent("submit", openFile);
	} else {
    	form.addEventListener("submit", openFile);
	}
});

// read the uploaded file
function openFile() {
  var x = document.getElementById("exampleInputFile");
  if ('files' in x) {
    var file = x.files[0];
    var parts = file.name.split('.');
    var ext = parts[parts.length - 1];
    if (ext != 'gpx') {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(){
      window.xmlOpened = reader.result;
      showModePage();
    };
    reader.readAsText(file);
  }
};

// Load the next screen
function showModePage() {
	document.getElementById("content").innerHTML = mode;
}

// Draw the map with the Google API and remove previous elements on screen
function drawMap() {
    $("#removeme").css("visibility", "hidden");
    var element = document.getElementById("removeme");
    element.outerHTML = "";
    delete element;
    var mapElement = document.getElementById("map");
    mapElement.style.width = "100%";
    mapElement.style.height = "100%";
        var xml=window.xmlOpened;
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

// Draw the chart
function stats(){
  $("#removeme").css("visibility", "hidden");
  var element = document.getElementById("removeme");
    element.outerHTML = "";
    delete element;
  $("#chart").css("width", "100%");
  $("#chart").css("height", "40%");
  if (window.DOMParser){
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(window.xmlOpened, "text/xml");
  }
  else // Internet Explorer
  {
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
      xmlDoc.loadXML(txt);
  }
  var time = xmlDoc.getElementsByTagName("time");
  var times = []
  for (i=0; i<time.length; i++){
      times.push(time[i].innerHTML.split('T')[1].split('Z')[0].split('.')[0]);
  }
  times.shift();
  var elements = xmlDoc.getElementsByTagName("ele");
  var elevations = [];
  for (i=0; i<elements.length; i++){
      elevations.push(elements[i].innerHTML);
  }
  var points = [];
  for (i=0; i<times.length; i++){
    var point = new Object();
    point.x = times[i];
    point.y = elevations[i];
    points.push(point);
  }
  var ctx = document.getElementById("myChart");
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [
      {
        label: "Elevation over time",
        data: elevations,
        backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            fontColor: "white",
      }
      ]
    },
    options: {
      title: {
            display: true,
            text: 'Relationship between elevation and time for the file that was entered',
            fontColor: "white",
            fontSize: "25"
        },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Elevation in meters',
            fontColor: "white",
      }
      }],
      xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Local time',
            fontColor: "white",
      }
      }]
  }
    }
  });
};