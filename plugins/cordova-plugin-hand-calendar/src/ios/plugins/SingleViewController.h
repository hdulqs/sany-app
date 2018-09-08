//
//  SingleViewController.h
//  LYJCanlender
//
//  Created by wangsheng on 16/7/5.
//  Copyright © 2016年 wangsheng. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "CalendarLogic.h"
#define CustomLocalizedString(key, comment) \
[[NSBundle bundleWithPath:[[NSBundle mainBundle] pathForResource:[NSString stringWithFormat:@"%@",[[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"]] ofType:@"lproj"]] localizedStringForKey:(key) value:@"" table:nil]

typedef void(^SingleVCBlock)(NSMutableArray *array);
@interface SingleViewController : UIViewController
@property(nonatomic ,strong) UICollectionView* collectionView;//网格视图
@property(nonatomic ,strong) NSMutableArray *calendarMonth;//每个月份的中的daymodel容器数组
@property(nonatomic ,strong) CalendarLogic *Logic;
@property (nonatomic, copy) SingleVCBlock singleBlock;//回调

-(void)goTargetCell;

@end
