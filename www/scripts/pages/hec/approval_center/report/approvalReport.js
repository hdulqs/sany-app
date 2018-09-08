/**
 * Created by Hurong on 2017/8/8.
 *  报销审批申请页面
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.approvalReport', {
                cache: false,
                url: '/approvalReport',
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/approval_center/report/approvalReport.html',
                        controller: 'approvalReportController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecapproval');
                        $translatePartialLoader.addPart('hecexp.common');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('approvalReportController', ['$scope', '$filter', '$ionicPopup', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout', 'approvalService', 'PublicFunction',
        '$stateParams', 'LocalStorageKeys', '$ionicModal', 'HecbempService', 'approvalRecordService', 'ReportListService', 'HecImageService', 'PageValueService',
        function ($scope, $filter, $ionicPopup, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, approvalService, PublicFunction,
                  $stateParams, LocalStorageKeys, $ionicModal, HecbempService, approvalRecordService, ReportListService, HecImageService, PageValueService) {
            var vm = this;
            //初始化page
            vm.initPage = initPage;
            //报销单行详情
            vm.goExpenseLine = goExpenseLine;
            //收回待审批单据
            vm.takeBack = takeBack;
            //付款计划
            vm.goPayPlan = goPayPlan;
            //审批拒绝
            vm.refuseApproval = refuseApproval;
            //审批同意
            vm.passApproval = passApproval;
            //加签人弹出框
            vm.showSignPopup = showSignPopup;
            //选择加签人
            vm.chooseEmp = chooseEmp;
            //超标情况
            vm.goOverPage = goOverPage;
            //参数
            vm.appCenterReport = PageValueService.get("appCenterReport");
            vm.type = vm.appCenterReport.type;//approval:审批中心模块、report:报销单模块
            console.log('type：' + vm.type);
            vm.passFlag = vm.appCenterReport.passFlag;
            vm.status = vm.appCenterReport.status;
            vm.approvalReport = vm.appCenterReport.approvalReport;
            if (vm.approvalReport != null) {
                vm.headerId = vm.approvalReport.instance_param;
                vm.recordId = vm.approvalReport.record_id;
                vm.instanceId = vm.approvalReport.instance_id;
                vm.curr_approve_name = vm.approvalReport.curr_approve_name;//报销单模块待审批单据的当前审批人
                console.log("vm.headerId==" + vm.headerId + "====recordId== " + vm.recordId + "====vm.instanceId==" + vm.instanceId);
            }
            vm.header = {};
            vm.line = [];
            //审批中心待审批标志
            vm.waitApprovalFlag = false;
            //审批记录或单据跟踪
            vm.approvalRecordList = [];
            //审批意见
            vm.approvalText = "";
            //加签说明
            vm.signText = "";
            //员工（加签人）选择modal页面参数
            $scope.searchKeyword = {value: ""};
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.empList = [];
            //已选择的员工（加签人）
            vm.selectedEmp = {};
            //附件
            vm.attachments = [];

            /**
             * 初始化页面
             */
            function initPage() {

                PublicFunction.showLoading(200);
                //加载附件
                HecImageService.downloadImage("erh", vm.headerId).then(function (res) {
                    vm.attachments = res;
                });

                //获取报销单头
                approvalService.searchApprovalReport('center_report_head', vm.headerId).then((function (res) {
                    if (res.data.success) {
                        if(res.data.result.pageCount > 0){
                            vm.header = res.data.result.record[0];
                            //获取报销单行
                            approvalService.searchApprovalReport('center_report_line', vm.headerId).then((function (res) {
                                if (res.data.success && res.data.result.pageCount > 0) {
                                    vm.line = res.data.result.record;
                                }
                            }), function (error) {
                                PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                                console.log("请求获取单据行数据失败： " + angular.toJson(error));
                            });
                            //根据recordId获取审批拒绝和同意的actionId
                            approvalService.getActionId(vm.recordId).then((function (res) {
                                if (res.data.success) {
                                    var pageCnt = res.data.result.pageCount;
                                    //如果actionId存在则表示为审批中心待审批，根据instanceId获取审批记录，不存在根据headerId则获取单据跟踪
                                    if (pageCnt > 0) {
                                        vm.waitApprovalFlag = true;
                                        //获取审批记录
                                        approvalService.getApprovalRecord(vm.instanceId).then((function (res) {
                                            if (res.data.success) {
                                                if( res.data.result.pageCount > 0){
                                                    vm.approvalRecordList = res.data.result.record;
                                                }
                                            }
                                        }), function (error) {
                                            PublicFunction.showToast($filter('translate')('error.get.approval.record.failed'));//获取审批记录失败!
                                            console.log("请求获取审批记录失败： " + angular.toJson(error));
                                        });
                                        var list = res.data.result.record;
                                        for (var i = 0; i < list.length; i++) {
                                            if (list[i].action_type == 1) {//同意
                                                vm.agreeActionId = list[i].action_id;
                                            } else if (list[i].action_type == -1) {
                                                vm.refuseActionId = list[i].action_id;
                                            } else {
                                                vm.agreeActionId = '';
                                                vm.refuseActionId = '';
                                            }
                                        }
                                    } else {//该单据已被审批
                                        vm.waitApprovalFlag = false;
                                        if (vm.type == 'approval') {
                                            vm.status = 'hasApproval';
                                        }
                                        //获取报销单单据跟踪记录
                                        approvalRecordService.reportRecord(vm.headerId).then(function (res) {
                                            if (res.data.success) {
                                                if(res.data.result.pageCount > 0){
                                                    vm.approvalRecordList = res.data.result.record;
                                                }
                                            }
                                        }, function (error) {
                                            PublicFunction.showToast($filter('translate')('error.get.report.record.failed'));//获取报销单单据跟踪记录失败!
                                            console.log("请求获单据跟踪记录失败： " + angular.toJson(error));
                                        });

                                    }
                                } else {
                                    PublicFunction.showToast(res.data.error.message);
                                    console.log("获取actionId失败：" + res.data.error.message);
                                }
                            }), function (error) {
                                PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                                console.log("请求获取action_id失败： " + angular.toJson(error));
                            });
                            $ionicLoading.hide();
                        }
                    } else {
                        PublicFunction.showToast($filter('translate')('message.error.query'));  // 数据查询失败
                        console.log("获取单据头数据失败： " + res.data.error.message);
                    }
                }), function (error) {
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                    console.log("请求获取单据头数据失败： " + angular.toJson(error));
                });
            }

            vm.initPage();

            /**
             * 查看报销单行详情
             * @param itemLine 报销单对象
             * @param type 跳转类型：approval:审批中心模块、req申请单模块
             */
            function goExpenseLine(item) {
                var params = {
                    item: item,
                    type: vm.type,
                    status: vm.status
                }
                $state.go('app.expenseItem', params);
            };

            /**
             * 查看付款计划行
             */
            function goPayPlan() {
                var params = {
                    headerId: vm.headerId,
                    type: vm.type,
                    status: vm.status
                }
                $state.go('app.payPlan', params);
            };

            /**
             * 收回待审批申请单
             * @param instanceId
             */
            function takeBack(instanceId) {
                PublicFunction.showLoading();
                console.log("收回 instanceId" + instanceId);
                ReportListService.takeBack(instanceId).then(function (res) {
                    if (res.data.success) {
                        console.log('收回成功');
                        $state.go('app.tab_erv.reportList', {status: vm.status});
                    } else {
                        PublicFunction.showToast($filter('translate')('error.take.back.failed') + ": " + res.data.error.message);//收回失败
                        console.log("待审批申单据收回失败： " + res.data.error.message);
                    }
                }, function (error) {
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                    console.log("请求待审批单据收回失败： " + angular.toJson(error));
                });
            };

            /**
             * 审批拒绝
             */
            function refuseApproval() {
                if (vm.approvalText == "") {
                    PublicFunction.showToast($filter('translate')('error.please.enter.the.reason.for.approval'));//请输入审批意见
                    return;
                }
                PublicFunction.showLoading();
                approvalService.refuseApproval(vm.recordId, vm.refuseActionId, vm.approvalText).then(function (res) {
                    if (res.data.success) {
                        console.log("已拒绝");
                        if (vm.appCenterReport.messageFlag === 'Y') {
                            $state.go('app.erv_notification');
                        } else {
                            $state.go('app.approvalList');
                        }
                    } else {
                        PublicFunction.showToast(res.error.message);//审批失败$filter('translate')('approval.failure')
                    }
                }, function (error) {
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                    console.log("请求审批拒绝失败： " + angular.toJson(error));
                });
            };

            /**
             * 审批通过
             */
            function passApproval() {
                /* if (vm.approvalText == "") {
                 PublicFunction.showToast($filter('translate')('error.please.enter.the.reason.for.approval'));//请输入审批意见
                 return;
                 }*/
                PublicFunction.showLoading();
                approvalService.passApproval(vm.recordId, vm.agreeActionId, vm.approvalText).then(function (res) {
                    if (res.data.success) {
                        console.log("已通过");
                        if (vm.appCenterReport.messageFlag === 'Y') {
                            $state.go('app.erv_notification');
                        } else {
                            $state.go('app.approvalList');
                        }
                    } else {
                        PublicFunction.showToast(res.error.message);//审批失败$filter('translate')('approval.failure')
                    }
                }, function (error) {
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                    console.log("请求审批同意失败： " + angular.toJson(error));
                });
            };

            /**
             *  弹出加签人对话框
             */
            function showSignPopup() {
                //定义加签人弹出框
                vm.signPopup = $ionicPopup.show({
                    cssClass: 'approval-sign-popup',
                    templateUrl: 'scripts/pages/hec/approval_center/signPopup.html',
                    scope: $scope,
                    buttons: [
                        {text: $filter('translate')('approval.sign.cancel')},
                        {
                            text: $filter('translate')('approval.sign.ok'),
                            type: 'button-positive',
                            onTap: function (e) {
                                if (PublicFunction.isNull(vm.selectedEmp.employee_id)) {
                                    console.log('请选择加签人');
                                    PublicFunction.showToast($filter('translate')('approval.sign.please.choose.employee'));//请选择加签人
                                } else {
                                    PublicFunction.showLoading();
                                    approvalService.approvalSign(vm.recordId, vm.selectedEmp, vm.signText).then(function (res) {
                                        if (res.data.success) {
                                            console.log("加签成功！headerId：" + vm.headerId + "===recordId" + vm.recordId + "===员工：" + vm.selectedEmp.name);
                                            if (vm.appCenterReport.messageFlag === 'Y') {
                                                $state.go('app.erv_notification');
                                            } else {
                                                $state.go('app.approvalList');
                                            }
                                        } else {
                                            PublicFunction.showToast(res.data.error.message);//加签失败，$filter('translate')('approval.sign.signing .failed')
                                            console.log("加签失败：" + res.data.error.message);
                                        }
                                    }, function (error) {
                                        console.log("请求加签失败： " + angular.toJson(error));
                                        PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                                    });
                                }
                            }
                        },
                    ]
                });
                vm.signPopup.then(function (res) {
                    // console.log('处理'+angular.toJson(res));
                });
            };

            /**
             * 显示选择加签人的modal
             * @param recordId
             * @param actionId
             */
            function chooseEmp() {
                $scope.openBempModal();
                vm.signPopup.close();
            }

            /**
             * 查看超标情况
             */
            function goOverPage() {
                $state.go('app.overStandard', {
                    "repHeaderId": vm.header.exp_report_header_id,
                    "repTypeCode": vm.header.exp_report_type_code
                });
            }

            //员工（加签人）Modal
            $ionicModal.fromTemplateUrl('scripts/pages/hec/approval_center/employeesModal.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            /**
             * 打开员工选择Modal
             */
            $scope.openBempModal = function () {
                $scope.modal.show();
                $scope.searchKeyword.value = "";
                $scope.empList = [];
                $scope.loadMore(1);
                vm.selectedEmp = {};
            };

            /**
             * 选择员工
             * @param bemp
             */
            $scope.selectItem = function (emp) {
                vm.selectedEmp = emp;
                console.log("selectedEmp" + angular.toJson(vm.selectedEmp));
                $scope.modal.hide();
                showSignPopup();
            };

            /**
             * 搜索员工
             */
            $scope.searchEmp = function () {
                $scope.empList = [];
                $scope.loadMore(1);
            };

            /**
             * 加载员工数据（加签人）
             * @param page
             */
            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecbempService.searchKeywords($scope.searchKeyword.value, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.empList = $scope.empList.concat(dataRes.result.record);
                    } else {
                        $scope.empList = [];
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function (error) {
                    // 如果是搜索结果为空,结束搜索,否则提示报错
                    if (error === 'keywords.is.ambiguous') {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                    }
                });
            };

            //页面销毁时,释放modal占用的资源
            $scope.$on('$ionicView.leave', function (event, viewData) {
                $scope.modal.remove();
            });

            $scope.goBack = function () {
                PageValueService.set("appCenterReport", {});
                if (vm.appCenterReport.messageFlag === 'Y') {
                    $state.go('app.erv_notification');
                } else {
                    if (vm.type == 'approval') {
                        $state.go('app.approvalList', {"status": vm.status});
                    } else if (vm.type == 'report') {
                        $state.go('app.tab_erv.reportList', {"status": vm.status});
                    } else {
                        $state.go('app.tab_erv.homepage');
                    }
                }
            };
        }]);

