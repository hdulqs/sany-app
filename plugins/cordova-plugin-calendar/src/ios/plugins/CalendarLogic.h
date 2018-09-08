//
//  CalendarLogic1.h
//  LYJCanlender
//
//
//  Created by Liyanjun on 16/6/7.
//  Copyright © 2016年 liyanjun. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CalendarDayModel.h"
#import "NSDate+WQCalendarLogic.h"
#define monthNum 12

@interface CalendarLogic : NSObject

- (NSMutableArray *)reloadCalendarView:(NSDate *)date  selectDate:(NSDate *)date1 needDays:(int)days_number;
- (void)selectLogic:(CalendarDayModel *)day;

- (void)selectLogicinit:(CalendarDayModel *)day;
@end
