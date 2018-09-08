'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.account_book', {
            url: '/account_book/:expenseReportOID',
            cache: false,
            params: {
                message: null,
                expenseReportOID: null,
                expense: null,
                currencyCode: null,
                originCurrencyCode: null,
                invoiceNum: 0,
                expenseTypeList: null,
                expenseTypeOIDs: null,
                ownerOID: null  // 费用所属者的OID
            },
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/expense_report_version/my_account/account_book/account_book.tpl.html',
                    controller: 'com.handchina.hly.ErvAccountBookController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('account_book.tpl');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('global');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        });
    }])
    .controller('com.handchina.hly.ErvAccountBookController', ['$scope', '$state', 'ExpenseService', 'ParseLinks', '$ionicModal', '$ionicScrollDelegate', '$ionicLoading', '$ionicPopup', 'PushService', '$rootScope',
        '$cordovaDatePicker', 'ExpenseReportService', 'localStorageService', 'InvoiceService', '$q', 'MAX_ER_INVOICE_NUM', 'CurrencyCode', 'CompanyConfigurationService', 'NotificationService',
        'FunctionProfileService', 'NetworkInformationService', 'LANG','$filter',
        function ($scope, $state, ExpenseService, ParseLinks, $ionicModal, $ionicScrollDelegate, $ionicLoading, $ionicPopup, PushService, $rootScope, $cordovaDatePicker,
                  ExpenseReportService, localStorageService, InvoiceService, $q, MAX_ER_INVOICE_NUM, CurrencyCode, CompanyConfigurationService, NotificationService, FunctionProfileService,
                  NetworkInformationService, LANG,$filter) {
            $scope.view = {
                networkError: false,
                networkErrorText:$filter('translate')('error.network'),
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText: $filter('translate')('error.server'),
                systemErrorSubText: $filter('translate')('error.system'),
                systemErrorIcon: "img/error-icon/system-error.png",
                selectLength: 0,
                expense: null,
                //公司设置的本位币
                originCurrencyCode:$state.params.originCurrencyCode,
                currencyCode: null,
                expenseReportInvoiceList: [],
                selectedInvoiceOids: [],
                fromPage: null,
                invoiceStatus: null,//状态
                showNoticeIcon: true,
                showCreateInvoiceIcon: true,
                showDetail:false,
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
                        name: $filter('translate')('account.all'),
                        isSelected: false
                    },
                    {
                        name: $filter('translate')('account_js.nearly.a.month'),
                        isSelected: false
                    },
                    {
                        name: $filter('translate')('account_js.nearly.two.month'),
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
                originInvoiceNum: $state.params.invoiceNum, //原报销单费用数量
                maxInvoiceNum: MAX_ER_INVOICE_NUM - $state.params.invoiceNum, //单张报销单最多200条费用
                expenseObjects: localStorageService.get('expenseObjects') ? localStorageService.get('expenseObjects') : [],//创建报销单时手动添加费用
                changeShowIndex: function (index) {
                    if ($scope.view.paperIndex === index) {
                        $scope.view.paperIndex = -1;
                    } else {
                        $scope.view.paperIndex = index;
                    }
                },
                //生成发票清单
                batchProduct: function () {
                    if ($scope.view.selectData.length > 0) {
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
                                ExpenseService.getExpenseList(0, 1, 'APPROVALED', $scope.view.currencyCode)
                                    .success(function (data) {
                                        if (data.length > 0) {
                                            $scope.view.hasApprovaled = true;
                                        } else {
                                            $scope.view.hasApprovaled = false;
                                        }
                                    });
                                $scope.view.getExpenseList($scope.view.pageable.page);
                                var confirmPopup = $ionicPopup.show({
                                    title: $filter('translate')('account_js.Submitted.successfully'),
                                    template: '<p>'+$filter('translate')('account_js.send_to_mailbox')+'<br/>'+$filter('translate')('account_js.according_to_PDF_stick_ticket')+'</p>',//将发送PDF到邮箱,请根据PDF贴票
                                    cssClass: 'expense-product-state',
                                    buttons: [
                                        {
                                            text: $filter('translate')('account_js.ok.know'),
                                            type: 'button-positive',
                                            onTap: function (e) {

                                            }
                                        }
                                    ]
                                });
                            })
                            .error(function (data) {
                                var confirmPopup = $ionicPopup.show({
                                    title: '<p>'+$filter('translate')('account_js.submit.failure')+'</p>',
                                    template: $filter('translate')('account_js.Please.try.again.later'),
                                    buttons: [
                                        {
                                            text: $filter('translate')('account_js.ok.know'),
                                            type: 'button-positive',
                                            onTap: function (e) {
                                            }
                                        }
                                    ],
                                    cssClass: 'expense-product-state'
                                });
                            });
                    } else {
                        $scope.view.openWarningPopup($filter('translate')('account_js.Please.select.a.cost'));
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
                            $scope.view.openWarningPopup($filter('translate')('account_js.Delete.success'));
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
                            $scope.view.openWarningPopup($filter('translate')('account_js.Withdraw.success'));
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
                        if (readonly) {
                            $state.go('app.expense_third_part', {
                                expense: invoiceOID,
                                message: 'account_book'
                            });
                        } else {
                            $state.go('app.expense_init', {
                                expense: invoiceOID,
                                message: 'account_book',
                                hasHistory: true
                            });
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
                        $scope.view.timeList[$scope.view.filter.timeFilter - 1].isSelected = false;
                        $scope.view.filter.timeFilter = null;
                    }
                    $scope.view.filter = {
                        isAllType: false,
                        selectedType: []
                    };
                    for (var i = 0; i < $scope.view.typeList.length; i++) {
                        if ($scope.view.typeList[i].isSelected) {
                        }
                        $scope.view.typeList[i].isSelected = false;
                    }
                },
                //筛选数据
                dataSelector: function () {
                    //置空已选费用
                    $scope.view.expenseObjects = [];
                    $scope.view.updateSumAndNum($scope.view.expenseObjects);
                    $scope.view.isFilterContainerOpen = false;
                    $scope.view.pageable.page = 0;
                    if ($scope.view.filter.isAllType === false) {
                        if ($scope.view.filter.selectedType.length === 0) {
                            if ($scope.view.filter.timeFilter == null || $scope.view.filter.timeFilter === 0) {
                                $scope.view.isFilter = false;
                                $scope.view.getExpenseList($scope.view.pageable.page);
                            } else {
                                $scope.view.isFilter = true;
                                if ($scope.view.filter.timeFilter === 1 || $scope.view.filter.timeFilter === 2) {
                                    var date = new Date();
                                    date.setMonth(date.getMonth() - $scope.view.filter.timeFilter);
                                    $scope.view.filter.beginTime = date.Format("yyyy-MM-dd") + 'T' + '00:00:00' + 'Z';
                                    $scope.view.filter.endTime = new Date().Format("yyyy-MM-dd") + 'T' + '23:59:59' + 'Z';
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
                                $scope.view.filter.endTime = new Date().Format("yyyy-MM-dd") + 'T' + '23:59:59' + 'Z';
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
                            $scope.view.filter.endTime = new Date().Format("yyyy-MM-dd") + 'T' + '23:59:59' + 'Z';
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
                //筛选条件中的时间选择
                selectTime: function (index) {
                    for (var i = 0; i < $scope.view.timeList.length; i++) {
                        if (i !== index) {
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
                countSelect: function (index, expense) {
                    var num = $scope.view.expenseObjects.indexOf(expense.invoiceOID);
                    if (num > -1) {
                        expense.checked = false;
                        $scope.view.expenseObjects.splice(num, 1);
                        if ($scope.view.selectAll) {
                            $scope.view.selectAll = false;
                        }
                        //计算总金额和选择条数
                        $scope.view.updateSumAndNum($scope.view.expenseObjects);
                    } else {
                        if ($scope.view.expenseObjects.length < $scope.view.maxInvoiceNum) {
                            expense.checked = true;
                            $scope.view.expenseObjects.push(expense.invoiceOID);
                            if ($scope.view.expenseObjects.length === parseInt($scope.view.dataNum.total) ||
                                $scope.view.expenseObjects.length === $scope.view.maxInvoiceNum) {
                                $scope.view.selectAll = true;
                            }
                            //计算总金额和选择条数
                            $scope.view.updateSumAndNum($scope.view.expenseObjects);
                        } else {
                            expense.checked = false;
                            $scope.view.openWarningPopup($filter('translate')('account_js.Expense.account.added.at.200'));
                        }
                    }

                },
                getSum: function(invoiceOIDs) {
                    var deferred = $q.defer();
                    if (invoiceOIDs && 0 < invoiceOIDs.length) {
                       if($state.params.originCurrencyCode===$state.params.currencyCode){
                           InvoiceService.getBaseAmountSumByPost(invoiceOIDs)
                               .then(function(response) {
                                   deferred.resolve(response.data);
                               }, function() {
                                   deferred.resolve(0);
                               });
                       }else {
                           InvoiceService.getSumByPost(invoiceOIDs)
                               .then(function(response) {
                                   deferred.resolve(response.data);
                               }, function() {
                                   deferred.resolve(0);
                               });
                       }


                    } else {
                        deferred.resolve(0);
                    }
                    return deferred.promise;
                },
                updateSumAndNum: function(invoiceOIDs) {
                    $scope.view.selectLength = invoiceOIDs.length;
                    $scope.view.getSum(invoiceOIDs)
                        .then(function(data) {
                            $scope.view.selectAmount = data;
                        });
                },
                selectAllAction: function () {

                    if ($scope.view.selectAll) {
                        //判断已选的费用数量是否和报销单最大费用数量相同
                        if ($scope.view.expenseObjects.length === $scope.view.maxInvoiceNum) {
                            $scope.view.openWarningPopup($filter('translate')('account_js.Expense.account.added.at.200'));
                        } else {
                            var selectedOids = [];
                            if (!$scope.view.isFilter) {
                                 ExpenseService.getInvoiceOids($scope.view.currencyCode, $state.params.originCurrencyCode,
                                     $scope.view.functionProfileList["web.invoice.keep.consistent.with.expense"], 'INIT', $state.params.expenseTypeOIDs, null, $state.params.ownerOID)
                                    .then(function(response) {
                                        var selectedOids = response.data.invoiceOIDs;
                                        if (selectedOids && selectedOids.length >= $scope.view.maxInvoiceNum) {
                                            $scope.view.expenseObjects = selectedOids.slice(0, $scope.view.maxInvoiceNum);
                                            $scope.view.openWarningPopup($filter('translate')('account_js.Expense.account.added.at.200'));
                                        } else {
                                            $scope.view.expenseObjects = selectedOids;
                                        }
                                        $scope.view.expenseList.forEach(function(item){

                                            if ($scope.view.expenseObjects.indexOf(item.invoiceOID) > -1) {
                                                item.checked = true;
                                            } else {
                                                item.checked = false;
                                            }
                                        });
                                        //计算金额和条数
                                        $scope.view.updateSumAndNum($scope.view.expenseObjects);
                                    });
                            } else {
                                ExpenseService.getInvoiceOids($scope.view.currencyCode, $state.params.originCurrencyCode,
                                    $scope.view.functionProfileList["web.invoice.keep.consistent.with.expense"], 'INIT', $scope.view.filter.selectedType, $scope.view.filter, $state.params.ownerOID)
                                    .then(function(response) {
                                        var selectedOids = response.data.invoiceOIDs;
                                        if (selectedOids && selectedOids.length >= $scope.view.maxInvoiceNum) {
                                            $scope.view.expenseObjects = selectedOids.slice(0, $scope.view.maxInvoiceNum);
                                            $scope.view.openWarningPopup($filter('translate')('account_js.Expense.account.added.at.200'));
                                        } else {
                                            $scope.view.expenseObjects = selectedOids;
                                        }
                                        $scope.view.expenseList.forEach(function(item){
                                            if ($scope.view.expenseObjects.indexOf(item.invoiceOID) > -1) {
                                                item.checked = true;
                                            } else {
                                                item.checked = false;
                                            }
                                        });
                                        //计算金额和条数
                                        $scope.view.updateSumAndNum($scope.view.expenseObjects);
                                    });
                            }
                        }
                    //反选状态
                    } else {
                        //清空expenseObjects
                        $scope.view.expenseObjects = [];
                        $scope.view.updateSumAndNum($scope.view.expenseObjects);
                        //checked状态全部set成false
                        if ($scope.view.expenseList && $scope.view.expenseList.length) {
                            $scope.view.expenseList.forEach(function(item) {
                                item.checked = false;
                            });
                        }
                    }
                },

                //提交待审批费用
                applyForApproval: function () {

                    if ($scope.view.expenseObjects.length > 0) {
                        localStorageService.set('expenseObjects', $scope.view.expenseObjects);
                        if ($state.params.message == 'create_second') {
                            $state.go('app.tab_erv_create_expense_second', {
                                expenseReportOID: $state.params.expenseReportOID
                            })
                        }  else if ($state.params.message == 'create_relative_second') {
                            $state.go('app.tab_erv_create_relative_expense_second', {
                                expenseReportOID: $state.params.expenseReportOID
                            })
                        } else if ($state.params.message == 'normal') {
                            $state.go('app.tab_erv_expense_normal', {
                                expenseReportOID: $state.params.expenseReportOID
                            })
                        } else if ($state.params.message == 'withdraw') {
                            $state.go('app.tab_erv_expense_withdraw', {
                                expenseReportOID: $state.params.expenseReportOID
                            })
                        } else if ($state.params.message == 'approval_reject') {
                            $state.go('app.tab_erv_expense_approval_reject', {
                                expenseReportOID: $state.params.expenseReportOID
                            })
                        } else if ($state.params.message == 'audit_reject') {
                            $state.go('app.tab_erv_expense_audit_reject', {
                                expenseReportOID: $state.params.expenseReportOID
                            })
                        } else if ($state.params.message == 'self_next') {
                            $state.go('app.self_define_expense_report_next', {
                                expenseReportOID: $state.params.expenseReportOID
                            })
                        }

                    } else {

                    }
                },
                doRefresh: function () {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.view.nothing = false;
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    $scope.view.pageable.page = 0;
                    $scope.view.getExpenseList($scope.view.pageable.page, true);
                },
                goTo: function (state) {
                    ExpenseService.setTab($scope.view.invoiceStatus);
                    $state.go(state);
                },
                goToCreateExpense: function () {
                    $state.go('app.expense_create',
                        {
                            message: 'account_book',
                            hasHistory: true,
                            currencyCode:$scope.view.originCurrencyCode
                        }
                    );
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
                        });
                },
                checkHasChoosed: function (expense) {
                    var hasChoosed = false;

                    if ($scope.view.expenseObjects.indexOf(expense.invoiceOID) > -1) {
                        hasChoosed = true;
                    }
                    return hasChoosed;
                },
                getTotal: function () {
                    ExpenseService.getTotal($scope.view.invoiceStatus, $scope.view.isIncludedOID,
                        $scope.view.currencyCode, $scope.view.filter.selectedType, $scope.view.filter.beginTime, $scope.view.filter.endTime)
                        .success(function (data) {
                            $scope.view.isAll = true;
                            $scope.view.selectLength = data.totalNum;
                            $scope.view.selectAmount = data.totalAmount;
                            $scope.view.selectData = data.invoices;
                            if (localStorageService.get('expenseObjects')) {
                                var expenseList = localStorageService.get('expenseObjects');
                                for (var i = 0; i < expenseList.length; i++) {
                                    if ($scope.view.selectData.indexOf(expenseList[i]) > 0) {
                                        $scope.view.selectAmount = $scope.view.selectAmount - expenseList[i].amount;
                                        $scope.view.selectData.splice($scope.view.selectData.indexOf(expenseList[i]), 1);
                                    }
                                }
                            }
                        });
                },
                getExpenseList: function (page, refreshData) {
                    $scope.view.pageable.page = page;
                    if (page === 0) {
                        $scope.view.expenseList = [];
                        $scope.view.dataNum.lastPage = 0;
                        $ionicScrollDelegate.scrollTop();
                    }
                    //待提交下的筛选条件
                    if ($scope.view.invoiceStatus === 'INIT') {
                        if ($scope.view.isFilter) {
                            //费用和报销单币种是否保持一致，默认本位币时不保持一致;配置成true，本位币也是保持一致
                            //$scope.view.functionProfileList["web.invoice.keep.consistent.with.expense"]
                            ExpenseService.getExpenseSelector(page, $scope.view.pageable.size,
                                $scope.view.filter.beginTime, $scope.view.filter.endTime,
                                $scope.view.filter.selectedType, $scope.view.currencyCode,
                                $state.params.ownerOID,$state.params.originCurrencyCode,
                                $scope.view.functionProfileList["web.invoice.keep.consistent.with.expense"])
                                .success(function (data, status, headers) {
                                    if (data.length > 0) {
                                        $scope.view.nothing = false;
                                        for (var i = 0; i < data.length; i++) {
                                            data[i].week = new Date(data[i].createdDate).getDay();
                                            data[i].formatDate = new Date(data[i].createdDate).Format('yyyy-MM-dd');
                                            if ($scope.view.checkHasChoosed(data[i])) {
                                                //$scope.view.expenseList.push(data[i]);
                                                data[i].checked = true;
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
                                .error(function (error, status) {
                                    if ((!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) || status === -1) {
                                        $scope.view.networkError = true;
                                    } else if (status === 503) {
                                        $scope.view.systemError = true;
                                    }
                                })
                                .finally(function () {
                                    $ionicLoading.hide();
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                    if (refreshData) {
                                        $scope.$broadcast('scroll.refreshComplete');
                                    }
                                });
                        } else {
                            if($state.params.expenseTypeList){
                                $scope.view.filter.beginTime = null;
                                $scope.view.filter.endTime = null;
                                ExpenseService.getExpenseSelector(page, $scope.view.pageable.size, $scope.view.filter.beginTime,
                                    $scope.view.filter.endTime, $state.params.expenseTypeOIDs, $scope.view.currencyCode,
                                    $state.params.ownerOID,$state.params.originCurrencyCode,$scope.view.functionProfileList["web.invoice.keep.consistent.with.expense"])
                                    .success(function (data, status, headers) {
                                        if (data.length > 0) {
                                            $scope.view.nothing = false;
                                            for (var i = 0; i < data.length; i++) {
                                                data[i].week = new Date(data[i].createdDate).getDay();
                                                data[i].formatDate = new Date(data[i].createdDate).Format('yyyy-MM-dd');
                                                if ($scope.view.checkHasChoosed(data[i])) {
                                                    //$scope.view.expenseList.push(data[i]);
                                                    data[i].checked = true;
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
                                    .error(function (error, status) {
                                        if ((!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) || status === -1) {
                                            $scope.view.networkError = true;
                                        } else if (status === 503) {
                                            $scope.view.systemError = true;
                                        }
                                    })
                                    .finally(function () {
                                        $ionicLoading.hide();
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                        if (refreshData) {
                                            $scope.$broadcast('scroll.refreshComplete');
                                        }
                                    });
                            } else {
                                ExpenseService.getExpenseList(page, $scope.view.pageable.size, $scope.view.invoiceStatus, $scope.view.currencyCode)
                                    .success(function (data, status, headers) {
                                        $ionicLoading.hide();
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
                                                // if ($scope.view.isAll) {
                                                //     data[i].checked = true;
                                                // } else {
                                                //     data[i].checked = false;
                                                // }
                                                if ($scope.view.checkHasChoosed(data[i])) {
                                                    //$scope.view.expenseList.push(data[i]);
                                                    data[i].checked = true;
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
                                    .error(function (error, status) {
                                        $ionicLoading.hide();
                                        if ((!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) || status === -1) {
                                            $scope.view.networkError = true;
                                        } else if (status === 503) {
                                            $scope.view.systemError = true;
                                        }
                                    })
                                    .finally(function () {
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                        if (refreshData) {
                                            $scope.$broadcast('scroll.refreshComplete');
                                        }
                                    });
                            }

                        }
                    } else {
                        $scope.view.isFilter = false;
                        ExpenseService.getExpenseList(page, $scope.view.pageable.size, $scope.view.invoiceStatus, $scope.view.currencyCode)
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
                            .error(function (error, status) {
                                if ((!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) || status === -1) {
                                    $scope.view.networkError = true;
                                } else if (status === 503) {
                                    $scope.view.systemError = true;
                                }
                            })
                            .finally(function () {
                                $ionicLoading.hide();
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                if (refreshData) {
                                    $scope.$broadcast('scroll.refreshComplete');
                                }
                            });
                    }


                    //打印费用列表
                    //console.log($scope.view.expenseList)
                }
            };
            //获取货币符号
            $scope.getCurrencySymbol = function(currencyCode) {
                return CurrencyCode[currencyCode];
            };
            $scope.$on('$ionicView.enter', function () {
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                if($state.params.currencyCode){
                    $scope.view.currencyCode =$state.params.currencyCode;
                }

                if (localStorageService.get('expenseObjects')) {
                    $scope.view.expenseReportInvoiceList = localStorageService.get('expenseObjects');
                }
                $scope.view.fromPage = $state.params.message;
                if ($scope.view.fromPage) {
                    $scope.view.showNoticeIcon = false;
                    $scope.view.showCreateInvoiceIcon = false;
                }
                if ($state.params.invoiceNum) {

                }

                NotificationService.countUnReadMessage()
                    .success(function (data) {
                        $scope.total = data;
                        $scope.$emit('NOTIFICATIONTOTAL', $scope.total);
                        PushService.setBadge($scope.total);
                    });


                //获取费用列表
                $scope.view.invoiceStatus = 'INIT';
                $scope.view.tabIndex = 0;
                $scope.view.canWithdraw = false;
                $scope.view.getExpenseList($scope.view.pageable.page);
                //获取导入的条数和金额
                $scope.view.selectLength = $scope.view.expenseObjects.length;
                $scope.view.getSum($scope.view.expenseObjects)
                    .then(function(data) {
                        $scope.view.selectAmount = data;
                    });
                if($state.params.expenseTypeList){
                    $scope.view.typeList = angular.copy($state.params.expenseTypeList);
                    $scope.view.filter.selectedType = [];
                    for(var i = 0; i < $scope.view.typeList.length; i++){
                        $scope.view.typeList[i].isSelected = false;
                    }
                } else {
                    CompanyConfigurationService.getCompanyConfiguration()
                        .then(function(data) {
                            ExpenseService.getExpenseTypes(data.companyOID)
                                .then(function (data) {
                                    for (var i = 0; i < data.length; i++) {
                                        data[i].isSelected = false;
                                        $scope.view.typeList.push(data[i]);
                                    }
                                });
                        })
                }
            });
            $scope.datePicker = {
                selectDate: function (string) {
                    var dateOptions = {
                        date: new Date(),
                        mode: 'date',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('account.ok'),
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('account_js.cancel'),
                        cancelButtonColor: '#cdcdcd',
                        locale: LANG
                    };
                    $cordovaDatePicker.show(dateOptions).then(function (date) {
                        if (date) {
                            if (string === 'begin') {
                                $scope.view.filter.begin = date;
                            } else if (string === 'end') {
                                if (date < $scope.view.begin) {
                                    $ionicLoading.show({
                                        template: $filter('translate')('account_js.End.time.is.not.less.than.start.time'),
                                        cssClass: 'time-loading',
                                        duration: 1500
                                    });
                                    return;
                                }
                                var currentDate = new Date();
                                if (date > currentDate) {
                                    $ionicLoading.show({
                                        template: $filtre('translate')('account_js.End.time.is.today.at.the.latest'),
                                        cssClass: 'time-loading',
                                        duration: 1500
                                    });
                                    return;
                                }
                                $scope.view.filter.end = date;
                            }
                        }
                    });
                }
            };

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                $scope.view.currencyCode = null;

                FunctionProfileService.getFunctionProfileList().then(function(response){
                    $scope.view.functionProfileList = response;
                })
            });

            function init() {
                if( $state.params.message=='create_second'||
                    $state.params.message=='create_relative_second'||
                    $state.params.message=='normal'||
                    $state.params.message=='withdraw'||
                    $state.params.message=='approval_reject'||
                    $state.params.message=='audit_reject' ||
                    $state.params.message=='self_next'){
                    $scope.view.showDetail=false;
                    $scope.view.canDelete = false;
                }else{
                    $scope.view.showDetail=true;
                    $scope.view.canDelete = true;
                }
                CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                    $scope.configuration = data.configuration.integrations;
                    $scope.view.originCurrencyCode=data.currencyCode;


                    if($.inArray(1001, $scope.configuration) > -1){
                        $scope.view.showNoticeIcon = true;
                    } else{
                        $scope.view.showNoticeIcon = false;
                    }
                });
            }

            init();

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (toState.name == 'app.didi_sync') {
                    $state.go('app.tab_erv.account');
                }
            });
        }]);

