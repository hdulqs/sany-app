// Copyright 2012 Square, Inc.

package com.hand.calendar.timessquare;

import java.util.Date;

/** Describes the state of a particular date cell in a {@link MonthView}. */
class MonthCellDescriptor {
  public enum RangeState {
    NONE, FIRST, MIDDLE, LAST
  }

  private final Date date;
  private final int value;
    private final int valuemonth;
    private final int valueyear;
  private final boolean isCurrentMonth;
  private boolean isSelected;
  private final boolean isToday;
  private final boolean isSelectable;
  private boolean isHighlighted;
  private RangeState rangeState;

    private boolean isHoliday=false;
    private boolean isWork=false;
    private boolean isRelax=false;

  MonthCellDescriptor(Date date, boolean currentMonth, boolean selectable, boolean selected,
      boolean today, boolean highlighted, int value,int valuemonth,int valueyear, RangeState rangeState) {
    this.date = date;
    isCurrentMonth = currentMonth;
    isSelectable = selectable;
    isHighlighted = highlighted;
    isSelected = selected;
    isToday = today;
    this.value = value;
    this.valuemonth =valuemonth;
    this.valueyear =valueyear;
    this.rangeState = rangeState;
  }

  public Date getDate() {
    return date;
  }

  public boolean isCurrentMonth() {
    return isCurrentMonth;
  }

  public boolean isSelectable() {
    return isSelectable;
  }

  public boolean isSelected() {
    return isSelected;
  }

  public void setSelected(boolean selected) {
    isSelected = selected;
  }

  boolean isHighlighted() {
    return isHighlighted;
  }

  void setHighlighted(boolean highlighted) {
    isHighlighted = highlighted;
  }

  public boolean isToday() {
    return isToday;
  }

  public RangeState getRangeState() {
    return rangeState;
  }

  public void setRangeState(RangeState rangeState) {
    this.rangeState = rangeState;
  }

  public int getValue() {
    return value;
  }

    public int getValuemonth() {
        return valuemonth;
    }

    public int getValueyear() {
        return valueyear;
    }

    public String getStringyear() {
        return ""+valueyear;
    }

    public boolean isHoliday() {
        return isHoliday;
    }

    public void setIsHoliday(boolean isHoliday) {
        this.isHoliday = isHoliday;
    }

    public boolean isWork() {
        return isWork;
    }

    public void setIsWork(boolean isWork) {
        this.isWork = isWork;
    }

    public boolean isRelax() {
        return isRelax;
    }

    public void setIsRelax(boolean isRelax) {
        this.isRelax = isRelax;
    }

    @Override public String toString() {
    return "MonthCellDescriptor{"
        + "date="
        + date
        + ", value="
        + value
        + ", isCurrentMonth="
        + isCurrentMonth
        + ", isSelected="
        + isSelected
        + ", isToday="
        + isToday
        + ", isSelectable="
        + isSelectable
        + ", isHighlighted="
        + isHighlighted
        + ", rangeState="
        + rangeState
        + '}';
  }



}
