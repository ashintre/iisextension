window.addEventListener("load", function() { setCook.myCookie(); }, false);

var setCook = { 
	myCookie : function() {
		var ios = Components
  			.classes["@mozilla.org/network/io-service;1"]
  			.getService(Components.interfaces.nsIIOService);
		var cookieUri = ios
  			.newURI(window.content.document.location.href, null, null);
		var cookieSvc = Components
  			.classes["@mozilla.org/cookieService;1"]
  			.getService(Components.interfaces.nsICookieService);

		cookieSvc.setCookieString(cookieUri, null, "key=ABC123", null);
		window.alert("The cookie is " + document.cookie);
	}
}