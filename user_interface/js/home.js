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
    
    userInput = document.getElementById('input_userid');
    userID_empty = userInput.value.trim() === ''; // Überprüfen, ob der Wert des Inputs leer ist

    if (userID_empty == false) {
        isLoggedIn = true;
        updateLoginButton(); // Update des Login/Logout-Buttons nach dem Login
        updateTrackingButton()
        loginContainer.style.display = "none";
        userID = document.getElementById("input_userid").value;
        saveLoginStatus(isLoggedIn); // Speichere den Anmeldestatus
    }
    else {
        alert("Please enter a User ID")
    }
});

// Funktion, um den Benutzer auszuloggen
function logout() {
    isLoggedIn = false;
    updateLoginButton(); // Update des Login/Logout-Buttons nach dem Logout
    updateTrackingButton();
    saveLoginStatus(isLoggedIn); // Speichere den Anmeldestatus
    userID_empty = true;
}

// Funktion zum Umschalten des Tracking-Status
function toggleTracking() {
    if (!isTracking) {
        isTracking = true;
        startTracking();
        //alert("Tracking ist aktiviert.");
    } else {
        isTracking = false;
        stopTracking();
        //alert("Tracking ist beendet.");
    }
    updateTrackingButton();
}

// Funktion zum Speichern des Anmeldestatus im Local Storage
function saveLoginStatus(status) {
    localStorage.setItem('isLoggedin', status); // Speichere den Status im Local Storage
    localStorage.setItem('userID', userID);
}

function loadLoginStatus() {
    isLoggedIn = JSON.parse(localStorage.getItem('isLoggedin')); // Lade den Status aus dem Local Storage und konvertiere ihn in einen Boolean-Wert
    if (isLoggedIn) {
        userID = localStorage.getItem('userID');
    } else {
        isLoggedIn = false;
    }
    updateLoginButton(); // Aktualisiere den Login/Logout-Button basierend auf dem geladenen Status
    updateTrackingButton(); //Aktualisiere den Tracking-Button basierend auf dem geladenen Status
}

function updateLoginButton() {
    if (isLoggedIn == false) {
        loginButton.innerText = "Login";
    } else {
        loginButton.innerText = "Logout";
    }
}

function updateTrackingButton() {
    if (isLoggedIn) {
        if (getNetworkInfo()["browser_compatible"]) {
            if (getNetworkInfo()["isCellular"]) {
                if (isTracking) {
                    trackButton.classList.add('blinking'); // Apply blinking effect
                    trackButton.innerText = "Stop Tracking";
                    //trackButton.style.color = 'red';
                    trackButton.addEventListener("click", toggleTracking);
                } else {
                    trackButton.classList.remove('blinking'); // Remove blinking effect
                    trackButton.innerText = "Start Tracking";
                    trackButton.style.color = 'black';
                    //trackButton.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
                    trackButton.style.background = 'rgb(131, 176, 176)';
                    trackButton.addEventListener("click", toggleTracking);
                }
            } else {
                trackButton.innerText = "Connect with cellular connection to track";
                trackButton.removeEventListener("click", toggleTracking);
            }
        } else {
            trackButton.innerText = "Use a compatible browser";
            trackButton.removeEventListener("click", toggleTracking);
        }
    } else {
        trackButton.innerText = "Login to Track";
        trackButton.style.color = 'coral';
        trackButton.style.background = 'grey';
        trackButton.removeEventListener("click", toggleTracking);
    }
}

// Initialisieren Sie den Button-Status
loadLoginStatus();
