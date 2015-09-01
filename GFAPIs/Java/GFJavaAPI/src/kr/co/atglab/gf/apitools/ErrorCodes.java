package kr.co.atglab.gf.apitools;

import java.util.HashMap;
import java.util.Map;

public class ErrorCodes {

	private static Map<String, String> codeMap = new HashMap<String,String>(){
		
		private static final long serialVersionUID = 1L;

		{	
			put("200","ok");
			put("201","Created");
			put("400","Bad Request");
			put("401","Unauthorized");
			put("403","Forbidden");
			put("409","Conflict");
			put("500","Internal Server Error");
			put("505","not valid authorization");

			put("4001","Failed to read the record");
			put("4002","Failed to read records");
			put("4003","Failed to write the new record");
			put("4004","Invalid record id");
			put("4005","Duplicated record id");
			put("4006","Failed to update the record");
			put("4007","Failed to remove the record");
			put("4008","Failed to aggregated records");
			put("4009","Failed to count records");
		}
	};

	public static String getErrorMessage(String errCode){
		String message = null;
		message = ErrorCodes.codeMap.get(errCode);
		if(message == null){
			return "Unknown error code";
		}else{
			return message;
		}
	}
	
	public static String getErrorMessage(int errCode){
		String strErrCode = null;
		try{
			strErrCode = Integer.toString(errCode);
		}catch(Exception e){
			return "Invalid error code";
		}
		return ErrorCodes.getErrorMessage(strErrCode);
	}
}
