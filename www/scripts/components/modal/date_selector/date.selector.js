/**
 * Created by Yuko on 16/7/16.
 */
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.date_selector', {
                url: '/date/selector',
                views: {
                    'page-content': {
                        templateUrl: 'scripts/components/modal/date_selector/date.selector.tpl.html',
                        controller: 'com.handchina.hly.DateSelectorController'
                    }
                } ,
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.hly.DateSelectorController', ['$scope', '$ionicSlideBoxDelegate', function ($scope, $ionicSlideBoxDelegate) {
        var valueArr = new Array();//用于给$scope.days赋值的数组
        var myDate = null;
        $scope.headerMonth = null;
        var num = null;
        var day = null;
        $scope.days = [
            [
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}
            ],
            [
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}
            ],
            [
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}
            ],
            [
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}
            ],
            [
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}
            ],
            [
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}, {"date": "", "check": false, "year": "", "month": ""},
                {"date": "", "check": false, "year": "", "month": ""}
            ]
        ];
        //初始化日期操作
        function initDate() {
            myDate = new Date();
            $scope.year = myDate.getFullYear();
            $scope.month = myDate.getMonth() + 1;
            $scope.date = myDate.getDate();
            $scope.currentDate = $scope.date;
            $scope.currentMonth = $scope.month;
            $scope.headerMonth = $scope.month;
            $scope.currentEnMonth = monthShort($scope.month);
            $scope.currentYear = $scope.year;
            day = myDate.getDay();
            num = day - ($scope.date % 7 - 1);
        }
        function thisMonthDays(month, year) {
            var end = 0;
            switch (month) {
                case 1:
                    end = 31;
                    break;
                case 2:
                    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))end = 29; else end = 28;
                    break;
                case 3:
                    end = 31;
                    break;
                case 4:
                    end = 30;
                    break;
                case 5:
                    end = 31;
                    break;
                case 6:
                    end = 30;
                    break;
                case 7:
                    end = 31;
                    break;
                case 8:
                    end = 31;
                    break;
                case 9:
                    end = 30;
                    break;
                case 10:
                    end = 31;
                    break;
                case 11:
                    end = 30;
                    break;
                case 12:
                    end = 31;
                    break;
            }
            return end;
        }
        function initValueArr(year, month, num, valueArr) {
            $scope.enMonth = monthShort(month);
            var newDay = 1;//每月第一天
            //var newMonthDay = 1;
            var templateMonth = $scope.month - 1;
            var templateYear = $scope.year;
            if (templateMonth == 0) {
                templateMonth = 12;
                templateYear = $scope.year - 1;
            }
            var preMon = thisMonthDays(templateMonth, year);//上一个月天数
            var currentMon = thisMonthDays(month, year);//本月天数
            //num之前的赋值
            for (var i = num - 1; i >= 0; i--) {
                var obj = {};
                obj.data = "";
                obj.month = "";
                obj.year = "";
                valueArr.push(obj);
            }
            //num以后的赋值操作
            for (var i = num; i < 42; i++) {
                var obj = {};
                obj.date = newDay++;
                obj.month = $scope.month;
                obj.year = $scope.year;

                //如果大于半月的天数以后将从1开始算起
                if (obj.date > currentMon) {
                    obj.date = "";
                    obj.month = "";
                    obj.year = "";
                }
                valueArr.push(obj);
            }
        }
        function setDaysValue(arr) {
            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < 7; j++) {
                    $scope.days[i][j].date = arr[0].date;
                    $scope.days[i][j].year = arr[0].year;
                    $scope.days[i][j].month = arr[0].month;
                    if ($scope.days[i][j].date == $scope.currentDate) {
                        if ($scope.days[i][j].month == $scope.currentMonth) {
                            if ($scope.days[i][j].year == $scope.currentYear) {
                                $scope.days[i][j].check = true;
                                if (i > 1 && i < 4) {
                                    $scope.myIndex = 1;
                                } else {
                                    $scope.myIndex = 2;
                                }
                            }
                        }
                    }
                    if ($scope.days[i][j].year > $scope.currentYear) {
                        $scope.days[i][j].smallToday = false;
                    } else {
                        if ($scope.days[i][j].month > $scope.currentMonth) {
                            $scope.days[i][j].smallToday = false;
                        } else if ($scope.days[i][j].month < $scope.currentMonth) {
                            $scope.days[i][j].smallToday = true;
                        } else {
                            if ($scope.days[i][j].date >= $scope.currentDate) {
                                $scope.days[i][j].smallToday = false;
                            } else {
                                $scope.days[i][j].smallToday = true;
                            }
                        }
                    }
                    arr.shift();
                }
            }
        }
        $scope.nextMon = function () {
            //var myDate = new Date();
            var nian = myDate.getFullYear();
            var yue = myDate.getMonth();
            yue += 2;
            if (yue == 13) {
                nian++;
                yue = 1;
            }
            var ri = "1";
            var str = nian + " " + yue + " " + ri;
            myDate = new Date(str);
            $scope.year = myDate.getFullYear();
            $scope.month = myDate.getMonth() + 1;
            $scope.date = myDate.getDate();
            $scope.headerMonth = $scope.month;
            day = myDate.getDay();
            num = day - ($scope.date % 7 - 1);
            initValueArr($scope.year, $scope.month, num, valueArr);
            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < 7; j++) {
                    $scope.days[i][j].check = false;
                }
            }
            setDaysValue(valueArr);
            $ionicSlideBoxDelegate.slide(0);

        };
//上一个月
        $scope.preMon = function () {
            var nian = myDate.getFullYear();
            var yue = myDate.getMonth();
            if (yue == 0) {
                nian--;
                yue = 12;
            }
            var ri = "01";
            var str = nian + " " + yue + " " + ri;
            myDate = new Date(str);
            $scope.year = myDate.getFullYear();
            $scope.month = myDate.getMonth() + 1;
            $scope.date = myDate.getDate();//获取日期
            $scope.headerMonth = $scope.month;
            day = myDate.getDay();
            num = day - ($scope.date % 7 - 1);
            initValueArr($scope.year, $scope.month, num, valueArr);
            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < 7; j++) {
                    $scope.days[i][j].check = false;
                }
            }
            setDaysValue(valueArr);
            $ionicSlideBoxDelegate.slide(0);
        };
        $scope.choiceToday = function(day){
            day.check = true;
        };
        $scope.goFirstSlide = function(index){
            $ionicSlideBoxDelegate.slide( index );
        };
        initDate();
        initValueArr($scope.year, $scope.month, num, valueArr);
        setDaysValue(valueArr);
    }]);

