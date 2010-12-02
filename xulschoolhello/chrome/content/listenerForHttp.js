if (typeof Cc == "undefined") {
	var Cc = Components.classes;
}

if (typeof Ci == "undefined") {
        var Ci = Components.interfaces;
}

if (typeof CCIN == "undefined") {
	function CCIN(cName, ifaceName){
		return Cc[cName].createInstance(Ci[ifaceName]);
	}
}

if (typeof CCSV == "undefined") {
	function CCSV(cName, ifaceName){
		if (Cc[cName])
			// if fbs fails to load, the error can be _CC[cName] has no properties
			return Cc[cName].getService(Ci[ifaceName]);
		else
			dumpError("CCSV fails for cName:" + cName);
	};
}

var httpRequestObserver = { 
observe: function(aSubject, aTopic, aData)
    {       
	if (aTopic == "http-on-examine-response")
        {
		var newListener = new TracingListener();
        	aSubject.QueryInterface(Ci.nsITraceableChannel);
        	newListener.originalListener = aSubject.setNewListener(newListener);
        }

	if (aTopic == "http-on-modify-request")
        {
        }
   }
}

var observerService = Cc["@mozilla.org/observer-service;1"]
    .getService(Ci.nsIObserverService);
observerService.addObserver(httpRequestObserver,
   "http-on-examine-response", false);
//observerService.removeObserver(httpRequestObserver, "http-on-examine-response");
function TracingListener() {
}

TracingListener.prototype =
{
    originalListener: null,
    receivedData: [],   // array for incoming data.
    onDataAvailable: function(request, context, inputStream, offset, count)
    {
	//alert("in onDataAvailable");
        var binaryInputStream = CCIN("@mozilla.org/binaryinputstream;1", "nsIBinaryInputStream");
        var storageStream = CCIN("@mozilla.org/storagestream;1", "nsIStorageStream");
        var binaryOutputStream = CCIN("@mozilla.org/binaryoutputstream;1", "nsIBinaryOutputStream");

        binaryInputStream.setInputStream(inputStream);
        storageStream.init(8192, count, null);
        binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));

        // Copy received data as they come.
        var data = binaryInputStream.readBytes(count);
        this.receivedData.push(data);

        binaryOutputStream.writeBytes(data, count);

        this.originalListener.onDataAvailable(request, context, storageStream.newInputStream(0), offset, count);
    },

    onStartRequest: function(request, context) {
        this.originalListener.onStartRequest(request, context);
	this.receivedData = [];
    },

    onStopRequest: function(request, context, statusCode)
    {
        // Get entire response
	//alert("in onStopRequest");
        var responseSource = this.receivedData.join();
	alert(responseSource);
        responseSource = this.processResponse(responseSource);
        this.originalListener.onStopRequest(request, context, statusCode);
    },

    QueryInterface: function (aIID) {
	//alert("in QueryInterface");
        if (aIID.equals(Ci.nsIStreamListener) ||
            aIID.equals(Ci.nsISupports)) {
            return this;
        }
        throw Components.results.NS_NOINTERFACE;
    },

    processResponse: function(responseSource) {

	var temp = new Array();
	var i = 0;
	//check response for script tags and strip any strip tags outside of token
	if( (responseSource.indexOf("<html>") != -1) || (responseSource.indexOf("function") !=-1) ) {
		var j  = -1;

			while(i < responseSource.length ) {
			j++;
			temp[j] = "";
			var checkScriptTagB = responseSource.indexOf("<script>");
			var checkScriptTagE = responseSource.indexOf("</script>");
			var checkTokenB = responseSource.indexOf("<IIS8803_RN>");
			var checkTokenE	= responseSource.indexOf("</IIS8803_RN>");
		
			if( (checkTokenB < checkScriptTagB) && (checkTokenE > checkScriptTagE) ) {
				alert("In if!");
				temp[j] = responseSource.substring(i, checkToken - 1);	
				temp[j] = temp[j] & responseSource.substring(checkScriptTagB,checkScriptTagE);	

			}
			else {
				alert("In else");
				temp[j] = responseSource.substring(i,checkScriptTagB - 1);
			}

			alert("Temp[j] is " + temp[j]);
			temp[j] = temp[j] & responseSource.substring(checkScriptTagE + 1,responseSource.length);
			//window.alert("i value is " + i);
			i = i + checkScriptTagE;
			i = i + 1;
			window.alert("i value is " + i);
			window.alert("Temp of j now is" + temp[j]);
		} 							

		responseSource = "";

		for(i = 0; i < j ; i ++)
			responseSource = responseSource + temp[i];
	}
	return responseSource;
    }	
}