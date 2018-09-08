package com.hand.calendar.timessquare;

import android.os.Parcel;
import android.os.Parcelable;

import java.util.ArrayList;
import java.util.Date;

/**
 * Created by panx on 2017/5/20.
 */
public class BanDate implements Parcelable{
  private String startTime = "0000-00-00";
  private String endTime = "9999-99-99";
  private ArrayList<String> banList = new ArrayList<String>();
  private String selectedDate;

  public BanDate(){
  }


  protected BanDate(Parcel in) {
    startTime = in.readString();
    endTime = in.readString();
    banList = in.createStringArrayList();
    selectedDate = in.readString();
  }

  @Override
  public void writeToParcel(Parcel dest, int flags) {
    dest.writeString(startTime);
    dest.writeString(endTime);
    dest.writeStringList(banList);
    dest.writeString(selectedDate);
  }

  @Override
  public int describeContents() {
    return 0;
  }

  public static final Creator<BanDate> CREATOR = new Creator<BanDate>() {
    @Override
    public BanDate createFromParcel(Parcel in) {
      return new BanDate(in);
    }

    @Override
    public BanDate[] newArray(int size) {
      return new BanDate[size];
    }
  };


  public void setSelectedDate(String selectedDate) {
    this.selectedDate = selectedDate;
  }

  public Date getSelectedDate(){
    if(selectedDate == null){
      return null;
    }
    Date date = new Date();
    String[] dates = selectedDate.split("-");
    if(dates.length == 3) {
      date.setYear(Integer.valueOf(dates[0]) - 1900);
      date.setMonth(Integer.valueOf(dates[1]) - 1);
      date.setDate(Integer.valueOf(dates[2]));
      return date;
    }else{
      return null;
    }
  }

  public String getStartTime() {
    return startTime;
  }

  public void setStartTime(String startTime) {
    if(startTime!=null && startTime.equals("-")){
      startTime = "0000-00-00";
    }
    this.startTime = startTime;
  }

  public String getEndTime() {
    return endTime;
  }

  public void setEndTime(String endTime) {
    if(endTime!=null && endTime.equals("-")){
      endTime = "9999-99-99";
    }
    this.endTime = endTime;
  }

  public ArrayList<String> getBanList() {
    return banList;
  }

  public void setBanList(ArrayList<String> banList) {
    this.banList = banList;
  }

  public boolean isBanDate(Date currentDate){
    boolean isBanDate = false;
    if(sort(startTime,currentDate) > 0){
      return true;
    }
    if(sort(endTime,currentDate) < 0){
      return true;
    }

    for(int i= 0 ;i < banList.size();i++){
      if(sort(banList.get(i),currentDate)==0){
        return true;
      }
    }

    return isBanDate;
  }


  public boolean isSelected(Date currentDate){
    if(selectedDate == null||selectedDate.length()==0){
      return false;
    }else{
      if(sort(selectedDate,currentDate)==0){
        return true;
      }
    }
    return false;
  }

  /**
   * 当banDate < currentDate 时 返回< 0
   * @param banDate
   * @param currentDate
   * @return
     */
  private int sort(String banDate,Date currentDate){
    String[] banDates = banDate.split("-");
    int banYear = Integer.parseInt(banDates[0]);
    int banMonth = Integer.parseInt(banDates[1]);
    int banDay = Integer.parseInt(banDates[2]);

    int currentYear = currentDate.getYear()+1900;
    int currentMonth = currentDate.getMonth()+1;
    int currentDay = currentDate.getDate();
    if(banYear<currentYear){
      return -1;
    }else if(banYear > currentYear){
      return 1;
    }else if(banMonth<currentMonth){
      return -1;
    }else if(banMonth>currentMonth){
      return 1;
    }else if(banDay<currentDay){
      return -1;
    }else if(banDay>currentDay){
      return 1;
    }
    return 0;
  }
}
