import httplib
import urllib
import json
import time

from gfuser import User 

class APITools(object):
	
	API_DOACTIVITY_URL = "/api/activities/do"
	API_ADDUSER_URL = "/api/users"

	def __init__(self, server_domain, server_port):
		self.SERVER_DOMAIN = server_domain
		self.SERVER_PORT = server_port
	
	def apiDoActivity(self, activityId, userId):	
		
		apiUrl = self.API_DOACTIVITY_URL + "?aid=%s&uid=%s" % (activityId, userId)
		
		conn = httplib.HTTPConnection(self.SERVER_DOMAIN, self.SERVER_PORT)
		conn.request("GET",apiUrl)
		response = conn.getresponse()
		
		if response.status == httplib.OK: 
			data = response.read()			
			conn.close()
			return data
		else:
			conn.close()
			return "Error"		
		
	def apiAddUser(self, user):

		apiUrl = self.API_ADDUSER_URL
		
		json_data = json.dumps(user.__dict__)
	
		params = {'data' : json_data}
		params = urllib.urlencode(params)
	
		headers = {"Content-Type": "application/x-www-form-urlencoded", "Accept":"text/plain"}
	
		conn = httplib.HTTPConnection(self.SERVER_DOMAIN, self.SERVER_PORT)
		conn.request("POST", apiUrl, params, headers)
		response = conn.getresponse()
		
		if response.status == httplib.OK: 
			data = response.read()			
			conn.close()
			return data
		else:
			conn.close()
			return "Error"
