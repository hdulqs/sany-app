/**
 * Created by Yuko on 16/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.erv_create_travel_base', {
                url: '/erv/create/travel/base',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.base.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelBaseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'create';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.erv_edit_travel_base', {
                url: '/erv/edit/travel/base?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.base.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelBaseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'edit';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.erv_init_travel_base', {
                url: '/erv/init/travel/base?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/create/create.travel.base.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvCreateTravelBaseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'init';
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
    .controller('com.handchina.huilianyi.ErvCreateTravelBaseController', ['$scope', '$state', '$cordovaDatePicker', 'LocationService', 'TravelERVService', '$ionicLoading', '$q', 'content', 'Principal', '$ionicHistory', '$stateParams',
        'CompanyConfigurationService', 'CurrencyCodeService', 'CostCenterService', 'PublicFunction', 'FUNCTION_PROFILE', 'FunctionProfileService', 'ManagerPrompt', 'DepartmentService', 'localStorageService', 'LANG','$filter',
        function ($scope, $state, $cordovaDatePicker, LocationService, TravelERVService, $ionicLoading, $q, content, Principal, $ionicHistory, $stateParams, CompanyConfigurationService, CurrencyCodeService, CostCenterService, PublicFunction, FUNCTION_PROFILE, FunctionProfileService, ManagerPrompt, DepartmentService, localStorageService, LANG,$filter) {
            $scope.view = {
                participantHolder: '搜索姓名或者工号',
                SupplierList: null,
                selectedSupplier: null,
                showExternalParticipant: false,
                showSupplierList: false,
                orderTitle: $filter('translate')('create.base_js.Booking.commissioner'),//订票专员
                approvalTitle: $filter('translate')('create.base.The.approver'),//审批人
                orderMaxLength: 1,
                costName: null,
                titleList: [
                    {name: $filter('translate')('list.The.new.travel.application')},//新建差旅申请
                    {name: $filter('translate')('create.base_js.Travel.details')}//差旅详情
                ],
                outerMemberList: [],
                supplierName: null,
                oldStartDate: null,
                oldEndDate: null,
                code: null,
                approvalSelectedName: '',
                approver: [],
                departmentInfo: null,
                content: content,
                titleIndex: 0,
                readonly: false,
                showCostcenter: null,
                showDepartment: null,
                isShowApproval: false,
                approvalMaxLength: null,
                approval: {},
                //判断是否只选择叶子节点的function profile key
                leafDepSelectorRequired: FUNCTION_PROFILE['leafDepSelectorRequired'],
                travel: {
                    applicationOID: null,
                    remark: null,
                    title: null,//事由
                    applicationParticipants: [],
                    travelApplication: {
                        externalParticipants: [],
                        externalParticipantNumber: null,
                        approverOIDs: '',
                        averageBudget: null,
                        borrowAmount: null,
                        borrowFlag: false,
                        currencyCode: null,
                        supplierOID: null,
                        endDate: new Date().Format('yyyy-MM-dd'),
                        startDate: new Date().Format('yyyy-MM-dd'),
                        totalBudget: 0,
                        costCenterItemOID: null,
                        costCenterItemName: null,
                        departmentOID: null,
                        departmentName: null,
                        travelItineraryTraffics: [
                            {
                                itineraryDate: null, //行程日期
                                travelItineraryTraffics: [{
                                    createdDate: null,
                                    fromCity: null,
                                    toCity: null,
                                    trafficType: null
                                }]
                            }

                        ]
                    }
                },
                //选择时间
                selectDate: function (string) {
                    var dateOptions = {
                        date: new Date($scope.view.travel.travelApplication.startDate),
                        mode: 'date',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('create.arrange.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('create.arrange.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: LANG
                    };
                    if (!$scope.view.isReadOnly) {
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            if (date) {
                                if (string === 'startDate') {
                                    $scope.view.travel.travelApplication.startDate = date;
                                    if (((Date.parse($scope.view.travel.travelApplication.endDate) - Date.parse($scope.view.travel.travelApplication.startDate)) / 3600 / 1000) < 0) {
                                        $scope.view.travel.travelApplication.endDate = $scope.view.travel.travelApplication.startDate;
                                    }
                                } else if (string === 'endDate') {
                                    if (((Date.parse(date) - Date.parse($scope.view.travel.travelApplication.startDate)) / 3600 / 1000) < 0) {
                                        PublicFunction.showToast($filter('translate')('create.base_js.End.date.cannot.be.earlier.than.start.date'));//结束日期不能早于开始日期
                                    } else {
                                        $scope.view.travel.travelApplication.endDate = date;
                                    }
                                }
                            }
                        });
                    }
                },
                goBack: function () {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.erv_travel_list');
                    }
                },
                goTo: function (state) {
                    $state.go(state);
                },
                saveTravel: function () {
                    if ($scope.view.travel.title !== null && $scope.view.travel.title !== '' && $scope.view.travel.title.length <= 50) {
                        TravelERVService.setTab('init');
                        $scope.showLoading();
                        //在MainAppController中，已经定义了该函数，可以重用
                        if ($scope.view.oldStartDate !== $scope.view.travel.travelApplication.startDate || $scope.view.oldEndDate !== $scope.view.travel.travelApplication.endDate) {
                            $scope.view.travel.travelApplication.travelItinerarys = [];
                            var dateLength = $scope.view.getDiffDay($scope.view.travel.travelApplication.startDate, $scope.view.travel.travelApplication.endDate);
                            var num = 0;
                            for (; num <= dateLength; num++) {
                                var journey = {};
                                journey.itineraryDate = new Date($scope.view.travel.travelApplication.startDate);
                                journey.itineraryDate.setDate(journey.itineraryDate.getDate() + num);
                                journey.travelItineraryTraffics = [];
                                $scope.view.travel.travelApplication.travelItinerarys.push(journey);
                            }
                            if (num === (dateLength + 1)) {
                                if ($scope.view.selectedSupplier && $scope.view.selectedSupplier.supplierOID) {
                                    $scope.view.travel.travelApplication.supplierOID = $scope.view.selectedSupplier.supplierOID;
                                    TravelERVService.travelDraft($scope.view.travel)
                                        .success(function () {
                                            $ionicLoading.hide();
                                            $scope.view.goBack();
                                        })
                                        .error(function (data) {
                                            $ionicLoading.hide();
                                            if(data.message){
                                                PublicFunction.showToast(data.message);
                                            } else {
                                                PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                            }
                                        });
                                } else {
                                    TravelERVService.travelDraft($scope.view.travel)
                                        .success(function () {
                                            $ionicLoading.hide();
                                            $scope.view.goBack();
                                        })
                                        .error(function (data) {
                                            $ionicLoading.hide();
                                            if(data.message){
                                                PublicFunction.showToast(data.message);
                                            } else {
                                                PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                            }
                                        });
                                }

                            }
                        } else {
                            if ($scope.view.selectedSupplier && $scope.view.selectedSupplier.supplierOID) {
                                $scope.view.travel.travelApplication.supplierOID = $scope.view.selectedSupplier.supplierOID;
                                TravelERVService.travelDraft($scope.view.travel)
                                    .success(function () {
                                        $scope.view.goBack();
                                    })
                                    .error(function (data) {
                                        if(data.message){
                                            PublicFunction.showToast(data.message);
                                        } else {
                                            PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                        }
                                    })
                                    .finally(function (){
                                        $ionicLoading.hide();
                                    });
                            } else {
                                TravelERVService.travelDraft($scope.view.travel)
                                    .success(function () {
                                        $ionicLoading.hide();
                                        $scope.view.goBack();
                                    })
                                    .error(function (data) {
                                        $ionicLoading.hide();
                                        if(data.message){
                                            PublicFunction.showToast(data.message);
                                        } else {
                                            PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                        }
                                    });
                            }
                        }
                        if ($scope.view.travel.travelApplication.costCenterItemOID) {
                            CostCenterService.logLastCostCenterItem($scope.view.travel.travelApplication.costCenterItemOID);
                        }
                    } else {
                        if ($scope.view.travel.title !== null && $scope.view.travel.title !== '' && $scope.view.travel.title.length > 50) {
                            PublicFunction.showToast($filter('translate')('create.base_js.Reason.please.enter.less.than.50.characters'));//事由请输入少于50个汉字
                        } else {
                            PublicFunction.showToast($filter('translate')('create.base_js.Please.enter.the.reason'));//请输入事由
                        }
                    }
                },
                validateData: function () {
                    if($scope.view.travel.travelApplication.externalParticipantNumber === parseInt($scope.view.travel.travelApplication.externalParticipantNumber)){
                        $scope.view.travel.travelApplication.totalBudget = $scope.view.travel.travelApplication.averageBudget * ($scope.view.travel.applicationParticipants.length + $scope.view.travel.travelApplication.externalParticipantNumber);
                    }
                    var deferred = $q.defer();
                    if ($scope.view.travel.title === '' || $scope.view.travel.title === null) {
                        PublicFunction.showToast($filter('translate')('create.base_js.Please.enter.the.reason'));//请输入事由
                        deferred.reject(false);
                    } else if (!$scope.view.travel.travelApplication.startDate) {
                        PublicFunction.showToast($filter('translate')('create.base_js.Please.select.a.departure.date'));//请选择出发日期
                        deferred.reject(false);
                    } else if (!$scope.view.travel.travelApplication.endDate) {
                        PublicFunction.showToast($filter('translate')('create.base_js.Please.select.a.return.date'));//请选择回程日期
                        deferred.reject(false);
                    } else if ($scope.view.travel.title.length > 50) {
                        PublicFunction.showToast($filter('translate')('create.base_js.Reason.please.enter.up.to.50.characters'));//事由请输入最多50个汉字
                        deferred.reject(false);
                    } else if (!$scope.view.travel.travelApplication.departmentName && ((!$scope.view.functionProfileList && $scope.view.showDepartment) || !$scope.view.functionProfileList['ta.department.selection.disabled'])) {
                        PublicFunction.showToast($filter('translate')('create.base_js.Please.select.a.department'));//请选择部门
                        deferred.reject(false);
                    } else if (!$scope.view.travel.travelApplication.costCenterItemOID && ((!$scope.view.functionProfileList && $scope.view.showCostcenter) || !$scope.view.functionProfileList['ta.costCenter.selection.disabled'])) {
                        $scope.view.hasCostCenter?PublicFunction.showToast($filter('translate')('create.base_js.Please.select.a') + $scope.view.costName):PublicFunction.showToast("$filter('translate')('create.base_js.Cost.center.is.not.configured.please.contact.your.administrator')");//请选择   成本中心未配置，请联系管理员
                        deferred.reject(false);
                    } else if ($scope.view.isShowApproval && ($scope.view.travel.travelApplication.approverOIDs === '' || $scope.view.travel.travelApplication.approverOIDs === null )) {
                        PublicFunction.showToast($filter('translate')('create.base_js.Please.select.the.approver'));//请选择审批人
                        deferred.reject(false);
                    } else if (((!$scope.view.functionProfileList && $scope.view.showExternalParticipant) || $scope.view.functionProfileList['ta.allow.external.guest']) && $scope.view.travel.travelApplication.externalParticipantNumber !== '' && $scope.view.travel.travelApplication.externalParticipantNumber !== null && ($scope.view.travel.travelApplication.externalParticipantNumber !== parseInt($scope.view.travel.travelApplication.externalParticipantNumber))){
                        PublicFunction.showToast($filter('translate')('create.base_js.Please.enter.the.legal.external.participation'));//请输入合法的外部参与人数
                        deferred.reject(false);
                    } else if (!$scope.view.travel.travelApplication.averageBudget) {
                        PublicFunction.showToast($filter('translate')('create.base_js.Please.enter.the.budget.per.person'));//请输入人均预算
                        deferred.reject(false);
                    } else if ($scope.view.travel.travelApplication.averageBudget < 0) {
                        PublicFunction.showToast($filter('translate')('create.base_js.Please.enter.a.reasonable.budget.per.person'));//请输入合理的人均预算
                        deferred.reject(false);
                    } else if ($scope.view.travel.travelApplication.borrowFlag && ($scope.view.travel.travelApplication.borrowAmount > $scope.view.travel.travelApplication.totalBudget)) {
                        PublicFunction.showToast($filter('translate')('create.base_js.To.apply.for.a.loan.amount.must.not.exceed.the.total.amount'));//申请贷款金额不能超过总金额
                        deferred.reject(false);
                    } else if (!$scope.view.selectedSupplier && ((!$scope.view.functionProfileList && $scope.view.showSupplierList) || !$scope.view.functionProfileList['ta.vendor.disabled'])) {
                        PublicFunction.showToast($filter('translate')('create.base_js.Please.select.a.supplier'));//请选择供应商
                        deferred.reject(false);
                    } else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                },
                saveDataNextOperation: function(string){
                    if ($scope.view.oldStartDate !== $scope.view.travel.travelApplication.startDate || $scope.view.oldEndDate !== $scope.view.travel.travelApplication.endDate) {
                        $scope.view.travel.travelApplication.travelItinerarys = [];
                        var dateLength = $scope.view.getDiffDay($scope.view.travel.travelApplication.startDate, $scope.view.travel.travelApplication.endDate);
                        var num = 0;
                        for (; num <= dateLength; num++) {
                            var journey = {};
                            journey.itineraryDate = new Date($scope.view.travel.travelApplication.startDate);
                            journey.itineraryDate.setDate(journey.itineraryDate.getDate() + num);
                            journey.travelItineraryTraffics = [];
                            $scope.view.travel.travelApplication.travelItinerarys.push(journey);
                        }
                        if (num >= (dateLength + 1)) {
                            if ($scope.view.selectedSupplier && $scope.view.selectedSupplier.supplierOID) {
                                $scope.view.travel.travelApplication.supplierOID = $scope.view.selectedSupplier.supplierOID;
                                TravelERVService.travelDraft($scope.view.travel)
                                    .success(function (data) {
                                        if (string === 'save') {
                                            $ionicHistory.goBack();
                                        } else {
                                            $state.go('app.erv_create_travel_next', {applicationOID: data.applicationOID});
                                        }
                                    })
                                    error(function(data){
                                        if(data.message){
                                            PublicFunction.showToast(data.message);
                                        } else {
                                            PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                        }
                                    })
                                    .finally(function (){
                                        $ionicLoading.hide();
                                    });
                            } else {
                                TravelERVService.travelDraft($scope.view.travel)
                                    .success(function (data) {
                                        $ionicLoading.hide();
                                        if (string === 'save') {
                                            $ionicHistory.goBack();
                                        } else {
                                            $state.go('app.erv_create_travel_next', {applicationOID: data.applicationOID});
                                        }
                                    })
                                    .error(function (data) {
                                        if(data.message){
                                            PublicFunction.showToast(data.message);
                                        } else {
                                            PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                        }
                                        $ionicLoading.hide();
                                    });
                            }

                        }
                    } else {
                        if ($scope.view.selectedSupplier && $scope.view.selectedSupplier.supplierOID) {
                            $scope.view.travel.travelApplication.supplierOID = $scope.view.selectedSupplier.supplierOID;
                            TravelERVService.travelDraft($scope.view.travel)
                                .success(function (data) {
                                    if (string === 'save') {
                                        $ionicHistory.goBack();
                                    } else {
                                        $state.go('app.erv_create_travel_next', {applicationOID: data.applicationOID});
                                    }
                                })
                                .error(function(data){
                                    if(data.message){
                                        PublicFunction.showToast(data.message);
                                    } else {
                                        PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                    }
                                })
                                .finally(function (){
                                    $ionicLoading.hide();
                                });
                        } else {
                            TravelERVService.travelDraft($scope.view.travel)
                                .success(function (data) {
                                    $ionicLoading.hide();
                                    if (string === 'save') {
                                        $ionicHistory.goBack();
                                    } else {
                                        $state.go('app.erv_create_travel_next', {applicationOID: data.applicationOID});
                                    }
                                })
                                .error(function(data){
                                    if(data.message){
                                        PublicFunction.showToast(data.message);
                                    } else {
                                        PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                    }
                                })
                        }

                    }
                    if ($scope.view.travel.travelApplication.costCenterItemOID) {
                        CostCenterService.logLastCostCenterItem($scope.view.travel.travelApplication.costCenterItemOID);
                    }
                },
                nextOperation: function (string) {
                    //if(string === 'save'){
                    //    $ionicHistory.nextViewOptions({
                    //        disableBack: true
                    //    });
                    //}
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    $scope.view.validateData().then(function () {
                        // 如果表单有部门并且公司配置为部门经理审批并且所选择部门没有部门经理,提示错误信息
                        if($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode===1002 && ((!$scope.view.functionProfileList && $scope.view.showDepartment) || !$scope.view.functionProfileList['ta.department.selection.disabled'])){
                            DepartmentService.getDepartmentInfo($scope.view.travel.travelApplication.departmentOID).then(function(response){
                                if(!response.data.managerOID){
                                    PublicFunction.showToast(ManagerPrompt);
                                } else {
                                    $scope.view.saveDataNextOperation(string);
                                }
                            })
                        } else {
                            $scope.view.saveDataNextOperation(string);
                        }
                    });
                },
                //获取两天之间的天数
                getDiffDay: function (startDate, endDate) {
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
            };

            $scope.$watch('view.travel.travelApplication.averageBudget', function (newValue, oldValue) {
                if (newValue !== oldValue && newValue !== '' && newValue !== null) {
                    $scope.view.travel.travelApplication.totalBudget = $scope.view.travel.travelApplication.averageBudget * ($scope.view.travel.applicationParticipants.length + $scope.view.travel.travelApplication.externalParticipantNumber);
                }
            });
            $scope.$watch('view.travel.applicationParticipants.length', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.view.travel.travelApplication.totalBudget = $scope.view.travel.travelApplication.averageBudget * ($scope.view.travel.applicationParticipants.length + $scope.view.travel.travelApplication.externalParticipantNumber);
                }
            });
            $scope.$watch('view.travel.travelApplication.externalParticipantNumber', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if(newValue === parseInt(newValue)){
                        $scope.view.travel.travelApplication.totalBudget = $scope.view.travel.travelApplication.averageBudget * ($scope.view.travel.applicationParticipants.length + $scope.view.travel.travelApplication.externalParticipantNumber);
                    } else{
                        $scope.view.travel.travelApplication.totalBudget = $scope.view.travel.travelApplication.averageBudget * ($scope.view.travel.applicationParticipants.length);
                    }
                }
            });

            var init = function () {
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                TravelERVService.getSuppliers()
                    .success(function (data) {
                        $scope.view.SupplierList = data;
                        if ($scope.view.content === 'edit') {
                            $scope.view.titleIndex = 1;
                            TravelERVService.getTravelDetail($stateParams.applicationOID)
                                .success(function (data) {
                                    $scope.view.travel = data;
                                    $scope.view.travel.travelApplication.startDate = new Date($scope.view.travel.travelApplication.startDate).Format('yyyy-MM-dd');
                                    $scope.view.oldStartDate = $scope.view.travel.travelApplication.startDate;
                                    $scope.view.travel.travelApplication.endDate = new Date($scope.view.travel.travelApplication.endDate).Format('yyyy-MM-dd');
                                    $scope.view.oldEndDate = $scope.view.travel.travelApplication.endDate;
                                    if ($scope.view.travel.travelApplication.supplierOID && $scope.view.SupplierList) {
                                        for (var i = 0; i < $scope.view.SupplierList.length; i++) {
                                            if ($scope.view.travel.travelApplication.supplierOID === $scope.view.SupplierList[i].supplierOID) {
                                                $scope.view.selectedSupplier = $scope.view.SupplierList[i];
                                                break;
                                            }
                                        }
                                    }
                                    var uerOID = [];
                                    if ($scope.view.travel.travelApplication.approverOIDs !== null && $scope.view.travel.travelApplication.approverOIDs !== '') {
                                        uerOID = $scope.view.travel.travelApplication.approverOIDs.split(":");
                                        $scope.view.approvalSelectedName = '';
                                        if (uerOID.length > 0) {
                                            $scope.memberList = [uerOID.length];
                                            TravelERVService.getBatchUsers(uerOID)
                                                .success(function (data) {
                                                    var num = 0;
                                                    for (; num < data.length; num++) {
                                                        for (var j = 0; j < uerOID.length; j++) {
                                                            if (uerOID[j] === data[num].userOID) {
                                                                $scope.memberList[j] = data[num];
                                                            }
                                                        }
                                                    }
                                                    //$scope.memberList = data;
                                                    if (num === data.length) {
                                                        for (var i = 0; i < $scope.memberList.length; i++) {
                                                            if (i !== ($scope.memberList.length - 1)) {
                                                                $scope.view.approvalSelectedName += $scope.memberList[i].fullName + ','
                                                            } else {
                                                                $scope.view.approvalSelectedName += $scope.memberList[i].fullName;
                                                            }
                                                        }
                                                    }

                                                })
                                        } else {
                                            $scope.memberList = [];
                                            $scope.view.approvalSelectedName = '';
                                        }

                                    } else {
                                        $scope.view.approvalSelectedName = '';
                                    }
                                })
                                .error(function(data){
                                    if(data.message){
                                        PublicFunction.showToast(data.message);
                                    } else {
                                        PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                    }
                                })
                                .finally(function (){
                                    $ionicLoading.hide();
                                });
                            $scope.view.readonly = false;
                        } else if ($scope.view.content === 'create') {
                            $scope.view.titleIndex = 0;
                            //LocationService.getCurrentLocation();
                            Principal.identity().then(function (data) {
                                $ionicLoading.hide();
                                $scope.view.travel.travelApplication.departmentName = data.departmentName;
                                $scope.view.travel.travelApplication.departmentOID = data.departmentOID;
                                var item = {};
                                item.avatar = data.filePath;
                                item.fullName = data.fullName;
                                item.participantOID = data.userOID;
                                item.userOID = data.userOID;
                                $scope.view.travel.applicationParticipants.push(item);
                            },function (error) {
                                $ionicLoading.hide();
                            });

                        } else if ($scope.view.content === 'init') {
                            $scope.view.titleIndex = 1;
                            TravelERVService.getTravelDetail($stateParams.applicationOID)
                                .success(function (data) {
                                    $scope.view.travel = data;
                                    $scope.view.travel.travelApplication.startDate = new Date($scope.view.travel.travelApplication.startDate).Format('yyyy-MM-dd');
                                    $scope.view.oldStartDate = $scope.view.travel.travelApplication.startDate;
                                    $scope.view.travel.travelApplication.endDate = new Date($scope.view.travel.travelApplication.endDate).Format('yyyy-MM-dd');
                                    $scope.view.oldEndDate = $scope.view.travel.travelApplication.endDate;
                                    if ($scope.view.travel.travelApplication.supplierOID && $scope.view.SupplierList) {
                                        for (var i = 0; i < $scope.view.SupplierList.length; i++) {
                                            if ($scope.view.travel.travelApplication.supplierOID === $scope.view.SupplierList[i].supplierOID) {
                                                $scope.view.selectedSupplier = $scope.view.SupplierList[i];
                                                break;
                                            }
                                        }
                                    }
                                    var uerOID = [];
                                    if ($scope.view.travel.travelApplication.approverOIDs !== null && $scope.view.travel.travelApplication.approverOIDs !== '') {
                                        uerOID = $scope.view.travel.travelApplication.approverOIDs.split(":");
                                        $scope.view.approvalSelectedName = '';
                                        if (uerOID.length > 0) {
                                            $scope.memberList = [uerOID.length];
                                            TravelERVService.getBatchUsers(uerOID)
                                                .success(function (data) {
                                                    var num = 0;
                                                    for (; num < data.length; num++) {
                                                        for (var j = 0; j < uerOID.length; j++) {
                                                            if (uerOID[j] === data[num].userOID) {
                                                                $scope.memberList[j] = data[num];
                                                            }
                                                        }
                                                    }
                                                    if (num === data.length) {
                                                        for (var i = 0; i < $scope.memberList.length; i++) {
                                                            if (i !== ($scope.memberList.length - 1)) {
                                                                $scope.view.approvalSelectedName += $scope.memberList[i].fullName + ','
                                                            } else {
                                                                $scope.view.approvalSelectedName += $scope.memberList[i].fullName;
                                                            }
                                                        }
                                                    }
                                                })
                                        } else {
                                            $scope.memberList = [];
                                            $scope.view.approvalSelectedName = '';
                                        }

                                    } else {
                                        $scope.view.approvalSelectedName = '';
                                    }
                                })
                                .error(function(data){
                                    if(data.message){
                                        PublicFunction.showToast(data.message);
                                    } else {
                                        PublicFunction.showToast($filter('translate')('create.base_js.Make.a.mistake'));//出错了
                                    }
                                })
                                .finally(function (){
                                    $ionicLoading.hide();
                                });
                            $scope.view.readonly = false;
                        }
                    });
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        $scope.view.travel.travelApplication.currencyCode = data.currencyCode;
                        $scope.view.showExternalParticipant = data.configuration.ui.showExternalParticipant;//外部参与人员
                        $scope.view.showSupplierList = data.configuration.ui.showSupplierList;//供应商选择
                        $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.travel.travelApplication.currencyCode);
                        $scope.view.showDepartment = data.configuration.ui.showDepartmentSelector.applications;
                        $scope.view.showCostcenter = data.configuration.ui.showCostCenterSelector.applications;
                        if ((!data.configuration.approvalRule && !data.configuration.approvalRule.approvalMode) || ((data.configuration.approvalRule) && (data.configuration.approvalRule.approvalMode) && data.configuration.approvalRule.approvalMode === 1003)) {
                            $scope.view.isShowApproval = true;
                            $scope.view.approvalMaxLength = data.configuration.approvalRule.maxApprovalChain;
                        } else {
                            $scope.view.isShowApproval = false;
                        }
                    });
            };
            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
                CostCenterService.getMyCostCenters().then(function (data) {
                    $scope.view.hasCostCenter = data.length>0 && data[0].costCenterItems.length>0;
                    $scope.view.costName = data.length>0?data[0].name:$filter('translate')('create.base_js.Cost.center');//成本中心
                });
            });
        }]);
