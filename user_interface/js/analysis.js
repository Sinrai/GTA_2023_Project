$(document).ready(function() {
    document.getElementById("show_map").addEventListener("click", function() {
        loadContent('user_map.html');
    });
});


trajectory_length = document.getElementById("trajectory_length");
discount = document.getElementById("discount");

let response_statisitc = get_user_statistic(userID)["statistic"];
trajectory_length.value = response_statisitc , + "km";
discount.value = response/100, + "CHF";

let response_netspeed = get_user_statistic(userID)["netspeed_class"];

barWidth = 90; // Neue Breite für die Balken
for (let i = 0; i < response_netspeed.length; i++) {
    let balken = document.getElementById(`balken${i + 1}`);
    balken.setAttribute('height', response_netspeed[i]);
    balken.setAttribute('width', barWidth); // Ändern der Breite der Balken
    balken.setAttribute('y', 200 - response_netspeed[i]); // Anpassung der y-Position basierend auf der Höhe

    let height = response_netspeed[i]; // Höhe des Balkens entsprechend des Wertes
    // Anpassung des y-Werts für das Text-Element
    let textElement = document.getElementsByTagName('text')[i];
    if (i == 0) {
        textElement.setAttribute('y', 175 - height); // Anpassung des y-Werts für die Position des Textes
    } else {
        textElement.setAttribute('y', 195 - height); // Anpassung des y-Werts für die Position des Textes
    }
}






