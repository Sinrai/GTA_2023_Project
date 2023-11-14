$(document).ready(function() {
    document.getElementById("close_map").addEventListener("click", function() {
        loadContent('analysis.html');
    });
});


$(document).ready(function() {
    /** 
    let map;
    map = L.map('map_old').setView([47.408375, 8.507669], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    let map;

    map = L.map('map_old').setView([46.8182, 8.2275], 9);
    */

    var baseMap = L.tileLayer.wms("https://wms.geo.admin.ch/", {
        layers: 'ch.swisstopo.pixelkarte-grau',
        format: 'image/jpeg',
        attribution: '&copy; <a href="https://www.swisstopo.admin.ch/en/home.html">swisstopo</a>'
    });

    var saltMap = L.tileLayer('https://mapserver.salt.ch/public/gmaps/2G3G4G4G+5G5G+@GoogleMapsCompatible/{z}/{x}/{y}.png', {
        format: 'image/png',    
        attribution: 'Salt',
        opacity: 0.5
    });

    var sunriseMap = L.tileLayer('https://maps.sunrise.ch/cgi-bin/mapserv?map=/opt/app/data/sunrise_coverages_2019.map&LAYERS=coverage&mode=tile&tilemode=gmap&tile={x}+{y}+{z}', {
        attribution: 'Sunrise',
        opacity: 0.5
    });


    var swisscomMap = L.tileLayer('https://scmplc.begasoft.ch/plcapp/netzabdeckung/swisscom?layer=umts;lte;lteAdvanced;newRadioWide;newRadioFast&zoom={z}&x={x}&y={y}', {
        attribution: 'Swisscom',
        opacity: 0.5
    });
    
    


    var map = L.map('map_old', {
        center: [46.408375, 8.507669],
        zoom: 8,
        layers: [baseMap]
    });


    var overlays = {
        "Salt": saltMap,
        "Sunrise": sunriseMap,
        "Swisscom": swisscomMap 
    };

    baseMap.addTo(map);
    
    var layerControl = L.control.layers(overlays).addTo(map);

    L.control.scale().addTo(map);

    /** 
    map.on('overlayadd', function (eventLayer) {
        // Check if the added layer is the saltMap
        if (eventLayer.layer === saltMap) {
            // Bring the saltMap to the front
            saltMap.bringToFront();
        }
    });
    */


});

