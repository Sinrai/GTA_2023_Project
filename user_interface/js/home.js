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

loginButton.addEventListener("click", () => {
    loginContainer.style.display = "block";
});

const submitLogin = document.getElementById("submitLogin");

submitLogin.addEventListener("click", () => {
    // Hier können Sie die Logik für den Login-Vorgang implementieren
    // Zum Beispiel: Überprüfen Sie Benutzername und Passwort
    alert("login successful!");
    loginContainer.style.display = "none";
});