  $(document).ready(function() {

    // Load basemap
    var baseMap = L.tileLayer.wms("https://wms.geo.admin.ch/", {
        layers: 'ch.swisstopo.pixelkarte-grau',
        format: 'image/jpeg',
        attribution: '&copy; <a href="https://www.swisstopo.admin.ch/en/home.html">swisstopo</a>',
        opacity: 0.7
    });

    // Load provider maps
    var saltMap = L.tileLayer('https://mapserver.salt.ch/public/gmaps/2G3G4G4G+@GoogleMapsCompatible/{z}/{x}/{y}.png', {
        format: 'image/png',
        attribution: 'Salt',
        opacity: 0.5
    });
    var sunriseMap = L.tileLayer('https://maps.sunrise.ch/cgi-bin/mapserv?map=/opt/app/data/sunrise_coverages_2019.map&LAYERS=coverage&mode=tile&tilemode=gmap&tile={x}+{y}+{z}', {
        attribution: 'Sunrise',
        opacity: 0.5
    });
    var swisscomMap = L.tileLayer('https://scmplc.begasoft.ch/plcapp/netzabdeckung/swisscom?layer=umts;lte;lteAdvanced&zoom={z}&x={x}&y={y}', {
        attribution: 'Swisscom',
        opacity: 0.5
    });

    // Define layer groups
    var swisscom = L.layerGroup();
    swisscom.addLayer(swisscomMap);
    var sunrise = L.layerGroup();
    sunrise.addLayer(sunriseMap);
    var salt = L.layerGroup();
    salt.addLayer(saltMap);

    // Define bounds of switzerland
    var switzerlandBounds = L.latLngBounds(
        L.latLng(45.817, 5.967), // Southwest coordinates
        L.latLng(47.808, 10.492) // Northeast coordinates
    );
    
    // Define map
    var map = L.map('map', {
        center: [46.408375, 8.507669],
        zoom: 8,
        minZoom: calculateMinZoom() /*7.5*/,
        zoomSnap: 0.5,
        maxBounds: switzerlandBounds.pad(0.1),
        layers: [baseMap]
    }).fitBounds(switzerlandBounds);

    // Dynamically adjust zoom to screen size
    function calculateMinZoom() {
        if (window.innerWidth <= 768) {
            return 7.5; // Min-Zoom for mobile device
        } else {
            return 8.5; // Min-Zoom for desktop-device
        }
    }
    
    // Respond to changes in screen size
    window.addEventListener('resize', function () {
        map.setMinZoom(calculateMinZoom());
    });
        
    //-------------------------------------------- Add data from Geoserver using WFS --------------------------------------------

    let wfs_url_point = 'https://ikgeoserv.ethz.ch/geoserver/GTA23_project/wfs?SERVICE=wfs&Version=1.1.1&REQUEST=GetFeature&TYPENAME=GTA23_project:gta_p4_user_point_data&OUTPUTFORMAT=application/json';

    // Include swisscom user data into swisscom map
    var swisscom_user = L.layerGroup();
    var swisscom_colors = {0: "#FFFFFF", 1: "#FFFFFF", 2: "#FFFFFF", 3: "#c06161", 4: "#777fa1"};
    $.ajax({
        type: "GET",
        url: wfs_url_point + '&FILTER=<Filter><And><PropertyIsEqualTo><PropertyName>provider</PropertyName><Literal>AS3303 Swisscom (Schweiz) AG</Literal></PropertyIsEqualTo><PropertyIsEqualTo><PropertyName>in_train</PropertyName><Literal>false</Literal></PropertyIsEqualTo></And></Filter>',
        dataType: 'json',
        success: function (data) {
            if (data.features) {
                data.features.forEach(function (feature) {
                    let coord = feature.geometry.coordinates;
                    
                    // Create circle for each point
                    var circle = L.circle([coord[1], coord[0]], {
                        radius: 90,
                        fillColor: swisscom_colors[feature.properties.netspeed],
                        fillOpacity: 0.8, 
                        opacity: 0
                    });
                    circle.addTo(swisscom_user); 
                });
                swisscom.addLayer(swisscom_user); // add to swisscom layerGroup
                
            }
        },
    });

    // Include salt user data into salt map
    var salt_user = L.layerGroup();
    var salt_color = {0: "#FFFFFF", 1: "#FFFFFF", 2: "#FFFFFF", 3: "#CCCC99", 4: "#96b681"};
    $.ajax({
        type: "GET",
        url: wfs_url_point + '&FILTER=<Filter><And><PropertyIsEqualTo><PropertyName>provider</PropertyName><Literal>AS15796 Salt Mobile SA</Literal></PropertyIsEqualTo><PropertyIsEqualTo><PropertyName>in_train</PropertyName><Literal>false</Literal></PropertyIsEqualTo></And></Filter>',
        dataType: 'json',
        success: function (data) {
            if (data.features) {
                data.features.forEach(function (feature) {
                    let coord = feature.geometry.coordinates;

                    // Create circle for each point
                    var circle = L.circle([coord[1], coord[0]], {
                        radius: 90, 
                        fillColor: salt_color[feature.properties.netspeed],
                        fillOpacity: 0.8, 
                        opacity: 0
                    });
                    circle.addTo(salt_user); 
                });
                salt.addLayer(salt_user); // add to salt layerGroup
            }
        },
    });

    // Include sunrise user data into sunrise map
    var sunrise_user = L.layerGroup();
    var sunrise_color = {0: "#FFFFFF", 1: "#FFFFFF", 2: "#FFFFFF", 3: "#f5b2c4", 4: "#ef7f9d"};
    $.ajax({
        type: "GET",
        url: wfs_url_point + '&FILTER=<Filter><PropertyIsEqualTo><PropertyName>provider</PropertyName><Literal>AS6730 Sunrise GmbH</Literal></PropertyIsEqualTo></Filter>',
        dataType: 'json',
        success: function (data) {
            if (data.features) {
                data.features.forEach(function (feature) {
                    let coord = feature.geometry.coordinates;
                    
                    // Create circle for each point
                    var circle = L.circle([coord[1], coord[0]], {
                        radius: 90,
                        fillColor: sunrise_color[feature.properties.netspeed],
                        fillOpacity: 0.8, 
                        opacity: 0
                    });
                    circle.addTo(sunrise_user); 
                });
                sunrise.addLayer(sunrise_user); // add to sunrise layerGroup
            }
        },
    });

    //-------------------------------------------- Add layers --------------------------------------------
    // Overlays of provider maps
    var overlays = {
        "Swisscom": swisscom,
        "Sunrise": sunrise,
        "Salt": salt,
    };

    // User controls setup
    baseMap.addTo(map);
    var layerControl = L.control.layers(overlays, null).addTo(map); //Multiple map layers visible
    L.control.scale({ imperial: false }).addTo(map); 

    //-------------------------------------------- Define and update legend --------------------------------------------
    var activeLayers = [];
    function updateLegend(legendDiv) {
        legendDiv.innerHTML = '<b> Network Coverage Map </b>'; 
        activeLayers.forEach(function (layer) {
            if (layer === baseMap) {
                legendDiv.innerHTML += '';
            } 
            
            // Legend salt map
            else if (layer === saltMap) {
                // 4G+
                var legendContent1 = document.createElement('div');
                legendContent1.className = 'legend-content';
                legendContent1.style.backgroundColor = '#65a63c';

                var legendDescription1 = document.createElement('div');
                legendDescription1.className = 'legend-description';
                legendDescription1.innerHTML = '4G+';

                var legendContainer1 = document.createElement('div');
                legendContainer1.className = 'legend-container';
                legendContainer1.appendChild(legendContent1);
                legendContainer1.appendChild(legendDescription1);

                legendDiv.appendChild(legendContainer1);

                // 4G
                var legendContent2 = document.createElement('div');
                legendContent2.className = 'legend-content';
                legendContent2.style.backgroundColor = '#87b578';

                var legendDescription2 = document.createElement('div');
                legendDescription2.className = 'legend-description';
                legendDescription2.innerHTML = '4G';

                var legendContainer2 = document.createElement('div');
                legendContainer2.className = 'legend-container';
                legendContainer2.appendChild(legendContent2);
                legendContainer2.appendChild(legendDescription2);

                legendDiv.appendChild(legendContainer2);

                // 3G
                var legendContent3 = document.createElement('div');
                legendContent3.className = 'legend-content';
                legendContent3.style.backgroundColor = '#b1c697';

                var legendDescription3 = document.createElement('div');
                legendDescription3.className = 'legend-description';
                legendDescription3.innerHTML = '3G';

                var legendContainer3 = document.createElement('div');
                legendContainer3.className = 'legend-container';
                legendContainer3.appendChild(legendContent3);
                legendContainer3.appendChild(legendDescription3);

                legendDiv.appendChild(legendContainer3);
            } 

            // Legend sunrise map
            else if (layer === sunriseMap) {
                // 4G+
                var legendContent1 = document.createElement('div');
                legendContent1.className = 'legend-content';
                legendContent1.style.backgroundColor = '#ea4d77';
                legendDiv.appendChild(legendContent1);

                var legendDescription1 = document.createElement('div');
                legendDescription1.className = 'legend-description';
                legendDescription1.innerHTML = '4G+';
                legendDiv.appendChild(legendDescription1);

                var legendContainer1 = document.createElement('div');
                legendContainer1.className = 'legend-container';
                legendContainer1.appendChild(legendContent1);
                legendContainer1.appendChild(legendDescription1);

                legendDiv.appendChild(legendContainer1);

                // 4G
                var legendContent2 = document.createElement('div');
                legendContent2.className = 'legend-content';
                legendContent2.style.backgroundColor = '#ef7f9d';
                legendDiv.appendChild(legendContent2);

                var legendDescription2 = document.createElement('div');
                legendDescription2.className = 'legend-description';
                legendDescription2.innerHTML = '4G';
                legendDiv.appendChild(legendDescription2);

                var legendContainer2 = document.createElement('div');
                legendContainer2.className = 'legend-container';
                legendContainer2.appendChild(legendContent2);
                legendContainer2.appendChild(legendDescription2);

                legendDiv.appendChild(legendContainer2);

                // 3G
                var legendContent3 = document.createElement('div');
                legendContent3.className = 'legend-content';
                legendContent3.style.backgroundColor = '#f5b2c4';
                legendDiv.appendChild(legendContent3);

                var legendDescription3 = document.createElement('div');
                legendDescription3.className = 'legend-description';
                legendDescription3.innerHTML = '3G';
                legendDiv.appendChild(legendDescription3);

                var legendContainer3 = document.createElement('div');
                legendContainer3.className = 'legend-container';
                legendContainer3.appendChild(legendContent3);
                legendContainer3.appendChild(legendDescription3);

                legendDiv.appendChild(legendContainer3);
            } 
            
            // Legend swisscom map
            else if (layer === swisscomMap) {
                // 4G LTE advanced  
                var legendContent2 = document.createElement('div');
                legendContent2.className = 'legend-content';
                legendContent2.style.backgroundColor = '#001155';
                legendDiv.appendChild(legendContent2);

                var legendDescription2 = document.createElement('div');
                legendDescription2.className = 'legend-description';
                legendDescription2.innerHTML = '4G+';
                legendDiv.appendChild(legendDescription2);
                
                var legendContainer2 = document.createElement('div');
                legendContainer2.className = 'legend-container';
                legendContainer2.appendChild(legendContent2);
                legendContainer2.appendChild(legendDescription2);

                legendDiv.appendChild(legendContainer2);
                
                // 4G LTE
                var legendContent1 = document.createElement('div');
                legendContent1.className = 'legend-content';
                legendContent1.style.backgroundColor = '#0851da';
                legendDiv.appendChild(legendContent1);

                var legendDescription1 = document.createElement('div');
                legendDescription1.className = 'legend-description';
                legendDescription1.innerHTML = '4G';
                legendDiv.appendChild(legendDescription1);

                var legendContainer1 = document.createElement('div');
                legendContainer1.className = 'legend-container';
                legendContainer1.appendChild(legendContent1);
                legendContainer1.appendChild(legendDescription1);

                legendDiv.appendChild(legendContainer1);


                // 3G
                var legendContent3 = document.createElement('div');
                legendContent3.className = 'legend-content';
                legendContent3.style.backgroundColor = '#be0000';
                legendDiv.appendChild(legendContent3);

                var legendDescription3 = document.createElement('div');
                legendDescription3.className = 'legend-description';
                legendDescription3.innerHTML = '3G';
                legendDiv.appendChild(legendDescription3);
                
                var legendContainer3 = document.createElement('div');
                legendContainer3.className = 'legend-container';
                legendContainer3.appendChild(legendContent3);
                legendContainer3.appendChild(legendDescription3);

                legendDiv.appendChild(legendContainer3);
            }
        });
    }

    // Update legend when layer added
    map.on('layeradd', function (event) {
        var activeLayer = event.layer;

        if (!activeLayers.includes(activeLayer)) {
            activeLayers.push(activeLayer);
        }

        updateLegend(legend);
    });

    // Update legend when layer removed
    map.on('layerremove', function (event) {
        var removedLayer = event.layer;

        activeLayers = activeLayers.filter(function (layer) {
            return layer !== removedLayer;
        });

        updateLegend(legend);
    });
});
