package hand;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.util.Log;

import com.hand.calendar.timessquare.BanDate;
import com.hand.calendar.timessquare.CalendarActivity;

public class CalendarListViewPlugin extends CordovaPlugin {
 private CallbackContext mCallbackContext;
  //isUnlimit 控制是否出现不限制 ， 这里没有把boolean 转序列化。如果出现较多boolean类型建议转byte 丢序列化。
  private boolean isClick = false,isUnlimit=false;//控制开关，防止连续点击2次
  private BanDate banDate;
  private String language;
  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    this.mCallbackContext = callbackContext;
    if (isClick) {
      return true;
    }
    if ("openCalendar".equals(action)) {
    language = null;
      banDate = null;
      String type = args.getString(0);
      JSONObject object = args.optJSONObject(1);
      initBanDate(object);
      isClick = true;
      if ("2".equals(type)) {//选择单个日期
        Intent singleIntent = new Intent(cordova.getActivity(), CalendarActivity.class);
        singleIntent.putExtra("isSingle", true);
        singleIntent.putExtra("banList", banDate);
        singleIntent.putExtra("language",language);
        singleIntent.putExtra("isUnLimit",isUnlimit);
        cordova.startActivityForResult(this, singleIntent, 0);
      } else if ("1".equals(type)) {//选择日期期间
        Intent rangeIntent = new Intent(cordova.getActivity(), CalendarActivity.class);
        rangeIntent.putExtra("isSingle", false);
        rangeIntent.putExtra("banList", banDate);
        rangeIntent.putExtra("language",language);
        rangeIntent.putExtra("isUnLimit",isUnlimit);

        cordova.startActivityForResult(this, rangeIntent, 1);
      }
      return true;
    }

    mCallbackContext.error("error");
    return false;
  }

  private void initBanDate(JSONObject object) {
    banDate = new BanDate();
    if (object != null) {

      String startDate = object.optString("startTime", "-");
      String endDate = object.optString("endTime", "-");
      JSONArray array = object.optJSONArray("dates");
      if(array==null||array.length()>=0){
        array.put("1970-01-1");
      }
      String selectedDate = object.optString("selectedDate");
      language = object.optString("language");
      isUnlimit= object.optBoolean("unlimit");
      if (array != null) {
        for (int i = 0; i < array.length(); i++) {
          String date = array.optString(i);
          banDate.getBanList().add(date);
        }
      }
      banDate.setStartTime(startDate);
      banDate.setEndTime(endDate);
      banDate.setSelectedDate(selectedDate);
    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent intent) {
    super.onActivityResult(requestCode, resultCode, intent);
    isClick = false;
    if(resultCode == CalendarActivity.RESTART){
      cordova.startActivityForResult(this,intent,requestCode);
    }else if (resultCode == CalendarActivity.CHOOSE_SINGLE) {
      String pickData = intent.getStringExtra("pickData");
      mCallbackContext.success(pickData);
      //Log.e("399", pickData);
    } else if (resultCode == CalendarActivity.CHOOSE_RANGE) {
      String pickDatas = intent.getStringExtra("pickDatas");
      mCallbackContext.success(pickDatas);
      //Log.e("399", pickDatas);
    }
  }

}
