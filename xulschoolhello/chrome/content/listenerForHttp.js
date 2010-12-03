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

var myOffset = 0;
TracingListener.prototype =
{
    originalListener: null,
    receivedData: [],   // array for incoming data.	
    onDataAvailable: function(request, context, inputStream, offset, count)
    {
        var binaryInputStream = CCIN("@mozilla.org/binaryinputstream;1", "nsIBinaryInputStream");   
        binaryInputStream.setInputStream(inputStream);
        
        // Copy received data as they come.
        var data = binaryInputStream.readBytes(count);
		
		if( (data.indexOf("<html>") != -1) || (data.indexOf("function") !=-1) ) {
			data = this.processResponse(data);
			var savefile = "C:\\LetsSee\\Test.txt";
				try {
				var file = Components.classes["@mozilla.org/file/local;1"]
					.createInstance(Components.interfaces.nsILocalFile);
				file.initWithPath( savefile );
				if ( file.exists() == false ) { 
					file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
				}
				var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
					.createInstance( Components.interfaces.nsIFileOutputStream );
				outputStream.init( file, 0x04 | 0x08 | 0x10, 420, 0 );
				outputStream.write( data, data.length );
				outputStream.close();
				alert("1");
				} catch (e) {
					alert("Exception Occured! " + e);
				}
		}
		/*alert("Count is " + count);
		alert(data);
		alert("Data length is " + data.length);*/
		
		var storageStream = CCIN("@mozilla.org/storagestream;1", "nsIStorageStream");
        storageStream.init(8192, count, null);

		var binaryOutputStream = CCIN("@mozilla.org/binaryoutputstream;1", "nsIBinaryOutputStream");        
        binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
	
        binaryOutputStream.writeBytes(data, data.length);
        this.receivedData.push(data);

        this.originalListener.onDataAvailable(request, context, storageStream.newInputStream(0), myOffset, data.length);
		myOffset = myOffset + data.length;
    },

    onStartRequest: function(request, context) {
        this.originalListener.onStartRequest(request, context);
	this.receivedData = [];
    },

    onStopRequest: function(request, context, statusCode)
    {       
	var responseSource = this.receivedData.join();
	//alert("Initial response " + responseSource);		

	this.originalListener.onStopRequest(request, context, statusCode);
    },

    QueryInterface: function (aIID) {
	if (aIID.equals(Ci.nsIStreamListener) ||
             aIID.equals(Ci.nsISupports)) {
            return this;
        }
        throw Components.results.NS_NOINTERFACE;
    },

    processResponse: function(responseSource) {
	
	if( (responseSource.indexOf("<html>") != -1) || (responseSource.indexOf("function") !=-1) ) {
		var temp = new Array();
		var i = 0;
		var toBeIncluded = "";
		temp = responseSource.split("script>");
		//temp = responseSource.split(/[\\]*script[]*>/);
		//temp = responseSource.split(/[sS][cC][Rr][iI][Pp][tT][\w\W]*>/);
		//temp = responseSource.split(/script>/);
		//alert(temp.length);
		
		for(i=0; i < temp.length; i++) {
			if(i%2!=0) {
				if(temp[i-1].indexOf("<IIS8803_RN>") > -1) {
					toBeIncluded = toBeIncluded + temp[i].subString(0,temp[i].length -2); 
				}	
			}
			else {
				toBeIncluded = toBeIncluded + temp[i].substring(0,temp[i].length -1);
			}
			//alert("toBeIncluded now is " + toBeIncluded);
		}
		toBeIncluded.replace("<IIS8803_RN>","");
		toBeIncluded.replace("</IIS8803_RN>","");
		responseSource = toBeIncluded + ">";
	}
	//alert(responseSource);	
	return responseSource;
    }	

}