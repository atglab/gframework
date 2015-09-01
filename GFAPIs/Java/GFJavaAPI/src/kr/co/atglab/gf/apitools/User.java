package kr.co.atglab.gf.apitools;

import java.util.Date;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;



public class User {
	
	private String _id;
	private String id;
	private String name;
	private String nickname;
	private int gender;
	private long birthday;
	private String profile;
	private ArrayList<UserReward> rewards;
	private ArrayList<UserMission> missions;
	
	private Date updated_at;
	private Date created_at;
	
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public int getGender() {
		return gender;
	}
	public void setGender(int gender) {
		this.gender = gender;
	}
	public long getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date date = sdf.parse(birthday);			
			this.birthday = date.getTime() / 1000;
		} catch (ParseException e) {
			e.printStackTrace();
			this.birthday = 0;
		}
	}
	public void setBirthday(long birthday) {
		this.birthday = birthday;
	}
	public String getProfile() {
		return profile;
	}
	public void setProfile(String profile) {
		this.profile = profile;
	}
	public ArrayList<UserReward> getRewards() {
		return rewards;
	}
	public void setRewards(ArrayList<UserReward> rewards) {
		this.rewards = rewards;
	}
	public ArrayList<UserMission> getMissions() {
		return missions;
	}
	public void setMissions(ArrayList<UserMission> missions) {
		this.missions = missions;
	}
	public Date getUpdated_at() {
		return updated_at;
	}
	public void setUpdated_at(Date updated_at) {
		this.updated_at = updated_at;
	}
	public Date getCreated_at() {
		return created_at;
	}
	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}
	
	public String toJsonString(){
		String json = "";
		
		
		GsonBuilder builder = new GsonBuilder();
		builder.registerTypeAdapter(Long.class, new LongSerializer());
		builder.registerTypeAdapter(Integer.class, new IntegerSerializer());
		Gson gson = builder.create();
		json = gson.toJson(this);
		
		return json;
	}
}
class IntegerSerializer implements JsonSerializer<Integer>{
	@Override
	public JsonElement serialize(Integer src, Type typeOfSrc,
			JsonSerializationContext context) {
		if(src == 0){
			return null;
		}else{
			return new JsonPrimitive(src.toString());
		}
	}
}
class LongSerializer implements JsonSerializer<Long>{
	@Override
	public JsonElement serialize(Long src, Type typeOfSrc,
			JsonSerializationContext context) {
		if(src == 0){
			return null;
		}else{
			return new JsonPrimitive(src.toString());
		}
	}
}


