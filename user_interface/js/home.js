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
    // Hier können Sie die Login-Logik implementieren
    isLoggedIn = true;
    loginButton.innerText = "Logout";
    alert("Einloggen erfolgreich!");
    loginContainer.style.display = "none";
});

submitRegister.addEventListener("click", () => {
    // Hier können Sie die Registrierungslogik implementieren
    alert("Registrierung erfolgreich!");
    registerContainer.style.display = "none";
});

loginButton.addEventListener("click", () => {
    if (!isLoggedIn) {
        loginContainer.style.display = "block";
        registerContainer.style.display = "none"; // Schließen Sie das Registrierungsfenster, wenn das Login-Fenster geöffnet wird
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
    // Fügen Sie hier die Logik zum Ausloggen hinzu
    isLoggedIn = false;
    loginButton.innerText = "Login";
}


loginButton.addEventListener("click", () => {
    if (!isLoggedIn) {
        loginButton.innerText = "Logout";
        isLoggedIn = true;
    } else {
        loginButton.innerText = "Login";
        isLoggedIn = false;
    }

    // Aktualisieren Sie den Tracking-Button entsprechend dem Anmeldestatus
    updateTrackingButton();
});

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
    trackButton.disabled = false;
    trackButton.innerText = "Start Tracking";
    trackButton.addEventListener("click", () => {
        // Hier können Sie Ihre Tracking-Logik implementieren
        alert("Tracking ist aktiviert.");
    });
}

// Funktion, um den Tracking-Button zu deaktivieren
function disableTrackingButton() {
    trackButton.disabled = true;
    trackButton.innerText = "Please login to track";
    trackButton.removeEventListener("click", () => {
        // Entfernen Sie den Event-Handler, falls vorhanden
    });
}

// Initialisieren Sie den Button-Status
updateTrackingButton();


