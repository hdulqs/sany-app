package com.hand.calendar.timessquare;

import java.lang.reflect.Field;

import android.content.Context;
import android.graphics.Color;
import android.view.ContextThemeWrapper;
import android.widget.LinearLayout;
import android.widget.TextView;

public class DefaultDayViewAdapter implements DayViewAdapter {
  private Context mContext;

@Override
  public void makeCellView(CalendarCellView parent) {
    mContext = parent.getContext();
      TextView textView = new TextView(
              new ContextThemeWrapper(parent.getContext(), getStyleId("CalendarCell_CalendarDate")));
      textView.setDuplicateParentStateEnabled(true);
      textView.setTextColor(Color.rgb(255, 255, 255));

      TextView textView1 = new TextView(
              new ContextThemeWrapper(parent.getContext(), getStyleId("CalendarCell_CalendarDate")));
      textView1.setDuplicateParentStateEnabled(true);
      textView1.setTextSize(14);

      LinearLayout daylinearlayout = new LinearLayout(parent.getContext());
      daylinearlayout.setOrientation(LinearLayout.VERTICAL);
  //    daylinearlayout.addView(textView);
  //    daylinearlayout.addView(textView1);

      parent.addView(textView);
      parent.setDayOfMonthTextView(textView);
   //   parent.setDayLunarTextView(textView1);
  }

private int getStyleId(String styleName) {
    try {
      Class<?> loadClass = mContext.getClassLoader().loadClass(mContext.getPackageName() + ".R");
      Class<?>[] classes = loadClass.getClasses();
      for (int i = 0; i < classes.length; i++) {
        if (classes[i].getName().equals(mContext.getPackageName() + ".R$style")) {
          Field field = classes[i].getField(styleName);
          int attrId = field.getInt(null);
          return attrId;
        }
      }
    } catch (Exception e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    return 0;
  }
}
