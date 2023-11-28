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
 * Get current IP
 * @returns {Promise<string>} IP address
 * @example
 * getIP().then((result) => {
 *   console.log('IP:', result);
 * });
 */
function getIP() {
    return new Promise(function(resolve, reject) {
        $.get('https://www.cloudflare.com/cdn-cgi/trace').then(function(data) {
            data = data.trim().split('\n').reduce(function(obj, pair) {
                pair = pair.split('=');
                return obj[pair[0]] = pair[1], obj;
            }, {});
            var ipAddress = data['ip'];
            resolve(ipAddress);
        }).catch(function(error) {
            reject(error);
        });
    });
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

function gen_WFSInsert_user_point_data(workspace, layer, data) {
    function gen_WFSInsert_single(single) {
        return '<wfs:Insert>\n'
        + '  <' + workspace + ':' + layer + '>\n'
        + '      <netspeed>'+single.netspeed+'</netspeed>\n'
        + '      <ip>'+single.IP+'</ip>\n'
        + '      <time>'+single.time+'</time>\n'
        + '      <username>'+userID+'</username>\n'
        + '      <geom>\n'
        + '          <gml:Point srsName="http://www.opengis.net/def/crs/EPSG/0/4326">\n'
        + '              <gml:coordinates decimal="." cs="," ts=" ">' + single.position.coords.latitude + ',' + single.position.coords.longitude + '</gml:coordinates>\n'
        + '          </gml:Point>\n'
        + '      </geom>\n'
        + '  </' + workspace + ':' + layer + '>\n'
        + '</wfs:Insert>\n';
    }

    let string =
        '<wfs:Transaction\n'
        + '  service="WFS"\n'
        + '  version="1.0.0"\n'
        + '  xmlns="http://www.opengis.net/wfs"\n'
        + '  xmlns:wfs="http://www.opengis.net/wfs"\n'
        + '  xmlns:gml="http://www.opengis.net/gml"\n'
        + '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
        + '  xmlns:' + workspace + '="http://www.gis.ethz.ch/' + workspace + '" \n'
        + '  xsi:schemaLocation="http://www.gis.ethz.ch/' + workspace + ' \n'
        + '      http://ikgeoserv.ethz.ch:8080/geoserver/' + workspace + '/wfs?service=WFS&amp;'
        + '      version=1.0.0&amp;request=DescribeFeatureType&amp;typeName=' + workspace + '%3A' + layer + ' \n'
        + '      http://www.opengis.net/wfs\n'
        + '      http://ikgeoserv.ethz.ch:8080/geoserver/schemas/wfs/1.0.0/WFS-basic.xsd">\n'
        +    data.map(gen_WFSInsert_single).join("")
        + '</wfs:Transaction>';
    return string
}

function gen_WFSInsert_user_trajectory_data(workspace, layer, data) {
    function get_coords_string(data) {
        return data.position.coords.latitude + "," + data.position.coords.longitude;
    }

    let string =
        '<wfs:Transaction\n'
        + '  service="WFS"\n'
        + '  version="1.0.0"\n'
        + '  xmlns="http://www.opengis.net/wfs"\n'
        + '  xmlns:wfs="http://www.opengis.net/wfs"\n'
        + '  xmlns:gml="http://www.opengis.net/gml"\n'
        + '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
        + '  xmlns:' + workspace + '="http://www.gis.ethz.ch/' + workspace + '" \n'
        + '  xsi:schemaLocation="http://www.gis.ethz.ch/' + workspace + ' \n'
        + '      http://ikgeoserv.ethz.ch:8080/geoserver/' + workspace + '/wfs?service=WFS&amp;'
        + '      version=1.0.0&amp;request=DescribeFeatureType&amp;typeName=' + workspace + '%3A' + layer + ' \n'
        + '      http://www.opengis.net/wfs\n'
        + '      http://ikgeoserv.ethz.ch:8080/geoserver/schemas/wfs/1.0.0/WFS-basic.xsd">\n'
        + '  <wfs:Insert>\n'
        + '      <' + workspace + ':' + layer + '>\n'
        + '          <time>'+data[0].time+'</time>\n'
        + '          <username>'+userID+'</username>\n'
        + '          <geom>\n'
        + '              <gml:LineString srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">\n'
        + '                   <gml:coordinates decimal="." cs="," ts=" ">' + data.map(get_coords_string).join(" ") + '</gml:coordinates>\n'
        + '              </gml:LineString>\n'
        + '          </geom>\n'
        + '      </' + workspace + ':' + layer + '>\n'
        + '  </wfs:Insert>\n'
        + '</wfs:Transaction>';
    console.log(string);
    return string
}

/**
 * Post user_point_data and user_trajectory_data
 * @param {list}     data     List of points, trajectory of user and connectivity
 */
function uploadData(data) {
    //Not finished nor tested
    let workspace = "GTA23_project";
    let layer_point = "gta_p4_user_point_data";
    let layer_trajectory = "gta_p4_user_trajectory_data";

    function upload(postData) {
        $.ajax({
            type: "POST",
            url: 'http://ikgeoserv.ethz.ch:8080/geoserver/' + workspace + '/wfs',
            dataType: "xml",
            contentType: "text/xml",
            data: postData,
            success: function(xml) {
                //Success feedback
                console.log("Data uploaded");
                console.log(xml);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //Error handling
                console.log("Error from AJAX uploading data");
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    let pointData = gen_WFSInsert_user_point_data(workspace, layer_point, data);
    upload(pointData);

    if (data.length >= 2) {
        let trajectoryData = gen_WFSInsert_user_trajectory_data(workspace, layer_trajectory, data);
        upload(trajectoryData);
    }
}

function getTimestampString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const timestampString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return timestampString;
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

    promiseFunctions = [
        getIP(),
        getCurrentPosition()
    ]

    Promise.all(promiseFunctions)
        .then(([ip, position]) => {
            data.netspeed = getNetworkInfo().effectiveType[0];
            data.IP = ip;
            data.time = getTimestampString();
            data.position = position;
            trackingData.push(data);
    })
    .catch((error) => {
      console.error("Error collecting data:", error);
    });
}





/*GeoServer Abfrage um die Länge der Trajektorien mit einer bestimmten ID zu ermitteln*/

/*VERSION MIT ATTRIBUT "distance" type(REAL)*/

function getTrajectoryLengthByIDDistanceAttribute(workspace, layerName, idValue) {
    let serverUrl = 'http://ikgeoserv.ethz.ch:8080/geoserver/' + workspace + '/wfs';
    let requestUrl = serverUrl + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + workspace + ':' + layerName + '&CQL_FILTER=user_id=' + idValue;

    $.ajax({
        type: "GET",
        url: requestUrl,
        dataType: "json",
        success: function(response) {
            // Erfolgreiche Antwort
            console.log("Abfrage erfolgreich:");
            console.log(response);

            // Hier werden die Längen der Linien berechnet
            if (response && response.features && response.features.length > 0) {
                let totalLength = 0;
                response.features.forEach(function(feature) {
                    // Für jede Linie in der Antwort die Länge addieren (diesmal aus dem 'distance'-Attribut)
                    let lineLength = parseFloat(feature.properties.distance); // Annahme: 'distance' ist das Attribut
                    totalLength += lineLength;
                });
                console.log("Gesamtlänge der Linien mit ID " + idValue + " (basierend auf 'distance'): " + totalLength);
            } else {
                console.log("Keine Linien mit der ID " + idValue + " gefunden.");
            }
        },
        error: function(xhr, status, error) {
            // Fehlerbehandlung
            console.log("Fehler bei der Abfrage:");
            console.log(error);
        }
    });
}

// Beispielaufruf für die Version mit Attribut 'distance'
var workspaceName = 'dein-arbeitsbereich';
var layerToQuery = 'user_trajectory_data';
var specificID = 'deine-gewünschte-id';
getTrajectoryLengthByIDDistanceAttribute(workspaceName, layerToQuery, specificID);



/*VERSION MIT DEM ATTRIBUT "geom" type(LINESTRING)*/

function getTrajectoryLengthByIDGeometryAttribute(workspace, layerName, idValue) {
    let serverUrl = 'http://ikgeoserv.ethz.ch:8080/geoserver/' + workspace + '/wfs';
    let requestUrl = serverUrl + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + workspace + ':' + layerName + '&CQL_FILTER=user_id=' + idValue;

    $.ajax({
        type: "GET",
        url: requestUrl,
        dataType: "json",
        success: function(response) {
            // Erfolgreiche Antwort
            console.log("Abfrage erfolgreich:");
            console.log(response);

            // Hier werden die Längen der Linien basierend auf der Geometrie berechnet
            if (response && response.features && response.features.length > 0) {
                let totalLength = 0;
                response.features.forEach(function(feature) {
                    // Für jede Linie in der Antwort die Geometrie abrufen und die Länge berechnen
                    let lineString = feature.geometry.coordinates; // Annahme: Die Geometrie ist ein LineString
                    let lineLength = calculateLineLength(lineString);
                    totalLength += lineLength;
                });
                console.log("Gesamtlänge der Linien mit ID " + idValue + " (basierend auf 'geom'): " + totalLength);
            } else {
                console.log("Keine Linien mit der ID " + idValue + " gefunden.");
            }
        },
        error: function(xhr, status, error) {
            // Fehlerbehandlung
            console.log("Fehler bei der Abfrage:");
            console.log(error);
        }
    });
}

// Funktion zur Berechnung der Länge einer Linie
function calculateLineLength(lineCoordinates) {
    let length = 0;
    for (let i = 0; i < lineCoordinates.length - 1; i++) {
        let p1 = lineCoordinates[i];
        let p2 = lineCoordinates[i + 1];
        length += calculateDistance(p1, p2);
    }
    return length;
}

// Funktion zur Berechnung der Distanz zwischen zwei Punkten
function calculateDistance(point1, point2) {

    //Berechnung der euklidischen Distanz in 2D:
    return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
}


// Beispielaufruf für die Version mit Attribut 'geom'
var workspaceName = 'dein-arbeitsbereich';
var layerToQuery = 'user_trajectory_data';
var specificID = 'deine-gewünschte-id';
getTrajectoryLengthByIDGeometryAttribute(workspaceName, layerToQuery, specificID);






