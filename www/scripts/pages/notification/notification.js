'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.notification', {
            url: '/notification',
            cache: false,
            views: {
                'page-content': {
                    templateUrl: 'scripts/pages/notification/notification.tpl.html',
                    controller: 'com.handchina.hly.NotificationController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.hly.NotificationController', ['$scope','$ionicHistory', 'localStorageService',
        'NotificationService', 'InvoiceService', '$state', 'PushService', 'ParseLinks', '$rootScope', 'ExpenseService','$filter',
        function ($scope, $ionicHistory, localStorageService, NotificationService, InvoiceService, $state, PushService,$filter,
                  ParseLinks, $rootScope, ExpenseService) {
            $scope.news = {
                view: {
                    newsDetail: [],
                    noData: false
                },
                data: {
                    page: 0,
                    pageSize: 10,
                    lastPage: 0,
                    comment: '',
                    dataLength: 0,
                    dataCount: 0,
                    exchange: [],
                    isLoadComplete: false,
                    isFirstLoad: false,
                    total: 0
                },
                //获取消息列表
                getNewsList: function (page, pageSize) {
                    NotificationService.getMessageList(page, pageSize)
                        .success(function (data, status, headers) {
                            localStorageService.set('hasMessageTips', data.length > 0);
                            if (data.length > 0) {
                                $scope.news.view.noData = false;
                                if (page === 0) {
                                    $scope.news.data.lastPage = ParseLinks.parse(headers('link')).last;
                                    $scope.news.data.total = headers('x-total-count');
                                }
                                var getDetailNum = 0;
                                $scope.news.data.dataLength = data.length;
                                $scope.news.data.dataCount = data.length;
                                for (var i = 0; i < $scope.news.data.dataLength; i++) {
                                    getDetailNum++;
                                    $scope.news.getMessageDetail(i, data[i].messageType, data[i].referenceId, data[i].messageOID, data[i]);
                                }
                                if (getDetailNum >= $scope.news.data.dataLength) {
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                }
                            } else {
                                if (page === 0) {
                                    $scope.news.view.noData = true;
                                }
                            }
                        })
                },
                //数据排序
                sortData: function () {
                    $scope.news.data.exchange.sort(function (a, b) {
                        return a.index - b.index;
                    })
                },
                doTask: function (index, messageType, referenceId, messageOID, data) {
                    if (data != null && data !== '') {
                        data.index = index;
                        data.messageType = messageType;
                        data.referenceId = referenceId;
                        data.messageOID = messageOID;
                        $scope.news.data.exchange.push(data);
                        if ($scope.news.data.exchange.length === $scope.news.data.dataCount) {
                            $scope.news.data.isFirstLoad = true;
                            $scope.news.sortData();
                            Array.prototype.push.apply($scope.news.view.newsDetail, $scope.news.data.exchange);
                            $scope.news.data.exchange = [];
                        }
                    }
                    //else if (messageType === 'INVOICE_PASS' || messageType === 'INVOICE_APPROVAL') {
                    //    var data = {};
                    //    data.index = index;
                    //    data.messageType = messageType;
                    //    data.referenceId = referenceId;
                    //    data.messageOID = messageOID;
                    //    $scope.news.data.exchange.push(data);
                    //    if ($scope.news.data.exchange.length === $scope.news.data.dataCount) {
                    //        $scope.news.data.isFirstLoad = true;
                    //        $scope.news.sortData();
                    //        Array.prototype.push.apply($scope.news.view.newsDetail, $scope.news.data.exchange);
                    //        $scope.news.data.exchange = [];
                    //    }
                    else {
                        $scope.news.data.dataCount--;
                        NotificationService.deleteOneMessage(messageOID)
                            .success(function (data) {
                                if ($scope.news.data.dataCount === 0 && $scope.news.view.newsDetail.length === 0) {
                                    $scope.news.view.noData = true;
                                }
                            });
                    }
                },
                //获取一条数据详情
                getMessageDetail: function (index, messageType, referenceId, messageOID, news) {
                    if (messageType === "INVOICE") {
                        InvoiceService.getInvoice(referenceId)
                            .success(function (data) {
                                $scope.news.doTask(index, messageType, referenceId, messageOID, data);
                            })
                            .error(function () {
                            })
                    } else if (messageType === "REIMBURSEMENT_APPROVAL" || messageType === "REIMBURSEMENT_PASS" || messageType === "REIMBURSEMENT_REJECT" || messageType === "FINANCE_LOAN" || messageType === "BPO_RECEIVED" || messageType === "BPO_APPROVAL_PASS" || messageType === "BPO_APPROVAL_REJECT") {
                        NotificationService.getMessageAccountDetail(referenceId)
                            .success(function (data) {
                                $scope.news.doTask(index, messageType, referenceId, messageOID, data);
                            })
                            .error(function () {
                            })
                    } else if (messageType === "TRAVEL_APPROVAL" || messageType === "TRAVEL_PASS" || messageType === "TRAVEL_REJECT") {
                        NotificationService.getMessageTravelDetail(referenceId)
                            .success(function (data) {
                                $scope.news.doTask(index, messageType, referenceId, messageOID, data);
                            })
                            .error(function () {
                            })
                    } else if (messageType === "CUSTOM_PROCESS_APPROVAL" || messageType === "CUSTOM_PROCESS_PASS" || messageType === "CUSTOM_PROCESS_REJECT") {
                        NotificationService.getPreInvoiceDetailByProcressId(referenceId)
                            .success(function (data) {
                                var dataDetail = data;
                                for (var i = 0; i < data.customFormValueDTOs.length; i++) {
                                    if (data.customFormValueDTOs[i].fieldName === $filter('translate')('news.project')) {//项目
                                        NotificationService.getCostCenterNameById(data.customFormValueDTOs[i].value)
                                            .success(function (data) {
                                                dataDetail.costCenterItemName = data.name;
                                                $scope.news.doTask(index, messageType, referenceId, messageOID, dataDetail);
                                            });
                                        break;
                                    }
                                }
                            })
                    } else if (messageType === 'INVOICE_REJECT') {
                        //费用驳回
                        ExpenseService.getInvoice(referenceId)
                            .success(function(data) {
                                $scope.news.doTask(index, messageType, referenceId, messageOID, data);
                            });
                    } else {
                        $scope.news.doTask(index, messageType, referenceId, messageOID, news);
                    }
                    //else if (messageType === '') {
                    //
                    //}
                },
                //加载新的一条数据
                loadOneNews: function (messageOID) {
                    for (var i = 0; i < $scope.news.view.newsDetail.length; i++) {
                        if ($scope.news.view.newsDetail[i].messageOID === messageOID) {
                            $scope.news.view.newsDetail.splice(i, 1);
                            break;
                        }
                    }
                    if ($scope.news.data.page < $scope.news.data.lastPage) {
                        $scope.news.getNewsList(($scope.news.data.page + 1) * $scope.news.data.pageSize, 1);
                    } else {
                        if ($scope.news.view.newsDetail.length === 0) {
                            $scope.news.view.noData = true;
                        }
                    }
                },
                //刷新页面
                doRefresh: function () {
                    $scope.news.view.newsDetail = [];
                    $scope.news.data.page = 0;
                    $scope.news.getNewsList($scope.news.data.page, $scope.news.data.pageSize);
                    $scope.$broadcast('scroll.refreshComplete');
                },

                loadData: function () {
                    if ($scope.news.data.isFirstLoad) {
                        if ($scope.news.data.page < $scope.news.data.lastPage) {
                            $scope.news.data.page++;
                            $scope.news.getNewsList($scope.news.data.page, $scope.news.data.pageSize);
                        }
                    }
                }
            };
            //费用
            $scope.invoice = {
                //跳转到费用详情
                goInvoice: function (news) {
                    NotificationService.deleteOneMessage(news.messageOID)
                        .success(function () {
                            $state.go('app.expense_third_part', {expense: news.invoiceOID})
                        })
                },
                //删除费用消息
                deleteNews: function (messageOID, invoiceOID) {
                    InvoiceService.deleteOneInvoice(invoiceOID)
                        .success(function () {
                            $scope.news.loadOneNews(messageOID);
                            $ionicLoading.show({
                                template: $filter('translate')('news.deleted'),//已删除
                                duration: '500'
                            });
                        })
                }
            };

            //报销单和差旅
            $scope.expense = {
                //跳转到报销单详情
                goExpenseDetail: function (news) {
                    NotificationService.deleteOneMessage(news.messageOID)
                        .success(function () {
                            if (news.messageType === 'REIMBURSEMENT_APPROVAL') {
                                $state.go('app.approval_from_message_submitted', {taskId: news.referenceId});
                            } else if (news.messageType === 'REIMBURSEMENT_PASS') {
                                $state.go('app.approval_from_message_pass', {taskId: news.referenceId});
                            } else if (news.messageType === 'REIMBURSEMENT_REJECT') {
                                $state.go('app.approval_from_message_reject', {taskId: news.referenceId});
                            } else if (news.messageType === 'REIMBURSEMENT_REJECT') {
                                $state.go('app.approval_from_message_reject', {taskId: news.referenceId});
                            } else if (news.messageType === 'BPO_APPROVAL_PASS') {
                                $state.go('app.approval_from_message_bpo_pass', {taskId: news.referenceId});
                            } else if (news.messageType === 'BPO_APPROVAL_REJECT') {
                                $state.go('app.approval_from_message_bpo_reject', {taskId: news.referenceId});
                            } else if (news.messageType === 'FINANCE_LOAN') {
                                $state.go('app.approval_from_message_finance_loan', {taskId: news.referenceId});
                            }
                        })
                },
                //跳转到差旅详情
                goTravelDetail: function (news) {
                    //NotificationService.deleteOneMessage(news.messageOID)
                    //    .success(function () {
                    //        if (news.messageType === 'TRAVEL_PASS') {
                    //            $state.go('app.ordinary_travel', {
                    //                ordinaryId: news.referenceId,
                    //                ordinaryMsg: 'TravelPassFromMsg',
                    //                processInstanceId: null
                    //            });
                    //        } else if (news.messageType === 'TRAVEL_REJECT') {
                    //            $state.go('app.ordinary_travel', {
                    //                ordinaryId: news.referenceId,
                    //                ordinaryMsg: 'TravelRejectFromMsg',
                    //                processInstanceId: null
                    //            });
                    //        } else if (news.messageType === 'TRAVEL_APPROVAL') {
                    //            $state.go('app.ordinary_travel', {
                    //                ordinaryId: news.referenceId,
                    //                ordinaryMsg: 'TravelApprovalFromMsg',
                    //                processInstanceId: null
                    //            });
                    //        }
                    //    })
                    if (news.messageType === 'TRAVEL_PASS') {
                        $state.go('app.ordinary_travel', {
                            ordinaryId: news.referenceId,
                            ordinaryMsg: 'TravelPassFromMsg',
                            processInstanceId: null
                        });
                    } else if (news.messageType === 'TRAVEL_REJECT') {
                        $state.go('app.ordinary_travel', {
                            ordinaryId: news.referenceId,
                            ordinaryMsg: 'TravelRejectFromMsg',
                            processInstanceId: null
                        });
                    } else if (news.messageType === 'TRAVEL_APPROVAL') {
                        $state.go('app.ordinary_travel', {
                            ordinaryId: news.referenceId,
                            ordinaryMsg: 'TravelApprovalFromMsg',
                            processInstanceId: null
                        });
                    }
                },
                //跳到预报销详情
                goPreInvoiceDetail: function (news) {
                    NotificationService.deleteOneMessage(news.messageOID)
                        .success(function () {
                            if (news.messageType === 'CUSTOM_PROCESS_PASS') {
                                $state.go('app.preinvoice_detail_from_message_hasPass', {
                                    taskId: news.referenceId
                                });
                            } else if (news.messageType === 'CUSTOM_PROCESS_REJECT') {
                                $state.go('app.preinvoice_detail_from_message_reject', {
                                    taskId: news.referenceId
                                });
                            } else if (news.messageType === 'CUSTOM_PROCESS_APPROVAL') {
                                $state.go('app.preinvoice_detail_from_message_waitForApproval', {
                                    taskId: news.referenceId
                                });
                            }
                        })
                },
                goApproval: function(news) {
                    NotificationService.deleteOneMessage(news.messageOID)
                        .success(function() {
                            if(news.messageType === 'INVOICE_APPROVAL') {
                                $state.go('approval.list', {unApproved: true});
                            } else if (news.messageType === 'INVOICE_PASS') {
                                $state.go('app.tab.expense-list');
                            }
                        })
                },
                goRejectExpense: function(news) {
                    NotificationService.deleteOneMessage(news.messageOID)
                        .success(function() {
                            $state.go('app.expense_init', {expense: news.referenceId});
                        })
                }
            };


            $scope.$on("$ionicView.enter", function () {
                $scope.news.getNewsList($scope.news.data.page, $scope.news.data.pageSize);
            });

            $scope.$watch('news.data.total', function (oldValue, newValue, scope) {
                $rootScope.$broadcast('TOTALCHANGE', $scope.news.data.total);
                PushService.setBadge($scope.news.data.total);
            });


            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });


    }]);
