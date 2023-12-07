$(document).ready(function() {
    document.getElementById("close_map").addEventListener("click", function() {
        loadContent('analysis.html');
    });

    var baseMap = L.tileLayer.wms("https://wms.geo.admin.ch/", {
        layers: 'ch.swisstopo.pixelkarte-grau',
        format: 'image/jpeg',
        attribution: '&copy; <a href="https://www.swisstopo.admin.ch/en/home.html">swisstopo</a>'
    });

    var switzerlandBounds = L.latLngBounds(
        L.latLng(45.817, 5.967), // Southwest coordinates
        L.latLng(47.808, 10.492) // Northeast coordinates
    );

    var map = L.map('map', {
        center: [46.408375, 8.507669],
        zoom: 8,
        minZoom: 7.5,
        zoomSnap: 0.5,
        maxBounds: switzerlandBounds.pad(0.1),
        layers: [baseMap]
    }).fitBounds(switzerlandBounds);

    baseMap.addTo(map);


    
    //Function to zoom to current position 
    function updateMap(position) {
        var userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
        map.setView(userLatLng, 13);
        var marker = L.marker(userLatLng).addTo(map);
        console.log('Current position:', position);
    }

    function errorPosition(error) {
        console.error('Error getting current position:', error);
    }

    function startTracking() {
        navigator.geolocation.watchPosition(updateMap, errorPosition, {
            enableHighAccuracy: true
        });
    }

    startTracking();


    // Function to fade out element
    function elementAusblenden() {
        var titelDiv = document.getElementById('titelDiv_user');
        if (titelDiv) {
          titelDiv.style.opacity = '0';
        }
      }
    
      setTimeout(elementAusblenden, 5000); // Wait 5 sec then fade out

    /*
    //Function to zoom to current position (doesn't work)
    getCurrentPosition()
        .then(position => {
            var userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
            map.setView(userLatLng, 13); 
            var marker = L.marker(userLatLng).addTo(map);
            console.log('Current position:', position);
        })
        .catch(error => {
            console.error('Error getting current position:', error);
        });
    */
        
});
