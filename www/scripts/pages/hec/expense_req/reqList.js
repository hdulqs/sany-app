/**
 * Created by Dawn on 2017/8/1.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.reqList', {
                cache: false,
                url: '/reqList',
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_req/reqList.html',
                        controller: 'reqListCtrl',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    status: "waitSubmit"
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecexp.req');
                        $translatePartialLoader.addPart('hecapproval');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('reqListCtrl', ['$scope', '$filter', '$ionicPopover', '$state', '$ionicLoading', 'ReqListService', 'LocalStorageKeys', 'PublicFunction', 'PageValueService',
        '$stateParams', '$q',
        function ($scope, $filter, $ionicPopover, $state, $ionicLoading, ReqListService, LocalStorageKeys, PublicFunction, PageValueService
            , $stateParams, $q) {
            var vm = this;
            //切换不同申请状态页面
            vm.changeTab = changeTab;
            //获取数据
            vm.loadMore = loadMore;
            //跳转到相应的明细页面
            vm.goDetail = goDetail;
            //删除整单申请
            vm.deleteReq = deleteReq;
            //删除整单借款申请
            vm.deleteLoanReq = deleteLoanReq;
            //收回待审批申请单
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
            vm.size =  LocalStorageKeys.hec_pagesize;
            //添加图标的状态
            vm.markStatus = false;
            //申请单数据
            vm.reqList = [];
            //页面跳转，传参：审批状态(waitSubmit/未提交 待审批/waitApproval 已审批/hasApproval)
            vm.status = $stateParams.status;
            //申请类型(ExpReq/费用申请  LoanReq/借款申请 ExpReim/费用报销)
            $scope.reqTypeList = [{
                "formType": "ExpReq", "formName": $filter('translate')('req.list.expense.application')
            }, {
                "formType": "LoanReq", "formName": $filter('translate')('req.list.loan.application')
            }];

            //初始化页面
            vm.loadMore(vm.status, 1);

            /**
             * 根据状态切换Tab
             * @param status 状态(待提交/waitSubmit  待审批/waitApproval  审批通过/hasApproval)
             */
            function changeTab(status) {
                vm.nothing = false;
                vm.status = status;
                vm.reqList = [];
                vm.page = 1;
                vm.pageCnt = 0;
                vm.loadMore(status, 1);
            }

            /**
             * 加载数据
             * @param tab页类型
             * @param page 加载页数
             */
            function loadMore(dateType, page) {
                PageValueService.set("reqHeader", "");
                PageValueService.set("reqRefLoanInfo", "");
                if (dateType == 'waitSubmit') {
                    dateType = "expense_req_pending";
                } else if (dateType == 'waitApproval') {
                    dateType = "expense_req_approve_pending";
                } else if (dateType == 'hasApproval') {
                    dateType = "expense_req_approval";
                }
                vm.page = page;
                //获取申请单列表数据
                PublicFunction.showLoading(300);
                ReqListService.initReqList(dateType, page, vm.size).then(function (res) {
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
                            vm.reqList = vm.reqList.concat(res.data.result.record);
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
             * 删除申请单
             * @param reqHeaderId 申请单头ID
             */
            function deleteReq(reqHeaderId) {
                PublicFunction.showLoading(300);
                console.log("删除 reqHeaderId:" + reqHeaderId);
                ReqListService.deleteReq(reqHeaderId).then(function (res) {
                    if (res.data.success) {
                        console.log("删除成功");
                        $state.go('app.reqList', {status: vm.status}, {reload: true});
                    } else {
                        console.log("删除失败： " + res.data.error.message);
                        PublicFunction.showToast($filter('translate')('req.message.error.delete') + ": " + res.data.error.message);//删除失败!
                    }
                }, function (error) {
                    console.log("请求删除申请单失败： " + angular.toJson(error));
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                });
            };

            /**
             * 删除申请单
             * @param reqHeaderId 借款单头ID
             */
            function deleteLoanReq(reqHeaderId) {
                PublicFunction.showLoading(300);
                console.log("删除 reqHeaderId:" + reqHeaderId);
                ReqListService.deleteLoanReq(reqHeaderId).then(function (res) {
                    if (res.data.success) {
                        console.log("删除成功");
                        $state.go('app.reqList', {status: vm.status}, {reload: true});
                    } else {
                        console.log("删除失败： " + res.data.error.message);
                        PublicFunction.showToast($filter('translate')('req.message.error.delete') + ": " + res.data.error.message);//删除失败!
                    }
                }, function (error) {
                    console.log("请求删除申请单失败： " + angular.toJson(error));
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
                ReqListService.takeBack(instanceId).then(function (res) {
                    if (res.data.success) {
                        console.log('收回成功');
                        $state.go('app.reqList', {status: vm.status}, {reload: true});
                    } else {
                        console.log("待审批申单据收回失败： " + res.data.error.message);
                        PublicFunction.showToast($filter('translate')('error.take.back.failed') + ": " + res.data.error.message);//收回失败
                    }
                }, function (error) {
                    console.log("请求待审批单据收回失败： " + angular.toJson(error));
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                });
            };

            /**
             * 查看单据明细
             * @param req 单据
             * @param status 审批状态(waitSubmit/未提交 待审批/waitApproval 已审批/hasApproval)
             */
            function goDetail(req, status) {
                PageValueService.set("comDocData", "");
                var reqType = req.requisition_type;//单据类型
                var reqTypeCode = req.type_code;//单据Code
                var reqHeaderId = req.exp_requisition_header_id;//单据Id

                if (status === "waitSubmit") {
                    if(reqType == 'EXP_REQUISITION'){//申请单
                        if (reqTypeCode == '1010' || reqTypeCode == '1015') {//差旅申请
                            $state.go('app.travelReqHeader', {"reqHeaderId": reqHeaderId});
                        }else{ //通用申请
                            $state.go('app.dailyReqHeader', {"reqHeaderId": reqHeaderId});
                        }
                    }else if(reqType == 'PAYMENT_REQUISITION'){//借款单
                        $state.go('app.loanReqHeader', {"loanReqHeaderId": reqHeaderId});
                    }
                } else if (status == 'waitApproval') {
                    reqHeaderId = req.instance_param;//待审批使用instance_param
                    reqType = req.workflow_category;//待审批使用workflow_category
                    if (reqType == 'EXP_REQUISITION') {
                        var params = {
                            "approvalReq": {
                                instance_param: reqHeaderId,
                                instance_id: req.instance_id,
                                curr_approve_name: req.curr_approve_name
                            },
                            'type': 'req',
                            'status':status
                        };
                        PageValueService.set("appCenterReq", params);
                        $state.go('app.approvalReq');
                    } else if (reqType == 'PAYMENT_REQUISITION') {//借款申请单
                        var params = {
                            "approvalLoan": {
                                instance_param: reqHeaderId,
                                instance_id: req.instance_id,
                                curr_approve_name: req.curr_approve_name
                            },
                            'type': 'req',
                            'status':status
                        };
                        PageValueService.set("appCenterLoan", params);
                        $state.go('app.approvalLoan');
                    } else if (approvalType == 'ACP_REQUISITION') {//付款申请单
                        PublicFunction.showToast($filter('translate')('error.wait.develop'));
                    }
                } else if (status == "hasApproval") {
                    //判断单据是否已经全部审批完成（工作流结束）
                    var passFlag = 'N';
                    if (req.requisition_status_value == 'COMPLETELY_APPROVED' || req.requisition_status_value == 'APPROVED') {
                        passFlag = 'Y';
                    }
                    if(reqType == 'EXP_REQUISITION'){//申请单
                        var params = {
                            "approvalReq": {instance_param: reqHeaderId},
                            'type': 'req',
                            'status':status,
                            'passFlag':passFlag
                        };
                        console.log("申请单已审批跳转参数：  " + angular.toJson(params));
                        PageValueService.set("appCenterReq", params);
                        $state.go('app.approvalReq', params);
                    }else if(reqType == 'PAYMENT_REQUISITION'){//借款单
                        var params = {
                            "approvalLoan": {
                                instance_param: reqHeaderId,
                            },
                            'type': 'req',
                            'status':status,
                            'passFlag':passFlag
                        };
                        console.log("借款单待审批跳转参数:" + angular.toJson(params));
                        PageValueService.set("appCenterLoan", params);
                        $state.go('app.approvalLoan');
                    }
                }
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
                vm.reqList = [];
                vm.loadMore(status, 1);
                $scope.$broadcast('scroll.refreshComplete');
            };

            $ionicPopover.fromTemplateUrl("scripts/pages/hec/menu.popover.tpl.html", {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });

            $scope.$on('popover.hidden', function () {
                vm.markStatus = false;
            });

            //选择申请的类型
            $scope.selectReqType = function (item) {
                vm.markStatus = false;
                $scope.popover.hide();
                PageValueService.set("comDocData", "");
                $state.go('app.companyExpType', {chooseValue: item.formType});
            };

            $scope.$on('popover.hidden', function () {
                vm.markStatus = false;
            });

            /*显示添加申请的菜单*/
            $scope.showReqMenu = function (ev) {
                vm.markStatus = !vm.markStatus;
                if (vm.markStatus) {
                    // 如果只有一种有效申请, 直接跳到对应申请
                    if ($scope.reqTypeList.length === 1) {
                        $scope.selectReqType($scope.reqTypeList[0]);
                    } else {
                        $scope.popover.show(ev);
                    }
                }
            };

            //返回
            function goBack() {
                $state.go('app.tab_erv.homepage');
            };
        }]);

