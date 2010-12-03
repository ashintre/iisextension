<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Horrible Code</title>
</head>
<body>
	<form name="loadTarget" action="loadTarget" method="GET">
		Attacks Tag Attribute : <input type="text" name="attacksTagAttribute"></input><br/>
		Attacks Regular Body : <input type="text" name="attacksRegularBody"></input><br/>
		Attacks Style Elements and Attributes : <input type="text" name="attacksStyleElementsAndAttributes"></input><br/>
		Load Trusted Page ? : <input type="checkbox" name="loadSanitisedPage"></input><br/>
		Test Negation : <input type="checkbox" name="testNegation"></input><br/>
		<input type="submit" value="Submit Horrible Code"></input>
	</form>	
</body>
</html>