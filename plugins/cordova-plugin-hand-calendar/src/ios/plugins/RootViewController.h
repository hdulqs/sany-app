//
//  RootViewController.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/6.
//
//

#import <UIKit/UIKit.h>

//回掉代码块
typedef void (^RootVCBlock)(NSMutableArray *array);

@interface RootViewController : UINavigationController
- (instancetype)initIfIsCalender:(BOOL)animated;

@property (nonatomic,copy)RootVCBlock rootBlock;
@end
