/**
 * Created by Yuko on 16/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.erv_create_travel_next', {
                url: '/erv/create/travel/next?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.next.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelNextController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'next';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.erv_travel_detail_edit', {
                url: '/erv/travel/detail/edit?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.next.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelNextController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'edit';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.erv_travel_wait_approval', {
                url: '/erv/travel/wait/approval?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.next.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelNextController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'waitApproval';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            //未生成过报销单的
            .state('app.erv_travel_has_pass', {
                url: '/erv/travel/has/pass?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.next.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelNextController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'hasPass';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            //已生成过报销单的
            .state('app.erv_travel_order', {
                url: '/erv/travel/order?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.next.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelNextController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'order';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.erv_travel_has_reject', {
                url: '/erv/travel/has/reject?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.next.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelNextController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'hasReject';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.erv_travel_approval', {
                url: '/erv/travel/approval?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.next.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelNextController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'approval';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.erv_travel_detail', {
                url: '/erv/travel/detail?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.next.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelNextController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'detail';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.huilianyi.ErvCreateTravelNextController', ['$scope', '$state', '$ionicModal', '$ionicHistory', 'TravelService', 'ParseLinks', '$ionicLoading', 'LocationService', 'TravelERVService', 'content', '$stateParams', '$ionicPopup', 'ApprovalERVService', 'CtripService', 'Principal', 'CurrencyCodeService', '$timeout', 'CompanyConfigurationService', 'PublicFunction', 'FunctionProfileService', 'ServiceBaseURL', '$q', 'ApprovalPopupService','$filter','$sessionStorage',
        function ($scope, $state, $ionicModal, $ionicHistory, TravelService, ParseLinks, $ionicLoading, LocationService, TravelERVService, content, $stateParams, $ionicPopup, ApprovalERVService, CtripService, Principal, CurrencyCodeService, $timeout, CompanyConfigurationService, PublicFunction, FunctionProfileService, ServiceBaseURL, $q, ApprovalPopupService,$filter,$sessionStorage) {
            $scope.view = {
                enternalNumName: null,
                notFoundIcon: 'img/error-icon/not-found.png',
                isNotFound: false,
                notFoundText: $filter('translate')('create.next_js.The.travel.application.has.been.deleted'),//该差旅申请已删除
                selectedSupplier: null,
                SupplierList: null,
                isHandEdit: false,
                code: null, //货币符号
                startDate: new Date().Format('yyyy-MM-dd'),
                endDate: new Date().Format('yyyy-MM-dd'),
                rejectReason: null,
                journey: [],
                showTravelMember: true,
                disabled: false,//已经点过
                disabledPlane: true,
                disabledTrain: true,
                disabledHotel: false,
                pageable: {
                    page: 0,
                    size: 10
                },
                readOnly: false,
                userOID: null,
                currentDay: -1,//当前安排的第几天
                currentTraffic: null, //当前选择的交通
                title: $filter('translate')('create.next_js.Travel.application'),//差旅申请
                route: {
                    trafficType: null,
                    fromCity: null,
                    toCity: null
                },
                configuration: [],
                hasCtrip: false,
                hasTongCheng: false,
                content: content,
                language: $sessionStorage.lang,//获取当前语言环境
                //保存差旅
                saveTravel: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    TravelERVService.travelDraft($scope.view.travel)
                        .success(function () {
                            $ionicLoading.hide();
                            TravelERVService.setTab('init');
                            PublicFunction.showToast($filter('translate')('create.next_js.Save.success'));//保存成功
                            $timeout(function () {
                                //if ($scope.view.content === 'next') {
                                //    $ionicHistory.goBack(-2);
                                //} else {
                                $scope.view.goBack();
                                //}
                            }, 500);
                        })
                        .error(function (error) {
                            $ionicLoading.hide();
                            if(error.message){
                                PublicFunction.showToast(error.message);
                            } else {
                                PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                            }
                        });
                },
                showOpinionPopup: function () {
                    var opinionPopup = $ionicPopup.show({
                        template: '<textarea type="text" style="padding:10px;" placeholder="' + $filter('translate')('create.next_js.Please.enter.the.reject.reason') + '" ng-model="view.rejectReason" rows="6" maxlength="100">',
                        title: '<h5>'+$filter('translate')('create.next_js.Reason.for.rejection')+'</h5>',//<h5>驳回理由</h5>
                        scope: $scope,
                        buttons: [
                            {text: $filter('translate')('create.arrange.cancel')},//取消
                            {
                                text: $filter('translate')('create.next_js.confirm'),//确认
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.view.rejectReason) {
                                        $ionicLoading.show({
                                            template: $filter('translate')('create.next_js.Please.enter.the.reject.reason'),//请输入驳回理由
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

                //驳回
                reject: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    var entry = {};
                    entry.entities = [];
                    var entryItem = {};
                    entryItem.entityOID = $stateParams.applicationOID;
                    entryItem.entityType = 1001;
                    entry.entities.push(entryItem);
                    entry.approvalTxt = $scope.view.rejectReason;
                    ApprovalERVService.reject(entry)
                        .success(function (data) {
                            if(data.failNum > 0){
                                PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                            } else {
                                PublicFunction.showToast($filter('translate')('create.next_js.Has.been.rejected'));//已驳回
                                $timeout(function () {
                                    $scope.view.goBack();
                                }, 500);
                            }
                        })
                        .error(function(error){
                            if(error.message){
                                PublicFunction.showToast(error.message);
                            } else {
                                PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                            }
                        })
                        .finally(function () {
                            $ionicLoading.hide();
                        });
                },
                agree: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
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
                            if(data.failNum > 0){
                                PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                            } else {
                                PublicFunction.showToast($filter('translate')('list_js.Have.been.through'));//已通过
                                $timeout(function () {
                                    $scope.view.goBack();
                                }, 500);
                            }
                        })
                        .error(function (error) {
                            $ionicLoading.hide();
                            if(error.message){
                                PublicFunction.showToast(error.message);
                            } else {
                                PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                            }
                        });
                },
                //撤回
                withdrawTravel: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    var data = {
                        entities: []
                    };
                    var entitty = {};
                    entitty.entityOID = $stateParams.applicationOID;
                    entitty.entityType = 1001;
                    data.entities.push(entitty);
                    TravelERVService.withdrawTravel(data)
                        .success(function () {
                            TravelERVService.setTab('init');
                            PublicFunction.showToast($filter('translate')('list_js.Withdraw.the.success'));//撤回成功
                            $timeout(function () {
                                $scope.view.goBack();
                            }, 500);
                        })
                        .error(function (error) {
                            if(error.message){
                                PublicFunction.showToast(error.message);
                            } else {
                                PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                            }
                        })
                        .finally(function () {
                            $ionicLoading.hide();
                        });
                },
                changeExpand: function (index) {
                    $scope.view.travel.travelApplication.travelItinerarys[index].isExpand = !$scope.view.travel.travelApplication.travelItinerarys[index].isExpand
                },
                hasTraffics: function () {
                    for (var i = 0; i < $scope.view.travel.travelApplication.travelItinerarys.length; i++) {
                        var traffics = $scope.view.travel.travelApplication.travelItinerarys[i].travelItineraryTraffics;
                        if (traffics && traffics.length > 0) {
                            return true
                        }
                    }
                    return false
                },
                //检查差旅申请的行程是否为空
                checkItinerary: function (travelApplication) {
                    var deferred = $q.defer();
                    var itinerary = travelApplication.travelItinerarys;
                    for (var i = 0; i < (itinerary && itinerary.length); i++) {
                        if (itinerary[i].travelItineraryTraffics && itinerary[i].travelItineraryTraffics.length)
                        {
                            deferred.resolve();
                            return deferred.promise;
                        }
                    }
                    //您没有添加任何行程信息，可能导致无法在供应商处下单，确认要提交么？
                    $ionicPopup.confirm({
                       template: '<p style="text-align: center">' + $filter('translate')('create.next_js.no_traffic_warn') + '</p>',
                       cancelText: $filter('translate')('common.cancel'),
                       cancelType: 'button-calm',
                       okText: $filter('translate')('common.ok')
                   }).then(function (result) {
                        if (result)
                            deferred.resolve();
                        else
                            deferred.reject();
                    });
                    return deferred.promise;
                },
                submitTravel: function () {
                    if ($scope.view.functionProfileList['ta.itinerary.required'] && !$scope.view.hasTraffics()) {
                        $ionicLoading.show({
                            template: "$filter('translate')('create.next_js.Please.add.the.transportation')",//请添加交通
                            duration: 1000
                        });
                        return
                    }
                    //检查差旅申请的行程是否为空
                    $scope.view.checkItinerary($scope.view.travel.travelApplication)
                        .then(function () {
                            TravelERVService.checkBudgetTravel($scope.view.travel)
                                .success(function (res) {
                                    $ionicLoading.hide();
                                    //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                    if(res){
                                        TravelERVService.setTab('submit');
                                        TravelERVService.submitTravel($scope.view.travel)
                                            .success(function (data) {
                                                PublicFunction.showToast($filter('translate')('create.next_js.Submitted.successfully'));//提交成功
                                                $timeout(function () {
                                                    //if ($scope.view.content === 'next') {
                                                    //    $ionicHistory.goBack(-2);
                                                    //} else {
                                                    ApprovalPopupService.setCount();
                                                    $scope.view.goBack();
                                                    //}
                                                }, 500);
                                            })
                                    }else{
                                        $scope.view.checkBudget($filter('translate')('ordinary.js.Hint'),$filter('translate')('ordinary.js.excessBudget')).then(function (data) {//提示---该申请单超预算,是否继续提交?
                                            TravelERVService.setTab('submit');
                                            TravelERVService.submitTravel($scope.view.travel)
                                                .success(function (data) {
                                                    PublicFunction.showToast($filter('translate')('create.next_js.Submitted.successfully'));//提交成功
                                                    $timeout(function () {
                                                        //if ($scope.view.content === 'next') {
                                                        //    $ionicHistory.goBack(-2);
                                                        //} else {
                                                        ApprovalPopupService.setCount();
                                                        $scope.view.goBack();
                                                        //}
                                                    }, 500);
                                                })
                                                .error(function (error) {
                                                    $ionicLoading.hide();
                                                    if(error.message){
                                                        PublicFunction.showToast(error.message);
                                                    } else {
                                                        PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                                    }
                                                });
                                        })
                                    }
                                },function (error) {
                                    $ionicLoading.hide();
                                })
                        })
                },
                //生成报销单
                exportExpense: function () {
                    $state.go('app.tab_erv_create_relative_expense_first',
                        {applicationOID: $stateParams.applicationOID});
                    //$ionicLoading.show({
                    //    template: '<img style="height: 3em" ng-src="img/loading.gif">',
                    //    noBackdrop: true
                    //});
                    //var data = {};
                    //data.type = 1002;
                    //data.departmentOID = $scope.view.travel.travelApplication.departmentOID;
                    //data.costCenterItemOID = $scope.view.travel.travelApplication.costCenterItemOID;
                    ////data.approverOIDs = $scope.view.travel.travelApplication.approverOIDs;
                    //data.remark = $scope.view.travel.remark;
                    //data.currencyCode = $scope.view.travel.travelApplication.currencyCode;
                    //data.expenseReportInvoices = [];
                    //data.applicationOID = $stateParams.applicationOID;
                    //TravelERVService.exportExpense(data)
                    //    .success(function (data) {
                    //        $ionicLoading.hide();
                    //        $state.go('app.erv_travel_export_success', {
                    //            applicationOID: $stateParams.applicationOID,
                    //            expense: data
                    //        });
                    //    });
                },
                goBack: function () {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $ionicHistory.goBack(-2);
                    }
                },
                //删除行程
                removeRoute: function (item, index) {
                    if (!$scope.view.readOnly) {
                        var nzhcn = Nzh.cn;
                        var num = parseInt(nzhcn.decodeS(item)) - 1;
                        $scope.view.travel.travelApplication.travelItinerarys[num].travelItineraryTraffics.splice(index, 1);
                    }
                },
                editBase: function () {
                    $scope.view.isHandEdit = true;
                    TravelERVService.travelDraft($scope.view.travel)
                        .success(function (data) {
                            $state.go('app.erv_edit_travel_base', {applicationOID: data.applicationOID});
                        })
                        .error(function (error) {
                            if(error.message){
                                PublicFunction.showToast(error.message);
                            } else {
                                PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                            }
                        });
                },
                getDiffDay: function (startDate, endDate) {
                    var start = [], end = [];
                    var oDate1, oDate2;
                    start = startDate.split("-");
                    oDate1 = new Date(start[1] + '-' + start[2] + '-' + start[0]);  //转换为12-18-2002格式
                    end = endDate.split("-");
                    oDate2 = new Date(end[1] + '-' + end[2] + '-' + end[0]);
                    return (parseInt(Math.abs(oDate2 - oDate1) / 1000 / 60 / 60 / 24)); //把相差的毫秒数转换为天数
                },
                expandTravelMember: function () {
                    $scope.view.showTravelMember = !$scope.view.showTravelMember;
                },
                showTrafficSelect: function () {

                },
                //安排哪一天的行程
                selectDay: function (index) {
                    $scope.view.currentDay = index;
                },
                //买飞机票
                orderPlaneTicket: function () {
                    var pageType = 1002;
                    TravelERVService.getSupplierURL($scope.view.travel.travelApplication.supplierOID, pageType, $scope.view.travel.travelApplication.businessCode);
                    //} else {
                    //    if ($scope.view.hasCtrip) {
                    //        CtripService.goTravelBefore('FlightSearch');
                    //    } else {
                    //        PublicFunction.showToast('尚未开通该服务');                        }
                    //}
                },
                orderTrainTicket: function () {
                    if ($scope.view.hasTongCheng) {
                        TravelERVService.getTongChengOrderUrl()
                            .success(function (data) {
                                var ref = cordova.InAppBrowser.open(data.url, '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' + $filter('translate')('back.to.HuiLianYi'));
                                ref.addEventListener('loadstart', inAppBrowserLoadStart);
                                ref.addEventListener('exit', inAppBrowserClose);
                            })
                            .error(function (error) {
                                if(error.message){
                                    PublicFunction.showToast(error.message);
                                } else {
                                    PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                }
                            })
                    } else {
                        PublicFunction.showToast($filter('translate')('error.service.no.open'));//尚未开通该服务
                    }
                },
                orderHotelTicket: function () {
                    if ($scope.view.hasCtrip) {
                        CtripService.goTravelBefore('HotelSearch');
                    } else {
                        PublicFunction.showToast($filter('translate')('error.service.no.open'));//尚未开通该服务
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
                                text: $filter('translate')('ordinary.js.return'),//返回
                                type: 'cancel-button',
                                onTap: function (e) {
                                    deferred.reject(false);
                                }
                            },
                            {
                                text: $filter('translate')('create.next.submit'),//提交
                                type: 'sure-button',
                                onTap: function(e) {
                                    deferred.resolve(true);
                                }
                            }]
                    });
                    return deferred.promise;
                }
            };

            //选择交通方式
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/travel/create/traffic.select.tpl.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.selectTrafficType = modal;
            });
            $scope.selectTraffic = {
                showTraffic: function () {
                    $scope.view.route.trafficType = null;
                    $scope.selectTrafficType.show();
                },
                closeTraffic: function (string) {
                    $scope.view.route.trafficType = string;
                    $scope.selectTrafficType.hide();
                    $scope.arrangement.showArrange();
                }
            };

            //安排行程
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/travel/create/arrange.jourey.tpl.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.arrangeJourey = modal;
            });
            $scope.arrangement = {
                showArrange: function () {
                    $scope.view.currentDay = -1;
                    $scope.view.route.toCity = null;
                    $scope.view.route.fromCity = null;
                    // $scope.view.route.fromCity = LocationService.getCity();
                    $scope.arrangeJourey.show();
                },
                closeArrange: function () {
                    if ($scope.view.currentDay === -1) {
                        PublicFunction.showToast($filter('translate')('create.next_js.Please.select.a.date'));//请选择行程日期
                    } else if ($scope.view.route.fromCity === '' || $scope.view.route.fromCity === null || $scope.view.route.toCity === '' || $scope.view.route.toCity === null || $scope.view.route.fromCity === $scope.view.route.toCity) {
                        PublicFunction.showToast($filter('translate')('create.next_js.Please.arrange.the.itinerary'));//请合理安排行程
                    } else {
                        var route = {};
                        route.fromCity = $scope.view.route.fromCity;
                        route.toCity = $scope.view.route.toCity;
                        route.trafficType = $scope.view.route.trafficType;
                        $scope.view.travel.travelApplication.travelItinerarys[$scope.view.currentDay].travelItineraryTraffics.push(route);
                        $scope.arrangeJourey.hide();
                    }

                }
            };

            $scope.init = function () {
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                var nzhcn = Nzh.cn;
                TravelERVService.getSuppliers()
                    .success(function (data) {
                        $scope.view.SupplierList = data;
                        if ($scope.view.content === 'next' || $scope.view.content === 'edit') {
                            TravelERVService.getTravelDetail($stateParams.applicationOID)
                                .success(function (data) {
                                    $scope.view.travel = data;
                                    if ($scope.view.travel.travelApplication.externalParticipantNumber > 0) {
                                        $scope.view.enternalNumName = $filter('translate')('create.next_js.A.total.of') + $scope.view.travel.travelApplication.externalParticipantNumber + $filter('translate')('create.next_js.people');//共  人
                                    }
                                    $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.travel.travelApplication.currencyCode);
                                    if ($scope.view.travel.travelApplication.startDate) {
                                        $scope.view.travel.travelApplication.startDate = new Date($scope.view.travel.travelApplication.startDate).Format('yyyy-MM-dd');
                                    }
                                    if ($scope.view.travel.travelApplication.endDate) {
                                        $scope.view.travel.travelApplication.endDate = new Date($scope.view.travel.travelApplication.endDate).Format('yyyy-MM-dd');
                                    }
                                    if ($scope.view.travel.travelApplication.supplierOID && $scope.view.SupplierList) {
                                        for (var i = 0; i < $scope.view.SupplierList.length; i++) {
                                            if ($scope.view.travel.travelApplication.supplierOID === $scope.view.SupplierList[i].supplierOID) {
                                                $scope.view.selectedSupplier = $scope.view.SupplierList[i];
                                                break;
                                            }
                                        }
                                    }
                                    for (var i = 0; i < $scope.view.travel.travelApplication.travelItinerarys.length; i++) {
                                        $scope.view.travel.travelApplication.travelItinerarys[i].isExpand = true;
                                        //差旅申请中日程的天数中文情况下显示'一二三...',其他语言显示'123...'
                                        if ($sessionStorage.lang === 'zh_cn') {
                                            $scope.view.travel.travelApplication.travelItinerarys[i].dayNumber = nzhcn.encodeS(i + 1);
                                        } else {
                                            $scope.view.travel.travelApplication.travelItinerarys[i].dayNumber = i + 1;
                                        }
                                        $scope.view.travel.travelApplication.travelItinerarys[i].week = new Date($scope.view.travel.travelApplication.travelItinerarys[i].itineraryDate).getDay();
                                    }
                                })
                                .error(function (data) {
                                    if (data.errorCode === 'OBJECT_NOT_FOUND') {
                                        $scope.view.isNotFound = true;
                                    }
                                })
                                .finally(function () {
                                    $ionicLoading.hide();
                                });
                            $scope.view.route.fromCity = LocationService.getCity();
                            $scope.view.title = $filter('translate')('list.Travel.application');//差旅申请
                            $scope.view.readOnly = false;
                        } else if ($scope.view.content === 'hasPass' || $scope.view.content === 'order') {
                            $scope.view.title = $filter('translate')('list.Travel.application');//差旅申请
                            $scope.view.readOnly = true;
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
                            });
                            TravelERVService.getTravelDetail($stateParams.applicationOID)
                                .success(function (data) {
                                    $scope.view.travel = data;
                                    if ($scope.view.travel.travelApplication.externalParticipantNumber > 0) {
                                        $scope.view.enternalNumName = $filter('translate')('create.next_js.A.total.of') + $scope.view.travel.travelApplication.externalParticipantNumber + $filter('translate')('create.next_js.people');//共  人
                                    }
                                    $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.travel.travelApplication.currencyCode);
                                    if ($scope.view.travel.travelApplication.startDate) {
                                        $scope.view.travel.travelApplication.startDate = new Date($scope.view.travel.travelApplication.startDate).Format('yyyy-MM-dd');
                                    }
                                    if ($scope.view.travel.travelApplication.endDate) {
                                        $scope.view.travel.travelApplication.endDate = new Date($scope.view.travel.travelApplication.endDate).Format('yyyy-MM-dd');
                                    }
                                    if ($scope.view.travel.travelApplication.supplierOID && $scope.view.SupplierList) {
                                        for (var i = 0; i < $scope.view.SupplierList.length; i++) {
                                            if ($scope.view.travel.travelApplication.supplierOID === $scope.view.SupplierList[i].supplierOID) {
                                                $scope.view.selectedSupplier = $scope.view.SupplierList[i];
                                                break;
                                            }
                                        }
                                    }
                                    for (var i = 0; i < $scope.view.travel.travelApplication.travelItinerarys.length; i++) {
                                        $scope.view.travel.travelApplication.travelItinerarys[i].isExpand = true;
                                        //差旅申请中日程的天数中文情况下显示'一二三...',其他语言显示'123...'
                                        if ($sessionStorage.lang === 'zh_cn') {
                                            $scope.view.travel.travelApplication.travelItinerarys[i].dayNumber = nzhcn.encodeS(i + 1);
                                        } else {
                                            $scope.view.travel.travelApplication.travelItinerarys[i].dayNumber = i + 1;
                                        }
                                        $scope.view.travel.travelApplication.travelItinerarys[i].week = new Date($scope.view.travel.travelApplication.travelItinerarys[i].itineraryDate).getDay();
                                    }
                                    var today = new Date().getTime() / 1000;
                                    var endDay = new Date(new Date($scope.view.travel.travelApplication.endDate).Format('yyyy/MM/dd') + ' 23:59:59').getTime() / 1000;
                                    if (today > endDay) {
                                        $scope.view.disabledHotel = true;
                                        $scope.view.disabledPlane = true;
                                        $scope.view.disabledTrain = true;
                                    } else {
                                        for (var i = 0; i < $scope.view.travel.travelApplication.travelItinerarys.length; i++) {
                                            for (var j = 0; j < $scope.view.travel.travelApplication.travelItinerarys[i].travelItineraryTraffics.length; j++) {
                                                if ($scope.view.travel.travelApplication.travelItinerarys[i].travelItineraryTraffics[j].trafficType === 1001) {
                                                    $scope.view.disabledPlane = false;
                                                } else if ($scope.view.travel.travelApplication.travelItinerarys[i].travelItineraryTraffics[j].trafficType === 1002) {
                                                    $scope.view.disabledTrain = false;
                                                }
                                            }
                                        }
                                    }
                                })
                                .error(function (data) {
                                    if (data.errorCode === 'OBJECT_NOT_FOUND') {
                                        $scope.view.isNotFound = true;
                                    }
                                })
                                .finally(function () {
                                    $ionicLoading.hide();
                                });
                        } else if ($scope.view.content === 'approval' || $scope.view.content === 'detail' || $scope.view.content === 'waitApproval' || $scope.view.content === 'hasReject') {
                            $scope.view.readOnly = true;
                            $scope.view.title = $filter('translate')('list.Travel.application');//差旅申请
                            TravelERVService.getTravelDetail($stateParams.applicationOID)
                                .success(function (data) {
                                    $scope.view.travel = data;
                                    if ($scope.view.travel.travelApplication.externalParticipantNumber > 0) {
                                        $scope.view.enternalNumName = $filter('translate')('create.next_js.A.total.of') + $scope.view.travel.travelApplication.externalParticipantNumber + $filter('translate')('create.next_js.people');//共  人
                                    }
                                    $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.travel.travelApplication.currencyCode);
                                    if ($scope.view.travel.travelApplication.startDate) {
                                        $scope.view.travel.travelApplication.startDate = new Date($scope.view.travel.travelApplication.startDate).Format('yyyy-MM-dd');
                                    }
                                    if ($scope.view.travel.travelApplication.endDate) {
                                        $scope.view.travel.travelApplication.endDate = new Date($scope.view.travel.travelApplication.endDate).Format('yyyy-MM-dd');
                                    }
                                    if ($scope.view.travel.travelApplication.supplierOID && $scope.view.SupplierList) {
                                        for (var i = 0; i < $scope.view.SupplierList.length; i++) {
                                            if ($scope.view.travel.travelApplication.supplierOID === $scope.view.SupplierList[i].supplierOID) {
                                                $scope.view.selectedSupplier = $scope.view.SupplierList[i];
                                                break;
                                            }
                                        }
                                    }
                                    for (var i = 0; i < $scope.view.travel.travelApplication.travelItinerarys.length; i++) {
                                        $scope.view.travel.travelApplication.travelItinerarys[i].isExpand = true;
                                        //差旅申请中日程的天数中文情况下显示'一二三...',其他语言显示'123...'
                                        if ($sessionStorage.lang === 'zh_cn') {
                                            $scope.view.travel.travelApplication.travelItinerarys[i].dayNumber = nzhcn.encodeS(i + 1);
                                        } else {
                                            $scope.view.travel.travelApplication.travelItinerarys[i].dayNumber = i + 1;
                                        }
                                        $scope.view.travel.travelApplication.travelItinerarys[i].week = new Date($scope.view.travel.travelApplication.travelItinerarys[i].itineraryDate).getDay();
                                    }
                                })
                                .error(function (data) {
                                    if (data.errorCode === 'OBJECT_NOT_FOUND') {
                                        $scope.view.isNotFound = true;
                                    }
                                })
                                .finally(function () {
                                    $ionicLoading.hide();
                                });
                        }
                    })
            };
            $scope.init();

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function (data) {
                    $scope.view.functionProfileList = data;
                });
            });
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if ((toState.name === 'app.erv_create_travel_base' || toState.name === 'app.erv_edit_travel_base') || toState.name == 'app.erv_init_travel_base') {
                    if (!$scope.view.isHandEdit) {
                        $state.go('app.erv_travel_list')
                    }
                }
            });

        }]);
