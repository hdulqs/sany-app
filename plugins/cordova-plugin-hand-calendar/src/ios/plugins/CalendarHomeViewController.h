//
//  CalendarHomeViewController.h
//  LYJCanlender
//
//
//
//  Created by Liyanjun on 16/6/7.
//  Copyright © 2016年 liyanjun. All rights reserved.
//


#import <UIKit/UIKit.h>
#import "CalendarViewController.h"
#import "Color.h"

@interface CalendarHomeViewController : CalendarViewController

@property (nonatomic, strong) NSString *calendartitle;//设置导航栏标题

- (void)ToDay:(int)day ToDateforString:(NSString *)todate;//

@end
