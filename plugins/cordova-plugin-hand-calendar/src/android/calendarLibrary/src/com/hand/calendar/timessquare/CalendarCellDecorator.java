package com.hand.calendar.timessquare;

import java.util.Date;

public interface CalendarCellDecorator {
  void decorate(CalendarCellView cellView, Date date);
}
