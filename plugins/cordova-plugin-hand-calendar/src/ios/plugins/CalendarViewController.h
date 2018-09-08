//
//  CalendarViewController.h
//  LYJCanlender
//
//  Created by Liyanjun on 16/6/7.
//  Copyright © 2016年 wangsheng. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CalendarLogic.h"
#define CustomLocalizedString(key, comment) \
[[NSBundle bundleWithPath:[[NSBundle mainBundle] pathForResource:[NSString stringWithFormat:@"%@",[[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"]] ofType:@"lproj"]] localizedStringForKey:(key) value:@"" table:nil]
//回掉代码块
typedef void (^CalendarBlock)(NSMutableArray *array);

@interface CalendarViewController : UIViewController
@property (nonatomic ,strong) UICollectionView* collectionView;//网格视图
@property (nonatomic ,strong) NSMutableArray *calendarMonth;//每个月份的中的daymodel容器数组
@property (nonatomic ,strong) CalendarLogic *Logic;
@property (nonatomic, copy) CalendarBlock calendarblock;//回调
-(void)goTargetCell;
@end
