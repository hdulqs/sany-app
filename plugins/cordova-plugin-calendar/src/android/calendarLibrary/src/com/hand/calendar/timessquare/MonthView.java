// Copyright 2012 Square, Inc.
package com.hand.calendar.timessquare;

import java.text.DateFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

import android.content.Context;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.hand.calendar.R;

public class MonthView extends LinearLayout {
  TextView title;
  CalendarGridView grid;
  private Listener listener;
  private List<CalendarCellDecorator> decorators;
  private boolean isRtl;
  private Locale locale;
  private LunarCalendar lc = new LunarCalendar(); // 阴历
  public static String[] weekDays = { "日", "一", "二", "三", "四", "五", "六" };
  public static String chineseTen[] = { "初", "十", "廿", "卅" };

  public static MonthView create(ViewGroup parent, LayoutInflater inflater, DateFormat weekdayNameFormat,
      Listener listener, Calendar today, int dividerColor, int dayBackgroundResId, int dayTextColorResId,
      int titleTextColor, boolean displayHeader, int headerTextColor, Locale locale, DayViewAdapter adapter) {
    return create(parent, inflater, weekdayNameFormat, listener, today, dividerColor, dayBackgroundResId,
        dayTextColorResId, titleTextColor, displayHeader, headerTextColor, null, locale, adapter);
  }

  public static MonthView create(ViewGroup parent, LayoutInflater inflater, DateFormat weekdayNameFormat,
      Listener listener, Calendar today, int dividerColor, int dayBackgroundResId, int dayTextColorResId,
      int titleTextColor, boolean displayHeader, int headerTextColor, List<CalendarCellDecorator> decorators,
      Locale locale, DayViewAdapter adapter) {
    weekDays = new String[]{parent.getContext().getString(R.string.Sun),
      parent.getContext().getString(R.string.Mon),
      parent.getContext().getString(R.string.Tues),
      parent.getContext().getString(R.string.Wed),
      parent.getContext().getString(R.string.Thur),
      parent.getContext().getString(R.string.Fri),
      parent.getContext().getString(R.string.Sat)};
    int layoutId = parent.getContext().getResources().getIdentifier("month", "layout",
        parent.getContext().getPackageName());
    final MonthView view = (MonthView) inflater.inflate(layoutId, parent, false);
    view.setDayViewAdapter(adapter);
    view.setDividerColor(dividerColor);
    view.setDayTextColor(dayTextColorResId);
    view.setTitleTextColor(titleTextColor);
    view.setDisplayHeader(displayHeader);
    view.setHeaderTextColor(headerTextColor);

    if (dayBackgroundResId != 0) {
      view.setDayBackground(dayBackgroundResId);
    }

    final int originalDayOfWeek = today.get(Calendar.DAY_OF_WEEK);

    view.isRtl = isRtl(locale);
    view.locale = locale;
    int firstDayOfWeek = today.getFirstDayOfWeek();
    final CalendarRowView headerRow = (CalendarRowView) view.grid.getChildAt(0);
    for (int offset = 0; offset < 7; offset++) {
      today.set(Calendar.DAY_OF_WEEK, getDayOfWeek(firstDayOfWeek, offset, view.isRtl));
      final TextView textView = (TextView) headerRow.getChildAt(offset);
      // textView.setText(weekdayNameFormat.format(today.getTime()));
      textView.setText(weekDays[offset]);

    }
    today.set(Calendar.DAY_OF_WEEK, originalDayOfWeek);
    view.listener = listener;
    view.decorators = decorators;
    return view;
  }

  private static int getDayOfWeek(int firstDayOfWeek, int offset, boolean isRtl) {
    int dayOfWeek = firstDayOfWeek + offset;
    if (isRtl) {
      return 8 - dayOfWeek;
    }
    return dayOfWeek;
  }

  private static boolean isRtl(Locale locale) {
    // TODO convert the build to gradle and use getLayoutDirection instead
    // of this (on 17+)?
    final int directionality = Character.getDirectionality(locale.getDisplayName(locale).charAt(0));
    return directionality == Character.DIRECTIONALITY_RIGHT_TO_LEFT
        || directionality == Character.DIRECTIONALITY_RIGHT_TO_LEFT_ARABIC;
  }

  public MonthView(Context context, AttributeSet attrs) {
    super(context, attrs);
  }

  public void setDecorators(List<CalendarCellDecorator> decorators) {
    this.decorators = decorators;
  }

  public List<CalendarCellDecorator> getDecorators() {
    return decorators;
  }

  @Override
  protected void onFinishInflate() {
    super.onFinishInflate();
    title = (TextView) findViewById(getId("title"));
    grid = (CalendarGridView) findViewById(getId("calendar_grid"));
  }

  public void init(MonthDescriptor month, List<List<MonthCellDescriptor>> cells, boolean displayOnly,
      Typeface titleTypeface, Typeface dateTypeface) {
    Logr.d("Initializing MonthView (%d) for %s", System.identityHashCode(this), month);
    long start = System.currentTimeMillis();

    title.setText(month.getLabel());
    NumberFormat numberFormatter = NumberFormat.getInstance(locale);

    final int numRows = cells.size();
    grid.setNumRows(numRows);
    for (int i = 0; i < 6; i++) {
      CalendarRowView weekRow = (CalendarRowView) grid.getChildAt(i + 1);
      weekRow.setListener(listener);
      if (i < numRows) {
        weekRow.setVisibility(VISIBLE);
        List<MonthCellDescriptor> week = cells.get(i);
        for (int c = 0; c < week.size(); c++) {
          MonthCellDescriptor cell = week.get(isRtl ? 6 - c : c);
          CalendarCellView cellView = (CalendarCellView) weekRow.getChildAt(c);

          String cellDate = numberFormatter.format(cell.getValue());

          // if
          // (!cellView.getDayOfMonthTextView().getText().equals(cellDate))
          // {
          if (cell.isCurrentMonth()) {
            String templunar = ""; // 阴历日期

            templunar = lc.getLunarDate(cell.getValueyear(), cell.getValuemonth() + 1, cell.getValue(),
                false);
            if (cell.getValuemonth() == 3) {
              Log.d("4月", cell.getValuemonth() + "  " + templunar);
            }
            cellView.getDayOfMonthTextView().setText(cellDate);
            cellView.getDayOfMonthTextView().setTextSize(14);
            // cellView.getDayOfMonthTextView().setTextColor(getResources().getColor(R.color.calendar_text_active));
            // cellView.getDayLunarTextView().setText(templunar);
            String temp1 = templunar.substring(0, 1);
            if(!isEn()) {
              /*if (temp1.equals("初") || templunar.substring(0, 1).equals("十")
                || templunar.substring(0, 1).equals("廿") || templunar.substring(0, 1).equals("卅")) {
                cellView.getDayOfMonthTextView().setText(cellDate);
                cellView.getDayOfMonthTextView().setTextSize(14);
              } else {
                cellView.getDayOfMonthTextView().setText(templunar);
                cellView.getDayOfMonthTextView().setTextSize(12);
                cell.setIsHoliday(true);
              }*/
            }

            // cellView.getDayOfMonthTextView().setCompoundDrawablesRelativeWithIntrinsicBounds(null,null,null,null);
            // 设置补上班的小图标 "2016".equals(month.getStringYear().trim())
            if (!isEn()) { // 将"2016".equals(month.getStringYear().trim())
                  // 修改为true

              if (lc.getDayType(cell.getValueyear(), cell.getValuemonth() + 1, cell.getValue())
                  .equals("work")) {
                cell.setIsWork(true);
              }
              if (lc.getDayType(cell.getValueyear(), cell.getValuemonth() + 1, cell.getValue())
                  .equals("relax")) {
                cell.setIsRelax(true);
              }
            }

          } else {

            cellView.getDayOfMonthTextView().setText("");
            // cellView.getDayLunarTextView().setText("");
          }

          // }
          cellView.setEnabled(cell.isCurrentMonth());
          cellView.setClickable(cell.isSelectable());

          cellView.setSelectable(cell.isSelectable());
          cellView.setSelected(cell.isSelected());
          cellView.setCurrentMonth(cell.isCurrentMonth());
          cellView.setToday(cell.isToday());
          cellView.setRangeState(cell.getRangeState());
          cellView.setHighlighted(cell.isHighlighted());
          cellView.setHoliday(cell.isHoliday());
          cellView.setWork(cell.isWork());
          cellView.setRelax(cell.isRelax());
          cellView.setTag(cell);

          if (null != decorators) {
            for (CalendarCellDecorator decorator : decorators) {
              decorator.decorate(cellView, cell.getDate());
            }
          }
        }
      } else {
        weekRow.setVisibility(GONE);
      }
    }

    if (titleTypeface != null) {
      title.setTypeface(titleTypeface);
    }
    if (dateTypeface != null) {
      grid.setTypeface(dateTypeface);
    }

    Logr.d("MonthView.init took %d ms", System.currentTimeMillis() - start);
  }

  public void setDividerColor(int color) {
    grid.setDividerColor(color);
  }

  public void setDayBackground(int resId) {
    grid.setDayBackground(resId);
  }

  public void setDayTextColor(int resId) {
    grid.setDayTextColor(resId);
  }

  public void setDayViewAdapter(DayViewAdapter adapter) {
    grid.setDayViewAdapter(adapter);
  }

  public void setTitleTextColor(int color) {
    title.setTextColor(color);
  }

  public void setDisplayHeader(boolean displayHeader) {
    grid.setDisplayHeader(displayHeader);
  }

  public void setHeaderTextColor(int color) {
    grid.setHeaderTextColor(color);
  }

  public interface Listener {
    void handleClick(MonthCellDescriptor cell);
  }

  private int getId(String idName) {
    return getContext().getResources().getIdentifier(idName, "id", getContext().getPackageName());
  }

  private boolean isEn() {
    Locale locale = getResources().getConfiguration().locale;
    String language = locale.getLanguage();
    if (language.endsWith("en"))
      return true;
    else
      return false;
  }

}
