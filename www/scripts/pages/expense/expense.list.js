/**
 * Created by Yuko on 16/7/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.tab.expense-list', {
            url: '/expense/list',
            cache: false,
            views: {
                'tab-expense': {
                    templateUrl: 'scripts/pages/expense/expense.list.tpl.html',
                    controller: 'com.handchina.hly.ExpenseListController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('expense');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('global');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.hly.ExpenseListController', ['$scope', '$state', 'ExpenseService', 'ParseLinks', '$ionicModal', '$ionicScrollDelegate', '$ionicLoading', '$ionicPopup', 'PushService',
        '$rootScope', '$cordovaDatePicker', 'LANG','$filter','CompanyConfigurationService',
        function ($scope, $state, ExpenseService, ParseLinks, $ionicModal, $ionicScrollDelegate,
                  $ionicLoading, $ionicPopup, PushService, $rootScope, $cordovaDatePicker, LANG,$filter,CompanyConfigurationService) {


            $scope.view = {
                originCurrencyCode:"",
                networkError: false,
                networkErrorText: $filter('translate')('error.network'),//哎呀,网络出错了!
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText: $filter('translate')('error.server'),//服务器开小差了,
                systemErrorSubText: $filter('translate')('error.system'),//技术小哥正在努力修复!
                systemErrorIcon: "img/error-icon/system-error.png",
                tabItem: [
                    {name: $filter('translate')('expense_list_js.To.submit')},//待提交
                    {name: $filter('translate')('expense_list_js.In.the.examination.and.approval')},//审批中
                    {name: $filter('translate')('expense_list_js.Have.been.approval')},//已审批
                    {name: $filter('translate')('expense_list_js.Tickets.were.post')}//已贴票
                ],
                invoiceStatus: null,//状态
                pageable: {
                    page: 0,
                    size: 10
                },
                //生成发票清单的oid
                productBatchOID: null,
                hasApprovaled: false,
                paperIndex: 0,//已贴票tab的默认展示项
                nothing: false, //无数据的标记
                hasFinish: true,
                tabIndex: -1,
                expenseList: [],
                dataNum: {  //数据信息
                    lastPage: 0,
                    total: 0
                },
                //待提交数据的筛选条件
                filter: {
                    isAllType: false,
                    selectedType: [],
                    timeFilter: null,
                    beginTime: null,
                    endTime: null,
                    begin: null,
                    end: null
                },
                //费用类型列表
                typeList: [],
                selectData: [],
                isBatchOpertion: false,//待提交的批量操作
                isBatchProduct: false,//已审批的批量选择
                selectAll: false, //是否选择所有的待提交数据
                isFilterContainerOpen: false,
                isAll: false,
                isDefineTime: false, //是否是自定义时间
                timeList: [
                    {
                        name: $filter('translate')('expense_list.all'),//全部
                        isSelected: false
                    },
                    {
                        name: $filter('translate')('expense_list_js.Nearly.a.month'),//近一个月
                        isSelected: false
                    },
                    {
                        name: $filter('translate')('expense_list_js.Nearly.two.month'),//近两个月
                        isSelected: false
                    }
                ],
                isFilter: false,
                isSelectApproavlList: false, //选择发票清单
                waitProductList: [],//待生成发票清单列表
                selectAmount: 0,
                isIncludedOID: 0,
                stateTotal: null,
                canDelete: true,//是否可以左滑删除
                canWithdraw: false, //是否可以左滑撤回
                changeShowIndex: function (index) {
                    if ($scope.view.paperIndex === index) {
                        $scope.view.paperIndex = -1;
                    } else {
                        $scope.view.paperIndex = index;
                    }
                },
                //生成发票清单
                batchProduct: function () {
                    if($scope.view.selectData.length > 0){
                        ExpenseService.submitApproval($scope.view.selectData)
                            .success(function (data) {
                                $scope.view.productBatchOID = data;
                                $scope.view.tabIndex = 3;
                                $scope.view.canDelete = false;
                                $scope.view.canWithdraw = false;
                                $scope.view.pageable.page = 0;
                                $scope.view.dataNum.lastPage = 0;
                                $scope.view.isBatchOpertion = false;
                                $scope.view.isBatchProduct = false;
                                $scope.view.invoiceStatus = 'REPRESENTED';
                                $scope.view.getStateTotal();
                                $scope.view.nothing = false;
                                $scope.view.selectData = [];
                                $scope.view.expenseList = [];
                                ExpenseService.getExpenseList(0, 1, 'APPROVALED')
                                    .success(function (data) {
                                        if (data.length > 0) {
                                            $scope.view.hasApprovaled = true;
                                        } else {
                                            $scope.view.hasApprovaled = false;
                                        }
                                    });
                                $scope.view.getExpenseList($scope.view.pageable.page);
                                var confirmPopup = $ionicPopup.show({
                                    title: $filter('translate')('expense_list_js.Submitted.successfully'),//提交成功
                                    template: '<p>'+$filter('translate')('account_js.send_to_mailbox')+'<br/>'+$filter('translate')('account_js.according_to_PDF_stick_ticket')+'</p>',//<p>将发送PDF到邮箱<br/>请根据PDF贴票</p>
                                    cssClass: 'expense-product-state',
                                    buttons: [
                                        {
                                            text: $filter('translate')('expense_list_js.Ok.know'),//好的,知道了!
                                            type: 'button-positive',
                                            onTap: function (e) {

                                            }
                                        }
                                    ]
                                });
                            })
                            .error(function (data) {
                                var confirmPopup = $ionicPopup.show({
                                    title: '<p>提交失败</p>',
                                    template: $filter('translate')('expense_list_js.Please.try.again.later'),//请稍后再试!
                                    buttons: [
                                        {
                                            text: $filter('translate')('expense_list_js.Ok.know'),//好的,知道了!,
                                            type: 'button-positive',
                                            onTap: function (e) {
                                            }
                                        }
                                    ],
                                    cssClass: 'expense-product-state'
                                });
                            })
                    } else {
                        $scope.view.openWarningPopup($filter('translate')('expense_list_js.Please.select.a.cost'));//请选择费用
                    }


                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1500
                    });
                },
                deleteInvoice: function (invoiceOID) {
                    ExpenseService.deleteOneExpense(invoiceOID)
                        .success(function (data) {
                            $scope.view.openWarningPopup($filter('translate')('create_expense_js.Delete.the.success'));//删除成功
                            $scope.view.pageable.page = 0;
                            $scope.view.getExpenseList(0);
                            $ionicScrollDelegate.scrollTop();
                        })
                },
                withdraw: function (invoiceOID) {
                    var invoiceOIDs = [];
                    invoiceOIDs.push(invoiceOID);
                    ExpenseService.withdrawExpense(invoiceOIDs)
                        .success(function (data) {
                            $scope.view.openWarningPopup($filter('translate')('create_expense_js.Withdraw.the.success'));//撤回成功
                            $scope.view.pageable.page = 0;
                            $scope.view.getExpenseList(0);
                            $ionicScrollDelegate.scrollTop();
                        })
                },
                productInvoiceList: function () {
                    if ($scope.view.nothing) {

                    } else {
                        $scope.view.isBatchProduct = true;
                    }

                },
                //查看详情
                goExpenseDetail: function (readonly, invoiceOID) {
                    ExpenseService.setTab($scope.view.invoiceStatus);
                    if ($scope.view.invoiceStatus === 'INIT') {
                        if(readonly){
                            $state.go('app.expense_third_part', {expense: invoiceOID});
                        } else {
                            $state.go('app.expense_init', {expense: invoiceOID});
                        }
                    } else if ($scope.view.invoiceStatus === 'SUBMITTED') {
                        $state.go('app.expense_submitted', {expense: invoiceOID});
                    } else if ($scope.view.invoiceStatus === 'APPROVALED') {
                        $state.go('app.expense_approvaled', {expense: invoiceOID});
                    } else if ($scope.view.invoiceStatus === 'REPRESENTED') {
                        $state.go('app.expense_represented', {expense: invoiceOID});
                    }
                },
                //取消筛选
                cancelFilter: function () {
                    if ($scope.view.isBatchOpertion) {
                        $scope.view.isFilter = false;
                        $scope.view.isBatchOpertion = false;
                        $scope.view.isFilterContainerOpen = false;
                        $scope.view.isDefineTime = false;
                        $scope.view.filter = {
                            isAllType: false,
                            selectedType: [],
                            timeFilter: null,
                            beginTime: null,
                            endTime: null,
                            begin: null,
                            end: null
                        };

                    } else if ($scope.view.isBatchProduct) {
                        $scope.view.isBatchProduct = false;
                    }
                    $scope.view.pageable.page = 0;
                    $scope.view.getExpenseList(0);
                },
                resetFilter: function () {
                    if ($scope.view.filter.timeFilter) {
                        $scope.view.timeList[$scope.view.filter.timeFilter].isSelected = false;
                        $scope.view.filter.timeFilter = null;
                    }
                    $scope.view.filter = {
                        isAllType: false,
                        selectedType: []
                    };
                    for (var i = 0; i < $scope.view.typeList.length; i++) {
                        $scope.view.typeList[i].isSelected = false;
                    }
                },
                //筛选数据
                dataSelector: function () {
                    $scope.view.isFilterContainerOpen = false;
                    $scope.view.pageable.page = 0;
                    if ($scope.view.filter.isAllType === false) {
                        if ($scope.view.filter.selectedType.length === 0) {
                            if ($scope.view.filter.timeFilter === null || $scope.view.filter.timeFilter === 0) {
                                $scope.view.isFilter = false;
                                $scope.view.getExpenseList($scope.view.pageable.page);
                            } else {
                                $scope.view.isFilter = true;
                                if ($scope.view.filter.timeFilter === 1 || $scope.view.filter.timeFilter === 2) {
                                    var date = new Date();
                                    date.setMonth(date.getMonth() - $scope.view.filter.timeFilter);
                                    $scope.view.filter.beginTime = date.Format("yyyy-MM-dd") + 'T' + '00:00:00' + 'Z';
                                    $scope.view.filter.endTime =  new Date().Format("yyyy-MM-dd") + 'T' + '23:59:59' + 'Z';
                                    $scope.view.getExpenseList($scope.view.pageable.page);
                                } else if ($scope.view.filter.timeFilter === 3) {
                                    $scope.view.filter.beginTime = new Date($scope.view.filter.begin).Format("yyyy-MM-dd") + 'T' + '00:00:00' + 'Z';
                                    $scope.view.filter.endTime = new Date($scope.view.filter.end).Format("yyyy-MM-dd") + 'T' + '23:59:59' + 'Z';
                                    $scope.view.getExpenseList($scope.view.pageable.page);
                                }
                            }
                        } else {
                            $scope.view.isFilter = true;
                            if ($scope.view.filter.timeFilter === null || $scope.view.filter.timeFilter === 0) {
                                $scope.view.filter.beginTime = null;
                                $scope.view.filter.endTime = null;
                                $scope.view.getExpenseList($scope.view.pageable.page);
                            } else if ($scope.view.filter.timeFilter === 1 || $scope.view.filter.timeFilter === 2) {
                                var date = new Date();
                                date.setMonth(date.getMonth() - $scope.view.filter.timeFilter);
                                $scope.view.filter.beginTime = date.Format("yyyy-MM-dd") + 'T' + '00:00:00' + 'Z';
                                $scope.view.filter.endTime =  new Date().Format("yyyy-MM-dd") + 'T' + '23:59:59' + 'Z';
                                $scope.view.getExpenseList($scope.view.pageable.page);
                            } else if ($scope.view.filter.timeFilter === 3) {
                                $scope.view.filter.beginTime = new Date($scope.view.filter.begin).Format("yyyy-MM-dd") + 'T' + '00:00:00' + 'Z';
                                $scope.view.filter.endTime = new Date($scope.view.filter.end).Format("yyyy-MM-dd") + 'T' + '23:59:59' + 'Z';
                                $scope.view.getExpenseList($scope.view.pageable.page);
                            }
                        }

                    } else {
                        if ($scope.view.filter.timeFilter === null || $scope.view.filter.timeFilter === 0) {
                            $scope.view.filter.beginTime = null;
                            $scope.view.filter.endTime = null;
                            $scope.view.isFilter = false;
                            $scope.view.getExpenseList($scope.view.pageable.page);
                        } else if ($scope.view.filter.timeFilter === 1 || $scope.view.filter.timeFilter === 2) {
                            $scope.view.isFilter = true;
                            var date = new Date();
                            date.setMonth(date.getMonth() - $scope.view.filter.timeFilter);
                            $scope.view.filter.beginTime = date.Format("yyyy-MM-dd") + 'T' + '00:00:00' + 'Z';
                            $scope.view.filter.endTime =  new Date().Format("yyyy-MM-dd") + 'T' + '23:59:59' + 'Z';
                            $scope.view.getExpenseList($scope.view.pageable.page);
                        } else if ($scope.view.filter.timeFilter === 3) {
                            $scope.view.isFilter = true;
                            $scope.view.filter.beginTime = new Date($scope.view.filter.begin).Format("yyyy-MM-dd") + 'T' + '00:00:00' + 'Z';
                            $scope.view.filter.endTime = new Date($scope.view.filter.end).Format("yyyy-MM-dd") + 'T' + '23:59:59' + 'Z';
                            $scope.view.getExpenseList($scope.view.pageable.page);
                        }
                        if ($scope.view.filter.isAllType) {
                            $scope.view.filter.selectedType = [];
                        }
                    }
                },
                //筛选条件中的类型选择
                selectType: function (index) {
                    $scope.view.typeList[index].isSelected = !$scope.view.typeList[index].isSelected;
                    if ($scope.view.typeList[index].isSelected) {
                        $scope.view.filter.selectedType.push($scope.view.typeList[index].expenseTypeOID);
                    } else {
                        $scope.view.filter.selectedType.splice($.inArray($scope.view.typeList[index].expenseTypeOID, $scope.view.filter.selectedType), 1);
                    }
                },
                selectAllType: function () {
                    $scope.view.filter.isAllType = !$scope.view.filter.isAllType;
                    for (var i = 0; i < $scope.view.typeList.length; i++) {
                        $scope.view.typeList[i].isSelected = $scope.view.filter.isAllType;
                    }
                },
                //自定义时间
                showSelfDefinition: function () {
                    $scope.view.isDefineTime = !$scope.view.isDefineTime;
                    if ($scope.view.isDefineTime) {
                        $scope.view.filter.timeFilter = 3;
                        for (var i = 0; i < $scope.view.timeList.length; i++) {
                            $scope.view.timeList[i].isSelected = false;
                        }
                    } else {
                        $scope.view.filter.timeFilter = null;
                    }
                },
                ////筛选条件中的时间选择
                selectTime: function (index) {
                    for(var i = 0; i < $scope.view.timeList.length; i++){
                        if(i !== index){
                            $scope.view.timeList[i].isSelected = false;
                        }
                    }
                    var temp = !$scope.view.timeList[index].isSelected;
                    $scope.view.timeList[index].isSelected = temp;
                    if ($scope.view.timeList[index].isSelected) {
                        $scope.view.filter.timeFilter = index;
                        $scope.view.isDefineTime = false;
                    } else {
                        $scope.view.filter.timeFilter = null;
                    }
                },
                showSiftPane: function () {
                    $scope.view.isFilterContainerOpen = true;
                },
                hideSiftPane: function () {
                    $scope.view.isFilterContainerOpen = false;
                },
                createExpense: function () {

                },
                countSelect: function (index) {
                    if ($scope.view.isAll) {
                        if ($scope.view.expenseList[index].checked) {
                            $scope.view.selectLength++;
                            $scope.view.selectAmount += parseInt($scope.view.expenseList[index].amount);
                            $scope.view.selectData.push($scope.view.expenseList[index].invoiceOID);
                        } else {
                            $scope.view.selectLength--;
                            $scope.view.selectAmount -= parseInt($scope.view.expenseList[index].amount);
                            $scope.view.selectData.splice($.inArray($scope.view.expenseList[index].invoiceOID, $scope.view.expenseList), 1);
                        }
                    } else {
                        if ($scope.view.expenseList[index].checked) {
                            $scope.view.selectLength++;
                            $scope.view.selectData.push($scope.view.expenseList[index].invoiceOID);
                            $scope.view.selectAmount += parseInt($scope.view.expenseList[index].amount);
                        } else {
                            $scope.view.selectLength--;
                            $scope.view.selectAmount -= parseInt($scope.view.expenseList[index].amount);
                            $scope.view.selectData.splice($.inArray($scope.view.expenseList[index].invoiceOID, $scope.view.expenseList), 1);
                        }
                    }
                },
                selectAllAction: function () {
                    if ($scope.view.selectAll) {
                        $scope.view.isIncludedOID = 1;
                        ExpenseService.getTotal($scope.view.invoiceStatus, $scope.view.isIncludedOID)
                            .success(function (data) {
                                $scope.view.isAll = true;
                                $scope.view.selectLength = data.totalNum;
                                $scope.view.selectAmount = data.totalAmount;
                                $scope.view.selectData = data.invoiceOIDs;
                            });
                    } else {
                        $scope.view.isIncludedOID = 0;
                        $scope.view.selectLength = 0;
                        $scope.view.isAll = false;
                        $scope.view.selectData = [];
                        $scope.view.selectAmount = 0;
                    }
                    for (var i = 0; i < $scope.view.expenseList.length; i++) {
                        if ($scope.view.expenseList[i].checked = $scope.view.selectAll);
                    }
                },
                batchOperation: function () {
                    if ($scope.view.nothing) {

                    } else {
                        $scope.view.isBatchOpertion = true;
                    }
                },
                //提交待审批费用
                applyForApproval: function () {
                    if ($scope.view.selectData.length > 0) {
                        ExpenseService.expenseApply($scope.view.selectData)
                            .success(function (data) {
                                $scope.view.selectLength = 0;
                                $scope.view.selectData = [];
                                $scope.view.openWarningPopup($filter('translate')('expense_list_js.Submitted.successfully'));//提交成功!
                                $scope.view.pageable.page = 0;
                                $scope.view.getExpenseList($scope.view.pageable.page);
                                $scope.view.selectData = [];
                                $scope.view.selectAll = false;
                                $scope.view.isAll = false;
                            })
                    } else {

                    }
                },
                doRefresh: function () {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.view.pageable.page = 0;
                    $scope.view.expenseList = [];
                    $scope.view.getExpenseList($scope.view.pageable.page, true);
                    $scope.$broadcast('scroll.refreshComplete');
                },
                goTo: function (state) {
                    ExpenseService.setTab($scope.view.invoiceStatus);
                    $state.go(state);
                },
                changeMode: function (mode) {
                    if (mode === 'list') {
                        $('.tab-mode-second').removeClass('active');
                        if (!$('.tab-mode-first').hasClass('active')) {
                            $('.tab-mode-first').addClass('active');
                        }
                    } else if (mode === 'map') {
                        $('.tab-mode-first').removeClass('active');
                        if (!$('.tab-mode-second').hasClass('active')) {
                            $('.tab-mode-second').addClass('active');
                        }
                    }
                },
                changeTab: function (index) {
                    if ($scope.view.tabIndex !== index) {
                        $scope.view.tabIndex = index;
                        $scope.view.pageable.page = 0;
                        $scope.view.dataNum.lastPage = 0;
                        $scope.view.isBatchOpertion = false;
                        $scope.view.isBatchProduct = false;
                        $scope.view.isDefineTime = false;
                        $scope.view.productBatchOID = null;
                        $scope.view.selectData = [];
                        $scope.view.selectAmount = 0;
                        $scope.view.filter = {
                            isAllType: false,
                            selectedType: [],
                            timeFilter: null,
                            beginTime: null,
                            endTime: null,
                            begin: null,
                            end: null
                        };
                        if ($scope.view.tabIndex === 0) {
                            $scope.view.invoiceStatus = 'INIT';
                            $scope.view.canDelete = true;
                            $scope.view.canWithdraw = false;
                        } else if ($scope.view.tabIndex === 1) {
                            $scope.view.invoiceStatus = 'SUBMITTED';
                            $scope.view.canDelete = false;
                            $scope.view.canWithdraw = true;
                            $scope.view.getStateTotal();
                        } else if ($scope.view.tabIndex === 2) {
                            $scope.view.invoiceStatus = 'APPROVALED';
                            $scope.view.canWithdraw = false;
                            $scope.view.canDelete = false;
                            $scope.view.getStateTotal();
                        } else if ($scope.view.tabIndex === 3) {
                            $scope.view.invoiceStatus = 'REPRESENTED';
                            $scope.view.canWithdraw = false;
                            $scope.view.canDelete = false;
                            $scope.view.getStateTotal();
                        }
                        $scope.view.nothing = false;
                        $scope.view.selectData = [];
                        $scope.view.expenseList = [];
                        $scope.view.getExpenseList($scope.view.pageable.page);
                    }
                },
                getStateTotal: function () {
                    ExpenseService.getTotal($scope.view.invoiceStatus, $scope.view.isIncludedOID)
                        .success(function (data) {
                            $scope.view.stateTotal = data;
                        })
                },
                getExpenseList: function (page, refreshData) {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.view.pageable.page = page;
                    if (page === 0) {
                        $scope.view.expenseList = [];
                        $scope.view.dataNum.lastPage = 0;
                        $ionicScrollDelegate.scrollTop();
                    }
                    //待提交下的筛选条件
                    if ($scope.view.invoiceStatus === 'INIT') {
                        if ($scope.view.isFilter) {
                            ExpenseService.getExpenseSelector(page, $scope.view.pageable.size, $scope.view.filter.beginTime, $scope.view.filter.endTime, $scope.view.filter.selectedType)
                                .success(function (data, status, headers) {
                                    if (data.length > 0) {
                                        $scope.view.nothing = false;
                                        for (var i = 0; i < data.length; i++) {
                                            data[i].week = new Date(data[i].createdDate).getDay();
                                            data[i].formatDate = new Date(data[i].createdDate).Format('yyyy-MM-dd');
                                            if ($scope.view.isAll) {
                                                data[i].checked = true;
                                            } else {
                                                data[i].checked = false;
                                            }
                                            $scope.view.expenseList.push(data[i]);

                                        }
                                        if (page === 0) {
                                            $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                                            $scope.view.dataNum.total = headers('x-total-count');
                                        }
                                    } else {
                                        if (page === 0) {
                                            $scope.view.nothing = true;
                                        }
                                    }
                                })
                                .finally(function () {
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                    if (refreshData) {
                                        $scope.$broadcast('scroll.refreshComplete');
                                    }
                                });
                        } else {
                            ExpenseService.getExpenseList(page, $scope.view.pageable.size, $scope.view.invoiceStatus)
                                .success(function (data, status, headers) {
                                    if (data.length > 0) {
                                        $scope.view.nothing = false;
                                        for (var i = 0; i < data.length; i++) {
                                            data[i].week = new Date(data[i].createdDate).getDay();
                                            data[i].formatDate = new Date(data[i].createdDate).Format('yyyy-MM-dd');
                                            if ($scope.view.invoiceStatus === 'REPRESENTED') {
                                                if ($scope.view.productBatchOID !== null || $scope.view.productBatchOID !== '') {
                                                    if (data.invoiceRepresentationOID === $scope.view.productBatchOID) {
                                                        $scope.view.paperIndex = i;
                                                    }
                                                }
                                            }
                                            if ($scope.view.isAll) {
                                                data[i].checked = true;
                                            } else {
                                                data[i].checked = false;
                                            }
                                            $scope.view.expenseList.push(data[i]);
                                        }
                                        if (page === 0) {
                                            $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                                            $scope.view.dataNum.total = headers('x-total-count');
                                        }
                                    } else {
                                        if (page === 0) {
                                            $scope.view.nothing = true;
                                        }
                                    }
                                })
                                .finally(function () {
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                    if (refreshData) {
                                        $scope.$broadcast('scroll.refreshComplete');
                                    }
                                });
                        }
                    } else {
                        $scope.view.isFilter = false;
                        ExpenseService.getExpenseList(page, $scope.view.pageable.size, $scope.view.invoiceStatus)
                            .success(function (data, status, headers) {
                                if (data.length > 0) {
                                    $scope.view.nothing = false;
                                    for (var i = 0; i < data.length; i++) {
                                        data[i].week = new Date(data[i].createdDate).getDay();
                                        if ($scope.view.isAll) {
                                            data[i].checked = true;
                                        } else {
                                            data[i].checked = false;
                                        }
                                        $scope.view.expenseList.push(data[i]);
                                    }
                                    if (page === 0) {
                                        $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                                        $scope.view.dataNum.total = headers('x-total-count');
                                    }
                                } else {
                                    if (page === 0) {
                                        $scope.view.nothing = true;
                                    }
                                }
                            })
                            .finally(function () {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                if (refreshData) {
                                    $scope.$broadcast('scroll.refreshComplete');
                                }
                            });
                    }
                    $rootScope.$on('NETWORKERROR', function (data, event) {
                        $scope.view.networkError = true;
                    });
                    $rootScope.$on('SYSTEMERROR', function (data, event) {
                        $scope.view.systemError = true;
                    });

                }
            };

            $scope.$on('$ionicView.enter', function () {
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        //获取公司本位币
                        $scope.view.originCurrencyCode = data.currencyCode;
                    })
                ExpenseService.getMessageList(0, 1)
                    .success(function (data, status, headers) {
                        $scope.total = headers('x-total-count');
                        $rootScope.$broadcast('NOTIFICATIONTOTAL', $scope.total);
                        PushService.setBadge($scope.total);
                    });
                ExpenseService.getExpenseList(0, 1, 'APPROVALED')
                    .success(function (data) {
                        if (data.length > 0) {
                            $scope.view.hasApprovaled = true;
                        } else {
                            $scope.view.hasApprovaled = false;
                        }
                    });
                if (ExpenseService.getTab()) {
                    $scope.view.invoiceStatus = ExpenseService.getTab();
                    if ($scope.view.invoiceStatus === 'INIT') {
                        $scope.view.tabIndex = 0;
                        $scope.view.canDelete = true;
                        $scope.view.canWithdraw = false;
                        $scope.view.getExpenseList($scope.view.pageable.page);
                    } else if ($scope.view.invoiceStatus === 'SUBMITTED') {
                        $scope.view.tabIndex = 1;
                        $scope.view.canDelete = false;
                        $scope.view.canWithdraw = true;
                        $scope.view.getExpenseList($scope.view.pageable.page);
                    } else if ($scope.view.invoiceStatus === 'APPROVALED') {
                        $scope.view.tabIndex = 2;
                        $scope.view.canDelete = false;
                        $scope.view.canWithdraw = false;
                        $scope.view.getExpenseList($scope.view.pageable.page);
                    } else if ($scope.view.invoiceStatus === 'REPRESENTED') {
                        $scope.view.tabIndex = 3;
                        $scope.view.canDelete = false;
                        $scope.view.canWithdraw = false;
                        $scope.view.getExpenseList($scope.view.pageable.page);
                    } else {
                        $scope.view.invoiceStatus = 'INIT';
                        $scope.view.tabIndex = 0;
                        $scope.view.canDelete = true;
                        $scope.view.canWithdraw = false;
                        $scope.view.getExpenseList($scope.view.pageable.page);
                    }
                } else {
                    $scope.view.invoiceStatus = 'INIT';
                    $scope.view.tabIndex = 0;
                    $scope.view.canDelete = true;
                    $scope.view.canWithdraw = false;
                    $scope.view.getExpenseList($scope.view.pageable.page);
                }
                if ($scope.view.invoiceStatus === 'SUBMITTED' || $scope.view.invoiceStatus === 'APPROVALED') {
                    $scope.view.getStateTotal();
                }
                ExpenseService.getExpenseTypes()
                    .then(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            data[i].isSelected = false;
                            $scope.view.typeList.push(data[i]);
                        }
                    });
                });
            $scope.datePicker = {
                selectDate: function(string){
                    var dateOptions= {
                        date: new Date(),
                            mode: 'date',
                            allowOldDates: true,
                            allowFutureDates: true,
                            doneButtonLabel: $filter('translate')('create_expense_js.ok'),//确定
                            doneButtonColor: '#0092da',
                            cancelButtonLabel: $filter('translate')('create_expense_js.cancel'),//取消
                            cancelButtonColor: '#cdcdcd',
                            locale: LANG
                    };
                    $cordovaDatePicker.show(dateOptions).then(function(date){
                        if (date) {
                            if (string === 'begin') {
                                $scope.view.filter.begin = date;
                            } else if (string === 'end') {
                                $scope.view.filter.end = date;
                            }
                        }
                    });
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
        }]);
