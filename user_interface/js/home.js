$(document).ready(function() {
    function updateNetInfo() {
        const info = getNetworkInfo();

        const updateTime = "Updated at " + new Date().toLocaleTimeString();
        $(".update-time").text(updateTime);

        const onlineStatus = "Online status: " + (info.isOnline ? "Online" : "Offline");
        $(".online-status").text(onlineStatus);

        const cellularStatus = "Cellular connection: " + (info.isCellular ? "Yes" : "No");
        $(".cellular-status").text(cellularStatus);

        const effectiveType = "Effective connection type: " + info.effectiveType;
        $(".effective-type").text(effectiveType);
    }

    updateNetInfo();
    setInterval(updateNetInfo, 10000);
});


const loginButton = document.getElementById("loginButton");
const loginContainer = document.getElementById("loginContainer");
const trackButton = document.getElementById("trackButton");

let isLoggedIn = false; //Anmeldestatus vefolgen
let isTracking = false; //Tracking-Status verfolgen

const submitLogin = document.getElementById("submitLogin");

loginButton.addEventListener("click", () => {
    if (!isLoggedIn) { 
        loginContainer.style.display = "block";
        enableTrackingButton();
    } else {
        // Wenn der Benutzer eingeloggt ist, ändern Sie den Text und die Logik
        logout();
        disableTrackingButton();
    }
});

submitLogin.addEventListener("click", () => {
    isLoggedIn = true;
    loginButton.innerText = "Logout";
    alert("Einloggen erfolgreich!");
    loginContainer.style.display = "none";
});

// Funktion, um den Benutzer auszuloggen
function logout() {
    isLoggedIn = false;
    loginButton.innerText = "Login";
    disableTrackingButton();
}


// Funktion, um den Tracking-Button zu aktivieren oder deaktivieren
function updateTrackingButton() {
    if (isLoggedIn) {
        enableTrackingButton();
    } else {
        disableTrackingButton();
    }
}

// Funktion, um den Tracking-Button zu aktivieren
function enableTrackingButton() {
    trackButton.innerText = "Start Tracking";
    trackButton.addEventListener("click", toggleTracking);
}

// Funktion, um den Tracking-Button zu deaktivieren
function disableTrackingButton() {
    trackButton.innerText = "login to track";
    trackButton.removeEventListener("click", toggleTracking);
}

// Funktion zum Umschalten des Tracking-Status
function toggleTracking() {
    if (!isTracking) {
        isTracking = true;
        trackButton.innerText = "Stop Tracking";
        alert("Tracking ist aktiviert.");
    } else {
        trackButton.innerText = "Start Tracking";
        alert("Tracking ist beendet.");
        isTracking = false;
    }
}

// Initialisieren Sie den Button-Status
updateTrackingButton();



