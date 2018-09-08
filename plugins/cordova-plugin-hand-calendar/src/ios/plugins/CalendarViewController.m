//
//  CalendarViewController.m
//  LYJCanlender
//
//
//  Created by Liyanjun on 16/6/7.
//  Copyright © 2016年 liyanjun. All rights reserved.
//

#import "CalendarViewController.h"
//UI
#import "CalendarMonthCollectionViewLayout.h"
#import "CalendarMonthHeaderView.h"
#import "CalendarDayCell.h"
//MODEL
#import "CalendarDayModel.h"


@interface CalendarViewController ()
<UICollectionViewDataSource, UICollectionViewDelegate>
{
    //存放选中的日期数组
    NSMutableArray *selectcalendarList;

    BOOL isLoad;
}
@end

@implementation CalendarViewController

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

    [self goTargetCell];
    [super viewWillAppear:animated];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)initView {


    //  [self setTitle:@"选择日期"];
    if([[[NSUserDefaults standardUserDefaults] objectForKey:@"unlimit"]  isEqual: @1]) {
        self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:CustomLocalizedString(@"CALENDAR_LIMIT", nil) style:UIBarButtonItemStylePlain target:self  action:@selector(dontLimist)];
    }
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
- (void)dontLimist {
    [selectcalendarList removeAllObjects];
    self.calendarblock(selectcalendarList);//返回给上级
    [self performSelector:@selector(delayFunction) withObject:nil afterDelay:0.2];
}
- (void)goTargetCell {

    NSIndexPath *indexPath;
    if(@available(iOS 11.0, *)){
        indexPath = [NSIndexPath indexPathForItem:0 inSection:monthNum*totalDays/365];
    } else {
        indexPath = [NSIndexPath indexPathForItem:12 inSection:24];
    }
    [self.collectionView scrollToItemAtIndexPath:indexPath atScrollPosition:UICollectionViewScrollPositionTop animated:NO];

}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {

    CGFloat offsetY = scrollView.contentOffset.y;
    if(offsetY < 350 && !isLoad) {
        isLoad = YES;
        NSArray *list = [self.calendarMonth firstObject];
        CalendarDayModel *model = [list firstObject];
        if(model.year > 1971 ) {
            NSString *s = [NSString stringWithFormat:@"%ld-%ld-%ld",model.year,model.month,model.day];
            NSDateFormatter *f = [[NSDateFormatter alloc] init];
            [f setDateFormat:@"yyyy-MM-dd"];
            NSArray *lazy = [self.Logic lazyLoadCaleder:[f dateFromString:s] selectDate:nil needDays:365];
            for (NSInteger i = lazy.count-1; i>=0; i--) {
                [self.calendarMonth insertObject:lazy[i] atIndex:0];
                //                [self.collectionView reloadSections:[NSIndexSet indexSetWithIndex:i]];
            }
            [self.collectionView reloadData];
            [self.collectionView scrollToItemAtIndexPath:[NSIndexPath indexPathForItem:0 inSection:lazy.count+1] atScrollPosition:UICollectionViewScrollPositionNone animated:NO];
            isLoad = NO;
        }
    }
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
    if (count == 0) {
        [selectcalendarList addObject:model];
        [self.Logic selectLogic:model];
    } else if (count == 1) {
        CalendarDayModel *first = selectcalendarList[0];
        NSString* firstString=[NSString stringWithFormat:@"%lu%02lu%02lu",first.year,first.month,first.day];
        int firstInt=[firstString intValue];
        NSString* modelString=[NSString stringWithFormat:@"%lu%02lu%02lu",model.year,model.month,model.day];
        int modelInt=[modelString intValue];

        // NSMutableArray *Array = [NSMutableArray array];
        for (int i = 0; i < self.calendarMonth.count; i++) {

            for (CalendarDayModel *calenday in self.calendarMonth[i]) {
                if (calenday.style==CellDayTypeEmpty) {
                    continue;
                }
                NSString* calendayString=[NSString stringWithFormat:@"%lu%02lu%02lu",calenday.year,calenday.month,calenday.day];
                int calendayInt=[calendayString intValue];

                if (firstInt != modelInt && firstInt<calendayInt && calendayInt<=modelInt) {
                    //第一个在前
                    [self.Logic selectLogic:calenday];
                    [selectcalendarList addObject:calenday];
                }

                else if (firstInt != modelInt && calendayInt>=modelInt && calendayInt<firstInt) {
                    //第二个选在第一个前面
                    [self.Logic selectLogic:calenday];
                    [selectcalendarList addObject:calenday];

                }
            }
        }
        [self compareDate:selectcalendarList];//排序
//        CalendarDayModel *beginDay = selectcalendarList.firstObject;
//        CalendarDayModel *endDay = selectcalendarList.lastObject;

        self.calendarblock(selectcalendarList);//返回给上级
        [self performSelector:@selector(delayFunction) withObject:nil afterDelay:0.2];

//        //弹出框
//        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:nil message:[NSString stringWithFormat:@"您选择的日期区间是：%lu/%02lu/%02lu-%lu/%02lu/%02lu",beginDay.year,beginDay.month,beginDay.day,endDay.year,endDay.month,endDay.day] preferredStyle:UIAlertControllerStyleAlert];
//        [alertController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
//            //点击取消 清除按钮选中
//            [selectcalendarList removeAllObjects];
//            for (int i = 0; i < self.calendarMonth.count; i++) {
//                for (CalendarDayModel *calenday in self.calendarMonth[i]) {
//                    if (calenday.style==CellDayTypeEmpty) {
//                        continue;
//                    }
//                    [self.Logic selectLogicinit:calenday];
//                }
//            }
//            [self.collectionView reloadData];
//        }]];
//        [alertController addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action) {
//            // NSLog(@"%@,%@,%li",selectcalendarList.firstObject,selectcalendarList.lastObject,selectcalendarList.count);
//            self.calendarblock(selectcalendarList);//返回给上级
//            [self performSelector:@selector(delayFunction) withObject:nil afterDelay:0.2];
//        }]];
//        [self presentViewController:alertController animated:YES completion:nil];


    }
}

//日期重新排序按照从前往后
- (void)compareDate:(NSMutableArray *)originalArray
{
    NSSortDescriptor *descriptor1 = [[NSSortDescriptor alloc
                                      ] initWithKey:@"self.year" ascending:YES];
    NSSortDescriptor *descriptor2 = [[NSSortDescriptor alloc
                                      ] initWithKey:@"self.month" ascending:YES];
    NSSortDescriptor *descriptor3 = [[NSSortDescriptor alloc
                                      ] initWithKey:@"self.day" ascending:YES];
    [originalArray sortUsingDescriptors:@[descriptor1,descriptor2,descriptor3]];

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
