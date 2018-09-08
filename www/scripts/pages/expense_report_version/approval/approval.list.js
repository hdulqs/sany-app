/**
 * Created by Administrator on 2016/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.erv_approval_list', {
            url: '/erv/approval/list',
            cache: true,
            views: {
                'page-content@app': {
                    'templateUrl': 'scripts/pages/expense_report_version/approval/approval.list.tpl.html',
                    'controller': 'com.handchina.huilianyi.ErvApprovalListController'
                }
            },
            resolve:{
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    //$translatePartialLoader.addPart('homepage');
                    $translatePartialLoader.addPart('approval');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.ErvApprovalListController', ['$scope', 'ApprovalERVService', 'ParseLinks',
        '$state', '$ionicPopup', '$ionicLoading', '$ionicScrollDelegate', 'NotificationService', '$rootScope',
        'PushService', '$timeout', 'FunctionProfileService', 'ApprovalPopupService', 'CompanyConfigurationService',
        'CurrencyCodeService', 'NetworkInformationService', 'localStorageService', 'LocalStorageKeys', 'ServiceBaseURL',
        'ServiceHttpURL', '$filter', '$sessionStorage', '$ionicModal', '$q', 'PublicFunction',
        function ($scope, ApprovalERVService, ParseLinks, $state, $ionicPopup, $ionicLoading, $ionicScrollDelegate,
                  NotificationService, $rootScope, PushService, $timeout, FunctionProfileService, ApprovalPopupService,
                  CompanyConfigurationService, CurrencyCodeService, NetworkInformationService, localStorageService,
                  LocalStorageKeys, ServiceBaseURL, ServiceHttpURL, $filter, $sessionStorage, $ionicModal, $q, PublicFunction) {
            var opinionPopup = null;
            var ref = null;
            function inAppBrowserLoadStart(event) {
                if (event.url.indexOf('closeInAppBrowser.html?travelStatus=') !== -1 || (event.url.indexOf('closeInAppBrowser.html') !== -1 && event.url.indexOf('CallBack=') === -1)) {
                    ref.close();
                    $scope.view.loadMore(0);
                }
            }
            function inAppBrowserClose() {
                ref.removeEventListener('loadstart', inAppBrowserLoadStart);
                ref.removeEventListener('exit', inAppBrowserClose);
                ref = null;
            }
            $scope.view = {
                disable: false,
                accessToken: null,
                networkError: false,
                networkErrorText: $filter('translate')('error.network'),
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText: $filter('translate')('error.server'),
                systemErrorSubText: $filter('translate')('error.system'),
                systemErrorIcon: "img/error-icon/system-error.png",
                head: $filter('translate')('approval.approve'), //审批
                subhead:$filter('translate')('approval.already'), //已审批
                status: 'waitApproval', //审批状态(已审批hasApproval, 待审批 waitApproval)
                isShowType: true,
                pageable: {
                    page: 0,
                    size: 10
                },
                dataNum: {
                    lastPage: 0,
                    total: 0
                },
                nothing: false,
                apporvalList: [],
                rejectReason: null,
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                refresh: function () {
                    $scope.view.nothing = false;
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.view.apporvalList = [];
                    $scope.view.loadMore(0, true);
                    $scope.$broadcast('scroll.refreshComplete');
                },
                hasApprovaled: function () {
                    $state.go('app.erv_approval_history_list');
                },
                loadMore: function (page, refreshData) {
                    $scope.view.networkError = false;
                    $scope.view.systemError = false;
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    $scope.view.nothing = false;
                    $scope.view.pageable.page = page;
                    if ($scope.view.pageable.page === 0) {
                        $ionicScrollDelegate.scrollTop();
                        $scope.view.apporvalList = [];
                        $scope.view.dataNum.lastPage = 0;
                    }
                    if ($scope.view.status === 'waitApproval') {
                        ApprovalERVService.getApprovalList(page, $scope.view.pageable.size)
                            .success(function (data, status, headers) {
                                ApprovalPopupService.setCount(); //每审批一次，就重新像localstorage中写入一次待审批数量，用此方法代替监听pause和杀死进程时，记录待审批数量，这样更精确

                                if (data.length > 0) {
                                    for (var i = 0; i < data.length; i++) {
                                        $scope.view.apporvalList.push(data[i]);
                                    }
                                }
                                if (page === 0) {
                                    $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                                    $scope.view.dataNum.total = headers('x-total-count');
                                    if (data.length === 0) {
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
                                $timeout(function () {
                                    $ionicLoading.hide();
                                }, 500);
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                if (refreshData) {
                                    $scope.$broadcast('scroll.refreshComplete');
                                }
                            });
                    } else if ($scope.view.status === 'hasApproval') {
                        ApprovalERVService.getApprovalHistoryList(page, $scope.view.pageable.size)
                            .success(function (data, status, headers) {
                                if (data.length > 0) {
                                    for (var i = 0; i < data.length; i++) {
                                        $scope.view.apporvalList.push(data[i]);
                                    }
                                }
                                if (page === 0) {
                                    $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                                    $scope.view.dataNum.total = headers('x-total-count');
                                    if (data.length === 0) {
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
                                $timeout(function () {
                                    $ionicLoading.hide();
                                }, 500);
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                if (refreshData) {
                                    $scope.$broadcast('scroll.refreshComplete');
                                }
                            });
                    }
                },
                goDetail: function (item,index) {
                    $sessionStorage.approvalListPosition = Math.floor(index / $scope.view.pageable.size);
                    ApprovalERVService.setStatus($scope.view.status);
                    if ($scope.view.status === 'waitApproval') {
                        if (item.entityType === 1002) {
                            //报销单
                            $state.go('app.erv_approval_expense_report_list', {
                                expenseReportOID: item.expenseReport.expenseReportOID
                            });
                        } else if (item.entityType === 1001) {
                            // 京东申请
                            if (item.application.type === 1004) {
                                $state.go('app.jingdong_application_approval', {applicationOID: item.application.applicationOID});
                                return
                            }
                            // if(item.application.formType == 4100 || item.application.formType == '4100'){
                            //     item.application.type = 4100;
                            // }
                            if(item.application.formType == 4100 || item.application.formType == '4100'){
                                //flyback申请
                                var url = ServiceHttpURL + '/hand?action=approval&applicationOID=' + item.application.applicationOID + '&access_token=' + $scope.view.accessToken;
                                $scope.jumpToFlyback(url);
                            } else if(item.application.formOID){
                                var formType = null;
                                if(item.application.type === 1002){
                                    //差旅
                                    formType = 2001;
                                } else if(item.application.type === 1001){
                                    //费用
                                    formType = 2002;
                                } else if(item.application.type === 1003){
                                    //费用
                                    formType = 2003;
                                } else if (item.application.type === 2005) {
                                    //借款申请
                                    formType = 2005
                                }
                                $state.go('app.custom_application_approval', {applicationOID: item.application.applicationOID, formType: formType});
                            } else {
                                if (item.application.type === 1001) {
                                    //费用
                                    $state.go('app.erv_invoice_apply_detail_approval', {applicationOID: item.application.applicationOID});
                                } else if (item.application.type === 1002) {
                                    //差旅
                                    $state.go('app.erv_travel_approval', {applicationOID: item.application.applicationOID});
                                } else if(item.application.type === 1003){
                                    //订票申请
                                    $state.go('app.custom_application_approval', {applicationOID: item.application.applicationOID});
                                }
                            }

                        }
                    } else if ($scope.view.status === 'hasApproval') {
                        if (item.entityType === 1002) {
                            //报销单
                            $state.go('app.tab_erv_expense_detail_passed', {
                                expenseReportOID: item.expenseReport.expenseReportOID,
                                message: 'approval'});
                        } else if (item.entityType === 1001) {
                            // 京东申请
                            if (item.application.type === 1004) {
                                $state.go('app.jingdong_application_approval', {applicationOID: item.application.applicationOID});
                                return
                            }
                            if(item.application.formType == 4100 || item.application.formType == '4100'){
                                //flyback申请
                                var url = ServiceHttpURL + '/hand?action=detail&applicationOID=' + item.application.applicationOID + '&access_token=' + $scope.view.accessToken;
                                $scope.jumpToFlyback(url);
                            } else if(item.application.formOID){
                                var formType = null;
                                if(item.application.type === 1002){
                                    //差旅
                                    formType = 2001;
                                } else if(item.application.type === 1001){
                                    //费用
                                    formType = 2002;
                                } else if(item.application.type === 1003){
                                    //费用
                                    formType = 2003;
                                }else if(item.application.type === 2005){
                                    //借款
                                    formType=2005;
                                }
                                $state.go('app.custom_application_detail', {applicationOID: item.application.applicationOID, formType: formType});
                            } else {
                                if (item.application.type === 1001) {
                                    //费用
                                    $state.go('app.erv_invoice_apply_approve_detail', {applicationOID: item.application.applicationOID});
                                } else if (item.application.type === 1002) {
                                    //差旅
                                    $state.go('app.erv_travel_detail', {applicationOID: item.application.applicationOID});
                                } else if(item.application.type === 1003){
                                    //订票申请
                                    $state.go('app.custom_application_has_pass', {applicationOID: item.application.applicationOID});
                                }
                            }
                        }
                    }
                },
                showOpinionPopup: function (index, entityOID, state) {
                    $scope.view.rejectReason = null;
                    opinionPopup = $ionicPopup.show({
                        template: '<textarea type="text" style="padding:10px;" placeholder="' + $filter('translate')('error.please.enter.the.reason.for.rejecting') + '" ng-model="view.rejectReason" rows="6" maxlength="100">',
                        title: '<h5>'+$filter('translate')('error.reason.for.rejection')+'</h5>',
                        scope: $scope,
                        buttons: [
                            {text: $filter('translate')('approval.cancel')},
                            {
                                text: $filter('translate')('approval.confirm'),
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.view.rejectReason) {
                                        $ionicLoading.show({
                                            template:$filter('translate')('error.please.enter.the.reason.for.rejecting'),
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
                            $scope.view.reject(index, entityOID, state);
                        } else {
                        }
                    });
                },
                loadOne: function () {
                    if ($scope.view.pageable.page < $scope.view.dataNum.lastPage) {
                        ApprovalERVService.getApprovalList(($scope.view.pageable.page + 1) * $scope.view.pageable.size, 1)
                            .success(function (data) {
                                if (data.length > 0) {
                                    $scope.view.nothing = false;
                                    for (var i = 0; i < data.length; i++) {
                                        $scope.view.apporvalList.push(data[i]);
                                    }
                                }
                            })
                            .finally(function () {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            });
                    } else {
                        if ($scope.view.apporvalList.length === 0) {
                            $scope.view.nothing = true;
                        }
                    }
                },
                agree: function (index, entityOID, state) {
                    if(!$scope.view.disable){
                        $scope.view.disable = true;
                        PublicFunction.showLoading();
                        var entry = {};
                        entry.entities = [];
                        var entryItem = {};
                        entryItem.entityOID = entityOID;
                        entryItem.entityType = state;
                        entry.entities.push(entryItem);
                        entry.approvalTxt = '';
                        ApprovalERVService.agree(entry)
                            .success(function (data) {
                                if (data.failNum > 0) {
                                    $scope.view.openWarningPopup($filter('translate')('error.failed'));
                                } else {
                                    $scope.view.openWarningPopup($filter('translate')('approval.already.passed'));
                                    $scope.view.apporvalList.splice(index, 1);
                                    $scope.view.loadOne();
                                }
                            })
                            .error(function() {
                                $ionicLoading.hide();
                            })
                            .finally(function () {
                                $scope.view.disable = false;
                            })
                    }

                },
                reject: function (index, entityOID, state) {
                    if(!$scope.view.disable){
                        $scope.view.disable = true;
                        PublicFunction.showLoading();
                        var entry = {};
                        entry.entities = [];
                        var entryItem = {};
                        entryItem.entityOID = entityOID;
                        entryItem.entityType = state;
                        entry.entities.push(entryItem);
                        entry.approvalTxt = $scope.view.rejectReason;
                        ApprovalERVService.reject(entry)
                            .success(function (data) {
                                if (data.failNum > 0) {
                                    if(data.failReason[entityOID] === 'releaseBudget'){
                                        $scope.view.openWarningPopup($filter('translate')('error.release.budget.failed.withdraw.failed'));
                                    } else {
                                        $scope.view.openWarningPopup($filter('translate')('error.failed'));
                                    }
                                } else {
                                    $scope.view.openWarningPopup($filter('translate')('approval.rejected'));
                                    $scope.view.apporvalList.splice(index, 1);
                                    $scope.view.loadOne();
                                }
                            })
                            .error(function() {
                                $ionicLoading.hide();
                            })
                            .finally(function () {
                                $scope.view.disable = false;
                            })
                    }
                },
                // changeStatus: function () {
                //     if ($scope.view.status === 'waitApproval') {
                //         $scope.view.status = 'hasApproval';
                //         $scope.view.subhead = '待审批';
                //         $scope.view.head = '审批';
                //         $scope.view.apporvalList = [];
                //         $scope.view.loadMore(0);
                //     } else if ($scope.view.status === 'hasApproval') {
                //         $scope.view.status = 'waitApproval';
                //         $scope.view.subhead = '已审批';
                //         $scope.view.head = '审批';
                //         $scope.view.apporvalList = [];
                //         $scope.view.loadMore(0);
                //     }
                // },
                changeStatus: function (status) {
                    if (status === 'hasApproval') {
                        $scope.view.status = 'hasApproval';
                        $scope.view.head = $filter('translate')('approval.approve'); //审批
                        $scope.view.apporvalList = [];
                        $scope.view.loadMore(0);
                    } else if (status === 'waitApproval') {
                        $scope.view.status = 'waitApproval';
                        $scope.view.head = $filter('translate')('approval.approve'); //审批
                        $scope.view.apporvalList = [];
                        $scope.view.loadMore(0);
                    }
                }
            };
            //flyback 跳转
            $scope.jumpToFlyback = function (url) {
                ref = cordova.InAppBrowser.open(url, '_blank', 'location=no,toolbar=no');
                ref.addEventListener('loadstart', inAppBrowserLoadStart);
                ref.addEventListener('exit', inAppBrowserClose);
            };

            $scope.openSearchModal = function () {
                $scope.filterResults = [];
                console.log("go");
                $scope.searchModal.show();
                //搜索modal上 搜索框设置成focus
                $scope.modal.focus = true;
            };
            //搜索出来的待审批数组
            $scope.filterResults = [];

            $scope.searchPagination = {
                page: 0,
                size: 10,
                lastPage: 0,
                total: 0
            };

            //取消未完成的request的取消器的List
            var cancelList = [];
            $scope.modal = {
                clear: function () {
                    $scope.searchPagination.page = 0;
                    $scope.searchPagination.lastPage = 0;
                    $scope.searchPagination.total = 0;
                    $scope.filterResults = [];
                    $scope.view.searchName = '';
                    //搜索modal上 搜索框设置成非focus
                    $scope.modal.focus = false;
                },
                loading: false,
                search : function () {
                    this.loadApprovals(0);
                },
                loadApprovals: function (page) {
                    if ($scope.view.searchName) {
                        $scope.searchPagination.page = page;
                        this.loading = true;
                        var canceller = $q.defer();
                        cancelList.push(canceller);
                        var self = this;
                        ApprovalERVService.searchWaitForApproval(page, 10, $scope.view.searchName, canceller)
                            .then(function (response) {
                                if (page === 0) {
                                    $scope.filterResults = [];
                                    $scope.searchPagination.lastPage = ParseLinks.parse(response.headers('link')).last;
                                    $scope.searchPagination.total = response.headers('x-total-count');
                                }
                                if (response && response.data && response.data.length) {
                                    [].push.apply($scope.filterResults, response.data);
                                }
                            })
                            .finally(function () {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                self.loading = false;
                            });
                    } else {
                        $scope.modal.clear();
                    }
                },
                cancelRequests: function () {
                    for (var i = 0; i < cancelList.length; i++) {
                        cancelList[i].resolve();
                    }
                },
                closeSearchModal: function () {
                    $scope.searchModal.hide();
                    $scope.modal.clear();
                    //取消未完成的请求
                    this.cancelRequests();
                }
            };

            $scope.$on('ngRepeatFinished', function (event) {
                //通过angular的$timeout, 来调用angular的digest方法重新渲染页面
                $timeout(function () {
                    highlightKeywords();
                });
            });

            //高亮搜索的关键词
            function highlightKeywords() {
                var modal = document.getElementById("approval-modal-content");
                if (modal) {
                    var elements = modal.getElementsByClassName("approval-item");
                    for (var i = 0; i < (elements && elements.length); i++) {
                        markKeywordsCore(elements[i], $scope.view.searchName);
                    }
                }
            }
            //递归搜索dom elements
            function markKeywordsCore(obj, keyWords) {
                var re = new RegExp(keyWords, "i");
                //遍历子node
                for (var i = 0; i < obj.childNodes.length; i++) {
                    var childObj = obj.childNodes[i];
                    //如果node的类型是text 则对他的内容进行搜索
                    if (childObj.nodeType === 3) {
                        if (childObj.data.search(re) == -1)
                            continue;
                        var reResult = new RegExp("(" + keyWords + ")", "gi");
                        var objResult = document.createElement("span");
                        objResult.innerHTML = childObj.data.replace(reResult,
                            "<span style='color: red; font-weight: bold'>$1</span>");
                        if (childObj.data == objResult.childNodes[0].innerHTML)
                            continue;
                        //只搜索businessCode和申请人名字两个区域
                        if (childObj.parentNode.className.indexOf("approval-name-anchor") > -1 ||
                            childObj.parentNode.className.indexOf("businessCode-anchor") > -1)
                            obj.replaceChild(objResult, childObj);
                    } else if (childObj.nodeType == 1) {
                        //如果node type是element 则递归调用该方法
                        markKeywordsCore(childObj, keyWords);
                    }
                }
            }

            var init = function () {
                var token = localStorageService.get(LocalStorageKeys.token);
                $scope.view.accessToken = token.access_token;
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (configuration) {
                        $scope.OriginCurrencyCode=configuration.currencyCode;
                        $scope.view.currencyCode = configuration.currencyCode;
                        $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                    });
                NotificationService.countUnReadMessage()
                    .success(function (data) {
                        $scope.total = data;
                        $rootScope.$broadcast('NOTIFICATIONTOTAL', $scope.total);
                        PushService.setBadge($scope.total);
                    });
                if (ApprovalERVService.getStatus()) {
                    $scope.view.status = ApprovalERVService.getStatus();
                    // if ($scope.view.status === 'waitApproval') {
                    //     $scope.view.head =  $filter('translate')('approval.pending');
                    //     $scope.view.subhead = $filter('translate')('approval.already');
                    // } else if ($scope.view.status === 'hasApproval') {
                    //     $scope.view.subhead =  $filter('translate')('approval.pending');
                    //     $scope.view.head =$filter('translate')('approval.already');
                    // } else {
                    //     $scope.view.status = 'waitApproval';
                    //     $scope.view.head = $filter('translate')('approval.pending');
                    //     $scope.view.subhead =$filter('translate')('approval.already');
                    // }
                } else {
                    $scope.view.status = 'waitApproval';
                    //$scope.view.head = $filter('translate')('approval.pending');
                    //$scope.view.subhead = $filter('translate')('approval.already');
                }
                $scope.view.changeStatus($scope.view.status);
                //$scope.view.apporvalList = [];
                //$scope.view.loadMore(0);
            };

            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;

                });
            });
            $scope.$on('$ionicView.enter', function (event, viewData) {
                if($sessionStorage.approvalListPosition !== null && $sessionStorage.approvalListPosition !== undefined && $sessionStorage.approvalListPosition >= 0){
                    replaceDataByPage($sessionStorage.approvalListPosition);
                    $sessionStorage.approvalListPosition = null;
                }
                //待审批报销单搜索modal
                $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/approval/search.approval.list.modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.searchModal = modal;
                });
            });

            $scope.$on('$ionicView.leave', function (event, viewData) {
                if(opinionPopup){
                    opinionPopup.close();
                }
                $scope.modal.closeSearchModal();
                $scope.searchModal.remove();
            });

            //从sessionStorage 中获取 上次点击的数据所在的页码,重新获取当前页码的数据,
            //并替换当前页的数据,然后去重(避免审批完一条数据后,新加载一次该页,出现新加载的页的最后一条数据与原数组的最下一页的第一条数据重复)
            function replaceDataByPage(page) {
                //未审批
                if($scope.view.status === 'waitApproval'){
                    ApprovalERVService.getApprovalList(page, $scope.view.pageable.size)
                        .then(function (res) {
                            var data = res.data;
                            var arr = angular.copy($scope.view.apporvalList);
                            arr.splice(page * $scope.view.pageable.size,$scope.view.pageable.size);//清空当前页数据
                            //将第page页的数据替换
                            if (data.length >= 0) {
                                angular.forEach(data,function (item,index) {
                                    arr[page * $scope.view.pageable.size + index] = item;
                                })
                            }
                            //去重
                            $scope.view.apporvalList = uniqueArr(arr,'entityOID');
                        });
                    //已审批
                }else if($scope.view.status === 'hasApproval'){
                    ApprovalERVService.getApprovalHistoryList(page, $scope.view.pageable.size)
                        .then(function (res) {
                            var data = res.data;
                            var arr = angular.copy($scope.view.apporvalList);
                            arr.splice(page * $scope.view.pageable.size ,$scope.view.pageable.size);//清空当前页数据
                            //将第page页的数据替换
                            if (data.length >= 0) {
                                angular.forEach(data,function (item,index) {
                                    arr[page * $scope.view.pageable.size + index] = item;
                                })
                            }
                            //去重
                            $scope.view.apporvalList = uniqueArr(arr,'entityOID');
                        })
                }

            }

            /** 数组去重
             *  @param targetArr  待去重的目标对象数组
             *  @param attr       根据对象的 attr 属性来判断是否存在
             */
            function uniqueArr(targetArr,attr) {
                var n = {}, r = []; //n为hash表，r为临时数组
                for (var i = 0; i < targetArr.length; i++) { //遍历当前数组
                    if (!n[targetArr[i][attr]]) { //如果hash表中没有当前项
                        n[targetArr[i][attr]] = true; //存入hash表
                        r.push(targetArr[i]); //把当前数组的当前项push到临时数组里面
                    }
                }
                return r;
            }
        }]);
