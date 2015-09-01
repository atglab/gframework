package kr.co.atglab.gf.apitools;

import java.io.IOException;
import java.io.InputStream;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * [APITools] ApiTools.java
 * 
 * Class used to communicate with the GFServer
 * 
 * @author JungHyun
 * @version 0.3
 *
 */
public class ApiTools {
	
	private static String serverPath;
	
	private static String token;	
	private static String username;
	
	/**
	 * Method to set server configuration
	 * 
	 * @param domain domain or ip address of GFServer (foo.com or 123.456.789.012)
	 * @param port port number of GFServer (3000)
	 */
	public static void setServer(final String domain, final String port){
		Constants.setServer(domain, port);
		serverPath = "http://" + domain + ":" + port;
	}
	
	public static boolean authenticate(final String ausername, final String password){
		String api_URL = serverPath + Constants.APIPATH_LOGIN;
		
		List<NameValuePair> qparams=new ArrayList<NameValuePair>();
		qparams.add(new BasicNameValuePair("username",ausername));
		qparams.add(new BasicNameValuePair("password",password));
		
		InputStream is = HttpHandler.sendRequest(api_URL, "POST", Constants.DEFAULT_ENCODING, qparams, null, null);
		
		if(is == null){			
			return false;
		}
		try{
			byte[] buffer = new byte[is.available()];
			is.read(buffer);
			String result = new String(buffer, Constants.DEFAULT_ENCODING);
			
			System.out.println(result);
			
			JsonParser jsonParser = new JsonParser();
			JsonObject jo = (JsonObject)jsonParser.parse(result);
			JsonElement je = jo.get("success");
			
			if(je.getAsBoolean()){
				je = jo.get("data");
				if(je != null){
					JsonObject data = je.getAsJsonObject();
					
					JsonElement tokenE = data.get("token");
					
					token = tokenE.getAsString();					
					username = ausername;
					
					return true;
				}
			}else{
				return false;
			}
		}catch(IOException e){
			e.printStackTrace();
			return false;
		}
		return false;
	}
	
	/** 
	 * [API 1. Activities] DO_ACTIVITY 
	 * 
	 * Call this method when a user's activity has occurred
	 * 
	 * @param activityId id of activity
	 * @param userId id of user
	 * @return null or message
	 */
	public static String apiDoActivity(String activityId, String userId){
				
		String api_URL = serverPath + Constants.APIPATH_ACTIVITY_DO;
		
		List<NameValuePair> qparams=new ArrayList<NameValuePair>();
		qparams.add(new BasicNameValuePair("aid",activityId));
		qparams.add(new BasicNameValuePair("uid",userId));
		
		InputStream is = HttpHandler.sendRequest(api_URL, "GET", Constants.DEFAULT_ENCODING, qparams, token, username);
		
		if(is == null){			
			return null;
		}
		try{
			byte[] buffer = new byte[is.available()];
			is.read(buffer);
			String result = new String(buffer, Constants.DEFAULT_ENCODING);
			return result;
		}catch(IOException e){
			e.printStackTrace();
			return null;
		}
	}	

	/**
	 * [API 2. Users] ADD_USER 
	 * 
	 * Call this method when the new user is added
	 * 
	 * @param user
	 * @return null or message
	 */
	public static String apiAddUser(User user){
		
		String api_URL = serverPath + Constants.APIPATH_USER_ADD;
		
		List<NameValuePair> qparams=new ArrayList<NameValuePair>();
		qparams.add(new BasicNameValuePair("data",user.toJsonString()));
		
		InputStream is = HttpHandler.sendRequest(api_URL, "POST", Constants.DEFAULT_ENCODING, qparams, token, username);
		
		if(is == null){			
			return null;
		}
		try{
			byte[] buffer = new byte[is.available()];
			is.read(buffer);
			String result = new String(buffer, Constants.DEFAULT_ENCODING);
			return result;
		}catch(IOException e){
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * [API 2. Users] UPDATE_USER 
	 * 
	 * Call this method when the new user is added
	 * 
	 * @param user
	 * @return null or message
	 */
	public static String apiUpdateUser(User user){
		String api_URL = serverPath + Constants.APIPATH_USER_UPDATE;
		
		api_URL = api_URL.replace(":id", user.getId());
		
		List<NameValuePair> qparams = new ArrayList<NameValuePair>();
		qparams.add(new BasicNameValuePair("data",user.toJsonString()));
		
		InputStream is = HttpHandler.sendRequest(api_URL, "PUT", Constants.DEFAULT_ENCODING, qparams, token, username);
		
		if(is == null){			
			return null;
		}
		try{
			byte[] buffer = new byte[is.available()];
			is.read(buffer);
			String result = new String(buffer, Constants.DEFAULT_ENCODING);
			return result;
		}catch(IOException e){
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * [API 3. Users] GET_USER 
	 * 
	 * Call this method when you want to get user data by userId
	 * 
	 * @param userId
	 * @return null or User
	 */
	public static User apiGetUser(String userId){
		String api_URL = serverPath + Constants.APIPATH_USER_GET;
		
		api_URL = api_URL.replace(":id", userId);
		
		InputStream is = HttpHandler.sendRequest(api_URL, "GET", Constants.DEFAULT_ENCODING, null, token, username);
		
		if(is == null){			
			return null;
		}
		try{
			byte[] buffer = new byte[is.available()];
			is.read(buffer);
			String result = new String(buffer, Constants.DEFAULT_ENCODING);
			
			JsonParser jsonParser = new JsonParser();
			JsonObject jo = (JsonObject)jsonParser.parse(result);
			JsonElement je = jo.get("data");
			if(je != null){
				Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
				User user = gson.fromJson(je, User.class);
				return user;
			}
			return null;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * [API 4. Users] DELETE_USER 
	 * 
	 * Call this method when the new user is deleted
	 * 
	 * @param userId
	 * @return null or message
	 */
	public static String apiDeleteUser(String userId){
		String api_URL = serverPath + Constants.APIPATH_USER_DELETE;
		
		api_URL = api_URL.replace(":id", userId);
		
		InputStream is = HttpHandler.sendRequest(api_URL, "DELETE", Constants.DEFAULT_ENCODING, null, token, username);
		
		if(is == null){			
			return null;
		}
		try{
			byte[] buffer = new byte[is.available()];
			is.read(buffer);
			String result = new String(buffer, Constants.DEFAULT_ENCODING);			
			return result;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * [API 5. Users] HAS_PERMISSION 
	 * 
	 * Call this method when you want to know whether the user has the permission
	 * 
	 * @param userId
	 * @param permissionId
	 * @return
	 */
	public static boolean apiHasPermission(String userId, String permissionId){
		
		String api_URL = serverPath + Constants.APIPATH_HAS_PERMISSION;
		
		List<NameValuePair> qparams=new ArrayList<NameValuePair>();
		qparams.add(new BasicNameValuePair("uid",userId));
		qparams.add(new BasicNameValuePair("pid",permissionId));
		
		InputStream is = HttpHandler.sendRequest(api_URL, "GET", Constants.DEFAULT_ENCODING, qparams, token, username);
		
		if(is == null){			
			return false;
		}
		try{
			byte[] buffer = new byte[is.available()];
			is.read(buffer);
			String result = new String(buffer, Constants.DEFAULT_ENCODING);
			
			JsonParser jsonParser = new JsonParser();
			JsonObject jo = (JsonObject)jsonParser.parse(result);
			JsonElement je = jo.get("data");
			if(je != null){
				return je.getAsBoolean();
			}
			return false;
		}catch(IOException e){
			e.printStackTrace();
			return false;
		}
	}
}
