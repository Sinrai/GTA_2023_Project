  $(document).ready(function() {
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

    var switzerlandBounds = L.latLngBounds(
        L.latLng(45.817, 5.967), // Southwest coordinates
        L.latLng(47.808, 10.492) // Northeast coordinates
    );
    

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
            return 7.5; // Setze den Min-Zoom für mobile Geräte
        } else {
            return 8.5; // Setze den Min-Zoom für Desktop-Geräte
        }
    }
    
    // Reagiere auf Änderungen der Bildschirmgröße
    window.addEventListener('resize', function () {
        map.setMinZoom(calculateMinZoom());
    });

    //Overlays der Provider maps
    var overlays = {
        "Salt": saltMap,
        "Sunrise": sunriseMap,
        "Swisscom": swisscomMap
    };

    baseMap.addTo(map);

    
    //var layerControl = L.control.layers(overlays).addTo(map); //Only one map layer at a time visible

    
    var layerControl = L.control.layers(null, overlays).addTo(map); //Multiple map layers visible

    //Massstab
    L.control.scale({ imperial: false }).addTo(map); 





    // Legende
    function updateLegend(legendDiv, activeLayer) {
        console.log('function');
        // Clear the existing content
        console.log(activeLayer)
        legendDiv.innerHTML = '';

        // Add legend content based on the activeLayer
        if (activeLayer === baseMap) {
            legendDiv.innerHTML = '<h4>Legend for Base Map</h4>';
        }
        
        if (activeLayer === saltMap) {
            var legendContent = document.createElement('div');
            legendContent.className = 'legend-content';

            var legendDescription = document.createElement('div');
            legendDescription.className = 'legendDescription';
            legendDescription.innerHTML = '3G (?)';

            legendDiv.appendChild(legendContent);
            legendDiv.appendChild(legendDescription);
            console.log('salt');
        }
        
        if (activeLayer === sunriseMap) {
            legendDiv.innerHTML = '<h4>Legend for Sunrise Map</h4>';
            console.log('sunrise');
        }
        
        if (activeLayer === swisscomMap) {
            legendDiv.innerHTML = '<h4>Legend for Swisscom Map</h4>';
            console.log('swisscom');
        }
    }

    map.on('layeradd', function (event) {
        var activeLayer = event.layer;
        updateLegend(legend, activeLayer);
    });

    map.on('layerremove', function (event) {
        var activeLayer = map.hasLayer(baseMap) ? baseMap : null;
        updateLegend(legend, activeLayer);
    });


    /*
    //Legende
    var legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        updateLegend(div, baseMap); // Initialize the legend with the default base map
        return div;
    };

    legend.addTo(map);

    function updateLegend(legendDiv, activeLayer) {
        // Clear the existing content
        legendDiv.innerHTML = '';

        // Add legend content based on the activeLayer
        if (activeLayer === baseMap) {
            legendDiv.innerHTML = '<h4>Legend for Base Map</h4>';

        //Salt
        } else if (activeLayer === saltMap) {
            //legendDiv.innerHTML = '<h4>Legend for Salt Map</h4>';

            var legendContent = document.createElement('div');
            legendContent.className = 'legend-content';
            
            var legendDescription = document.createElement('div')
            legendDescription.className = 'legendDescription';
            legendDescription.innerHTML = '3G (?)';

            legendDiv.appendChild(legendContent);
            legendDiv.appendChild(legendDescription);

        //Sunrise
        } else if (activeLayer === sunriseMap) {
            legendDiv.innerHTML = '<h4>Legend for Sunrise Map</h4>';

        //Swisscom
        } else if (activeLayer === swisscomMap) {
            legendDiv.innerHTML = '<h4>Legend for Swisscom Map</h4>';

        }
    }

    map.on('layeradd', function (event) {
        var activeLayer = event.layer;
        updateLegend(legend.getContainer(), activeLayer);
    });

    map.on('layerremove', function (event) {
        var activeLayer = map.hasLayer(baseMap) ? baseMap : null;
        updateLegend(legend.getContainer(), activeLayer);
    });
    */


});


    // Funktion, um das Element sanft auszublenden
    function elementAusblenden() {
      var titelDiv = document.getElementById('titelDiv');
      if (titelDiv) {
        titelDiv.style.opacity = '0';
      }
    }
  
    // Warte 5 Sekunden und rufe die Funktion auf, um das Element auszublenden
    setTimeout(elementAusblenden, 5000);
  

