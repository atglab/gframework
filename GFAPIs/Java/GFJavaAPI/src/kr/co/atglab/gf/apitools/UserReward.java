package kr.co.atglab.gf.apitools;

import java.util.Date;

public class UserReward {

	private String reward_type;
	private String reward_object;
	private int reward_status;
	private String _id;
	private Date lastUpdated_at;
	
	public String getReward_type() {
		return reward_type;
	}
	public void setReward_type(String reward_type) {
		this.reward_type = reward_type;
	}
	public String getReward_object() {
		return reward_object;
	}
	public void setReward_object(String reward_object) {
		this.reward_object = reward_object;
	}
	public int getReward_status() {
		return reward_status;
	}
	public void setReward_status(int reward_status) {
		this.reward_status = reward_status;
	}
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public Date getLastUpdated_at() {
		return lastUpdated_at;
	}
	public void setLastUpdated_at(Date lastUpdated_at) {
		this.lastUpdated_at = lastUpdated_at;
	}

}
