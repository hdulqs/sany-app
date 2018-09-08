//
//  ViewController.h
//  LYJCanlender
//
//  Created by Liyanjun on 16/6/7.
//  Copyright © 2016年 liyanjun. All rights reserved.
//

#import "CalendarDayCell.h"
@implementation CalendarDayCell{
 
    float dia;
    float dutyX;
    float dutyY;
}

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self initView];
        [[NSUserDefaults standardUserDefaults] synchronize];
    }
    return self;
}

- (void)initView {
    
    float multiple = 0.f;
    dia = 0.f;
    dutyY=0.f;
    dutyX=0.f;
    if (IS_IPHONE4) {
        multiple = 0.33;
        dia = 35.f;
        dutyY=1.3f;
        dutyX=0.7;
    } else if (IS_IPHONE5) {
        multiple = 0.33;
        dia = 36.f;
        dutyY=1.3f;
        dutyX=0.7;
    } else if (IS_IPhone6) {
        multiple = 0.35;
        dia = 43.f;
        dutyY=0.9f;
        dutyX=0.65;
    } else {
        multiple = 0.35;
        dia = 46.f;
        dutyY=0.9f;
        dutyX=0.65;
    }
    
    //选中时显示的图片
    if (IS_IPHONE5) {
        imgview = [[UIImageView alloc] initWithFrame:CGRectMake(ViewWidth(self)*0.1, ViewWidth(self)*0.3, ViewWidth(self)*0.8, ViewWidth(self)*0.8)];
    } else {
        imgview = [[UIImageView alloc] initWithFrame:CGRectMake(ViewWidth(self)*0.2, ViewWidth(self)*0.35, ViewWidth(self) * 0.6, ViewWidth(self) * 0.6)];
    }
    
    imgview.image = [UIImage imageNamed:@"check"];
    
    [imgview.layer setCornerRadius:8.0]; //设置矩形四个圆角半径
    imgview.layer.masksToBounds = YES;
    [self.contentView addSubview:imgview];
    
    
    //休息
    imgRest = [[UIImageView alloc] initWithFrame:CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia)];
    imgRest.image = [UIImage imageNamed:@"xiu"];
    [self.contentView addSubview:imgRest];
    
    
    //班
    imgDuty =  [[UIImageView alloc] initWithFrame:CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia)];
    imgDuty.image = [UIImage imageNamed:@"ban"];
    [self.contentView addSubview:imgDuty];
    
    //日期
    day_lab = [[UILabel alloc] initWithFrame:CGRectMake(0, 15, self.bounds.size.width, self.bounds.size.width-10)];
    day_lab.textAlignment = NSTextAlignmentCenter;
    day_lab.font = [UIFont systemFontOfSize:14];
    [self.contentView addSubview:day_lab];
    
    //农历
    day_title = [[UILabel alloc] initWithFrame:CGRectMake(0, self.bounds.size.height-15, self.bounds.size.width, 13)];
    day_title.textColor = [UIColor lightGrayColor];
    day_title.font = [UIFont boldSystemFontOfSize:10];
    day_title.textAlignment = NSTextAlignmentCenter;
    
    [self.contentView addSubview:day_title];
    
    
}

- (void)setModel:(CalendarDayModel *)model {
    
    NSUserDefaults* defs = [NSUserDefaults standardUserDefaults];
    NSArray* languages = [defs objectForKey:@"AppleLanguages"];

    NSString* language = [languages objectAtIndex:0];
    
    if(model.holiday){
        imgRest.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
        
        imgDuty.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
    }else{
    
        imgRest.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
        
        imgDuty.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
    }
    
    switch (model.WorkOrRest) {
        case CellDayWork:
            imgRest.hidden=YES;
            imgDuty.hidden=NO;

            break;
        case CellDayRest:
            imgRest.hidden=NO;
            imgDuty.hidden=YES;
           
            break;
        default:
            imgRest.hidden=YES;
            imgDuty.hidden=YES;
            break;
    }

    
    switch (model.style) {
        case CellDayTypeEmpty:    //不显示
            [self hidden_YES];
            break;
            
        case CellDayTypePast:    //过去的日期
            [self hidden_NO];
            
            if (model.holiday) {
                
                if ([[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"]) {
                    NSString *lang = [[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"];
                    if ([lang isEqual: @"en"]) {
                        day_lab.text = [NSString stringWithFormat:@"%lu", (unsigned long)model.day];
                    } else {
                        day_lab.text = model.holiday;
                    }
                } else {
                    if ([language containsString:@"zh-Hans"]) {
                        day_lab.text = model.holiday;
                    } else {
                        day_lab.text = [NSString stringWithFormat:@"%lu", (unsigned long)model.day];
                    }
                }
                
            } else {
                day_lab.text = [NSString stringWithFormat:@"%lu", (unsigned long)model.day];
            }
            
            day_title.text = model.Chinese_calendar;
            imgview.hidden = YES;
           
            break;
            
        case CellDayTypeFutur:    //将来的日期
            [self hidden_NO];
            
            if (model.holiday) {
                if ([[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"]) {
                    NSString *lang = [[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"];
                    if ([lang isEqual: @"en"]) {
                        day_lab.text = [NSString stringWithFormat:@"%lu", (unsigned long)model.day];
                    } else {
                        day_lab.text = model.holiday;
                    }
                } else {
                    if ([language containsString:@"zh-Hans"]) {
                        day_lab.text = model.holiday;
                    } else {
                        day_lab.text = [NSString stringWithFormat:@"%lu", (unsigned long)model.day];
                    }
                }
            } else {
                day_lab.text = [NSString stringWithFormat:@"%lu", (unsigned long)model.day];
            }
            day_title.text = model.Chinese_calendar;
            imgview.hidden = YES;
           
            break;
            
        case CellDayTypeWeek:    //周末
            [self hidden_NO];
            
            if (model.holiday) {
                if ([[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"]) {
                    NSString *lang = [[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"];
                    if ([lang isEqual: @"en"]) {
                        day_lab.text = [NSString stringWithFormat:@"%lu", (unsigned long)model.day];
                    } else {
                        day_lab.text = model.holiday;
                    }
                } else {
                    if ([language containsString:@"zh-Hans"]) {
                        day_lab.text = model.holiday;
                    } else {
                        day_lab.text = [NSString stringWithFormat:@"%lu", (unsigned long)model.day];
                    }
                }
                day_lab.textColor = COLOR_HOLODAT;
                
            } else {
                day_lab.text = [NSString stringWithFormat:@"%lu", model.day];


            }
            day_title.text = model.Chinese_calendar;
            imgview.hidden = YES;
            break;
        case CellDayTypeClick:    //被点击的日期
            [self hidden_NO];
            day_lab.text = [NSString stringWithFormat:@"%lu", (unsigned long)model.day];
            day_title.text = model.Chinese_calendar;
            imgview.hidden = NO;
            imgRest.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
            
            imgDuty.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
            break;
            
        default:
            
            break;
    }
    
    if (![[NSUserDefaults standardUserDefaults] objectForKey:@"banPick"]) {
        return;
    }
    
    
    if (![language containsString:@"zh-Hans"]) {
        day_title.hidden = YES;
    } else if ([[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"]) {
        NSString *lang = [[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"];
        if ([lang isEqual: @"en"]) {
            day_title.hidden = YES;
        }
    }
    /**
     此处通过特定日期，判断有没有 reloadData，如果有 reloadData，则可视为进行了点击操作，从而对前端选中日期和点击选中日期的样式进行修改
     */
    NSDateComponents *components = [self getComponentsFromDate:[NSDate date]];
    
    if (model.day == 1 && model.month == components.month) {
        NSNumber *selectedFlag = [[NSUserDefaults standardUserDefaults] objectForKey:@"CALselectedFlag"];
        NSNumber *updateFlag = [[NSNumber alloc] initWithInt:[selectedFlag intValue] + 1];
        [[NSUserDefaults standardUserDefaults] setObject:updateFlag forKey:@"CALselectedFlag"];
    }
    
    NSDictionary *banPick = [[NSUserDefaults standardUserDefaults] objectForKey:@"banPick"];
    NSString *startString = [NSString string];
    NSString *endString = [NSString string];
    if (![banPick[@"startTime"]  isEqual: @"-"]) {
        startString = banPick[@"startTime"];
    } else {
        startString = @"1000-01-01";
    }
    
    if (![banPick[@"endTime"]  isEqual: @"-"]) {
        endString = banPick[@"endTime"];
    } else {
        endString = @"3000-01-01";
    }
        
    NSDate *startDate = [self getDateFromString:startString];
    NSDate *endDate = [self getDateFromString:endString];
    NSDateComponents *startCom = [self getComponentsFromDate:startDate];
    NSDateComponents *endCom = [self getComponentsFromDate:endDate];
    BOOL isEarlier = model.year < startCom.year || (model.year == startCom.year && model.month < startCom.month) || (model.year == startCom.year && model.month == startCom.month && model.day < startCom.day);
    BOOL isLater = model.year > endCom.year || (model.year == endCom.year && model.month > endCom.month) || (model.year == endCom.year && model.month == endCom.month && model.day > endCom.day);
    
    if (isEarlier || isLater) {
        if (!(model.style == CellDayTypeEmpty)) {
            [self setUserInteractionEnabled: NO];
            day_lab.textColor = [UIColor colorWithRed:0.73 green:0.73 blue:0.73 alpha:1.00];
        } else {
            [self setUserInteractionEnabled:YES];
            [self updateTextColor:model];
        }
        
    } else if (banPick[@"dates"] != [NSNull null]) {
        NSMutableArray *dates =  banPick[@"dates"];
        NSString *monthString = model.month < 10 ? [NSString stringWithFormat:@"0%lu", model.month] : [NSString stringWithFormat:@"%lu",model.month];
        NSString *dayString = model.day < 10 ? [NSString stringWithFormat:@"0%lu", model.day] : [NSString stringWithFormat:@"%lu",model.day];
        NSString *str = [NSString stringWithFormat:@"%lu-%@-%@", model.year, monthString, dayString];
        if ([dates containsObject:str]) {
            if (!(model.style == CellDayTypeEmpty)) {
                [self setUserInteractionEnabled: NO];
                day_lab.textColor = [UIColor colorWithRed:0.73 green:0.73 blue:0.73 alpha:1.00];
            } else {
                [self setUserInteractionEnabled:YES];
                [self updateTextColor:model];
            }
        } else {
            [self setUserInteractionEnabled:YES];
            [self updateTextColor:model];
        }

    } else {
        [self setUserInteractionEnabled:YES];
        [self updateTextColor:model];
    }
    
    
    if (banPick[@"selectedDate"] != [NSNull null]) {
        NSString *date =  banPick[@"selectedDate"];
        NSString *monthString = model.month < 10 ? [NSString stringWithFormat:@"0%lu", model.month] : [NSString stringWithFormat:@"%lu",model.month];
        NSString *dayString = model.day < 10 ? [NSString stringWithFormat:@"0%lu", model.day] : [NSString stringWithFormat:@"%lu",model.day];
        NSString *str = [NSString stringWithFormat:@"%lu-%@-%@", model.year, monthString, dayString];
        
        NSNumber *selectedFlag = [[NSUserDefaults standardUserDefaults] objectForKey:@"CALselectedFlag"];
        
        if ([date isEqual: str] && ([selectedFlag intValue] < 2)) {
            if (model.style != CellDayTypeEmpty) {
                imgview.hidden = NO;
            } else {
                imgview.hidden = YES;
            }
        } else if (model.style == CellDayTypeClick) {
            imgview.hidden = NO;
        } else {
            imgview.hidden = YES;
        }
        
    }
    
    
    
}

-(void)updateTextColor: (CalendarDayModel *)model {
    
    switch (model.style) {
        case CellDayTypePast:    //过去的日期
            day_lab.textColor = [UIColor lightGrayColor];
            break;
            
        case CellDayTypeFutur:    //将来的日期
            if (model.holiday) {
                day_lab.textColor = COLOR_HOLODAT;
            } else {
                switch (model.WorkOrRest) {
                    case CellDayWork:
                        day_lab.textColor=COLOR_WORK;
                        break;
                    case CellDayRest:
                        day_lab.textColor = COLOR_HOLODAT;
                        break;
                    default:
                        day_lab.textColor = COLOR_THEME;
                        break;
                }
            }
            break;
            
        case CellDayTypeWeek:    //周末
            if (model.holiday) {
                day_lab.textColor = COLOR_HOLODAT;
            } else {
                switch (model.WorkOrRest) {
                    case CellDayWork:
                        day_lab.textColor=COLOR_WORK;
                        break;
                    case CellDayRest:
                        day_lab.textColor = COLOR_HOLODAT;
                        break;
                    default:
                        day_lab.textColor = COLOR_THEME;
                        break;
                }
            }
            break;
        case CellDayTypeClick:    //被点击的日期
            day_lab.textColor = [UIColor whiteColor];
            break;
        default:
            break;
    }
}


-(NSDate *)getDateFromString: (NSString *) dateString {
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd"];
    NSDate *dateFromString = [[NSDate alloc] init];
    dateFromString = [dateFormatter dateFromString:dateString];
    return dateFromString;
}
-(NSDateComponents *)getComponentsFromDate: (NSDate *) date{
    NSDateComponents *components = [[NSCalendar currentCalendar] components:NSCalendarUnitDay | NSCalendarUnitMonth | NSCalendarUnitYear fromDate:date];
    return components;
}
- (void)hidden_YES {
    
    day_lab.hidden = YES;
    day_title.hidden = YES;
    imgview.hidden = YES;
    imgRest.hidden = YES;
    imgDuty.hidden=YES;
    
}

- (void)hidden_NO {
    
    day_lab.hidden = NO;
    day_title.hidden = NO;
    
}

@end
