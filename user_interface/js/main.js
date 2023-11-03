let map;
let appState = {
    markers: null
};

/**
 * Draws the markers on the map.
 */
function drawMarkers() {
    if (map && appState.markers) {
        appState.markers.clearLayers();
        for (let tp of JSON.parse(localStorage['trackpoints'])) {
            let circle = L.circle(tp[1], {
                radius: tp[2]
            });
            appState.markers.addLayer(circle);
        }
    }
}

/**
 * Function to be called whenever a new position is available.
 * @param position The new position.
 */
function geo_success(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    latLng = L.latLng(lat, lng);
    radius = position.coords.accuracy / 2;
	time = Date.now();

    // Store the recorded locations in the LocalStorage.
    if ('trackpoints' in localStorage) {
        let list = JSON.parse(localStorage['trackpoints']);
        list.push([time, latLng, radius]);
        localStorage['trackpoints'] = JSON.stringify(list);
    } else {
        localStorage['trackpoints'] = JSON.stringify([[time, latLng, radius]]);
    }

    if (map) {
        map.setView(latLng);
    }

    drawMarkers();
}

/**
 * Function to be called if there is an error raised by the Geolocation API.
 * @param error Describing the error in more detail.
 */
function geo_error(error) {
    let errMsg = $("#error-messages");
    errMsg.text(errMsg.text() + "Fehler beim Abfragen der Position (" + error.code + "): " + error.message + " ");
    errMsg.show();
}

let geo_options = {
    enableHighAccuracy: true,
    maximumAge: 15000,  // The maximum age of a cached location (15 seconds).
    timeout: 12000   // A maximum of 12 seconds before timeout.
};

/**$('a#download_track').click(function() {
		var trackpoints_header = "time;lon;lat%0D%0A";
		let trackpoints_output = trackpoints_header;
		let trackpoints = JSON.parse(localStorage['trackpoints']);
		let i;
		for (i = 0; i < trackpoints.length; i++) {
			trackpoints_output = trackpoints_output + trackpoints[i][0] + ";" + trackpoints[i][1].lat + ";" + trackpoints[i][1].lng + "%0D%0A";
		}
		this.href = "data:text/csv;charset=UTF-8," + trackpoints_output;
}); */// This enables you to download the trackpoint data via an itegrated button in the 


/**
 * The onload function is called when the HTML has finished loading.
 */
function onload() {
    let errMsg = $("#error-messages");

    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    } else {
        errMsg.text(errMsg.text() + "Geolocation is leider auf diesem Gerät nicht verfügbar. ");
        errMsg.show();
    }

    map = L.map('map_old').setView([47.408375, 8.507669], 15);
    appState.markers = L.layerGroup();
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.addLayer(appState.markers);
}


document.addEventListener("DOMContentLoaded", function () {
    const fullscreenButton = document.getElementById("fullscreenButton");
    const content = document.querySelector(".content");
    let isFullscreen = false;

    fullscreenButton.addEventListener("click", function () {
        if (!isFullscreen) {
            if (content.requestFullscreen) {
                content.requestFullscreen();
            } else if (content.mozRequestFullScreen) { // Firefox
                content.mozRequestFullScreen();
            } else if (content.webkitRequestFullscreen) { // Chrome, Safari and Opera
                content.webkitRequestFullscreen();
            } else if (content.msRequestFullscreen) { // IE/Edge
                content.msRequestFullscreen();
            }
            fullscreenButton.innerHTML = '<i class="material-symbols-outlined">fullscreen_exit</i>';
            isFullscreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
            fullscreenButton.innerHTML = '<i class="material-symbols-outlined">fullscreen</i>';
            isFullscreen = false;
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const menuItems = document.querySelector(".menu-items");

    hamburgerMenu.addEventListener("click", function () {
        menuItems.classList.toggle("active");
    });
});

function generateValues() {
    const values = [10 ,20 ,60];
    
    for (let i = 0; i < values.length; i++) {
        const balken = document.getElementById(`balken${i + 1}`);
        balken.style.width = `${values[i]}%`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Event-Handler für den Klick auf den "Home"-Button
    document.getElementById("home_page").addEventListener("click", function () {
        // Hier wird zur gewünschten HTML-Seite weitergeleitet (z.B., "home.html")
        window.location.href = "index.html";
    });

    // Event-Handler für den Klick auf den "Analysis"-Button
    document.getElementById("analysis_page").addEventListener("click", function () {
        // Hier wird zur gewünschten HTML-Seite weitergeleitet (z.B., "analysis.html")
        window.location.href = "page1.html";
    });

    // Event-Handler für den Klick auf den "FAQ"-Button
    document.getElementById("faq_page").addEventListener("click", function () {
        // Hier wird zur gewünschten HTML-Seite weitergeleitet (z.B., "faq.html")
        window.location.href = "page2.html";
    });

    // Event-Handler für den Klick auf den "FAQ"-Button
    document.getElementById("show_map").addEventListener("click", function () {
        // Hier wird zur gewünschten HTML-Seite weitergeleitet (z.B., "faq.html")
        window.location.href = "page4.html";
    });

    // Event-Handler für den Klick auf den "FAQ"-Button
    document.getElementById("close_map").addEventListener("click", function () {
        // Hier wird zur gewünschten HTML-Seite weitergeleitet (z.B., "faq.html")
        window.location.href = "page1.html";
    });
});
