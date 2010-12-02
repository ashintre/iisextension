window.addEventListener("load", function() { myExtension.init(); }, false);

//var checkLoadValue = "0" + window.content.document.location.href; 

var myExtension = {
  //var checkLoadValue = "0" + window.content.document.location.href; 
  init: function() {
	alert("In script!");
    	var appcontent = document.getElementById("appcontent");   // browser
 	if(appcontent)
      		appcontent.addEventListener("DOMContentLoaded", myExtension.onPageLoad, true);
    	var messagepane = document.getElementById("messagepane"); // mail
	if(messagepane) {
      		messagepane.addEventListener("load", function() { myExtension.onPageLoad(); }, true);
	}
  },

  onPageLoad: function(aEvent) {
    	var doc = aEvent.originalTarget;
	//alert("checkLoadValue is " + checkLoadValue);
	
	var currentLoc = window.content.document.location.href;	
	
	if(doc.nodeName == "#document") {

		//Set a Cookie
		var cookieSet = window.content.document.cookie;

		var random_number = Math.floor(Math.random()*10000000 +1);

		var ios = Components
  			.classes["@mozilla.org/network/io-service;1"]
  			.getService(Components.interfaces.nsIIOService);
		var cookieUri = ios
  			.newURI(window.content.document.location.href, null, null);
		var cookieSvc = Components
  			.classes["@mozilla.org/cookieService;1"]
  			.getService(Components.interfaces.nsICookieService);

		if(!cookieSet) {
		//	alert("In if");
			cookieSvc.setCookieString(cookieUri, null, ";" + "RANDOM_NUMBER="+random_number, null);
			window.alert("The cookie is " + window.content.document.cookie);
		}
		else {
		//	alert("In else : " + cookieSet );
			cookieSvc.setCookieString(cookieUri, null, "RANDOM_NUMBER="+random_number, null);
			window.alert("The cookie is " + window.content.document.cookie);						
		}	    	
		// add event listener for page unload 
    		aEvent.originalTarget.defaultView.addEventListener("unload", function(){ myExtension.onPageUnload(); }, true); 
	}
	//checkLoadValue.setCharAt(checkLoadValue,0,"1");
  },

  onPageUnload: function(aEvent) {
    // do something
  }

//OnPageUnload: function(aEvent) {
//    if (aEvent.originalTarget instanceof HTMLDocument) {
//        var doc = aEvent.originalTarget;
//        alert("page unloaded:" + doc.location.href);
//    }
//}


}