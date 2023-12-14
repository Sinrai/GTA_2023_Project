$(document).ready(function() {
    document.getElementById("close_map").addEventListener("click", function() {
        loadContent('analysis.html');
    });

    var baseMap = L.tileLayer.wms("https://wms.geo.admin.ch/", {
        layers: 'ch.swisstopo.pixelkarte-grau',
        format: 'image/jpeg',
        attribution: '&copy; <a href="https://www.swisstopo.admin.ch/en/home.html">swisstopo</a>',
        opacity: 0.7
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

    let wfs_url_point = 'https://ikgeoserv.ethz.ch/geoserver/GTA23_project/wfs?SERVICE=wfs&Version=1.1.1&REQUEST=GetFeature&TYPENAME=GTA23_project:gta_p4_user_point_data&OUTPUTFORMAT=application/json';

    var geojsonLayer = L.geoJSON(null, {
        style: function (feature) {
            switch (feature.properties.netspeed) {
                case 4: // Netspeed 4 (4G)
                    return {
                        fillColor: "#33CC33",  // Green
                        fillOpacity: 0.8
                    };
                case 3: // Netspeed 3 (3G)
                    return {
                        fillColor: "#33CCCC",  // Turqouise
                        fillOpacity: 0.8
                    };
                case 2: // Netspeed 2 (2G)
                    return {
                        fillColor: "#FF6666",  // red
                        fillOpacity: 0.8
                    };
                default:
                    return {
                        fillColor: "#fff000",  
                        fillOpacity: 0 //invisible
                    };
            }
        },

        pointToLayer: function (feature, latlng) {
            let coord = feature.geometry.coordinates;
            return L.circle([coord[1], coord[0]], {
                radius: 80, 
                opacity: 0
            });
        }
    });

    // fetch GeoJSON data filtered by userID
    $.ajax({
        type: "GET",
        url: wfs_url_point + '&FILTER=<Filter><PropertyIsEqualTo><PropertyName>username</PropertyName><Literal>'+userID+'</Literal></PropertyIsEqualTo></Filter>',
        dataType: 'json',

        success: function (data) {
            geojsonLayer.addData(data); 
            geojsonLayer.addTo(map);
        }
    });


    // trajectory data
    let wfs_url_trajectory = 'https://ikgeoserv.ethz.ch/geoserver/GTA23_project/wfs?SERVICE=wfs&Version=1.1.1&REQUEST=GetFeature&TYPENAME=GTA23_project:gta_p4_user_trajectory_data&OUTPUTFORMAT=application/json';

    var user_trajectory = L.layerGroup();

    $.ajax({
        type: "GET",
        url: wfs_url_trajectory + '&FILTER=<Filter><PropertyIsEqualTo><PropertyName>username</PropertyName><Literal>' + userID + '</Literal></PropertyIsEqualTo></Filter>',
        dataType: 'json',
    
        success: function (data) {
            if (data.features && data.features.length > 0) {
                data.features.forEach(function (feature) {
                    var coordinates = feature.geometry.coordinates;
    
                    if (coordinates && coordinates.length >= 2) {
                        var latLngArray = coordinates.map(function (coord) {
                            return L.latLng(coord[1], coord[0]);
                        });
    
                        var polyline = L.polyline(latLngArray, {
                            color: '#0066CC',
                            weight: 4
                        });
    
                        polyline.addTo(user_trajectory);
                    }
                });
                user_trajectory.addTo(map);
            }
        }
    });

    // Legend for user map
    function updateLegend(legendDiv) {
        //4G
        var legendContent4G = document.createElement('div');
        legendContent4G.className = 'legend-content';
        legendContent4G.style.backgroundColor = '#33CC33';

        var legendDescription4G = document.createElement('div');
        legendDescription4G.className = 'legend-description';
        legendDescription4G.innerHTML = '4G - 5G';

        var legendContainer4G = document.createElement('div');
        legendContainer4G.className = 'legend-container';
        legendContainer4G.appendChild(legendContent4G);
        legendContainer4G.appendChild(legendDescription4G);

        legendDiv.appendChild(legendContainer4G);

        // 3G
        var legendContent3G = document.createElement('div');
        legendContent3G.className = 'legend-content';
        legendContent3G.style.backgroundColor = '#33CCCC';

        var legendDescription3G = document.createElement('div');
        legendDescription3G.className = 'legend-description';
        legendDescription3G.innerHTML = '3G';

        var legendContainer3G = document.createElement('div');
        legendContainer3G.className = 'legend-container';
        legendContainer3G.appendChild(legendContent3G);
        legendContainer3G.appendChild(legendDescription3G);

        legendDiv.appendChild(legendContainer3G);

        // < 3G
        var legendContent2G = document.createElement('div');
        legendContent2G.className = 'legend-content';
        legendContent2G.style.backgroundColor = '#FF6666';

        var legendDescription2G = document.createElement('div');
        legendDescription2G.className = 'legend-description';
        legendDescription2G.innerHTML = 'No connection';

        var legendContainer2G = document.createElement('div');
        legendContainer2G.className = 'legend-container';
        legendContainer2G.appendChild(legendContent2G);
        legendContainer2G.appendChild(legendDescription2G);

        legendDiv.appendChild(legendContainer2G);

        // Trajectories
        var legendContentT = document.createElement('div');
        legendContentT.className = 'legend-content';
        legendContentT.style.backgroundColor = '#0066CC';

        var legendDescriptionT = document.createElement('div');
        legendDescriptionT.className = 'legend-description';
        legendDescriptionT.innerHTML = 'Your trajectories';

        var legendContainerT = document.createElement('div');
        legendContainerT.className = 'legend-container';
        legendContainerT.appendChild(legendContentT);
        legendContainerT.appendChild(legendDescriptionT);

        legendDiv.appendChild(legendContainerT);
    }

    updateLegend(legendUser)
});
