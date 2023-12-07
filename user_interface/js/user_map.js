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


    // Function to fade out element
    function elementAusblenden() {
        var titelDiv = document.getElementById('titelDiv_user');
        if (titelDiv) {
          titelDiv.style.opacity = '0';
        }
      }
    
    setTimeout(elementAusblenden, 5000); // Wait 5 sec then fade out

    //-------------------------------------------- Add data from Geoserver using WFS --------------------------------------------

    // user point data

    let wfsUrl_point = 'https://ikgeoserv.ethz.ch/geoserver/GTA23_project/wfs?SERVICE=wfs&Version=1.1.1&REQUEST=GetFeature&TYPENAME=GTA23_project:gta_p4_user_point_data&OUTPUTFORMAT=application/json';

    var user_points = L.layerGroup(); // Create layerGroup to hold points
    $.ajax({
        type: "GET",
        url: wfsUrl_point+'&FILTER=<Filter><PropertyIsEqualTo><PropertyName>username</PropertyName><Literal>'+userID+'</Literal></PropertyIsEqualTo></Filter>',
        dataType: 'json',
        
        success: function (data) {
            if (data.features) {
                data.features.forEach(function (feature) {
                    let coord = feature.geometry.coordinates;
                    
                    // Create circle marker for each coordinate
                    var circle = L.circle([coord[1], coord[0]], {
                        radius: 200, 
                        fillColor: 'purple', 
                        fillOpacity: 0.8, 
                        opacity: 0
                    });
                    circle.addTo(user_points); // add to layerGroup
                    circle.addTo(map);
                });
                
            }
        },
    });


    // trajectory data
    let wfsUrl_trajectory = 'https://ikgeoserv.ethz.ch/geoserver/GTA23_project/wfs?SERVICE=wfs&Version=1.1.1&REQUEST=GetFeature&TYPENAME=GTA23_project:gta_p4_user_trajectory_data&OUTPUTFORMAT=application/json';

    var user_trajectory = L.layerGroup();
    
    $.ajax({
        type: "GET",
        url: wfsUrl_trajectory+'&FILTER=<Filter><PropertyIsEqualTo><PropertyName>username</PropertyName><Literal>'+userID+'</Literal></PropertyIsEqualTo></Filter>',
        dataType: 'json',
        
        success: function (data) {
            
            if (data.features && data.features.length > 0) {
                var coordinates = data.features[0].geometry.coordinates;

                if (coordinates && coordinates.length >= 2) {
                    var latLngArray = coordinates.map(function (coord) {
                        return L.latLng(coord[1], coord[0]);
                    });

                    var polyline = L.polyline(latLngArray, {
                        color: 'blue', 
                        weight: 4
                    });

                    polyline.addTo(map);
                }

                
    
            } 
        } 
    });
    



    
    
    //Function to zoom to current position 
    /*
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
    */



    
        
});
