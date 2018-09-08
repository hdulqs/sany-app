#日历插件

>方法 openCalendar(successCallBack, errorCallBack, type, banList)

##参数说明

* 参数successCallBack  成功时的回调
* 参数errorCallBack  失败时的回调
* 参数type 传2选择单个日期，传1返回一个日期期间
* 参数banlist 禁选内容， banList 包含 startTime，endTime，dates 三个属性。startTime 和 endTime 为可选范围的开始时间和结束时间，填 - 符号则无限制。dates 为需要禁用的独立日期。日期格式为 yyyy-MM-dd.

##返回值
###当type传入值为2的时候直接返回一个字符串 如：2016-07-20
###当type传入值为1的时候返回一个日期期间，但是时一个json串 如：{"result":["2016-07-20","2016-07-26"]}

#插件调用方式

$scope.testCalendar = function () {
var banPick = {
"startTime": "-",
"endTime": "-",
"dates":[]
};
HmsCalendar.openCalendar(success, failure, 2, banPick);
}

$scope.testCalendarWF = function () {
var banPick = {
"startTime": "2017-02-01",
"endTime": "2017-08-01",
"dates":["2017-05-01"],
"selectedDate":"2017-05-5",
"language":"en" //默认为中文
};
HmsCalendar.openCalendar(success, failure, 1, banPick);
}

