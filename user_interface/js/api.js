/**
 * Get current Network Information
 * @returns {bool}   browser_compatible Boolean if browser is compatible
 * @returns {bool}   isOnline           Boolean if browser is online
 * @returns {bool}   isCellular         Boolean if connection is "cellular"
 * @returns {float}  downlink           Estimate effective bandwidth in Mbps
 * @returns {string} effectiveType      A string that is one of {slow-2g, 2g, 3g, 4g}
 * @returns {int}    rtt                Estimated effective round-trip time
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

/**
 * Is GPS location enabled?
 * @returns {Promise<bool>}
 * @example
 * isGPSEnabled().then((result) => {
 *   console.log('GPS is enabled:', result);
 * });
 */
function isGPSenabled() {
    return new Promise((resolve) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    resolve(true);
                },
                function(error) {
                    resolve(false);
                }
            );
        } else {
            resolve(false);
        }
    });
}

/**
 * Get current location
 * @returns {Promise<Geolocation>}
 * @example
 * getCurrentPosition()
 *   .then((position) => {
 *     console.log('Current position:', position);
 *   })
 */
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    resolve(position);
                },
                function(error) {
                    reject(new Error('Error getting position: ' + error.message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

/**
 * Post user_point_data and user_trajectory_data
 * @param {Array} user_data: List of points, trajectory of user and connectivity
 */
function uploadData(user_data) {
    $.ajax({
        type: "POST",
        url: '/api/upload_data',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(user_data),
        success: function(xml) {
            //Success feedback
            console.log("Data uploaded");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //Error handling
            console.log("Error from AJAX uploading data");
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

/**
 * Request user statistics from database
 * @param {string} userId
 * @returns {Promise<Object>}
 */
function get_user_statistic(userId) {
    return new Promise((resolve) => {
        $.ajax({
            type: "GET",
            url: "/api/get_user_statistic?user_id=" + userId,
            success: function(response) {
                resolve(response);
            },
            error: function(xhr, status, error) {
                reject(new Error('Error getting user statistic: ' + error));
            }
        });
    });
}

//-------------------------------------------- GPS Tracking --------------------------------------------

let trackingData = [];
let intervalId;

function startTracking() {
    getCurrentPosition(); // Prompt for permissions, otherwise unsused
    intervalId = setInterval(trackPoint, 10000); // Add information every 10000 milliseconds (10 seconds)
}

function stopTracking() {
    clearInterval(intervalId);
    uploadData(trackingData);
    trackingData = [];
}

function trackPoint() {
    console.log("Point added");
    let data = {};

    getCurrentPosition().then((position) => {
        data.netinfo = getNetworkInfo()
        data.time = Date.now();
        data.position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        data.username = userID;
        trackingData.push(data);
    })
    .catch((error) => {
        console.error("Error collecting position:", error);
    });
}
