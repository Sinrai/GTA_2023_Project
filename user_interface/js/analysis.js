$(document).ready(function() {
    document.getElementById("show_map").addEventListener("click", function() {
        loadContent('user_map.html');
    });
});


trajectory_length = document.getElementById("trajectory_length");
discount = document.getElementById("discount");

// userStat = get_user_statistic(userID);
// userStat.then(data => {
//     console.log(data.netspeed_class); // Accessing the 'netspeed_class' property directly
// });

get_user_statistic(userID)
    .then(userStats => {
        console.log(userStats); // Check the entire response

        if (userStats && userStats.hasOwnProperty("statistic")) {
        response_statisitc = userStats["statistic"];
        console.log(response_statisitc);
        trajectory_length.value = response_statisitc + "  km";
        discount.value = (response_statisitc / 100) + "  CHF";
        }

        if (userStats && userStats.hasOwnProperty("netspeed_class")) {
            response_netspeed = userStats["netspeed_class"];
            console.log(response_netspeed);

            barWidth = 90; // Neue Breite für die Balken
            for (let i = 0; i < 3; i++) {
                balken = document.getElementById(`balken${i + 1}`);
                balken.setAttribute('height', response_netspeed[i]);
                balken.setAttribute('width', barWidth); // Ändern der Breite der Balken
                balken.setAttribute('y', 300 - response_netspeed[i]); // Anpassung der y-Position basierend auf der Höhe
                console.log("changing attribut height");

                height = response_netspeed[i]; // Höhe des Balkens entsprechend des Wertes
                // Anpassung des y-Werts für das Text-Element
                textElement = document.getElementsByTagName('text')[i];
                // if (i == 0) {
                //     textElement.setAttribute('y', 175 - height); // Anpassung des y-Werts für die Position des Textes
                // } else {
                textElement.setAttribute('y', 295 - height); // Anpassung des y-Werts für die Position des Textes
                // }
            }
        } else {
            console.log("The key 'netspeed_class' does not exist or the response is invalid.");
        }
    })
    .catch(error => {
        console.error("Error fetching user statistics:", error);
    });


// response_statisitc = get_user_statistic(userID)["statistic"];
// trajectory_length.value = response_statisitc , + "km";
// discount.value = response_statisitc/100, + "CHF";

// response_netspeed = get_user_statistic(userID)["netspeed_class"];
// console.log(response_netspeed);
// barWidth = 90; // Neue Breite für die Balken
// for (let i = 0; i < 3; i++) {
//     balken = document.getElementById(`balken${i + 1}`);
//     balken.setAttribute('height', response_netspeed[i]);
//     balken.setAttribute('width', barWidth); // Ändern der Breite der Balken
//     balken.setAttribute('y', 200 - response_netspeed[i]); // Anpassung der y-Position basierend auf der Höhe
//     console.log("changing attribut height");

//     height = response_netspeed[i]; // Höhe des Balkens entsprechend des Wertes
//     // Anpassung des y-Werts für das Text-Element
//     textElement = document.getElementsByTagName('text')[i];
//     if (i == 0) {
//         textElement.setAttribute('y', 175 - height); // Anpassung des y-Werts für die Position des Textes
//     } else {
//         textElement.setAttribute('y', 195 - height); // Anpassung des y-Werts für die Position des Textes
//     }
// }






