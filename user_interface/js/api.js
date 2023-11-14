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
 * @returns {string} Ip adress
 */
function getIP() {
    return '192.168.1.1_test'; //Dummy IP TODO implement function!!!
}

/**
 * Post user_point_data and user_trajectory_data
 * @param {datetime} datetime   Timestamp when data was recorded (start)
 * @param {list}     points     List of points, trajectory of user and connectivity
 */
function insertPoint() {
    //Not finished nor tested
    let workspace = "GTA23_P4"
    let layer_point = "point"
    let layer_trajectory = "traj"

    list.forEach((x, i) => {
        console.log(x);
    });

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
	  + '      <lon>'+lng+'</lon>\n'
	  + '      <lat>'+lat+'</lat>\n'
	  + '      <name>'+name+'</name>\n'
	  + '      <geometry>\n'
	  + '        <gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">\n'
	  + '          <gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">'+lng+ ',' +lat+'</gml:coordinates>\n'
	  + '        </gml:Point>\n'
	  + '      </geometry>\n'
	  + '    </' + workspace + ':' + layer_point + '>\n'
	  + '  </wfs:Insert>\n'
	  + '</wfs:Transaction>';

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
