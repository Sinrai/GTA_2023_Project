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
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

/**
 * Post user_point_data and user_trajectory_data
 * @param {list}     user_data     List of points, trajectory of user and connectivity
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
        trackingData.push(data);
    })
    .catch((error) => {
      console.error("Error collecting position:", error);
    });
}





/*GeoServer Abfrage um die Länge der Trajektorien mit einer bestimmten ID zu ermitteln*/

/*VERSION MIT ATTRIBUT "distance" type(REAL)*/

// function getTrajectoryLengthByIDDistanceAttribute(workspace, layerName, idValue) {
//     let serverUrl = 'http://ikgeoserv.ethz.ch:8080/geoserver/' + workspace + '/wfs';
//     let requestUrl = serverUrl + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + workspace + ':' + layerName + '&CQL_FILTER=user_id=' + idValue;

//     $.ajax({
//         type: "GET",
//         url: requestUrl,
//         dataType: "json",
//         success: function(response) {
//             // Erfolgreiche Antwort
//             console.log("Abfrage erfolgreich:");
//             console.log(response);

//             // Hier werden die Längen der Linien berechnet
//             if (response && response.features && response.features.length > 0) {
//                 let totalLength = 0;
//                 response.features.forEach(function(feature) {
//                     // Für jede Linie in der Antwort die Länge addieren (diesmal aus dem 'distance'-Attribut)
//                     let lineLength = parseFloat(feature.properties.distance); // Annahme: 'distance' ist das Attribut
//                     totalLength += lineLength;
//                 });
//                 console.log("Gesamtlänge der Linien mit ID " + idValue + " (basierend auf 'distance'): " + totalLength);
//             } else {
//                 console.log("Keine Linien mit der ID " + idValue + " gefunden.");
//             }
//         },
//         error: function(xhr, status, error) {
//             // Fehlerbehandlung
//             console.log("Fehler bei der Abfrage:");
//             console.log(error);
//         }
//     });
// }

// Beispielaufruf für die Version mit Attribut 'distance'
// var workspaceName = 'dein-arbeitsbereich';
// var layerToQuery = 'user_trajectory_data';
// var specificID = 'deine-gewünschte-id';
// getTrajectoryLengthByIDDistanceAttribute(workspaceName, layerToQuery, specificID);



/*VERSION MIT DEM ATTRIBUT "geom" type(LINESTRING)*/

// function getTrajectoryLengthByIDGeometryAttribute(workspace, layerName, idValue) {
//     let serverUrl = 'http://ikgeoserv.ethz.ch:8080/geoserver/' + workspace + '/wfs';
//     let requestUrl = serverUrl + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + workspace + ':' + layerName + '&CQL_FILTER=user_id=' + idValue;

//     $.ajax({
//         type: "GET",
//         url: requestUrl,
//         dataType: "json",
//         success: function(response) {
//             // Erfolgreiche Antwort
//             console.log("Abfrage erfolgreich:");
//             console.log(response);

//             // Hier werden die Längen der Linien basierend auf der Geometrie berechnet
//             if (response && response.features && response.features.length > 0) {
//                 let totalLength = 0;
//                 response.features.forEach(function(feature) {
//                     // Für jede Linie in der Antwort die Geometrie abrufen und die Länge berechnen
//                     let lineString = feature.geometry.coordinates; // Annahme: Die Geometrie ist ein LineString
//                     let lineLength = calculateLineLength(lineString);
//                     totalLength += lineLength;
//                 });
//                 console.log("Gesamtlänge der Linien mit ID " + idValue + " (basierend auf 'geom'): " + totalLength);
//             } else {
//                 console.log("Keine Linien mit der ID " + idValue + " gefunden.");
//             }
//         },
//         error: function(xhr, status, error) {
//             // Fehlerbehandlung
//             console.log("Fehler bei der Abfrage:");
//             console.log(error);
//         }
//     });
// }

// // Funktion zur Berechnung der Länge einer Linie
// function calculateLineLength(lineCoordinates) {
//     let length = 0;
//     for (let i = 0; i < lineCoordinates.length - 1; i++) {
//         let p1 = lineCoordinates[i];
//         let p2 = lineCoordinates[i + 1];
//         length += calculateDistance(p1, p2);
//     }
//     return length;
// }

// // Funktion zur Berechnung der Distanz zwischen zwei Punkten
// function calculateDistance(point1, point2) {

//     //Berechnung der euklidischen Distanz in 2D:
//     return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
// }


// Beispielaufruf für die Version mit Attribut 'geom'
// var workspaceName = 'dein-arbeitsbereich';
// var layerToQuery = 'user_trajectory_data';
// var specificID = 'deine-gewünschte-id';
// getTrajectoryLengthByIDGeometryAttribute(workspaceName, layerToQuery, specificID);






