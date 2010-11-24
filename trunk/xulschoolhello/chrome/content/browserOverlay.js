if("undefined" == typeof(XULSchoolChrome)){
var XULSchoolChrome = {};
};

XULSchoolChrome.BrowserOverlay = {

sayHello : function(aEvent)
{
var random_number = Math.floor(Math.random()*10000000 +1);
var locate = window.location.toString();
window.alert("URL11111: " + window.content.document.location.href);

}

}