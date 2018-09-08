//
//  CalendarDayCell.h
//  LYJCanlender
//
//
//  Created by Liyanjun on 16/6/7.
//  Copyright © 2016年 liyanjun. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CalendarDayModel.h"
#import "Color.h"

@interface CalendarDayCell : UICollectionViewCell
{
    UILabel *day_lab;//今天的日期或者是节日
    UILabel *day_title;//显示标签
    UIImageView *imgview;//选中时的图片
    UIImageView *imgRest;//选中时的图片
    UIImageView *imgDuty;//选中时的图片
}

@property(nonatomic , strong)CalendarDayModel *model;

@end
