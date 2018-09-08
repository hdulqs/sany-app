/**
 * Created by Hurong on 2017/8/2.
 *  审批查询页面
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.approvalList', {
                cache: false,
                url: '/approvalList',
                params: {
                    status: "waitApproval"
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/approval_center/approvalList.html',
                        controller: 'approvalListController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecapproval');
                        return $translate.refresh();
                    }]
                }

            })
    }])
    .controller('approvalListController', ['$scope', '$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout',
        'approvalService', 'LocalStorageKeys', '$stateParams', '$ionicModal', 'PublicFunction', 'PageValueService',
        function ($scope, $filter, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,
                  approvalService, LocalStorageKeys, $stateParams, $ionicModal, PublicFunction, PageValueService) {
            var vm = this;
            //切换tab
            vm.changeTab = changeTab;
            //获取数据
            vm.loadMore = loadMore;
            //跳转到相应的审批明细页面
            vm.goApproval = goApproval;
            //刷新页面
            vm.doRefresh = doRefresh;
            //没有数据
            vm.nothing = false;
            //网络错误
            vm.networkError = false;
            vm.networkErrorText = $filter('translate')('error.network');//哎呀,网络出错了!
            vm.networkErrorIcon = "img/error-icon/network-error.png";
            //系统错误
            vm.systemError = false;
            vm.systemErrorText = $filter('translate')('error.server');//服务器开小差了,
            vm.systemErrorSubText = $filter('translate')('error.system');//技术小哥正在努力修复!
            vm.systemErrorIcon = "img/error-icon/system-error.png";
            //分页信息
            vm.page = 1;
            vm.pageCnt = 0;
            vm.size = LocalStorageKeys.hec_pagesize;
            //添加图标的状态
            vm.markStatus = false;
            //审批数据
            vm.approvalList = [];
            //页面跳转，传参：审批状态(waitSubmit/未提交 待审批/waitApproval 已审批/hasApproval)
            vm.status = $stateParams.status;
            vm.waitDataType = "center_unapproved";//待审批dataType
            vm.hasDataType = "center_approved";//已审批dataType

            //初始化页面
            vm.loadMore(vm.status, 1);

            /**
             * 根据状态切换Tab
             * @param status 状态(待提交/waitSubmit  待审批/waitApproval  审批通过/hasApproval)
             */
            function changeTab(status) {
                vm.nothing = false;
                vm.status = status;
                vm.approvalList = [];
                vm.page = 1;
                vm.pageCnt = 0;
                vm.loadMore(status, 1);
            }

            /**
             * 加载数据
             * @param dataType 根据Tab状态获取接口dataType
             * @param page 加载页数
             */
            function loadMore(dataType, page) {
                PublicFunction.showLoading();
                if (dataType == 'waitApproval') {
                    dataType = vm.waitDataType;
                } else if (dataType == 'hasApproval') {
                    dataType = vm.hasDataType;
                } else {
                    dataType = dataType;
                }
                vm.page = page;
                approvalService.getApprovalList(dataType, "", page, vm.size).then(function (res) {
                    vm.networkError = false;
                    vm.systemError = false;
                    if (res.data.success) {
                        vm.pageCnt = res.data.result.pageCount;
                        if (vm.pageCnt == 0) {
                            vm.nothing = true;
                        }
                        if (vm.page <= vm.pageCnt) {
                            vm.nothing = false;
                            vm.total = res.data.result.totalCount;
                            vm.approvalList = vm.approvalList.concat(res.data.result.record);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    } else {
                        console.log("systemError");
                        vm.systemError = true;
                    }
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicLoading.hide();
                    vm.networkError = true;
                    PublicFunction.showToast(vm.networkErrorText); // 哎呀,网络出错了!
                });
            };

            /**
             * 查看审批详情
             * @param approvalItem
             * @param status waitApproval/待审批  hasApproval/已审批
             */
            function goApproval(approvalItem, status) {
                //判断已审批单据是否已经全部审批完成（工作流结束）
                var passFlag = 'N';
                if (status == "hasApproval" && (approvalItem.order_status == 'COMPLETELY_APPROVED' || approvalItem.order_status == 'APPROVED')) {
                    passFlag = 'Y';
                }
                //审批单据类型
                var approvalType = approvalItem.workflow_category;
                if (approvalType == 'EXP_REQUISITION') {//申请单
                    var params = {
                        "status": status,
                        "approvalReq": approvalItem,
                        "passFlag": passFlag,
                        "type": "approval"
                    };
                    PageValueService.set("appCenterReq", params);
                    $state.go('app.approvalReq');
                } else if (approvalType == 'EXP_REPORT') {//费用报销单
                    var params = {
                        "status": status,
                        "approvalReport": approvalItem,
                        "passFlag": passFlag,
                        "type": 'approval'
                    };
                    PageValueService.set("appCenterReport", params);
                    $state.go('app.approvalReport');
                } else if (approvalType == 'PAYMENT_REQUISITION') {//借款申请单
                    var params = {
                        "status": status,
                        "approvalLoan": approvalItem,
                        "passFlag": passFlag,
                        "type": 'approval'
                    };
                    PageValueService.set("appCenterLoan", params);
                    $state.go('app.approvalLoan');
                } else if (approvalType == 'ACP_REQUISITION') {//付款申请单
                    var params = {
                        "status": status,
                        "approvalPayment": approvalItem,
                        "passFlag": passFlag,
                        "type": 'approval'
                    };
                    PageValueService.set("appCenterPayment", params);
                    $state.go('app.approvalPayment');
                } else {
                    PublicFunction.showToast($filter('translate')('error.search.failed'));//查找失败！
                }
            }

            /**
             * 下拉刷新
             * @param status
             */
            function doRefresh(dataType) {
                vm.networkError = false;
                vm.systemError = false;
                vm.nothing = false;
                vm.pageCnt = 0;
                vm.approvalList = [];
                vm.loadMore(dataType, 1);
                $scope.$broadcast('scroll.refreshComplete');
            }

            /**
             * 打开审批搜索框
             */
            $scope.openSearchModal = function () {
                $scope.filterResults = [];
                $scope.searchModal.show();
                //搜索modal上 搜索框设置成focus
                $scope.modal.focus = false;
            };

            /**
             * 定义搜索框Modal
             */
            $ionicModal.fromTemplateUrl('scripts/pages/hec/approval_center/approvalList.modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.searchModal = modal;
            });

            //modal框参数
            $scope.modal = {
                searchKeyword: "",
                filterResults: [],
                searchPage: 0,
                searchPageCnt: 0,
                searchSize: LocalStorageKeys.hec_pagesize,
                //关键字搜索
                search: function () {
                    this.filterResults = [];
                    $scope.modal.loading = true;
                    this.loadApprovals(vm.status, this.searchKeyword, 1);
                },
                //加载数据
                loadApprovals: function (dataType, keywords, searchPage) {
                    if (dataType == 'waitApproval') {
                        dataType = vm.waitDataType;
                    } else if (dataType == 'hasApproval') {
                        dataType = vm.hasDataType;
                    } else {
                        dataType = dataType;
                    }
                    this.searchPage = searchPage;
                    approvalService.getApprovalList(dataType, keywords, this.searchPage, this.searchSize).then(function (res) {
                        $scope.modal.searchPageCnt = res.data.result.pageCount;
                        if ($scope.modal.searchPage <= $scope.modal.searchPageCnt) {
                            $scope.modal.filterResults = $scope.modal.filterResults.concat(res.data.result.record);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                        $scope.modal.loading = false;
                    }, function (error) {
                        PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                    });
                },
                //删除关键字
                clear: function () {
                    this.searchPage = 0;
                    this.searchPageCnt = 0;
                    this.filterResults = [];
                    this.searchKeyword = '';
                    //搜索modal上 搜索框设置成非focus
                    this.focus = false;
                },
                //关闭modal
                closeSearchModal: function () {
                    $scope.searchModal.hide();
                    $scope.modal.clear();
                }
            }

            $scope.goBack = function () {
                $state.go('app.tab_erv.homepage');
            };

            $scope.$on('$ionicView.leave', function (event, viewData) {
                $scope.modal.closeSearchModal();
                $scope.searchModal.remove();
            });
        }]);

