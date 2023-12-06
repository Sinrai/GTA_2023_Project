$(document).ready(function() {
    document.getElementById("show_map").addEventListener("click", function() {
        loadContent('user_map.html');
    });
});

//let values = [Math.random() * 100, Math.random() * 100, Math.random() * 100]; 
values = [90, 20, 15];
barWidth = 90; // Neue Breite für die Balken

for (let i = 0; i < values.length; i++) {
    let balken = document.getElementById(`balken${i + 1}`);
    balken.setAttribute('height', values[i]);
    balken.setAttribute('width', barWidth); // Ändern der Breite der Balken
    balken.setAttribute('y', 200 - values[i]); // Anpassung der y-Position basierend auf der Höhe

    let height = values[i]; // Höhe des Balkens entsprechend des Wertes
    // Anpassung des y-Werts für das Text-Element
    let textElement = document.getElementsByTagName('text')[i];
    if (i == 0) {
        textElement.setAttribute('y', 175 - height); // Anpassung des y-Werts für die Position des Textes
    } else {
        textElement.setAttribute('y', 195 - height); // Anpassung des y-Werts für die Position des Textes
    }
}


trajectory_length = document.getElementById("trajectory_length");
discount = document.getElementById("discount");

let response = get_user_statistic(userID)["statistic"];
trajectory_length.value = response , + "km";
discount.value = response/100, + "CHF";





