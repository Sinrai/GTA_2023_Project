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

/**
 * Post user_point_data and user_trajectory_data
 * @param {datetime} datetime   Timestamp when data was recorded (start)
 * @param {list}     points     List of points, trajectory of user and connectivity
 */
function insertPoint() {
    //Not finished nor tested
    let workspace = "GTA23_project";
    let layer_point = "user_point_data";
    let layer_trajectory = "user_trajectory_data";

    let netspeed = 4;
    let provider = "Swisscom";
    let time = "1999-01-08 04:05:06";
    let username = "Gusti";
    let lng = 48.3223525;
    let lat = 5.225;
    let geom = '<gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">\n'
    + '             <gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">' + lng + ',' + lat + '</gml:coordinates>'
    + '         </gml:Point>\n';

    let pointData =
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
      + '      version=1.0.0&amp;request=DescribeFeatureType&amp;typeName=' + workspace + '%3A' + layer_point + ' \n'
      + '      http://www.opengis.net/wfs\n'
      + '      http://ikgeoserv.ethz.ch:8080/geoserver/schemas/wfs/1.0.0/WFS-basic.xsd">\n'
      + '  <wfs:Insert>\n'
      + '    <' + workspace + ':' + layer_point + '>\n'
      + '      <netspeed>'+netspeed+'</netspeed>\n'
      + '      <provider>'+provider+'</provider>\n'
      + '      <time>'+time+'</time>\n'
      + '      <username>'+username+'</username>\n'
      + '      <geom>' + geom + '</geom>\n'
      + '    </' + workspace + ':' + layer_point + '>\n'
      + '  </wfs:Insert>\n'
      + '</wfs:Transaction>';

    let postData = pointData;

    $.ajax({
        type: "POST",
        url: 'http://ikgeoserv.ethz.ch:8080/geoserver/' + workspace + '/wfs',
        dataType: "xml",
        contentType: "text/xml",
        data: postData,
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
