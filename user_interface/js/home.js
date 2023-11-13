$(document).ready(function() {
    function updateNetInfo() {
        const info = "Updated at " + new Date().toLocaleTimeString() + ": " + JSON.stringify(getNetworkInfo());
        $("#netinfo_test").text(info);
    }
    updateNetInfo();
    setInterval(updateNetInfo, 10000);
});

const loginButton = document.getElementById("loginButton");
const loginContainer = document.getElementById("loginContainer");
const registerLink = document.getElementById("registerLink");
const registerContainer = document.getElementById("registerContainer");
const trackButton = document.getElementById("trackButton");

let isLoggedIn = false; //Anmeldestatus vefolgen
let isTracking = false; //Tracking-Status verfolgen

const submitLogin = document.getElementById("submitLogin");
const submitRegister = document.getElementById("submitRegister");

submitLogin.addEventListener("click", () => {
    isLoggedIn = true;
    loginButton.innerText = "Logout";
    alert("Einloggen erfolgreich!");
    loginContainer.style.display = "none";
});

submitRegister.addEventListener("click", () => {
    isLoggedIn = true;
    loginButton.innerText = "Logout";
    alert("Registrierung erfolgreich!");
    registerContainer.style.display = "none";
});

loginButton.addEventListener("click", () => {
    if (!isLoggedIn) { 
        loginContainer.style.display = "block";
        registerContainer.style.display = "none"; // Schließen Sie das Registrierungsfenster, wenn das Login-Fenster geöffnet wird
        loginButton.innerText = "logout";
        enableTrackingButton();
    } else {
        // Wenn der Benutzer eingeloggt ist, ändern Sie den Text und die Logik
        logout();
        disableTrackingButton();
    }
});

registerLink.addEventListener("click", () => {
    registerContainer.style.display = "block";
    loginContainer.style.display = "none"; // Schließen Sie das Login-Fenster, wenn das Registrierungsfenster geöffnet wird
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
    trackButton.innerText = "Please login to track";
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

// Annahme: Irgendwo anders im Code haben Sie isTracking und trackButton definiert.

// Initialisieren Sie den Button-Status
updateTrackingButton();


