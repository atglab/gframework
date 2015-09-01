package kr.co.atglab.gf.apitools;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.entity.BufferedHttpEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.NameValuePair;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;


/**
 * [APITools] HttpHandler.java
 * 
 * Class used to connect and communicate the Http Server of GF Server
 * 
 * @author JungHyun
 * @version 0.3
 */
public class HttpHandler {
	
	private static final Logger logger = LogManager.getLogger(HttpHandler.class.getName());

	
	/**
	 * method to generate client of HttpRequest
	 * 
	 * @param encType encoding
	 * @return HttpClient object with base information of connection
	 */
	/*
	private static HttpClient getClient(String encType) throws Exception {

		// set basic information of http connection
		HttpParams params = new BasicHttpParams();	
		System.out.println("껄껄2");
		params.setParameter(CoreProtocolPNames.PROTOCOL_VERSION, HttpVersion.HTTP_1_1);
		System.out.println("껄껄3");
		// generate client of http
		HttpClient client = new DefaultHttpClient(params);
		System.out.println("껄껄4");
		// set timeout of connection
		HttpParams p = client.getParams();
		HttpConnectionParams.setConnectionTimeout(p, Constants.TIMEOUT);
		// set timeout of response
		HttpConnectionParams.setSoTimeout(p, Constants.TIMEOUT);
		// set encoding
		if(encType == null) {			
			encType = Constants.DEFAULT_ENCODING;
		}
		HttpProtocolParams.setContentCharset(p, encType);
		
		return client;
	}*/
	
	
	/**
	 *  Method to send a httpRequest to a server (Sync Request) 
	 *  and return a response received from the server
	 *  
	 * @param url
	 * @param method
	 * @param encType
	 * @param qparams
	 * @return
	 */
	public static InputStream sendRequest(String url, String method, String encType, List<NameValuePair> qparams, String token, String key){
		
		InputStream istream = null;
		CloseableHttpResponse response = null;
		CloseableHttpClient client = null;
		
		try {
			 client = HttpClients.createDefault();
			
			// send a request to server and receive the response
			switch(method){
			case "POST":
				HttpPost httppost = new HttpPost(url);
				if(token != null && key != null){
					httppost.setHeader("x-access-token", token);
					httppost.setHeader("x-key", key);
				}
				
				httppost.setEntity(new UrlEncodedFormEntity(qparams, encType));
				response = client.execute(httppost);
				break;
			case "GET":
				if(qparams == null){
					HttpGet httpget = new HttpGet(url);
					
					if(token != null && key != null){
						httpget.setHeader("x-access-token", token);
						httpget.setHeader("x-key", key);
					}
					
					response = client.execute(httpget);
				}else{
					HttpGet httpget = new HttpGet(url + "?"+ URLEncodedUtils.format(qparams,encType));
					
					if(token != null && key != null){
						httpget.setHeader("x-access-token", token);
						httpget.setHeader("x-key", key);
					}
					
					response = client.execute(httpget);
				}
				break;
			case "PUT": 
				HttpPut httpput = new HttpPut(url);
				
				if(token != null && key != null){
					httpput.setHeader("x-access-token", token);
					httpput.setHeader("x-key", key);
				}
				
				httpput.setEntity(new UrlEncodedFormEntity(qparams, encType));
				response = client.execute(httpput);
				break;
			case "DELETE": 
				HttpDelete httpdelete = new HttpDelete(url);
				
				if(token != null && key != null){
					httpdelete.setHeader("x-access-token", token);
					httpdelete.setHeader("x-key", key);
				}
				
				response = client.execute(httpdelete);
				break;
			default: break;
			}
			int resultCode = response.getStatusLine().getStatusCode();
			
			if(resultCode == HttpURLConnection.HTTP_OK) {				
				HttpEntity entity = response.getEntity();
				BufferedHttpEntity buffer = new BufferedHttpEntity(entity);
				istream = buffer.getContent();
			} else {
				logger.error("Server error : (" + resultCode + ") " + ErrorCodes.getErrorMessage(resultCode));
				HttpEntity entity = response.getEntity();
				BufferedHttpEntity buffer = new BufferedHttpEntity(entity);
				istream = buffer.getContent();
			}
		} catch(ClientProtocolException e) {
			logger.error("Communication error : " + e.getLocalizedMessage());
		} catch(IOException e) {			
			logger.error("Receive error : " + e.getLocalizedMessage());
		} catch(Exception e) {
			logger.error("Other error : " + e.getLocalizedMessage());
		} finally {
			// disconnect to server
			try {
				response.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return istream;
	}	
}