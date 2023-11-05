$(document).ready(function() {
    function updateNetInfo() {
        const info = "Updated at " + new Date().toLocaleTimeString() + ": " + JSON.stringify(getNetworkInfo());
        $("#netinfo_test").text(info);
    }
    updateNetInfo();
    setInterval(updateNetInfo, 10000);
});
