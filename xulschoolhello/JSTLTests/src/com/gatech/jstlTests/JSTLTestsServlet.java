package com.gatech.jstlTests;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class JSTLTestsServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException, ServletException {
		req.setAttribute("rNumber", "1234567");
		RequestDispatcher rDispatcher = getServletContext().getRequestDispatcher("/index.jsp");
		rDispatcher.forward(req, resp);
	}
}
