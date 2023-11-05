/**
 * Get current Network Information
 * @returns {browser_compatible} Boolean if browser is compatible
 * @returns {isOnline}           Boolean if browser is online
 * @returns {isCellular}         Boolean if connection is "cellular"
 * @returns {downlink}           Estimate effective bandwidth in Mbps
 * @returns {effectiveType}      A string that is one of {slow-2g, 2g, 3g, 4g}
 * @returns {rtt}                Estimated effective round-trip time
 */
function getNetworkInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    let info = {
        browser_compatible: Boolean(connection),
        isOnline: false,
        isCellular: false,
        downlink: 0,
        effectiveType: 0,
        rtt: 0,
    };
    if (connection) {
        info.isOnline = navigator.onLine;
        if (connection.type == "cellular") {
            info.isCellular = true;
        }
        info.downlink = connection.downlink;
        info.effectiveType = connection.effectiveType;
        info.rtt = connection.rtt;
    }
    return info;
}

//Function to view updated network info every 10s
$(document).ready(function() {
    function updateNetInfo() {
        const info = "Updated at " + new Date().toLocaleTimeString() + ": " + JSON.stringify(getNetworkInfo());
        $("#netinfo_test").text(info);
    }
    updateNetInfo();
    setInterval(updateNetInfo, 10000);
});
