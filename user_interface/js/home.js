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

//get objects from html
loginButton = document.getElementById("loginButton");
loginContainer = document.getElementById("loginContainer");
trackButton = document.getElementById("trackButton");
submitLogin = document.getElementById("submitLogin");

//login button click 
loginButton.addEventListener("click", () => {
    if (!isLoggedIn) {
        loginContainer.style.display = "block"; //login container pops up if not logged in
    } else {
        logout();
    }
});

//login container -> submit login
submitLogin.addEventListener("click", () => {
    userInput = document.getElementById('input_userid'); //get html object 
    userID_empty = userInput.value.trim() === ''; // define variable to check if input is emtpy

    if (userID_empty == false) { // login is successful
        isLoggedIn = true;
        updateLoginButton(); //change login button to logout
        updateTrackingButton() // enable tracking button
        loginContainer.style.display = "none"; // login container disapears
        userID = document.getElementById("input_userid").value;  //get the user ID of current user
        saveLoginStatus(isLoggedIn); // save login status
    }
    else {
        alert("Please enter a User ID") // user input is empty
    }
});

// logout user
function logout() {
    isLoggedIn = false;
    updateLoginButton(); // update logout button to login
    updateTrackingButton(); // disable tracking button
    saveLoginStatus(isLoggedIn); // save login status
    userID_empty = true; // update boolean
}


// save login status (boolean) in local storage
function saveLoginStatus(status) {
    localStorage.setItem('isLoggedin', status); 
    localStorage.setItem('userID', userID);
}

// load login status from local storage and convert it into boolean
function loadLoginStatus() {
    isLoggedIn = JSON.parse(localStorage.getItem('isLoggedin')); 
    if (isLoggedIn) {
        userID = localStorage.getItem('userID'); //if logged it get user ID from local storage
    } else {
        isLoggedIn = false;
    }
    updateLoginButton(); 
    updateTrackingButton();
}

// change text displayed in button
function updateLoginButton() {
    if (isLoggedIn == false) {
        loginButton.innerText = "Login";
    } else {
        loginButton.innerText = "Logout";
    }
}

// change between start tracking and stop tracking
function toggleTracking() {
    if (!isTracking) {
        isTracking = true;
        //startTracking();
    } else {
        isTracking = false;
        //stopTracking();
    }
    updateTrackingButton(); // update text displayed in button
}

// change style of tracking button 
function updateTrackingButton() {
    if (isLoggedIn) {
        if (getNetworkInfo()["browser_compatible"]) {
            if (getNetworkInfo()["isCellular"]) {
                if (isTracking) {
                    trackButton.classList.add('blinking'); // Apply blinking effect
                    trackButton.innerText = "Stop Tracking";
                    trackButton.style.color = 'white';
                    trackButton.style.background = 'rgb(255, 102, 102)';
                    trackButton.addEventListener("click", toggleTracking);
                } else {
                    trackButton.classList.remove('blinking'); // Remove blinking effect
                    trackButton.innerText = "Start Tracking";
                    trackButton.style.color = 'black';
                    trackButton.style.background = 'rgb(154, 229, 154)';
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
        trackButton.style.color = 'white';
        trackButton.style.background = 'grey';
        trackButton.removeEventListener("click", toggleTracking);
    }
}

// initialize login status 
loadLoginStatus();
