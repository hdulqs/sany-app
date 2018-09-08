//
//  MyPlugin.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/5.
//
//

#import "CDVCalendar.h"
#import "RootViewController.h"
#import "CalendarDayModel.h"

@interface CDVCalendar()
{
    RootViewController *rootVC;
}
@end

@implementation CDVCalendar

-(void)openCalendar:(CDVInvokedUrlCommand *)cmd
{
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"banPick"];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"CALselectedFlag"];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"appLanguage"];
    
    if (cmd.arguments[1] != [NSNull null]) {
        NSDictionary *banPick = cmd.arguments[1];
        NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
        for (NSString *key in banPick.allKeys) {
            if([key isEqualToString:@"dates"]) {
                NSMutableArray *dates = [banPick objectForKey:@"dates"];
                if(dates.count <= 0){
                    [dict setValue:@[@"1970-01-01"] forKey:@"dates"];
                } else {
                    if(![dates containsObject:@"1970-01-01"]){
                        [dates addObject:@"1970-01-01"];
                    }
                    
                    [dict setValue:dates forKey:@"dates"];
                }
            } else {
                [dict setValue:[banPick objectForKey:key] forKey:key];
            }
        }
        
        NSDictionary *newBankPick = [NSDictionary dictionaryWithDictionary:dict];
        
        [[NSUserDefaults standardUserDefaults] setObject:newBankPick forKey:@"banPick"];
        NSNumber *selectedFlag = [[NSNumber alloc] initWithInt: 0];
        [[NSUserDefaults standardUserDefaults] setObject:selectedFlag forKey:@"CALselectedFlag"];
        
        
        if (banPick[@"language"]) {
            NSString *language = banPick[@"language"];
            [[NSUserDefaults standardUserDefaults] setObject:language forKey:@"appLanguage"];
        } else {
            //获取当前的Locale
            NSLocale *curLocale = [NSLocale currentLocale];
            NSString *language = [NSString stringWithFormat:@"%@",curLocale.localeIdentifier];
            if ([language hasPrefix:@"zh-Hans"]||[language hasPrefix:@"zh_CN"]||[language hasPrefix:@"zh-Hans-CN"]) {//开头匹配
                [[NSUserDefaults standardUserDefaults] setObject:@"zh-Hans" forKey:@"appLanguage"];
            }
        }
        if (banPick[@"unlimit"]) {
            NSNumber *unlimit = banPick[@"unlimit"];
            [[NSUserDefaults standardUserDefaults] setObject:unlimit forKey:@"unlimit"];
        } else {
            [[NSUserDefaults standardUserDefaults] setObject:@0 forKey:@"unlimit"];
        }
        
        [[NSUserDefaults standardUserDefaults] synchronize];
    }
    if ([cmd.arguments.firstObject intValue] == 1) {
        [self function1:cmd];
    }else{
        [self function2:cmd];
    }
}

//日期区间
- (void)function1:(CDVInvokedUrlCommand *)cmd
{
    rootVC = [[RootViewController alloc] initIfIsCalender:YES];
    __weak CDVCalendar *weakSelf = self;
    rootVC.rootBlock = ^(NSMutableArray *array){
        CDVPluginResult *result;
        if (cmd.arguments.count) {
            if(array.count > 0){
                NSMutableArray *daysString = [NSMutableArray array];
                //返回Json文件
                for (CalendarDayModel *dayModel in array) {
                    [daysString addObject:[dayModel toString]];//把数据模型转换成字符串
                }
                NSDictionary *JSon = [NSDictionary dictionaryWithObject:@[daysString.firstObject,daysString.lastObject] forKey:@"result"];
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:JSon];
            } else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"result":@""}];
            }
            
        }else{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:@{@"result":@"Please pass args!"}];
        }
        
        [weakSelf.commandDelegate sendPluginResult:result callbackId:cmd.callbackId];
    };
    [self.viewController presentViewController:rootVC animated:YES completion:nil];
    
}
//截止日期
-(void)function2:(CDVInvokedUrlCommand *)cmd
{
    rootVC = [[RootViewController alloc] initIfIsCalender:NO];
    __weak CDVCalendar *weakSelf = self;
    //  CalendarDayModel *day;
    rootVC.rootBlock = ^(NSMutableArray *array){
        CDVPluginResult *result;
        if (cmd.arguments.count) {
            if(array.count > 0){
                //返回Json文件
                NSString *dayString = [(CalendarDayModel *)array.firstObject toString];//把数据模型转换成字符串
                NSDictionary *JSon = [[NSDictionary alloc]initWithObjects:@[dayString] forKeys:@[@"result"]];
                 result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:JSon];
            } else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"result":@""}];
            }
            
           
        }else{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:@{@"result":@"Please pass args!"}];
        }
        
        [weakSelf.commandDelegate sendPluginResult:result callbackId:cmd.callbackId];
    };
    [self.viewController presentViewController:rootVC animated:YES completion:nil];
    
}

@end
