/**
 * Created by Hurong on 2017/8/2.
 *  借款审批申请页面
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.approvalLoan', {
                cache: false,
                url: '/approvalLoan',
                data: {
                    roles: []
                },
                params: {},
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/approval_center/loan/approvalLoan.html',
                        controller: 'approvalLoanController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecapproval');
                        $translatePartialLoader.addPart('hecexp.common');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('approvalLoanController', ['$scope', '$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout', '$ionicPopup', 'approvalService', 'PublicFunction',
        '$stateParams', 'LocalStorageKeys', '$ionicModal', 'HecbempService', 'approvalRecordService', 'HecImageService', 'PageValueService',
        'ReqListService',
        function ($scope, $filter, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, $ionicPopup, approvalService, PublicFunction,
                  $stateParams, LocalStorageKeys, $ionicModal, HecbempService, approvalRecordService, HecImageService, PageValueService,
                  ReqListService) {
            var vm = this;
            //初始化page
            vm.initPage = initPage;
            //借款申请行详情
            vm.goLoanLine = goLoanLine;
            //收回待审批单据
            vm.takeBack = takeBack;
            //拒绝审批
            vm.refuseApproval = refuseApproval;
            //同意审批
            vm.passApproval = passApproval;
            //加签人弹出框
            vm.showSignPopup = showSignPopup;
            //选择加签人
            vm.chooseEmp = chooseEmp;
            //审批意见
            vm.approvalText = "";
            //加签说明
            vm.signText = "";
            //参数
            vm.appCenterLoan = PageValueService.get("appCenterLoan");
            vm.type = vm.appCenterLoan.type;//用来判断是从审批中心(approval)跳转,还是其他调转
            vm.status = vm.appCenterLoan.status;
            vm.passFlag = vm.appCenterLoan.passFlag;
            vm.approvalLoan = vm.appCenterLoan.approvalLoan;
            if (vm.approvalLoan != null) {
                vm.headerId = vm.approvalLoan.instance_param;
                vm.recordId = vm.approvalLoan.record_id;
                vm.instanceId = vm.approvalLoan.instance_id;
                vm.curr_approve_name = vm.approvalLoan.curr_approve_name;//申请单模块待审批单据的当前审批人
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
                HecImageService.downloadImage("pr", vm.headerId).then(function (res) {
                    vm.attachments = res;
                });

                //获取借款单头
                approvalService.searchApprovalLoan('center_payment_head', vm.headerId).then((function (res) {
                    if (res.data.success) {
                        if(res.data.result.pageCount > 0){
                            vm.header = res.data.result.record[0];
                            //获取借款单行
                            approvalService.searchApprovalLoan('center_payment_line', vm.headerId).then((function (res) {
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
                                                if(res.data.result.pageCount > 0){
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
                                        //获取单据跟踪记录
                                        approvalRecordService.loanRecord(vm.headerId).then(function (res) {
                                            if (res.data.success) {
                                                if(res.data.result.pageCount > 0){
                                                    vm.approvalRecordList = res.data.result.record;
                                                }
                                            }
                                        }, function (error) {
                                            PublicFunction.showToast($filter('translate')('error.get.loan.record.failed'));//获取借款单单据跟踪记录失败!
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
             * 查看借款单行详情
             * @param itemLine 借款单对象
             * @param type 跳转类型：approval:审批中心模块、req申请单模块
             */
            function goLoanLine(item) {
                var params = {
                    item: item
                }
                $state.go('app.loanItem', params);
            };

            /**
             * 收回待审批申请单
             * @param instanceId
             */
            function takeBack(instanceId) {
                PublicFunction.showLoading();
                console.log("收回 instanceId" + instanceId);
                ReqListService.takeBack(instanceId).then(function (res) {
                    if (res.data.success) {
                        console.log('收回成功');
                        $state.go('app.reqList', {status: vm.status});
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
                    $ionicLoading.hide();
                    if (res.data.success) {
                        console.log("已拒绝");
                        if (vm.appCenterLoan.messageFlag === 'Y') {
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
             * 审批同意
             */
            function passApproval() {
                /*if(vm.approvalText==""){
                 PublicFunction.showToast($filter('translate')('error.please.enter.the.reason.for.approval'));//请输入审批意见
                 return;
                 }*/
                PublicFunction.showLoading();
                approvalService.passApproval(vm.recordId, vm.agreeActionId, vm.approvalText).then(function (res) {
                    $ionicLoading.hide();
                    if (res.data.success) {
                        console.log("已通过");
                        if (vm.appCenterLoan.messageFlag === 'Y') {
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
                                    approvalService.approvalSign(vm.recordId, vm.selectedEmp, vm.signText).then(function (res) {
                                        console.log("加签参数：headerId：" + vm.headerId + "===recordId" + vm.recordId + "===员工：" + vm.selectedEmp.name);
                                        if (res.data.success) {
                                            console.log("加签成功！");
                                            if (vm.appCenterLoan.messageFlag === 'Y') {
                                                $state.go('app.erv_notification');
                                            } else {
                                                $state.go('app.approvalList');
                                            }
                                        } else {
                                            PublicFunction.showToast(res.data.error.message);//加签失败，$filter('translate')('approval.sign.signing .failed')
                                            console.log("加签失败：" + res.data.error.message);
                                        }
                                    }, function (error) {
                                        PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                                        console.log("请求加签失败： " + angular.toJson(error));
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
                PageValueService.set("appCenterLoan", {});
                if (vm.appCenterLoan.messageFlag === 'Y') {
                    $state.go('app.erv_notification');
                } else {
                    if (vm.type == 'approval') {//审批中心list
                        $state.go('app.approvalList', {"status": vm.status});
                    } else if (vm.type == 'approvalReq') {//审批中心申请单查看关联借款跳转
                        $state.go('app.loanList');
                    } else if (vm.type == 'req') {//申请单模块
                        $state.go('app.reqList', {"status": vm.status});
                    } else {
                        $state.go('app.tab_erv.homepage');
                    }
                }

            };
        }]);

