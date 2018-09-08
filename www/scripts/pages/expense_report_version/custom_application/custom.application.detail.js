/**
 * Created by Yuko on 16/10/28.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.custom_application_wait_approval', {
                url: '/custom/application/wait/approval?applicationOID?formType',
                cache: false,
                data: {
                    roles: ['ROLE_USER'],
                    pageClass: 'application-custom-detail'
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/custom.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.CustomApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'waitApproval';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.custom_application_detail', {
                url: '/custom/application/detail?applicationOID?formType',
                cache: false,
                data: {
                    roles: ['ROLE_USER'],
                    pageClass: 'application-custom-detail'
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/custom.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.CustomApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'detail';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.custom_application_has_pass', {
                url: '/custom/application/has/pass?applicationOID?formType',
                cache: false,
                data: {
                    roles: ['ROLE_USER'],
                    pageClass: 'application-custom-detail'
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/custom.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.CustomApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'hasPass';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.custom_application_approval', {
                url: '/custom/application/approval?applicationOID?formType',
                cache: false,
                data: {
                    roles: ['ROLE_USER'],
                    pageClass: 'application-custom-detail'
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/custom.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.CustomApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'approval';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.custom_application_travel_next', {
                url: '/custom/application/travel/next?applicationOID?formType',
                cache: false,
                data: {
                    roles: ['ROLE_USER'],
                    pageClass: 'application-custom-detail'
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/custom.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.CustomApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'travelNext';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            //从消息页面过来，只读
            .state('app.custom_application_notification_readonly', {
                url: '/custom/application/notification/readonly?applicationOID?formType',
                cache: false,
                data: {
                    roles: ['ROLE_USER'],
                    pageClass: 'application-custom-detail'
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/custom.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.CustomApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'notification_readonly';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            //借款申请核销
            .state('app.custom_application_refund', {
                url: '/custom/application/refund?applicationOID?formType',
                cache: false,
                data: {
                    roles: ['ROLE_USER'],
                    pageClass: 'application-custom-detail'
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/custom.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.CustomApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'didi_refund';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.huilianyi.CustomApplicationDetailController', ['$scope', '$state', '$stateParams', 'CustomApplicationServices',
        'PublicFunction', '$timeout', '$ionicHistory', 'content', '$ionicLoading', 'CurrencyCodeService', '$ionicPopup', 'ApprovalERVService', 'CostCenterService',
        'SelfDefineExpenseReport', 'TravelERVService', '$ionicModal', 'FunctionProfileService', '$q', 'CtripService', 'CompanyConfigurationService', '$filter',
        'CorporationEntityService', '$ionicListDelegate', 'CustomValueService', 'CompanyService', 'AgencyService', 'Principal', '$sessionStorage', '$ionicPopover', '$ionicPosition',
        '$ionicScrollDelegate', 'LocationService', '$ionicActionSheet','$rootScope', '$cordovaClipboard', 'ServiceBaseURL', '$location',
        function ($scope, $state, $stateParams, CustomApplicationServices, PublicFunction, $timeout, $ionicHistory, content, $ionicLoading, CurrencyCodeService,
                  $ionicPopup, ApprovalERVService, CostCenterService, SelfDefineExpenseReport, TravelERVService, $ionicModal, FunctionProfileService, $q, CtripService,
                  CompanyConfigurationService, $filter, CorporationEntityService, $ionicListDelegate, CustomValueService, CompanyService,
                  AgencyService, Principal, $sessionStorage, $ionicPopover, $ionicPosition, $ionicScrollDelegate, LocationService, $ionicActionSheet,$rootScope, $cordovaClipboard,
                  ServiceBaseURL, $location) {
            var opinionPopup = null;
            var ref = null;
            //时间控件多语言
            if($sessionStorage.lang == 'zh_cn'){
                $scope.mobiscrollLang = 'zh';
            } else {
                $scope.mobiscrollLang = 'en';
            }

            function inAppBrowserLoadStart(event) {
                if (event.url.indexOf('closeInAppBrowser.html') !== -1 && event.url.indexOf('CallBack') === -1 && event.url.indexOf('callback') === -1) {
                    ref.close();
                }
            }

            function inAppBrowserClose() {
                ref.removeEventListener('loadstart', inAppBrowserLoadStart);
                ref.removeEventListener('exit', inAppBrowserClose);
                ref = null;
            }
            //选择时间段
            $timeout(function () {
                $('#demo').mobiscroll().range({
                    theme: 'mobiscroll',
                    lang: $scope.mobiscrollLang,
                    steps: {
                        minute: 5,
                        second: 5,
                        zeroBased: true
                    },
                    buttons: [
                        {
                            text: $filter('translate')('system_check.ok'), //确定
                            handler: function (event, inst) {
                                if($scope.view.selectFlightType == 'startTime'){
                                    $scope.view.flightList[$scope.view.selectFlightIndex].beginTimeRange = inst._value;
                                    var item = inst._value.split(" - ");
                                    $scope.view.flightList[$scope.view.selectFlightIndex].takeOffBeginTime = item[0];
                                    $scope.view.flightList[$scope.view.selectFlightIndex].takeOffEndTime = item[1];
                                } else if($scope.view.selectFlightType == 'endTime'){
                                    $scope.view.flightList[$scope.view.selectFlightIndex].endTimeRange = inst._value;
                                    var item = inst._value.split(" - ");
                                    $scope.view.flightList[$scope.view.selectFlightIndex].arrivalBeginTime = item[0];
                                    $scope.view.flightList[$scope.view.selectFlightIndex].arrivalEndTime = item[1];
                                }
                                $scope.$apply();
                                $('#demo').mobiscroll('cancel');
                                return false;
                            }
                        },
                        {
                            text: $filter('translate')('system_check.cancel'), //取消
                            handler: 'cancel'
                        }
                    ],
                    controls: ['time'],
                    display: 'bottom'
                });
            }, 1000);
            $scope.view = {
                subsidiesListCopy: [],
                originRemarkList: null, //记录行程备注
                oldCitySupplier: 'standard', //旧版差旅行程的城市控件供应商name  （机票是 ctrip_air， 否则都是 standard）
                hasRemark: false, //标记是否有行程备注
                ctripFlightOID: null, //携程机票供应商oid
                ctripHotelOID: null, //携程酒店供应商oid
                ctshoFlightOID: null, //中旅机票供应商oid
                expenseTypeOIDCopy: null, //存储已选中的差补类型
                adminList: [],// 管理员列表
                subsidiesListIndex: -1, //差补选中下标
                hasSaveRemark: false, //是否已点击保存备注
                hasEditBase: true, //是否有编辑箭头
                bookerType: null, //选择统一订票人类型
                selectText: $filter('translate')('form.please.select'), //请选择
                departureText: $filter('translate')('custom.application.tip.departure'), //出发地
                destinationText: $filter('translate')('custom.application.tip.destination'), //目的地
                hotelStartDate: null, //酒店的开始日期
                hotelEndDate: null, //酒店的结束日期
                currentCity: null, //当前城市
                currentCityCode: null, //当前城市code
                shareRoomConfig: null, //合住配置
                selectedHotel: [], //已选择的酒店日期
                selectedHotelCopy: [], //已选择的酒店日期Copy
                outParticipantNum: -1, //外部参与人数量
                hotelMaleClerksName: '', //酒店男合住人名字
                hotelFemaleClerksName: '',//酒店女合住人名字
                isRandom: false, //是否是随机酒店订票人
                travelHotelBookingMaleClerks: null, //酒店男订票人
                travelHotelBookingFemaleClerks: null, //酒店女订票人
                applicantName: null, //参与人
                selectParicipantOids: [], //订票人oids
                selectParicipantNames: [], //订票人 name
                hotelRoomData: null, //酒店数量
                hotelProfile: {}, //酒店配置
                supplierIcon: {}, //供应商图标
                hasNav: false, //是否有右上角按钮
                expand: $filter('translate')('custom.application.expand'),  //展开
                disexpand: $filter('translate')('custom.application.disexpand'), //"收起"
                travelSubsidiesList: [], //差补列表
                deleteItineraryType: null, //删除往返时选中的类型
                deleteItineraryData: null,// 删除往返时选中的行程
                deleteIndex: -1, // 删除往返时选中的行程下标
                selectParicipantList: [], //选择订票人列表
                ticketMessage: null, //订票信息
                participantOids: [], //参与人oids
                participantNames: [], //参与人name
                isShowFlight: true,
                isShowTrain: true,
                isShowHotel: true,
                isShowRemark: true,
                isShowOther: true,
                isShowFlightTicket: true,
                isShowAllowance: true,
                fightSupplierSelect: [], //机票供应商选择列表
                trainSupplierSelect: [], //火车供应商选择列表
                hotelSupplierSelect: [], //酒店供应商选择列表
                hasBlueBar: false,  //控制蓝色导航栏的添加与删除
                hasGetDay: false, //是否有在拿出差天数
                hasGetItinerary: false, //是否有在拿出差行程
                travelDay: null,
                fightDiscountList: [
                    {'text': $filter('translate')('system_check.all')}, //所有
                    {'text': 1},
                    {'text': 2},
                    {'text': 3},
                    {'text': 4},
                    {'text': 5},
                    {'text': 6},
                    {'text': 7},
                    {'text': 8},
                    {'text': 9},
                    {'text': 10}
                ], //机票折扣列表
                seatClassList: [  //舱等列表
                    {'text': $filter('translate')('system_check.all')}, //'所有'
                    {'text': $filter('translate')('custom.application.class.economy')}, //'经济舱'
                    {'text': $filter('translate')('custom.application.class.super_economy')}, //'超级经济舱'
                    {'text': $filter('translate')('custom.application.class.business')}, //'公务舱'
                    {'text': $filter('translate')('custom.application.class.first')} //'头等舱'

                ],
                selectItineraryDetail: [], //选中的行程详情
                selectItineraryIndex: -1, //选中的行程下标
                showModal: false, //是否在显示modal
                fightSupplier: [], //机票供应商列表
                trainSupplier: [], //火车供应商
                hotelSupplier: [], //酒店供应商
                expenseTypeList: null, //费用类型列表
                allItineraryList: null, //所有的差旅行程
                selectFlightIndex: null, //机票行程修改时间段的index
                selectFlightType: null, //机票行程修改时间段的类型（startTime, endTime）
                flightSelect: {
                    "supplierName": null, //已选中供应商name
                    "supplierOID": null, //供应商oid
                    "uniformBooking": false, //是否统一订票
                    "itineraryType": 1001, //行程类型：1001单程 1002往返 (可为空 ，行程级管控时必填)
                    "fromCity": null, //出发地
                    "fromCityCode": null, //出发地code
                    "toCity": null, //目的地
                    "toCityCode": null, //目的地code
                    "startDate": null, //出发时间 eg：2017-04-07T07:16:22Z
                    "endDate": null, //到达时间 eg：2017-04-07T07:16:22Z
                    "remark": null, //备注
                    "airLine": null, //	承运航空公司
                    "takeOffBeginTime": null, //起飞开始时间（HH：MM） eg：08:20
                    "takeOffEndTime": null, //起飞结束时间（HH：MM） eg：08:20
                    "arrivalBeginTime": null, //降落开始时间（HH：MM） eg：08:20
                    "arrivalEndTime": null, //降落结束时间（HH：MM） eg：08:20
                    "discount": 0, //折扣（1～10之间）
                    "ticketPrice": null, //票价
                    "productType": null, //预定类型 1001代表国内机票、1002代表国际机票
                    "seatClass": 0, //舱等，经济舱/超级经济舱/公务舱/头等舱
                    "bookingClerkName": null, //统一订票人名字
                    "bookingClerkOID": null, //统一订票人OID
                    "beginTimeRange": null,
                    "endTimeRange": null,
                    "supplierIconUrl": null,
                    "serviceName": null  //对接城市控件
                },
                allowanceSelect: {
                    "startDate": null,
                    "endDate": null,
                    "cityCode": null,
                    "cityName": null,
                    "remark": null,
                    "hasGetType": false,
                },
                subsidiesList: [], //编辑中的差补列表
                flightList: [], //机票列表
                trainList: [],//火车列表
                trainSelect: { //火车对象
                    "supplierName": null, //已选中供应商name
                    "supplierOID": null, //供应商oid
                    "itineraryType": 1001, //行程类型：1001单程 1002往返 (可为空 ，行程级管控时必填)
                    "fromCity": null, //出发地
                    "fromCityCode": null, //出发地code
                    "toCity": null, //目的地
                    "toCityCode": null, //目的地code
                    "startDate": null, //出发时间 eg：2017-04-07T07:16:22Z
                    "endDate": null, //到达时间 eg：2017-04-07T07:16:22Z
                    "remark": null, //备注
                    "supplierIconUrl": null,
                    "serviceName": null  //对接城市控件
                },
                hotelList: [],//酒店列表
                hotelSelect: {
                    "supplierName": null, //已选中供应商name
                    "supplierOID": null, //供应商oid
                    "cityName": null, //城市
                    "cityCode": null, //城市code
                    "fromDate": null, //出发时间 eg：2017-04-07
                    "leaveDate": null, //到达时间 eg：2017-04-07
                    "roomNumber": 0,
                    "maxPrice": null,
                    "minPrice": null,
                    "remark": null, //备注
                    "supplierIconUrl": null,
                    "selectDay": [], //存储当前选择的酒店day
                    "serviceName": null  //对接城市控件
                },
                otherTrafficList: [],//其他交通列表
                copyOtherTrafficList: [], //其他交通列表副本
                otherTrafficSelect: {
                    "supplierName": null, //已选中供应商name
                    "supplierOID": null, //供应商oid
                    "itineraryType": 1001, //行程类型：1001单程 1002往返 (可为空 ，行程级管控时必填)
                    "trafficType": 1001, //交通类型:1001轮船、1002汽车、1003其他
                    "trafficTypeName": null, //交通类型名称，当交通类型为其他时可以自行设置
                    "fromCity": null, //出发地
                    "fromCityCode": null, //出发地code
                    "toCity": null, //目的地
                    "toCityCode": null, //目的地code
                    "startDate": null, //出发时间 eg：2017-04-07T07:16:22Z
                    "endDate": null, //到达时间 eg：2017-04-07T07:16:22Z
                    "remark": null //备注
                },
                travelAllowanceList: [], //差补列表
                remarkItineraryList: [],// 所有的行程备注列表
                leaveTop: false, //判断元素添加banner是否离开页面
                hasScroll: false, //是否开始吸顶元素添加banner
                rightNavList: [], //右上角更多操作列表
                userInParticipants: false, //申请人是否在参与人列表中
                userDetail: null, //当前用户detail
                userOID: null,   // 当前用户OID
                disableSubmit: false,
                disableApproval: false,
                noRefund: false,
                formType: $stateParams.formType,
                readOnly: false,
                supplierOID: null, //供应商oid
                selectedSupplier: null, //供应商
                startDate: null, //出发日期
                endDate: null, //结束日期
                disabledPlane: true,//不能定机票
                disabledTrain: true, //不能定火车票
                disabledHotel: false, //不能定酒店
                hasCtrip: false, //是否开通携程
                hasTongCheng: false, //是否开通同程
                isHandEdit: false,
                noOrder: true, //无本人或者外部参与人订单
                currentUrl: null, //请求详情的url
                content: content,
                applicationData: {},
                applicationParticipants: [],//参与人员
                selectDateList: [],//选择的日期
                allowanceList: [],//补贴明细
                attachments: [],
                route: {
                    trafficType: null,
                    fromCity: null,
                    toCity: null
                },
                trafficSelectIndex: -1,
                notFoundIcon: 'img/error-icon/not-found.png',
                isNotFound: false,
                notFoundText: $filter('translate')('custom.application.error.not.found'),//该申请单已删除
                enternalNumName: null,
                bookerName: null,
                showTravelMember: false,
                code: null, //货币符号
                rejectReason: null,
                travelElementList: [], //差旅要素列表
                invoiceList: [],//费用列表
                invoiceTitle: null, //费用列表title
                refundMessage: {
                    type: null, //1001退票 1002 改签
                    remark: null,
                    travelOrderOID: null
                },
                language: $sessionStorage.lang,//当前语言环境
                goBackTip: function () {
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit = true;
                        try {
                            if ($scope.view.travelSubsidiesList && $scope.view.travelSubsidiesList.length != $scope.view.subsidiesListCopy.length) {
                                var confirmPopup = $ionicPopup.confirm({
                                    scope: $scope,
                                    template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.save_application') + '</p>', //是否保存该申请单
                                    cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                    cancelType: 'button-calm',
                                    okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                                    cssClass: 'stop-time-popup'
                                });
                                confirmPopup.then(function (res) {
                                    if (res) {
                                        $scope.view.disableSubmit = false;
                                        $scope.view.saveApplication('save');
                                    } else {
                                        $scope.view.disableSubmit = false;
                                        $scope.view.goBack();
                                    }
                                })
                            } else {
                                $scope.view.isDirtyForm()
                                    .then(function () {
                                        $scope.view.disableSubmit = false;
                                        var confirmPopup = $ionicPopup.confirm({
                                            scope: $scope,
                                            template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.save_application') + '</p>', //是否保存该申请单
                                            cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                            cancelType: 'button-calm',
                                            okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                                            cssClass: 'stop-time-popup'
                                        });
                                        confirmPopup.then(function (res) {
                                            if (res) {
                                                $scope.view.disableSubmit = false;
                                                $scope.view.saveApplication('save');
                                            } else {
                                                $scope.view.disableSubmit = false;
                                                $scope.view.goBack();
                                            }
                                        })
                                    }, function () {
                                        $scope.view.disableSubmit = false;
                                        $scope.view.goBack();
                                    })
                            }
                        } catch (error){
                            $scope.view.disableSubmit = false;
                            $scope.view.goBack();
                        }
                    }
                },
                //表单是否有修改
                isDirtyForm: function(){
                    var defer = $q.defer();
                    var hasFinish = false;
                    if($scope.view.travelSubsidiesList && $scope.view.travelSubsidiesList.length && $scope.view.travelSubsidiesList.length > 0){
                        for(var i = 0; i < $scope.view.travelSubsidiesList.length; i++){
                            if($scope.view.travelSubsidiesList[i].startDate != $scope.view.subsidiesListCopy[i].startDate ||
                                $scope.view.travelSubsidiesList[i].endDate != $scope.view.subsidiesListCopy[i].endDate || $scope.view.travelSubsidiesList[i].cityCode != $scope.view.subsidiesListCopy[i].cityCode){
                                defer.resolve(true);
                                return defer.promise;
                            }
                            if(i >= ($scope.view.travelSubsidiesList.length -1)){
                                hasFinish = true;
                            }
                        }
                    } else {
                        hasFinish = true;
                    }
                    if(hasFinish){
                        defer.reject(false);
                        return defer.promise;
                    }
                },
                //复制
                readyCopy: function ($event, data) {
                    $scope.copyPopover.show($event);
                    $scope.copyPopover.scope.value = data

                },
                copyText: function (value) {
                    $scope.copyPopover.hide();
                    $cordovaClipboard.copy(value).then(function () {
                        $ionicLoading.show({
                            template: $filter('translate')('status.copyed'), //已复制
                            duration: 1500
                        });
                    });
                },
                getDateLong: function (arr_days) {
                    // 将传过来的数组中日期去掉时分秒转换成时间戳
                    // 先排序，然后转时间戳
                    var _days = arr_days.sort();
                    var days = _days.map(function (d, i) {
                        var dt = new Date(d);
                        dt.setDate(dt.getDate() + arr_days.length - 1 - i); // 将排序后的日期加上不同的天数处理为相同日期
                        // 抹去 时 分 秒 毫秒
                        dt.setHours(0);
                        dt.setMinutes(0);
                        dt.setSeconds(0);
                        dt.setMilliseconds(0);
                        return +dt;
                    });

                    var temp = [];
                    var tmpArr = [];
                    var str = '';
                    /*
                     * 将连续的日期放在同一个数组中
                     * [["2016-02-28", "2016-02-29", "2016-03-01", "2016-03-02", "2016-03-03"], ["2016-03-05"], ["2016-03-07", "2016-03-08"]]
                     * */
                    angular.forEach(days, function (item, index) {  // 比较数组中时间戳是否相等，进行分组
                        temp.push(_days[index]);
                        if (item !== days[index + 1]) {
                            tmpArr.push(temp);
                            temp = [];
                        }
                    });
                    /*
                     * 遍历数组，将数组转换成字符串
                     * 2016-02-28 ~ 2016-03-03 、2016-03-05 、2016-03-07 ~ 2016-03-08
                     * */
                    angular.forEach(tmpArr, function (item, index) {
                        if (item.length > 1) {
                            str = index < tmpArr.length - 1 ? str + 'D' + ($scope.view.getDiffDay($scope.view.startDate, item[0]) +1) + ' ~ ' + 'D' + ($scope.view.getDiffDay($scope.view.startDate, item[item.length - 1]) +1) + ' 、' : str + 'D' + ($scope.view.getDiffDay($scope.view.startDate, item[0]) +1) + ' ~ ' + 'D' + ($scope.view.getDiffDay($scope.view.startDate, item[item.length - 1]) +1);
                        } else {
                            str = index < tmpArr.length - 1 ? str + 'D' + ($scope.view.getDiffDay($scope.view.startDate, item[0]) +1) + ' 、' : str + 'D' + ($scope.view.getDiffDay($scope.view.startDate, item[0]) +1);
                        }
                    });
                    return str;
                },
                //删除添加中的 飞机行程
                deleteFlight: function (index) {
                    if($scope.view.flightList[index].flightItineraryOID){
                        CustomApplicationServices.deleteFlightItinerary($scope.view.flightList[index].flightItineraryOID)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                $scope.view.flightList.splice(index, 1);
                                $ionicListDelegate.closeOptionButtons();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                $ionicListDelegate.closeOptionButtons();
                            })
                    } else {
                        $scope.view.flightList.splice(index, 1);
                        PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                    }

                },
                //删除添加中的 火车行程
                deleteTrain: function (index) {
                    if($scope.view.trainList[index].trainItineraryOID){
                        CustomApplicationServices.deleteTrainItinerary($scope.view.trainList[index].trainItineraryOID)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                $scope.view.trainList.splice(index, 1);
                                $ionicListDelegate.closeOptionButtons();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                $ionicListDelegate.closeOptionButtons();
                            })
                    } else {
                        $scope.view.trainList.splice(index, 1);
                        PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                    }
                },
                //删除添加中的  其他行程
                deleteOther: function (index) {
                    if($scope.view.otherTrafficList[index].otherItineraryOID){
                        CustomApplicationServices.deleteOtherItinerary($scope.view.otherTrafficList[index].otherItineraryOID)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                $scope.view.otherTrafficList.splice(index, 1);
                                $ionicListDelegate.closeOptionButtons();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                $ionicListDelegate.closeOptionButtons();
                            })
                    } else {
                        $scope.view.otherTrafficList.splice(index, 1);
                        PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                    }
                },
                //删除添加中的  酒店行程
                deleteHotel: function (index) {
                    if($scope.view.hotelList[index].hotelItineraryOID){
                        CustomApplicationServices.deleteHotelItinerary($scope.view.hotelList[index].hotelItineraryOID)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                $scope.view.hotelList.splice(index, 1);
                                $ionicListDelegate.closeOptionButtons();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                $ionicListDelegate.closeOptionButtons();
                            })
                    } else {
                        $scope.view.hotelList.splice(index, 1);
                        PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                    }
                },
                //获取两天之间的天数
                getDiffDay: function (startDate, endDate) {
                    if(startDate && endDate){
                        startDate = new Date(startDate).Format('yyyy/MM/dd').toString();
                        endDate = new Date(endDate).Format('yyyy/MM/dd').toString();
                        var start = [], end = [];
                        var oDate1, oDate2;
                        start = startDate.split("/");
                        oDate1 = new Date(start[1] + '/' + start[2] + '/' + start[0]);  //转换为12-18-2002格式
                        end = endDate.split("/");
                        oDate2 = new Date(end[1] + '/' + end[2] + '/' + end[0]);
                        return (parseInt(Math.abs(oDate2 - oDate1) / 1000 / 60 / 60 / 24)); //把相差的毫秒数转换为天数
                    }
                },
                getRelatedExpenseType: function () { //获取关联的费用类型
                    SelfDefineExpenseReport.getFormExpenseType($scope.view.applicationData.formOID)
                        .success(function (data) {
                            $scope.view.expenseTypeList = data.expenseTypes;
                        })
                },
                rightNav: function (id) {  //右上角
                    $scope.popover.hide();
                    if(id == 'save'){
                        $scope.view.saveApplication();
                    } else if(id == 'withdraw'){
                        var confirmPopup = $ionicPopup.confirm({
                            scope: $scope,
                            template: '<p style="text-align: center">' + $filter('translate')('custom.application.tip.withdraw_application') + '</p>', //是否撤回该申请单
                            cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                            cancelType: 'button-calm',
                            okText: $filter('translate')('status.withdraw'),  //撤回
                            cssClass: 'stop-time-popup'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $scope.view.withdrawApplication();
                            }
                        })
                    } else if(id == 'delete'){
                        var confirmPopup = $ionicPopup.confirm({
                            scope: $scope,
                            template: '<p style="text-align: center">' + $filter('translate')('custom.application.tip.delete_application') + '</p>', //是否删除该申请单
                            cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                            cancelType: 'button-calm',
                            okText: $filter('translate')('custom.application.button.sure_delete'),  //确认删除
                            cssClass: 'stop-time-popup'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $scope.view.deleteApplication();
                            }
                        })
                    } else if(id == 'close'){
                        $scope.view.closeApplication();
                    } else if(id == 'restart'){
                        $scope.view.restartApplication();
                    } else if (id == 'print') {
                        CustomApplicationServices.printApplication($stateParams.applicationOID)
                            .success(function (data) {
                                if (data) {
                                    window.open(data.fileURL, '_system');
                                } else {
                                    $scope.view.rightNav('print');
                                }
                            });
                    }
                },
                //关闭申请单
                closeApplication: function () {
                    var confirmPopup = $ionicPopup.confirm({
                        title: $filter('translate')('custom.application.tip.close_application'), //是否停用该申请单
                        template: '<p style="text-align: center">' + $filter('translate')('custom.application.tip.close_can_not_relate') +'</p>', //停用后将不可与报销单相关联
                        cancelText: $filter('translate')('common.cancel'),  //取消
                        cancelType: 'button-calm',
                        okText: $filter('translate')('common.sure_close'), //确认停用
                        cssClass: 'stop-time-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            CustomApplicationServices.closeApplication($stateParams.applicationOID, $scope.view.userOID)
                                .success(function (data) {
                                    if(data && (data.errorCode == 1000 || data.errorCode == 1003 )){
                                        $scope.view.applicationData.applicationParticipant.closed = 1;
                                        PublicFunction.showToast($filter('translate')('custom.application.tip.has_closed')); //已停用
                                        $timeout(function (){
                                            $scope.view.goBack();
                                        }, 200);
                                    } else if(data && data.errorCode == 1001){
                                        PublicFunction.showToast($filter('translate')('custom.application.tip.application_no_pay')); //申请单所关联的报销单未付款
                                    } else if(data && data.errorCode == 1002){
                                        PublicFunction.showToast($filter('translate')('custom.application.tip.current_applicant_no_exist')); //当前参与人不存在
                                    } else{
                                        PublicFunction.showToast($filter('translate')('status.error'));
                                    }
                                })
                                .error(function (data) {
                                    PublicFunction.showToast($filter('translate')('status.error'));
                                })
                        } else {

                        }
                    })
                },
                //重新启用申请单
                restartApplication: function (index) {
                    $scope.nextCloseDate = new Date();
                    if($scope.view.applicationData.customFormProperties.restartCloseDay && parseInt($scope.view.applicationData.customFormProperties.restartCloseDay) == $scope.view.applicationData.customFormProperties.restartCloseDay){
                        $scope.nextCloseDate.setDate($scope.nextCloseDate.getDate() + $scope.view.applicationData.customFormProperties.restartCloseDay);
                    }
                    if($scope.view.applicationData.closeDate){
                        if(Date.parse(new Date($scope.view.applicationData.closeDate)) - Date.parse(new Date($scope.nextCloseDate)) < 0){
                            $scope.nextCloseDate = new Date($scope.view.applicationData.closeDate);
                        }
                    }
                    $scope.nextCloseDate = new Date($scope.nextCloseDate).Format('yyyy-MM-dd');
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope,
                        title: $filter('translate')('custom.application.tip.restart_application'), //是否重新启用该申请单
                        template: '<p style="text-align: center">' + $filter('translate')('custom.application.tip.expect_next_close_time') +':{{nextCloseDate}} </p>', //预计下次停用时间
                        cancelText: $filter('translate')('common.cancel'), //取消
                        cancelType: 'button-calm',
                        okText: $filter('translate')('common.sure_restart'), //重新启用
                        cssClass: 'stop-time-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            CustomApplicationServices.restartApplication($stateParams.applicationOID, $scope.view.userOID, $scope.view.applicationData.customFormProperties.restartCloseDay)
                                .success(function (data) {
                                    $scope.view.applicationData.applicationParticipant.closed = 0;
                                    PublicFunction.showToast($filter('translate')('custom.application.tip.has_restart')); //已重新启用
                                    $timeout(function (){
                                        $scope.view.goBack();
                                    }, 200);
                                })
                                .error(function (data) {
                                    PublicFunction.showToast($filter('translate')('status.error'));
                                })
                        } else {

                        }
                    })
                },
                // 判断function profile中是否有对应vendor
                functionProfileVenderJudge: function(id_list) {
                    if($scope.view.functionProfileList && $scope.view.functionProfileList['vendor'] && $scope.view.functionProfileList['vendor'].length > 0){
                        for(var i=0; i<id_list.length; i++){
                            if ($scope.view.functionProfileList['vendor'].indexOf(id_list[i])!=-1){
                                return true;
                            }
                        }
                    } else {
                        return false;
                    }
                    return false;
                },
                //选择统一订票人
                selectTogetherBooker: function (type) {
                    $scope.view.bookerType = type;
                    $scope.togetherBookerModal.show();
                    var together_book_ticket = document.getElementsByClassName("scroll-content-container");
                    for (var i = 0; i < together_book_ticket.length; i++) {
                        together_book_ticket[i].style.height = String((window.innerHeight / 2) - 44) + "px";
                    }
                    // if(type == 'flight'){
                    //     $scope.hideSheet = $ionicActionSheet.show({
                    //         cssClass: 'select-together-booker',
                    //         buttons: $scope.view.selectParicipantList,
                    //         titleText: $filter('translate')('custom.application.tip.select_booker'), //请选择订票人
                    //         buttonClicked: function (index) {
                    //             $scope.view.applicationData.travelApplication.bookingClerkOID =  $scope.view.selectParicipantOids[index];
                    //             $scope.view.applicationData.travelApplication.bookingClerkName = $scope.view.selectParicipantNames[index];
                    //             $scope.hideSheet();
                    //         }
                    //     });
                    // } else if(type == 'hotel'){
                    //     $scope.hideSheet = $ionicActionSheet.show({
                    //         cssClass: 'select-together-booker',
                    //         buttons: $scope.view.selectParicipantList,
                    //         titleText: $filter('translate')('custom.application.tip.select_booker'), //请选择订票人
                    //         buttonClicked: function (index) {
                    //             $scope.view.applicationData.travelApplication.hotelBookingClerkOID =  $scope.view.selectParicipantOids[index];
                    //             $scope.view.applicationData.travelApplication.hotelBookingClerkName = $scope.view.selectParicipantNames[index];
                    //             $scope.hideSheet();
                    //         }
                    //     });
                    // }
                },
                selectBookerName: function (index) {
                    if($scope.view.bookerType == 'flight'){
                        $scope.view.applicationData.travelApplication.bookingClerkOID =  $scope.view.selectParicipantOids[index];
                        $scope.view.applicationData.travelApplication.bookingClerkName = $scope.view.selectParicipantNames[index];
                    } else if($scope.view.bookerType == 'hotel'){
                        $scope.view.applicationData.travelApplication.hotelBookingClerkOID =  $scope.view.selectParicipantOids[index];
                        $scope.view.applicationData.travelApplication.hotelBookingClerkName = $scope.view.selectParicipantNames[index];
                    }
                    $scope.togetherBookerModal.hide();
                },
                selectHotelTogether: function () {
                    $scope.view.travelHotelBookingMaleClerks = angular.copy($scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks);
                    $scope.view.travelHotelBookingFemaleClerks = angular.copy($scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks);
                    $scope.hotelBookerModal.show();
                },
                //选择酒店订票人
                selectHotelBook: function (type, useOID) {
                    if($scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks == '' || !$scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks) {
                        $scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks = [];
                    }
                    if($scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks == '' || !$scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks) {
                        $scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks = [];
                    }
                    if(type == 'female'){
                        var index = $scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks.indexOf(useOID);
                        if(index == -1){
                            if($scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks.length >= $scope.view.hotelRoomData.femaleRoomNumber){
                                PublicFunction.showToast($filter('translate')('custom.application.tip.sex_order_full')); //该性别预订人已选满
                            } else {
                                $scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks.push(useOID);
                                $scope.view.isRandom = false;
                            }
                        } else {
                            $scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks.splice(index, 1);
                            $scope.view.isRandom = false;
                        }
                    } else if(type == 'male'){
                        var index = $scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks.indexOf(useOID);
                        if(index == -1){
                            if($scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks.length >= $scope.view.hotelRoomData.maleRoomNumber){
                                PublicFunction.showToast($filter('translate')('custom.application.tip.sex_order_full')); //该性别预订人已选满
                            } else {
                                $scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks.push(useOID);
                                $scope.view.isRandom = false;
                            }
                        } else {
                            $scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks.splice(index, 1);
                            $scope.view.isRandom = false;
                        }
                    }
                },
                //修改最大机票数量
                changeMaxTicket: function () {
                    var ticketNumber = [];
                    var finish = false;
                    for(var i = $scope.view.ticketMessage.maxTicketNumber; i >= 0; i--){
                        var item = {};
                        item.text = i;
                        ticketNumber.push(item);
                        if(i <= 1){
                            finish = true;
                        }
                    }
                    if(finish){
                        $scope.hideSheet = $ionicActionSheet.show({
                            buttons: ticketNumber,
                            buttonClicked: function (index) {
                                $scope.view.applicationData.travelApplication.maxTicketAmount = parseInt(ticketNumber[index].text);
                                $scope.hideSheet();
                            }
                        });
                    }
                },
                //修改房间数量
                changeRoomNumber: function (index) {
                    var ticketNumber = [];
                    var finish = false;
                    for(var i = $scope.view.hotelRoomData.maxRoomNumber; i > 0; i--){
                        var item = {};
                        item.text = i;
                        ticketNumber.push(item);
                        if(i <= 1){
                            finish = true;
                        }
                    }
                    if(finish){
                        $scope.hideSheet = $ionicActionSheet.show({
                            buttons: ticketNumber,
                            buttonClicked: function (selectIndex) {
                                $scope.view.hotelList[index].roomNumber = parseInt(ticketNumber[selectIndex].text);
                                $scope.hideSheet();
                            }
                        });
                    }
                },
                //选择机票供应商
                selectSupplier: function (type, selectIndex) {
                    if(type == 1001){
                        //机票供应商
                        if($scope.view.fightSupplier.length > 1){
                            $scope.hideSheet = $ionicActionSheet.show({
                                buttons: $scope.view.fightSupplierSelect,
                                titleText: $filter('translate')('supplier_tpl.Please.select.a.supplier.new'),//请选择供应商
                                buttonClicked: function (index) {
                                    if($scope.view.flightList[selectIndex].supplierOID != $scope.view.fightSupplier[index].supplierOID){
                                        $scope.view.flightList[selectIndex].supplierName = $scope.view.fightSupplier[index].name;
                                        $scope.view.flightList[selectIndex].supplierOID = $scope.view.fightSupplier[index].supplierOID;
                                        $scope.view.flightList[selectIndex].supplierIconUrl = $scope.view.fightSupplier[index].vendorIcon.iconPath;
                                        $scope.view.flightList[selectIndex].serviceName = $scope.view.fightSupplier[index].serviceName;
                                        $scope.hideSheet();
                                        if($scope.view.flightList[selectIndex].fromCityCode){
                                            CustomApplicationServices.isCityInVendor($scope.view.flightList[selectIndex].serviceName, $scope.view.flightList[selectIndex].fromCityCode, $sessionStorage.lang)
                                                .success(function (data) {
                                                    if(data && data.alias){

                                                    } else {
                                                        $scope.view.flightList[selectIndex].fromCity = null;
                                                        $scope.view.flightList[selectIndex].fromCityCode = null;
                                                    }
                                                })
                                                .error(function () {
                                                    $scope.view.flightList[selectIndex].fromCity = null;
                                                    $scope.view.flightList[selectIndex].fromCityCode = null;
                                                })
                                        }
                                        if($scope.view.flightList[selectIndex].toCityCode){
                                            CustomApplicationServices.isCityInVendor($scope.view.flightList[selectIndex].serviceName, $scope.view.flightList[selectIndex].toCityCode, $sessionStorage.lang)
                                                .success(function (data) {
                                                    if(data && data.alias){

                                                    } else {
                                                        $scope.view.flightList[selectIndex].toCity = null;
                                                        $scope.view.flightList[selectIndex].toCityCode = null;
                                                    }
                                                })
                                                .error(function () {
                                                    $scope.view.flightList[selectIndex].toCity = null;
                                                    $scope.view.flightList[selectIndex].toCityCode = null;
                                                })
                                        }
                                    }
                                }
                            });
                        }
                    } else if(type == 1002){
                        //火车供应商
                        if($scope.view.trainSupplier.length > 1){
                            $scope.hideSheet = $ionicActionSheet.show({
                                buttons: $scope.view.trainSupplierSelect,
                                titleText: $filter('translate')('supplier_tpl.Please.select.a.supplier.new'),//请选择供应商
                                buttonClicked: function (index) {
                                    if($scope.view.trainList[selectIndex].supplierOID != $scope.view.trainSupplier[index].supplierOID){
                                        $scope.view.trainList[selectIndex].supplierName = $scope.view.trainSupplier[index].name;
                                        $scope.view.trainList[selectIndex].supplierOID = $scope.view.trainSupplier[index].supplierOID;
                                        $scope.view.trainList[selectIndex].supplierIconUrl = $scope.view.trainSupplier[index].vendorIcon.iconPath;
                                        $scope.view.trainList[selectIndex].serviceName = $scope.view.trainSupplier[index].serviceName;
                                        $scope.hideSheet();
                                        if($scope.view.trainList[selectIndex].fromCityCode){
                                            CustomApplicationServices.isCityInVendor($scope.view.trainList[selectIndex].serviceName, $scope.view.trainList[selectIndex].fromCityCode, $sessionStorage.lang)
                                                .success(function (data) {
                                                    if(data && data.alias){

                                                    } else {
                                                        $scope.view.trainList[selectIndex].fromCity = null;
                                                        $scope.view.trainList[selectIndex].fromCityCode = null;
                                                    }
                                                })
                                                .error(function () {
                                                    $scope.view.trainList[selectIndex].fromCity = null;
                                                    $scope.view.trainList[selectIndex].fromCityCode = null;
                                                })
                                        }
                                        if($scope.view.trainList[selectIndex].toCityCode){
                                            CustomApplicationServices.isCityInVendor($scope.view.trainList[selectIndex].serviceName, $scope.view.trainList[selectIndex].toCityCode, $sessionStorage.lang)
                                                .success(function (data) {
                                                    if(data && data.alias){

                                                    } else {
                                                        $scope.view.trainList[selectIndex].toCity = null;
                                                        $scope.view.trainList[selectIndex].toCityCode = null;
                                                    }
                                                })
                                                .error(function () {
                                                    $scope.view.trainList[selectIndex].toCity = null;
                                                    $scope.view.trainList[selectIndex].toCityCode = null;
                                                })
                                        }
                                    }
                                }
                            });
                        }
                    } else if(type == 1003){
                        //酒店供应商
                        if($scope.view.hotelSupplier.length > 1){
                            $scope.hideSheet = $ionicActionSheet.show({
                                buttons: $scope.view.hotelSupplierSelect,
                                titleText: $filter('translate')('supplier_tpl.Please.select.a.supplier.new'),//请选择供应商
                                buttonClicked: function (index) {
                                    if($scope.view.hotelList[selectIndex].supplierOID != $scope.view.hotelSupplier[index].supplierOID){
                                        $scope.view.hotelList[selectIndex].supplierName = $scope.view.hotelSupplier[index].name;
                                        $scope.view.hotelList[selectIndex].supplierOID = $scope.view.hotelSupplier[index].supplierOID;
                                        $scope.view.hotelList[selectIndex].serviceName = $scope.view.hotelSupplier[index].serviceName;
                                        $scope.view.hotelList[selectIndex].supplierIconUrl = $scope.view.hotelSupplier[index].vendorIcon.iconPath;
                                        $scope.hideSheet();
                                        if($scope.view.hotelList[selectIndex].cityCode){
                                            CustomApplicationServices.isCityInVendor($scope.view.hotelList[selectIndex].serviceName, $scope.view.hotelList[selectIndex].cityCode, $sessionStorage.lang)
                                                .success(function (data) {
                                                    if(data && data.alias){

                                                    } else {
                                                        $scope.view.hotelList[selectIndex].cityName = null;
                                                        $scope.view.hotelList[selectIndex].cityCode = null;
                                                    }
                                                })
                                                .error(function () {
                                                    $scope.view.hotelList[selectIndex].cityName = null;
                                                    $scope.view.hotelList[selectIndex].cityCode = null;
                                                })

                                        }
                                    }
                                }
                            });
                        }
                    }

                },
                //选择火车的出发时间 和 到达时间
                selectTrainDate: function (string, index) {
                    var date = null;
                    if (string === 'startDate' && $scope.view.trainList[index].startDate) {
                        date = new Date($scope.view.trainList[index].startDate).Format('yyyy-MM-dd');
                    } else if (string === 'endDate' && $scope.view.trainList[index].endDate) {
                        date = new Date($scope.view.trainList[index].endDate).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if(ionic.Platform.isAndroid()){
                                $scope.result = new Date(response);
                            } else {
                                $scope.result = new Date(response.result);
                            }
                            if (string === 'startDate') {
                                $scope.view.trainList[index].startDate = $scope.result;
                            } else if (string === 'endDate') {
                                $scope.view.trainList[index].endDate = $scope.result;
                            }
                            $scope.$apply();
                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };

                    if (ionic.Platform.isWebView()) {
                        var startTime = '-';
                        var endTime = '-';
                        if($scope.view.startDate){
                            startTime = new Date($scope.view.startDate).Format('yyyy-MM-dd');
                        }
                        if($scope.view.endDate) {
                            endTime = new Date($scope.view.endDate).Format('yyyy-MM-dd');
                        }
                        if(string === 'startDate' && $scope.view.trainList[index].endDate){
                            endTime = new Date($scope.view.trainList[index].endDate).Format('yyyy-MM-dd');
                        }
                        if(string === 'endDate' && $scope.view.trainList[index].startDate){
                            startTime = new Date($scope.view.trainList[index].startDate).Format('yyyy-MM-dd');
                        }
                        var banPick = {};
                        if(date){
                            banPick = { "startTime": startTime, "endTime": endTime, "dates":[], "selectedDate": date};
                        } else {
                            banPick = {"startTime": startTime, "endTime": endTime, "dates":[]};
                        }
                        if($sessionStorage.lang != 'zh_cn'){
                            banPick.language = "en";
                        }
                        HmsCalendar.openCalendar(success, error, 2, banPick);
                    }
                },
                //选择差补时间
                selectTravelAllowanceDate: function (string, index) {
                    var date = null;
                    if (string === 'startDate' && $scope.view.subsidiesList[index].startDate) {
                        date = new Date($scope.view.subsidiesList[index].startDate).Format('yyyy-MM-dd');
                    } else if (string === 'endDate' && $scope.view.subsidiesList[index].endDate) {
                        date = new Date($scope.view.subsidiesList[index].endDate).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if(ionic.Platform.isAndroid()){
                                $scope.result = new Date(response);
                            } else {
                                $scope.result = new Date(response.result);
                            }
                            if (string === 'startDate') {
                                $scope.view.subsidiesList[index].startDate = $scope.result;
                            } else if (string === 'endDate') {
                                $scope.view.subsidiesList[index].endDate = $scope.result;
                            }
                            $scope.$apply();
                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };
                    if (ionic.Platform.isWebView()) {
                        var startTime = '-';
                        var endTime = '-';
                        if($scope.view.startDate){
                            startTime = new Date($scope.view.startDate).Format('yyyy-MM-dd');
                        }
                        if($scope.view.endDate) {
                            endTime = new Date($scope.view.endDate).Format('yyyy-MM-dd');
                        }
                        if(string === 'startDate' && $scope.view.subsidiesList[index].endDate){
                            endTime = new Date($scope.view.subsidiesList[index].endDate).Format('yyyy-MM-dd');
                        }
                        if(string === 'endDate' && $scope.view.subsidiesList[index].startDate){
                            startTime = new Date($scope.view.subsidiesList[index].startDate).Format('yyyy-MM-dd');
                        }
                        var banPick = {};
                        if(date){
                            banPick = {"startTime": startTime, "endTime": endTime, "dates":[], "selectedDate": date };
                        } else {
                            banPick = {"startTime": startTime, "endTime": endTime, "dates":[]};
                        }
                        HmsCalendar.openCalendar(success, error, 2, banPick);
                    }
                },
                //选择机票的出发时间 和 到达时间
                selectFlightDate: function (string, index) {
                    var date = null;
                    if (string === 'startDate' && $scope.view.flightList[index].startDate) {
                        date = new Date($scope.view.flightList[index].startDate).Format('yyyy-MM-dd');
                    } else if (string === 'endDate' && $scope.view.flightList[index].endDate) {
                        date = new Date($scope.view.flightList[index].endDate).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if(ionic.Platform.isAndroid()){
                                $scope.result = new Date(response);
                            } else {
                                $scope.result = new Date(response.result);
                            }
                            if (string === 'startDate') {
                                $scope.view.flightList[index].startDate = $scope.result;
                            } else if (string === 'endDate') {
                                $scope.view.flightList[index].endDate = $scope.result;
                            }
                            $scope.$apply();
                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };

                    if (ionic.Platform.isWebView()) {
                        var startTime = '-';
                        var endTime = '-';
                        if($scope.view.startDate){
                            startTime = new Date($scope.view.startDate).Format('yyyy-MM-dd');
                        }
                        if($scope.view.endDate) {
                            endTime = new Date($scope.view.endDate).Format('yyyy-MM-dd');
                        }
                        if(string === 'startDate' && $scope.view.flightList[index].endDate){
                            endTime = new Date($scope.view.flightList[index].endDate).Format('yyyy-MM-dd');
                        }
                        if(string === 'endDate' && $scope.view.flightList[index].startDate){
                            startTime = new Date($scope.view.flightList[index].startDate).Format('yyyy-MM-dd');
                        }
                        var banPick = {};
                        if(date){
                            banPick = {"startTime": startTime, "endTime": endTime, "dates":[], "selectedDate": date};
                        } else {
                            banPick = {"startTime": startTime, "endTime": endTime, "dates":[]};
                        }
                        HmsCalendar.openCalendar(success, error, 2, banPick);
                    }
                },
                //选择酒店的入住日期和 离店日期
                selectHotelDate: function (string, index) {
                    var date = null;
                    if (string === 'fromDate' && $scope.view.hotelList[index].fromDate) {
                        date = new Date($scope.view.hotelList[index].fromDate).Format('yyyy-MM-dd');
                    } else if (string === 'leaveDate' && $scope.view.hotelList[index].leaveDate) {
                        date = new Date($scope.view.hotelList[index].leaveDate).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if(ionic.Platform.isAndroid()){
                                $scope.result = new Date(response);
                            } else {
                                $scope.result = new Date(response.result);
                            }
                            if (string === 'fromDate') {
                                $scope.view.hotelList[index].fromDate = $scope.result;
                                if($scope.view.hotelList[index].fromDate && $scope.view.hotelList[index].leaveDate){
                                    $scope.view.hotelList[index].day = $scope.view.getDiffDay($scope.view.hotelList[index].fromDate, $scope.view.hotelList[index].leaveDate) +1;
                                    var date = new Date($scope.view.hotelList[index].fromDate);
                                    $scope.view.hotelList[index].selectDay = [];
                                    for(var i = 0; i < ($scope.view.hotelList[index].day -1); i++){
                                        date = new Date(new Date(date).setDate(new Date(date).getDate() + i)).Format('yyyy-MM-dd');
                                        $scope.view.hotelList[index].selectDay.push(date);
                                    }
                                }

                            } else if (string === 'leaveDate') {
                                $scope.view.hotelList[index].leaveDate = $scope.result;
                                if($scope.view.hotelList[index].fromDate && $scope.view.hotelList[index].leaveDate){
                                    $scope.view.hotelList[index].day = $scope.view.getDiffDay($scope.view.hotelList[index].fromDate, $scope.view.hotelList[index].leaveDate) +1;
                                    var date = new Date($scope.view.hotelList[index].fromDate);
                                    $scope.view.hotelList[index].selectDay = [];
                                    for(var i = 0; i < ($scope.view.hotelList[index].day - 1); i++){
                                        date = new Date(new Date(date).setDate(new Date(date).getDate() + i)).Format('yyyy-MM-dd');
                                        $scope.view.hotelList[index].selectDay.push(date);
                                    }
                                }

                            }
                            $scope.$apply();
                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };

                    if (ionic.Platform.isWebView()) {
                        var startTime = '-';
                        var endTime = '-';
                        //计算酒店的开始日期
                        if(!$scope.view.hotelStartDate && $scope.view.startDate){
                            var startDate = angular.copy($scope.view.startDate);
                            if($scope.view.hotelProfile && $scope.view.hotelProfile.fromDate && $scope.view.hotelProfile.fromDate.floatDays
                                && Math.floor($scope.view.hotelProfile.fromDate.floatDays) == $scope.view.hotelProfile.fromDate.floatDays){
                                $scope.view.hotelStartDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() - parseInt($scope.view.hotelProfile.fromDate.floatDays))).Format('yyyy-MM-dd');
                            } else {
                                $scope.view.hotelStartDate = startDate;
                            }
                        }
                        if(!$scope.view.hotelEndDate && $scope.view.endDate){
                            var endDate = angular.copy($scope.view.endDate);
                            if($scope.view.hotelProfile && $scope.view.hotelProfile.leaveDate && $scope.view.hotelProfile.leaveDate.floatDays
                                && Math.floor($scope.view.hotelProfile.leaveDate.floatDays) == $scope.view.hotelProfile.leaveDate.floatDays){
                                $scope.view.hotelEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + parseInt($scope.view.hotelProfile.leaveDate.floatDays))).Format('yyyy-MM-dd');
                            } else {
                                $scope.view.hotelEndDate = endDate;
                            }
                        }
                        if($scope.view.hotelStartDate){
                            startTime = new Date($scope.view.hotelStartDate).Format('yyyy-MM-dd');
                        }
                        if($scope.view.hotelEndDate) {
                            endTime = new Date($scope.view.hotelEndDate).Format('yyyy-MM-dd');
                        }
                        var banPick = {};
                        if(date){
                            banPick = {"startTime": startTime, "endTime": endTime, "dates": $scope.view.selectedHotel, "selectedDate": date};
                        } else {
                            banPick = {"startTime": startTime, "endTime": endTime, "dates": $scope.view.selectedHotel};
                        }
                        HmsCalendar.openCalendar(success, error, 2, banPick);
                    }
                },
                //切换出发地和目的地
                changeFlightCity: function (type, index) {
                    if(type == 1001){
                        //飞机
                        var city = $scope.view.flightList[index].fromCity;
                        var code = $scope.view.flightList[index].fromCityCode;
                        $scope.view.flightList[index].fromCity = $scope.view.flightList[index].toCity;
                        $scope.view.flightList[index].fromCityCode = $scope.view.flightList[index].toCityCode;
                        $scope.view.flightList[index].toCity = city;
                        $scope.view.flightList[index].toCityCode = code;
                    } else if(type == 1002){
                        //火车
                        var city = $scope.view.trainList[index].fromCity;
                        var code = $scope.view.trainList[index].fromCityCode;
                        $scope.view.trainList[index].fromCity = $scope.view.trainList[index].toCity;
                        $scope.view.trainList[index].fromCityCode = $scope.view.trainList[index].toCityCode;
                        $scope.view.trainList[index].toCity = city;
                        $scope.view.trainList[index].toCityCode = code;
                    } else if(type == 1003){
                        //其他
                        var city = $scope.view.otherTrafficList[index].fromCity;
                        $scope.view.otherTrafficList[index].fromCity = $scope.view.otherTrafficList[index].toCity;
                        $scope.view.otherTrafficList[index].toCity = city;
                    }

                },
                //修改机票类型（1001单程， 1002往返）
                changeItineraryType: function (type, index) {
                    if(type != $scope.view.flightList[index].itineraryType){
                        $scope.view.flightList[index].itineraryType = type;
                    }
                },
                //修改火车类型（1001单程， 1002往返）
                changeTrainType: function (type, index) {
                    if(type != $scope.view.trainList[index].itineraryType){
                        $scope.view.trainList[index].itineraryType = type;
                    }
                },
                //修改其他类型（1001单程， 1002往返）
                changeOtherType: function (type, index) {
                    if(type != $scope.view.otherTrafficList[index].itineraryType){
                        $scope.view.otherTrafficList[index].itineraryType = type;
                    }
                },
                //选中的行程
                selectItinerary: function (index) {
                    $scope.view.selectItineraryIndex = index;
                    if($scope.view.remarkItineraryList[index].itineraryList == null || $scope.view.remarkItineraryList[index].itineraryList == '' || $scope.view.remarkItineraryList[index].itineraryList.length == 0){
                        CustomApplicationServices.getItineraryDetail($stateParams.applicationOID, $scope.view.remarkItineraryList[index].remarkDate)
                            .success(function (data) {
                                $scope.view.remarkItineraryList[index].itineraryList = data;
                        })
                    }
                },
                //清空备注
                clearRemark: function (index) {
                    $scope.view.remarkItineraryList[index].remark = null;
                },
                //选择机票折扣
                selectFilghtDiscount: function (selectIndex) {
                    $scope.discountSheet = $ionicActionSheet.show({
                        buttons: $scope.view.fightDiscountList,
                        titleText: $filter('translate')('custom.application.tip.select_discount'), //请选择折扣
                        cssClass: 'currency-sheet',
                        buttonClicked: function (index, $event) {
                            if(index == 0){
                                $scope.view.flightList[selectIndex].discount = 0;
                            } else {
                                $scope.view.flightList[selectIndex].discount = $scope.view.fightDiscountList[index].text;
                            }
                            $scope.discountSheet();
                            $event.stopPropagation();
                        }
                    });
                },
                //选择其他交通方式的日期
                selectOtherDate: function (string, index) {
                    var date = null;
                    if (string === 'startDate' && $scope.view.otherTrafficList[index].startDate) {
                        date = new Date($scope.view.otherTrafficList[index].startDate).Format('yyyy-MM-dd');
                    } else if (string === 'endDate' && $scope.view.otherTrafficList[index].endDate) {
                        date = new Date($scope.view.otherTrafficList[index].endDate).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if(ionic.Platform.isAndroid()){
                                $scope.result = new Date(response);
                            } else {
                                $scope.result = new Date(response.result);
                            }
                            if (string === 'startDate') {
                                $scope.view.otherTrafficList[index].startDate = $scope.result;
                            } else if (string === 'endDate') {
                                $scope.view.otherTrafficList[index].endDate = $scope.result;
                            }
                            $scope.$apply();
                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };

                    if (ionic.Platform.isWebView()) {
                        var startTime = '-';
                        var endTime = '-';
                        if($scope.view.startDate){
                            startTime = new Date($scope.view.startDate).Format('yyyy-MM-dd');
                        }
                        if($scope.view.endDate) {
                            endTime = new Date($scope.view.endDate).Format('yyyy-MM-dd');
                        }
                        if(string === 'startDate' && $scope.view.otherTrafficList[index].endDate){
                            endTime = new Date($scope.view.otherTrafficList[index].endDate).Format('yyyy-MM-dd');
                        }
                        if(string === 'endDate' && $scope.view.otherTrafficList[index].startDate){
                            startTime = new Date($scope.view.otherTrafficList[index].startDate).Format('yyyy-MM-dd');
                        }
                        var banPick = {};
                        if(date){
                            banPick = {"startTime": startTime, "endTime": endTime, "dates":[], "selectedDate":  date};
                        } else {
                            banPick = {"startTime": startTime, "endTime": endTime, "dates":[]};
                        }
                        HmsCalendar.openCalendar(success, error, 2, banPick);
                    }
                },
                //选择舱位
                selectFilghtSeatClass: function (selectIndex) {
                    $scope.seatClassSheet = $ionicActionSheet.show({
                        buttons: $scope.view.seatClassList,
                        titleText: $filter('translate')('custom.application.tip.select_class'), //请选择舱位
                        cssClass: 'currency-sheet',
                        buttonClicked: function (index, $event) {
                            if(index == 0){
                                $scope.view.flightList[selectIndex].seatClass = 0;
                            } else {
                                $scope.view.flightList[selectIndex].seatClass = $scope.view.seatClassList[index].text;
                            }
                            $scope.seatClassSheet();
                            $event.stopPropagation();
                        }
                    });
                },
                //校验飞机行程的时间
                validateFlightDate: function (index) {
                    if($scope.view.flightList[index].startDate){
                        $scope.view.flightList[index].startDate = new Date($scope.view.flightList[index].startDate).Format('yyyy-MM-dd');
                    }
                    if($scope.view.flightList[index].endDate){
                        $scope.view.flightList[index].endDate = new Date($scope.view.flightList[index].endDate).Format('yyyy-MM-dd');
                    }
                    if($scope.view.flightList[index].itineraryType == 1001){
                        if($scope.view.applicationData.customFormProperties && $scope.view.applicationData.customFormProperties.controlFields && $scope.view.applicationData.customFormProperties.controlFields.departBeginDate
                            && $scope.view.applicationData.customFormProperties.controlFields.departBeginDate.required && !$scope.view.flightList[index].startDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index + 1) + $filter('translate')('custom.application.tip.departure_time')); //'请输入行程' + (index + 1) + '的出发时间'
                            return false;
                        } else if(Date.parse($scope.view.flightList[index].startDate && $scope.view.flightList[index].startDate) > Date.parse($scope.view.endDate) || Date.parse($scope.view.flightList[index].startDate) < Date.parse($scope.view.startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.departure_time_error')); //'行程' + (index + 1) + '的出发时间不在出差时间段'
                            return false;
                        } else {
                            return true;
                        }
                    } else if($scope.view.flightList[index].itineraryType == 1002){
                        if($scope.view.applicationData.customFormProperties && $scope.view.applicationData.customFormProperties.controlFields && $scope.view.applicationData.customFormProperties.controlFields.departBeginDate
                            && $scope.view.applicationData.customFormProperties.controlFields.departBeginDate.required && !$scope.view.flightList[index].startDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index +1) + $filter('translate')('custom.application.tip.departure_time')); //'请输入行程' + (index +1) + '的出发时间'
                            return false;
                        } else if($scope.view.applicationData.customFormProperties && $scope.view.applicationData.customFormProperties.controlFields && $scope.view.applicationData.customFormProperties.controlFields.returnEndDate
                            && $scope.view.applicationData.customFormProperties.controlFields.returnEndDate.required && !$scope.view.flightList[index].endDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index + 1) + $filter('translate')('custom.application.tip.arrival_time')); //'请输入行程' + (index + 1) + '的到达时间'
                            return false;
                        } else if($scope.view.flightList[index].startDate && $scope.view.flightList[index].endDate && (Date.parse($scope.view.flightList[index].startDate) > Date.parse($scope.view.endDate) || Date.parse($scope.view.flightList[index].startDate) < Date.parse($scope.view.startDate))){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.departure_time_error')); //'行程' + (index + 1) + '的出发时间不在出差时间段'
                            return false;
                        } else if($scope.view.endDate && (Date.parse($scope.view.flightList[index].endDate) > Date.parse($scope.view.endDate) || Date.parse($scope.view.flightList[index].endDate) < Date.parse($scope.view.startDate))){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.arrival_time_error')); //'行程' + (index + 1) + '的到达时间不在出差时间段'
                            return false;
                        } else if($scope.view.flightList[index].startDate && $scope.view.flightList[index].endDate && Date.parse($scope.view.flightList[index].endDate) < Date.parse($scope.view.flightList[index].startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.arrival_late_departure')); //'行程' + (index + 1) + '的出发时间不能晚于到达时间'
                            return false;
                        }  else {
                            return true;
                        }
                    }
                },
                validateFlightPrice: function (index) {
                    var pattMoney = /^(\d+(\.\d{0,2})?)$/g;
                    if($scope.view.flightList[index].ticketPrice != null && $scope.view.flightList[index].ticketPrice != ''){
                        var number = ($scope.view.flightList[index].ticketPrice.toString().split('.'));
                        var validDate = pattMoney.test($scope.view.flightList[index].ticketPrice);
                        if(number[1] && number[1].length > 2){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.price_keep_two_decimal')); //'行程' + (index + 1) + '的价格最多保留两位小数'
                            return false;
                        } else if (!validDate || $scope.view.flightList[index].ticketPrice < 0) {
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.price_wrongful')); //'行程' + (index + 1) + '的价格不合法'
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                },
                //校验飞机行程的配置字段
                validateFlightProfile: function (index) {
                    if($scope.view.flightList[index].supplierOID == $scope.view.ctripFlightOID){
                        var profileData = $scope.view.applicationData.customFormProperties.controlFields;
                        if( profileData && profileData.takeOffBeginTime && profileData.takeOffBeginTime.required && !$scope.view.flightList[index].takeOffBeginTime){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_select_start_period')); //'请选择起飞时间段'
                            return false;
                        } else if(profileData &&  profileData.takeOffEndTime && profileData.takeOffEndTime.required && !$scope.view.flightList[index].takeOffEndTime && $scope.view.flightList[index].itineraryType == 1002){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_select_start_period')); //'请选择起飞时间段'
                            return false;
                        }
                        // else if(($scope.view.flightList[index].ticketPrice == null || $scope.view.flightList[index].ticketPrice == '') &&  profileData && profileData.takeOffEndTime && profileData.takeOffEndTime.required){
                        //     PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index + 1)+ $filter('translate')('custom.application.tip.price')); //'请输入行程' + (index + 1)+ '的价格'
                        //     return false;
                        // }
                        else if(!$scope.view.validateFlightPrice(index)){
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                },
                validateFlightItinerary: function () {
                    var hasFinish = false;
                    var defer = $q.defer();
                    var i = 0
                    if($scope.view.flightList.length > 0){
                        while(i < $scope.view.flightList.length){
                            // if(!$scope.view.flightList[i].supplierOID){
                            //     PublicFunction.showToast('请选择行程的' + (i +1) + '的供应商');  //'请选择行程' + (i +1) + '的供应商'
                            //     defer.reject(false);
                            //     return defer.promise;
                            // }
                            if($scope.view.applicationData.customFormProperties && $scope.view.applicationData.customFormProperties.controlFields && $scope.view.applicationData.customFormProperties.controlFields.fromCities
                                && $scope.view.applicationData.customFormProperties.controlFields.fromCities.required && !$scope.view.flightList[i].fromCity){
                                PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (i +1) + $filter('translate')('custom.application.tip.start_place'));  //'请输入行程' + (i +1) + '的出发地'
                                defer.reject(false);
                                return defer.promise;
                            } else if($scope.view.applicationData.customFormProperties && $scope.view.applicationData.customFormProperties.controlFields && $scope.view.applicationData.customFormProperties.controlFields.toCities
                                && $scope.view.applicationData.customFormProperties.controlFields.toCities.required && !$scope.view.flightList[i].toCity){
                                PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (i +1) + $filter('translate')('custom.application.tip.end_place'));  //'请输入行程' + (i +1) + '的目的地'
                                defer.reject(false);
                                return defer.promise;
                            } else if($scope.view.flightList[i].fromCity && $scope.view.flightList[i].toCity && $scope.view.flightList[i].fromCity == $scope.view.flightList[i].toCity){
                                PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (i +1) + $filter('translate')('custom.application.tip.departure_arrival_same'));  //'行程' + (i +1) + '的出发地和目的地不能相同'
                                defer.reject(false);
                                return defer.promise;
                            } else if(!$scope.view.validateFlightDate(i)){
                                defer.reject(false);
                                return defer.promise;
                            } else if(!$scope.view.validateFlightProfile(i)){
                                defer.reject(false);
                                return defer.promise;
                            } else {
                                i++;
                                if(i == $scope.view.flightList.length){
                                    hasFinish = true;
                                }
                            }
                        }
                    } else {
                        hasFinish = true;
                    }
                    if(hasFinish){
                        defer.resolve(true);
                        return defer.promise;
                    }
                },
                //新建机票行程
                saveFlightItinerary: function () {
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit = true;
                        if($scope.view.flightList.length > 0){
                            $scope.view.validateFlightItinerary()
                                .then(function () {
                                    var i = 0;
                                    var modifyFlightList = [];
                                    var createFlightList = [];
                                    for(; i < $scope.view.flightList.length; i++){
                                        var selectFlight = angular.copy($scope.view.flightList[i]);
                                        if(selectFlight.flightItineraryOID != null && selectFlight.flightItineraryOID != ''){
                                            modifyFlightList.push(selectFlight);
                                        } else {
                                            createFlightList.push(selectFlight);
                                        }
                                    }
                                    if(i == $scope.view.flightList.length){
                                        var hasFinish = -1;
                                        if(modifyFlightList.length > 0){
                                            for(var j = 0; j < modifyFlightList.length; j++){
                                                CustomApplicationServices.modifyFlightItinerary(modifyFlightList[j])
                                                    .success(function (data) {
                                                        hasFinish++;
                                                        if(hasFinish == 1){
                                                            $scope.view.disableSubmit = false;
                                                        }
                                                        $scope.view.showModal = false;
                                                        $scope.ticketModal.hide();
                                                        $scope.view.getAllItineraryDetail();
                                                        PublicFunction.showToast($filter('translate')('custom.application.travel.save'));  //已保存
                                                    })
                                                    .error(function () {
                                                        hasFinish++;
                                                        if(hasFinish == 1){
                                                            $scope.view.disableSubmit = false;
                                                        }
                                                        PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                                    })
                                            }
                                        } else {
                                            hasFinish++;
                                            if(hasFinish == 1){
                                                $scope.view.disableSubmit = false;
                                            }
                                        }
                                        if(createFlightList.length > 0){
                                            CustomApplicationServices.createFlightItinerary($scope.view.applicationData.applicationOID, createFlightList)
                                                .success(function (data) {
                                                    hasFinish++;
                                                    if(hasFinish == 1){
                                                        $scope.view.disableSubmit = false;
                                                    }
                                                    $scope.view.showModal = false;
                                                    $scope.ticketModal.hide();
                                                    $scope.view.getAllItineraryDetail();
                                                    PublicFunction.showToast($filter('translate')('custom.application.travel.create')); //已创建
                                                })
                                                .error(function () {
                                                    hasFinish++;
                                                    if(hasFinish == 1){
                                                        $scope.view.disableSubmit = false;
                                                    }
                                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                                })
                                        } else {
                                            hasFinish++;
                                            if(hasFinish == 1){
                                                $scope.view.disableSubmit = false;
                                            }
                                        }
                                    }

                                }, function () {
                                    $scope.view.disableSubmit = false;
                                })
                        } else {
                            $scope.view.disableSubmit = false;
                            $scope.view.showModal = false;
                            $scope.ticketModal.hide();
                            $scope.view.getAllItineraryDetail();
                        }
                    }
                },
                //选择机票出发时间段
                selectFlightTime: function (index, type) {
                    $scope.view.selectFlightIndex = index;
                    $scope.view.selectFlightType = type;
                    $('#demo').mobiscroll('show');

                },
                saveMoreFlightItinerary: function () {
                    var item = angular.copy($scope.view.flightSelect);
                    $scope.view.flightList.push(item);
                    $ionicScrollDelegate.scrollBottom();
                },

                validateHotelDate: function (index) {
                    //计算酒店的开始日期
                    if(!$scope.view.hotelStartDate && $scope.view.startDate){
                        var startDate = angular.copy($scope.view.startDate);
                        if($scope.view.hotelProfile && $scope.view.hotelProfile.fromDate && $scope.view.hotelProfile.fromDate.floatDays
                            && Math.floor($scope.view.hotelProfile.fromDate.floatDays) == $scope.view.hotelProfile.fromDate.floatDays){
                            $scope.view.hotelStartDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() - parseInt($scope.view.hotelProfile.fromDate.floatDays))).Format('yyyy-MM-dd');
                        } else {
                            $scope.view.hotelStartDate = $scope.view.startDate;
                        }
                    }
                    if(!$scope.view.hotelEndDate && $scope.view.endDate){
                        var endDate = angular.copy($scope.view.endDate);
                        if($scope.view.hotelProfile && $scope.view.hotelProfile.leaveDate && $scope.view.hotelProfile.leaveDate.floatDays
                            && Math.floor($scope.view.hotelProfile.leaveDate.floatDays) == $scope.view.hotelProfile.leaveDate.floatDays){
                            $scope.view.hotelEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + parseInt($scope.view.hotelProfile.leaveDate.floatDays))).Format('yyyy-MM-dd');
                        } else {
                            $scope.view.hotelEndDate = $scope.view.endDate;
                        }
                    }
                    if($scope.view.hotelProfile.fromDate  && !$scope.view.hotelList[index].fromDate){
                        PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index +1) + $filter('translate')('custom.application.tip.from_date')); //'请输入行程' + (index +1) + '的入住日期'
                        return false;
                    } else if($scope.view.hotelProfile.leaveDate && !$scope.view.hotelList[index].leaveDate){
                        PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index + 1) + $filter('translate')('custom.application.tip.leave_date')); //'请输入行程' + (index + 1) + '的离店日期'
                        return false;
                    }  else if($scope.view.hotelList[index].fromDate  && $scope.view.hotelList[index].leaveDate && new Date($scope.view.hotelList[index].fromDate).Format('yyyy-MM-dd') == new Date($scope.view.hotelList[index].leaveDate).Format('yyyy-MM-dd')){
                        PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.from_leave_day_same')); //'行程' + (index + 1) + '的入住日期和离店日期不能为同一天'
                        return false;
                    } else if($scope.view.hotelList[index].fromDate && (Date.parse($scope.view.hotelList[index].fromDate) > Date.parse(new Date($scope.view.hotelEndDate)) || Date.parse($scope.view.hotelList[index].fromDate) < Date.parse(new Date($scope.view.hotelStartDate)))){
                        PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.from_date_error')); //'行程' + (index + 1) + '的入住日期不在出差时间段'
                        return false;
                    } else if($scope.view.hotelList[index].fromDate && (Date.parse($scope.view.hotelList[index].leaveDate) > Date.parse(new Date($scope.view.hotelEndDate)) || Date.parse($scope.view.hotelList[index].leaveDate) < Date.parse(new Date($scope.view.hotelStartDate)))){
                        PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.leave_date_error')); //'行程' + (index + 1) + '的离店日期不在出差时间段'
                        return false;
                    } else if($scope.view.hotelList[index].fromDate && $scope.view.hotelList[index].leaveDate && Date.parse($scope.view.hotelList[index].leaveDate) < Date.parse($scope.view.hotelList[index].fromDate)){
                        PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.leave_early_from')); //'行程' + (index + 1) + '的离店日期不能早于入住日期'
                        return false;
                    }  else {
                        return true;
                    }
                },
                validateMoney: function (money, index) {
                    var pattMoney = /^(\d+(\.\d{0,2})?)$/g;
                    var number = (money.toString().split('.'));
                    var validDate = pattMoney.test(money);
                    if(number[1] && number[1].length > 2){
                        PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.price_keep_two_decimal')); //'行程' + (index + 1) + '的价格最多保留两位小数'
                        return false;
                    } else if (!validDate || $scope.view.flightList[index].ticketPrice < 0) {
                        PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.price_wrongful')); //'行程' + (index + 1) + '的价格不合法'
                        return false;
                    } else {
                        return true;
                    }
                },
                validateHotelProfile: function (index) {
                    var hasFinish = -1;
                    if($scope.view.hotelList[index].minPrice != null && $scope.view.hotelList[index].minPrice != ''){
                        var pattMoney = /^(\d+(\.\d{0,2})?)$/g;
                        var number = ($scope.view.hotelList[index].minPrice.toString().split('.'));
                        var validDate = pattMoney.test($scope.view.hotelList[index].minPrice);
                        if(number[1] && number[1].length > 2){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.min_price_keep_two_decimal')); //'行程' + (index + 1) + '的最低价格最多保留两位小数'
                            return false;
                        } else if (!validDate || $scope.view.hotelList[index].minPrice < 0) {
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.min_price_illegal')); //'行程' + (index + 1) + '的最低价格不合法'
                            return false;
                        } else {
                            hasFinish++;
                            if(hasFinish >= 2){
                                return true;
                            }
                        }
                    } else {
                        hasFinish++;
                        if(hasFinish >= 2){
                            return true;
                        }
                    }
                    if($scope.view.hotelList[index].maxPrice != null && $scope.view.hotelList[index].maxPrice != ''){
                        var pattMax = /^(\d+(\.\d{0,2})?)$/g;
                        var maxMoney = ($scope.view.hotelList[index].maxPrice.toString().split('.'));
                        var validMax = pattMax.test($scope.view.hotelList[index].maxPrice);
                        if(maxMoney[1] && maxMoney[1].length > 2){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.max_price_keep_two_decimal')); //'行程' + (index + 1) + '的最高价格最多保留两位小数'
                            return false;
                        } else if (!validMax || $scope.view.hotelList[index].maxPrice < 0) {
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.max_price_illegal')); //'行程' + (index + 1) + '的最高价格不合法'
                            return false;
                        } else {
                            hasFinish++;
                            if(hasFinish >= 2){
                                return true;
                            }
                        }
                    } else {
                        hasFinish++;
                        if(hasFinish >= 2){
                            return true;
                        }
                    }

                    if($scope.view.hotelProfile.maxPrice && $scope.view.hotelProfile.maxPrice.enable &&
                        $scope.view.hotelProfile.minPrice && $scope.view.hotelProfile.minPrice.enable &&
                        $scope.view.hotelList[index].minPrice && $scope.view.hotelList[index].maxPrice ){
                        if(parseFloat($scope.view.hotelList[index].minPrice )- parseFloat($scope.view.hotelList[index].maxPrice) > 0){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index +1) + $filter('translate')('custom.application.tip.max_price_less_min_price'));  //'行程' + (i +1) + '的最高价格不能低于最低价格'
                            return false;
                        } else {
                            hasFinish++;
                            if(hasFinish >= 2){
                                return true;
                            }
                        }
                    } else {
                        hasFinish++;
                        if(hasFinish >= 2){
                            return true;
                        }
                    }
                },
                //校验酒店日期是否有重复
                validateHotelSelectDay: function (index) {
                    var hasFinish = false;
                    if($scope.view.hotelList[index].selectDay && $scope.view.hotelList[index].selectDay.length > 0){
                        for(var i = 0; i < $scope.view.hotelList[index].selectDay.length; i++){
                            if($scope.view.selectedHotelCopy.indexOf($scope.view.hotelList[index].selectDay[i]) > -1){
                                PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index +1) + $filter('translate')('custom.application.tip.de') + $scope.view.hotelList[index].selectDay[i] + $filter('translate')('custom.application.tip.has_order_hotel')); //的   的酒店已预定
                                return false;
                            }
                            if(i >= ($scope.view.hotelList[index].selectDay.length -1)){
                                $scope.view.selectedHotelCopy = $scope.view.selectedHotelCopy.concat($scope.view.hotelList[index].selectDay).unique();
                                hasFinish = true;
                                return hasFinish;
                            }
                        }
                    } else {
                        hasFinish = true;
                        return hasFinish;
                    }
                },
                //校验酒店行程
                validateHotelItinerary: function () {
                    var defer = $q.defer();
                    var hasFinish = false;
                    if($scope.view.hotelList.length > 0){
                        var i = 0;
                        $scope.view.selectedHotelCopy = angular.copy($scope.view.selectedHotel);
                        while(i < $scope.view.hotelList.length){
                            if(!$scope.view.hotelList[i].cityName && $scope.view.hotelProfile.city && $scope.view.hotelProfile.city.enable){
                                PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (i +1) + $filter('translate')('custom.application.tip.stay_city'));  //'请输入行程' + (i +1) + '的入住城市'
                                defer.reject(false);
                                return defer.promise;
                            } else if(!$scope.view.validateHotelDate(i)){
                                defer.reject(false);
                                return defer.promise;
                            }  else if(!$scope.view.validateHotelProfile(i)){
                                defer.reject(false);
                                return defer.promise;
                            } else if(!$scope.view.validateHotelSelectDay(i)){
                                defer.reject(false);
                                return defer.promise;
                            } else {
                                i++;
                                if(i == $scope.view.hotelList.length){
                                    hasFinish = true;
                                }
                            }
                            // else if($scope.view.hotelList[i].roomNumber && parseInt($scope.view.hotelList[i].roomNumber) == $scope.view.hotelList[i].roomNumber && $scope.view.hotelList[i].roomNumber > $scope.view.hotelRoomData.maxRoomNumber) {
                            //     PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (i +1) + $filter('translate')('custom.application.tip.more_than_max_room'));  //'行程' + (i +1) + '的房间数量超出申请单的最大房间数量'
                            //     defer.reject(false);
                            //     return defer.promise;
                            // }

                        }
                    } else {
                        hasFinish = true;
                    }
                    if(hasFinish){
                        defer.resolve(true);
                        return defer.promise;
                    }
                },
                //新建酒店行程
                saveHotelItinerary: function () {
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit = true;
                        if($scope.view.hotelList.length > 0){
                            $scope.view.validateHotelItinerary()
                                .then(function () {
                                    var i = 0;
                                    var modifyHotelList = [];
                                    var createHotelList = [];
                                    for(; i < $scope.view.hotelList.length; i++){
                                        var selectHotel = angular.copy($scope.view.hotelList[i]);
                                        if(selectHotel.hotelItineraryOID != null && selectHotel.hotelItineraryOID != ''){
                                            modifyHotelList.push(selectHotel);
                                        } else {
                                            createHotelList.push(selectHotel);
                                        }
                                    }
                                    //如果没有城市字段的配置，要把之前酒店行程中的城市置空
                                    if (!$scope.view.hotelProfile.city || !$scope.view.hotelProfile.city.enable) {
                                        angular.forEach(modifyHotelList, function (hotelItinerary) {
                                            hotelItinerary.cityCode = null;
                                            hotelItinerary.cityName = null;
                                        });
                                    }
                                    if(i == $scope.view.hotelList.length){
                                        var finish = -1;
                                        if(modifyHotelList.length > 0){
                                            for(var j = 0; j < modifyHotelList.length; j++){
                                                CustomApplicationServices.modifyHotelItinerary(modifyHotelList[j])
                                                    .success(function (data) {
                                                        $scope.view.showModal = false;
                                                        $scope.hotelModal.hide();
                                                        $scope.view.getAllItineraryDetail();
                                                        PublicFunction.showToast($filter('translate')('custom.application.travel.save'));  //已保存
                                                        finish++;
                                                        if(finish >= 1){
                                                            $scope.view.selectedHotel = angular.copy($scope.view.selectedHotelCopy);
                                                            $scope.view.disableSubmit = false;
                                                        }
                                                    })
                                                    .error(function () {
                                                        PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                                        finish++;
                                                        if(finish >= 1){
                                                            $scope.view.disableSubmit = false;
                                                        }
                                                    })
                                            }
                                        } else {
                                            finish++;
                                            if(finish >= 1){
                                                $scope.view.selectedHotel = angular.copy($scope.view.selectedHotelCopy);
                                                $scope.view.disableSubmit = false;
                                            }
                                        }
                                        if(createHotelList.length > 0){
                                            CustomApplicationServices.createHotelItinerary($scope.view.applicationData.applicationOID, createHotelList)
                                                .success(function (data) {
                                                    $scope.view.showModal = false;
                                                    $scope.view.selectedHotel = angular.copy($scope.view.selectedHotelCopy);
                                                    $scope.hotelModal.hide();
                                                    $scope.view.getAllItineraryDetail();
                                                    PublicFunction.showToast($filter('translate')('custom.application.travel.create')); //已创建
                                                    finish++;
                                                    if(finish >= 1){
                                                        $scope.view.selectedHotel = angular.copy($scope.view.selectedHotelCopy);
                                                        $scope.view.disableSubmit = false;
                                                    }
                                                })
                                                .error(function () {
                                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                                    finish++;
                                                    if(finish >= 1){
                                                        $scope.view.disableSubmit = false;
                                                    }
                                                })
                                        } else {
                                            finish++;
                                            if(finish >= 1){
                                                $scope.view.selectedHotel = angular.copy($scope.view.selectedHotelCopy);
                                                $scope.view.disableSubmit = false;
                                            }
                                        }
                                    }

                                }, function () {
                                    $scope.view.disableSubmit = false;
                                })
                        } else {
                            $scope.view.showModal = false;
                            $scope.hotelModal.hide();
                            $scope.view.getAllItineraryDetail();
                            $scope.view.disableSubmit = false;
                        }

                    }
                },
                saveMoreHotelItinerary: function () {
                    //确认并新建一个酒店行程$scope.view.hotelSelect存的是一个模版的默认值，这时是至少第二个酒店行程，入住日期和离店日期是没有默认值的，要清空之前第一个酒店行程设置的日期默认值
                    $scope.view.hotelSelect.fromDate = null;
                    $scope.view.hotelSelect.leaveDate = null;
                    var item = angular.copy($scope.view.hotelSelect);
                    $scope.view.hotelList.push(item);
                    $ionicScrollDelegate.scrollBottom();
                },
                //校验火车的时间
                validateTrainDate: function (index) {
                    if($scope.view.trainList[index].startDate){
                        $scope.view.trainList[index].startDate = new Date($scope.view.trainList[index].startDate).Format('yyyy-MM-dd');
                    }
                    if($scope.view.trainList[index].endDate){
                        $scope.view.trainList[index].endDate = new Date($scope.view.trainList[index].endDate).Format('yyyy-MM-dd');
                    }
                    if($scope.view.trainList[index].itineraryType == 1001){
                         if(!$scope.view.trainList[index].startDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index + 1) + $filter('translate')('custom.application.tip.departure_time')); //'请输入行程' + (index + 1) + '的出发时间'
                            return false;
                        } else if(Date.parse($scope.view.trainList[index].startDate) > Date.parse($scope.view.endDate) || Date.parse($scope.view.trainList[index].startDate) < Date.parse($scope.view.startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.departure_time_error'));  //'行程' + (index + 1) + '的出发时间不在出差时间段'
                            return false;
                        } else {
                            return true;
                        }
                    } else if($scope.view.trainList[index].itineraryType == 1002){
                        if(!$scope.view.trainList[index].startDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index + 1) + $filter('translate')('custom.application.tip.departure_time')); //'请输入行程' + (index + 1) + '的出发时间'
                            return false;
                        } else if(!$scope.view.trainList[index].endDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index + 1) + $filter('translate')('custom.application.tip.arrival_time')); //'请输入行程' + (index + 1) + '的到达时间'
                            return false;
                        } else if(Date.parse($scope.view.trainList[index].startDate) > Date.parse($scope.view.endDate) || Date.parse($scope.view.trainList[index].startDate) < Date.parse($scope.view.startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.departure_time_error')); //'行程' + (index + 1) + '的出发时间不在出差时间段'
                            return false;
                        } else if(Date.parse($scope.view.trainList[index].endDate) > Date.parse($scope.view.endDate) || Date.parse($scope.view.trainList[index].endDate) < Date.parse($scope.view.startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.arrival_time_error')); //'行程' + (index + 1) + '的到达时间不在出差时间段'
                            return false;
                        } else if(Date.parse($scope.view.trainList[index].endDate) < Date.parse($scope.view.trainList[index].startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index + 1) + $filter('translate')('custom.application.tip.arrival_late_departure')); //'行程' + (index + 1) + '的出发时间不能晚于到达时间'
                            return false;
                        }  else {
                            return true;
                        }
                    }
                },
                validateTrainItinerary: function () {
                    var hasFinish = false;
                    var defer = $q.defer();
                    var i = 0
                    while(i < $scope.view.trainList.length){
                        // if(!$scope.view.trainList[i].supplierOID){
                        //     PublicFunction.showToast('请选择行程的' + (i +1) + '的供应商');  //'请选择行程' + (i +1) + '的供应商'
                        //     defer.reject(false);
                        //     return defer.promise;
                        // } else
                        if(!$scope.view.trainList[i].fromCity){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (i +1) + $filter('translate')('custom.application.tip.start_place')); //'请输入行程' + (i +1) + '的出发地'
                            defer.reject();
                            return defer.promise;
                        } else if(!$scope.view.trainList[i].toCity){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (i +1) + $filter('translate')('custom.application.tip.end_place')); //'请输入行程' + (i +1) + '的目的地'
                            defer.reject(false);
                            return defer.promise;
                        }else if($scope.view.trainList[i].fromCity == $scope.view.trainList[i].toCity){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (i +1) + $filter('translate')('custom.application.tip.departure_arrival_same')); //'行程' + (i +1) + '的出发地和目的地不能相同'
                            defer.reject(false);
                            return defer.promise;
                        } else if(!$scope.view.validateTrainDate(i)){
                            defer.reject(false);
                            return defer.promise;
                        } else {
                            i++;
                            if(i == $scope.view.trainList.length){
                                hasFinish = true;
                            }
                        }
                    }
                    if(hasFinish){
                        defer.resolve(true);
                        return defer.promise;
                    }
                },
                saveTrainItinerary: function () {
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit = true;
                        if($scope.view.trainList.length > 0){
                            $scope.view.validateTrainItinerary()
                                .then(function () {
                                    var i = 0;
                                    var modifyFlightList = [];
                                    var createFlightList = [];
                                    for(; i < $scope.view.trainList.length; i++){
                                        var selectFlight = angular.copy($scope.view.trainList[i]);
                                        if(selectFlight.trainItineraryOID != null && selectFlight.trainItineraryOID != ''){
                                            modifyFlightList.push(selectFlight);
                                        } else {
                                            createFlightList.push(selectFlight);
                                        }
                                    }
                                    if(i == $scope.view.trainList.length){
                                        var finish = -1;
                                        if(modifyFlightList.length > 0){
                                            for(var j = 0; j < modifyFlightList.length; j++){
                                                CustomApplicationServices.modifyTrainItinerary(modifyFlightList[j])
                                                    .success(function (data) {
                                                        $scope.view.showModal = false;
                                                        $scope.trainModal.hide();
                                                        $scope.view.getAllItineraryDetail();
                                                        PublicFunction.showToast($filter('translate')('custom.application.travel.save')); //已保存
                                                    })
                                                    .error(function () {
                                                        PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                                    })
                                                    .finally(function () {
                                                        finish++;
                                                        if(finish >= 1){
                                                            $scope.view.disableSubmit = false;
                                                        }
                                                    })
                                            }
                                        } else {
                                            finish++;
                                            if(finish >= 1){
                                                $scope.view.disableSubmit = false;
                                            }
                                        }
                                        if(createFlightList.length > 0){
                                            CustomApplicationServices.createTrainItinerary($scope.view.applicationData.applicationOID, createFlightList)
                                                .success(function (data) {
                                                    $scope.view.showModal = false;
                                                    $scope.trainModal.hide();
                                                    $scope.view.getAllItineraryDetail();
                                                    PublicFunction.showToast($filter('translate')('custom.application.travel.create')); //已创建
                                                })
                                                .error(function () {
                                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                                })
                                                .finally(function () {
                                                    finish++;
                                                    if(finish >= 1){
                                                        $scope.view.disableSubmit = false;
                                                    }
                                                })
                                        } else {
                                            finish++;
                                            if(finish >= 1){
                                                $scope.view.disableSubmit = false;
                                            }
                                        }
                                    }
                                }, function () {
                                    $scope.view.disableSubmit = false;
                                })
                        } else {
                            $scope.view.disableSubmit = false;
                            $scope.view.showModal = false;
                            $scope.trainModal.hide();
                            $scope.view.getAllItineraryDetail();
                        }

                    }
                },
                saveMoreTrainItinerary: function () {
                    var item = angular.copy($scope.view.trainSelect);
                    $scope.view.trainList.push(item);
                    $ionicScrollDelegate.scrollBottom();
                },
                validateAllowanceItinerary: function () {
                    var defer = $q.defer();
                    var i = 0;
                    while(i < $scope.view.subsidiesList.length){
                        var selectAllowance = $scope.view.subsidiesList[i];
                        if(selectAllowance.startDate){
                            selectAllowance.startDate = new Date(selectAllowance.startDate).Format('yyyy-MM-dd');
                        }
                        if(selectAllowance.endDate){
                            selectAllowance.endDate = new Date(selectAllowance.endDate).Format('yyyy-MM-dd');
                        }
                        if(selectAllowance.cityName == '' || selectAllowance.cityName == null){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_allowance') + (i+1) + $filter('translate')('custom.application.tip.city')); //'请输入差补' + (i+1) +'城市'
                            defer.reject(false);
                            return defer.promise;
                        } else if(!selectAllowance.startDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_allowance') + (i+1) + $filter('translate')('custom.application.tip.start_time')); //'请输入差补' + (i+1) +'的开始时间'
                            defer.reject(false);
                            return defer.promise;
                        } else if(!selectAllowance.endDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_allowance') + (i+1) + $filter('translate')('custom.application.tip.end_time')); //'请输入差补' + (i+1) +'的结束时间'
                            defer.reject(false);
                            return defer.promise;
                        } else if(Date.parse(selectAllowance.startDate) > Date.parse($scope.view.endDate) || Date.parse(selectAllowance.startDate) < Date.parse($scope.view.startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.allowance') + (i+1) + $filter('translate')('custom.application.tip.start_time_error')); //的开始时间不在出差时间段
                            defer.reject(false);
                            return defer.promise;
                        } else if(Date.parse(selectAllowance.endDate) > Date.parse($scope.view.endDate) || Date.parse(selectAllowance.endDate) < Date.parse($scope.view.startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.allowance') + (i+1) + $filter('translate')('custom.application.tip.end_time_error')); //'差补' + (i+1) +'的结束时间不在出差时间段'
                            defer.reject(false);
                            return defer.promise;
                        } else if(Date.parse(selectAllowance.endDate) < Date.parse(selectAllowance.startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.allowance') + (i+1) +$filter('translate')('custom.application.tip.end_late_start')); //'差补' + (i+1) +'的开始时间不能晚于结束时间'
                            defer.reject(false);
                            return defer.promise;
                        } else if(!(selectAllowance.expenseTypeOIDs && selectAllowance.expenseTypeOIDs.length > 0)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_select_allowance') + (i+1) +$filter('translate')('custom.application.tip.de_allowance_type')); //'请选择差补' + (i+1) +'的差补类型'
                            defer.reject(false);
                            return defer.promise;
                        } else {
                            i++;
                        }
                    }
                    if(i == $scope.view.subsidiesList.length){
                        defer.resolve(true);
                    }
                    return defer.promise;
                },
                saveAllowanceItinerary: function (index) {
                    if(!$scope.view.disableSubmit) {
                        $scope.view.disableSubmit = true;
                        $scope.view.validateAllowanceItinerary()
                            .then(function () {
                                $scope.allowanceModal.hide();
                                $scope.view.showModal = false;
                                $scope.view.disableSubmit = false;
                                if($scope.view.selectItineraryIndex > -1){
                                    $scope.view.travelSubsidiesList.splice($scope.view.selectItineraryIndex, 1);
                                }
                                if($scope.view.subsidiesList.length > 0){
                                    var i = 0;
                                    for(; i < $scope.view.subsidiesList.length; i++){
                                        $scope.view.travelSubsidiesList.push($scope.view.subsidiesList[i]);
                                    }
                                    if(i == $scope.view.subsidiesList.length){
                                        $scope.view.subsidiesList = [];
                                        // $scope.view.getSubsidiesDetail();
                                    }
                                } else {
                                    $scope.view.subsidiesList = [];
                                    // $scope.view.getSubsidiesDetail();
                                }

                            }, function () {
                                $scope.view.disableSubmit = false;
                            })
                    }
                    $ionicScrollDelegate.scrollBottom();
                },
                //删除差补行程
                deleteAllowanceItinerary: function (index) {
                    $scope.view.subsidiesList.splice(index, 1);
                    PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                },
                //分别获取差补详情
                getSubsidiesDetail: function () {
                    for(var i = 0; i < $scope.view.travelSubsidiesList.length; i++){
                        $scope.view.doTaskAllowance(i);
                    }
                },
                doTaskAllowance: function (index) {
                    $scope.view.travelSubsidiesList[index].dayStart = $scope.view.getDiffDay($scope.view.startDate, $scope.view.travelSubsidiesList[index].startDate) + 1;
                    $scope.view.travelSubsidiesList[index].dayEnd = $scope.view.getDiffDay($scope.view.startDate, $scope.view.travelSubsidiesList[index].endDate) + 1;
                    CustomApplicationServices.getTravelAllowanceStandard($scope.view.travelSubsidiesList[index].cityCode, $scope.view.participantOids)
                        .success(function (data) {
                            $scope.view.travelSubsidiesList[index].detailList = data;
                            if(data && data != null && data != '' && data != undefined){
                                $scope.view.travelSubsidiesList[index].expenseType = [];
                                $scope.view.travelSubsidiesList[index].typeOIDs = [];
                                var i = 0;
                                while(i < $scope.view.participantOids.length){
                                    if($scope.view.travelSubsidiesList[index].detailList[$scope.view.participantOids[i]] && $scope.view.travelSubsidiesList[index].detailList[$scope.view.participantOids[i]].length > 0){
                                        var item = $scope.view.travelSubsidiesList[index].detailList[$scope.view.participantOids[i]];
                                        for(var j = 0; j < item.length; j++){
                                            if($scope.view.travelSubsidiesList[index].typeOIDs.indexOf(item[j].expenseTypeOID) == -1){
                                                item[j].userOIDs = [];
                                                item[j].userOIDs.push($scope.view.participantOids[i]);
                                                item[j].userName = '';
                                                item[j].userName += $scope.view.applicationParticipants[i].fullName;
                                                if($scope.view.travelSubsidiesList[index].expenseTypeOIDs.indexOf(item[j].expenseTypeOID) > -1){
                                                    item[j].checked = true;
                                                } else {
                                                    item[j].checked = false;
                                                }
                                                $scope.view.travelSubsidiesList[index].typeOIDs.push(item[j].expenseTypeOID);
                                                $scope.view.travelSubsidiesList[index].expenseType.push(item[j]);
                                            } else {
                                                var currentIndex = $scope.view.travelSubsidiesList[index].typeOIDs.indexOf(item[j].expenseTypeOID);
                                                $scope.view.travelSubsidiesList[index].expenseType[currentIndex].userOIDs.push($scope.view.participantOids[i]);
                                                $scope.view.travelSubsidiesList[index].expenseType[currentIndex].userName += '，' + $scope.view.applicationParticipants[i].fullName;
                                            }
                                            if(j >= (item.length -1)){
                                                i++;
                                            }
                                        }
                                    }
                                }
                            }
                        })
                },
                saveMoreAllowanceItinerary: function () {
                    var item = angular.copy($scope.view.allowanceSelect);
                    item.expenseTypeOIDs = [];
                    $scope.view.subsidiesList.push(item);
                    $ionicScrollDelegate.scrollBottom();
                },
                //校验其他的时间
                validateOtherDate: function (index) {
                    if($scope.view.copyOtherTrafficList[index].startDate){
                        $scope.view.copyOtherTrafficList[index].startDate = new Date($scope.view.copyOtherTrafficList[index].startDate).Format('yyyy-MM-dd');
                    }
                    if($scope.view.copyOtherTrafficList[index].endDate){
                        $scope.view.copyOtherTrafficList[index].endDate = new Date($scope.view.copyOtherTrafficList[index].endDate).Format('yyyy-MM-dd');
                    }
                    if($scope.view.copyOtherTrafficList[index].itineraryType == 1001){
                        if(!$scope.view.copyOtherTrafficList[index].startDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index +1) + $filter('translate')('custom.application.tip.departure_time'));
                            return false;
                        } else if(Date.parse($scope.view.copyOtherTrafficList[index].startDate) > Date.parse($scope.view.endDate) || Date.parse($scope.view.copyOtherTrafficList[index].startDate) < Date.parse($scope.view.startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index +1) + $filter('translate')('custom.application.tip.departure_time_error')); //'行程' + (index +1) + '的出发时间不在出差时间段'
                            return false;
                        } else {
                            return true;
                        }
                    } else if($scope.view.copyOtherTrafficList[index].itineraryType == 1002){
                        if(!$scope.view.copyOtherTrafficList[index].startDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index +1) + $filter('translate')('custom.application.tip.departure_time')); //请输入行程(index +1) + '的出发时间'
                            return false;
                        } else if(!$scope.view.copyOtherTrafficList[index].endDate){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_enter_trip') + (index +1) + $filter('translate')('custom.application.tip.arrival_time'));//请输入行程(index +1) + '的到达时间'
                            return false;
                        } else if(Date.parse($scope.view.copyOtherTrafficList[index].startDate) > Date.parse($scope.view.endDate) || Date.parse($scope.view.copyOtherTrafficList[index].startDate) < Date.parse($scope.view.startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index +1) + $filter('translate')('custom.application.tip.departure_time_error')); //'行程' + (index +1) + '的出发时间不在出差时间段'
                            return false;
                        } else if(Date.parse($scope.view.copyOtherTrafficList[index].endDate) > Date.parse($scope.view.endDate) || Date.parse($scope.view.copyOtherTrafficList[index].endDate) < Date.parse($scope.view.startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index +1) + $filter('translate')('custom.application.tip.arrival_time_error')); //'行程' + (index +1) + '的到达时间不在出差时间段'
                            return false;
                        } else if(Date.parse($scope.view.copyOtherTrafficList[index].endDate) < Date.parse($scope.view.copyOtherTrafficList[index].startDate)){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (index +1) + $filter('translate')('custom.application.tip.arrival_late_departure')); //'行程' + (index +1) + '的出发时间不能晚于到达时间'
                            return false;
                        }  else {
                            return true;
                        }
                    }
                },
                //校验其他
                validateOtherItinerary: function () {
                    var defer = $q.defer();
                    for(var i = 0; i < $scope.view.copyOtherTrafficList.length; i++){
                        if($scope.view.copyOtherTrafficList[i].trafficType == 1001){
                            $scope.view.copyOtherTrafficList[i].trafficTypeName = $filter('translate')('custom.application.traffic.boat'); //轮船
                        }
                        if($scope.view.copyOtherTrafficList[i].trafficType == 1002){
                            $scope.view.copyOtherTrafficList[i].trafficTypeName = $filter('translate')('custom.application.traffic.car'); //汽车
                        }
                        if(!$scope.view.copyOtherTrafficList[i].trafficType || $scope.view.copyOtherTrafficList[i].trafficTypeName == ''
                            || $scope.view.copyOtherTrafficList[i].trafficTypeName == null){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_select_trip') + (i +1) + $filter('translate')('custom.application.tip.traffic_type')); //'请选择行程' + (i +1) + '交通方式'
                            defer.reject(false);
                            return defer.promise;
                        } else if($scope.view.copyOtherTrafficList[i].fromCity == '' || $scope.view.copyOtherTrafficList[i].fromCity == null){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_select_trip') + (i +1) + $filter('translate')('custom.application.tip.departure')); //'请选择行程' + (i +1) + '出发地'
                            defer.reject(false);
                            return defer.promise;
                        } else if($scope.view.copyOtherTrafficList[i].toCity == '' || $scope.view.copyOtherTrafficList[i].toCity == null){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.please_select_trip') + (i +1) + $filter('translate')('custom.application.tip.destination')); //'请选择行程' + (i +1) + '目的地'
                            defer.reject(false);
                            return defer.promise;
                        }  else if(!$scope.view.functionProfileList['ca.travel.other.support.same.city'] && $scope.view.copyOtherTrafficList[i].toCity ==  $scope.view.copyOtherTrafficList[i].fromCity){
                            PublicFunction.showToast($filter('translate')('custom.application.tip.trip') + (i +1) + $filter('translate')('custom.application.tip.departure_arrival_same')); //'行程' + (i +1) + '的出发地和目的地不能相同'
                            defer.reject(false);
                            return defer.promise;
                        } else if(!$scope.view.validateOtherDate(i)){
                            defer.reject(false);
                            return defer.promise;
                        } else {
                            defer.resolve(true);
                            return defer.promise;
                        }
                    }
                },
                //批量添加其他交通方式
                saveOtherItinerary: function () {
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit = true;
                        if($scope.view.otherTrafficList.length > 0){
                            $scope.view.copyOtherTrafficList = angular.copy($scope.view.otherTrafficList);
                            $scope.view.validateOtherItinerary()
                                .then(function () {
                                    var i = 0;
                                    var modifyFlightList = [];
                                    var createFlightList = [];
                                    for(; i < $scope.view.copyOtherTrafficList.length; i++){
                                        var selectFlight = angular.copy($scope.view.copyOtherTrafficList[i]);
                                        if(selectFlight.otherItineraryOID != null && selectFlight.otherItineraryOID != ''){
                                            modifyFlightList.push(selectFlight);
                                        } else {
                                            createFlightList.push(selectFlight);
                                        }
                                    }
                                    if(i == $scope.view.copyOtherTrafficList.length){
                                        if(modifyFlightList.length > 0){
                                            for(var j = 0; j < modifyFlightList.length; j++){
                                                CustomApplicationServices.modifyOtherItinerary(modifyFlightList[j])
                                                    .success(function (data) {
                                                        $scope.view.showModal = false;
                                                        $scope.otherModal.hide();
                                                        $scope.view.getAllItineraryDetail();
                                                        PublicFunction.showToast($filter('translate')('custom.application.travel.save')); //已保存
                                                    })
                                                    .error(function () {
                                                        PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                                    })
                                                    .finally(function () {
                                                        $scope.view.disableSubmit = false;
                                                    })
                                            }
                                        }
                                        if(createFlightList.length > 0){
                                            CustomApplicationServices.createOtherItinerary($scope.view.applicationData.applicationOID, createFlightList)
                                                .success(function (data) {
                                                    $scope.view.showModal = false;
                                                    $scope.otherModal.hide();
                                                    $scope.view.getAllItineraryDetail();
                                                    PublicFunction.showToast($filter('translate')('custom.application.travel.create')); //已创建
                                                })
                                                .error(function () {
                                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                                })
                                                .finally(function () {
                                                    $scope.view.disableSubmit = false;
                                                })
                                        }
                                    }
                                }, function () {
                                    $scope.view.disableSubmit = false;
                                })
                        } else {
                            $scope.view.disableSubmit = false;
                            $scope.view.showModal = false;
                            $scope.otherModal.hide();
                            $scope.view.getAllItineraryDetail();
                        }
                    }
                },
                //新增其他交通方式
                saveMoreOtherItinerary: function () {
                    var item = angular.copy($scope.view.otherTrafficSelect);
                    $scope.view.otherTrafficList.push(item);
                    $ionicScrollDelegate.scrollBottom();
                },
                //切换其他交通方式的类型
                chooseOtherType: function (type, index) {
                    $scope.view.otherTrafficList[index].trafficType = type;
                },
                //获取所有的行程备注
                getAllRemarkItinerary: function (type) {
                    var nzhcn = Nzh.cn;
                    CustomApplicationServices.getRemarkItinerary($scope.view.applicationData.applicationOID, $scope.view.startDate, $scope.view.endDate)
                        .success(function (data) {
                            $scope.view.remarkItineraryList = data;
                            $scope.view.originRemarkList = angular.copy(data);
                            for(var i = 0; i < $scope.view.remarkItineraryList.length; i++){
                                if ($sessionStorage.lang === 'zh_cn') {
                                    $scope.view.remarkItineraryList[i].dayNumber = nzhcn.encodeS(i + 1);
                                } else {
                                    $scope.view.remarkItineraryList[i].dayNumber = i + 1;
                                }
                                if($scope.view.remarkItineraryList[i].itineraryType && $scope.view.remarkItineraryList[i].itineraryType.length > 0 && ($scope.view.remarkItineraryList[i].itineraryType.indexOf(1001) > 0 || $scope.view.remarkItineraryList[i].itineraryType.indexOf(1002) > 0 ||
                                    $scope.view.remarkItineraryList[i].itineraryType.indexOf(1003) > 0 || $scope.view.remarkItineraryList[i].itineraryType.indexOf(1004) > 0 ||
                                    $scope.view.remarkItineraryList[i].itineraryType.indexOf(1005) > 0 || $scope.view.remarkItineraryList[i].itineraryType.indexOf(1006) > 0)){
                                    $scope.view.remarkItineraryList[i].hasRoute = true;
                                } else {
                                    $scope.view.remarkItineraryList[i].hasRoute = false;
                                }
                            }
                            if(data.length > 0){
                                $scope.view.selectItineraryIndex = 0;
                                $scope.view.selectItinerary($scope.view.selectItineraryIndex);
                            }
                            if(type == 'add'){
                                $scope.remarkModal.show();
                                $scope.view.closeKeyboard();
                                $scope.view.showModal = true;
                                $scope.view.disableSubmit = false;
                            }
                        })
                        .error(function () {
                            PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                            $scope.view.disableSubmit = false;
                        })
                },
                getRandomClerk: function () {
                    CustomApplicationServices.getRandomHotelBooker($scope.view.hotelRoomData)
                        .success(function (data) {
                            $scope.view.isRandom = true;
                            $scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks = angular.copy(data.maleUserOIDs);
                            $scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks = angular.copy(data.femaleUserOIDs);
                        })
                },
                // 关闭键盘
                closeKeyboard: function() {
                    if(!ionic.Platform.is('browser')){
                        cordova.plugins.Keyboard.close();
                    }
                },
                //关闭差补选择
                cancelSelectAllowanceType: function () {
                    $scope.view.subsidiesList[$scope.view.subsidiesListIndex].expenseTypeOIDs = angular.copy($scope.view.expenseTypeOIDCopy);
                    $scope.selectAllowanceTypeModal.hide();
                },
                //计算差补总金额
                //所有［单个费用类型amount*这个费用上的人数人数乘以dateLength］之和
                getAllowanceAmount: function (item) {
                    var amount = 0;
                    if(item.expenseType && item.expenseType.length > 0){
                        var i = 0;
                        for(; i < item.expenseType.length; i++){
                            if(item.expenseTypeOIDs.indexOf(item.expenseType[i].expenseTypeOID) > -1){
                                amount += item.expenseType[i].amount * item.expenseType[i].userOIDs.length * (item.dayEnd - item.dayStart +1);
                            }
                        }
                        if(i >= item.expenseType.length){
                            return amount;
                        }
                    } else {
                        return amount;
                    }
                },
                //确定差补类型选择
                comfireAllowanceType: function () {
                    $scope.selectAllowanceTypeModal.hide();
                },
                chooseAllowanceType: function (index) {
                    if($scope.view.subsidiesList[$scope.view.subsidiesListIndex].expenseType[index].checked){
                        $scope.view.subsidiesList[$scope.view.subsidiesListIndex].expenseType[index].checked = false;
                        var i = $scope.view.subsidiesList[$scope.view.subsidiesListIndex].expenseTypeOIDs.indexOf($scope.view.subsidiesList[$scope.view.subsidiesListIndex].expenseType[index].expenseTypeOID);
                        if(i > -1){
                            $scope.view.subsidiesList[$scope.view.subsidiesListIndex].expenseTypeOIDs.splice(i, 1);
                        }
                    } else {
                        $scope.view.subsidiesList[$scope.view.subsidiesListIndex].expenseType[index].checked = true;
                        $scope.view.subsidiesList[$scope.view.subsidiesListIndex].expenseTypeOIDs.push($scope.view.subsidiesList[$scope.view.subsidiesListIndex].expenseType[index].expenseTypeOID);
                    }
                },
                //清空选择的差补类型
                clearSelectAllowanceType: function (index) {
                    $scope.view.subsidiesList[index].detailList = null;
                    $scope.view.subsidiesList[index].expenseType = [];
                    $scope.view.subsidiesList[index].expenseTypeOIDs = [];
                    $scope.view.subsidiesList[index].hasGetType = false;
                },
                againGetAllowanceType: function (index) {
                    if($scope.view.subsidiesList[index].hasGetType){
                        $scope.view.subsidiesList[index].hasGetType = false;
                    }
                    $scope.view.subsidiesList[index].nothing = false;
                },
                //选择差补类型
                selectAllowanceType: function (index) {
                    $scope.view.subsidiesListIndex = index;
                    $ionicScrollDelegate.$getByHandle('allowanceTypeScroll').scrollTop();
                    $scope.selectAllowanceTypeModal.show();
                    $scope.view.expenseTypeOIDCopy = angular.copy($scope.view.subsidiesList[index].expenseTypeOIDs);
                    $scope.view.subsidiesList[index].dayStart = $scope.view.getDiffDay($scope.view.startDate, $scope.view.subsidiesList[index].startDate) + 1;
                    $scope.view.subsidiesList[index].dayEnd = $scope.view.getDiffDay($scope.view.startDate, $scope.view.subsidiesList[index].endDate) + 1;
                    if(!$scope.view.subsidiesList[index].hasGetType){
                        $scope.view.subsidiesList[index].hasGetType = true;
                        CustomApplicationServices.getTravelAllowanceStandard($scope.view.subsidiesList[index].cityCode, $scope.view.participantOids)
                            .success(function (data) {
                                // $scope.view.allowanceTypeList = data;
                                $scope.view.subsidiesList[index].detailList = data;
                                if(data && data != null && data != ''){
                                    $scope.view.subsidiesList[index].nothing = false;
                                    $scope.view.subsidiesList[index].expenseType = [];
                                    $scope.view.subsidiesList[index].typeOIDs = [];
                                    var i = 0;
                                    while(i < $scope.view.participantOids.length){
                                        if($scope.view.subsidiesList[index].detailList[$scope.view.participantOids[i]] && $scope.view.subsidiesList[index].detailList[$scope.view.participantOids[i]].length > 0){
                                            var item = $scope.view.subsidiesList[index].detailList[$scope.view.participantOids[i]];
                                            if(item && item.length && item.length > 0){
                                                for(var j = 0; j < item.length; j++){
                                                    item[j].checked = false;
                                                    if($scope.view.subsidiesList[index].typeOIDs.indexOf(item[j].expenseTypeOID) == -1){
                                                        item[j].userOIDs = [];
                                                        item[j].userOIDs.push($scope.view.participantOids[i]);
                                                        item[j].userName = '';
                                                        item[j].userName += $scope.view.applicationParticipants[i].fullName;
                                                        $scope.view.subsidiesList[index].typeOIDs.push(item[j].expenseTypeOID);
                                                        $scope.view.subsidiesList[index].expenseType.push(item[j]);
                                                    } else {
                                                        var currentIndex = $scope.view.subsidiesList[index].typeOIDs.indexOf(item[j].expenseTypeOID);
                                                        $scope.view.subsidiesList[index].expenseType[currentIndex].userOIDs.push($scope.view.participantOids[i]);
                                                        $scope.view.subsidiesList[index].expenseType[currentIndex].userName += '，' + $scope.view.applicationParticipants[i].fullName;
                                                    }
                                                    if(j >= (item.length -1)){
                                                        i++;
                                                    }
                                                }
                                            } else {
                                                i++;
                                            }
                                        } else {
                                            i++;
                                        }
                                    }
                                } else {
                                    $scope.view.subsidiesList[index].nothing = true;
                                }
                            })
                    }

                },
                //判断城市是否在供应商列表里
                isCityInItinerary: function (type) {
                    var defer = $q.defer();
                    if(type == 'ticket'){
                        //机票
                        if($scope.view.applicationData.customFormProperties && $scope.view.applicationData.customFormProperties.controlFields && $scope.view.applicationData.customFormProperties.controlFields.fromCities
                            && $scope.view.applicationData.customFormProperties.controlFields.fromCities.required && !$scope.view.flightSelect.fromCity && $scope.view.currentCityCode){
                            CustomApplicationServices.isCityInVendor($scope.view.flightSelect.serviceName, $scope.view.currentCityCode, $sessionStorage.lang)
                                .success(function (data) {
                                    if(data && data.alias){
                                        $scope.view.flightSelect.fromCity = $scope.view.currentCity;
                                        $scope.view.flightSelect.fromCityCode = $scope.view.currentCityCode;
                                    }
                                    defer.resolve(true);
                                    return defer.promise;
                                })
                                .error(function () {
                                    defer.resolve(true);
                                    return defer.promise;
                                })
                        } else {
                            defer.resolve(true);
                            return defer.promise;
                        }
                    } else if(type == 'hotel'){
                        if(!$scope.view.hotelSelect.cityCode && $scope.view.currentCityCode){
                            CustomApplicationServices.isCityInVendor($scope.view.hotelSelect.serviceName, $scope.view.currentCityCode, $sessionStorage.lang)
                                .success(function (data) {
                                    if(data && data.alias){
                                        $scope.view.hotelSelect.cityName = $scope.view.currentCity;
                                        $scope.view.hotelSelect.cityCode = $scope.view.currentCityCode;
                                    }
                                    defer.resolve(true);
                                    return defer.promise;
                                })
                                .error(function () {
                                    defer.resolve(true);
                                    return defer.promise;
                                })
                        } else {
                            defer.resolve(true);
                            return defer.promise;
                        }
                    } else if(type == 'train'){
                        if(!$scope.view.trainSelect.fromCityCode && $scope.view.currentCityCode){
                            CustomApplicationServices.isCityInVendor($scope.view.trainSelect.serviceName, $scope.view.currentCityCode, $sessionStorage.lang)
                                .success(function (data) {
                                    if(data && data.alias){
                                        $scope.view.trainSelect.fromCity = $scope.view.currentCity;
                                        $scope.view.trainSelect.fromCityCode = $scope.view.currentCityCode;
                                    }
                                    defer.resolve(true);
                                    return defer.promise;
                                })
                                .error(function () {
                                    defer.resolve(true);
                                    return defer.promise;
                                })
                        } else {
                            defer.resolve(true);
                            return defer.promise;
                        }
                    } else {
                        defer.resolve(true);
                        return defer.promise;
                    }
                    return defer.promise;
                },
                //添加行程
                addAllowance: function (type) {
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit = true;
                        if(type == 'ticket'){
                            $scope.view.type ='1001';
                            $scope.view.flightList = [];
                            if($scope.view.fightSupplier.length > 0 && !$scope.view.flightSelect.supplierOID){
                                $scope.view.flightSelect.supplierName = $scope.view.fightSupplier[0].name;
                                $scope.view.flightSelect.supplierOID = $scope.view.fightSupplier[0].supplierOID;
                                $scope.view.flightSelect.supplierIconUrl = $scope.view.fightSupplier[0].vendorIcon.iconPath;
                                $scope.view.flightSelect.serviceName = $scope.view.fightSupplier[0].serviceName;
                            }
                            $scope.view.isCityInItinerary(type)
                                .then(function () {
                                    var item = angular.copy($scope.view.flightSelect);
                                    $scope.view.flightList.push(item);
                                    $scope.view.bookClerkList = angular.copy($scope.view.applicationParticipants);
                                    if($scope.view.userDetail && !$scope.view.userInParticipants){
                                        $scope.view.bookClerkList.push($scope.view.userDetail);
                                    }
                                }, function () {
                                    var item = angular.copy($scope.view.flightSelect);
                                    $scope.view.flightList.push(item);
                                    $scope.view.bookClerkList = angular.copy($scope.view.applicationParticipants);
                                    if($scope.view.userDetail && !$scope.view.userInParticipants){
                                        $scope.view.bookClerkList.push($scope.view.userDetail);
                                    }
                                })
                            $scope.ticketModal.show();
                            $scope.view.closeKeyboard();
                            $scope.view.showModal = true;
                            $scope.view.disableSubmit = false;
                        } else if(type == 'allowance'){
                            $scope.view.type ='1002';
                            $scope.view.allowanceSelect.cityName = $scope.view.currentCity;
                            $scope.view.allowanceSelect.cityCode = $scope.view.currentCityCode;
                            if($scope.view.applicationParticipants.length > 0){
                                $scope.view.selectItineraryIndex = -1;
                                var item = angular.copy($scope.view.allowanceSelect);
                                item.expenseTypeOIDs = [];
                                $scope.view.subsidiesList.push(item);
                                $scope.allowanceModal.show();
                                $scope.view.closeKeyboard();
                                $scope.view.showModal = true;
                                $scope.view.disableSubmit = false;
                            } else {
                                PublicFunction.showToast($filter('translate')('custom.application.tip.add_allowance_error')); //add_allowance_error  无公司内部参与人不可添加差补
                                $scope.view.disableSubmit = false;
                            }
                        } else if(type == 'remark'){
                            $scope.view.hasSaveRemark = false;
                            $scope.view.getAllRemarkItinerary('add');
                        } else if(type == 'hotel'){
                            $scope.view.type ='1002';
                            $scope.view.hotelList = [];
                            if($scope.view.hotelSupplier.length > 0 && !$scope.view.hotelSelect.supplierOID ){
                                $scope.view.hotelSelect.supplierName = $scope.view.hotelSupplier[0].name;
                                $scope.view.hotelSelect.supplierOID = $scope.view.hotelSupplier[0].supplierOID;
                                $scope.view.hotelSelect.supplierIconUrl = $scope.view.hotelSupplier[0].vendorIcon.iconPath;
                                $scope.view.hotelSelect.serviceName = $scope.view.hotelSupplier[0].serviceName;
                            }
                            $scope.view.isCityInItinerary(type)
                                .then(function () {
                                    //如果是第一个酒店行程，则入住日期默认为单据上的开始日期，离店日期默认为单据上的结束日期
                                    //酒店行程为空的时候就没有$scope.view.allItineraryList['HOTEL']
                                    if (!$scope.view.allItineraryList['HOTEL'] || !$scope.view.allItineraryList['HOTEL'].length) {
                                        $scope.view.hotelSelect.fromDate = $scope.view.startDate;
                                        $scope.view.hotelSelect.leaveDate = $scope.view.endDate;
                                    } else {
                                        //不是第一个酒店行程时，没有默认值，之前设置的默认值要置空
                                        $scope.view.hotelSelect.fromDate = null;
                                        $scope.view.hotelSelect.leaveDate = null;
                                    }
                                    if($scope.view.hotelSelect.fromDate && $scope.view.hotelSelect.leaveDate){
                                        $scope.view.hotelSelect.day = $scope.view.getDiffDay($scope.view.hotelSelect.fromDate, $scope.view.hotelSelect.leaveDate) +1;
                                    }
                                    if($scope.view.hotelRoomData && $scope.view.hotelRoomData.maxRoomNumber){
                                        $scope.view.hotelSelect.roomNumber = $scope.view.hotelRoomData.maxRoomNumber;
                                    }
                                    $scope.view.hotelSelect.selectDay = [];
                                    var item = angular.copy($scope.view.hotelSelect);
                                    $scope.view.hotelList.push(item);
                                    if($scope.view.hotelSelect.day >= 2 && $scope.view.hotelSelect.fromDate && $scope.view.hotelSelect.leaveDate){
                                        var date = new Date($scope.view.hotelList[0].fromDate);
                                        if($scope.view.hotelList[0].day >= 2 ){
                                            for(var i = 0; i < ($scope.view.hotelList[0].day -1); i++){
                                                date = new Date(new Date(date).setDate(new Date(date).getDate() + i)).Format('yyyy-MM-dd');
                                                $scope.view.hotelList[0].selectDay.push(date);
                                                $scope.view.hotelSelect.selectDay.push(date);
                                            }
                                        }
                                    }
                                }, function () {
                                    //如果是第一个酒店行程，则入住日期默认为单据上的开始日期，离店日期默认为单据上的结束日期
                                    //酒店行程为空的时候就没有$scope.view.allItineraryList['HOTEL']
                                    if (!$scope.view.allItineraryList['HOTEL'] || !$scope.view.allItineraryList['HOTEL'].length) {
                                        $scope.view.hotelSelect.fromDate = $scope.view.startDate;
                                        $scope.view.hotelSelect.leaveDate = $scope.view.endDate;
                                    } else {
                                        //不是第一个酒店行程时，没有默认值，之前设置的默认值要置空
                                        $scope.view.hotelSelect.fromDate = null;
                                        $scope.view.hotelSelect.leaveDate = null;
                                    }
                                    if($scope.view.hotelSelect.fromDate && $scope.view.hotelSelect.leaveDate){
                                        $scope.view.hotelSelect.day = $scope.view.getDiffDay($scope.view.hotelSelect.fromDate, $scope.view.hotelSelect.leaveDate) +1;
                                    }
                                    if($scope.view.hotelRoomData && $scope.view.hotelRoomData.maxRoomNumber){
                                        $scope.view.hotelSelect.roomNumber = $scope.view.hotelRoomData.maxRoomNumber;
                                    }
                                    $scope.view.hotelSelect.selectDay = [];
                                    var item = angular.copy($scope.view.hotelSelect);
                                    $scope.view.hotelList.push(item);
                                    if($scope.view.hotelSelect.day >= 2 && $scope.view.hotelSelect.fromDate && $scope.view.hotelSelect.leaveDate){
                                        var date = new Date($scope.view.hotelList[0].fromDate);
                                        if($scope.view.hotelList[0].day >= 2 ){
                                            for(var i = 0; i < ($scope.view.hotelList[0].day -1); i++){
                                                date = new Date(new Date(date).setDate(new Date(date).getDate() + i)).Format('yyyy-MM-dd');
                                                $scope.view.hotelList[0].selectDay.push(date);
                                                $scope.view.hotelSelect.selectDay.push(date);
                                            }
                                        }
                                    }
                                })
                            $scope.hotelModal.show();
                            $scope.view.closeKeyboard();
                            $scope.view.showModal = true;
                            $scope.view.disableSubmit = false;
                            // PublicFunction.showToast($filter('translate')('custom.application.tip.open_yet'));  //'暂未开通，敬请期待'
                        } else if(type == 'train'){
                            $scope.view.type ='1002';
                            $scope.view.trainList = [];
                            if($scope.view.trainSupplier.length > 0 && !$scope.view.trainSelect.supplierOID){
                                $scope.view.trainSelect.supplierIconUrl = $scope.view.trainSupplier[0].vendorIcon.iconPath;
                                $scope.view.trainSelect.supplierName = $scope.view.trainSupplier[0].name;
                                $scope.view.trainSelect.supplierOID = $scope.view.trainSupplier[0].supplierOID;
                                $scope.view.trainSelect.serviceName = $scope.view.trainSupplier[0].serviceName;
                            }
                            $scope.view.isCityInItinerary(type)
                                .then(function () {
                                    var item = angular.copy($scope.view.trainSelect);
                                    $scope.view.trainList.push(item);
                                }, function () {
                                    var item = angular.copy($scope.view.trainSelect);
                                    $scope.view.trainList.push(item);
                                })
                            $scope.trainModal.show();
                            $scope.view.closeKeyboard();
                            $scope.view.showModal = true;
                            $scope.view.disableSubmit = false;
                        } else if(type == 'other'){
                            $scope.view.type ='1002';
                            $scope.view.otherTrafficList = [];
                            $scope.view.otherTrafficSelect.fromCity = $scope.view.currentCity;
                            $scope.view.otherTrafficSelect.fromCityCode = $scope.view.currentCityCode;
                            var item = angular.copy($scope.view.otherTrafficSelect);
                            $scope.view.otherTrafficList.push(item);
                            $scope.otherModal.show();
                            $scope.view.closeKeyboard();
                            $scope.view.showModal = true;
                            $scope.view.disableSubmit = false;
                        } else {
                            $scope.view.disableSubmit = false;
                        }
                    }

                },
                hideDeleteItinerary: function (close) {
                    $scope.view.showModal = false;
                    $scope.deleteItineraryModal.hide();
                    if(close){
                        $ionicListDelegate.closeOptionButtons();
                    }
                },
                //删除单程
                deleteOneItinerary: function () {
                    $scope.view.hideDeleteItinerary(true);
                    if($scope.view.deleteItineraryType == 'flight'){
                        $scope.view.deleteItineraryData.startDate = angular.copy($scope.view.deleteItineraryData.endDate);
                        $scope.view.deleteItineraryData.endDate = null;
                        var fromCity = angular.copy($scope.view.deleteItineraryData.fromCity);
                        $scope.view.deleteItineraryData.fromCity = $scope.view.deleteItineraryData.toCity;
                        $scope.view.deleteItineraryData.toCity = fromCity;
                        $scope.view.deleteItineraryData.itineraryType = 1001;
                        CustomApplicationServices.modifyFlightItinerary($scope.view.deleteItineraryData)
                            .success(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                $scope.view.getAllItineraryDetail();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                            })
                    } else if($scope.view.deleteItineraryType == 'train'){
                        $scope.view.deleteItineraryData.startDate = angular.copy($scope.view.deleteItineraryData.endDate);
                        $scope.view.deleteItineraryData.endDate = null;
                        var fromCity = angular.copy($scope.view.deleteItineraryData.fromCity);
                        $scope.view.deleteItineraryData.fromCity = $scope.view.deleteItineraryData.toCity;
                        $scope.view.deleteItineraryData.toCity = fromCity;
                        $scope.view.deleteItineraryData.itineraryType = 1001;
                        CustomApplicationServices.modifyTrainItinerary($scope.view.deleteItineraryData)
                            .success(function () {
                                 PublicFunction.showToast($filter('translate')('custom.application.travel.delete'));  //已删除
                                $scope.view.getAllItineraryDetail();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                            })
                    } else if($scope.view.deleteItineraryType == 'other'){
                        $scope.view.deleteItineraryData.startDate = angular.copy($scope.view.deleteItineraryData.endDate);
                        $scope.view.deleteItineraryData.endDate = null;
                        var fromCity = angular.copy($scope.view.deleteItineraryData.fromCity);
                        $scope.view.deleteItineraryData.fromCity = $scope.view.deleteItineraryData.toCity;
                        $scope.view.deleteItineraryData.toCity = fromCity;
                        $scope.view.deleteItineraryData.itineraryType = 1001;
                        CustomApplicationServices.modifyOtherItinerary($scope.view.deleteItineraryData)
                            .success(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                $scope.view.getAllItineraryDetail();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                            })
                    }
                },
                //删除往返
                deleteTwoItinerary: function () {
                    $scope.view.hideDeleteItinerary(true);
                    if($scope.view.deleteItineraryType == 'flight'){
                        CustomApplicationServices.deleteFlightItinerary($scope.view.deleteItineraryData.flightItineraryOID)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                for(var i = 0; i < $scope.view.allItineraryList['FLIGHT'].length; i++){
                                    if($scope.view.allItineraryList['FLIGHT'][i].flightItineraryOID == $scope.view.deleteItineraryData.flightItineraryOID){
                                        $scope.view.allItineraryList['FLIGHT'].splice(i, 1);
                                        i = -1;
                                    }
                                }
                                $scope.view.getAllItineraryDetail();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                            })
                    } else if($scope.view.deleteItineraryType == 'train'){
                        CustomApplicationServices.deleteTrainItinerary($scope.view.deleteItineraryData.trainItineraryOID)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                for(var i = 0; i < $scope.view.allItineraryList['TRAIN'].length; i++){
                                    if($scope.view.allItineraryList['TRAIN'][i].trainItineraryOID == $scope.view.deleteItineraryData.trainItineraryOID){
                                        $scope.view.allItineraryList['TRAIN'].splice(i, 1);
                                        i = -1;
                                    }
                                }
                                $scope.view.getAllItineraryDetail();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                            })
                    } else if($scope.view.deleteItineraryType == 'other'){
                        CustomApplicationServices.deleteOtherItinerary($scope.view.deleteItineraryData.otherItineraryOID)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                for(var i = 0; i < $scope.view.allItineraryList['OTHER'].length; i++){
                                    if($scope.view.allItineraryList['OTHER'][i].otherItineraryOID == $scope.view.deleteItineraryData.otherItineraryOID){
                                        $scope.view.allItineraryList['OTHER'].splice(i, 1);
                                        i = -1;
                                    }
                                }
                                $scope.view.getAllItineraryDetail();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                            })
                    }
                },
                deleteItinerarySheet: function () {
                    var hideSheet = $ionicActionSheet.show({
                        cssClass: "itinerary-delete",
                        buttons: [
                            { text: $filter('translate')('custom.application.tip.only_delete_single')}, //仅删除该单程
                            { text: $filter('translate')('custom.application.tip.delete_return')} //删除往返行程
                        ],
                        titleText: $filter('translate')('custom.application.tip.traffic_is_reture'), //该交通为往返行程
                        cancelText: $filter('translate')('common.cancel'),
                        cancel: function() {
                            $scope.view.hideDeleteItinerary(true);
                            hideSheet();
                        },
                        buttonClicked: function(index) {
                            if(index == 0){
                                $scope.view.deleteOneItinerary()
                            } else if(index == 1){
                                $scope.view.deleteTwoItinerary()
                            }
                            hideSheet();
                        }
                    });
                },
                //删除行程
                deleteItinerary: function (type, index) {
                    $ionicListDelegate.closeOptionButtons();
                    if(type == 'flight'){
                        if($scope.view.allItineraryList['FLIGHT'][index].itineraryType == 1002){
                            $scope.view.showModal = true;
                            $scope.view.deleteItineraryType = type;
                            $scope.view.deleteItineraryData = angular.copy($scope.view.allItineraryList['FLIGHT'][index]);
                            $scope.view.deleteIndex = index;
                            $scope.view.deleteItinerarySheet();
                            // $scope.deleteItineraryModal.show();
                        } else {
                            CustomApplicationServices.deleteFlightItinerary($scope.view.allItineraryList['FLIGHT'][index].flightItineraryOID)
                                .success(function (data) {
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                    $scope.view.allItineraryList['FLIGHT'].splice(index, 1);
                                    $scope.view.getAllItineraryDetail();
                                })
                                .error(function () {
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                })
                        }
                    } else if(type == 'train'){
                        if($scope.view.allItineraryList['TRAIN'][index].itineraryType == 1002){
                            $scope.view.showModal = true;
                            $scope.view.deleteItineraryType = type;
                            $scope.view.deleteItineraryData = angular.copy($scope.view.allItineraryList['TRAIN'][index]);
                            $scope.view.deleteIndex = index;
                            $scope.view.deleteItinerarySheet();
                            // $scope.deleteItineraryModal.show();
                        } else {
                            CustomApplicationServices.deleteTrainItinerary($scope.view.allItineraryList['TRAIN'][index].trainItineraryOID)
                                .success(function (data) {
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                    $scope.view.allItineraryList['TRAIN'].splice(index, 1);
                                    $scope.view.getAllItineraryDetail();
                                })
                                .error(function () {
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                })
                        }
                    } else if(type == 'other'){
                        if($scope.view.allItineraryList['OTHER'][index].itineraryType == 1002){
                            $scope.view.showModal = true;
                            $scope.view.deleteItineraryType = type;
                            $scope.view.deleteItineraryData = angular.copy($scope.view.allItineraryList['OTHER'][index]);
                            $scope.view.deleteIndex = index;
                            $scope.view.deleteItinerarySheet();
                            // $scope.deleteItineraryModal.show();
                        } else {
                            CustomApplicationServices.deleteOtherItinerary($scope.view.allItineraryList['OTHER'][index].otherItineraryOID)
                                .success(function (data) {
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                    $scope.view.allItineraryList['OTHER'].splice(index, 1);
                                    $scope.view.getAllItineraryDetail();
                                })
                                .error(function () {
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                                })
                        }
                    } else if(type == 'hotel'){
                        CustomApplicationServices.deleteHotelItinerary($scope.view.allItineraryList['HOTEL'][index].hotelItineraryOID)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                                $scope.view.allItineraryList['HOTEL'].splice(index, 1);
                                $scope.view.getAllItineraryDetail();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error')); //出错了
                            })

                    } else if(type == 'allowance'){
                        $scope.view.travelSubsidiesList.splice(index, 1);
                        PublicFunction.showToast($filter('translate')('custom.application.travel.delete')); //已删除
                    }
                },
                //修改行程
                modifyItinerary: function (type, index) {
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit = true;
                        if(type == 'flight'){
                            $scope.view.flightList = [];
                            CustomApplicationServices.getFlightItinerary($scope.view.allItineraryList['FLIGHT'][index].flightItineraryOID)
                                .success(function (data) {
                                    $scope.view.flightList.push(data);
                                    if($scope.view.flightList[0].supplierOID && $scope.view.fightSupplier.length > 0){
                                        for(var i = 0; i < $scope.view.fightSupplier.length; i++){
                                            if($scope.view.flightList[0].supplierOID == $scope.view.fightSupplier[i].supplierOID){
                                                $scope.view.flightList[0].serviceName = $scope.view.fightSupplier[i].serviceName;
                                                break;
                                            }
                                        }
                                    }
                                    $scope.ticketModal.show();
                                    $scope.view.showModal = true;
                                })
                                .finally(function () {
                                    $scope.view.disableSubmit = false;
                                })
                        } else if(type == 'train'){
                            $scope.view.trainList = [];
                            CustomApplicationServices.getTrainItinerary($scope.view.allItineraryList['TRAIN'][index].trainItineraryOID)
                                .success(function (data) {
                                    $scope.view.trainList.push(data);
                                    if($scope.view.trainList[0].supplierOID && $scope.view.trainSupplier.length > 0){
                                        for(var i = 0; i < $scope.view.trainSupplier.length; i++){
                                            if($scope.view.trainList[0].supplierOID == $scope.view.trainSupplier[i].supplierOID){
                                                $scope.view.trainList[0].serviceName = $scope.view.trainSupplier[i].serviceName;
                                                break;
                                            }
                                        }
                                    }
                                    $scope.trainModal.show();
                                    $scope.view.showModal = true;
                                })
                                .finally(function () {
                                    $scope.view.disableSubmit = false;
                                })
                        } else if(type == 'other'){
                            $scope.view.otherTrafficList = [];
                            CustomApplicationServices.getOtherItinerary($scope.view.allItineraryList['OTHER'][index].otherItineraryOID)
                                .success(function (data) {
                                    $scope.view.otherTrafficList.push(data);
                                    $scope.otherModal.show();
                                    $scope.view.showModal = true;
                                })
                                .finally(function () {
                                    $scope.view.disableSubmit = false;
                                })
                        } else if(type == 'remark'){
                            $scope.view.selectItineraryIndex = index;
                            $scope.view.getAllRemarkItinerary();
                            $scope.remarkModal.show();
                            $scope.view.showModal = true;
                            $scope.view.disableSubmit = false;
                        } else if(type == 'allowance'){
                            $scope.view.selectItineraryIndex = index;
                            var item = angular.copy($scope.view.travelSubsidiesList[index]);
                            $scope.view.subsidiesList.push(item);
                            $scope.allowanceModal.show();
                            $scope.view.showModal = true;
                            $scope.view.disableSubmit = false;
                        }  else if(type == 'hotel'){
                            $scope.view.hotelList = [];
                            var item = angular.copy($scope.view.allItineraryList['HOTEL'][index]);
                            var hasFinish = false;
                            var date = new Date($scope.view.allItineraryList['HOTEL'][index].fromDate);
                            if($scope.view.allItineraryList['HOTEL'][index].day >= 2){
                                for(var i = 0; i < ($scope.view.allItineraryList['HOTEL'][index].day-1); i++){
                                    date = new Date(new Date(date).setDate(new Date(date).getDate() + i)).Format('yyyy-MM-dd');
                                    var dayIndex = $scope.view.selectedHotel.indexOf(date);
                                    if(dayIndex > -1){
                                        $scope.view.selectedHotel.splice(dayIndex, 1);
                                    }
                                    if(i >= $scope.view.allItineraryList['HOTEL'][index].day -2){
                                        hasFinish = true;
                                    }
                                }
                            } else {
                                hasFinish = true;
                            }
                            if(hasFinish){
                                $scope.view.hotelList.push(item);
                                if($scope.view.hotelList[0].supplierOID && $scope.view.hotelSupplier.length > 0){
                                    for(var i = 0; i < $scope.view.hotelSupplier.length; i++){
                                        if($scope.view.hotelList[0].supplierOID == $scope.view.hotelSupplier[i].supplierOID){
                                            $scope.view.hotelList[0].serviceName = $scope.view.hotelSupplier[i].serviceName;
                                            break;
                                        }
                                    }
                                }
                                $scope.hotelModal.show();
                                $scope.view.showModal = true;
                                $scope.view.disableSubmit = false;
                            }
                        }
                    }

                },
                //获取酒店已选日期
                getSelectedHotelDate: function (index, day) {
                    var date = new Date($scope.view.allItineraryList['HOTEL'][index].fromDate);
                    for(var i = 0; i < (day-1); i++){
                        date = new Date(new Date(date).setDate(new Date(date).getDate() + i)).Format('yyyy-MM-dd');
                        $scope.view.selectedHotel.push(date);
                    }
                },
                //获取所有的差旅行程
                getAllItineraryDetail: function () {
                    $scope.view.hotelList = [];
                    $scope.view.flightList = [];
                    $scope.view.otherTrafficList = [];
                    $scope.view.trainList = [];
                    $scope.view.subsidiesList = [];
                    CustomApplicationServices.getAllItinerary($stateParams.applicationOID)
                        .success(function (data) {
                            $scope.view.allItineraryList = data;
                            if ($scope.view.allItineraryList['FLIGHT'] && $scope.view.allItineraryList['FLIGHT'] && $scope.view.allItineraryList['FLIGHT'].length > 0) {
                                var flightItineraryList = $scope.view.allItineraryList['FLIGHT'];
                                for (var i = 0; i < flightItineraryList.length; i++) {
                                    flightItineraryList[i].dayStart = $scope.view.getDiffDay($scope.view.startDate, flightItineraryList[i].startDate) + 1;
                                    flightItineraryList[i].dayEnd = $scope.view.getDiffDay($scope.view.startDate, flightItineraryList[i].endDate) + 1;
                                }
                            }
                            if ($scope.view.allItineraryList['TRAIN'] && $scope.view.allItineraryList['TRAIN'].length && $scope.view.allItineraryList['TRAIN'].length > 0) {
                                var trainItineraryList = $scope.view.allItineraryList['TRAIN'];
                                for (var i = 0; i < trainItineraryList.length; i++) {
                                    trainItineraryList[i].dayStart = $scope.view.getDiffDay($scope.view.startDate, trainItineraryList[i].startDate) + 1;
                                    trainItineraryList[i].dayEnd = $scope.view.getDiffDay($scope.view.startDate, trainItineraryList[i].endDate) + 1;
                                }
                            }
                            $scope.view.selectedHotel = [];
                            if ($scope.view.allItineraryList['HOTEL'] && $scope.view.allItineraryList['HOTEL'].length && $scope.view.allItineraryList['HOTEL'].length > 0) {
                                var hotelItineraryList = $scope.view.allItineraryList['HOTEL'];
                                for (var i = 0; i < hotelItineraryList.length; i++) {
                                    hotelItineraryList[i].dayStart = $scope.view.getDiffDay($scope.view.startDate, hotelItineraryList[i].fromDate) + 1;
                                    hotelItineraryList[i].dayEnd = $scope.view.getDiffDay($scope.view.startDate, hotelItineraryList[i].leaveDate) + 1;
                                    hotelItineraryList[i].day = $scope.view.getDiffDay(hotelItineraryList[i].fromDate, hotelItineraryList[i].leaveDate) +1;
                                    $scope.view.getSelectedHotelDate(i, hotelItineraryList[i].day);
                                }
                            }
                            if ($scope.view.allItineraryList['OTHER'] && $scope.view.allItineraryList['OTHER'].length && $scope.view.allItineraryList['OTHER'].length > 0) {
                                var otherItineraryList = $scope.view.allItineraryList['OTHER'];
                                for (var i = 0; i < otherItineraryList.length; i++) {
                                    otherItineraryList[i].dayStart = $scope.view.getDiffDay($scope.view.startDate, otherItineraryList[i].startDate) + 1;
                                    otherItineraryList[i].dayEnd = $scope.view.getDiffDay($scope.view.startDate, otherItineraryList[i].endDate) + 1;
                                }
                            }
                            $scope.view.hasRemark = false; //标记是否有行程要展示
                            if ($scope.view.allItineraryList['REMARK'] && $scope.view.allItineraryList['REMARK'].length && $scope.view.allItineraryList['REMARK'].length > 0) {
                                var remarkItineraryList = $scope.view.allItineraryList['REMARK'];
                                for (var i = 0; i < remarkItineraryList.length; i++) {
                                    remarkItineraryList[i].remarkDay = $scope.view.getDiffDay($scope.view.startDate, remarkItineraryList[i].remarkDate) + 1;
                                    remarkItineraryList[i].hasItineraryRemark = false;
                                    if(remarkItineraryList[i].remark && !$scope.view.hasRemark){
                                        $scope.view.hasRemark = true;
                                    }
                                    if(remarkItineraryList[i].itineraryDetails && remarkItineraryList[i].itineraryDetails['FLIGHT'] && remarkItineraryList[i].itineraryDetails['FLIGHT'].length > 0){
                                        var flight = remarkItineraryList[i].itineraryDetails['FLIGHT'];
                                        for(var j = 0; j < flight.length; j++){
                                            if(flight[j].remark){
                                                remarkItineraryList[i].hasItineraryRemark = true;
                                                if(!$scope.view.hasRemark){
                                                    $scope.view.hasRemark = true;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    if(remarkItineraryList[i].itineraryDetails && remarkItineraryList[i].itineraryDetails['TRAIN'] && remarkItineraryList[i].itineraryDetails['TRAIN'].length > 0){
                                        var train = remarkItineraryList[i].itineraryDetails['TRAIN'];
                                        for(var j = 0; j < train.length; j++){
                                            if(train[j].remark){
                                                remarkItineraryList[i].hasItineraryRemark = true;
                                                if(!$scope.view.hasRemark){
                                                    $scope.view.hasRemark = true;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    if(remarkItineraryList[i].itineraryDetails && remarkItineraryList[i].itineraryDetails['HOTEL'] && remarkItineraryList[i].itineraryDetails['HOTEL'].length > 0){
                                        var hotel = remarkItineraryList[i].itineraryDetails['HOTEL'];
                                        for(var j = 0; j < hotel.length; j++){
                                            if(hotel[j].remark){
                                                remarkItineraryList[i].hasItineraryRemark = true;
                                                if(!$scope.view.hasRemark){
                                                    $scope.view.hasRemark = true;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    if(remarkItineraryList[i].itineraryDetails && remarkItineraryList[i].itineraryDetails['OTHER'] && remarkItineraryList[i].itineraryDetails['OTHER'].length > 0){
                                        var other = remarkItineraryList[i].itineraryDetails['OTHER'];
                                        for(var j = 0; j < other.length; j++){
                                            if(other[j].remark){
                                                remarkItineraryList[i].hasItineraryRemark = true;
                                                if(!$scope.view.hasRemark){
                                                    $scope.view.hasRemark = true;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        .error(function () {
                        })
                },
                //关闭对应的modal
                closeTicketModal: function () {
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope,
                        template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.save_itinerary') + '</p>', //是否保存行程
                        cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                        cancelType: 'button-calm',
                        okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                        cssClass: 'stop-time-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $scope.view.saveFlightItinerary()
                        } else {
                            $scope.ticketModal.hide();
                            $scope.view.showModal = false;
                        }
                    })
                },
                closeAllowanceModal: function(){
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope,
                        template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.save_allowance') + '</p>', //是否保存差补
                        cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                        cancelType: 'button-calm',
                        okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                        cssClass: 'stop-time-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $scope.view.saveAllowanceItinerary()
                        } else {
                            $scope.view.subsidiesList = [];
                            $scope.allowanceModal.hide();
                            $scope.view.showModal = false;
                        }
                    })

                },
                closeOtherModal: function () {
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope,
                        template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.save_itinerary') + '</p>', //是否保存行程
                        cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                        cancelType: 'button-calm',
                        okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                        cssClass: 'stop-time-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $scope.view.saveOtherItinerary()
                        } else {
                            $scope.otherModal.hide();
                            $scope.view.showModal = false;
                        }
                    })
                },
                hasNotSaveRemark: function () {
                    var defer = $q.defer();
                    if($scope.view.originRemarkList && $scope.view.originRemarkList.length > 0){
                        var i = 0;
                        for(; i < $scope.view.originRemarkList.length; i++){
                            if($scope.view.originRemarkList[i].remark != $scope.view.remarkItineraryList[i].remark){
                                defer.resolve(true);
                                return defer.promise;
                            }
                        }
                        if(i >= $scope.view.originRemarkList.length){
                            defer.reject(false);
                            return defer.promise;
                        }
                    } else {
                        defer.reject(false);
                        return defer.promise;
                    }
                },
                closeRemarkModal: function () {
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit = true;
                        $scope.view.hasNotSaveRemark()
                            .then(function () {
                                var confirmPopup = $ionicPopup.confirm({
                                    scope: $scope,
                                    template: '<p style="text-align: center"> ' + $filter('translate')('custom.application.tip.save_remark') + '</p>', //是否保存行程备注
                                    cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                    cancelType: 'button-calm',
                                    okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                                    cssClass: 'stop-time-popup'
                                });
                                confirmPopup.then(function (res) {
                                    if (res) {
                                        CustomApplicationServices.saveRemarkItinerary($stateParams.applicationOID, $scope.view.remarkItineraryList)
                                            .success(function () {
                                                PublicFunction.showToast($filter('translate')('custom.application.travel.save')); //已保存
                                                $scope.remarkModal.hide();
                                                $scope.view.showModal = false;
                                                $scope.view.getAllItineraryDetail();
                                            })
                                            .error(function () {
                                                PublicFunction.showToast($filter('translate')('custom.application.travel.save_fail')); //保存失败
                                            })
                                            .finally(function () {
                                                $scope.view.disableSubmit = false;
                                            })
                                    } else {
                                        $scope.view.disableSubmit = false;
                                        $scope.remarkModal.hide();
                                        $scope.view.showModal = false;
                                        $scope.view.getAllItineraryDetail();
                                    }
                                })
                            }, function () {
                                $scope.view.disableSubmit = false;
                                $scope.remarkModal.hide();
                                $scope.view.showModal = false;
                                $scope.view.getAllItineraryDetail();
                            })
                    }

                },
                saveAllRemark: function () {
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit = true;
                        CustomApplicationServices.saveRemarkItinerary($stateParams.applicationOID, $scope.view.remarkItineraryList)
                            .success(function (data) {
                                $scope.view.originRemarkList = angular.copy(data);
                                $scope.view.hasSaveRemark = true;
                                PublicFunction.showToast($filter('translate')('custom.application.travel.save')); //已保存
                                $scope.remarkModal.hide();
                                $scope.view.showModal = false;
                                $scope.view.getAllItineraryDetail();
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.save_fail')); //保存失败
                            })
                            .finally(function () {
                                $scope.view.disableSubmit = false;
                            })
                    }
                },
                closeTrainModal: function () {
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope,
                        template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.save_itinerary') + '</p>', //是否保存行程
                        cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                        cancelType: 'button-calm',
                        okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                        cssClass: 'stop-time-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $scope.view.saveTrainItinerary()
                        } else {
                            $scope.trainModal.hide();
                            $scope.view.showModal = false;
                        }
                    })

                },
                closeHotelModal: function () {
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope,
                        template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.save_itinerary') + '</p>', //是否保存行程
                        cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                        cancelType: 'button-calm',
                        okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                        cssClass: 'stop-time-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $scope.view.saveHotelItinerary()
                        } else {
                            $scope.hotelModal.hide();
                            $scope.view.showModal = false;
                        }
                    })
                },
                isBaseMessageKey: function (field) {
                    // if (field.messageKey === 'writeoff_flag' || field.messageKey === 'total_budget' || field.messageKey === 'title' || field.messageKey === 'start_date' || field.messageKey === 'remark' ||
                    //     field.messageKey === 'select_participant' || field.messageKey === 'end_date' || field.messageKey === 'currency_code' || field.messageKey === 'budget_detail' || field.messageKey === 'average_budget' ||
                    //     field.messageKey === 'select_cost_center' || field.messageKey === 'select_department' || field.messageKey === 'destination' || field.messageKey === 'out_participant_num' ||
                    //     field.messageKey === 'select_special_booking_person' || field.messageKey === 'select_approver' || field.messageKey === 'image' || field.messageKey === 'select_air_ticket_supplier' ||
                    //     field.messageKey === 'select_corporation_entity' || field.messageKey === 'linkage_switch') {
                    //     return true;
                    // } else {
                    //     return false;
                    // }
                    if (field.messageKey === 'total_budget' || field.messageKey === 'title' || field.messageKey === 'select_department' ||
                        field.messageKey === 'budget_detail' || field.messageKey === 'start_date' || field.messageKey === 'end_date' ||
                        field.messageKey === 'select_user' || field.messageKey === 'average_budget' ||
                        field.messageKey === 'date' || field.messageKey === 'time') {
                        return true;
                    } else {
                        return false;
                    }
                },
                //fieldValue 不能直接拿来用的,需要转换
                isNotNativeFieldValue: function (field) {
                    if (field.messageKey === 'writeoff_flag' || field.messageKey === 'select_cost_center' ||
                        field.messageKey === 'select_corporation_entity' || field.messageKey === 'select_approver' ||
                        field.messageKey === 'select_special_booking_person' || field.messageKey === 'linkage_switch' || field.messageKey === 'select_air_ticket_supplier' ||
                        field.messageKey === 'select_participant' || field.messageKey === 'currency_code' || field.messageKey === 'cust_list') {
                        return true
                    } else {
                        return false
                    }
                },
                goBack: function () {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.custom_application_list');
                    }
                },
                goTo: function () {
                    $state.go('app.didi_refund_base', {
                        applicationOID: $stateParams.applicationOID,
                        formType: $stateParams.formType,
                        refundStatus: $scope.view.noRefund
                    });
                },
                //删除行程
                removeRoute: function (item, index) {
                    if (!$scope.view.readOnly) {
                        var nzhcn = Nzh.cn;
                        var num = parseInt(nzhcn.decodeS(item)) - 1;
                        $scope.view.applicationData.travelApplication.travelItinerarys[num].travelItineraryTraffics.splice(index, 1);
                    }
                },
                //删除元素
                removeElement: function (item, index) {
                    if (!$scope.view.readOnly) {
                        var nzhcn = Nzh.cn;
                        var num = parseInt(nzhcn.decodeS(item)) - 1;
                        $scope.view.applicationData.travelApplication.travelItinerarys[num].travelElements.splice(index, 1);
                    }
                },
                showOpinionPopup: function () {
                    $scope.view.rejectReason = null;
                    opinionPopup = $ionicPopup.show({
                        template: '<textarea type="text" style="padding:10px;" placeholder="' + $filter('translate')('form.please.input') + '" ng-model="view.rejectReason" rows="6" maxlength="100">',
                        title: '<h5>' + $filter('translate')('common.reject.reason') + '</h5>',
                        scope: $scope,
                        buttons: [
                            {text: $filter('translate')('common.cancel')},
                            {
                                text: $filter('translate')('common.ok'),
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.view.rejectReason) {
                                        $ionicLoading.show({
                                            template: $filter('translate')('form.please.input') + $filter('translate')('common.reject.reason'),
                                            duration: '500'
                                        });
                                        e.preventDefault();
                                    } else {
                                        return $scope.view.rejectReason;
                                    }
                                }
                            }
                        ]
                    });
                    opinionPopup.then(function (res) {
                        if (res) {
                            $scope.view.reject();
                        } else {
                        }
                    });
                },
                //改签
                endorse: function (index) {
                    $scope.view.refundMessage = {
                        type: 1002, //1001退票 1002 改签
                        remark: null,
                        travelOrderOID: $scope.view.applicationData.travelOrders[index].travelOrderOID
                    };
                    $scope.refundDialog.show();
                },
                //退票
                refund: function (index) {
                    $scope.view.refundMessage = {
                        type: 1001, //1001退票 1002 改签
                        remark: null,
                        travelOrderOID: $scope.view.applicationData.travelOrders[index].travelOrderOID
                    };
                    $scope.refundDialog.show();
                },
                //保存退改签
                saveRefund: function () {
                    if ($scope.view.refundMessage.type === 1001) {
                        CustomApplicationServices.refund($scope.view.refundMessage)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                $scope.refundDialog.hide();
                            })
                            .error(function (error) {
                                if(error.message){
                                    PublicFunction.showToast(error.message)
                                } else {
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                                }
                            })
                    } else if ($scope.view.refundMessage.type === 1002) {
                        CustomApplicationServices.endorse($scope.view.refundMessage)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                $scope.refundDialog.hide();
                            })
                            .error(function (error) {
                                if(error.message){
                                    PublicFunction.showToast(error.message)
                                } else {
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                                }
                            })
                    }

                },
                //订票申请展示机票信息
                showDetail: function (index) {
                    $scope.view.applicationData.travelOrders[index].showDetail = !$scope.view.applicationData.travelOrders[index].showDetail;
                },
                //差旅申请展示行程
                changeExpand: function (index) {
                    $scope.view.applicationData.travelApplication.travelItinerarys[index].isExpand = !$scope.view.applicationData.travelApplication.travelItinerarys[index].isExpand;
                },
                expandTravelMember: function () {
                    $scope.view.showTravelMember = !$scope.view.showTravelMember;
                    $ionicScrollDelegate.$getByHandle('expenseReportScroll').scrollTop();
                },
                withdrawApplication: function () {
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit  = true;
                        var data = {
                            entities: []
                        };
                        var entitty = {};
                        entitty.entityOID = $stateParams.applicationOID;
                        entitty.entityType = 1001;
                        data.entities.push(entitty);
                        CustomApplicationServices.setTab('init');
                        CustomApplicationServices.withdrawApplication(data)
                            .success(function (data) {
                                if (data.failNum > 0) {
                                    PublicFunction.showToast($filter('translate')('status.error'));
                                } else {
                                    PublicFunction.showToast($filter('translate')('status.withdrawed'));
                                    $timeout(function () {
                                        $scope.view.goBack();
                                    }, 200);
                                }
                            })
                            .finally(function () {
                                $scope.view.disableSubmit  = false;
                            })
                    }

                },
                //编辑差旅申请基本信息
                editBase: function () {
                    $scope.view.isHandEdit = true;
                    if(!$scope.view.disableSubmit){
                        $scope.view.disableSubmit = true;
                        PublicFunction.showLoading();
                        var item = angular.copy($scope.view.applicationData);
                        item.customFormProperties = null;
                        var travelSubsidies = angular.copy($scope.view.travelSubsidiesList);
                        var finish = false;
                        if($scope.view.travelSubsidiesList.length > 0){
                            var i = 0;
                            while(i < travelSubsidies.length){
                                travelSubsidies[i].detailList = null;
                                travelSubsidies[i].expenseType = null;
                                i++;
                            }
                            if(i >= travelSubsidies.length -1){
                                item.travelApplication.travelSubsidies = JSON.stringify(travelSubsidies);
                                finish = true;
                            }
                        } else {
                            item.travelApplication.travelSubsidies = null;
                            finish = true;
                        }
                        if(finish){
                            TravelERVService.travelDraft(item)
                                .success(function (data) {
                                    $state.go('app.custom_application_edit', {
                                        applicationOID: $scope.view.applicationData.applicationOID,
                                        formType: $scope.view.applicationData.formType
                                    });
                                })
                                .error(function(error){
                                    if(error.message){
                                        PublicFunction.showToast(error.message)
                                    } else {
                                        PublicFunction.showToast($filter('translate')('status.error'));
                                    }
                                })
                                .finally(function () {
                                    $scope.view.disableSubmit = false;
                                    $ionicLoading.hide();
                                })
                        }
                    }
                },
                agree: function () {
                    if(!$scope.view.disableApproval){
                        $scope.view.disableApproval = true;
                        PublicFunction.showLoading();
                        var entry = {};
                        entry.entities = [];
                        var entryItem = {};
                        entryItem.entityOID = $stateParams.applicationOID;
                        entryItem.entityType = 1001;
                        entry.entities.push(entryItem);
                        entry.approvalTxt = '';
                        ApprovalERVService.agree(entry)
                            .success(function (data) {
                                $ionicLoading.hide();
                                if (data.failNum > 0) {
                                    PublicFunction.showToast($filter('translate')('status.error'));
                                } else {
                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                    $timeout(function () {
                                        $scope.view.goBack();
                                    }, 500);
                                }
                            })
                            .error(function (error) {
                                $ionicLoading.hide();
                                if(error.message){
                                    PublicFunction.showToast(error.message)
                                } else {
                                    PublicFunction.showToast($filter('translate')('status.error'));
                                }
                            })
                            .finally(function () {
                                $scope.view.disableApproval = false;
                            })
                    }

                },
                reject: function () {
                    if(!$scope.view.disableApproval) {
                        $scope.view.disableApproval = true;
                        PublicFunction.showLoading();
                        var entry = {};
                        entry.entities = [];
                        var entryItem = {};
                        entryItem.entityOID = $stateParams.applicationOID;
                        entryItem.entityType = 1001;
                        entry.entities.push(entryItem);
                        entry.approvalTxt = $scope.view.rejectReason;
                        ApprovalERVService.reject(entry)
                            .success(function (data) {
                                $ionicLoading.hide();
                                if (data.failNum > 0) {
                                    PublicFunction.showToast($filter('translate')('status.error'));
                                } else {
                                    PublicFunction.showToast($filter('translate')('status.rejected'));
                                    $timeout(function () {
                                        $scope.view.goBack();
                                    }, 500);
                                }
                            })
                            .error(function (error) {
                                $ionicLoading.hide();
                                if(error.message){
                                    PublicFunction.showToast(error.message)
                                } else {
                                    PublicFunction.showToast($filter('translate')('status.error'));
                                }
                            })
                            .finally(function () {
                                $scope.view.disableApproval = false;
                            })
                    }

                },
                //获取差旅要素成本中心名字
                getElementCostCenterName: function (elementIndex, index, valueIndex) {
                    CostCenterService.getCostCenterItemDetail($scope.view.applicationData.travelApplication.travelItinerarys[elementIndex].travelElements[index][valueIndex].value)
                        .success(function (data) {
                            $scope.view.applicationData.travelApplication.travelItinerarys[elementIndex].travelElements[index][valueIndex].costCenterName = data.name;
                        })
                        .error(function () {
                            $scope.view.applicationData.travelApplication.travelItinerarys[elementIndex].travelElements[index][valueIndex].costCenterName = null;
                        })
                },
                //获取差旅要素详情
                getTravelElementName: function (elementIndex, index) {
                    var array = $scope.view.applicationData.travelApplication.travelItinerarys[elementIndex].travelElements[index];
                    if (array.length > 0) {
                        for (var i = 0; i < array.length; i++) {
                            if (array[i].dataSource !== '' && array[i].dataSource !== null && array[i].messageKey === 'select_cost_center') {
                                var json = JSON.parse(array[i].dataSource);
                                $scope.view.applicationData.travelApplication.travelItinerarys[elementIndex].travelElements[index][i].costCenterOID = json.costCenterOID;
                                if ($scope.view.applicationData.travelApplication.travelItinerarys[elementIndex].travelElements[index][i].value) {
                                    $scope.view.getElementCostCenterName(elementIndex, index, i);
                                } else {
                                    $scope.view.applicationData.travelApplication.travelItinerarys[elementIndex].travelElements[index][i].costCenterName = null;
                                }
                            }
                        }
                    }
                },
                //获取成本中心名字
                getCostCenterName: function (index) {
                    var indexCostCenter = index;
                    try{
                        var json = JSON.parse($scope.view.applicationData.custFormValues[indexCostCenter].dataSource);
                        $scope.view.applicationData.custFormValues[indexCostCenter].costCenterOID = json.costCenterOID;
                    } catch(error){

                    }
                    if ($scope.view.applicationData.custFormValues[indexCostCenter].value) {
                        CostCenterService.getCostCenterItemDetail($scope.view.applicationData.custFormValues[indexCostCenter].value)
                            .success(function (data) {
                                $scope.view.applicationData.custFormValues[indexCostCenter].costCenterName = data.name;
                            })
                            .error(function () {
                                $scope.view.applicationData.custFormValues[indexCostCenter].costCenterName = null;
                            })
                    } else {
                        $scope.view.applicationData.custFormValues[indexCostCenter].costCenterName = null;
                    }
                },
                //获取部门
                getDepartmentName: function (index) {
                    SelfDefineExpenseReport.getDepartmentInfo($scope.view.applicationData.custFormValues[index].value)
                        .success(function (data) {
                            if ($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]) {
                                $scope.view.applicationData.custFormValues[index].departmentName = data.name;
                            } else {
                                $scope.view.applicationData.custFormValues[index].departmentName = data.path;
                            }
                        })
                },
                //获取已选择审批人的名字
                getSelectedApproval: function (index) {
                    var uerOID = [];
                    if ($scope.view.applicationData.custFormValues[index].value !== null && $scope.view.applicationData.custFormValues[index].value !== '') {
                        uerOID = $scope.view.applicationData.custFormValues[index].value.split(":");
                        $scope.view.applicationData.custFormValues[index].approvalSelectedName = '';
                        if (uerOID.length > 0) {
                            $scope.view.applicationData.custFormValues[index].memberList = [uerOID.length];
                            TravelERVService.getBatchUsers(uerOID)
                                .success(function (data) {
                                    var num = 0;
                                    for (; num < data.length; num++) {
                                        for (var j = 0; j < uerOID.length; j++) {
                                            if (uerOID[j] === data[num].userOID) {
                                                $scope.view.applicationData.custFormValues[index].memberList[j] = data[num];
                                            }
                                        }
                                    }
                                    if (num === data.length) {
                                        for (var i = 0; i < $scope.view.applicationData.custFormValues[index].memberList.length; i++) {
                                            if (i !== ($scope.view.applicationData.custFormValues[index].memberList.length - 1)) {
                                                $scope.view.applicationData.custFormValues[index].approvalSelectedName += $scope.view.applicationData.custFormValues[index].memberList[i].fullName + ','
                                            } else {
                                                $scope.view.applicationData.custFormValues[index].approvalSelectedName += $scope.view.applicationData.custFormValues[index].memberList[i].fullName;
                                            }
                                        }
                                    }
                                })
                        } else {
                            $scope.view.applicationData.custFormValues[index].memberList = [];
                            $scope.view.applicationData.custFormValues[index].approvalSelectedName = '';
                        }

                    } else {
                        $scope.view.applicationData.custFormValues[index].approvalSelectedName = '';
                    }
                },
                //判断是否有行程
                hasTraffics: function () {
                    //新版差旅申请
                    if($scope.view.applicationData.travelApplication.manageType != null && $scope.view.applicationData.travelApplication.manageType != ''){
                        if((!$scope.view.allItineraryList && $scope.view.travelSubsidiesList.length == 0) || ((!$scope.view.allItineraryList['FLIGHT'] || $scope.view.allItineraryList['FLIGHT'].length == 0) && (!$scope.view.allItineraryList['TRAIN'] || $scope.view.allItineraryList['TRAIN'].length == 0)
                            && (!$scope.view.allItineraryList['HOTEL'] || $scope.view.allItineraryList['HOTEL'].length == 0) && (!$scope.view.allItineraryList['OTHER'] || $scope.view.allItineraryList['OTHER'].length == 0) && $scope.view.travelSubsidiesList.length == 0)){
                            return false
                        } else {
                            return true
                        }
                    } else {
                        for (var i = 0; i < $scope.view.applicationData.travelApplication.travelItinerarys.length; i++) {
                            var traffics = $scope.view.applicationData.travelApplication.travelItinerarys[i].travelItineraryTraffics;
                            if (traffics && traffics.length > 0) {
                                return true
                            }
                        }
                        return false
                    }
                },
                //保存差旅申请
                saveApplication: function () {
                    if(!$scope.view.disableSubmit) {
                        $scope.view.disableSubmit = true;
                        PublicFunction.showLoading();
                        CustomApplicationServices.setTab('init');
                        var item = angular.copy($scope.view.applicationData);
                        item.customFormProperties = null;
                        var travelSubsidies = angular.copy($scope.view.travelSubsidiesList);
                        var finish = false;
                        if($scope.view.travelSubsidiesList.length > 0){
                            var i = 0;
                            while(i < travelSubsidies.length){
                                travelSubsidies[i].detailList = null;
                                travelSubsidies[i].expenseType = null;
                                i++;
                            }
                            if(i >= travelSubsidies.length -1){
                                item.travelApplication.travelSubsidies = JSON.stringify(travelSubsidies);
                                finish = true;
                            }
                        } else {
                            item.travelApplication.travelSubsidies = null;
                            finish = true;
                        }
                        if(finish){
                            TravelERVService.travelDraft(item)
                                .success(function (data) {
                                    $ionicLoading.hide();
                                    PublicFunction.showToast($filter('translate')('status.saved'));
                                    $timeout(function () {
                                        $scope.view.goBack();
                                    }, 500);
                                })
                                .error(function(error){
                                    $ionicLoading.hide();
                                    if(error.message){
                                        PublicFunction.showToast(error.message)
                                    } else {
                                        PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                                    }
                                })
                                .finally(function () {
                                    $scope.view.disableSubmit = false;
                                })
                        }
                    }
                },
                deleteApplication: function () {  //删除申请单
                    if(!$scope.view.disableSubmit) {
                        $scope.view.disableSubmit = true;
                        CustomApplicationServices.setTab('init');
                        PublicFunction.showLoading();
                        if($stateParams.applicationOID){
                            CustomApplicationServices.deleteApplicationForAll($stateParams.applicationOID)
                                .success(function () {
                                    $ionicLoading.hide();
                                    PublicFunction.showToast($filter('translate')('status.deleted'));
                                    $timeout(function () {
                                        $scope.view.goBack();
                                    }, 500);
                                })
                                .error(function(error){
                                    if(error.message){
                                        PublicFunction.showToast(error.message)
                                    } else {
                                        PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                                    }
                                })
                                .finally(function () {
                                    $scope.view.disableSubmit = false;
                                })

                        } else {
                            $scope.view.disableSubmit = false;
                        }
                    }

                },
                //检查差旅申请的行程是否为空
                checkItinerary: function (travelApplication) {
                    var deferred = $q.defer();
                    var hasItinerary = true;
                    if($scope.view.applicationData.customFormProperties.manageType != null && $scope.view.applicationData.customFormProperties.manageType != ''){
                        //新版差旅申请
                        if($scope.view.allItineraryList && (!$scope.view.allItineraryList['FLIGHT'] || $scope.view.allItineraryList['FLIGHT'].length == 0) && (!$scope.view.allItineraryList['TRAIN'] || $scope.view.allItineraryList['TRAIN'].length == 0)
                            && (!$scope.view.allItineraryList['HOTEL'] || $scope.view.allItineraryList['HOTEL'].length == 0) && (!$scope.view.allItineraryList['OTHER'] || $scope.view.allItineraryList['OTHER'].length == 0)
                            && (!$scope.view.travelSubsidiesList || $scope.view.travelSubsidiesList.length == 0)){
                            hasItinerary = false;
                        } else {
                            deferred.resolve(true);
                            return deferred.promise;
                        }
                    } else {
                        var itinerary = travelApplication.travelItinerarys;
                        if(itinerary && itinerary.length && itinerary.length > 0){
                            for (var i = 0; i < itinerary.length; i++) {
                                if (itinerary[i].travelItineraryTraffics && itinerary[i].travelItineraryTraffics.length > 0)
                                {
                                    hasItinerary = false;
                                    deferred.resolve(true);
                                    return deferred.promise;
                                }
                                if(i >= itinerary.length -1){
                                    hasItinerary = false;
                                }
                            }
                        } else {
                            hasItinerary = false;
                        }
                    }
                    if(!hasItinerary){
                        //您没有添加任何行程信息，可能导致无法在供应商处下单，确认要提交么？
                        var confirmPopup = $ionicPopup.confirm({
                            title: '提示',
                            template: '<p style="text-align: center">' + $filter('translate')('custom.application.travel.no_traffic_warn') + '</p>',
                            cancelText: $filter('translate')('common.cancel'),
                            cancelType: 'button-calm',
                            okText: $filter('translate')('common.ok'),
                            cssClass: 'stop-time-popup'
                        });
                        confirmPopup.then(function (result) {
                            if (result){
                                deferred.resolve(true);
                                return deferred.promise;
                            } else {
                                deferred.reject(false);
                                return deferred.promise;
                            }
                        })
                    }
                    return deferred.promise;
                },
                hideBookTicket: function () {
                    $scope.view.disableSubmit = false;
                    $scope.view.showModal = false;
                    $scope.bookTicketModal.hide();
                },
                hideHotelBooker: function (flag) {
                    if(flag){
                        if($scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks.length == $scope.view.hotelRoomData.femaleRoomNumber &&
                            $scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks.length == $scope.view.hotelRoomData.maleRoomNumber){
                            $scope.hotelBookerModal.hide();
                        }
                    } else {
                        $scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks = angular.copy($scope.view.travelHotelBookingMaleClerks);
                        $scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks = angular.copy($scope.view.travelHotelBookingFemaleClerks);
                        $scope.hotelBookerModal.hide();
                    }

                },
                bookSure: function () {
                    $scope.view.showModal = false;
                    $scope.bookTicketModal.hide();
                    $scope.view.submitTravelApplication();
                },

                submitTravelApplication: function () {
                    PublicFunction.showLoading();
                    CustomApplicationServices.setTab('submit');
                    var item = angular.copy($scope.view.applicationData);
                    item.customFormProperties = null;
                    var travelSubsidies = angular.copy($scope.view.travelSubsidiesList);
                    var finish = false;
                    if($scope.view.travelSubsidiesList.length > 0){
                        var i = 0;
                        while(i < travelSubsidies.length){
                            travelSubsidies[i].detailList = null;
                            travelSubsidies[i].expenseType = null;
                            i++;
                        }
                        if(i >= travelSubsidies.length -1){
                            item.travelApplication.travelSubsidies = JSON.stringify(travelSubsidies);
                            finish = true;
                        }
                    } else {
                        item.travelApplication.travelSubsidies = null;
                        finish = true;
                    }
                    if(finish){
                        TravelERVService.submitTravel(item)
                            .success(function (data) {
                                $ionicLoading.hide();
                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                $timeout(function () {
                                    $scope.view.goBack();
                                }, 500);

                            })
                            .error(function (error) {
                                $ionicLoading.hide();
                                var validationErrors = error && error.validationErrors;
                                if(validationErrors && validationErrors.length > 0 &&
                                    validationErrors[0].externalPropertyName === 'operation.error' &&
                                    validationErrors[0].message === 'not find approver'){
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.notFoundApprover'));//找不到审批人
                                }else if(validationErrors && validationErrors.length >0){
                                    PublicFunction.showToast(validationErrors[0].message);
                                } else if(error.message){
                                    PublicFunction.showToast(error.message);
                                } else {
                                    PublicFunction.showToast($filter('translate')('status.error'));
                                }
                            })
                            .finally(function () {
                                $scope.view.disableSubmit = false;
                            })
                    }
                },
                budgetCancel:function () {
                    $scope.budgetPopover.hide();
                },
                budgetSubmit:function () {
                    return true;
                },
                //提交差旅申请
                submitTravel: function ($event) {
                    if ($scope.view.functionProfileList && $scope.view.functionProfileList['ta.itinerary.required'] && !$scope.view.hasTraffics()) {
                        PublicFunction.showToast($filter('translate')('custom.application.travel.please.add.traffic'));
                        return
                    }
                    else {
                        //检查差旅申请的行程是否为空
                        $scope.view.checkItinerary($scope.view.applicationData.travelApplication)
                            .then(function () {
                            PublicFunction.showProcessLoading();
                            if(!$scope.view.disableSubmit){
                                $scope.view.disableSubmit = true;
                                var item = angular.copy($scope.view.applicationData);
                                item.customFormProperties = null;
                                TravelERVService.checkBudgetTravel(item)
                                    .success(function (res) {
                                        //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                        if(res) {
                                            //清除计时器
                                            clearInterval($rootScope.waitInterval);
                                            $ionicLoading.hide();
                                            //新版差旅
                                            if ($scope.view.applicationData.travelApplication.manageType != null && $scope.view.applicationData.travelApplication.manageType != '') {
                                                CustomApplicationServices.getMaxTicket($scope.view.applicationData.applicationOID)
                                                    .success(function (data) {
                                                        $scope.view.ticketMessage = data;
                                                        //不用显示统一订票信息
                                                        if (!$scope.view.ticketMessage.HOTEL && !$scope.view.ticketMessage.FLIGHT) {
                                                            $scope.view.submitTravelApplication();
                                                        } else {
                                                            //显示统一订票信息
                                                            if($scope.view.ticketMessage.maxTicketNumber){
                                                                $scope.view.applicationData.travelApplication.maxTicketAmount = $scope.view.ticketMessage.maxTicketNumber;
                                                            }
                                                            $scope.view.showModal = true;
                                                            $scope.view.applicationData.travelApplication.uniformBooking = true;
                                                            $scope.view.applicationData.travelApplication.hotelUniformBooking = true;
                                                            if(!$scope.view.applicationData.travelApplication.bookingClerkOID){
                                                                $scope.view.applicationData.travelApplication.bookingClerkOID =  $scope.view.applicationData.applicantOID;
                                                                $scope.view.applicationData.travelApplication.bookingClerkName = $scope.view.applicationData.applicantName;
                                                            }
                                                            if(!$scope.view.applicationData.travelApplication.hotelBookingClerkOID){
                                                                $scope.view.applicationData.travelApplication.hotelBookingClerkOID = $scope.view.applicationData.applicantOID;
                                                                $scope.view.applicationData.travelApplication.hotelBookingClerkName = $scope.view.applicationData.applicantName;
                                                            }
                                                            $scope.bookTicketModal.show();
                                                        }
                                                    })
                                                    .error(function () {
                                                        $scope.view.submitTravelApplication();
                                                    })
                                            } else {
                                                $scope.view.submitTravelApplication();
                                            }
                                            TravelERVService.saveErrorMsg($scope.view.applicationData.applicationOID,null)
                                                .success(function () {

                                                })
                                        }
                                        // } else{
                                        //     clearInterval($rootScope.waitInterval);
                                        //     // $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                        //         if($scope.view.budgetSubmit()){
                                        //             if($scope.view.applicationData.travelApplication.manageType != null && $scope.view.applicationData.travelApplication.manageType != ''){
                                        //                 CustomApplicationServices.getMaxTicket($scope.view.applicationData.applicationOID)
                                        //                     .success(function (data) {
                                        //                         $scope.view.ticketMessage = data;
                                        //                         //不用显示统一订票信息
                                        //                         if(!$scope.view.ticketMessage.HOTEL && !$scope.view.ticketMessage.FLIGHT && !$scope.view.applicationData.customFormProperties.maxTicketAmountModifiedEnable){
                                        //                             $scope.view.submitTravelApplication();
                                        //                         } else {
                                        //                             //显示统一订票信息
                                        //                             $scope.view.showModal = true;
                                        //                              $scope.view.applicationData.travelApplication.uniformBooking = true;
                                        //                              $scope.view.applicationData.travelApplication.hotelUniformBooking = true;
                                        //                              $scope.view.applicationData.travelApplication.bookingClerkOID =  $scope.view.applicationData.applicantOID;
                                        //                              $scope.view.applicationData.travelApplication.bookingClerkName = $scope.view.applicationData.applicantName;
                                        //                             $scope.bookTicketModal.show();
                                        //                         }
                                        //                     })
                                        //                     .error(function () {
                                        //                         $scope.view.submitTravelApplication();
                                        //                     })
                                        //             } else {
                                        //                 $scope.view.submitTravelApplication();
                                        //             }
                                        //         }
                                        //
                                        //     // })
                                        // }
                                    })
                                    .error(function (error) {
                                        //清除计时器
                                        clearInterval($rootScope.waitInterval);
                                        if(error.validationErrors && error.validationErrors.length>0){
                                            $scope.budgetError=error.validationErrors;
                                            $scope.budgetError.forEach(function (item) {
                                                item.errorMsg=[];
                                                if(item.message){
                                                    item.errorMsg = item.message.split(",").map(function(item, index) {
                                                        return {id: index, msg: item}
                                                    })
                                                }
                                            });
                                            $ionicLoading.hide();
                                            $scope.budgetPopover.show($event);
                                            if ($scope.budgetError && $scope.budgetError.length >0) {
                                                var msg = {};
                                                $scope.budgetError.forEach(function (item) {
                                                    msg.externalPropertyName=item.externalPropertyName;
                                                    msg.message=item.message;
                                                });
                                                var msgStr=JSON.stringify(msg);
                                                TravelERVService.saveErrorMsg($scope.view.applicationData.applicationOID,msgStr)
                                                    .success(function () {

                                                    })
                                            }
                                        }else if(error.message && !error.validationErrors && error.validationErrors.length===0){
                                            PublicFunction.showToast(error.message);
                                        }
                                        // if($scope.view.budgetSubmit()){
                                        //     if ($scope.budgetError && $scope.budgetError.length >0) {
                                        //         var msg = {};
                                        //         $scope.budgetError.forEach(function (item) {
                                        //             msg.externalPropertyName=item.externalPropertyName;
                                        //             msg.message=item.message;
                                        //         });
                                        //         data.warning=msg;
                                        //         TravelERVService.saveErrorMsg(data)
                                        //             .success(function () {
                                        //
                                        //             })
                                        //     }
                                        //     if($scope.view.applicationData.travelApplication.manageType != null && $scope.view.applicationData.travelApplication.manageType != ''){
                                        //         CustomApplicationServices.getMaxTicket($scope.view.applicationData.applicationOID)
                                        //             .success(function (data) {
                                        //                 $scope.view.ticketMessage = data;
                                        //                 //不用显示统一订票信息
                                        //                 if(!$scope.view.ticketMessage.HOTEL && !$scope.view.ticketMessage.FLIGHT && !$scope.view.applicationData.customFormProperties.maxTicketAmountModifiedEnable){
                                        //                     $scope.view.submitTravelApplication();
                                        //                 } else {
                                        //                     //显示统一订票信息
                                        //                     $scope.view.showModal = true;
                                        //                     $scope.bookTicketModal.show();
                                        //                 }
                                        //             })
                                        //             .error(function () {
                                        //                 $scope.view.submitTravelApplication();
                                        //             })
                                        //     } else {
                                        //         $scope.view.submitTravelApplication();
                                        //     }
                                        // }
                                    })
                                    .finally(function () {
                                        $scope.view.disableSubmit = false;
                                    })
                                }
                            })
                    }
                },
                //计算汇率差异,保留一位小数的百分数;四舍五入
                getRateDiff:function (actualCurrencyRate,companyCurrencyRate){
                    var a= (actualCurrencyRate-companyCurrencyRate)*100/companyCurrencyRate;
                    var b=parseInt(a*10);
                    var c=b/10;
                    if(c<0){
                        c=(-c);
                    }
                    return c+"%";
                },
                //获取费用列表
                getInvoiceList: function (index) {
                    $scope.view.invoiceTitle = $scope.view.applicationData.custFormValues[index].fieldName;
                    var json = JSON.parse($scope.view.applicationData.custFormValues[index].value);

                    if(json && json.budgetDetail){
                        $scope.view.invoiceList = json.budgetDetail;
                        $scope.view.invoiceList.forEach(function(item,index){
                            item.selfCurrencyRateCurrencyRate=$scope.view.getRateDiff(item.actualCurrencyRate,item.companyCurrencyRate)
                        })
                        if($scope.view.applicationData.formType===2001 && $scope.view.applicationData.travelApplication.baseCurrencyAmount){
                            //类型是2001,兼容老数据,差旅申请单
                            $scope.view.amount = $scope.view.applicationData.travelApplication.baseCurrencyAmount;
                        }else if($scope.view.applicationData.formType===2002 && $scope.view.applicationData.expenseApplication.baseCurrencyAmount){
                            //类型是2002,兼容老数据,费用申请单
                            $scope.view.amount = $scope.view.applicationData.expenseApplication.baseCurrencyAmount;
                        }else {
                            $scope.view.amount = json.amount;
                        }
                    }

                },
                //差旅要素表单
                getBatchElement: function (index) {
                    for (var j = 0; j < $scope.view.applicationData.travelApplication.travelItinerarys[index].travelElements.length; j++) {
                        $scope.view.getTravelElementName(index, j)
                    }
                },
                //初始化订票按钮状态
                getOrderTicketStatus: function () {
                    var today = new Date().getTime() / 1000;
                    var endDay = new Date(new Date($scope.view.endDate).Format('yyyy/MM/dd') + ' 23:59:59').getTime() / 1000;
                    if (today > endDay) {
                        $scope.view.disabledHotel = true;
                        $scope.view.disabledPlane = true;
                        $scope.view.disabledTrain = true;
                    } else {
                        if($scope.view.applicationData.customFormProperties && $scope.view.applicationData.customFormProperties.manageType &&
                            $scope.view.applicationData.customFormProperties.manageType != '' && $scope.view.applicationData.customFormProperties.manageType != null){
                            if($scope.view.allItineraryList && $scope.view.allItineraryList['FLIGHT'] && $scope.view.allItineraryList['FLIGHT'].length > 0){
                                $scope.view.disabledPlane = false;
                            }
                            if($scope.view.allItineraryList && $scope.view.allItineraryList['TRAIN'] && $scope.view.allItineraryList['TRAIN'].length > 0){
                                $scope.view.disabledTrain = false;
                            }
                            if($scope.view.allItineraryList && $scope.view.allItineraryList['HOTEL'] && $scope.view.allItineraryList['HOTEL'].length > 0){
                                $scope.view.disabledHotel = false;
                            }
                        }
                        for (var i = 0; i < $scope.view.applicationData.travelApplication.travelItinerarys.length; i++) {
                            for (var j = 0; j < $scope.view.applicationData.travelApplication.travelItinerarys[i].travelItineraryTraffics.length; j++) {
                                if ($scope.view.applicationData.travelApplication.travelItinerarys[i].travelItineraryTraffics[j].trafficType === 1001) {
                                    $scope.view.disabledPlane = false;
                                } else if ($scope.view.applicationData.travelApplication.travelItinerarys[i].travelItineraryTraffics[j].trafficType === 1002) {
                                    $scope.view.disabledTrain = false;
                                }
                            }
                        }
                    }
                },
                //买飞机票
                orderPlaneTicket: function () {
                    var pageType = 1002;
                    if(!$scope.view.disabled) {
                        $scope.view.disabled = true;
                        TravelERVService.getSsoSupplierUrl($scope.view.supplierOID, pageType, $scope.view.applicationData.travelApplication.businessCode)
                            .success(function (data) {
                                ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=no,toolbar=no');
                                ref.addEventListener('loadstart', inAppBrowserLoadStart);
                                ref.addEventListener('exit', inAppBrowserClose);
                            })
                            .finally(function () {
                                $scope.view.disabled = false;
                            })
                    }
                },
                orderFlightTicket: function (index) {
                    var pageType = 1002;
                    if($scope.view.allItineraryList['FLIGHT'][index].supplierOID == $scope.view.ctripFlightOID){
                        if(!$scope.view.disabled) {
                            $scope.view.disabled = true;
                            CtripService.judgeCardEnable().then(function (res) {
                                if (res.data.result) {
                                    TravelERVService.getSsoSupplierUrl($scope.view.allItineraryList['FLIGHT'][index].supplierOID, pageType, $scope.view.allItineraryList['FLIGHT'][index].approvalNum)
                                        .success(function (data) {
                                            ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=no,toolbar=no');
                                            ref.addEventListener('loadstart', inAppBrowserLoadStart);
                                            ref.addEventListener('exit', inAppBrowserClose);
                                        })
                                        .finally(function () {
                                            $scope.view.disabled = false;
                                        })
                                } else {
                                    $state.go('app.ctrip_no_card');
                                    $scope.view.disabled = false;
                                }
                            }, function () {
                                $scope.view.disabled = false;
                            });
                        }

                    } else {
                        if(!$scope.view.disabled) {
                            $scope.view.disabled = true;
                            TravelERVService.getSsoSupplierUrl($scope.view.allItineraryList['FLIGHT'][index].supplierOID, pageType, $scope.view.allItineraryList['FLIGHT'][index].approvalNum)
                                .success(function (data) {
                                    ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=no,toolbar=no');
                                    ref.addEventListener('loadstart', inAppBrowserLoadStart);
                                    ref.addEventListener('exit', inAppBrowserClose);
                                })
                                .finally(function () {
                                    $scope.view.disabled = false;
                                })
                        }
                    }
                },
                orderTrainTicket: function () {
                    if ($scope.view.hasTongCheng) {
                        if(!$scope.view.disableSubmit){
                            $scope.view.disableSubmit = true;
                            TravelERVService.getTongChengOrderUrl()
                                .success(function (data) {
                                    ref = cordova.InAppBrowser.open(data.url, '_blank',
                                        "location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=" +
                                        $filter('translate')('custom.application.travel.returnHuiLianYi'),
                                        $filter('translate')('vendor.train'));

                                    ref.addEventListener('loadstart', inAppBrowserLoadStart);
                                    ref.addEventListener('exit', inAppBrowserClose);
                                })
                                .error(function (error) {
                                    $ionicLoading.hide();
                                    if(error.message){
                                        PublicFunction.showToast(error.message)
                                    } else {
                                        PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                                    }
                                })
                                .finally(function () {
                                    $scope.view.disableSubmit = false;
                                })
                        }

                    } else {
                        PublicFunction.showToast($filter('translate')('error.service.no.open'));
                    }
                },
                //根据供应商定酒店
                orderTrainSupplier: function (index) {
                    var pageType = 1006;
                    if(!$scope.view.disabled){
                        $scope.view.disabled = true;
                        TravelERVService.getSsoSupplierUrl($scope.view.allItineraryList['TRAIN'][index].supplierOID, pageType, $scope.view.allItineraryList['TRAIN'][index].approvalNum)
                            .success(function (data) {
                                ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=no,toolbar=no');
                                ref.addEventListener('loadstart', inAppBrowserLoadStart);
                                ref.addEventListener('exit', inAppBrowserClose);
                            })
                            .finally(function () {
                                $scope.view.disabled = false;
                            })
                    }

                },
                orderHotelTicket: function () {
                    if ($scope.view.hasCtrip) {
                        // CtripService.goTravelBefore('HotelSearch');
                        if(!$scope.view.disableSubmit) {
                            $scope.view.disableSubmit = true;
                            CtripService.getCtripSSOUrl('HotelSearch')
                                .success(function (data) {
                                    var ctripData = "Token=" + data.Token + "&Appid=" + data.Appid +
                                        "&InitPage=" + data.InitPage + "&AccessUserId=" + data.AccessUserId +
                                        "&EmployeeId=" + data.EmployeeId + "&URL=" + data.URL + "&EndorsementID=" + data.EndorsementID+
                                        "&BackURL=" + encodeURIComponent($location.absUrl());
                                    ref = cordova.InAppBrowser.open(ServiceBaseURL.url + '/jumpbox_v2.html?' + ctripData, '_blank', 'location=no,toolbar=no');
                                    ref.addEventListener('loadstart', inAppBrowserLoadStart);
                                    ref.addEventListener('exit', inAppBrowserClose);
                                })
                                .finally(function () {
                                    $scope.view.disableSubmit = false;
                                })
                        }
                    } else {
                        PublicFunction.showToast($filter('translate')('error.service.no.open'));
                    }
                },
                //根据供应商定酒店
                orderHotelSupplier: function (index) {
                    var pageType = 1001;
                    if($scope.view.allItineraryList['HOTEL'][index].supplierOID == $scope.view.ctripHotelOID){
                        if(!$scope.view.disabled){
                            $scope.view.disabled = true;
                            CtripService.judgeCardEnable().then(function (res) {
                                if (res.data.result) {
                                    TravelERVService.getSsoSupplierUrl($scope.view.allItineraryList['HOTEL'][index].supplierOID, pageType, $scope.view.allItineraryList['HOTEL'][index].approvalNumber)
                                        .success(function (data) {
                                            ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=no,toolbar=no');
                                            ref.addEventListener('loadstart', inAppBrowserLoadStart);
                                            ref.addEventListener('exit', inAppBrowserClose);
                                        })
                                        .finally(function () {
                                            $scope.view.disabled = false;
                                        })
                                } else {
                                    $state.go('app.ctrip_no_card');
                                    $scope.view.disabled = false;
                                }
                            }, function () {
                                $scope.view.disabled = false;
                            });
                        }

                    } else {
                        if(!$scope.view.disabled) {
                            $scope.view.disabled = true;
                            TravelERVService.getSsoSupplierUrl($scope.view.allItineraryList['HOTEL'][index].supplierOID, pageType, $scope.view.allItineraryList['HOTEL'][index].approvalNumber)
                                .success(function (data) {
                                    ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=no,toolbar=no');
                                    ref.addEventListener('loadstart', inAppBrowserLoadStart);
                                    ref.addEventListener('exit', inAppBrowserClose);
                                })
                                .finally(function () {
                                    $scope.view.disabled = false;
                                })
                        }
                    }
                },
                getIcon: function (supplierOID) {
                    return $scope.view.supplierIcon[supplierOID];
                },
                //获取机票供应商列表
                getSupplierList: function (index) {
                    $scope.view.supplierIcon = {};
                    CustomApplicationServices.getAllSupplier()
                        .success(function (data) {
                            if(index == -1){
                                $scope.view.fightSupplierSelect = [];
                                $scope.view.trainSupplierSelect = [];
                                $scope.view.hotelSupplierSelect = [];
                                //2001 机票
                                if( data[2001] &&  data[2001].length > 0){
                                    $scope.view.fightSupplier = data[2001];
                                }
                                //2002  火车
                                if( data[2002] &&  data[2002].length > 0){
                                    $scope.view.trainSupplier = data[2002];
                                }
                                //2003  酒店
                                if( data[2003] &&  data[2003].length > 0){
                                    $scope.view.hotelSupplier = data[2003];
                                }
                                if($scope.view.fightSupplier && $scope.view.fightSupplier.length > 0){
                                    for(var i = 0; i < $scope.view.fightSupplier.length; i++){
                                        var item = {};
                                        item.text = $scope.view.fightSupplier[i].name;
                                        $scope.view.fightSupplierSelect.push(item);
                                        if($scope.view.fightSupplier[i].serviceName == 'supplyCtripService'){
                                            $scope.view.ctripFlightOID = $scope.view.fightSupplier[i].supplierOID;
                                            $scope.view.fightSupplier[i].serviceName = 'ctrip_air';
                                        } else if($scope.view.fightSupplier[i].serviceName == 'supplyBaoKuService'){
                                            $scope.view.fightSupplier[i].serviceName = 'baoku_air';
                                        } else if($scope.view.fightSupplier[i].serviceName == 'supplyCtShoService'){
                                            $scope.view.fightSupplier[i].serviceName = 'ctsho_air';
                                            $scope.view.ctshoFlightOID = $scope.view.fightSupplier[i].supplierOID;
                                        } else {
                                            $scope.view.fightSupplier[i].serviceName = 'standard';
                                        }
                                    }
                                }
                                if($scope.view.trainSupplier && $scope.view.trainSupplier.length > 0){
                                    for(var i = 0; i < $scope.view.trainSupplier.length; i++){
                                        var item = {};
                                        item.text = $scope.view.trainSupplier[i].name;
                                        $scope.view.trainSupplierSelect.push(item);
                                        if($scope.view.trainSupplier[i].serviceName == 'supplyTongChengService'){
                                            $scope.view.trainSupplier[i].serviceName = 'standard';
                                        } else {
                                            $scope.view.trainSupplier[i].serviceName = 'standard';
                                        }
                                    }
                                }
                                if($scope.view.hotelSupplier && $scope.view.hotelSupplier.length > 0){
                                    for(var i = 0; i < $scope.view.hotelSupplier.length; i++){
                                        var item = {};
                                        item.text = $scope.view.hotelSupplier[i].name;
                                        $scope.view.hotelSupplierSelect.push(item);
                                        if($scope.view.hotelSupplier[i].serviceName == 'supplyBaoKuService'){
                                            $scope.view.hotelSupplier[i].serviceName = 'standard';
                                        } else if($scope.view.hotelSupplier[i].serviceName == 'supplyCtripService'){
                                            $scope.view.hotelSupplier[i].serviceName = 'ctrip_hotel';
                                            $scope.view.ctripHotelOID = $scope.view.hotelSupplier[i].supplierOID;
                                        } else {
                                            $scope.view.hotelSupplier[i].serviceName = 'standard';
                                        }
                                    }
                                }
                            } else {
                                if( data[2001] &&  data[2001].length > 0){
                                    $scope.view.applicationData.custFormValues[index].SupplierList = data[2001];
                                } else {
                                    $scope.view.applicationData.custFormValues[index].SupplierList = [];
                                }
                                if ($scope.view.applicationData.custFormValues[index].value) {
                                    for (var i = 0; i < $scope.view.applicationData.custFormValues[index].SupplierList.length; i++) {
                                        if ($scope.view.applicationData.custFormValues[index].value === $scope.view.applicationData.custFormValues[index].SupplierList[i].supplierOID) {
                                            $scope.view.applicationData.custFormValues[index].selectedSupplier = $scope.view.applicationData.custFormValues[index].SupplierList[i];
                                            $scope.view.selectedSupplier = $scope.view.applicationData.custFormValues[index].SupplierList[i];
                                            break;
                                        }
                                    }
                                }
                            }

                        })
                },
                //获取值列表名字
                getValueName: function (index) {
                    CustomValueService.getMessageKey($scope.view.applicationData.custFormValues[index].customEnumerationOID, $scope.view.applicationData.custFormValues[index].value)
                        .then(function (data) {
                            $scope.view.applicationData.custFormValues[index].valueKey = data;
                        })
                },
                //根据值列表value获取值列表key(用于显示)
                getMessageKeyDetail: function(index, customEnumerationOID, value){
                    CustomValueService.getCustomValueDetail(customEnumerationOID)
                        .then(function (res) {
                            CustomValueService.getCustomValueItemDetail(res.data.dataFrom,customEnumerationOID, value)
                                .then(function (data) {
                                    $scope.view.applicationData.custFormValues[index].valueKey = data.data.messageKey;
                                });
                        })
                },
                //银行卡
                getContactBankAccountName: function (index) {
                    if($scope.view.applicationData.custFormValues[index].value){
                        CompanyService.getBankAccountDetail($scope.view.applicationData.custFormValues[index].value)
                            .success(function (data) {
                                $scope.view.applicationData.custFormValues[index].bankAccountNo = data.bankAccountNo;
                            })
                    }
                },
                //获取法人实体名字
                getCorporationEntityName: function (index) {
                    if($scope.view.corporationOID){
                        CorporationEntityService.getCorporationEntityDetail($scope.view.corporationOID)
                            .success(function (data) {
                                $scope.view.applicationData.custFormValues[index].entityName = data.companyName;
                            })
                    }
                },
                //提交预算校验
                checkBudget: function (message,content) {
                    var deferred = $q.defer();
                    var confirm = $ionicPopup.confirm({
                        title: message,
                        cssClass: 'refund-confirm-popup',
                        template: '<span>' + content + '</span>',
                        buttons: [
                            {
                                text: $filter('translate')('custom.application.travel.return'),//返回
                                type: 'cancel-button',
                                onTap: function (e) {
                                    deferred.reject(false);
                                }
                            },
                            {
                                text: $filter('translate')('custom.application.travel.submit'),//提交
                                type: 'sure-button',
                                onTap: function(e) {
                                    deferred.resolve(true);
                                }
                            }]
                    });
                    return deferred.promise;
                },
                openBudgetModal:function () {
                    $scope.applicationBuagetModal.show();
                }
            };

            $scope.additional = {
                //打开选择面板
                showAddPanel: function () {
                    CustomApplicationServices.getTravelElementList($scope.view.applicationData.formOID)
                        .success(function (data) {
                            $scope.view.travelElementList = data;
                            $scope.addSelectDialog.show();
                        })
                        .error(function(error){
                            if(error.message){
                                PublicFunction.showToast(error.message)
                            } else {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                            }
                        })

                },
                //关闭选择面板
                closeTraffic: function (type, formOID) {
                    if (type === 1001 || type === 1002 || type === 1003) {
                        //交通
                        $scope.view.trafficSelectIndex = -1;
                        if(type == 1001){
                            $scope.view.oldCitySupplier = 'ctrip_air'; //机票都是 携程机票
                        } else {
                            $scope.view.oldCitySupplier = 'standard'; //否则都是 标准的
                        }
                        $scope.view.route = {
                            trafficType: type,
                            fromCity: null,
                            toCity: null
                        };
                        $scope.addTraffic.show();
                    } else if (type === 4001) {
                        //差旅要素
                        SelfDefineExpenseReport.getCustomForm(formOID)
                            .success(function (data) {
                                $scope.view.travelElements = data;
                                for (var i = 0; i < $scope.view.travelElements.customFormFields.length; i++) {
                                    var costCenterIndex = i;
                                    if ($scope.view.travelElements.customFormFields[i].messageKey === 'select_cost_center') {
                                        $scope.view.travelElements.customFormFields[i].costCenterName = null;
                                        if ($scope.view.travelElements.customFormFields[i].dataSource !== null && $scope.view.travelElements.customFormFields[i].dataSource !== "") {
                                            var costCenterIndex = i;
                                            var json = JSON.parse(data.customFormFields[costCenterIndex].dataSource);
                                            $scope.view.travelElements.customFormFields[costCenterIndex].costCenterOID = json.costCenterOID;
                                        }
                                    } else {
                                        $scope.view.travelElements.customFormFields[i].value = null;
                                    }
                                }
                                $scope.customerModal.show();
                            })
                            .error(function(error){
                                if(error.message){
                                    PublicFunction.showToast(error.message)
                                } else {
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                                }
                            })
                    } else if (type === 1004) {
                        $scope.travel.city = {};
                        //差旅补贴
                        $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item, i) {
                            if (item.travelSubsidiesDTO.areaName) {
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].disabled = true;
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].checked = false;
                                if ($scope.view.selectDateList.indexOf(item.itineraryDate) === -1) {
                                    $scope.view.selectDateList.push(item.itineraryDate);
                                }
                            } else {
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].disabled = false;
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].checked = false;
                            }
                        });
                        $scope.travel.selectAll = false;
                        $scope.travel.showAllowanceDetail = false;
                        $scope.travelAllowanceModal.show();
                    }
                    $scope.addSelectDialog.hide();
                },
                //选择出发城市和达到城市
                selectCity: function () {
                    if ($scope.view.trafficSelectIndex === -1) {
                        PublicFunction.showToast($filter('translate')('form.please.select') + $filter('translate')('custom.application.travel.itinerarys') + $filter('translate')('custom.application.travel.date'));
                    } else if ($scope.view.route.fromCity === '' || $scope.view.route.fromCity === null || $scope.view.route.toCity === '' || $scope.view.route.toCity === null || $scope.view.route.fromCity === $scope.view.route.toCity) {
                        PublicFunction.showToast($filter('translate')('custom.application.travel.please.legal.itinerarys'));
                    } else {
                        var route = {};
                        route.fromCity = $scope.view.route.fromCity;
                        route.toCity = $scope.view.route.toCity;
                        route.trafficType = $scope.view.route.trafficType;
                        $scope.view.applicationData.travelApplication.travelItinerarys[$scope.view.trafficSelectIndex].travelItineraryTraffics.push(route);
                        $scope.addTraffic.hide();
                    }
                },
                //交通选择日期
                selectDate: function (index) {
                    $scope.view.trafficSelectIndex = index;
                },
                //差旅要素多选择日期
                selectVariousDate: function (index) {
                    $scope.view.applicationData.travelApplication.travelItinerarys[index].hasTravelElement = !$scope.view.applicationData.travelApplication.travelItinerarys[index].hasTravelElement;
                },
                validateElement: function () {
                    var defer = $q.defer();
                    var i = 0;
                    var j = 0;
                    var hasSelectDate = false;
                    for (; i < $scope.view.travelElements.customFormFields.length; i++) {
                        if ($scope.view.travelElements.customFormFields[i].required && ($scope.view.travelElements.customFormFields[i].value === null || $scope.view.travelElements.customFormFields[i].value === '' )) {
                            PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.travelElements.customFormFields[i].fieldName);
                            defer.reject(false);
                            return defer.promise;
                        }
                    }
                    for (; j < $scope.view.applicationData.travelApplication.travelItinerarys.length; j++) {
                        if ($scope.view.applicationData.travelApplication.travelItinerarys[j].hasTravelElement) {
                            hasSelectDate = true;
                            j = $scope.view.applicationData.travelApplication.travelItinerarys.length;
                            break;
                        }
                    }
                    if (i === $scope.view.travelElements.customFormFields.length && j === $scope.view.applicationData.travelApplication.travelItinerarys.length) {
                        if (hasSelectDate) {
                            defer.resolve(true);
                        } else {
                            PublicFunction.showToast($filter('translate')('form.please.select') + $filter('translate')('custom.application.travel.itinerarys'));
                            defer.reject(false);
                        }
                        return defer.promise;
                    }
                },
                //添加差旅要素
                addTravelElement: function () {
                    $scope.additional.validateElement()
                        .then(function () {
                            var i = 0;
                            for (; i < $scope.view.applicationData.travelApplication.travelItinerarys.length; i++) {
                                if ($scope.view.applicationData.travelApplication.travelItinerarys[i].hasTravelElement) {
                                    $scope.view.applicationData.travelApplication.travelItinerarys[i].travelElements.push($scope.view.travelElements.customFormFields);
                                    $scope.view.applicationData.travelApplication.travelItinerarys[i].hasTravelElement = false;
                                }
                            }
                            if (i === $scope.view.applicationData.travelApplication.travelItinerarys.length) {
                                $scope.customerModal.hide();
                            }
                        })
                },
                //获取法人实体名字
                getCorporationEntityName: function (index) {
                    if ($scope.view.applicationData.custFormValues[i].value) {
                        CorporationEntityService.getCorporationEntityDetail($scope.view.applicationData.custFormValues[i].value)
                            .success(function (data) {
                                $scope.view.applicationData.custFormValues[index].entityName = data.companyName;
                            })
                    }
                }
            };
            //获取差补明细
            function getStandardAllowance(copyDate, code, userOIDs) {
                //if ($scope.travel.content === 'add') {
                CustomApplicationServices.getStandardAllowance(code, userOIDs)
                    .then(function (response) {
                        $scope.travel.allowanceDeatil = [];
                        $scope.travel.showAllowanceDetail = true;
                        if (response && response.length > 0) {
                            CustomApplicationServices.saveAllowance($scope.view.applicationData)
                                .success(function (data) {
                                    $scope.travel.allowanceDetails = data.travelApplication;
                                    getTravelSubsidiesBudgets($scope.travel.allowanceDetails);
                                    response.forEach(function (item) {
                                        item.userName = [];
                                        angular.forEach(item.userOIDList, function (value) {
                                            angular.forEach($scope.view.applicationParticipants, function (participant) {
                                                if (value === participant.userOID) {
                                                    item.userName.push(participant.fullName)
                                                }
                                            })
                                        });
                                        item.name = item.userName.join("、");
                                        $scope.travel.allowanceDeatil.push(item);
                                    });
                                    // 将补贴明细、日期、地址放入明细列表中
                                    if ($scope.view.allowanceList.length > 0) {
                                        //当明细列表中有数据，则判断明细中选择的城市是否已被明细包含
                                        var hasContained = false;
                                        var editStatus = false;
                                        angular.forEach($scope.view.allowanceList, function (item, i) {
                                            //如果已包含，则合并时间数组，不用考虑去重
                                            if (item.city.value === $scope.travel.city.value) {
                                                hasContained = true;
                                                //编辑
                                                if ($scope.travel.detail && !editStatus) {
                                                    item.date = copyDate;
                                                } else {
                                                    //合并日期数组
                                                    angular.forEach(angular.copy(copyDate), function (date) {
                                                        if (item.date.indexOf(date) === -1) {
                                                            item.date.push(date);
                                                        }
                                                    });
                                                }
                                                return false; //跳出循环
                                            } else {
                                                if ($scope.travel.detail) {
                                                    if (item.city.value === $scope.travel.detail.city.value) {
                                                        //编辑
                                                        hasContained = false;
                                                        editStatus = true;
                                                        item.city = $scope.travel.city;
                                                        return false;
                                                    }
                                                }
                                            }
                                        });
                                        if (!hasContained) {  //如果地址未重复，则添加一个新条目
                                            $scope.view.allowanceList.push({
                                                city: $scope.travel.city,
                                                date: angular.copy(copyDate),
                                                detailList: $scope.travel.allowanceDeatil
                                            });
                                        }
                                        if (editStatus) {
                                            var hash = [];
                                            $scope.view.allowanceList.forEach(function (item) {
                                                if (!hash[item.city.value]) {
                                                    hash[item.city.value] = [];
                                                    hash[item.city.value].date = angular.copy(item.date);
                                                    hash[item.city.value] = {
                                                        areaCode: item.city.areaCode,
                                                        date: hash[item.city.value].date,
                                                        detailList: item.detailList
                                                    }
                                                } else {
                                                    item.date.forEach(function (date) {
                                                        if (hash[item.city.value].date.indexOf(date) === -1) {
                                                            hash[item.city.value].date.push(date);
                                                        }
                                                    });
                                                    hash[item.city.value] = {
                                                        areaCode: item.city.areaCode,
                                                        date: hash[item.city.value].date,
                                                        detailList: item.detailList
                                                    }
                                                }
                                            });
                                            $scope.view.allowanceList = [];
                                            for (var key in hash) {
                                                if (hash.hasOwnProperty(key)) {
                                                    var travel = {};
                                                    travel.city = key;
                                                    travel.value = hash[key];
                                                    $scope.view.allowanceList.push({
                                                        city: {areaCode: travel.value.areaCode, value: travel.city},
                                                        date: travel.value.date,
                                                        detailList: travel.value.detailList
                                                    });
                                                }
                                            }
                                        }

                                    } else {
                                        $scope.view.allowanceList.push({
                                            city: $scope.travel.city,
                                            date: angular.copy(copyDate),
                                            detailList: $scope.travel.allowanceDeatil
                                        });
                                    }
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.save'));//已保存
                                })
                                .error(function (error) {
                                    if(error.message){
                                        PublicFunction.showToast(error.message)
                                    } else {
                                        PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                                    }
                                })
                                .finally(function () {
                                    $scope.travel.errorStatus = false;
                                });
                        } else {
                            //已选时间行程的checked=false
                            $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (date) {
                                var index = $scope.view.selectDateList.indexOf(date.itineraryDate);
                                if (date.checked && index > -1) {
                                    date.checked = false;
                                    date.travelSubsidiesDTO = {};
                                }
                            });
                            judgeSelectAll();
                            //释放时间行程
                            copyDate.forEach(function (item) {
                                var index = $scope.view.selectDateList.indexOf(item);
                                if (index > -1) {
                                    $scope.view.selectDateList.splice(index, 1);
                                }
                            });
                            //释放目的地
                            $scope.travel.city = {};
                            PublicFunction.showToast($filter('translate')('custom.application.travel.noAvailAgainSubsidy'));//该城市无补贴,请重新新建补贴
                        }
                    }, function () {
                        PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                    })
                    .finally(function () {
                        $scope.travel.errorStatus = false;
                    });
            }

            //获取差补总金额
            function getTravelSubsidiesBudgets(details) {
                $scope.travel.travelSubsidiesBudgets = [];
                var amount = 0;
                if (details && details.travelSubsidiesBudgetDTOs && details.travelSubsidiesBudgetDTOs.length > 0) {
                    details.travelSubsidiesBudgetDTOs.forEach(function (item) {
                        amount = amount + item.amount;
                        $scope.travel.travelSubsidiesBudgets.push({
                            iconName: item.iconName,
                            amount: item.amount,
                            name: item.expenseTypeName
                        })
                    });
                    $scope.view.travelSubsidiesBudgetTotalAmount = amount + $scope.view.amount;
                    var nzhcn = Nzh.cn;
                    //行程
                    if (details && details.travelItinerarys.length > 0) {
                        for (var i = 0; i < details.travelItinerarys.length; i++) {
                            if (details.travelItinerarys[i].travelSubsidiesDTO.areaName) {
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].city = {
                                    areaCode: details.travelItinerarys[i].travelSubsidiesDTO.areaCode,
                                    value: details.travelItinerarys[i].travelSubsidiesDTO.areaName
                                }
                            } else {
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].city = null;
                            }
                            //差旅申请中日程的天数中文情况下显示'一二三...',其他语言显示'123...'
                            98
                            details.travelItinerarys[i].week = new Date(details.travelItinerarys[i].itineraryDate).getDay();
                            details.travelItinerarys[i].itineraryDate = moment(details.travelItinerarys[i].itineraryDate).format('YYYY-MM-DD');
                        }
                    }

                }
            }

            //解析差旅行程，获取明细
            function getTravelItinerarys(data) {
                $scope.travel.allowanceDetails = data;
                $scope.travel.travelItinerarys = [];
                var tempMap = [];
                data.travelItinerarys.forEach(function (itinerarys) {
                    //说明这条行程有差补
                    if (itinerarys.travelSubsidiesDTO.areaName) {
                        var itineraryDate = moment(itinerarys.itineraryDate).format('YYYY-MM-DD');
                        //将城市作为这个map的key，时间行程和补贴明细作为value
                        if (!tempMap[itinerarys.travelSubsidiesDTO.areaName]) {
                            tempMap[itinerarys.travelSubsidiesDTO.areaName] = {};
                            tempMap[itinerarys.travelSubsidiesDTO.areaName].date = [];
                            tempMap[itinerarys.travelSubsidiesDTO.areaName].date.push(itineraryDate);
                            tempMap[itinerarys.travelSubsidiesDTO.areaName] = {
                                areaCode: itinerarys.travelSubsidiesDTO.areaCode,
                                date: tempMap[itinerarys.travelSubsidiesDTO.areaName].date,
                                details: itinerarys.travelSubsidiesDTO.travelSubsidiesDetailsShowDTOs
                            }
                        } else {
                            tempMap[itinerarys.travelSubsidiesDTO.areaName].date.push(itineraryDate);
                            tempMap[itinerarys.travelSubsidiesDTO.areaName] = {
                                areaCode: itinerarys.travelSubsidiesDTO.areaCode,
                                date: tempMap[itinerarys.travelSubsidiesDTO.areaName].date,
                                details: itinerarys.travelSubsidiesDTO.travelSubsidiesDetailsShowDTOs
                            }
                        }
                    }
                });
                for (var key in tempMap) {
                    if (tempMap.hasOwnProperty(key)) {
                        var travel = {};
                        travel.city = key;
                        travel.value = tempMap[key];
                        $scope.travel.travelItinerarys.push(travel);
                    }
                }
                //解析参与人员
                $scope.travel.travelItinerarys.forEach(function (item) {
                    item.value.details.forEach(function (value) {
                        value.userName = [];
                        angular.forEach(value.userOIDs, function (userOID) {
                            angular.forEach($scope.view.applicationParticipants, function (participant) {
                                if (userOID === participant.userOID) {
                                    value.userName.push(participant.fullName);
                                }
                            })
                        });
                        value.name = value.userName.join("、");
                    });
                    item.value.date.forEach(function (date) {
                        if ($scope.view.selectDateList.indexOf(date) === -1) {
                            $scope.view.selectDateList.push(date);
                        }
                    });
                    $scope.view.allowanceList.push({
                        city: {
                            areaCode: item.value.areaCode,
                            value: item.city
                        },
                        date: item.value.date,
                        detailList: item.value.details
                    });
                });
                data.travelItinerarys.forEach(function (allowance, i) {
                    if ($scope.travel.travelItinerarys && $scope.travel.travelItinerarys.length) {
                        $scope.travel.travelItinerarys.forEach(function (item, k) {
                            var index = item.value.date.indexOf(allowance.itineraryDate);
                            if (index > -1) {
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].city = {};
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].city.value = item.city;
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].city.areaCode = item.value.areaCode;
                            }
                        })
                    }

                });

            }

            //判断是否全选
            function judgeSelectAll() {
                var count = 0;
                var disabledCount = 0;
                $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item) {
                    if (item.disabled) {
                        disabledCount++;
                    }
                    if (item.checked) {
                        count++;
                    }
                });
                if ($scope.view.applicationData.travelApplication.travelItinerarys.length === disabledCount) {
                    $scope.travel.selectAll = false;
                    return false;
                } else if (count === ($scope.view.applicationData.travelApplication.travelItinerarys.length - disabledCount)) {
                    $scope.travel.selectAll = true;
                    return true;
                } else {
                    $scope.travel.selectAll = false;
                    return false;
                }
            }

            //差旅补贴
            $scope.travel = {
                expand: false,
                disabled: false,
                showAllowanceDetail: false,
                errorStatus: false,
                title: $filter('translate')('custom.application.allowance.evectionDestination'),    //出差目的地
                city: {
                    'areaCode': null,
                    'value': null
                },
                selectAll: false,
                userOIDs: [],//参与人员OID
                // title: $filter('translate')('custom.application.allowance.evectionDestination'),
                travelValidate: function () {
                    var defer = $q.defer();
                    if (!$scope.travel.city.areaCode && !$scope.travel.city.value) {
                        PublicFunction.showToast($filter('translate')('custom.application.travel.pleaseChioceBourn'));//请选择目的地
                        defer.reject(false);
                    } else if (!$scope.view.selectDateList || $scope.view.selectDateList.length === 0) {
                        PublicFunction.showToast($filter('translate')('custom.application.travel.pleaseChioceDate'));//请选择日期
                        defer.reject(false);
                    } else if ($scope.view.selectDateList && $scope.view.selectDateList.length > 0) {
                        var newList = [];
                        newList = angular.copy($scope.view.selectDateList);
                        $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item) {
                            if (item.disabled && newList.indexOf(item.itineraryDate) > -1) {
                                newList.splice(newList.indexOf(item.itineraryDate), 1);
                            }
                        });
                        if (!newList || newList.length === 0) {
                            if (!judgeSelectAll() && ($scope.view.selectDateList.length === $scope.view.applicationData.travelApplication.travelItinerarys.length)) {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.notChioceDate'));//无可选日期
                            } else {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.pleaseChioceDate'));//请选择日期
                            }
                            defer.reject(false);
                        } else {
                            defer.resolve(true);
                        }
                    } else {
                        defer.resolve(true);
                    }
                    return defer.promise;
                },
                //单选
                selectAllowanceDate: function (index) {
                    if ($scope.travel.selectAll) {
                        $scope.travel.selectAll = false;
                    }
                    $scope.view.applicationData.travelApplication.travelItinerarys[index].checked = !$scope.view.applicationData.travelApplication.travelItinerarys[index].checked;
                    $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item) {
                        var index = $scope.view.selectDateList.indexOf(item.itineraryDate);
                        if (item.checked && index === -1) {
                            $scope.view.selectDateList.push(item.itineraryDate);
                        } else if (!item.checked && index > -1 && !item.disabled) {
                            $scope.view.selectDateList.splice(index, 1);
                        }
                    });
                    if ($scope.view.applicationData.travelApplication.travelItinerarys.length === $scope.view.selectDateList.length) {
                        var count = 0;
                        $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item) {
                            if (item.disabled) {
                                count++;
                            }
                        });
                        if (count === $scope.view.applicationData.travelApplication.travelItinerarys.length) {
                            $scope.travel.selectAll = false;
                        } else if ($scope.view.applicationData.travelApplication.travelItinerarys.length === $scope.view.selectDateList.length) {
                            //全选状态
                            $scope.travel.selectAll = true;
                        } else {
                            $scope.travel.selectAll = false;
                        }
                    } else {
                        $scope.travel.selectAll = false;
                    }
                },
                //全选
                selectAllAllowance: function () {
                    if ($scope.travel.selectAll) {
                        $scope.view.selectDateList = [];
                        $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item) {
                            if (!item.disabled) {
                                item.checked = true;
                                $scope.view.selectDateList.push(item.itineraryDate);
                            }
                        })
                        if (!judgeSelectAll()) {
                            $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item) {
                                if (item.disabled) {
                                    if ($scope.view.selectDateList.indexOf(item.itineraryDate) === -1) {
                                        $scope.view.selectDateList.push(item.itineraryDate);
                                    }
                                }
                            });
                            //if($scope.view.selectDateList.length=== $scope.view.applicationData.travelApplication.travelItinerarys.length){
                            PublicFunction.showToast($filter('translate')('custom.application.travel.notChioceDate'));//无可选日期
                            //}
                        }
                    } else {
                        $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item) {
                            item.checked = false;
                            $scope.view.selectDateList = [];
                        })
                    }

                },
                //第一步确认差旅补贴
                sure: function () {
                    //参数：每一天的cityCode和行程OID
                    $scope.travel.travelValidate().then(function () {
                        $scope.travel.errorStatus = true;
                        var copyDate = [];
                        $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item, i) {
                            //编辑
                            if (item.travelSubsidiesDTO.areaName) {
                                if ($scope.travel.city.value === item.travelSubsidiesDTO.areaName) {
                                    if ($scope.view.selectDateList.indexOf(item.itineraryDate) > -1) {
                                        copyDate.push(item.itineraryDate);
                                        $scope.view.applicationData.travelApplication.travelItinerarys[i].travelSubsidiesDTO = item.travelSubsidiesDTO;
                                    } else {
                                        if (copyDate.indexOf(item.itineraryDate) > -1) {
                                            copyDate.splice(copyDate.indexOf(item.itineraryDate), 1);
                                        }
                                        item.travelSubsidiesDTO = {};
                                    }
                                } else {
                                    if ($scope.travel.detail) {
                                        if ($scope.travel.detail.city.value === item.travelSubsidiesDTO.areaName) {
                                            $scope.view.applicationData.travelApplication.travelItinerarys[i].travelSubsidiesDTO.areaCode = $scope.travel.city.areaCode;
                                            $scope.view.applicationData.travelApplication.travelItinerarys[i].travelSubsidiesDTO.areaName = $scope.travel.city.value;
                                        }
                                    }

                                }
                            } else {
                                var index = $scope.view.selectDateList.indexOf(item.itineraryDate);
                                if (item.checked && index > -1 && !item.disabled) {
                                    $scope.view.applicationData.travelApplication.travelItinerarys[i].travelSubsidiesDTO = {};
                                    $scope.view.applicationData.travelApplication.travelItinerarys[i].travelSubsidiesDTO.areaCode = $scope.travel.city.areaCode;
                                    $scope.view.applicationData.travelApplication.travelItinerarys[i].travelSubsidiesDTO.areaName = $scope.travel.city.value;
                                    $scope.view.applicationData.travelApplication.travelItinerarys[i].travelSubsidiesDTO.areaName = $scope.travel.city.value;
                                    copyDate.push(item.itineraryDate)
                                }
                            }
                        });
                        $scope.view.applicationParticipants.forEach(function (item) {
                            if ($scope.travel.userOIDs.indexOf(item.userOID) === -1) {
                                $scope.travel.userOIDs.push(item.userOID);
                            }
                        });
                        //获取差补明细
                        getStandardAllowance(copyDate, $scope.travel.city.areaCode, $scope.travel.userOIDs);

                    });
                },
                //新建差旅补贴
                createAllowance: function () {
                    //已选择的时间不可用
                    $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item, i) {
                        if (item.travelSubsidiesDTO.areaName) {
                            var index = $scope.view.selectDateList.indexOf(item.itineraryDate);
                            if (index > -1) {
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].checked = false;
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].disabled = true;
                            }
                        }
                    });
                    $scope.travel.selectAll = false;
                    $scope.travel.detail = null;
                    $scope.travel.city={};
                    $scope.travel.showAllowanceDetail = false;
                    $scope.travelAllowanceModal.show();
                },
                //第二步确认差旅补贴
                sureAllowance: function () {
                    CustomApplicationServices.saveAllowance($scope.view.applicationData)
                        .success(function (data) {
                            $scope.travel.allowanceDetails = data.travelApplication;
                            getTravelSubsidiesBudgets($scope.travel.allowanceDetails);
                            $scope.travel.city = {};
                            $scope.travel.showAllowanceDetail = false;
                            $scope.travelAllowanceModal.hide();
                        })
                        .error(function (error) {
                            if(error.message){
                                PublicFunction.showToast(error.message)
                            } else {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                            }
                        })
                },
                //查看差标详细
                goAllowanceDetail: function () {
                    $scope.travel.showAllowanceDetail = true;
                    $scope.travelAllowanceModal.show();
                },
                //是否展开明细
                showDetail: function () {
                    $scope.travel.expand = !$scope.travel.expand;

                },
                //关闭差旅明细modal
                cancel: function () {
                    $scope.travel.detail = null;
                    //补贴明细modal.此页面删除是物理删除，所以cancel时调用保存接口
                    if ($scope.travel.showAllowanceDetail) {
                        $scope.travel.sureAllowance();
                    } else {
                        getTravelSubsidiesBudgets($scope.travel.allowanceDetails);
                        $scope.travelAllowanceModal.hide();
                        $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item, i) {
                            if (!item.disabled) {
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].checked = false;
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].disabled = false;
                            }
                        })

                    }
                },
                //删除差补
                deleteAllowance: function (data, index) {
                    $scope.view.allowanceList.splice(index, 1);
                    $scope.travel.detail = null;
                    //循环差补明细的时间,释放差补的时间
                    data.date.forEach(function (item) {
                        var index = $scope.view.selectDateList.indexOf(item);
                        if (index > -1) {
                            $scope.view.selectDateList.splice(index, 1);
                        }
                    });
                    //日期行程checked=false,disbaled=false,travelSubsidiesDTO={},city=null
                    $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item, i) {
                        var k = data.date.indexOf(item.itineraryDate);
                        if (k > -1) {
                            $scope.view.applicationData.travelApplication.travelItinerarys[i].city = null;
                            $scope.view.applicationData.travelApplication.travelItinerarys[i].travelSubsidiesDTO = {};
                            $scope.view.applicationData.travelApplication.travelItinerarys[i].checked = false;
                            $scope.view.applicationData.travelApplication.travelItinerarys[i].disabled = false;
                        }
                    });
                    if (!$scope.view.allowanceList || $scope.view.allowanceList.length === 0) {
                        $scope.travel.city = {};
                        $scope.travel.selectAll = false;
                    }
                    $ionicListDelegate.$getByHandle('exercise-list').closeOptionButtons();
                    PublicFunction.showToast($filter('translate')('custom.application.travel.delete'));//已删除
                },
                //编辑差补:查看差旅明细
                editAllowance: function (detail) {
                    $scope.travel.showAllowanceDetail = false;
                    $scope.travel.detail = detail;
                    $scope.travel.city = $scope.travel.detail.city;
                    $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item, i) {
                        var index = $scope.travel.detail.date.indexOf(item.itineraryDate);
                        if (index > -1) {
                            item.disabled = false;
                            item.checked = true;
                            if($scope.view.selectDateList.indexOf(item.itineraryDate)===-1){
                                $scope.view.selectDateList.push(item.itineraryDate);
                            }
                        } else {
                            if ($scope.view.selectDateList.indexOf(item.itineraryDate) > -1) {
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].disabled = true;
                                $scope.view.applicationData.travelApplication.travelItinerarys[i].checked = false;
                            }
                        }
                    });
                    judgeSelectAll();
                    $scope.travelAllowanceModal.show();
                },
                //删除所有的差补明细
                deleteAllAllowance: function () {
                    //所有行程时间都被释放掉
                    CustomApplicationServices.deleteAllowance($stateParams.applicationOID)
                        .success(function () {
                            CustomApplicationServices.getApplicationDetail($scope.view.currentUrl, $stateParams.applicationOID)
                            $scope.view.travelSubsidiesBudgetTotalAmount = $scope.view.amount;
                            $scope.travel.travelSubsidiesBudgets = [];
                            $scope.view.allowanceList = [];
                            //释放时间
                            $scope.view.selectDateList = [];
                            $scope.travel.selectAll = false;
                            $scope.travel.city = {};
                            $scope.travel.detail = null;
                            $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (item) {
                                item.travelSubsidiesDTO = {};
                                item.checked = false;
                                item.disabled = false;
                                item.city = null;
                            });
                            PublicFunction.showToast($filter('translate')('custom.application.travel.deleteOk'));//删除成功
                        })
                        .error(function (error) {
                            if(error.message){
                                PublicFunction.showToast(error.message)
                            } else {
                                PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                            }
                        })
                }
            };

            //货币
            $scope.getCashName = function (currencyCode) {
                if (currencyCode !== null && currencyCode !== '') {
                    return CurrencyCodeService.getCashName(currencyCode)
                } else {
                    return null;
                }
            }

            var init = function () {
                // 获取当前用户OID
                Principal.identity().then(function (data) {
                    //获取管理员列表
                    CustomApplicationServices.getAdminList(data.companyOID, 0, 3)
                        .success(function (data) {
                            $scope.view.adminList = data;
                        })
                    $scope.view.userOID = data.userOID;
                    TravelERVService.getBatchUsers($scope.view.userOID)
                        .success(function (data) {
                            if(data.length > 0){
                                $scope.view.userDetail = data[0];
                            }
                        })
                });
                //获取机票,火车, 酒店供应商列表
                $scope.view.getSupplierList(-1);


                if ($scope.view.content === 'travelNext') {
                    $scope.view.readOnly = false;
                } else {
                    $scope.view.readOnly = true;
                }
                var nzhcn = Nzh.cn;
                PublicFunction.showLoading();
                if ($stateParams.formType == 1001) {
                    //普通表单
                    $scope.view.currentUrl = '';
                } else if ($stateParams.formType == 2001) {
                    //差旅申请单
                    $scope.view.currentUrl = '/api/travel/applications/my/get/';
                } else if ($stateParams.formType == 2002) {
                    //费用申请单
                    $scope.view.currentUrl = '/api/expense/applications/';
                } else if ($stateParams.formType == 2003) {
                    //订票申请单
                    $scope.view.currentUrl = '/api/travel/booker/applications/my/get/';
                } else if ($stateParams.formType == 2005) {
                    //借款申请单
                    $scope.view.currentUrl = '/api/loan/application/';
                }
                FunctionProfileService.getFunctionProfileList().then(function (data) {
                    $scope.view.functionProfileList = data;
                    if($scope.view.functionProfileList['ctrip.config'] && JSON.parse($scope.view.functionProfileList['ctrip.config'])){
                        $scope.view.shareRoomConfig = JSON.parse($scope.view.functionProfileList['ctrip.config']).hotel.shareRoom;
                    }
                    CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                        FunctionProfileService.getCompanyVendor().then(function(res){
                            $scope.view.configuration = res;  // 获取开通服务的供应商列表
                            if ($.inArray(1002, $scope.view.configuration) > -1) {
                                $scope.view.hasCtrip = true;
                            }
                            if ($.inArray(1004, $scope.view.configuration) > -1) {
                                $scope.view.hasTongCheng = true;
                            }
                        });
                        $scope.code = CurrencyCodeService.getCurrencySymbol(data.currencyCode);
                        //获取本位币
                        $scope.originCurrencyCode = data.currencyCode;
                        $scope.currencyCode = data.currencyCode;
                        CustomApplicationServices.getApplicationDetail($scope.view.currentUrl, $stateParams.applicationOID)
                            .success(function (data) {
                                $ionicLoading.hide();
                                $scope.view.applicationData = data;
                                if($stateParams.formType == 2001){
                                    $scope.view.currentCity = LocationService.getCity();
                                    if($scope.view.currentCity){
                                        //根据城市名字拿城市code
                                        //不要翻译
                                        if($scope.view.currentCity.charAt($scope.view.currentCity.length - 1) == '市'){
                                            $scope.view.currentCity = $scope.view.currentCity.substring(0, $scope.view.currentCity.length - 1)
                                        }
                                        CustomApplicationServices.getCityCode($scope.view.currentCity, $sessionStorage.lang, 'CITY')
                                            .success(function (data) {
                                                if(data && data.length > 0){
                                                    if(data[0].code){
                                                        $scope.view.currentCityCode = data[0].code;
                                                        $scope.view.currentCity = data[0].city;
                                                    } else {
                                                        $scope.view.currentCity = null;
                                                        $scope.view.currentCityCode = null;
                                                    }
                                                }
                                            })
                                            .error(function () {
                                                $scope.view.currentCity = null;
                                                $scope.view.currentCityCode = null;
                                            })
                                    }
                                    if($scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks == '' || !$scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks) {
                                        $scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks = [];
                                    }
                                    if($scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks == '' || !$scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks) {
                                        $scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks = [];
                                    }
                                    if($scope.view.content !== 'travelNext'){
                                        CustomApplicationServices.getMaxTicket($scope.view.applicationData.applicationOID)
                                            .success(function (data) {
                                                $scope.view.ticketMessage = data;
                                            })
                                    }
                                }
                                $scope.view.selectParicipantOids.push(data.applicantOID);
                                $scope.view.selectParicipantNames.push(data.applicantName);
                                $scope.view.applicantName = data.applicantName;
                                var applicant = {};
                                applicant.text = data.applicantName;
                                $scope.view.selectParicipantList.push(applicant);
                                if(data.createdBy && data.createdName && $scope.view.selectParicipantOids.indexOf(data.createdBy) == -1){
                                    $scope.view.selectParicipantOids.push(data.createdBy);
                                    $scope.view.selectParicipantNames.push(data.createdName);
                                    var creator = {};
                                    creator.text = data.createdName;
                                    $scope.view.selectParicipantList.push(creator);
                                }
                                if ($stateParams.formType == 2001 && $scope.view.applicationData.customFormProperties) {
                                    if($scope.view.applicationData.customFormProperties.controlFields && JSON.parse($scope.view.applicationData.customFormProperties.controlFields)){
                                        $scope.view.applicationData.customFormProperties.controlFields = JSON.parse($scope.view.applicationData.customFormProperties.controlFields);
                                    }
                                };
                                $scope.budgetError=[];
                                if(data.warning){
                                    var warning=JSON.parse(data.warning);
                                    $scope.budgetError.push({
                                        externalPropertyName:warning.externalPropertyName,
                                        message:warning.message
                                    });
                                    $scope.budgetError.forEach(function (item) {
                                        item.errorMsg=[];
                                        if(item.message){
                                            item.errorMsg = item.message.split(",").map(function(item, index) {
                                                return {id: index, msg: item}
                                            })
                                        }
                                    });
                                }

                                if($stateParams.formType == 2001){
                                    //获取酒店profile
                                    SelfDefineExpenseReport.getCustomForm($scope.view.applicationData.formOID)
                                        .success(function (data) {
                                            if(data.customFormPropertyMap && data.customFormPropertyMap['application.property.control.fields.hotel']
                                            && JSON.parse(data.customFormPropertyMap['application.property.control.fields.hotel'])){
                                                $scope.view.hotelProfile = JSON.parse(data.customFormPropertyMap['application.property.control.fields.hotel']);
                                            }
                                        })
                                }
                                //获取费用类型
                                $scope.view.getRelatedExpenseType();
                                // 遍历custFormValues
                                angular.forEach(data.custFormValues, function (item) {
                                    if(item.messageKey === 'attachment'){
                                        if(item.attachmentImages && item.attachmentImages.length){
                                            $scope.view.attachments = item.attachmentImages;
                                            $scope.attachmentSrc = $scope.view.attachments;
                                        }
                                    }
                                });
                                if($scope.view.attachments && $scope.view.attachments.length > 0){
                                    $scope.view.pics = [];
                                    angular.forEach($scope.view.attachments, function (item) {
                                        $scope.view.pics.push({
                                            src: item.fileURL,
                                            thumb: item.thumbnailUrl
                                        })
                                    });
                                }
                                if ($scope.view.applicationData.type === 2005) {
                                    $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.applicationData.currencyCode)
                                }
                                //是否有侧边栏
                                if(($scope.view.content === 'waitApproval' && !$scope.view.functionProfileList['ca.opt.withdraw.disabled']) ||
                                    $scope.view.content === 'travelNext' || ($scope.view.content == 'hasPass' && ($stateParams.formType == 2001 || $stateParams.formType == 2002) && $scope.view.applicationData.status == 1003
                                    && $scope.view.applicationData.applicationParticipant && $scope.view.applicationData.applicationParticipant.closed == 0 && $scope.view.applicationData.customFormProperties
                                    && $scope.view.applicationData.customFormProperties.participantEnable == 1) ||
                                    ($scope.view.content == 'hasPass'
                                    && $scope.view.applicationData.applicationParticipant
                                    && $scope.view.applicationData.applicationParticipant.closed == 1
                                    && $scope.view.applicationData.customFormProperties
                                    && $scope.view.applicationData.customFormProperties.restartEnabled == 1
                                    && !$scope.view.applicationData.closed
                                    && $scope.view.applicationData.customFormProperties.participantEnable == 1)
                                    || ($scope.view.content === 'hasPass' && $stateParams.formType == 2005 && !$scope.view.functionProfileList['ca.loan.passed.print.disabled'])
                                ){
                                    $scope.view.hasNav = true;
                                } else {
                                    $scope.view.hasNav = false;
                                }

                                //行程
                                if ($scope.view.applicationData.travelApplication && $scope.view.applicationData.travelApplication.travelItinerarys.length > 0) {
                                    for (var i = 0; i < $scope.view.applicationData.travelApplication.travelItinerarys.length; i++) {
                                        //差旅要素获取名字
                                        // if(!$scope.view.applicationData.travelApplication.travelItinerarys[i].travelElements || $scope.view.applicationData.travelApplication.travelItinerarys[i].travelElements === null){
                                        //     $scope.view.applicationData.travelApplication.travelItinerarys[i].travelElements = [];
                                        // }
                                        if ($scope.view.applicationData.travelApplication.travelItinerarys[i].travelElements.length > 0) {
                                            $scope.view.getBatchElement(i);
                                        }
                                        // if(i === 0){
                                        $scope.view.applicationData.travelApplication.travelItinerarys[i].isExpand = true;
                                        // } else {
                                        //     $scope.view.applicationData.travelApplication.travelItinerarys[i].isExpand = false;
                                        // }
                                        $scope.view.applicationData.travelApplication.travelItinerarys[i].hasTravelElement = false;
                                        //差旅申请中日程的天数中文情况下显示'一二三...',其他语言显示'123...'
                                        if ($sessionStorage.lang === 'zh_cn') {
                                            $scope.view.applicationData.travelApplication.travelItinerarys[i].dayNumber = nzhcn.encodeS(i + 1);
                                        } else {
                                            $scope.view.applicationData.travelApplication.travelItinerarys[i].dayNumber = i + 1;
                                        }
                                        $scope.view.applicationData.travelApplication.travelItinerarys[i].week = new Date($scope.view.applicationData.travelApplication.travelItinerarys[i].itineraryDate).getDay();
                                        $scope.view.applicationData.travelApplication.travelItinerarys[i].itineraryDate = moment($scope.view.applicationData.travelApplication.travelItinerarys[i].itineraryDate).format('YYYY-MM-DD');
                                    }
                                }

                                //订单
                                if ($scope.view.applicationData.travelOrders && $scope.view.applicationData.travelOrders.length > 0) {
                                    for (var i = 0; i < $scope.view.applicationData.travelOrders.length; i++) {
                                        if ($scope.view.noOrder) {
                                            if ($scope.view.applicationData.travelOrders[i].type === 1002 || $scope.view.applicationData.travelOrders[i].userOID === $scope.view.applicationData.applicantOID) {
                                                $scope.view.noOrder = false;
                                            }
                                        }
                                        // if(i === 0){
                                        $scope.view.applicationData.travelOrders[i].showDetail = true;
                                        // } else {
                                        //     $scope.view.applicationData.travelOrders[i].showDetail = false;
                                        // }
                                    }
                                }
                                if ($scope.view.applicationData.custFormValues && $scope.view.applicationData.custFormValues.length > 0) {
                                    $scope.isFinishCustomValue = false;
                                    for (var i = 0; i < $scope.view.applicationData.custFormValues.length; i++) {
                                        // 申请人
                                        var formValue = $scope.view.applicationData.custFormValues[i];
                                        if (formValue.messageKey === 'applicant') {
                                            formValue.applicantName = $scope.view.applicationData.applicantName;
                                        }
                                        //值列表
                                        if (($scope.view.applicationData.custFormValues[i].fieldType && $scope.view.applicationData.custFormValues[i].fieldType === 'CUSTOM_ENUMERATION') || $scope.view.applicationData.custFormValues[i].messageKey === 'cust_list') {
                                            if ($scope.view.applicationData.custFormValues[i].dataSource && JSON.parse($scope.view.applicationData.custFormValues[i].dataSource)) {
                                                var json = JSON.parse($scope.view.applicationData.custFormValues[i].dataSource);
                                                $scope.view.applicationData.custFormValues[i].customEnumerationOID = json.customEnumerationOID;
                                            } else {
                                                $scope.view.applicationData.custFormValues[i].customEnumerationOID = null;
                                            }
                                            if ($scope.view.applicationData.custFormValues[i].value) {
                                                //$scope.view.getValueName(i);
                                                $scope.view.getMessageKeyDetail(i,$scope.view.applicationData.custFormValues[i].customEnumerationOID,$scope.view.applicationData.custFormValues[i].value);
                                            }
                                        }
                                        //是否还款
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'writeoff_flag') {
                                            var indexWrite = i;
                                            if ($scope.view.applicationData.custFormValues[indexWrite].value === 'true') {
                                                $scope.view.applicationData.custFormValues[indexWrite].value = true;
                                            } else {
                                                $scope.view.applicationData.custFormValues[indexWrite].value = false;
                                            }
                                        }
                                        //成本中心项目名字获取
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_cost_center') {
                                            $scope.view.getCostCenterName(i);
                                        }
                                        //部门名称获取
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_department') {
                                            $scope.view.getDepartmentName(i);
                                        }
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_approver') {
                                            $scope.view.getSelectedApproval(i);
                                        }
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_special_booking_person') {
                                            $scope.view.getSelectedApproval(i);
                                        }
                                        if($scope.view.applicationData.custFormValues[i].messageKey === 'out_participant_num' && $scope.view.applicationData.custFormValues[i].value){
                                            $scope.view.outParticipantNum = parseInt($scope.view.applicationData.custFormValues[i].value);
                                        }
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'total_budget') {
                                            $scope.view.applicationData.custFormValues[i].value = parseFloat($scope.view.applicationData.custFormValues[i].value);
                                            $scope.view.totalAmount = $scope.view.applicationData.custFormValues[i].value
                                        }
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'budget_detail') {
                                            var invoiceIndex = i;
                                            $scope.view.getInvoiceList(invoiceIndex);
                                        }
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'currency_code') {
                                            var currencyIndex = i;
                                            $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.applicationData.custFormValues[currencyIndex].value);
                                        }
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'start_date') {
                                            if ($scope.view.applicationData.custFormValues[i].value) {
                                                $scope.view.startDate = new Date($scope.view.applicationData.custFormValues[i].value).Format('yyyy-MM-dd');
                                                if($scope.view.startDate){
                                                    //处理差补数据
                                                    if ($stateParams.formType == 2001 && $scope.view.applicationData.travelApplication && $scope.view.applicationData.travelApplication.travelSubsidies
                                                        && JSON.parse($scope.view.applicationData.travelApplication.travelSubsidies)){
                                                        $scope.view.travelSubsidiesList = JSON.parse($scope.view.applicationData.travelApplication.travelSubsidies);
                                                        $scope.view.subsidiesListCopy = angular.copy($scope.view.travelSubsidiesList);
                                                        if(!$scope.view.subsidiesListCopy){
                                                            $scope.view.subsidiesListCopy = [];
                                                        }
                                                        $scope.view.getSubsidiesDetail();
                                                    } else {
                                                        $scope.view.travelSubsidiesList = [];
                                                    }
                                                }
                                                if($scope.view.startDate && $scope.view.endDate){
                                                    //获取所有差旅行程
                                                    if(!$scope.view.hasGetDay){
                                                        $scope.view.hasGetDay = true;
                                                        $scope.view.travelDay = $scope.view.getDiffDay($scope.view.startDate, $scope.view.endDate) +1;
                                                    }
                                                    if(!$scope.view.hasGetItinerary){
                                                        $scope.view.hasGetItinerary = true;
                                                        $scope.view.getAllItineraryDetail();
                                                    }
                                                }
                                            }
                                        }
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'end_date') {
                                            if ($scope.view.applicationData.custFormValues[i].value) {
                                                $scope.view.endDate = new Date($scope.view.applicationData.custFormValues[i].value).Format('yyyy-MM-dd');
                                                if($scope.view.startDate != null && $scope.view.startDate != '' && $scope.view.endDate != null && $scope.view.endDate != ''){
                                                    if(!$scope.view.hasGetDay){
                                                        $scope.view.hasGetDay = true;
                                                        $scope.view.travelDay = $scope.view.getDiffDay($scope.view.startDate, $scope.view.endDate) +1;
                                                    }
                                                    //获取所有差旅行程
                                                    if(!$scope.view.hasGetItinerary){
                                                        $scope.view.hasGetItinerary = true;
                                                        $scope.view.getAllItineraryDetail();
                                                    }
                                                }
                                                $scope.view.getOrderTicketStatus();
                                            }
                                        }
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_air_ticket_supplier') {
                                            var supplyIndex = i;
                                            $scope.view.supplierOID = $scope.view.applicationData.custFormValues[i].value;
                                            $scope.view.getSupplierList(supplyIndex);
                                        }
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_corporation_entity') {
                                            $scope.view.getCorporationEntityName(i);
                                        }
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_participant') {
                                            if ($scope.view.applicationData.custFormValues[i].value !== null && $scope.view.applicationData.custFormValues[i].value !== '') {
                                                $scope.view.applicationData.custFormValues[i].applicationParticipants = JSON.parse($scope.view.applicationData.custFormValues[i].value);
                                                var applicationParticipantList = $scope.view.applicationData.custFormValues[i].applicationParticipants;
                                                for(var j = 0; j < applicationParticipantList.length; j++){
                                                    if($scope.view.userOID == applicationParticipantList[j].userOID){
                                                        $scope.view.userInParticipants = true;
                                                        break;
                                                    }
                                                }
                                            } else {
                                                $scope.view.applicationData.custFormValues[i].applicationParticipants = [];
                                            }
                                            $scope.view.applicationParticipants = $scope.view.applicationData.custFormValues[i].applicationParticipants;
                                            //差旅人员oids, names
                                            $scope.view.applicationParticipants.forEach(function (item) {
                                                if ($scope.view.participantOids.indexOf(item.userOID) === -1) {
                                                    $scope.view.participantOids.push(item.userOID);
                                                    $scope.view.participantNames.push(item.fullName);
                                                }
                                                if($scope.view.selectParicipantOids.indexOf(item.userOID) === -1){
                                                    $scope.view.selectParicipantOids.push(item.userOID);
                                                    $scope.view.selectParicipantNames.push(item.fullName);
                                                    var user = {};
                                                    user.text = item.fullName;
                                                    $scope.view.selectParicipantList.push(user);
                                                }
                                            });
                                        }
                                        //联动开关
                                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'linkage_switch') {
                                            if ($scope.view.applicationData.custFormValues[i].value === 'true') {
                                                $scope.view.applicationData.custFormValues[i].value = true;
                                            } else {
                                                $scope.view.applicationData.custFormValues[i].value = false;
                                            }
                                            if ($scope.view.applicationData.custFormValues[i].fieldContent && JSON.parse($scope.view.applicationData.custFormValues[i].fieldContent)) {
                                                $scope.view.applicationData.custFormValues[i].content = JSON.parse($scope.view.applicationData.custFormValues[i].fieldContent);
                                            } else {
                                                $scope.view.applicationData.custFormValues[i].content = [];
                                            }
                                        }
                                        if($scope.view.applicationData.custFormValues[i].messageKey === 'select_box') {
                                            //选择框
                                            $scope.view.applicationData.custFormValues[i].selectValue = JSON.parse($scope.view.applicationData.custFormValues[i].value);
                                        }
                                        if($scope.view.applicationData.custFormValues[i].messageKey === 'contact_bank_account'){
                                            //银行卡
                                            $scope.view.applicationData.custFormValues[i].bankAccountNo = null;
                                            $scope.view.getContactBankAccountName(i);
                                        }
                                        if($scope.view.applicationData.custFormValues[i].messageKey === 'select_corporation_entity'){
                                            $scope.view.corporationOID = $scope.view.applicationData.custFormValues[i].value;
                                            $scope.view.getCorporationEntityName(i);
                                        }
                                        if(i >= $scope.view.applicationData.custFormValues.length -1){
                                            $scope.isFinishCustomValue = true;
                                        }
                                    }
                                    if($stateParams.formType == 2001){
                                        if($scope.view.applicationParticipants.length == $scope.view.participantOids.length && $scope.isFinishCustomValue){
                                            //获取房间最大数量
                                            CustomApplicationServices.getHotelMaxRoom($scope.view.participantOids, $scope.view.outParticipantNum)
                                                .success(function (data) {
                                                    $scope.view.hotelRoomData = data;
                                                    $scope.view.hotelMaleClerksName = '';
                                                    $scope.view.hotelFemaleClerksName = '';
                                                    if($scope.view.applicationData.travelApplication && $scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks && $scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks.length > 0 && $scope.view.hotelRoomData.maleUsers && $scope.view.hotelRoomData.maleUsers.length > 0 ){
                                                        for(var i = 0; i < $scope.view.hotelRoomData.maleUsers.length; i++){
                                                            if($scope.view.applicationData.travelApplication.travelHotelBookingMaleClerks.indexOf($scope.view.hotelRoomData.maleUsers[i].userOID) > -1){
                                                                $scope.view.hotelMaleClerksName += $scope.view.hotelRoomData.maleUsers[i].fullName + '，';
                                                            }
                                                        }
                                                    }
                                                    if($scope.view.applicationData.travelApplication && $scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks && $scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks.length > 0 && $scope.view.hotelRoomData.femaleUsers && $scope.view.hotelRoomData.femaleUsers.length > 0 ){
                                                        for(var i = 0; i < $scope.view.hotelRoomData.femaleUsers.length; i++){
                                                            if($scope.view.applicationData.travelApplication.travelHotelBookingFemaleClerks.indexOf($scope.view.hotelRoomData.femaleUsers[i].userOID) > -1){
                                                                $scope.view.hotelFemaleClerksName += $scope.view.hotelRoomData.femaleUsers[i].fullName + '，';
                                                            }
                                                        }
                                                    }
                                                    //获取随机预定人
                                                    $scope.view.getRandomClerk();
                                                })
                                        }
                                    }
                                }
                                if ($scope.view.applicationData.travelBookerApplication && $scope.view.applicationData.travelBookerApplication.externalParticipantNumber > 0) {
                                    $scope.view.enternalNumName = $filter('translate')('custom.application.travel.all') + $scope.view.applicationData.travelBookerApplication.externalParticipantNumber + $filter('translate')('custom.application.travel.person');
                                }
                                if ($scope.view.applicationData.travelBookerApplication && $scope.view.applicationData.travelBookerApplication.bookerOID !== null && $scope.view.applicationData.travelBookerApplication.bookerOID !== '') {
                                    var uerOIDs = [];
                                    uerOIDs.push($scope.view.applicationData.travelBookerApplication.bookerOID);
                                    TravelERVService.getBatchUsers(uerOIDs)
                                        .success(function (data) {
                                            $scope.view.bookerName = data[0].fullName;
                                        })

                                }
                                if($scope.view.applicationData.writeoffArtificialDTO){
                                    CustomApplicationServices.getRefundList($scope.view.applicationData.applicationOID)
                                        .success(function (dataList) {
                                            if (dataList && dataList.length > 0) {
                                                for (var i = 0; i < dataList.length; i++) {
                                                    if (dataList[i].status === '1001' && $scope.view.applicationData.writeoffArtificialDTO.stayWriteoffAmount===0) {
                                                        $scope.view.noRefund = true;
                                                        break;
                                                    }
                                                }
                                            }
                                        });
                                }
                                if($scope.view.applicationData && $scope.view.applicationData.travelApplication){
                                    $scope.view.travelSubsidiesBudgetTotalAmount = $scope.view.amount;
                                    getTravelSubsidiesBudgets($scope.view.applicationData.travelApplication);
                                    getTravelItinerarys($scope.view.applicationData.travelApplication);
                                }
                            })
                            .error(function (data) {
                                $ionicLoading.hide();
                                if (data.errorCode === 'OBJECT_NOT_FOUND') {
                                    $scope.view.isNotFound = true;
                                } else if(data.message){
                                    PublicFunction.showToast(data.message)
                                } else {
                                    PublicFunction.showToast($filter('translate')('custom.application.travel.error'));//出错了
                                }
                            })
                    });
                })
            }

            //添加交通
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/add.traffic.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.addTraffic = modal;
            });

            //退改签
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/refund.dialog.tpl.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.refundDialog = modal;
            });

            //添加
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/add.select.dialog.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.addSelectDialog = modal;
            });

            //添加差旅补贴
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/add.travel.allowance.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.travelAllowanceModal = modal;
            });
            // //预约单
            // $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/appointment.modal.html', {
            //     scope: $scope,
            //     animation: 'none'
            // }).then(function (modal) {
            //     $scope.appointmentModal = modal;
            // });

            //添加客户信息
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/customer.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.customerModal = modal;
            });

            //添加新版的机票行程
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/add.plane.itinerary.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.ticketModal = modal;
            });

            //添加新版的差补
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/add.allowance.itinerary.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.allowanceModal = modal;
            });

            //添加新版的差补
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/add.remark.itinerary.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.remarkModal = modal;
            });

            //添加新版的其他交通
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/add.other.itinerary.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.otherModal = modal;
            });

            //添加新版的火车
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/add.train.itinerary.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.trainModal = modal;
            });

            //添加新版的酒店
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/add.hotel.itinerary.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.hotelModal = modal;
            });

            //显示统一订票
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/together.book.ticket.modal.html', {
                scope: $scope,
                backdropClickToClose: true,
                animation: 'none'
            }).then(function (modal) {
                $scope.bookTicketModal = modal;
            });

            //选择酒店预定人
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/select.hotel.booker.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.hotelBookerModal = modal;
            });

            //删除往返行程
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/delete.itinerary.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.deleteItineraryModal = modal;
            });
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/application.budget.modal.html',{
                scope:$scope,
                animation:'none'
            }).then(function (modal) {
                $scope.applicationBuagetModal=modal;

            });



            init();

            $scope.showScroll = function () {
                if(!$scope.view.hasBlueBar && !$scope.view.showModal){
                    $scope.view.hasBlueBar = true;
                    $timeout(function () {
                        $scope.view.hasBlueBar = false;
                        if ($('.expand-member-list').offset().top < 0) {
                            $('ion-header-bar.bar.bar-header').removeClass('blue-bar');
                            $scope.view.hasEditBase = false;
                        } else {
                            $('ion-header-bar.bar.bar-header').addClass('blue-bar');
                            $scope.view.hasEditBase = true;
                        }
                    }, 100)
                }
                if($scope.view.content == 'travelNext' && $scope.view.applicationData.type == 1002 && !$scope.view.showModal){
                    if ($('.slide-content-second').offset().top < 0) {
                        if (!$scope.view.leaveTop ) {
                            $scope.view.leaveTop = true;
                            $('ion-content').addClass('has-hasElement');
                        }
                    }
                    if($('.slide-content-second').offset().top + 70 >= 0){
                        if ($scope.view.leaveTop) {
                            $scope.view.leaveTop = false;
                            $('ion-content').removeClass('has-hasElement');
                        }
                    }
                }
            }



            $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/base.popover.tpl.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.popover = popover;
            });
            $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/check.budget.popover.html',{
                scope:$scope
            }).then(function (popover) {
                $scope.budgetPopover=popover;

            });
            $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/select.user.modal.html',{
                scope:$scope
            }).then(function (popover) {
                $scope.togetherBookerModal = popover;

            });

            //选择差补类型modal
            $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/select.allowance.type.modal.html',{
                scope:$scope
            }).then(function (popover) {
                $scope.selectAllowanceTypeModal = popover;

            });

            $scope.openPopover = function($event) {
                if($scope.view.content === 'waitApproval' && !$scope.view.functionProfileList['ca.opt.withdraw.disabled']){
                    $scope.view.rightNavList = [
                        {
                            name: $filter('translate')('custom.application.nav.withdraw'), //撤回该申请单
                            id: 'withdraw'
                        }
                    ]
                } else if($scope.view.content === 'travelNext'){
                    $scope.view.rightNavList = [
                        {
                            name: $filter('translate')('custom.application.nav.delete'),  //'删除该申请单'
                            id: 'delete'
                        }
                    ]
                } else if($scope.view.content == 'hasPass' && ($stateParams.formType == 2001 || $stateParams.formType == 2002) && $scope.view.applicationData.status == 1003
                    && $scope.view.applicationData.applicationParticipant && $scope.view.applicationData.applicationParticipant.closed == 0 && $scope.view.applicationData.customFormProperties
                    && $scope.view.applicationData.customFormProperties.participantEnable == 1){
                    $scope.view.rightNavList = [
                        {
                            name: $filter('translate')('custom.application.nav.close'),  //'停用该申请单'
                            id: 'close'
                        }
                    ]
                } else if($scope.view.content == 'hasPass' && $scope.view.applicationData.applicationParticipant && $scope.view.applicationData.applicationParticipant.closed == 1 && $scope.view.applicationData.customFormProperties.restartEnabled == 1 && !$scope.view.applicationData.closed
                    && $scope.view.applicationData.customFormProperties && $scope.view.applicationData.customFormProperties.participantEnable == 1){
                    $scope.view.rightNavList = [
                        {
                            name: $filter('translate')('custom.application.nav.restart'),  //'启用该申请单'
                            id: 'restart'
                        }
                    ]
                } else if ($scope.view.content == 'hasPass' && $stateParams.formType == 2005 && !$scope.view.functionProfileList['ca.loan.passed.print.disabled']) {
                    //已通过的借款申请单可打印
                    $scope.view.rightNavList = [
                        {
                            name: '打印',  //'打印该申请单'
                            id: 'print'
                        }
                    ]
                }
                $scope.popover.show($event);
            };

            //复制
            $ionicPopover.fromTemplateUrl("scripts/pages/company_receipted_invoice/company.copy.text.html", {
                scope: $scope
            }).then(function (popover) {
                $scope.copyPopover = popover;
            });


            $scope.options = {
                loop: false,
                effect: 'fade',
                speed: 500,
            }
            $scope.$watch('view.showModal', function (newValue, oldValue) {
                if ($scope.view.showModal) {
                    $('ion-header-bar.bar.bar-header').removeClass('blue-bar');
                    $('ion-content').removeClass('has-hasElement');
                } else {
                    $timeout(function () {
                        $('ion-header-bar.bar.bar-header').addClass('blue-bar');
                        $ionicScrollDelegate.scrollTop();
                    }, 400)
                }
            });
            $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
                // data.slider is the instance of Swiper
                $scope.slider = data.slider;
            });
            $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
                // note: the indexes are 0-based
                $scope.activeIndex = data.slider.activeIndex;
                $scope.previousIndex = data.slider.previousIndex;
            });

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                $('ion-header-bar.bar.bar-header').addClass('blue-bar');
            });

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (toState.name === 'app.custom_application_create' || toState.name === 'app.custom_application_edit' || toState.name==='app.didi_refund_detail') {
                    if (!$scope.view.isHandEdit) {
                        $state.go('app.custom_application_list')
                    }
                }
            });
            $scope.$on('$ionicView.leave', function (event, viewData) {
                if (opinionPopup) {
                    opinionPopup.close();
                }
            });
            $scope.$on('$destroy', function () {//当页面关闭的时候,即使的摧毁掉当前的modal
                $scope.addTraffic.remove();
                $scope.refundDialog.remove();
                $scope.travelAllowanceModal.remove();
                $scope.customerModal.remove();
                $scope.remarkModal.remove();
                $scope.trainModal.remove();
                $scope.hotelModal.remove();
                $scope.bookTicketModal.remove();
                $scope.hotelBookerModal.remove();
                $scope.deleteItineraryModal.remove();
                $scope.applicationBuagetModal.remove();
            });

        }])
    /*
     * 过滤器：getContinueDays
     * 将日期数组中连续日期使用~相连
     * ['2016-02-28', '2016-02-29', '2016-03-01', '2016-03-02', 2016-03-03', '2016-03-05', '2016-03-07', '2016-03-08'] | getContinueDays
     * 2016-02-28 ~ 2016-03-03 、2016-03-05 、2016-03-07 ~ 2016-03-08
     * */
    .filter('getContinueDays', function () {
        var continueDays = function (arr_days) { // 将传过来的数组中日期去掉时分秒转换成时间戳
            // 先排序，然后转时间戳
            var _days = arr_days.sort();
            var days = _days.map(function (d, i) {
                var dt = new Date(d);
                dt.setDate(dt.getDate() + arr_days.length - 1 - i); // 将排序后的日期加上不同的天数处理为相同日期
                // 抹去 时 分 秒 毫秒
                dt.setHours(0);
                dt.setMinutes(0);
                dt.setSeconds(0);
                dt.setMilliseconds(0);
                return +dt;
            });

            var temp = [];
            var tmpArr = [];
            var str = '';
            /*
             * 将连续的日期放在同一个数组中
             * [["2016-02-28", "2016-02-29", "2016-03-01", "2016-03-02", "2016-03-03"], ["2016-03-05"], ["2016-03-07", "2016-03-08"]]
             * */
            angular.forEach(days, function (item, index) {  // 比较数组中时间戳是否相等，进行分组
                temp.push(_days[index]);
                if (item !== days[index + 1]) {
                    tmpArr.push(temp);
                    temp = [];
                }
            });
            /*
             * 遍历数组，将数组转换成字符串
             * 2016-02-28 ~ 2016-03-03 、2016-03-05 、2016-03-07 ~ 2016-03-08
             * */
            angular.forEach(tmpArr, function (item, index) {
                if (item.length > 1) {
                    str = index < tmpArr.length - 1 ? str + item[0] + ' ~ ' + item[item.length - 1] + ' 、' : str + item[0] + ' ~ ' + item[item.length - 1];
                } else {
                    str = index < tmpArr.length - 1 ? str + item[0] + ' 、' : str + item[0];
                }
            });
            return str;
        };
        return function (input) {
            return continueDays(input);
        }
    })
;
