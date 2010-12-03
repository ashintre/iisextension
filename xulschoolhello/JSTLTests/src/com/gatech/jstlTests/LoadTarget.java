package com.gatech.jstlTests;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class LoadTarget  extends HttpServlet 
{
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
	throws IOException, ServletException {			
		String nextUri = "on".equals(req.getParameter("loadSanitisedPage")) ? "/sanitisedPage.jsp" : "/badPage.jsp";
		RequestDispatcher rDispatcher = getServletContext().getRequestDispatcher(nextUri);
		rDispatcher.forward(req, resp);
	}
}
