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
        enableTrackingButton();
    } else {
        // Wenn der Benutzer eingeloggt ist, ändern Sie den Text und die Logik
        logout();
        disableTrackingButton();
    }
    updateLoginButton(); // Update des Login/Logout-Buttons nach Klick
    saveLoginStatus(isLoggedIn); // Speichere den Anmeldestatus
});

submitLogin.addEventListener("click", () => {
    isLoggedIn = true;
    updateLoginButton(); // Update des Login/Logout-Buttons nach dem Login
    alert("Einloggen erfolgreich!");
    loginContainer.style.display = "none";
    saveLoginStatus(isLoggedIn); // Speichere den Anmeldestatus
});

// Funktion, um den Benutzer auszuloggen
function logout() {
    isLoggedIn = false;
    updateLoginButton(); // Update des Login/Logout-Buttons nach dem Logout
    disableTrackingButton();
    saveLoginStatus(isLoggedIn); // Speichere den Anmeldestatus
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
    if (!isLoggedIn) {
        alert("Bitte logge dich ein, um das Tracking zu verwenden."); // Benutzer benachrichtigen, dass sie eingeloggt sein müssen
        return; // Beende die Funktion, wenn der Benutzer nicht eingeloggt ist
    }

    if (!isTracking) {
        isTracking = true;
        trackButton.innerText = "Stop Tracking";
        alert("Tracking ist aktiviert.");
    } else {
        isTracking = false;
        trackButton.innerText = "Start Tracking";
        alert("Tracking ist beendet.");
    }

    saveTrackingStatus(isTracking); // Speichere den Tracking-Status im Local Storage
}

// Funktion zum Speichern des Anmeldestatus im Local Storage
function saveLoginStatus(status) {
    localStorage.setItem('isLoggedin', status); // Speichere den Status im Local Storage
}

// Funktion zum Speichern des Tracking-Status im Local Storage
function saveTrackingStatus(status) {
    localStorage.setItem('isTracking', status); // Speichere den Status im Local Storage
}

// Funktion zum Laden des Anmeldestatus aus dem Local Storage
function loadLoginStatus() {
    const status = localStorage.getItem('isLoggedin'); // Lade den Status aus dem Local Storage
    if (status !== null) {
        isLoggedIn = status === 'true'; // Konvertiere den geladenen Wert zurück in einen Boolean
        updateLoginButton(); // Aktualisiere den Login/Logout-Button basierend auf dem geladenen Status
        updateTrackingButton(); //Aktualisiere den Tracking-Button basierend auf dem geladenen Status
    }
}

// Funktion zum Laden des Tracking-Status aus dem Local Storage
function loadTrackingStatus() {
    const status = localStorage.getItem('isTracking'); // Lade den Status aus dem Local Storage
    if (status !== null) {
        isTracking = status === 'true'; // Konvertiere den geladenen Wert zurück in einen Boolean
    }
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
// Initialisieren Sie den Button-Status
loadTrackingStatus();




