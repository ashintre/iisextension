package com.gatech.jstlTags;

import java.io.IOException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.BodyContent;
import javax.servlet.jsp.tagext.BodyTagSupport;

@SuppressWarnings("serial")
public class TrustedCodeTag extends BodyTagSupport
{
	private static final String SECURITY_TOKEN = "DXD_Trusted_Token";
	@Override
	public int doStartTag() throws JspException
	{		
		System.out.println("In start Tag");		
		return EVAL_BODY_BUFFERED;
	}
	
	public int doEndTag() throws JspException
	{
		System.out.println("In End Tag");
		try
		{
			BodyContent bc = getBodyContent();
            String body = bc.getString();
            JspWriter out = bc.getEnclosingWriter();
            HttpServletRequest req = (HttpServletRequest)pageContext.getRequest();            
    		for(Cookie cookie : req.getCookies())
    		{
    			System.out.println("Cookie Name : " + cookie.getName());
    			System.out.println("Cookie Value : " + cookie.getValue());
    			if(cookie.getName().equalsIgnoreCase(SECURITY_TOKEN))
    			{
    				out.println("<"+cookie.getValue()+">");
    				out.println(body);
    				out.println("</"+cookie.getValue()+">");
    			}
    		}
		}
		catch(IOException ioe)
		{
			throw new JspException("Error : " + ioe.getMessage());
		}
		return SKIP_BODY;
	}
}
