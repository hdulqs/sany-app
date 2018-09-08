'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('approval_expense_list', {
            url:'/approval/expense/{userOid}',
            parent: 'app',
            cache: false,
            views: {
                'page-content': {
                    templateUrl: 'scripts/pages/approval/approval.expense.list.tpl.html',
                    controller: 'ApprovalExpenseController'
                }
            },
            params: {
                unApproved: true
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('approval');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('ApprovalExpenseController', ['$scope', '$state', '$stateParams', 'ApprovalService',
        '$ionicScrollDelegate', 'ParseLinks', 'ExpenseService', '$ionicPopup', '$ionicLoading', '$rootScope', 'PushService',
        '$filter','CompanyConfigurationService',
        function($scope, $state, $stateParams, ApprovalService, $ionicScrollDelegate, ParseLinks, ExpenseService,
                 $ionicPopup, $ionicLoading, $rootScope, PushService,$filter,CompanyConfigurationService) {

            $scope.view = {
                originCurrencyCode:"",
                invoiceStatus: 'INIT',//状态
                pageable: {
                    page: 0,
                    size: 10
                },
                unApproved: $stateParams.unApproved == null ? true : $stateParams.unApproved,
                goBack: function() {
                    $state.go('approval.list', {unApproved: $scope.view.unApproved});
                },
                nothing: false, //无数据的标记
                hasFinish: true,
                tabIndex: 0,
                expenseList: [],
                userOid: $stateParams.userOid,
                dataNum: {  //数据信息
                    lastPage: 0,
                    total: 0
                },
                //费用类型列表
                typeList: [],
                selectData: [],
                isBatchOperation: false,//待提交的批量操作
                isBatchProduct: false,//已审批的批量选择
                selectAll: false, //是否选择所有的待提交数据
                isFilterContainerOpen: false,
                isAll: false,
                isDefineTime: false, //是否是自定义时间
                timeList: [
                    {
                        name: $filter('translate')('approval.all'),//全部
                        isSelected: false
                    },
                    {
                        name: $filter('translate')('approval.oneMonth'),//近一个月
                        isSelected: false
                    },
                    {
                        name: $filter('translate')('approval.twoMonthes'),//近两个月
                        isSelected: false
                    }
                ],
                isSelectApproavlList: false, //选择发票清单
                waitProductList: [],//待生成发票清单列表
                rejectReason: null,
                selectAmount: 0,
                isIncludedOID: 0,
                stateTotal: null,
                isList: true,
                cancelBatchOperation: function() {
                    $scope.view.isBatchOperation = false;
                    $scope.view.selectAll = false;
                    $scope.view.isIncludedOID = 0;
                    $scope.view.selectLength = 0;
                    $scope.view.isAll = false;
                    $scope.view.selectData = [];
                    $scope.view.selectAmount = 0;
                    angular.forEach($scope.view.expenseList, function(item) {
                        if (item.checked)
                            item.checked = false
                    })
                },
                listToggle: function() {
                    $scope.view.isList = ! $scope.view.isList;
                    if ($scope.view.isList) {
                        $scope.goTo('approval.list');
                    } else {
                        $state.go('app.approval_map');
                    }
                },
                changeShowIndex: function (index) {
                    if ($scope.view.paperIndex === index) {
                        $scope.view.paperIndex = -1;
                    } else {
                        $scope.view.paperIndex = index;
                    }
                },
                //生成发票清单
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1500
                    });
                },
                //查看详情
                goExpenseDetail: function (invoiceOID) {
                    if ($scope.view.unApproved)
                        $state.go('app.expense_approval_list', {expense: invoiceOID});
                    else
                        $state.go('app.expense_approvaled', {expense: invoiceOID});
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
                            //unchecked the all checkbox
                            $scope.view.selectAll = false;
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
                        ApprovalService.getUserTotalExpenses($scope.view.userOid, $scope.view.isIncludedOID)
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

                showOpinionPopup: function () {
                    if ($scope.view.selectData && $scope.view.selectData.length > 0) {
                        var opinionPopup = $ionicPopup.show({
                            template: "<textarea type='text' style='padding:10px;' placeholder='" + $filter('translate')('approval.pleaseReason') + "' ng-model='view.rejectReason' rows='6' maxlength='100'>",//请输入理由
                            title: "<h5>" + $filter('translate')('error.reason.for.rejection') + "</h5>",//驳回理由
                            scope: $scope,
                            buttons: [
                                {text: $filter('translate')('approval.cancel')},//取消
                                {
                                    text: $filter('translate')('approval.confirm'),//确认
                                    type: 'button-positive',
                                    onTap: function (e) {
                                        if (!$scope.view.rejectReason) {
                                            $ionicLoading.show({
                                                template: $filter('translate')('approval.please.enter.the.reason.for.rejecting'),//请输入驳回理由
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
                                $scope.view.rejectExpense();
                            } else {
                            }
                        });
                    }
                },
                //agree one expense
                agree: function(expenseOid) {
                    var expenseOids = [];
                    expenseOids.push(expenseOid);
                    ExpenseService.agreeExpense(expenseOids)
                        .success(function (data) {
                            $scope.view.selectLength = 0;
                            $scope.view.selectData = [];
                            $scope.view.openWarningPopup($filter('translate')('approval.submitOk'));//提交成功!
                            $scope.view.pageable.page = 0;
                            $scope.view.getExpenseList($scope.view.pageable.page);
                        })
                },
                //reject one expense
                reject: function(expenseOid) {
                    var expenseOids = [];
                    expenseOids.push(expenseOid);
                    var opinionPopup = $ionicPopup.show({
                        template: "<textarea type='text' style='padding:10px;' placeholder='" + $filter('translate')('approval.pleaseReason') + "' ng-model='view.rejectReason' rows='6' maxlength='100'>",//请输入理由
                        title: "<h5>" + $filter('translate')('error.reason.for.rejection') + "</h5>",//驳回理由
                        scope: $scope,
                        buttons: [
                            {text: $filter('translate')('approval.cancel')},//取消
                            {
                                text: $filter('translate')('approval.confirm'),//确认
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.view.rejectReason) {
                                        $ionicLoading.show({
                                            template: $filter('translate')('approval.please.enter.the.reason.for.rejecting'),//请输入驳回理由
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
                            ExpenseService.rejectExpense(expenseOids, $scope.view.rejectReason)
                                .success(function() {
                                    $scope.view.openWarningPopup($filter('translate')('approval.rejected'));//已驳回
                                    $scope.view.pageable.page = 0;
                                    $scope.view.getExpenseList($scope.view.pageable.page);
                                })
                        }
                    });
                },

                agreeExpense: function () {
                    if ($scope.view.selectData.length > 0) {
                        ExpenseService.agreeExpense($scope.view.selectData)
                            .success(function (data) {
                                $scope.view.selectLength = 0;
                                $scope.view.selectData = [];
                                $scope.view.openWarningPopup($filter('translate')('approval.submitOk'));//提交成功!
                                $scope.view.pageable.page = 0;
                                $scope.view.getExpenseList($scope.view.pageable.page);
                                $scope.view.isBatchOperation = false;
                                $scope.view.selectData = [];
                                $scope.view.selectAll = false;
                                $scope.view.isAll = false;
                            })
                    }
                },

                rejectExpense: function() {
                    if ($scope.view.selectData.length > 0) {
                        ExpenseService.rejectExpense($scope.view.selectData, $scope.view.rejectReason)
                            .success(function (data) {
                                $scope.view.selectLength = 0;
                                $scope.view.selectData = [];
                                $scope.view.openWarningPopup($filter('translate')('approval.rejected'));//已驳回
                                $scope.view.pageable.page = 0;
                                $scope.view.getExpenseList($scope.view.pageable.page);
                                $scope.view.isBatchOperation = false;
                                $scope.view.selectData = [];
                                $scope.view.selectAll = false;
                                $scope.view.isAll = false;
                            })
                    }
                },

                doRefresh: function () {
                    $scope.view.pageable.page = 0;
                    $scope.view.expenseList = [];
                    $scope.view.getExpenseList($scope.view.pageable.page, true);
                },
                goTo: function (state) {
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
                batchOperation: function () {
                    if (!$scope.view.nothing) {
                        $scope.view.isBatchOperation = true;
                    }
                },
                getExpenseList: function(page, refreshData) {
                    if (page === 0) {
                        $scope.view.expenseList = [];
                        $scope.view.dataNum.lastPage = 0;
                        $ionicScrollDelegate.scrollTop();
                    }

                    if ($scope.view.unApproved) {
                        ApprovalService.getUserExpenseWaitForApproval(page, $scope.view.pageable.size, $scope.view.userOid)
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
                        ApprovalService.getUserExpensePassedApproval(page, $scope.view.pageable.size, $scope.view.userOid)
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

                    }

                }
            };
            $scope.$on('$ionicView.enter', function () {
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        //获取公司本位币
                        $scope.view.originCurrencyCode = data.currencyCode;
                    });
                $scope.view.getExpenseList(0);
                ExpenseService.getMessageList(0, 1)
                    .success(function (data, status, headers) {
                        $scope.total = headers('x-total-count');
                        $rootScope.$broadcast('NOTIFICATIONTOTAL', $scope.total);
                        PushService.setBadge($scope.total);
                    });
            })
        }
    ]);
