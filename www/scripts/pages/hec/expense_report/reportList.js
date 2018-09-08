/**
 * Created by Dawn on 2017/8/5.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.tab_erv.reportList', {
                cache: false,
                url: '/reportList',
                data: {
                    roles: []
                },
                params: {
                    status: "waitSubmit"
                },
                views: {
                    'tab-erv-expense': {
                        templateUrl: 'scripts/pages/hec/expense_report/reportList.html',
                        controller: 'reportListCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecexp.report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('reportListCtrl', ['$scope', '$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout',
        'LocalStorageKeys', '$stateParams', 'PublicFunction', 'ReportListService', 'PageValueService',
        function ($scope, $filter, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,
                  LocalStorageKeys, $stateParams, PublicFunction, ReportListService, PageValueService) {
            var vm = this;
            //切换tab
            vm.changeTab = changeTab;
            //获取数据
            vm.loadMore = loadMore;
            //跳转到相应的明细页面
            vm.goDetail = goDetail;
            //删除整单报销
            vm.deleteReport = deleteReport;
            //收回待审批报销单
            vm.takeBack = takeBack;
            //刷新页面
            vm.doRefresh = doRefresh;
            //返回
            vm.goBack = goBack;
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
            vm.size = 50;//页面数据需要过滤暂定50， LocalStorageKeys.hec_pagesize;
            //添加图标的状态
            vm.markStatus = false;
            //报销单数据
            vm.reportList = [];
            //页面跳转，传参：审批状态(waitSubmit/未提交 待审批/waitApproval 已审批/hasApproval)
            vm.status = $stateParams.status;
            vm.toCreateReim = toCreateReim;
            //初始化页面
            vm.loadMore(vm.status, 1);

            /**
             * 根据状态切换Tab
             * @param status 状态(待提交/waitSubmit  待审批/waitApproval  审批通过/hasApproval)
             */
            function changeTab(status) {
                vm.nothing = false;
                vm.status = status;
                vm.reportList = [];
                vm.page = 1;
                vm.pageCnt = 0;
                vm.loadMore(status, 1);
            }

            /**
             * 加载数据
             * @param dateType tab页类型
             * @param page 加载页数
             */
            function loadMore(dateType, page) {
                PageValueService.set("confirmTripParams", "");
                PageValueService.set("reportHeaderParams","");//防止按返回键没有清空之前set过的参数
                if (dateType == 'waitSubmit') {
                    dateType = "report_pending";
                } else if (dateType == 'waitApproval') {
                    dateType = "expense_req_approve_pending";
                } else if (dateType == 'hasApproval') {
                    dateType = "report_approval";
                }
                vm.page = page;
                //获取报销列表数据
                PublicFunction.showLoading();
                ReportListService.initReportList(dateType, page, vm.size).then(function (res) {
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
                            vm.reportList = vm.reportList.concat(res.data.result.record);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    } else {
                        console.log("systemError");
                        vm.systemError = true;
                    }
                    $ionicLoading.hide();
                }, function (error) {
                    vm.networkError = true;
                    PublicFunction.showToast(vm.networkErrorText); // 哎呀,网络出错了!
                });
            }

            /**
             * 根据不同状态，查看报销单详情页面
             * @param report
             * @param status 状态(待提交/waitSubmit  待审批/waitApproval  审批通过/hasApproval)
             */
            function goDetail(report, status) {
                PageValueService.set("comDocData", "");
                if (status === "waitSubmit") {
                    var reportTypeCode = report.expense_report_type_code;
                    var reportHeaderId = report.exp_report_header_id;
                    $state.go('app.reportHeader', {headerId: reportHeaderId});
                    /*  if (reportTypeCode == '1010'||reportTypeCode == '1015') {//目前只有差旅报销单(国内/1010、国外/1015)
                     $state.go('app.reportHeader',{headerId:reportHeaderId});
                     } else {
                     PublicFunction.showToast("技术小哥正在努力开发该功能...");
                     }*/
                } else if (status === 'waitApproval') {
                    var params = {
                        "status": status,
                        "approvalReport": {
                            instance_param: report.instance_param,
                            instance_id: report.instance_id,
                            curr_approve_name: report.curr_approve_name
                        },
                        "type": 'report'
                    };
                    console.log("报销单待审批跳转参数:" + angular.toJson(params));
                    PageValueService.set("appCenterReport", params);
                    $state.go('app.approvalReport');
                } else if (status === 'hasApproval') {
                    //判断单据是否已经全部审批完成（工作流结束）
                    var passFlag = 'N';
                    if (report.requisition_status_value == 'COMPLETELY_APPROVED') {
                        passFlag = 'Y';
                    }
                    var params = {
                        "status": status,
                        "approvalReport": {instance_param: report.exp_report_header_id},
                        'type': 'report',
                        "passFlag": passFlag
                    };
                    console.log("报销单已审批跳转参数：  " + angular.toJson(params));
                    PageValueService.set("appCenterReport", params);
                    $state.go('app.approvalReport', params);
                }
            }

            /**
             * 根据报销单头Id删除报销单
             * @param headerId 头Id
             */
            function deleteReport(headerId) {
                PublicFunction.showLoading(150);
                console.log("删除报销单 headerId:" + headerId);
                ReportListService.deleteReport(headerId).then(function (res) {
                    if (res.data.success) {
                        console.log("删除成功");
                        PublicFunction.showToast($filter('translate')('message.delete.success'));
                        $state.go('app.tab_erv.reportList', {}, {reload: true});
                    } else {
                        console.log("删除失败： " + res.data.error.message);
                        PublicFunction.showToast($filter('translate')('message.delete.failed') + ": " + res.data.error.message);//删除失败
                    }
                }, function (error) {
                    console.log("请求删除报销单失败： " + angular.toJson(error));
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                });
            };

            /**
             * 收回待审批申请单
             * @param instanceId
             */
            function takeBack(instanceId) {
                PublicFunction.showLoading(300);
                console.log("收回 instanceId" + instanceId);
                ReportListService.takeBack(instanceId).then(function (res) {
                    if (res.data.success) {
                        console.log('收回成功');
                        $state.go('app.tab_erv.reportList', {status: vm.status}, {reload: true});
                    } else {
                        PublicFunction.showToast($filter('translate')('error.take.back.failed') + ": " + res.data.error.message);//收回失败
                        console.log("待审批申单据收回失败： " + res.data.error.message);
                    }
                }, function (error) {
                    console.log("请求待审批单据收回失败： " + angular.toJson(error));
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                });
            };

            function toCreateReim() {
                PageValueService.set("comDocData", "");
                PageValueService.set("reqItem", "");
                $state.go('app.companyExpType', {chooseValue: 'ExpReport'});
            }

            /**
             * 下拉刷新
             * @param status
             */
            function doRefresh(status) {
                vm.networkError = false;
                vm.systemError = false;
                vm.nothing = false;
                vm.pageCnt = 0;
                vm.reportList = [];
                vm.loadMore(status, 1);
                $scope.$broadcast('scroll.refreshComplete');
            };

            /**
             * 返回
             */
            function goBack() {
                $state.go('app.tab_erv.homepage');
            };
        }]);
