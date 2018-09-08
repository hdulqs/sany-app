'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.erv_report', {
            url: '/erv/report/form/analysis',
            cache: false,
            nativeTransitionsAndroid: {
                "type": "fade",
                "duration": 500
            },
            nativeTransitionsIOS: {
                "type": "fade",
                "duration": 500
            },
            views: {
                'page-content@app': {
                    'templateUrl': 'scripts/pages/expense_report_version/report_form/report_form.analysis.html',
                    'controller': 'com.handchina.huilianyi.ErvReportFormAnalysisController'
                }
            },
            resolve:{
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    //$translatePartialLoader.addPart('homepage');
                    $translatePartialLoader.addPart('report');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.ErvReportFormAnalysisController',
        ['$scope', 'ExpenseService', '$state', '$ionicPopover', '$timeout', 'reportFormService', 'ServiceBaseURL', 'Principal', '$filter', '$sessionStorage',
            function ($scope, ExpenseService, $state, $ionicPopover, $timeout, reportFormService, ServiceBaseURL, Principal, $filter, $sessionStorage) {
                /**
                 *  @description:日期时间处理
                 */
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth();
                Number.prototype.zeroFill = function () {
                    var _selfMonth = this;
                    return _selfMonth = _selfMonth < 10 ? ('0' + _selfMonth) : _selfMonth;
                };
                $scope.language = $sessionStorage.lang;//获取当前页面多语言
                $scope.selectYear = year;
                $scope.newSelectStartYear = year;
                $scope.newSelectEndYear = year;
                $scope.newSelectStartMonth = (parseInt(month) - 5);
                $scope.newSelectEndMonth = (parseInt(month) + 1);
                if (parseInt(month) - 5 <= 0) {
                    $scope.newSelectStartYear = parseInt(year) - 1;
                }
                //2017year3month改为3/2017,中文版为2017年3月
                if ($sessionStorage.lang === 'en') {
                    $scope.startDateYearMonth = (parseInt(month) + 1) + '/' + year + $filter('translate')('report.year');
                    $scope.endDateYearMonth = (parseInt(month) + 1) + '/' + year + $filter('translate')('report.year');
                } else {
                    $scope.startDateYearMonth = year + $filter('translate')('report.year') + $filter('monthFilter')(month);
                    $scope.endDateYearMonth = year + $filter('translate')('report.year') + $filter('monthFilter')(month);
                }
                //本月 -end
                $scope.currentYearMonth = year + (parseInt(month) + 1).zeroFill().toString();
                //上月 -end
                $scope.lastYearMonth = $filter('date')(new Date().setMonth(new Date().getMonth() - 1), 'yyyyMM');
                //本年度 -start
                $scope.annualYearMonthStart = year + '01';
                //本年度 -end
                $scope.annualYearMonthEnd = year + '12';

                if (month >= 0 && month <= 2) {
                    $scope.quarterStart = year + '01';
                    $scope.quarterEnd = year + '03';
                } else if (month >= 3 && month <= 5) {
                    $scope.quarterStart = year + '04';
                    $scope.quarterEnd = year + '06';
                } else if (month >= 6 && month <= 8) {
                    $scope.quarterStart = year + '07';
                    $scope.quarterEnd = year + '09';
                } else if (month >= 9 && month <= 11) {
                    $scope.quarterStart = year + '10';
                    $scope.quarterEnd = year + '12';
                }
                //view data
                $scope.view = {
                    staticPerson:$filter('translate')('report.personal'),
                    staticDep:$filter('translate')('report.department'),
                    expenseTypelist: [],
                    totalTypeFlag:$filter('translate')('report.personal'),
                    //typeOptionFlag: '预算',
                    typeOptionFlag: $filter('translate')('report.personnel'),//人员
                    durationType:$filter('translate')('report.nearly.six.months') ,
                    individualPageData: [],
                    individualSelectFlag:$filter('translate')('report.payment.this.month'),
                    chartPieData: [],
                    publicTotalAmount: 0,
                    showAverageConsumeFlag: true,
                    averageImgSrc: 'img/report_form/open-eye.png',
                    totalBudget: '',//总预算
                    usedBudget: '',//已使用预算
                    usedPercentage: '',//使用百分比
                    remainingBudget: '',//剩余预算
                    overspendBudget: '',//超支预算
                    overspendPercentage: '',//超支百分比
                    departmentId: '',//部门ID
                    perCapita: 0,//人均--人员
                    totalNumber: 0,//总人数--人员
                    centerConsumeArr: [
                        {
                            name:  $filter('translate')('report.payment.this.month'),
                            url: '/api/v2/report/expense/personal?startDate=' + $scope.currentYearMonth + '&endDate=' + $scope.currentYearMonth,
                            id: ''
                        },
                        {
                            name: $filter('translate')('report.last.month.payment'),
                            url: '/api/v2/report/expense/personal?startDate=' + $scope.lastYearMonth + '&endDate=' + $scope.currentYearMonth,
                            id: ''
                        },
                        {
                            name:  $filter('translate')('report.payment.for.the.quarter'),
                            url: '/api/v2/report/expense/personal?startDate=' + $scope.quarterStart + '&endDate=' + $scope.quarterEnd,
                            id: ''
                        },
                        {
                            name: $filter('translate')('report.payment.for.this.year'),
                            url: '/api/v2/report/expense/personal?startDate=' + $scope.annualYearMonthStart + '&endDate=' + $scope.annualYearMonthEnd,
                            id: ''
                        }],
                    differentObjArr: [$filter('translate')('report.personal')],
                    nothing: false,
                    //typeOptions: [
                    //    {name: '预算', choice: false},
                    //    {name: '人员', choice: true},
                    //    {name: '类别', choice: false}],
                    typeOptions: [
                        {name:$filter('translate')('report.personnel'), choice: true},
                        {name: $filter('translate')('report.category'), choice: false}],
                    duration: [
                        {name: $filter('translate')('report.nearly.three.months')},
                        {name: $filter('translate')('report.nearly.six.months')},
                        {name:$filter('translate')('report.nearly.twelve.months')}
                    ]
                };
                var pageData = {
                    myNewCharts: null,
                    chars: 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',//用来生成随机id
                    chartsData: {
                        labels: [],
                        datasets: [
                            {
                                fillColor: "rgb(225,242,250)",
                                strokeColor: "rgb(255,255,255)",
                                pointColor: "rgb(63,177,227)",
                                pointStrokeColor: "rgb(205,234,247)",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(20,220,220,1)",
                                data: []
                            }
                        ]
                    },
                    lineOptions: {
                        scaleShowGridLines: true,
                        scaleGridLineColor: "rgba(0,0,0,.05)",
                        scaleGridLineWidth: 1,
                        scaleShowHorizontalLines: false,
                        scaleShowVerticalLines: true,
                        bezierCurve: false,
                        bezierCurveTension: 0.4,
                        pointDot: true,
                        pointDotRadius: 5,
                        pointDotStrokeWidth: 2.5,
                        pointHitDetectionRadius: 20,
                        datasetStroke: true,
                        datasetStrokeWidth: 1,
                        datasetFill: true,
                        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
                    },
                    drawPieChart: function () {
                        return new Chart(document.getElementById('pie-charts').getContext("2d"))
                    },
                    pieOptions: {
                        segmentShowStroke: false,
                        segmentStrokeColor: "#fff",
                        segmentStrokeWidth: 1,
                        percentageInnerCutout: 74, // This is 0 for Pie charts
                        animationSteps: 35,
                        animationEasing: "",
                        animateRotate: true,
                        animateScale: false,
                        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

                    }
                };

                //前三个月,前六个月,前十二个月截取url
                function changeDuration(urlStr, targetStr) {
                    var index = urlStr.indexOf('duration='),
                        firstStr = urlStr.substring(0, index),
                        lastStr = urlStr.substring(index + 12, urlStr.length);
                    return firstStr + targetStr + lastStr;
                }

                //月份,数字转换
                function changeNumAndStr(tem) {
                    switch (tem) {
                        case 1:
                            return $filter('translate')('report.january');
                            break;
                        case 2:
                            return $filter('translate')('report.february');
                            break;
                        case 3:
                            return $filter('translate')('report.march');
                            break;
                        case 4:
                            return $filter('translate')('report.april');
                            break;
                        case 5:
                            return $filter('translate')('report.may');
                            break;
                        case 6:
                            return $filter('translate')('report.june');
                            break;
                        case 7:
                            return $filter('translate')('report.july');
                            break;
                        case 8:
                            return $filter('translate')('report.august');
                            break;
                        case 9:
                            return $filter('translate')('report.september');
                            break;
                        case 10:
                            return $filter('translate')('report.october');
                            break;
                        case 11:
                            return $filter('translate')('report.november');
                            break;
                        case 12:
                            return $filter('translate')('report.december');
                            break;
                        case $filter('translate')('report.january'):
                            return 1;
                            break;
                        case $filter('translate')('report.february'):
                            return 2;
                            break;
                        case  $filter('translate')('report.march'):
                            return 3;
                            break;
                        case $filter('translate')('report.april'):
                            return 4;
                            break;
                        case $filter('translate')('report.may'):
                            return 5;
                            break;
                        case $filter('translate')('report.june'):
                            return 6;
                            break;
                        case  $filter('translate')('report.july'):
                            return 7;
                            break;
                        case  $filter('translate')('report.august'):
                            return 8;
                            break;
                        case $filter('translate')('report.september'):
                            return 9;
                            break;
                        case $filter('translate')('report.october'):
                            return 10;
                            break;
                        case $filter('translate')('report.november'):
                            return 11;
                            break;
                        case $filter('translate')('report.december'):
                            return 12;
                        default :
                            return '';
                            break;
                    }
                }

                //绘画饼图
                function drawDoughnutChart() {
                    var pieInstance = pageData.drawPieChart();
                    pieInstance.Doughnut($scope.view.chartPieData, pageData.pieOptions);
                }

                //产生随机canvas id
                function randomString() {
                    var id = '';
                    for (var i = 0; i < 10; i++) {
                        id += pageData.chars.charAt(Math.floor(Math.random() * 48));
                    }
                    return id;
                }

                //添加canvas
                function addCanvas(id) {
                    $('.charts-div').empty();
                    var canvas = document.createElement("canvas");
                    canvas.id = id;
                    $('.charts-div').append(canvas);
                }

                //绘画预算折线图
                function drawLineChart() {
                    var id = randomString();
                    addCanvas(id);
                    pageData.myNewCharts = new Chart(document.getElementById(id).getContext("2d"));
                    pageData.myNewCharts.Line(pageData.chartsData, pageData.lineOptions);
                }


                //判断数据
                function judgeColorAndImg(name) {
                    var data = {
                        color: '',
                        imgUrl: ''
                    };
                    var expenseTypeColor = [
                        {
                            name: 'transportation',
                            color: '#FF8D8E'
                        },
                        {
                            name: 'airTickets',
                            color: '#ffa748'
                        },
                        {
                            name: 'coach',
                            color: '#a190d9'
                        },
                        {
                            name: 'travel',
                            color: '#7ad0db'
                        },
                        {
                            name: 'foodbeverage',
                            color: '#07D0CA'
                        },
                        {
                            name: 'teambuilding',
                            color: '#0A92D1'
                        },
                        {
                            name: 'office',
                            color: '#7579C0'
                        },
                        {
                            name: 'meetings',
                            color: '#fac846'
                        },
                        {
                            name: 'communication',
                            color: '#99D40B'
                        },
                        {
                            name: 'hotel',
                            color: '#F19EC2'
                        },
                        {
                            name: 'express',
                            color: '#EEA180'
                        },
                        {
                            name: 'gasoline',
                            color: '#ff7474'
                        },
                        {
                            name: 'file',
                            color: '#6796ce'
                        },
                        {
                            name: 'examination',
                            color: '#52dda2'
                        },
                        {
                            name: 'visa',
                            color: '#82ca5e'
                        },
                        {
                            name: 'mealAllowance',
                            color: '#569DEE'
                        }

                    ];
                    //var colorArr = ['#ff8d8e', '#99d40b', '#07d0ca', '#ffa849', '#b48dff', '#0a92d1', '#f19ec2', '#7579c0', '#85a6c0'];
                    for (var i = 0; i < $scope.view.expenseTypelist.length; i++) {
                        if (name === $scope.view.expenseTypelist[i].name) {
                            var iconName = $scope.view.expenseTypelist[i].iconName;
                            data.imgUrl = $scope.view.expenseTypelist[i].iconURL;
                            // data.imgUrl = 'img/expensetypes/' + iconName + '.png';
                            for (var j = 0; j < expenseTypeColor.length; j++) {
                                if (expenseTypeColor[j].name == iconName) {
                                    data.color = expenseTypeColor[j].color;
                                }
                                else {
                                    data.color = expenseTypeColor[i%expenseTypeColor.length].color
                                }
                            }
                        }
                    }
                    if (name ===  $filter('translate')('report.didi.travel')) {
                        // data.imgUrl = 'img/report_form/didi.png';
                        data.color = '#ff8a44';
                    }
                    return data;
                }

                //赋值函数
                function assigmentData(data) {
                    //人员
                    if ($scope.view.typeOptions[0].choice) {
                        $scope.view.perCapita = data.totalNumber ? (data.totalAmount/data.totalNumber).toFixed(2) : (0).toFixed(2) ;
                        $scope.view.totalNumber = data.totalNumber;
                    }
                    $scope.view.individualPageData = [];
                    $scope.view.chartPieData = [];
                    $scope.view.publicTotalAmount = parseFloat(data.totalAmount).toFixed(2);
                    var colorArr = ['#ff8d8e', '#99d40b', '#07d0ca', '#ffa849', '#b48dff', '#0a92d1', '#f19ec2', '#7579c0', '#85a6c0'];
                    for (var i = 0; i < (data.dataDetails && data.dataDetails.length); i++) {
                        var individualTempObj = {
                            consumeTypeImg: '',
                            consumeTypeName: '',
                            consumeTypePercentage: '',
                            consumeTypeAverage: '',
                            consumeTypeAmmount: '',
                            consumeTypeStyle: {}
                        };
                        var tempPieData = {
                            value: '',
                            color: '',
                            label: ''
                        };
                        if (data.dataDetails[i].dataItem === $filter('translate')('report.didi.travel')) {
                            individualTempObj.consumeTypeName = data.dataDetails[i].dataItem.substring(0, 2);
                        } else {
                            individualTempObj.consumeTypeName = data.dataDetails[i].dataItem;
                        }
                        tempPieData.label = individualTempObj.consumeTypeName;

                        individualTempObj.consumeTypePercentage = parseFloat(data.dataDetails[i].precentage).toFixed(0);
                        individualTempObj.consumeTypeAverage = parseFloat(data.dataDetails[i].amount / 11).toFixed(2);
                        individualTempObj.consumeTypeAmmount = parseFloat(data.dataDetails[i].amount).toFixed(2);
                        tempPieData.value = individualTempObj.consumeTypeAmmount;
                        individualTempObj.consumeTypeImg = judgeColorAndImg(data.dataDetails[i].dataItem) && judgeColorAndImg(data.dataDetails[i].dataItem).imgUrl;
                        tempPieData.color = judgeColorAndImg(data.dataDetails[i].dataItem) && judgeColorAndImg(data.dataDetails[i].dataItem).color;
                        if (!judgeColorAndImg(data.dataDetails[i].name)) {
                            tempPieData.color = colorArr[i % colorArr.length];
                            individualTempObj.dotBgColor = tempPieData.color;
                        }
                        //如果在部门tab下选择了人员
                        if ($scope.view.totalTypeFlag ===  $filter('translate')('report.department') && $scope.view.typeOptions[0].choice) {
                            individualTempObj.consumeTypeStyle.percentage = Math.ceil(individualTempObj.consumeTypePercentage/10) * 10;
                            individualTempObj.consumeTypeStyle.colorIndex = i%5 + 1;
                        }
                        $scope.view.individualPageData.push(individualTempObj);
                        $scope.view.chartPieData.push(tempPieData);
                    }
                    //类别 tab
                    if ($scope.view.typeOptions[1].choice || $scope.view.totalTypeFlag ===  $filter('translate')('report.personal'))
                        drawDoughnutChart();
                    if ($scope.view.individualPageData.length === 0) {
                        $scope.view.nothing = true;
                    } else {
                        $scope.view.nothing = false;
                    }
                }

                //图标赋值函数
                function reprotAssigment(getData) {
                    // $scope.view.publicTotalAmount = parseFloat(getData.totalAmount).toFixed(2);
                    $scope.view.totalBudget = parseFloat(getData.totalBudget).toFixed(0);
                    $scope.view.usedBudget = parseFloat(getData.usedBudget).toFixed(2);
                    $scope.view.usedPercentage = parseFloat(getData.usedPercentage).toFixed(2);
                    $scope.view.remainingBudget = parseFloat(getData.remainingBudget).toFixed(2);
                    $scope.view.overspendBudget = parseFloat(getData.overspendBudget).toFixed(2);
                    $scope.view.overspendPercentage = parseFloat(getData.overspendPercentage).toFixed(2);
                    $scope.view.chartPieData = [];
                    if (parseInt(getData.usedPercentage) === 100) {
                        $('#useColor').css({
                            'backgroundColor': 'rgb(90, 206, 180)',
                            'width': '100%'
                        });
                    } else {
                        $('#useColor').css({
                            'backgroundColor': 'rgb(90, 206, 180)',
                            'width': $scope.view.usedPercentage + '%'
                        });
                    }
                    $('#overSpendDiv').css({
                        'backgroundColor': 'rgb(252, 13, 28)',
                        'width': (96 / 100 * $scope.view.overspendPercentage) + '%',
                        'height': '1.2em',
                        'marginLeft': '2%'
                    });
                    pageData.chartsData.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    var tempArr = [];
                    for (var i = 1; i < 13; i++) {
                        tempArr[i - 1] = changeNumAndStr(i);
                    }
                    pageData.chartsData.labels = tempArr;
                    for (var i = 0; i < (getData.dataDetails && getData.dataDetails.length); i++) {
                        pageData.chartsData.datasets[0].data[pageData.chartsData.labels.indexOf(changeNumAndStr(parseInt(getData.dataDetails[i].dataItem)))] = getData.dataDetails[i].amount.toFixed(2);
                    }
                    drawLineChart();
                }

                /**
                 * 获取近N个月
                 */
                function getMonth(beginYearMonth, newNumber) {
                    var strYear = parseInt(beginYearMonth.substr(0, 4), 10);
                    var strMonth = parseInt(beginYearMonth.substr(4, 6), 10);
                    if (strMonth - newNumber == 0) {
                        strYear -= 1;
                        strMonth = 12;
                    } else if (strMonth - newNumber < 0) {
                        strYear -= 1;
                        strMonth = 12;
                        strMonth = strMonth - newNumber + 1;
                    } else if (strMonth - newNumber > 0) {
                        strMonth -= newNumber;
                    }
                    if (strMonth < 10) {
                        strMonth = "0" + strMonth;
                    }
                    var monthstr = strYear + "" + strMonth;
                    return monthstr;
                };

                //年月字符单独截取
                function getSpecialStartDate(newDate) {
                    $scope.newSelectStartYear = newDate.substr(0, 4);
                    $scope.newSelectStartMonth = newDate.substr(4).replace(/\b(0+)/gi, "");
                }

                //时间段改变duration
                function changeUrlDuration() {
                    var url = '';
                    var startDate;
                    //类别
                    if ($scope.view.typeOptions[1].choice) {
                        url = ServiceBaseURL.url + '/api/v2/report/expense/department/expense/type?departmentOID=' + $scope.view.departmentId + '&endDate=' + $scope.currentYearMonth;
                    //人员
                    } else if ($scope.view.typeOptions[0].choice) {
                        url = ServiceBaseURL.url + '/api/v2/report/expense/department/employee?departmentOID=' + $scope.view.departmentId + '&endDate=' + $scope.currentYearMonth;
                    }

                    if ($scope.view.durationType ===  $filter('translate')('report.nearly.three.months')) {
                        startDate = new Date();
                        url = url + '&startDate=' + $filter('date')(startDate.setMonth(startDate.getMonth() - 2), 'yyyyMM');
                    } else if ($scope.view.durationType === $filter('translate')('report.nearly.six.months')) {
                        startDate = new Date();
                        url = url + '&startDate=' + $filter('date')(startDate.setMonth(startDate.getMonth() - 5), 'yyyyMM');
                    } else if ($scope.view.durationType === $filter('translate')('report.nearly.twelve.months')) {
                        startDate = new Date();
                        url = url + '&startDate=' + $filter('date')(startDate.setMonth(startDate.getMonth() - 11), 'yyyyMM');
                    }
                    return url;
                }

                (function () {
                    reportFormService.getDepartments().success(function (data) {
                        if (data && data.length > 0) {
                            $scope.view.differentObjArr = [$filter('translate')('report.personal'), $filter('translate')('report.department')];
                        }
                    });
                })();

                var init = function (newUrl) {
                    var url = '';
                    if ($scope.view.totalTypeFlag === $filter('translate')('report.personal')) {
                        for (var i = 0; i < $scope.view.centerConsumeArr.length; i++) {
                            if ($scope.view.individualSelectFlag === $scope.view.centerConsumeArr[i].name) {
                                reportFormService.getAccountIndividual($scope.view.centerConsumeArr[i].url).success(function (data) {
                                    assigmentData(data);
                                });
                            }
                        }
                    } else if ($scope.view.totalTypeFlag ===$filter('translate')('report.department')) {
                        url = changeUrlDuration();
                        //if ($scope.view.typeOptions[0].choice) {
                        //    reportFormService.departmentTypes(newUrl).success(function (data) {
                        //        reprotAssigment(data);
                        //    });
                        //} else if ($scope.view.typeOptions[1].choice) {
                        //    reportFormService.departmentTypes(url).success(function (data) {
                        //        assigmentData(data);
                        //    });
                        //} else if ($scope.view.typeOptions[2].choice) {
                        //    reportFormService.departmentTypes(url).success(function (data) {
                        //        assigmentData(data);
                        //    });
                        //}
                        if ($scope.view.typeOptions[0].choice) {
                            reportFormService.departmentTypes(url).success(function (data) {
                                assigmentData(data);
                            });
                        } else if ($scope.view.typeOptions[1].choice) {
                            reportFormService.departmentTypes(url).success(function (data) {
                                assigmentData(data);
                            });
                        }
                    }
                };

                /**
                 * @description 日期选择控件响应方法
                 */
                $scope.getStartDate = function () {  //待开发

                };

                $scope.getEndDate = function () {

                };

                /**
                 * @description 年度预算左右箭头响应方法
                 */

                $scope.goDownYear = function () {
                    --$scope.selectYear;
                    var initDepartmentUrl = ServiceBaseURL.url + '/api/v2/report/expense/department/budget?departmentOID=' +
                        $scope.view.departmentId + '&startDate=' + $scope.selectYear + '&endDate=' + $scope.selectYear;
                    init(initDepartmentUrl);
                };

                $scope.goUpYear = function () {
                    ++$scope.selectYear;
                    if ($scope.selectYear > new Date().getFullYear()) {
                        $scope.selectYear = new Date().getFullYear();
                        return;
                    }
                    var initDepartmentUrl = ServiceBaseURL.url + '/api/v2/report/expense/department/budget?departmentOID=' +
                        $scope.view.departmentId + '&startDate=' + $scope.selectYear + '&endDate=' + $scope.selectYear;
                    init(initDepartmentUrl);
                };
                //预算,人员,类别
                $scope.choiceDifferentTypeOption = function (item) {
                    $scope.view.individualPageData = [];
                    $scope.view.typeOptionFlag = item.name;
                    for (var i = 0; i < $scope.view.typeOptions.length; i++) {
                        $scope.view.typeOptions[i].choice = false;
                        if (item.name === $scope.view.typeOptions[i].name) {
                            $scope.view.typeOptions[i].choice = true;
                        }
                    }
                    if (item.name === $filter('translate')('report.budget')) {
                        var initDepartmentUrl = ServiceBaseURL.url + '/api/v2/report/expense/department/budget?departmentOID=' +
                            $scope.view.departmentId + '&startDate=' + $scope.selectYear + '&endDate=' + $scope.selectYear;
                        init(initDepartmentUrl);
                    } else {
                        init();
                    }
                    $scope.differentTypePopover.hide();
                };

                $scope.choiceDifferentType = function (item) {
                    $scope.view.individualSelectFlag = item.name;
                    switch (item.name) {
                        //2017year3month改为2017/3,中文版为2017年3月
                        case $filter('translate')('report.payment.this.month'):
                            if ($sessionStorage.lang === 'en') {
                                $scope.startDateYearMonth = (parseInt(month) + 1) + '/' + year + $filter('translate')('report.year');
                                $scope.endDateYearMonth = (parseInt(month) + 1) + '/' + year + $filter('translate')('report.year');
                            } else {
                                $scope.startDateYearMonth = year + $filter('translate')('report.year') + $filter('monthFilter')(month);
                                $scope.endDateYearMonth = year + $filter('translate')('report.year') + $filter('monthFilter')(month);
                            }
                            break;
                        case $filter('translate')('report.last.month.payment'):
                            if ($sessionStorage.lang === 'en') {
                                $scope.startDateYearMonth = parseInt(month) + '/' + year + $filter('translate')('report.year');
                                $scope.endDateYearMonth = parseInt(month) + '/' + year + $filter('translate')('report.year');
                            } else {
                                $scope.startDateYearMonth = year + $filter('translate')('report.year') + $filter('monthFilter')(parseInt(month) - 1);
                                // $scope.endDateYearMonth = year + "年" + (parseInt(month) + 1) + "月";
                                $scope.endDateYearMonth = year + $filter('translate')('report.year') + $filter('monthFilter')(parseInt(month) - 1);
                            }
                            break;
                        case $filter('translate')('report.payment.for.the.quarter'):
                            if ($sessionStorage.lang === 'en') {
                                $scope.startDateYearMonth = parseInt($scope.quarterStart.substr(4)) + '/' + year + $filter('translate')('report.year');
                                $scope.endDateYearMonth = parseInt($scope.quarterEnd.substr(4)) + '/' + year + $filter('translate')('report.year');
                            } else {
                                $scope.startDateYearMonth = year + $filter('translate')('report.year') + $filter('monthFilter')(parseInt($scope.quarterStart.substr(4)) - 1);
                                $scope.endDateYearMonth = year + $filter('translate')('report.year') + $filter('monthFilter')(parseInt($scope.quarterEnd.substr(4)) - 1);
                            }
                            break;
                        case $filter('translate')('report.payment.for.this.year'):
                            if ($sessionStorage.lang === 'en') {
                                $scope.startDateYearMonth = '1/' + year + $filter('translate')('report.year');
                                $scope.endDateYearMonth = '12/' + year + $filter('translate')('report.year');
                            } else {
                                $scope.startDateYearMonth = year + $filter('translate')('report.year') + $filter('monthFilter')(0);//Jan
                                $scope.endDateYearMonth = year + $filter('translate')('report.year')+ $filter('monthFilter')(11);//Feb
                            }
                            break;
                    }
                    var departmentUrl = ServiceBaseURL.url + item.url;
                    $scope.view.departmentId = item.id;
                    init(departmentUrl);
                    // if ($scope.view.totalTypeFlag !== '个人') {
                    //     drawLineChart();
                    // }
                    $scope.durationPopover.hide();
                };

                //不同的对象popover:个人,部门
                $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/report_form/differentObjPopover.html', {
                    scope: $scope
                }).then(function (popover) {
                    $scope.differentObjPopoer = popover;
                });

                //图表中间各种类别popover
                $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/report_form/report_form_datepopover.html', {
                    scope: $scope
                }).then(function (popover) {
                    $scope.durationPopover = popover;
                });

                //不同的类型popover:类别、预算、个人
                $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/report_form/differentTypePopover.html', {
                    scope: $scope
                }).then(function (popover) {
                    $scope.differentTypePopover = popover;
                });

                //不同时间段,近三个月，六个月，十二个月
                $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/report_form/choiceDuration.html', {
                    scope: $scope
                }).then(function (popover) {
                    $scope.differentDurationPopover = popover;
                });

                $scope.changeTotalFlag = function (name) {
                    if (name === $filter('translate')('report.personal')) {
                        $('.chartsDiv').css({'height': '15em', 'paddingTop': '1.5em'});
                        $('.total-amount-div').css({'height': '15em'});
                    } else if (name === $filter('translate')('report.department')) {
                        $('.chartsDiv').css({'height': '17em', 'paddingTop': '3em'});
                        $('.total-amount-div').css({'height': '17.5em'});
                    }
                    $scope.view.totalTypeFlag = name;
                    $scope.differentObjPopoer.hide();
                };

                $scope.choiceDifferentDuration = function (name) {
                    $scope.view.durationType = name;
                    $scope.differentDurationPopover.hide();
                     //改变header上的时间
                    var amount, startDate;
                    if (name === $filter('translate')('report.nearly.three.months')) {
                        amount = 2;
                        startDate = getStartDate(date, amount);
                        $scope.newSelectStartYear = startDate.year;
                        $scope.newSelectStartMonth = startDate.month;
                    } else if (name === $filter('translate')('report.nearly.six.months')) {
                        amount = 5;
                        startDate = getStartDate(date, amount);
                        $scope.newSelectStartYear = startDate.year;
                        $scope.newSelectStartMonth = startDate.month;
                    } else if (name ==$filter('translate')('report.nearly.twelve.months')) {
                        amount = 11;
                        startDate = getStartDate(date, amount);
                        $scope.newSelectStartYear = startDate.year;
                        $scope.newSelectStartMonth = startDate.month;
                    }
                    //drawLineChart();
                    init();
                };

                //查看人均
                $scope.checkAverage = function (imgSrc) {
                    if (imgSrc === 'img/report_form/open-eye.png') {
                        $scope.view.averageImgSrc = 'img/report_form/close-eye.png';
                        $scope.view.showAverageConsumeFlag = false;
                    } else {
                        $scope.view.averageImgSrc = 'img/report_form/open-eye.png';
                        $scope.view.showAverageConsumeFlag = true;
                    }
                };

                //判断对象是否相等
                function isObjectValueEqual(a, b) {
                    var aProps = Object.getOwnPropertyNames(a);
                    var bProps = Object.getOwnPropertyNames(b);

                    if (aProps.length != bProps.length) {
                        return false;
                    }

                    for (var i = 0; i < aProps.length; i++) {
                        var propName = aProps[i];
                        if (a[propName] !== b[propName]) {
                            return false;
                        }
                    }
                    return true;
                }

                $scope.$watch('view.totalTypeFlag', function (newValue, oldValue, scope) {
                    $scope.view.individualPageData = [];
                    $scope.view.chartPieData = [];
                    $scope.view.centerConsumeArr = [];
                    if (newValue !== $filter('translate')('report.personal')) {
                        //$scope.view.typeOptions = [
                        //    {name: '预算', choice: true},
                        //    {name: '人员', choice: false},
                        //    {name: '类别', choice: false}];
                        $scope.view.typeOptions = [
                            {name: $filter('translate')('report.personnel'), choice: true},
                            {name: $filter('translate')('report.category'), choice: false}];
                        $scope.view.centerConsumeArr = [];
                        reportFormService.getDepartments().success(function (data) {
                            var length = data.length;
                            for (var i = 0; i < length; i++) {
                                var templateObj = {};
                                templateObj.name = data[i].name;
                                templateObj.id = data[i].departmentOID;
                                // templateObj.url = '/api/report/expense/pie/department?duration=106&departmentOID=' + data[i].departmentOID;
                                templateObj.url = '/api/v2/report/expense/department/budget?departmentOID=' +
                                    data[i].departmentOID + '&startDate=' + $scope.selectYear + '&endDate=' + $scope.selectYear;
                                $scope.view.centerConsumeArr.push(templateObj);
                            }
                            $scope.view.individualSelectFlag = $scope.view.centerConsumeArr[0].name;
                            var initDepartmentUrl = ServiceBaseURL.url + $scope.view.centerConsumeArr[0].url;
                            $scope.view.departmentId = $scope.view.centerConsumeArr[0].id;
                            init(initDepartmentUrl);
                        });
                    } else {
                        //$scope.view.typeOptions = [
                        //    {name: '预算', choice: true},
                        //    {name: '人员', choice: false},
                        //    {name: '类别', choice: false}];
                        $scope.view.typeOptions = [
                            {name: $filter('translate')('report.personnel'), choice: true},
                            {name:$filter('translate')('report.category'), choice: false}];
                        $scope.view.centerConsumeArr = [
                            {
                                name:$filter('translate')('report.payment.this.month'),
                                url: '/api/v2/report/expense/personal?startDate=' + $scope.currentYearMonth + '&endDate=' + $scope.currentYearMonth
                            },
                            {
                                name: $filter('translate')('report.last.month.payment'),
                                url: '/api/v2/report/expense/personal?startDate=' + $scope.lastYearMonth + '&endDate=' + $scope.lastYearMonth
                            },
                            {
                                name:$filter('translate')('report.payment.for.the.quarter'),
                                url: '/api/v2/report/expense/personal?startDate=' + $scope.quarterStart + '&endDate=' + $scope.quarterEnd
                            },
                            {
                                name: $filter('translate')('report.payment.for.this.year'),
                                url: '/api/v2/report/expense/personal?startDate=' + $scope.annualYearMonthStart + '&endDate=' + $scope.annualYearMonthEnd
                            }];
                        $scope.view.individualSelectFlag = $scope.view.centerConsumeArr[0].name;
                        init();
                    }
                });
                //获取几个月前的时间的yyyy和MM
                function getStartDate(date, amount) {
                    var startDate = {};
                    date = date.setMonth(date.getMonth() - amount);
                    startDate.year = $filter('date')(date, 'yyyy');
                    startDate.month = $filter('date')(date, 'MM');
                    return startDate;
                }

                $scope.$watch('view.durationType', function (newValue, oldValue, scope) {
                    var date = new Date();
                    var startDate;
                    var currentMonth = date.getMonth() + 1;
                    var amount = 0;
                    if (newValue ===$filter('translate')('report.nearly.three.months')) {
                        amount = 2;
                        startDate = getStartDate(date, amount);
                        $scope.newSelectStartYear = startDate.year;
                        $scope.newSelectStartMonth = startDate.month;
                    } else if (newValue === $filter('translate')('report.nearly.six.months')) {
                        amount = 5;
                        startDate = getStartDate(date, amount);
                        $scope.newSelectStartYear = startDate.year;
                        $scope.newSelectStartMonth = startDate.month;
                    } else if (newValue ==$filter('translate')('report.nearly.twelve.months')) {
                        amount = 11;
                        startDate = getStartDate(date, amount);
                        $scope.newSelectStartYear = startDate.year;
                        $scope.newSelectStartMonth = startDate.month;
                    }
                    var tempArr = [];

                    for (var i = amount; i > -1; i--) {
                        if (currentMonth < 1) {
                            currentMonth = 12 - currentMonth;
                        }
                        tempArr[i] = currentMonth--;
                        tempArr[i] = changeNumAndStr(tempArr[i]);
                    }
                    pageData.chartsData.labels = tempArr;
                });

                $scope.$on('$ionicView.enter', function () {
                    /*Principal.identity().then(function (data) {
                        ExpenseService.getExpenseTypes(data.companyOID)
                            .then(function (data) {
                                for (var i = 0; i < data.length; i++) {
                                    $scope.view.expenseTypelist.push(data[i]);
                                }
                                // console.log($scope.view.expenseTypelist)
                                init();
                            });
                    });*/
                    Principal.identity()
                        .then(function(data) {
                            $scope.view.departmentId = data.departmentOID;
                        });
                });
                $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                    viewData.enableBack = true;
                    ExpenseService.getAllExpenseTypes()
                        .then(function (data) {
                            for (var i = 0; i < data.length; i++) {
                                $scope.view.expenseTypelist.push(data[i]);
                            }
                        });

                    init();
                });
            }]);
