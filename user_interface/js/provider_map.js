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

    var layerControl = L.control.layers(overlays).addTo(map);

    //Massstab
    L.control.scale({ imperial: false }).addTo(map); 



});
