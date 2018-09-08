//
//  RootViewController.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/6.
//
//

#import "RootViewController.h"
#import "CalendarHomeViewController.h"
#import "SingleHomeViewConroller.h"

@interface RootViewController ()
{
    CalendarHomeViewController *calenderHVC;
    SingleHomeViewConroller *singleHVC;
}
@end
@implementation RootViewController

- (instancetype)initIfIsCalender:(BOOL)animated
{
    self = [super init];
    [self setUp];
    __weak RootViewController *weakSelf = self;
    if (animated) {
        calenderHVC = [[CalendarHomeViewController alloc] init];
        calenderHVC.calendarblock = ^(NSMutableArray *array){
            weakSelf.rootBlock(array);
        };
        [calenderHVC ToDay:totalDays ToDateforString:nil];
        [self addChildViewController:calenderHVC];
    }else{
       
        singleHVC = [[SingleHomeViewConroller alloc] init];
        singleHVC.singleBlock = ^(NSMutableArray *array){
            weakSelf.rootBlock(array);
        };
        [singleHVC ToDay:totalDays ToDateforString:nil];
        [self addChildViewController:singleHVC];
    }
    
    
  //  self.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStylePlain target:self action:nil];
    return self;
}

-(void)setUp
{
    
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
    
    
    
    //设置bar的颜色
    [[UINavigationBar appearance] setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:
                                                          [UIColor blackColor], NSForegroundColorAttributeName, nil]];
    [[UINavigationBar appearance] setBarTintColor:[UIColor whiteColor]];
//    UIImage* navbar=[UIImage imageNamed:@"NavBar"];
//    if (floor(NSFoundationVersionNumber) <= NSFoundationVersionNumber_iOS_6_1) {
//        
//        [[UINavigationBar appearance] setBackgroundImage:navbar forBarMetrics:UIBarMetricsDefault];
//        //        [[UINavigationBar appearance] setTintColor:RGB(54, 100, 173)];
//        
//    }
//    else {
//        
//        //        [[UINavigationBar appearance] setBarTintColor:RGB(54, 100, 173)];
//        [[UINavigationBar appearance] setBackgroundImage:navbar forBarMetrics:UIBarMetricsDefault];
//        [[UINavigationBar appearance] setTintColor:[UIColor whiteColor]];
//
//    }
    
    [[UIBarButtonItem appearance] setBackButtonTitlePositionAdjustment:UIOffsetMake(NSIntegerMin, NSIntegerMin) forBarMetrics:UIBarMetricsDefault];
    
    
}

@end
