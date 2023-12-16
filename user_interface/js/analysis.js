$(document).ready(function() {
    document.getElementById("show_map").addEventListener("click", function() {
        loadContent('user_map.html');
    });
});

// get html objects
trajectory_length = document.getElementById("trajectory_length");
discount = document.getElementById("discount");

// calculate user staistics reffering to python flask
get_user_statistic(userID)
.then(userStats => {
    if (userStats && userStats.hasOwnProperty("statistic")) {
        response_statisitc = userStats["statistic"];

        trajectory_length.value = (Math.round((response_statisitc/1000)*10) /10) + "  km" ;
        discount.value = (Math.round((response_statisitc / 100000) * 100) / 100) + " CHF";
    }

        // netspeed bar chart
    if (userStats && userStats.hasOwnProperty("netspeed_class")) {
        response_netspeed = userStats["netspeed_class"];

        barWidth = 90;
        for (let i = 0; i < 3; i++) { // go through every bar and set width and height
            balken = document.getElementById(`balken${i + 1}`);
            balken.setAttribute('height', response_netspeed[i]);
            balken.setAttribute('width', barWidth);
            balken.setAttribute('y', 300 - response_netspeed[i]);

            // set height for bar name
            height = response_netspeed[i];
            textElement = document.getElementsByTagName('text')[i];
            textElement.setAttribute('y', 295 - height);

        }
    } else {
        console.log("The key 'netspeed_class' does not exist or the response is invalid.");
    }
})
.catch(error => {
    console.error("Error fetching user statistics:", error);
});
