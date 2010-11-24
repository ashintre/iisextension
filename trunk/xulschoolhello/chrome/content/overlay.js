window.addEventListener("load", function() { myExtension.init(); }, false);
 
var myExtension = {
  init: function() {
    var appcontent = document.getElementById("appcontent");   // browser
    if(appcontent)
      appcontent.addEventListener("DOMContentLoaded", myExtension.onPageLoad, true);
    var messagepane = document.getElementById("messagepane"); // mail
    if(messagepane)
      messagepane.addEventListener("load", function() { myExtension.onPageLoad(); }, true);
  },

  onPageLoad: function(aEvent) {
    var doc = aEvent.originalTarget;
if(aEvent.originalTarget.nodeName == "#document") 
    alert("page loaded");
    // add event listener for page unload 
    aEvent.originalTarget.defaultView.addEventListener("unload", function(){ myExtension.onPageUnload(); }, true);
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