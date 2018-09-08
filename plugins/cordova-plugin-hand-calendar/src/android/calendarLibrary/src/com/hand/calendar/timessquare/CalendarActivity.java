package com.hand.calendar.timessquare;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import android.widget.Toast;
import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.widget.ImageView;
import android.widget.TextView;

import com.hand.calendar.R;


public class  CalendarActivity extends Activity {
    TextView mBack;
    private CalendarPickerView calendar;
    public final static int CHOOSE_SINGLE = 1;
    public final static int CHOOSE_RANGE = 2;
    public final static int CHOOSE_NONE = 3;
    public final static int RESTART = 4;

    //unlimit 是否出现不限制
    private boolean isSingle,isUnlimit;
    private TextView mSelectTextView;
    private BanDate banDate;
    private  TextView notLimit;
    private Configuration config;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);// 去掉标题
            String language = getIntent().getStringExtra("language");
       Resources resources = getResources();
    DisplayMetrics dm = resources.getDisplayMetrics();
    config = resources.getConfiguration();
    if (language.equals("en")) {
      config.locale = Locale.ENGLISH;
      resources.updateConfiguration(config, dm);
    } else{
      config.locale = Locale.SIMPLIFIED_CHINESE;
      resources.updateConfiguration(config, dm);
    }
      String country=getResources().getConfiguration().locale.getLanguage();
        if(!country.equals(config.locale.getLanguage())){
            Intent intent = getIntent();
            intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
            setResult(RESTART,intent);
            finish();
        }
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);
        mSelectTextView = (TextView) findViewById(R.id.tv_select);
        notLimit=(TextView)findViewById(R.id.not_limit);
        this.banDate = getIntent().getParcelableExtra("banList");
        init();
        isSingle = getIntent().getBooleanExtra("isSingle", true);
        isUnlimit = getIntent().getBooleanExtra("isUnLimit", false);
        if (isSingle) {
            calendar.setSelectionMode(CalendarPickerView.SelectionMode.SINGLE);
        } else {
            calendar.setSelectionMode(CalendarPickerView.SelectionMode.RANGE);
        }
        if(isUnlimit){
            notLimit.setVisibility(View.VISIBLE);
        }

    }

    private void init() {
        mBack = (TextView) findViewById(R.id.back_iv);
        Calendar nextYear = Calendar.getInstance();
        Calendar startYear = Calendar.getInstance();
        nextYear.add(Calendar.YEAR, 1);
        //        startYear.add(Calendar.YEAR, -1);
        startYear.set(1970,0,01);
        calendar = (CalendarPickerView) findViewById(R.id.calendar_view);
        Date today = new Date();
        if(banDate.getSelectedDate()!=null){
          today = banDate.getSelectedDate();
        }
        calendar.setBanDate(banDate);
        calendar.init(startYear.getTime(), nextYear.getTime(),config.locale).withSelectedDate(today);
        mBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setResult(CHOOSE_NONE);
                finish();
            }
        });

        mSelectTextView.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                List<Date> temp = calendar.getSelectedDates();
                if(temp.size()==0){
                    Toast.makeText(CalendarActivity.this,"请至少选择一个时间",Toast.LENGTH_LONG).show();
                    return;
                }
                SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
                if (isSingle) {
                    Intent intent = new Intent();
                    intent.putExtra("pickData", df.format(temp.get(0)));
                    setResult(CHOOSE_SINGLE, intent);
                } else {
                    Intent intent = new Intent();
                    intent.putExtra("pickDatas",
                            "{\"result\":[\"" + df.format(temp.get(0)) + "\",\"" + df.format(temp.get(temp.size() - 1)) + "\"]}");
                    setResult(CHOOSE_RANGE, intent);
                }
                finish();
            }
        });
        notLimit.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isSingle) {
                    Intent intent = new Intent();
                    intent.putExtra("pickData","");
                    setResult(CHOOSE_SINGLE, intent);
                } else {
                    Intent intent = new Intent();
                    intent.putExtra("pickDatas",
                            "{\"result\":[\"]}");
                    setResult(CHOOSE_RANGE, intent);
                }
                finish();



            }
        });
    }

    private int getId(String id) {
        return getResources().getIdentifier(id, "id", getPackageName());
    }

    private int getLayoutId(String layoutId) {
        return getResources().getIdentifier(layoutId, "layout", getPackageName());
    }
}
