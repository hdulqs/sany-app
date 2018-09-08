//
//  SingleViewController.m
//  LYJCanlender
//
//  Created by wangsheng on 16/7/5.
//  Copyright © 2016年 wangsheng. All rights reserved.
//



#import "SingleViewController.h"
//UI
#import "CalendarMonthCollectionViewLayout.h"
#import "CalendarMonthHeaderView.h"
#import "CalendarDayCell.h"
//MODEL
#import "CalendarDayModel.h"


@interface SingleViewController ()<UICollectionViewDataSource, UICollectionViewDelegate>
{
    
    //存放选中的日期
    NSMutableArray *selectcalendarList;//
    
    
}
@end


@implementation SingleViewController

static NSString *MonthHeader = @"MonthHeaderView";

static NSString *DayCell = @"DayCell";


- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
        [self initData];
        [self initView];
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    // Do any additional setup after loading the view.
    
}

- (void)viewWillAppear:(BOOL)animated {

    [super viewWillAppear:animated];
    [self goTargetCell];

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)initView {
    
    CalendarMonthCollectionViewLayout *layout = [CalendarMonthCollectionViewLayout new];
    
    self.collectionView = [[UICollectionView alloc] initWithFrame:self.view.bounds collectionViewLayout:layout]; //初始化网格视图大小
    
    [self.collectionView registerClass:[CalendarDayCell class] forCellWithReuseIdentifier:DayCell];//cell重用设置ID
    
    [self.collectionView registerClass:[CalendarMonthHeaderView class] forSupplementaryViewOfKind:UICollectionElementKindSectionHeader withReuseIdentifier:MonthHeader];
    
    //    self.collectionView.bounces = NO;//将网格视图的下拉效果关闭
    
    self.collectionView.delegate = self;//实现网格视图的delegate
    
    self.collectionView.dataSource = self;//实现网格视图的dataSource
    
    self.collectionView.backgroundColor = [UIColor whiteColor];
    
    [self.view addSubview:self.collectionView];
    
}

- (void)initData {
    self.calendarMonth = [[NSMutableArray alloc] init];//每个月份的数组
    selectcalendarList = [[NSMutableArray alloc] init];
}


- (void)goTargetCell {
    NSIndexPath *indexPath = [NSIndexPath indexPathForItem:0 inSection:monthNum*totalDays/365];
    [self.collectionView scrollToItemAtIndexPath:indexPath atScrollPosition:UICollectionViewScrollPositionTop animated:NO];
}

#pragma mark - CollectionView代理方法

//定义展示的Section的个数
- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return self.calendarMonth.count;
}

//定义展示的UICollectionViewCell的个数
- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    NSMutableArray *monthArray = [self.calendarMonth objectAtIndex:section];
    
    return monthArray.count;
}

//每个UICollectionView展示的内容
- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    CalendarDayCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:DayCell forIndexPath:indexPath];
    
    NSMutableArray *monthArray = [self.calendarMonth objectAtIndex:indexPath.section];
    
    
    CalendarDayModel *model = [monthArray objectAtIndex:indexPath.row];
    
    //    NSLog(@"test是%ld",(long)model.style);
    
    cell.model = model;
    
    return cell;
}

- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath {
    UICollectionReusableView *reusableview = nil;
    
    if (kind == UICollectionElementKindSectionHeader) {
        
        NSMutableArray *month_Array = [self.calendarMonth objectAtIndex:indexPath.section];
        CalendarDayModel *model = [month_Array objectAtIndex:15];
        
        CalendarMonthHeaderView *monthHeader = [collectionView dequeueReusableSupplementaryViewOfKind:UICollectionElementKindSectionHeader withReuseIdentifier:MonthHeader forIndexPath:indexPath];
        
        NSArray* languages = [[NSUserDefaults standardUserDefaults] objectForKey:@"AppleLanguages"];
        NSString* language = [languages objectAtIndex:0];
        
        if ([[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"]) {
            NSString *language = [[NSUserDefaults standardUserDefaults] objectForKey:@"appLanguage"];
            if ([language isEqual: @"en"]) {
                monthHeader.masterLabel.text = [NSString stringWithFormat:@"%@ %lu", [self getMonthFromNumber:model.month], model.year];//@"日期";
            } else {
                monthHeader.masterLabel.text = [NSString stringWithFormat:@"%lu年 %lu月", model.year, model.month];//@"日期";
            }
        } else {
            if ([language containsString:@"zh-Hans"]) {
                monthHeader.masterLabel.text = [NSString stringWithFormat:@"%lu年 %lu月", model.year, model.month];//@"日期";
            } else {
                monthHeader.masterLabel.text = [NSString stringWithFormat:@"%@ %lu", [self getMonthFromNumber:model.month], model.year];//@"日期";
            }
        }
        
        monthHeader.backgroundColor = [[UIColor whiteColor] colorWithAlphaComponent:0.8f];
        reusableview = monthHeader;
    }
    return reusableview;
    
}

-(NSString *)getMonthFromNumber: (NSUInteger) number {
    if (number == 1) {
        return @"Jan";
    } else if (number == 2) {
        return @"Feb";
    } else if (number == 3) {
        return @"Mar";
    } else if (number == 4) {
        return @"Apr";
    } else if (number == 5) {
        return @"May";
    } else if (number == 6) {
        return @"Jun";
    } else if (number == 7) {
        return @"Jul";
    } else if (number == 8) {
        return @"Aug";
    } else if (number == 9) {
        return @"Sep";
    } else if (number == 10) {
        return @"Oct";
    } else if (number == 11) {
        return @"Nov";
    } else if (number == 12) {
        return @"Dec";
    }
    
    return @"";
}

//UICollectionView被选中时调用的方法
- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    
    
    NSMutableArray *month_Array = [self.calendarMonth objectAtIndex:indexPath.section];
    
    CalendarDayModel *model = [month_Array objectAtIndex:indexPath.row];
    
    if (model.style == CellDayTypeFutur || model.style == CellDayTypeWeek || model.style == CellDayTypeClick) {
        
        //        [self.Logic selectLogic:model];
        [self processList:model];
    }
        [self.collectionView reloadData];
        
        
}

- (void)processList:(CalendarDayModel *)model {
    NSInteger count = selectcalendarList.count;
        if (count==0) {
            [selectcalendarList addObject:model];
            [self.Logic selectLogic:model];
            
            self.singleBlock(selectcalendarList);//传递数组给上级
            [self performSelector:@selector(delayFunction) withObject:nil afterDelay:0.1];
            
//            UIAlertController *alertController = [UIAlertController alertControllerWithTitle:nil message:[NSString stringWithFormat:@"您选择的截止日期是：%lu/%02lu/%02lu",model.year,model.month,model.day] preferredStyle:UIAlertControllerStyleAlert];
//            [alertController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
//                //点击取消 清除按钮选中
//                [selectcalendarList removeAllObjects];
//                for (int i = 0; i < self.calendarMonth.count; i++) {
//                    for (CalendarDayModel *calenday in self.calendarMonth[i]) {
//                        if (calenday.style==CellDayTypeEmpty) {
//                            continue;
//                        }
//                        [self.Logic selectLogicinit:calenday];
//                        dispatch_async(dispatch_get_main_queue(), ^{
//                            [self.collectionView reloadData];
//                        });
//                    }
//                }
//            }]];
//            [alertController addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
//                
//                self.singleBlock(selectcalendarList);//传递数组给上级
//                [self performSelector:@selector(delayFunction) withObject:nil afterDelay:0.1];
//                
//            }]];
//            [self presentViewController:alertController animated:YES completion:nil];
        }
}


//返回这个UICollectionView是否可以被选择
- (BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    
    return YES;
}
//延迟执行的方法
- (void)delayFunction
{
    [self dismissViewControllerAnimated:YES completion:nil];
}
@end
