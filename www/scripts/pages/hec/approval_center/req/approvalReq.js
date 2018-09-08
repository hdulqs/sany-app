/**
 * Created by Hurong on 2017/8/2.
 *  审批申请页面
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.approvalReq', {
                cache: false,
                url: '/approvalReq',
                params: {},
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/approval_center/req/approvalReq.html',
                        controller: 'approvalReqController',
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
    .controller('approvalReqController', ['$scope', '$filter', '$q', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading',
        '$timeout', '$ionicPopup', 'LocalStorageKeys', '$ionicModal', 'HecbempService', 'PublicFunction', '$stateParams',
        'approvalService', 'approvalRecordService', 'ReqListService', 'HecImageService', 'PageValueService',
        function ($scope, $filter, $q, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, $ionicPopup,
                  LocalStorageKeys, $ionicModal, HecbempService, PublicFunction, $stateParams, approvalService,
                  approvalRecordService, ReqListService, HecImageService, PageValueService) {
            var vm = this;
            //初始化page
            vm.initPage = initPage;
            //获取申请单类型reqType
            vm.getReqType = getReqType;
            //跳转关联借款信息列表
            vm.goReqLoanList = goReqLoanList;
            //审批拒绝
            vm.refuseApproval = refuseApproval;
            //审批同意
            vm.passApproval = passApproval;
            //跳转行详情页面
            vm.goDetail = goDetail;
            //收回待审批单据
            vm.takeBack = takeBack;
            //显示加签弹出框
            vm.showSignPopup = showSignPopup;
            //选择加签人的modal
            vm.chooseEmp = chooseEmp;
            //参数
            vm.appCenterReq = PageValueService.get("appCenterReq");
            vm.type = vm.appCenterReq.type;//approval:审批中心模块、req申请单模块
            console.log('type：' + vm.type);
            vm.passFlag = vm.appCenterReq.passFlag;
            vm.status = vm.appCenterReq.status;
            vm.approvalReq = vm.appCenterReq.approvalReq;
            if (vm.approvalReq != null) {
                vm.headerId = vm.approvalReq.instance_param;
                vm.recordId = vm.approvalReq.record_id;
                vm.instanceId = vm.approvalReq.instance_id;
                vm.curr_approve_name = vm.approvalReq.curr_approve_name;//申请单模块待审批单据的当前审批人
                console.log("vm.headerId==" + vm.headerId + "====recordId== " + vm.recordId + "====vm.instanceId==" + vm.instanceId);
            }
            vm.header = {};
            vm.line = [];
            //审批中心待审批标志
            vm.waitApprovalFlag = false;
            //是否有借款信息的标志
            vm.hasLoanFlag = false;
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
                //判断差旅申请单、标准申请单
                vm.getReqType().then(function (data) {
                    if (data === "S") {
                        PublicFunction.showLoading(200);
                        var headerType = '';
                        var lineType = '';
                        if (vm.reqType == "TRAVEL") {  //差旅申请
                            headerType = 'center_internal_requisition_head';
                            lineType = 'center_internal_requisition_line';
                        } else if (vm.reqType == "STANDARD") {//标准申请
                            headerType = 'center_standard_requisition_head';
                            lineType = 'center_standard_requisition_line';
                        }

                        //加载附件
                        HecImageService.downloadImage("req", vm.headerId).then(function (res) {
                            vm.attachments = res;
                        });

                        //审批申请信息头
                        approvalService.searchApprovalReq(headerType, vm.headerId).then(function (res) {
                            if (res.data.success) {
                                if(res.data.result.pageCount > 0){
                                    vm.header = res.data.result.record[0];
                                    //申请单模块跳转，根据requisition_status判断单据状态
                                    if (PublicFunction.isNull(vm.status)) {
                                        var status = vm.header.requisition_status;
                                        console.log("requisition_status：" + status);
                                        if (status === "COMPLETELY_APPROVED") {
                                            vm.status = 'hasApproval';
                                            vm.passFlag = 'Y';
                                        } else if (status === "SUBMITTED") {
                                            vm.status = 'waitApproval';
                                            vm.passFlag = 'N';
                                        }
                                    }

                                    //审批申请信息行
                                    approvalService.searchApprovalReq(lineType, vm.headerId).then((function (res) {
                                        if (res.data.success && res.data.result.pageCount > 0) {
                                            vm.line = res.data.result.record;
                                            for (var i = 0; i < vm.line.length; i++) {
                                                if (vm.reqType == "TRAVEL") {
                                                    vm.line[i].date_from = PublicFunction.dataFormat(vm.line[i].date_from);
                                                    vm.line[i].date_to = PublicFunction.dataFormat(vm.line[i].date_to);
                                                }
                                            }
                                        }
                                    }), function (error) {
                                        PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                                        console.log("请求获取单据行数据失败： " + angular.toJson(error));
                                    });

                                    //获取申请单的借款信息
                                    approvalService.searchReqLoanList(vm.headerId).then(function (res) {
                                        if (res.data.success) {
                                            if (res.data.result.pageCount > 0) {
                                                console.log("有借款信息");
                                                vm.hasLoanFlag = true;
                                                vm.reqLoanList = res.data.result.record;
                                                // console.log("vm.reqLoanList:"+angular.toJson(vm.reqLoanList));
                                            } else {
                                                console.log("没有借款信息");
                                                vm.hasLoanFlag = false;
                                                vm.reqLoanList = [];
                                            }
                                        } else {
                                            console.log("获取申请单的借款信息失败" + vm.headerId + "： " + res.data.error.message);
                                            PublicFunction.showToast(res.data.error.message);  // 获取申请单单据类型失败!
                                        }
                                    }, function (error) {
                                        PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
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
                                                approvalRecordService.reqRecord(vm.headerId).then(function (res) {
                                                    if (res.data.success) {
                                                        if(res.data.result.pageCount > 0){
                                                            vm.approvalRecordList = res.data.result.record;
                                                        }
                                                    }
                                                }, function (error) {
                                                    PublicFunction.showToast($filter('translate')('error.get.req.record.failed'));//获取申请单单据跟踪记录失败!
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
                        }, function (error) {
                            PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                            console.log("请求获取单据头数据失败： " + angular.toJson(error));
                        });
                    }
                });
            }

            vm.initPage();


            /**
             * 获取申请单类型
             */
            function getReqType() {
                var deferred = $q.defer();
                PublicFunction.showLoading(200);
                //判断差旅申请单、标准申请单
                approvalService.getReqType(vm.headerId).then(function (res) {
                    if (res.data.success && res.data.result.pageCount > 0) {
                        deferred.resolve("S");
                        vm.reqType = res.data.result.record[0].document_page_type;//  reqType=='STANDARD'  reqType=='TRAVEL'
                        console.log("申请单类型reqType：" + vm.reqType);
                        $ionicLoading.hide();
                    } else {
                        deferred.resolve("E");
                        console.log("获取申请单单据类型失败" + vm.headerId + "： " + res.data.error.message);
                        PublicFunction.showToast($filter('translate')('error.get.requisition.type.failed') + "： " + res.data.error.message);  // 获取申请单单据类型失败!
                    }
                }, function (error) {
                    deferred.resolve("E");
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                });
                return deferred.promise;
            }

            /**
             * 跳转关联借款信息列表
             */
            function goReqLoanList() {
                PageValueService.set("loanList", vm.reqLoanList);
                $state.go("app.loanList");
            }

            /**
             * 查看申请单行详情
             * @param itemLine 申请行对象
             * @param type 跳转类型：approval:审批中心模块、req申请单模块
             */
            function goDetail(item) {
                var params = {
                    item: item,
                    reqType: vm.reqType,
                }
                $state.go('app.budgetItem', params);
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
                    if (res.data.success) {
                        console.log("已拒绝");
                        if (vm.appCenterReq.messageFlag === 'Y') {
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
                /*if (vm.approvalText == "") {
                 PublicFunction.showToast($filter('translate')('error.please.enter.the.reason.for.approval'));//请输入审批意见
                 return;
                 }*/
                PublicFunction.showLoading();
                approvalService.passApproval(vm.recordId, vm.agreeActionId, vm.approvalText).then(function (res) {
                    if (res.data.success) {
                        console.log("已通过");
                        if (vm.appCenterReq.messageFlag === 'Y') {
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
                    /* template: '<div class="row"><div class="col col-30">加签给：</div><input class="col col-60" placeholder="请输入" type="text" ng-model="vm.selectedEmp.name" disabled style="border: 1px solid;"><div style="border: 1px solid;background: white;width: 20px;text-align: center" ng-click="vm.chooseEmp()">...</div></div>' +
                     '<div class="row" style="margin: 3px"><span >加签说明：</span></div><div style="width: 60%;margin-left: 33%">' +
                     '<textarea style="border: 1px solid" ng-model="vm.signText"  cols="24" rows="7"  placeholder="请输入加签说明！"></textarea></div></div>',*/
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
                                        if (res.data.success) {
                                            console.log("加签成功！headerId：" + vm.headerId + "===recordId" + vm.recordId + "===员工：" + vm.selectedEmp.name);
                                            if (vm.appCenterReq.messageFlag === 'Y') {
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

            $scope.goBack = function () {
                PageValueService.set("appCenterReq", {});
                if (vm.appCenterReq.messageFlag === 'Y') {
                    $state.go('app.erv_notification');
                } else {
                    if (vm.type == 'approval') {
                        $state.go('app.approvalList', {"status": vm.status});
                    } else if (vm.type == 'req') {
                        $state.go('app.reqList', {"status": vm.status});
                    } else {
                        $state.go('app.tab_erv.homepage');
                    }
                }
            };

            $scope.$on('$ionicView.leave', function (event, viewData) {
                $scope.modal.remove();
            });
        }])


