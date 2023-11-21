$(document).ready(function () {
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


loginButton = document.getElementById("loginButton");
loginContainer = document.getElementById("loginContainer");
trackButton = document.getElementById("trackButton");
submitLogin = document.getElementById("submitLogin");

loginButton.addEventListener("click", () => {
    if (!isLoggedIn) {
        loginContainer.style.display = "block";
    } else {
        logout();
    }
});

submitLogin.addEventListener("click", () => {
    isLoggedIn = true;
    updateLoginButton(); // Update des Login/Logout-Buttons nach dem Login
    updateTrackingButton()
    loginContainer.style.display = "none";
    // alert("Einloggen erfolgreich!");
    saveLoginStatus(isLoggedIn); // Speichere den Anmeldestatus
});

// Funktion, um den Benutzer auszuloggen
function logout() {
    isLoggedIn = false;
    updateLoginButton(); // Update des Login/Logout-Buttons nach dem Logout
    updateTrackingButton();
    saveLoginStatus(isLoggedIn); // Speichere den Anmeldestatus
}

// Funktion zum Umschalten des Tracking-Status
function toggleTracking() {
    if (!isTracking) {
        isTracking = true;
        alert("Tracking ist aktiviert.");
    } else {
        isTracking = false;
        alert("Tracking ist beendet.");
    }
    updateTrackingButton();
}

// Funktion zum Speichern des Anmeldestatus im Local Storage
function saveLoginStatus(status) {
    localStorage.setItem('isLoggedin', status); // Speichere den Status im Local Storage
}

// Funktion zum Laden des Anmeldestatus aus dem Local Storage
function loadLoginStatus() {
    isLoggedIn = localStorage.getItem('isLoggedin'); // Lade den Status aus dem Local Storage
    if (isLoggedIn == null) {
        saveLoginStatus(false);
        isLoggedIn = false;
    }
    updateLoginButton(); // Aktualisiere den Login/Logout-Button basierend auf dem geladenen Status
    updateTrackingButton(); //Aktualisiere den Tracking-Button basierend auf dem geladenen Status
}

function updateLoginButton() {
    loginButton.innerText = isLoggedIn ? "Logout" : "Login";
}

function updateTrackingButton() {
    if (isLoggedIn) {
        if (isTracking) {
            trackButton.innerText = "Stop Tracking";
            trackButton.addEventListener("click", toggleTracking);
        } else {
            trackButton.innerText = "Start Tracking";
            trackButton.addEventListener("click", toggleTracking);
        }
    } else {
        trackButton.innerText = "Login to Track";
        trackButton.removeEventListener("click", toggleTracking);
    }
}

// Initialisieren Sie den Button-Status
loadLoginStatus();
