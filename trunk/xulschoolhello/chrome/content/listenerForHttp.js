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
/*		
			var httpChannel = aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
			var random_number = Math.floor(Math.random()*10000000 +1);
			httpChannel.setRequestHeader("Cookie", "XAPITTT_Trusted_Token="+random_number+";", true);
*/
        }
   },
   
};

var observerService = Cc["@mozilla.org/observer-service;1"]
    .getService(Ci.nsIObserverService);
observerService.addObserver(httpRequestObserver, "http-on-examine-response", false);
//observerService.addObserver(httpRequestObserver, "http-on-modify-request", false);

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
		var storageStream = CCIN("@mozilla.org/storagestream;1", "nsIStorageStream");
        var binaryOutputStream = CCIN("@mozilla.org/binaryoutputstream;1", "nsIBinaryOutputStream");
		
		binaryInputStream.setInputStream(inputStream);
        
        // Copy received data as they come.
        var data = binaryInputStream.readBytes(count);
		//alert(data);
		
		if( (data.indexOf("<html>") != -1) || (data.indexOf("function") !=-1) ) {
			var processedResponse = this.processResponse(data);
			processedResponse = processedResponse + "";
		}
		else {
			processedResponse = data;
		}
		var newcount = processedResponse.length;
		
        storageStream.init(8192, count, null);
      
        binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
	
		binaryOutputStream.writeBytes(processedResponse, newcount);
		//binaryOutputStream.writeBytes(testString,testString.length);
        //this.receivedData.push(data);

		//this.accessCookie();
        this.originalListener.onDataAvailable(request, context, storageStream.newInputStream(0), offset, newcount);
		//myOffset = myOffset + data.length;
    },

    onStartRequest: function(request, context) {		
		//setXAPITTTCookies(request, context);
        this.originalListener.onStartRequest(request, context);
		this.receivedData = [];
    },

    onStopRequest: function(request, context, statusCode)
    {       		
		this.originalListener.onStopRequest(request, context, statusCode);
    },

    QueryInterface: function (aIID) {
		if (aIID.equals(Ci.nsIStreamListener) || aIID.equals(Ci.nsISupports)) {
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
		
		for(i=0; i < temp.length; i++) {
			if(i%2!=0) {
				if(temp[i-1].indexOf("<IIS8803_RN>") > -1) {
					toBeIncluded = toBeIncluded + temp[i].subString(0,temp[i].length -2); 
				}	
			}
			else {
				toBeIncluded = toBeIncluded + temp[i].substring(0,temp[i].length -1);
			}
		}
		toBeIncluded.replace("<IIS8803_RN>","");
		toBeIncluded.replace("</IIS8803_RN>","");
		responseSource = toBeIncluded + ">";
	}
	return responseSource;
    },	

	accessCookie: function() {
		var ios = Components
  			.classes["@mozilla.org/network/io-service;1"]
  			.getService(Components.interfaces.nsIIOService);
		var topLevelDomain = this.getTopLevelDomain(window.content.document.domain);
		var cookieUri = ios.newURI("http://" + topLevelDomain, null, null);
	
		var cookieSvc = Components
  			.classes["@mozilla.org/cookieService;1"]
  			.getService(Components.interfaces.nsICookieService);					
	}
		
};
/*
function getTopLevelDomain(domain) {        
   if(domain != null)
   {
		   var domainArray = domain.split(".");        
		   if(domainArray[domainArray.length - 1].length == 2)
		   {
				   return "." + domainArray[domainArray.length - 3] + "." + domainArray[domainArray.length - 2] + "." + domainArray[domainArray.length - 1];
		   }
		   else
		   {
				   return "." + domainArray[domainArray.length - 2] + "." + domainArray[domainArray.length - 1];
		   }
   }        
}

function setXAPITTTCookies(request, context) {	
	
	var random_number = Math.floor(Math.random()*10000000 +1);

	var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		
	alert(request);
	alert(context);
	alert(window.content.document);
	var topLevelDomain = getTopLevelDomain(window.content.document.domain);		
	var cookieUri = ios.newURI("http://" + topLevelDomain, null, null);
	
	var cookieSvc = Components.classes["@mozilla.org/cookieService;1"].getService(Components.interfaces.nsICookieService);
	alert(topLevelDomain);	
	if(cookieSvc.getCookieString(cookieUri, null).indexOf("XAPITTT_Trusted_Token") != -1)
	{
		if(!cookieSet) {
			cookieSvc.setCookieString(cookieUri, null, "XAPITTT_Trusted_Token="+random_number+ "; domain=" + topLevelDomain, null);
			//window.alert("Not set: The cookie is " + window.content.document.cookie);
		}
		else {			
			cookieSvc.setCookieString(cookieUri, null, "XAPITTT_Trusted_Token="+random_number+ "; domain=" + topLevelDomain, null);							
		}
	}
}*/