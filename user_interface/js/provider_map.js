  $(document).ready(function() {

    // Load all maps
    var baseMap = L.tileLayer.wms("https://wms.geo.admin.ch/", {
        layers: 'ch.swisstopo.pixelkarte-grau',
        format: 'image/jpeg',
        attribution: '&copy; <a href="https://www.swisstopo.admin.ch/en/home.html">swisstopo</a>'
    });

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

    // Add data from Geoserver using WMS
    let antennaLocations = L.tileLayer.wms("http://ikgeoserv.ethz.ch:8080/geoserver/GTA23_project/wms", {
        layers: "GTA23_project:gta_p4_antenna_locations",
        format: "image/png",
        transparent: true
    });
    let trajectories = L.tileLayer.wms("http://ikgeoserv.ethz.ch:8080/geoserver/GTA23_project/wms", {
        layers: "GTA23_project:gta_p4_user_trajectory_data",
        format: "image/png",
        transparent: true
    });



    // set bounds of switzerland
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


    function calculateMinZoom() {
        if (window.innerWidth <= 768) {
            return 7.5; // Min-Zoom for mobile Device
        } else {
            return 8.5; // Min-Zoom für Desktop-Device
        }
    }
    
    // Respond to changes in screen size
    window.addEventListener('resize', function () {
        map.setMinZoom(calculateMinZoom());
    });

    // Overlays of Provider maps
    var overlays = {
        "Salt": saltMap,
        "Sunrise": sunriseMap,
        "Swisscom": swisscomMap,
        "Antenna Locations": antennaLocations,
        "Trajectories": trajectories    
    };

    baseMap.addTo(map);


    // Layer Control
    var layerControl = L.control.layers(null, overlays).addTo(map); //Multiple map layers visible


    // Scale
    L.control.scale({ imperial: false }).addTo(map); 

    

    // Legend
    var activeLayers = [];

    function updateLegend(legendDiv) {
        
        legendDiv.innerHTML = 'Legend'; // Clear existing content

        activeLayers.forEach(function (layer) {
            if (layer === baseMap) {
                legendDiv.innerHTML += '<h4>Legend for Base Map</h4>';
            } 
            
            // Legend salt map
            else if (layer === saltMap) {
                // 4G+
                var legendContent1 = document.createElement('div');
                legendContent1.className = 'legend-content';
                legendContent1.style.backgroundColor = '#65a63c';

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
                legendContent2.style.backgroundColor = '#87b578';

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
                legendContent3.style.backgroundColor = '#b1c697';

                var legendDescription3 = document.createElement('div');
                legendDescription3.className = 'legend-description';
                legendDescription3.innerHTML = 'Salt 3G';

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
                legendDescription1.innerHTML = 'Sunrise 4G+';
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
                legendDescription2.innerHTML = 'Sunrise 4G';
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
                legendDescription3.innerHTML = 'Sunrise 3G';
                legendDiv.appendChild(legendDescription3);

                var legendContainer3 = document.createElement('div');
                legendContainer3.className = 'legend-container';
                legendContainer3.appendChild(legendContent3);
                legendContainer3.appendChild(legendDescription3);

                legendDiv.appendChild(legendContainer3);

            } 
            
            // Legend swisscom map
            else if (layer === swisscomMap) {
                // 4G LTE
                var legendContent1 = document.createElement('div');
                legendContent1.className = 'legend-content';
                legendContent1.style.backgroundColor = '#0851da';
                legendDiv.appendChild(legendContent1);

                var legendDescription1 = document.createElement('div');
                legendDescription1.className = 'legend-description';
                legendDescription1.innerHTML = 'Swisscom 4G LTE';
                legendDiv.appendChild(legendDescription1);

                var legendContainer1 = document.createElement('div');
                legendContainer1.className = 'legend-container';
                legendContainer1.appendChild(legendContent1);
                legendContainer1.appendChild(legendDescription1);

                legendDiv.appendChild(legendContainer1);

                // 4G LTE advanced  
                var legendContent2 = document.createElement('div');
                legendContent2.className = 'legend-content';
                legendContent2.style.backgroundColor = '#001155';
                legendDiv.appendChild(legendContent2);

                var legendDescription2 = document.createElement('div');
                legendDescription2.className = 'legend-description';
                legendDescription2.innerHTML = 'Swisscom 4G LTE advanced';
                legendDiv.appendChild(legendDescription2);
                
                var legendContainer2 = document.createElement('div');
                legendContainer2.className = 'legend-container';
                legendContainer2.appendChild(legendContent2);
                legendContainer2.appendChild(legendDescription2);

                legendDiv.appendChild(legendContainer2);

            }
        });
    }

    // Update legend when layer added
    map.on('layeradd', function (event) {
        var activeLayer = event.layer;

        activeLayer.bringToFront();

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





    // Function to fade out element
    function elementAusblenden() {
      var titelDiv = document.getElementById('titelDiv');
      if (titelDiv) {
        titelDiv.style.opacity = '0';
      }
    }
  
    setTimeout(elementAusblenden, 5000); // Wait 5 sec then fade out
  