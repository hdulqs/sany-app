/**
 * Created by Administrator on 2016/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.erv_notification', {
            url: '/erv/notification',
            cache: false,
            views: {
                'page-content@app': {
                    'templateUrl': 'scripts/pages/expense_report_version/notification/notification.tpl.html',
                    'controller': 'com.handchina.huilianyi.ErvNewsListController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('notification');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })

    }])
    .controller('com.handchina.huilianyi.ErvNewsListController', ['$scope', '$ionicHistory', 'localStorageService',
        'NotificationService', 'InvoiceService', '$state', 'PushService', 'ParseLinks', '$rootScope', 'ExpenseService',
        '$ionicLoading', '$ionicPopup', 'PublicFunction', '$ionicModal', 'CompanyConfigurationService',
        'CurrencyCodeService', 'NetworkInformationService', 'LocalStorageKeys', 'ServiceBaseURL', 'ServiceHttpURL',
        '$filter', 'PageValueService','ReqHeaderService',
        function ($scope, $ionicHistory, localStorageService, NotificationService, InvoiceService, $state, PushService,
                  ParseLinks, $rootScope, ExpenseService, $ionicLoading, $ionicPopup, PublicFunction, $ionicModal,
                  CompanyConfigurationService, CurrencyCodeService, NetworkInformationService, LocalStorageKeys,
                  ServiceBaseURL, ServiceHttpURL, $filter, PageValueService,ReqHeaderService) {
            var reference = null;

            function inAppBrowserLoadStart(event) {
                if (event.url.indexOf('closeInAppBrowser.html?travelStatus=') !== -1 || (event.url.indexOf('closeInAppBrowser.html') !== -1 && event.url.indexOf('CallBack=') === -1)) {
                    reference.close();
                }
            }

            $scope.goSanyNew = goSanyNew;

            function inAppBrowserClose() {
                reference.removeEventListener('loadstart', inAppBrowserLoadStart);
                reference.removeEventListener('exit', inAppBrowserClose);
                reference = null;
            }

            $scope.view = {
                accessToken: null,
                messageDetail: null,
                networkError: false,
                networkErrorText: $filter('translate')('news.network')/*'哎呀,网络出错了!'*/,
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText: $filter('translate')('news.server')/*'服务器开小差了,'*/,
                systemErrorSubText: $filter('translate')('news.system')/*'技术小哥正在努力修复!'*/,
                systemErrorIcon: "img/error-icon/system-error.png",
                hasClickSSO: false,
                // 左滑删除
                // isCanDelete: function (news) {
                //     if(news.messageType === 'INVOICE' || news.messageType==='EXPENSE_APPLICATION_PASS' ||
                //         news.messageType === 'EXPENSE_APPLICATION_REJECT' || news.messageType === 'EXPENSE_REPORT_PASS'||
                //         news.messageType === 'EXPENSE_REPORT_REJECT' || news.messageType === 'TRAVEL_APPLICATION_PASS' ||
                //         news.messageType === 'TRAVEL_APPLICATION_REJECT' || news.messageType === 'EXPENSE_REPORT_AUDIT_PASS' ||
                //         news.messageType === 'EXPENSE_REPORT_AUDIT_REJECT' || news.messageType === 'EXPENSE_REPORT_INVOICE_AUDIT_REJECT'||
                //         news.messageType === 'EXPENSE_REPORT_INVOICE_REJECT' || news.messageType === 'OUT_EXPENSE_REPORT_APPROVAL' || news.messageType === 'OUT_EXPENSE_REPORT_NOT_H5'
                //         || news.messageType === 'OUT_APPLICATION_NOT_H5' || news.messageType === 'TRAVEL_BOOKER_APPLY' || news.messageType === 'TRAVEL_BOOKER_REFUND'
                //         || news.messageType === 'TRAVEL_BOOKER_ENDORSE' || news.messageType === 'TRAVEL_BOOKER_MODIFY' || news.messageType === 'TRAVEL_BOOKER_MODIFY'
                //         || news.messageType === 'TRAVEL_BOOK_PASS' || news.messageType === 'TRAVEL_BOOK_REJECT' || news.messageType === 'TRAVEL_BOOK_APPROVAL' || news.messageType === 'REIMBURSEMENT_PASS'
                //         || news.messageType === 'REIMBURSEMENT_REJECT' || news.messageType === 'REIMBURSEMENT_APPROVAL' || news.messageType === 'BPO_APPROVAL_PASS'
                //         || news.messageType === 'BPO_APPROVAL_REJECT' || news.messageType === 'BPO_RECEIVED' || news.messageType === 'FINANCE_LOAN'
                //         || news.messageType === 'TRAVEL_PASS' || news.messageType === 'TRAVEL_REJECT' || news.messageType === 'TRAVEL_APPROVAL' || news.messageType === 'JINGDONG_ORDER_APPLICATION_PASS'
                //         || news.messageType === 'JINGDONG_ORDER_APPLICATION_REJECT' || news.messageType === 'JINGDONG_ORDER_APPLICATION_APPROVAL' || news.messageType === 'JINGDONG_ORDER_SUBMIT_TIME_OUT_WARN'
                //         || news.messageType === 'JINGDONG_ORDER_APPROVAL_TIME_OUT_WARN' || news.messageType === 'JINGDONG_ORDER_PAY_TIME_OUT_WARN' || news.messageType === 'JINGDONG_ORDER_SUBMIT_TIME_OUT_CANCEL'
                //         || news.messageType === 'JINGDONG_ORDER_APPROVAL_TIME_OUT_CANCEL' || news.messageType === 'JINGDONG_ORDER_PAY_TIME_OUT_CANCEL' || news.messageType === 'LOAN_APPLICATION_PASS'
                //         || news.messageType === 'LOAN_APPLICATION_REJECT' || news.messageType === 'LOAN_APPLICATION_APPROVAL' || news.messageType === 'INVOICE_APPROVAL' || news.messageType === 'APPROVAL_CHAIN_NOTICE'){
                //         return true;
                //     } else {
                //         return false;
                //     }
                // },
                goBack: function () {
                    PageValueService.set("messageFlag", "");
                    $state.go('app.tab_erv.homepage');
                    /*if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.tab_erv.homepage');
                    }*/
                },
                // 京东
                isJingDong: function (news) {
                    if (news.messageType === 'JINGDONG_ORDER_APPLICATION_PASS' || news.messageType === 'JINGDONG_ORDER_APPLICATION_REJECT' || news.messageType === 'JINGDONG_ORDER_APPLICATION_APPROVAL' || news.messageType === 'JINGDONG_ORDER_SUBMIT_TIME_OUT_WARN'
                        || news.messageType === 'JINGDONG_ORDER_APPROVAL_TIME_OUT_WARN' || news.messageType === 'JINGDONG_ORDER_PAY_TIME_OUT_WARN' || news.messageType === 'JINGDONG_ORDER_SUBMIT_TIME_OUT_CANCEL'
                        || news.messageType === 'JINGDONG_ORDER_APPROVAL_TIME_OUT_CANCEL' || news.messageType === 'JINGDONG_ORDER_PAY_TIME_OUT_CANCEL') {
                        return true;
                    } else {
                        return false;
                    }
                },
                // 汉得版报销单
                isHandExpense: function (news) {
                    if (news.messageType === 'REIMBURSEMENT_PASS' || news.messageType === 'REIMBURSEMENT_REJECT' || news.messageType === 'REIMBURSEMENT_APPROVAL'
                        || news.messageType === 'BPO_APPROVAL_PASS' || news.messageType === 'BPO_APPROVAL_REJECT' || news.messageType === 'BPO_RECEIVED'
                        || news.messageType === 'FINANCE_LOAN' || news.messageType === 'TRAVEL_PASS' || news.messageType === 'TRAVEL_REJECT' || news.messageType === 'TRAVEL_APPROVAL' || news.messageType === 'EXPENSE_PRE_CHECK_PASS' || news.messageType === 'EXPENSE_PRE_CHECK_REJECT') {
                        return true;
                    } else {
                        return false;
                    }
                },
                // 订票申请
                isBooker: function (news) {
                    if (news.messageType === 'TRAVEL_BOOKER_MODIFY' || news.messageType === 'TRAVEL_BOOK_PASS' || news.messageType === 'TRAVEL_BOOK_REJECT' ||
                        news.messageType === 'TRAVEL_BOOK_APPROVAL') {
                        return true;
                    } else {
                        return false;
                    }
                }
            };

            //跳转到费用详情
            function goSanyNew(news) {
                if (!news.read) {
                    $scope.news.remarkRead(news.messageOID);
                    news.read = true;
                }
                // console.log("news====" + angular.toJson(news));
                var data = news.referenceId;
                var hecParams = data.split(";");
                var goFlag = hecParams[0];//跳转标志：1/跳转  0/不跳转
                if (goFlag == '1') {
                    var type = hecParams[1];//类型：approval/审批中心  EXP_REPORT/报销单模块  EXP_REQUISITION/申请单模块  PAYMENT_REQUISITION/借款单  ACP_REQUISITION/付款单
                    if (type == 'approval') {
                        var params = {
                            'messageFlag':'Y',
                            'status':'waitApproval',
                            'type':'approval'
                        };
                        var approvalItem = {
                            "instance_param": hecParams[4],	//header_id
                            "record_id": hecParams[5],			//用来获取同意操作的action_id
                            "instance_id": hecParams[6]		//用来获取审批记录
                        }
                        var docType = hecParams[3];//待审批单据类型
                        if (docType == 'EXP_REQUISITION') {
                            params.approvalReq = approvalItem;
                            PageValueService.set("appCenterReq", params);
                            $state.go('app.approvalReq');
                        } else if (docType == 'EXP_REPORT') {
                            params.approvalReport = approvalItem;
                            PageValueService.set("appCenterReport", params);
                            $state.go('app.approvalReport');
                        } else if (docType == 'PAYMENT_REQUISITION') {
                            params.approvalLoan = approvalItem;
                            PageValueService.set("appCenterLoan", params);
                            $state.go('app.approvalLoan');
                        } else if (docType == 'ACP_REQUISITION') {
                            params.approvalPayment = approvalItem;
                            PageValueService.set("appCenterPayment", params);
                            $state.go('app.approvalPayment');
                        }
                    }else{
                        var headerId = hecParams[3];
                        NotificationService.getDocStatus(headerId ,type).then(function (res) {
                            if (res.data.success && res.data.result.pageCount>0 && res.data.result.record[0].status) {
                                //GENERATE、SUBMITTED、REJECTED、TAKEN_BACK、APPROVED
                                var docStatus = res.data.result.record[0].status;
                                console.log(type+"单据类型："+docStatus+"  "+res.data.result.pageCount);
                                //单据新增状态
                                if(docStatus=='GENERATE'||docStatus=='TAKEN_BACK'||docStatus=='REJECTED'){
                                    PageValueService.set("messageFlag", "Y");
                                    if(type=="EXP_REQUISITION"){//申请单
                                        var reqTypeCode= hecParams[4];
                                        if(reqTypeCode==="1010"||reqTypeCode==="1015"){ //差旅申请
                                            $state.go('app.travelReqHeader', {reqHeaderId: hecParams[3]});
                                        }else{
                                            $state.go('app.dailyReqHeader', {reqHeaderId: hecParams[3]});
                                        }
                                    }else if(type=='PAYMENT_REQUISITION'){//借款单
                                        $state.go('app.loanReqHeader', {loanReqHeaderId: hecParams[3]});
                                    }else if(type=='EXP_REPORT'){//报销单
                                        $state.go('app.reportHeader', {headerId: hecParams[3]});
                                    }
                                }else{
                                    var params = {'messageFlag': 'Y'};
                                    if(docStatus=='SUBMITTED'){//单据提交待审批状态
                                        params.status='waitApproval';
                                        params.passFlag='N';
                                    }else if(docStatus=='APPROVED'){//审批通过状态
                                        params.status='hasApproval';
                                        params.passFlag='Y';
                                    }
                                    if(type=="EXP_REQUISITION"){//申请单
                                        params.type = 'req'
                                        params.approvalReq={instance_param: hecParams[3]}
                                        PageValueService.set("appCenterReq", params);
                                        $state.go('app.approvalReq');
                                    }else if(type=='PAYMENT_REQUISITION'){//借款单
                                        params.type = 'req'
                                        params.approvalLoan={instance_param: hecParams[3]}
                                        PageValueService.set("appCenterLoan", params);
                                        $state.go('app.approvalLoan');
                                    }else if(type=='EXP_REPORT'){//报销单
                                        params.type = 'report'
                                        params.approvalReport={instance_param: hecParams[3]}
                                        PageValueService.set("appCenterReport", params);
                                        $state.go('app.approvalReport');
                                    }
                                }
                            }else {
                                PublicFunction.showToast($filter('translate')('error.get.document.status.faild'));//获取单据状态失败!
                            }
                        }, function (error) {
                            PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                        });
                    }
                }
            }

            $scope.news = {
                view: {
                    newsDetail: [],
                    noData: false
                },
                data: {
                    page: 0,
                    pageSize: 15,
                    lastPage: 0,
                    comment: '',
                    dataLength: 0,
                    dataCount: 0,
                    exchange: [],
                    isLoadComplete: false,
                    isFirstLoad: false,
                    total: 0
                },
                remarkRead: function (messageOID) {
                    NotificationService.remarkRead(messageOID)
                        .success(function () {
                            $scope.news.data.total--;
                        })
                },
                cleanMessage: function () {
                    if (!$scope.news.view.newsDetail || $scope.news.view.newsDetail.length === 0) {
                        $ionicLoading.show({
                            template: $filter('translate')('news.No.message')/*'暂无消息'*/,
                            duration: '1000'
                        });
                        return;
                    }
                    $ionicPopup.confirm({
                        title: $filter('translate')('news.Sure.to.empty')/* '确定清空'*/,
                        template: '<p style="text-align: center">' + $filter('translate')('news.ImmediatelyClear') + '</p>',//是否立刻清空？
                        cancelText: $filter('translate')('news.cancel')/*'取消'*/,
                        cancelType: 'button-calm',
                        okText: $filter('translate')('news.determine')/*'确定'*/
                    }).then(function (result) {
                        if (result) {
                            $scope.showLoading();
                            //在MainAppController中，已经定义了该函数，可以重用
                            NotificationService.cleanMessage()
                                .success(function () {
                                    $ionicLoading.hide();
                                    PushService.clearNotification();
                                    $scope.news.doRefresh();
                                })
                                .error(function (error, status) {
                                    $ionicLoading.hide();
                                    $ionicLoading.show({
                                        template: $filter('translate')('news.Network.failure.please.try.again.later')/*'网络故障,请稍后再试'*/,
                                        duration: '1000'
                                    });
                                });
                        }
                    });

                },
                //获取消息列表
                getNewsList: function (page, pageSize, refreshData) {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.news.data.page = page;
                    NotificationService.getMessageList(page, pageSize)
                        .success(function (data, status, headers) {
                            $ionicLoading.hide();
                            if (page === 0) {
                                $scope.news.view.newsDetail = [];
                                NotificationService.countUnReadMessage()
                                    .success(function (data) {
                                        $scope.news.data.total = data;
                                        localStorageService.set('hasMessageTips', data.length > 0);
                                    });
                            }
                            $scope.news.data.lastPage = ParseLinks.parse(headers('link')).last;
                            if (data.length > 0) {
                                $scope.news.view.noData = false;
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].messageType === 'TRAVEL_BOOKER_APPLY' || data[i].messageType === 'TRAVEL_BOOKER_REFUND' || data[i].messageType === 'TRAVEL_BOOKER_ENDORSE' ||
                                        data[i].messageType === 'TRAVEL_BOOKER_MODIFY' || data[i].messageType === 'TRAVEL_BOOK_PASS' || data[i].messageType === 'TRAVEL_BOOK_REJECT' || data[i].messageType === 'TRAVEL_BOOK_APPROVAL'
                                        || data[i].messageType === 'EXPENSE_REPORT_PASS' || data[i].messageType === 'LOAN_APPLICATION_PASS' || data[i].messageType === 'LOAN_APPLICATION_REJECT' || data[i].messageType === 'LOAN_APPLICATION_APPROVAL'
                                        || data[i].messageType === 'JINGDONG_ORDER_APPLICATION_PASS' || data[i].messageType === 'JINGDONG_ORDER_APPLICATION_REJECT' || data[i].messageType === 'JINGDONG_ORDER_APPLICATION_APPROVAL' || data[i].messageType === 'JINGDONG_ORDER_SUBMIT_TIME_OUT_WARN'
                                        || data[i].messageType === 'JINGDONG_ORDER_APPROVAL_TIME_OUT_WARN' || data[i].messageType === 'JINGDONG_ORDER_PAY_TIME_OUT_WARN' || data[i].messageType === 'JINGDONG_ORDER_SUBMIT_TIME_OUT_CANCEL' || data[i].messageType === 'JINGDONG_ORDER_APPROVAL_TIME_OUT_CANCEL'
                                        || data[i].messageType === 'JINGDONG_ORDER_PAY_TIME_OUT_CANCEL' || data[i].messageType === 'APPROVAL_CHAIN_NOTICE' || data[i].messageType === 'REPAYMENT_REJECT' || data[i].messageType === 'REPAYMENT_PASS' || data[i].messageType === 'REPAYMENT_PROCESS'
                                        || data[i].messageType === 'EXPENSE_REPORT_USER_AMOUNT_MESSAGE' || data[i].messageType === 'EXPENSE_REPORT_AUDIT_USER_AMOUNT_MESSAGE') {
                                        if (data[i].content !== null && data[i].content !== '') {
                                            data[i].dataSource = JSON.parse(data[i].content);
                                            $scope.news.view.newsDetail.push(data[i]);
                                        } else {
                                            $scope.news.view.newsDetail.push(data[i]);
                                        }
                                    } else {
                                        $scope.news.view.newsDetail.push(data[i]);
                                    }
                                }
                                // var getDetailNum = 0;
                                // $scope.news.data.dataLength = data.length;
                                // $scope.news.data.dataCount = data.length;
                                // for (var i = 0; i < $scope.news.data.dataLength; i++) {
                                //     getDetailNum++;
                                //     $scope.news.getMessageDetail(i, data[i].messageType, data[i].referenceId, data[i].messageOID, data[i]);
                                // }
                                // if (getDetailNum >= $scope.news.data.dataLength) {
                                //     $scope.$broadcast('scroll.infiniteScrollComplete');
                                // }
                            } else {
                                if (page === 0) {
                                    $scope.news.view.noData = true;
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
                                data.read = news.read;
                                $scope.news.doTask(index, messageType, referenceId, messageOID, data);
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('news.error'));//出错了
                            })
                    } else if (messageType === "REIMBURSEMENT_APPROVAL" || messageType === "REIMBURSEMENT_PASS" || messageType === "REIMBURSEMENT_REJECT" || messageType === "FINANCE_LOAN" || messageType === "BPO_RECEIVED" || messageType === "BPO_APPROVAL_PASS" || messageType === "BPO_APPROVAL_REJECT") {
                        NotificationService.getMessageAccountDetail(referenceId)
                            .success(function (data) {
                                data.read = news.read;
                                $scope.news.doTask(index, messageType, referenceId, messageOID, data);
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('news.error'));//出错了
                            })
                    } else if (messageType === "TRAVEL_APPROVAL" || messageType === "TRAVEL_PASS" || messageType === "TRAVEL_REJECT") {
                        NotificationService.getMessageTravelDetail(referenceId)
                            .success(function (data) {
                                data.read = news.read;
                                $scope.news.doTask(index, messageType, referenceId, messageOID, data);
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('news.error'));//出错了
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
                                                dataDetail.read = news.read;
                                                $scope.news.doTask(index, messageType, referenceId, messageOID, dataDetail);
                                            });
                                        break;
                                    }
                                }
                            })
                    } else if (messageType === 'INVOICE_REJECT') {
                        //费用驳回
                        ExpenseService.getInvoice(referenceId)
                            .success(function (data) {
                                data.read = news.read;
                                $scope.news.doTask(index, messageType, referenceId, messageOID, data);
                            });
                    } else if (messageType === 'TRAVEL_BOOKER_APPLY' || messageType === 'TRAVEL_BOOKER_REFUND' || messageType === 'TRAVEL_BOOKER_ENDORSE' ||
                        messageType === 'TRAVEL_BOOKER_MODIFY' || messageType === 'TRAVEL_BOOK_PASS' || messageType === 'TRAVEL_BOOK_REJECT' || messageType === 'TRAVEL_BOOK_APPROVAL') {
                        if (news.content !== null && news.content !== '') {
                            news.dataSource = eval('(' + news.content + ')');
                            $scope.news.doTask(index, messageType, referenceId, messageOID, news);
                        } else {
                            $scope.news.doTask(index, messageType, referenceId, messageOID, news);
                        }
                    } else {
                        $scope.news.doTask(index, messageType, referenceId, messageOID, news);
                    }
                    //else if (messageType === '') {
                    //
                    //}
                },
                //加载新的一条数据
                loadOneNews: function (messageOID) {
                    // for (var i = 0; i < $scope.news.view.newsDetail.length; i++) {
                    //     if ($scope.news.view.newsDetail[i].messageOID === messageOID) {
                    //         $scope.news.view.newsDetail.splice(i, 1);
                    //         break;
                    //     }
                    // }
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
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    $scope.news.view.newsDetail = [];
                    $scope.news.data.page = 0;
                    $scope.news.getNewsList($scope.news.data.page, $scope.news.data.pageSize, true);
                    $scope.$broadcast('scroll.refreshComplete');
                },
                loadData: function () {
                    // if ($scope.news.data.isFirstLoad) {
                    if ($scope.news.data.page < $scope.news.data.lastPage) {
                        $scope.news.data.page++;
                        $scope.news.getNewsList($scope.news.data.page, $scope.news.data.pageSize);
                    }
                    // }
                }
            };
            //费用
            $scope.invoice = {
                //跳转到费用详情
                goInvoice: function (news) {
                    if (!news.read) {
                        $scope.news.remarkRead(news.messageOID);
                    }
                    $state.go('app.expense_third_part',
                        {
                            expense: news.referenceId,
                            message: "app.erv_notification"
                        });
                    /*NotificationService.deleteOneMessage(news.messageOID)
                     .success(function () {

                     })*/
                },
                //删除消息 若是费用消息  可以直接删除费用
                deleteNews: function (news) {
                    //在MainAppController中，已经定义了该函数，可以重用
                    $scope.news.view.newsDetail.splice($scope.news.view.newsDetail.indexOf(news), 1);
                    $scope.news.loadOneNews();
                    NotificationService.deleteOneMessage(news.messageOID)
                        .success(function () {
                            if (news.messageType === 'INVOICE_APPROVAL') {
                                $state.go('app.erv_approval_list');
                            } else if (news.messageType === 'INVOICE_PASS') {
                                $state.go('app.tab.expense-list');
                            } else if (news.messageKey === 'SANY_HEC') {
                                $ionicLoading.show({
                                    template: $filter('translate')('news.delete.success')/*'已删除'*/,
                                    duration: '500'
                                });
                            }
                        })
                    if (news.messageType === 'INVOICE') {
                        InvoiceService.deleteOneInvoice(news.referenceId)
                            .success(function () {
                                $ionicLoading.show({
                                    template: $filter('translate')('news.deleted')/*'已删除'*/,
                                    duration: '500'
                                });
                            })
                            .error(function (e) {
                                console.log("error when execute deleteOneInvoice" + e);
                            });
                    }
                }
            };

            //报销单和差旅
            $scope.expense = {
                //跳转到报销单详情
                goExpenseDetail: function (news) {
                    if (!news.read) {
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (news.messageType === 'EXPENSE_REPORT_APPROVAL') {
                        $state.go('app.erv_approval_expense_report_list', {expenseReportOID: news.referenceId});
                    } else if (news.messageType === 'EXPENSE_REPORT_PASS') {
                        $state.go('app.tab_erv_expense_detail_passed', {expenseReportOID: news.referenceId});
                    } else if (news.messageType === 'EXPENSE_REPORT_REJECT') {
                        $state.go('app.tab_erv_expense_detail_audit_passed', {expenseReportOID: news.referenceId});
                    } else if (news.messageType === 'EXPENSE_REPORT_AUDIT_PASS') {
                        $state.go('app.tab_erv_expense_detail_passed', {expenseReportOID: news.referenceId});
                    } else if (news.messageType === 'EXPENSE_REPORT_AUDIT_REJECT' || news.messageType === 'EXPENSE_REPORT_INVOICE_RECEIPT_AMOUNT_CHANGE') {
                        $state.go('app.tab_erv_expense_detail_audit_passed', {expenseReportOID: news.referenceId});
                    } else if (news.messageType === 'EXPENSE_REPORT_INVOICE_REJECT' || news.messageType === 'EXPENSE_REPORT_INVOICE_AUDIT_REJECT') {
                        $state.go('app.account_book');
                    } else if (news.messageType === 'EXPENSE_REPORT_USER_AMOUNT_MESSAGE') {
                        //瑞好 报销单金额消息提醒(报销人)
                        $state.go('app.tab_erv_expense_detail_submit', {expenseReportOID: news.referenceId});
                    } else if (news.messageType === 'EXPENSE_REPORT_AUDIT_USER_AMOUNT_MESSAGE') {
                        //瑞好 报销单金额消息提醒(审批人)
                        $state.go('app.erv_approval_expense_report_list', {expenseReportOID: news.referenceId});
                    }
                    //现在要自己删除消息
                    /* NotificationService.deleteOneMessage(news.messageOID)
                     .success(function () {
                     if (news.messageType === 'EXPENSE_REPORT_APPROVAL') {
                     $state.go('app.erv_approval_expense_report_list', {expenseReportOID: news.referenceId});
                     } else if (news.messageType === 'EXPENSE_REPORT_PASS') {
                     $state.go('app.tab_erv_expense_detail_passed', {expenseReportOID: news.referenceId});
                     } else if (news.messageType === 'EXPENSE_REPORT_REJECT') {
                     $state.go('app.tab_erv_expense_detail_audit_passed', {expenseReportOID: news.referenceId});
                     }
                     })*/
                },
                // flyback
                goFlyback: function (news) {
                    if (!news.read) {
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (news.referenceId && $scope.view.accessToken) {
                        var url = ServiceHttpURL + '/hand?action=detail&applicationOID=' + news.referenceId + '&access_token=' + $scope.view.accessToken;
                        reference = cordova.InAppBrowser.open(url, '_blank', 'location=no,toolbar=no');
                        reference.addEventListener('loadstart', inAppBrowserLoadStart);
                        reference.addEventListener('exit', inAppBrowserClose);
                    }
                },
                //跳转到差旅详情
                goTravelDetail: function (news) {
                    if (!news.read) {
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (news.messageType === 'TRAVEL_APPLICATION_PASS') {
                        if (JSON.parse(news.content)) {
                            news.dataSource = JSON.parse(news.content)
                            if (news.dataSource.formType && news.dataSource.formType === 2001) {
                                $state.go('app.custom_application_has_pass', {
                                    applicationOID: news.referenceId,
                                    formType: news.dataSource.formType
                                });
                            } else {
                                if (news.title.indexOf($filter('translate')('news.for.you')) > 0) {//为您
                                    $state.go('app.erv_travel_detail', {
                                        applicationOID: news.referenceId,
                                        ordinaryMsg: 'TravelPassFromMsg',
                                        processInstanceId: null
                                    });
                                } else {
                                    // app.erv_travel_has_pass
                                    $state.go('app.erv_travel_has_pass', {
                                        applicationOID: news.referenceId,
                                        ordinaryMsg: 'TravelPassFromMsg',
                                        processInstanceId: null
                                    });
                                }
                            }
                        } else {
                            if (news.title.indexOf($filter('translate')('news.for.you')) > 0) {//为您
                                $state.go('app.erv_travel_detail', {
                                    applicationOID: news.referenceId,
                                    ordinaryMsg: 'TravelPassFromMsg',
                                    processInstanceId: null
                                });
                            } else {
                                // app.erv_travel_has_pass
                                $state.go('app.erv_travel_has_pass', {
                                    applicationOID: news.referenceId,
                                    ordinaryMsg: 'TravelPassFromMsg',
                                    processInstanceId: null
                                });
                            }
                        }

                    } else if (news.messageType === 'TRAVEL_APPLICATION_REJECT') {
                        if (JSON.parse(news.content)) {
                            news.dataSource = JSON.parse(news.content)
                            if (news.dataSource.formType && news.dataSource.formType === 2001) {
                                $state.go('app.custom_application_detail', {
                                    applicationOID: news.referenceId,
                                    formType: news.dataSource.formType
                                });
                            } else {
                                $state.go('app.erv_travel_detail', {
                                    applicationOID: news.referenceId,
                                    ordinaryMsg: 'TravelRejectFromMsg',
                                    processInstanceId: null
                                });
                            }
                        } else {
                            $state.go('app.erv_travel_detail', {
                                applicationOID: news.referenceId,
                                ordinaryMsg: 'TravelRejectFromMsg',
                                processInstanceId: null
                            });
                        }

                    } else if (news.messageType === 'TRAVEL_APPLICATION_APPROVAL') {
                        $state.go('app.erv_travel_approval', {
                            applicationOID: news.referenceId,
                            ordinaryMsg: 'TravelApprovalFromMsg',
                            processInstanceId: null
                        });
                    }
                    /*NotificationService.deleteOneMessage(news.messageOID)
                     .success(function () {
                     if (news.messageType === 'TRAVEL_APPLICATION_PASS') {
                     $state.go('app.erv_travel_has_pass', {
                     applicationOID: news.referenceId,
                     ordinaryMsg: 'TravelPassFromMsg',
                     processInstanceId: null
                     });
                     } else if (news.messageType === 'TRAVEL_APPLICATION_REJECT') {
                     $state.go('app.erv_create_travel_next', {
                     applicationOID: news.referenceId,
                     ordinaryMsg: 'TravelRejectFromMsg',
                     processInstanceId: null
                     });
                     } else if (news.messageType === 'TRAVEL_APPLICATION_APPROVAL') {
                     $state.go('app.erv_travel_approval', {
                     applicationOID: news.referenceId,
                     ordinaryMsg: 'TravelApprovalFromMsg',
                     processInstanceId: null
                     });
                     }
                     })*/

                },
                //跳到预报销详情
                goPreInvoiceDetail: function (news) {
                    if (!news.read) {
                        $scope.news.remarkRead(news.messageOID);
                    }
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
                    /*NotificationService.deleteOneMessage(news.messageOID)
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
                     })*/
                },
                //跳到费用申请详情
                goExpenseApplicationDetail: function (news) {
                    if (!news.read) {
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (news.messageType === 'EXPENSE_APPLICATION_PASS') {
                        if (JSON.parse(news.content)) {
                            news.dataSource = JSON.parse(news.content)
                            if (news.dataSource.formType && news.dataSource.formType === 2002) {
                                $state.go('app.custom_application_has_pass', {
                                    applicationOID: news.referenceId,
                                    formType: news.dataSource.formType
                                });
                            } else {
                                if (news.title.indexOf($filter('translate')('news.for.you')) > 0) {//为您
                                    $state.go('app.erv_invoice_apply_approve_detail', {
                                        applicationOID: news.referenceId
                                    });
                                } else {
                                    //app.erv_invoice_apply_detail_next
                                    $state.go('app.erv_invoice_apply_detail_next', {
                                        applicationOID: news.referenceId
                                    });
                                }
                            }
                        }


                    } else if (news.messageType === 'EXPENSE_APPLICATION_REJECT') {
                        if (JSON.parse(news.content)) {
                            news.dataSource = JSON.parse(news.content)
                            if (news.dataSource.formType && news.dataSource.formType === 2002) {
                                $state.go('app.custom_application_detail', {
                                    applicationOID: news.referenceId,
                                    formType: news.dataSource.formType
                                });
                            }
                        } else {
                            $state.go('app.erv_invoice_apply_approve_detail', {
                                applicationOID: news.referenceId
                            });
                        }
                    } else if (news.messageType === 'EXPENSE_APPLICATION_APPROVAL') {
                        $state.go('app.erv_invoice_apply_detail_approval', {
                            applicationOID: news.referenceId
                        });
                    }
                    /*NotificationService.deleteOneMessage(news.messageOID)
                     .success(function () {
                     if (news.messageType === 'EXPENSE_APPLICATION_PASS') {
                     $state.go('app.erv_invoice_apply_detail_next', {
                     applicationOID: news.referenceId
                     });
                     } else if (news.messageType === 'EXPENSE_APPLICATION_REJECT') {
                     $state.go('app.erv_invoice_apply_detail_reject', {
                     applicationOID: news.referenceId
                     });
                     } else if (news.messageType === 'EXPENSE_APPLICATION_APPROVAL') {
                     $state.go('app.erv_invoice_apply_detail_approval', {
                     applicationOID: news.referenceId
                     });
                     }
                     })*/
                },
                //费用待审批
                goApproval: function (news) {
                    if (!news.read) {
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (news.messageType === 'INVOICE_APPROVAL') {
                        $state.go('app.erv_approval_list');
                    } else if (news.messageType === 'INVOICE_PASS') {
                        $state.go('app.tab.expense-list');
                    }
                    /*NotificationService.deleteOneMessage(news.messageOID)
                     .success(function () {
                     if (news.messageType === 'INVOICE_APPROVAL') {
                     $state.go('approval.list', {unApproved: true});
                     } else if (news.messageType === 'INVOICE_PASS') {
                     $state.go('app.tab.expense-list');
                     }
                     })*/
                },
                //费用被驳回
                goRejectExpense: function (news) {
                    if (!news.read) {
                        $scope.news.remarkRead(news.messageOID);
                    }
                    $state.go('app.expense_init', {expense: news.referenceId});
                    /*NotificationService.deleteOneMessage(news.messageOID)
                     .success(function () {
                     $state.go('app.expense_init', {expense: news.referenceId});
                     })*/
                },
                //美克消息类型
                goSSOApproval: function (news, index) {
                    if (!news.read) {
                        $scope.news.view.newsDetail[index].read = true;
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (!$scope.view.hasClickSSO) {
                        $scope.view.hasClickSSO = true;
                        NotificationService.getMessagetSSOUrl(news.messageOID)
                            .success(function (data) {
                                if (!news.read) {
                                    $scope.news.remarkRead(news.messageOID);
                                }
                                reference = cordova.InAppBrowser.open(encodeURI(data.url), '_blank', 'location=no,toolbar=no');
                                reference.addEventListener('loadstart', inAppBrowserLoadStart);
                                reference.addEventListener('exit', inAppBrowserClose);
                            })
                            .error(function () {
                                // PublicFunction.showToast($filter('translate')('news.error'));//出错了
                            })
                            .finally(function () {
                                $scope.view.hasClickSSO = false;
                            })
                    }
                },
                //不跳转，只标为只读
                hasRead: function (news, index) {
                    if (!news.read) {
                        $scope.news.view.newsDetail[index].read = true;
                        $scope.news.remarkRead(news.messageOID);
                    }
                },
                //查看选人订票消息
                showBookDetail: function (news, index) {
                    if (!news.read) {
                        $scope.news.view.newsDetail[index].read = true;
                        $scope.news.remarkRead(news.messageOID);
                    }
                    $scope.view.messageDetail = news;
                    $scope.bookDetail.show();
                },
                getBookDetail: function (news, index) {
                    if (!news.read) {
                        $scope.news.view.newsDetail[index].read = true;
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (news.dataSource.applicationOID) {
                        $state.go('app.custom_application_has_pass', {
                            applicationOID: news.dataSource.applicationOID,
                            formType: 2003
                        });
                    }
                },
                //借款消息
                getLoadDetail: function (news, index) {
                    if (!news.read) {
                        $scope.news.view.newsDetail[index].read = true;
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (news.referenceId) {
                        if (news.messageType === 'LOAN_APPLICATION_PASS') {
                            $state.go('app.custom_application_has_pass', {
                                applicationOID: news.referenceId,
                                formType: 2005
                            });
                        } else {
                            $state.go('app.custom_application_notification_readonly', {
                                applicationOID: news.referenceId,
                                formType: 2005
                            });
                        }
                    }
                },
                //还款消息
                getRepaymentDetail: function (news, index) {
                    if (!news.read) {
                        $scope.news.view.newsDetail[index].read = true;
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (news.referenceId && news.dataSource && news.dataSource.applicationOID) {
                        $state.go('app.didi_refund_detail_readonly', {
                            applicationOID: news.dataSource.applicationOID,
                            formType: 2005,
                            repaymentOid: news.referenceId
                        })
                        // if(news.messageType === 'REPAYMENT_REJECT'){
                        //     $state.go('app.custom_application_has_pass', {applicationOID: news.referenceId, formType: 2005});
                        // } else if(news.messageType === 'REPAYMENT_PASS'){
                        //     $state.go('app.custom_application_notification_readonly', {applicationOID: news.referenceId, formType: 2005});
                        // }
                    }
                },
                //京东消息
                getJingDongDetail: function (news, index) {
                    if (!news.read) {
                        $scope.news.view.newsDetail[index].read = true;
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (news.referenceId) {
                        $state.go('app.jingdong_application_detail', {applicationOID: news.referenceId});
                    }
                },
                //汉得版的消息类型
                getHandExpenseDetail: function (news, index) {
                    if (!news.read) {
                        $scope.news.view.newsDetail[index].read = true;
                        $scope.news.remarkRead(news.messageOID);
                    }
                },
                //知会消息
                goChainNotice: function (news, index) {
                    if (!news.read) {
                        $scope.news.view.newsDetail[index].read = true;
                        $scope.news.remarkRead(news.messageOID);
                    }
                    if (news.dataSource && news.dataSource.formType) {
                        if (news.dataSource.formType === 2004) {
                            //京东消息
                            $state.go('app.jingdong_application_detail', {applicationOID: news.referenceId});
                        } else if (news.dataSource.formType === 3001 || news.dataSource.formType === 3002 || news.dataSource.formType === 3003) {
                            //报销单消息
                            $state.go('app.tab_erv_expense_detail_passed', {expenseReportOID: news.referenceId});
                        } else if (news.dataSource.formType === 2001 || news.dataSource.formType === 2002 || news.dataSource.formType === 2003 || news.dataSource.formType === 2005) {
                            //申请单
                            $state.go('app.custom_application_has_pass', {
                                applicationOID: news.referenceId,
                                formType: news.dataSource.formType
                            });
                        }
                    }
                }
            };

            //废弃
            $scope.getCode = function (currencyCode) {
                if (currencyCode) {
                    return CurrencyCodeService.getCurrencySymbol(currencyCode);
                } else {
                    return $scope.code;
                }
            }

            //查看订票消息
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/notification/book.ticket.detail.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.bookDetail = modal;
            });


            $scope.$on("$ionicView.enter", function () {
                var token = localStorageService.get(LocalStorageKeys.token);
                $scope.view.accessToken = token.access_token;
                $scope.showLoading();
                //在MainAppController中，已经定义了该函数，可以重用
                $scope.news.getNewsList($scope.news.data.page, $scope.news.data.pageSize);
                CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                    $scope.view.configuration = data.configuration.integrations;
                    $scope.code = CurrencyCodeService.getCurrencySymbol(data.currencyCode);
                });
            });

            $scope.$watch('news.data.total', function (oldValue, newValue, scope) {
                if (newValue !== oldValue) {
                    $rootScope.$broadcast('NOTIFICATIONTOTAL', $scope.news.data.total);
                    PushService.setBadge($scope.news.data.total);
                }
            });


            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });


        }]);
