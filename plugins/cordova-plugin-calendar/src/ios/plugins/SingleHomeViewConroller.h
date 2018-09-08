//
//  SingleHoneViewConroller.h
//  LYJCanlender
//
//  Created by wangsheng on 16/7/5.
//  Copyright © 2016年 wangsheng. All rights reserved.
//
#import <UIKit/UIKit.h>
#import "SingleViewController.h"
#import "Color.h"

@interface SingleHomeViewConroller : SingleViewController

@property (nonatomic, strong) NSString *calendartitle;//设置导航栏标题

- (void)ToDay:(int)day ToDateforString:(NSString *)todate;//

@end
