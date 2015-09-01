package kr.co.atglab.gf.apitools;

import java.util.Date;

public class UserMission {

	private String missionId;
	private String _id;
	private Date lastUpdated_at;
	private Date lastCompleted_at;
	private int completeCount;
	private int currentStatus;
	
	public String getMissionId() {
		return missionId;
	}
	public void setMissionId(String missionId) {
		this.missionId = missionId;
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
	public Date getLastCompleted_at() {
		return lastCompleted_at;
	}
	public void setLastCompleted_at(Date lastCompleted_at) {
		this.lastCompleted_at = lastCompleted_at;
	}
	public int getCompleteCount() {
		return completeCount;
	}
	public void setCompleteCount(int completeCount) {
		this.completeCount = completeCount;
	}
	public int getCurrentStatus() {
		return currentStatus;
	}
	public void setCurrentStatus(int currentStatus) {
		this.currentStatus = currentStatus;
	}

}
