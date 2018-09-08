//
//  Color.h
//  LYJCanlender
//
//
//  Created by Liyanjun on 16/6/7.
//  Copyright © 2016年 liyanjun. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSDate (WQCalendarLogic)

- (NSUInteger)numberOfDaysInCurrentMonth;

- (NSUInteger)numberOfWeeksInCurrentMonth;

-(NSUInteger)numberOfWeeksIndex;//获取这个月有多少周

- (NSUInteger)weeklyOrdinality;

- (NSDate *)firstDayOfCurrentMonth;

- (NSDate *)lastDayOfCurrentMonth;

- (NSDate *)dayInThePreviousMonth;

- (NSDate *)dayInTheFollowingMonth;

- (NSDate *)dayInTheFollowingMonth:(int)month;//获取当前日期之后的几个月

- (NSDate *)dayInTheBeforeMonth:(int)month;//获取当前日期之前的几个月

- (NSDate *)dayInTheFollowingDay:(int)day;//获取当前日期之后的几个天

- (NSDateComponents *)YMDComponents;

- (NSDate *)dateFromString:(NSString *)dateString;//NSString转NSDate

- (NSString *)stringFromDate:(NSDate *)date;//NSDate转NSString

+ (int)getDayNumbertoDay:(NSDate *)today beforDay:(NSDate *)beforday;
- (NSInteger)getDayNumbertoDayIn:(NSDate *)today beforDay:(NSDate *)beforday;
-(int)getWeekIntValueWithDate;



//判断日期是今天,明天,后天,周几
-(NSString *)compareIfTodayWithDate;
//通过数字返回星期几
+(NSString *)getWeekStringFromInteger:(int)week;

@end
