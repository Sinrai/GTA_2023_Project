$(document).ready(function() {
    document.getElementById("close_map").addEventListener("click", function() {
        loadContent('analysis.html');
    });
});

$(document).ready(function() {
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
});
