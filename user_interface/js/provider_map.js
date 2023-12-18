  $(document).ready(function() {

    // Load basemap
    var baseMap = L.tileLayer.wms("https://wms.geo.admin.ch/", {
        layers: 'ch.swisstopo.pixelkarte-grau',
        format: 'image/jpeg',
        attribution: '&copy; <a href="https://www.swisstopo.admin.ch/en/home.html">swisstopo</a>',
        opacity: 0.7
    });

    var empty_layer = L.layerGroup();

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
    var swisscom_colors = {0: "#FFFFFF", 1: "#FFFFFF", 2: "#FFFFFF", 3: "#d17272", 4: "#757e9f"};
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
                
            }
        },
    });

    // Include salt user data into salt map
    var salt_user = L.layerGroup();
    var salt_color = {0: "#FFFFFF", 1: "#FFFFFF", 2: "#FFFFFF", 3: "#ccd7bf", 4: "#abcb96"};
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
            }
        },
    });

    // Include sunrise user data into sunrise map
    var sunrise_user = L.layerGroup();
    var sunrise_color = {0: "#FFFFFF", 1: "#FFFFFF", 2: "#FFFFFF", 3: "#ecb4c3", 4: "#eb7896"};
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
            }
        },
    });

    //-------------------------------------------- Add layers --------------------------------------------
    // Overlays of maps
    var provider_maps = {
        "None": empty_layer,
        "Swisscom": swisscomMap,
        "Sunrise": sunriseMap,
        "Salt": saltMap,
    };
    var user_data = {
        "Swisscom User Data": swisscom_user,
        "Sunrise User Data": sunrise_user,
        "Salt User Data": salt_user,
    };

    // User controls setup
    baseMap.addTo(map);
    empty_layer.addTo(map);
    var layerControl = L.control.layers(provider_maps, user_data).addTo(map); //Multiple map layers visible
    L.control.scale({ imperial: false }).addTo(map); 

    //-------------------------------------------- Define and update legend --------------------------------------------
    var activeLayers = [];
    function updateLegend(legendDiv) {
        legendDiv.innerHTML = '<b> Network Coverage Map </b>';
        if (activeLayers.includes(swisscomMap) || activeLayers.includes(swisscom_user)) {
            // 4G LTE advanced
            var legendContent2 = document.createElement('div');
            legendContent2.className = 'legend-content';
            // legendContent2.style.backgroundColor = '#757e9f';
            legendContent2.style.backgroundColor = '#5b6fb9';

            var legendDescription2 = document.createElement('div');
            legendDescription2.className = 'legend-description';
            legendDescription2.innerHTML = 'Swisscom 4G+';

            var legendContainer2 = document.createElement('div');
            legendContainer2.className = 'legend-container';
            legendContainer2.appendChild(legendContent2);
            legendContainer2.appendChild(legendDescription2);

            legendDiv.appendChild(legendContainer2);

            // 4G LTE
            var legendContent1 = document.createElement('div');
            legendContent1.className = 'legend-content';
            // legendContent1.style.backgroundColor = '#7498dd';
            legendContent1.style.backgroundColor = '#6393ee';

            var legendDescription1 = document.createElement('div');
            legendDescription1.className = 'legend-description';
            legendDescription1.innerHTML = 'Swisscom 4G';

            var legendContainer1 = document.createElement('div');
            legendContainer1.className = 'legend-container';
            legendContainer1.appendChild(legendContent1);
            legendContainer1.appendChild(legendDescription1);

            legendDiv.appendChild(legendContainer1);

            // 3G
            var legendContent3 = document.createElement('div');
            legendContent3.className = 'legend-content';
            // legendContent3.style.backgroundColor = '#d17272';
            legendContent3.style.backgroundColor = '#e35f5f';

            var legendDescription3 = document.createElement('div');
            legendDescription3.className = 'legend-description';
            legendDescription3.innerHTML = 'Swisscom 3G';

            var legendContainer3 = document.createElement('div');
            legendContainer3.className = 'legend-container';
            legendContainer3.appendChild(legendContent3);
            legendContainer3.appendChild(legendDescription3);

            legendDiv.appendChild(legendContainer3);
        }
        if (activeLayers.includes(sunriseMap) || activeLayers.includes(sunrise_user)) {
            // 4G+
            var legendContent1 = document.createElement('div');
            legendContent1.className = 'legend-content';
            // legendContent1.style.backgroundColor = '#eb7896';
            legendContent1.style.backgroundColor = '#f76e92';

            var legendDescription1 = document.createElement('div');
            legendDescription1.className = 'legend-description';
            legendDescription1.innerHTML = 'Sunrise 4G+';

            var legendContainer1 = document.createElement('div');
            legendContainer1.className = 'legend-container';
            legendContainer1.appendChild(legendContent1);
            legendContainer1.appendChild(legendDescription1);

            legendDiv.appendChild(legendContainer1);

            // 4G
            var legendContent2 = document.createElement('div');
            legendContent2.className = 'legend-content';
            // legendContent2.style.backgroundColor = '#eea0b5';
            legendContent2.style.backgroundColor = '#f994af';

            var legendDescription2 = document.createElement('div');
            legendDescription2.className = 'legend-description';
            legendDescription2.innerHTML = 'Sunrise 4G';

            var legendContainer2 = document.createElement('div');
            legendContainer2.className = 'legend-container';
            legendContainer2.appendChild(legendContent2);
            legendContainer2.appendChild(legendDescription2);

            legendDiv.appendChild(legendContainer2);

            // 3G
            var legendContent3 = document.createElement('div');
            legendContent3.className = 'legend-content';
            // legendContent3.style.backgroundColor = '#ecb4c3';
            legendContent3.style.backgroundColor = '#f8aabf';

            var legendDescription3 = document.createElement('div');
            legendDescription3.className = 'legend-description';
            legendDescription3.innerHTML = 'Sunrise 3G';

            var legendContainer3 = document.createElement('div');
            legendContainer3.className = 'legend-container';
            legendContainer3.appendChild(legendContent3);
            legendContainer3.appendChild(legendDescription3);

            legendDiv.appendChild(legendContainer3);
        }
        if (activeLayers.includes(saltMap) || activeLayers.includes(salt_user)) {
            // 4G+
            var legendContent1 = document.createElement('div');
            legendContent1.className = 'legend-content';
            // legendContent1.style.backgroundColor = '#abcb96';
            legendContent1.style.backgroundColor = '#a8d788';

            var legendDescription1 = document.createElement('div');
            legendDescription1.className = 'legend-description';
            legendDescription1.innerHTML = 'Salt 4G+';

            var legendContainer1 = document.createElement('div');
            legendContainer1.className = 'legend-container';
            legendContainer1.appendChild(legendContent1);
            legendContainer1.appendChild(legendDescription1);

            legendDiv.appendChild(legendContainer1);

            // 4G
            var legendContent2 = document.createElement('div');
            legendContent2.className = 'legend-content';
            // legendContent2.style.backgroundColor = '#b9d0b2';
            legendContent2.style.backgroundColor = '#b3dda6';

            var legendDescription2 = document.createElement('div');
            legendDescription2.className = 'legend-description';
            legendDescription2.innerHTML = 'Salt 4G';

            var legendContainer2 = document.createElement('div');
            legendContainer2.className = 'legend-container';
            legendContainer2.appendChild(legendContent2);
            legendContainer2.appendChild(legendDescription2);

            legendDiv.appendChild(legendContainer2);

            // 3G
            var legendContent3 = document.createElement('div');
            legendContent3.className = 'legend-content';
            // legendContent3.style.backgroundColor = '#ccd7bf';
            legendContent3.style.backgroundColor = '#cfe6b3';

            var legendDescription3 = document.createElement('div');
            legendDescription3.className = 'legend-description';
            legendDescription3.innerHTML = 'Salt 3G';

            var legendContainer3 = document.createElement('div');
            legendContainer3.className = 'legend-container';
            legendContainer3.appendChild(legendContent3);
            legendContainer3.appendChild(legendDescription3);

            legendDiv.appendChild(legendContainer3);
        }
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
