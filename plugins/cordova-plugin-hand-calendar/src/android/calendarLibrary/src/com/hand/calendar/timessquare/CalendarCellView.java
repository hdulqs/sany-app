// Copyright 2013 Square, Inc.

package com.hand.calendar.timessquare;

import java.lang.reflect.Field;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.widget.FrameLayout;
import android.widget.TextView;

public class CalendarCellView extends FrameLayout {
  private static int[] STATE_SELECTABLE = null;// {R.attr.tsquare_state_selectable}
  private static int[] STATE_CURRENT_MONTH = null;// {R.attr.tsquare_state_current_month}
  private static int[] STATE_TODAY = null;// { R.attr.tsquare_state_today }
  private static int[] STATE_HIGHLIGHTED = null;// {R.attr.tsquare_state_highlighted}
  private static int[] STATE_RANGE_FIRST = null;// {R.attr.tsquare_state_range_first}
  private static int[] STATE_RANGE_MIDDLE = null;//{ R.attr.tsquare_state_range_middle }
  private static int[] STATE_RANGE_LAST = null;//{ R.attr.tsquare_state_range_last }

  private static int[] STATE_HOLIDAY = null;//{ R.attr.tsquare_state_holiday }

  private static int[] STATE_WORK = null;//{ R.attr.tsquare_state_work }

  private static int[] STATE_RELAX = null;//{ R.attr.tsquare_state_relax }

  private boolean isSelectable = false;
  private boolean isCurrentMonth = false;
  private boolean isToday = false;
  private boolean isHighlighted = false;
  private boolean isHoliday = false;
  private boolean isWork = false;
  private boolean isRelax = false;
  private MonthCellDescriptor.RangeState rangeState = MonthCellDescriptor.RangeState.NONE;
  private TextView dayOfMonthTextView;
  private TextView dayLunarTextView;
  private Context mContext;

  @SuppressWarnings("UnusedDeclaration") //
  public CalendarCellView(Context context, AttributeSet attrs) {
    super(context, attrs);
    this.mContext = context;
  }

  public void setSelectable(boolean isSelectable) {
    if (this.isSelectable != isSelectable) {
      this.isSelectable = isSelectable;
      refreshDrawableState();
    }
  }

  public void setCurrentMonth(boolean isCurrentMonth) {
    if (this.isCurrentMonth != isCurrentMonth) {
      this.isCurrentMonth = isCurrentMonth;
      refreshDrawableState();
    }
  }

  public void setToday(boolean isToday) {
    if (this.isToday != isToday) {
      this.isToday = isToday;
      refreshDrawableState();
    }
  }

  public void setRangeState(MonthCellDescriptor.RangeState rangeState) {
    if (this.rangeState != rangeState) {
      this.rangeState = rangeState;
      refreshDrawableState();
    }
  }

  public void setHighlighted(boolean isHighlighted) {
    if (this.isHighlighted != isHighlighted) {
      this.isHighlighted = isHighlighted;
      refreshDrawableState();
    }
  }

  public void setHoliday(boolean isHoliday) {
    if (this.isHoliday != isHoliday) {
      this.isHoliday = isHoliday;
      refreshDrawableState();
    }
  }

  public void setWork(boolean isWork) {
    if (this.isWork != isWork) {
      this.isWork = isWork;
      refreshDrawableState();
    }
  }

  public void setRelax(boolean isRelax) {
    if (this.isRelax != isRelax) {
      this.isRelax = isRelax;
      refreshDrawableState();
    }
  }

  public boolean isCurrentMonth() {
    return isCurrentMonth;
  }

  public boolean isToday() {
    return isToday;
  }

  public boolean isSelectable() {
    return isSelectable;
  }

  @Override
  protected int[] onCreateDrawableState(int extraSpace) {
    final int[] drawableState = super.onCreateDrawableState(extraSpace + 5);
    if (isSelectable) {
      if (STATE_SELECTABLE == null) {
        STATE_SELECTABLE = new int[] { getAttrId("tsquare_state_selectable") };
        Log.e("399", "123");
      }
      mergeDrawableStates(drawableState, STATE_SELECTABLE);
    }

    if (isCurrentMonth) {
      if (STATE_CURRENT_MONTH == null) {
        STATE_CURRENT_MONTH = new int[] { getAttrId("tsquare_state_current_month") };
      }
      mergeDrawableStates(drawableState, STATE_CURRENT_MONTH);
    }

    if (isToday) {
      if (STATE_TODAY == null) {
        STATE_TODAY = new int[] { getAttrId("tsquare_state_today") };
      }
      mergeDrawableStates(drawableState, STATE_TODAY);
    }

    if (isHighlighted) {
      if (STATE_HIGHLIGHTED == null) {
        STATE_HIGHLIGHTED = new int[] { getAttrId("tsquare_state_highlighted") };
      }
      mergeDrawableStates(drawableState, STATE_HIGHLIGHTED);
    }

    if (rangeState == MonthCellDescriptor.RangeState.FIRST) {
      if (STATE_RANGE_FIRST == null) {
        STATE_RANGE_FIRST = new int[] { getAttrId("tsquare_state_range_first") };
      }
      mergeDrawableStates(drawableState, STATE_RANGE_FIRST);
    } else if (rangeState == MonthCellDescriptor.RangeState.MIDDLE) {
      if(STATE_RANGE_MIDDLE == null){
        STATE_RANGE_MIDDLE = new int[] { getAttrId("tsquare_state_range_middle") };
      }
       mergeDrawableStates(drawableState, STATE_RANGE_MIDDLE);
    } else if (rangeState == MonthCellDescriptor.RangeState.LAST) {
      if(STATE_RANGE_LAST == null){
        STATE_RANGE_LAST = new int[] { getAttrId("tsquare_state_range_last") };
      }
       mergeDrawableStates(drawableState, STATE_RANGE_LAST);
    }

    if (isHoliday) {
      if(STATE_HOLIDAY == null){
        STATE_HOLIDAY = new int[] { getAttrId("tsquare_state_holiday") };
      }
       mergeDrawableStates(drawableState, STATE_HOLIDAY);
    }

    if (isWork) {
      if(STATE_WORK == null){
        STATE_WORK = new int[] { getAttrId("tsquare_state_work") };
      }
       mergeDrawableStates(drawableState, STATE_WORK);
    }

    if (isRelax) {
      if(STATE_RELAX == null){
        STATE_RELAX = new int[] { getAttrId("tsquare_state_relax") };
      }
       mergeDrawableStates(drawableState, STATE_RELAX);
    }

    return drawableState;
  }

  public void setDayOfMonthTextView(TextView textView) {
    dayOfMonthTextView = textView;
  }

  public TextView getDayOfMonthTextView() {
    if (dayOfMonthTextView == null) {
      throw new IllegalStateException("You have to setDayOfMonthTextView in your custom DayViewAdapter.");
    }
    return dayOfMonthTextView;
  }

  public void setDayLunarTextView(TextView textView) {
    dayLunarTextView = textView;
  }

  public TextView getDayLunarTextView() {
    if (dayLunarTextView == null) {
      throw new IllegalStateException("You have to setDayOfMonthTextView in your custom DayViewAdapter.");
    }
    return dayLunarTextView;
  }

  public int getAttrId(String attrName) {
    try {
      Class<?> loadClass = mContext.getClassLoader().loadClass(mContext.getPackageName() + ".R");
      Class<?>[] classes = loadClass.getClasses();
      for (int i = 0; i < classes.length; i++) {
        if (classes[i].getName().equals(mContext.getPackageName() + ".R$attr")) {
          Field field = classes[i].getField(attrName);
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
