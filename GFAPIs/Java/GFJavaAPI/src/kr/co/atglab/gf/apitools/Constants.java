package kr.co.atglab.gf.apitools;

/**
 * [APITools] Constants.java
 * 
 * Class used to define global constants
 * e.g.) API path, Server Configuration
 * 
 * @author JungHyun
 * @version 0.3
 */
public class Constants {
	
	public static String SERVER_DOMAIN = "";
	public static String SERVER_PORT = "";
	
	public static final String APIPATH_LOGIN = "/login";
	
	public static final String APIPATH_ACTIVITY_DO = "/api/activities/do";
	public static final String APIPATH_USER_ADD = "/api/users";
	public static final String APIPATH_USER_UPDATE = "/api/users/:id";
	public static final String APIPATH_USER_GET = "/api/users/:id";
	public static final String APIPATH_USER_DELETE = "/api/users/:id";
	public static final String APIPATH_HAS_PERMISSION = "/api/userpermission";
	
	public static final int MAN = 1;
	public static final int WOMAN = 2;
	public static final int OTHER = 0;
	
	public static final String DEFAULT_ENCODING = "UTF-8";
	public static final int TIMEOUT = 30000;
	
	public static void setServer(String domain, String port){
		Constants.SERVER_DOMAIN = domain;
		Constants.SERVER_PORT = port;
	}
}
