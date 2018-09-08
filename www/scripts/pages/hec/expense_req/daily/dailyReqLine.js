/**
 * Created by Dawn on 2017/8/3.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.dailyReqLine', {
                cache: false,
                url: '/dailyReqLine',
                data: {
                    roles: []
                },
                params: {
                    reqHeaderId: "",
                    reqLineId: "",
                    maxLineNum:""
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_req/daily/dailyReqLine.html',
                        controller: 'dailyReqLineCtrl',
                        controllerAs:'vm'
                    }
                },
                  resolve: {
                      mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                          $translatePartialLoader.addPart('components');
                          $translatePartialLoader.addPart('hecexp.req');
                          $translatePartialLoader.addPart('global');
                          return $translate.refresh();
                      }]
                  }
            })
    }])
    .controller('dailyReqLineCtrl', ['$scope','$filter', '$ionicHistory','$document', 'Auth', '$state', '$ionicLoading', '$timeout',
        'PublicFunction','ReqLineService','$q','PageValueService','$stateParams','$ionicPopup',
        function ($scope,  $filter,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,PublicFunction,ReqLineService
        ,$q,PageValueService,$stateParams,$ionicPopup) {
            var vm = this;
            //页面初始化
            vm.initPage = initPage;
            //保存申请单行信息
            vm.saveReqLine = saveReqLine;
            //需要监听的字段
            vm.watchString = watchString;
            //判断数据是否有修改
            vm.isChanged = isChanged;
            //验证申请行数据
            vm.validReqLine = validReqLine;
            //保存并新建另外一行行程
            vm.addNewLine = addNewLine;
            //回退按钮
            vm.goBack = goBack;
            vm.dataStr = "";
            vm.line = {};

            vm.isReadOnly = false;
            vm.reqLineId = $stateParams.reqLineId;
            vm.maxLineNum = $stateParams.maxLineNum;
            console.log("vm.maxLineNum:"+vm.maxLineNum);
            vm.reqHeaderId = $stateParams.reqHeaderId;
            vm.header = PageValueService.get("reqHeader");
            //项目lov：标题
            vm.dimPrompt = $filter('translate')('hec_lov.input.dimension.prompt');

            function initPage() {
                console.log("vm.reqLineId====" + vm.reqLineId);
                if (!PublicFunction.isNull(vm.reqLineId)) {
                    PublicFunction.showLoading(150);
                    ReqLineService.queryReqLines(vm.reqLineId).then(function (res) {
                        $ionicLoading.hide();
                        if (res.data.success) {
                            var result = res.data.result;
                            vm.line = result.record[0];
                            vm.dataStr = vm.watchString();
                        } else {
                            PublicFunction.showToast(res.data.error.message);  // 申请行查询失败
                        }
                    }, function (error) {
                        $ionicLoading.hide();
                        PublicFunction.showToast($filter('translate')('message.error.query'));  // 数据查询失败
                    });
                } else {
                    vm.line = {};
                    vm.line.exp_requisition_line_id = "";
                    vm.maxLineNum = vm.maxLineNum + 10;
                    vm.line.line_number = vm.maxLineNum;
                    vm.line.unit_id = vm.header.unit_id;
                    vm.line.unit_name = vm.header.unit_name;
                    vm.line.company_id = vm.header.company_id;
                    vm.line.company_short_name = vm.header.company_short_name;
                    vm.line.responsibility_center_id  = vm.header.responsibility_center_id;
                    vm.line.responsibility_center_name = vm.header.responsibility_center_name;
                    vm.line.expense_type_display = vm.header.expense_type_display;
                    vm.line.exp_requisition_header_id = vm.header.exp_requisition_header_id;
                    vm.line.period_name = $filter('date')(vm.header.requisition_date, 'yyyy-MM');//根据头上的日期截取业务期间
                    vm.line.currency_code = vm.header.currency_code;
                    vm.line.exchange_rate = vm.header.exchange_rate;
                    vm.line.position_id = vm.header.position_id;
                    vm.line.employee_id = vm.header.employee_id;
                    //初始化内部项目
                    vm.line.d2 = vm.header.value_description;
                    vm.line.e2 = vm.header.default_dim_value_id;
                    vm.line.exchange_rate_type = "HL001";
                    vm.line.exchange_rate_quotation = "DIRECT QUOTATION";
                    vm.line.payment_flag = "Y";
                    //事由：默认头上的
                    vm.line.description = vm.header.description;
                }
            }
            vm.initPage();

            /**
             * 保存差旅申请头信息
             * @param type M/手动点击保存按钮  A/程序自动保存
             */
            function saveReqLine(type) {
                var deferred = $q.defer();
                if (!vm.validReqLine()) {
                    deferred.resolve("E");
                    return deferred.promise;
                }

                if (!vm.isChanged()) {
                    console.log("数据未修改");
                    deferred.resolve("S");
                    if (type === "M") { //显示保存成功提示
                        //PublicFunction.showToast("没有修改数据，无需保存!");
                        $state.go('app.dailyReqHeader', {reqHeaderId: vm.reqHeaderId});
                    }
                    return deferred.promise;
                }

                vm.line.price = vm.line.requisition_amount;
                vm.line.primary_quantity = 1;

                var params = vm.line;
                //调用差旅申请行保存接口
                PublicFunction.showLoading(250);
                ReqLineService.saveDailyReqLine(params).success(function (res) {
                    $ionicLoading.hide();
                    if (res.success) {
                        if (type === "M") { //点击保存按钮保存
                            PublicFunction.showToast($filter('translate')('common.save.successfully'));
                            $state.go('app.dailyReqHeader', {reqHeaderId: vm.reqHeaderId});
                        }
                        vm.line.exp_requisition_line_id = res.result.record.exp_requisition_line_id;
                        vm.reqLineId = vm.line.exp_requisition_line_id;
                        console.log("exp_requisition_line_id === " + vm.line.exp_requisition_line_id);
                        vm.dataStr = vm.watchString();
                        deferred.resolve("S");
                    } else {
                        console.log("保存出错,错误信息：" + angular.toJson(res.error.message));
                        PublicFunction.showToast(res.error.message);
                        deferred.reject("E");
                    }
                }).error(function (error) {
                    $ionicLoading.hide();
                    PublicFunction.showToast($filter('translate')('error.request'));
                    console.log("失败信息" + angular.toJson(error));
                    deferred.reject("E");
                });
                return deferred.promise;
            }

            /**
             * 保存并新建另外一行行程
             */
            function addNewLine() {
                vm.saveReqLine("").then(function (data) {
                    if (data === "S") {
                        $state.go('app.dailyReqLine', {
                            reqHeaderId: vm.reqHeaderId,
                            reqLineId: "",
                            maxLineNum: vm.maxLineNum
                        });
                    }
                });
            }

            /**
             * 验证申请行信息(字段必输性验证)
             * @returns {boolean}
             */
            function validReqLine() {
                if (PublicFunction.isNull(vm.header.unit_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.unit_name'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.responsibility_center_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.responsibility_center_name'));
                    return false;
                }

                if (PublicFunction.isNull(vm.line.expense_type_display)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.expense_type_display'));
                    return false;
                }

                if (PublicFunction.isNull(vm.line.exp_req_item_display)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.exp_req_item'));
                    return false;
                }

                if (PublicFunction.isNull(vm.line.requisition_amount) || vm.line.requisition_amount == 0) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.amount'));
                    return false;
                }
                if (PublicFunction.isNull(vm.line.d2)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.project.name'));
                    return false;
                }
                return true;
            };

            function watchString() {
                var tmp = {
                    "unit_name": vm.line.unit_name,
                    "responsibility_center_name": vm.line.responsibility_center_name,
                    "expense_type_display": vm.line.unit_name,
                    "exp_req_item_display": vm.line.exp_req_item_display,
                    "requisition_amount": vm.line.requisition_amount,
                    "description": vm.line.description,
                    "d2": vm.line.d2,
                };
                return angular.toJson(tmp);
            }

            function isChanged() {
                var str = vm.watchString();
                //console.log("str====" + str);
                //console.log("vm.dataStr===" + vm.dataStr);
                if (str != vm.dataStr) {
                    return true;
                }
                console.log("没有修改数据");
                return false;
            }

            //监听报销类型
            $scope.$watch("vm.line.expense_type_id", function (newValue, oldValue) {
                if (!PublicFunction.isNull(newValue) && !PublicFunction.isNull(oldValue)) {
                    if (newValue != oldValue) {
                        vm.line.exp_req_item_id="";
                        vm.line.exp_req_item_display="";
                    }
                }
            });

            //监听金额
            $scope.$watch("vm.line.requisition_amount", function (newValue, oldValue) {
                var amount = vm.line.requisition_amount+"";
                if(amount.indexOf(".") != -1){
                    vm.line.requisition_amount = parseFloat(amount.substring(0,amount.indexOf(".") + 3));
                }
                vm.line.requisition_functional_amount = (vm.line.requisition_amount * vm.line.exchange_rate).toFixed(2);
            });

            $scope.showPopup = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('confirm.window.prompt'),//提示
                    template: $filter('translate')('confirm.window.Information.req.line'),//是否保存该差旅申请单行信息
                    cancelText: $filter('translate')('confirm.window.cancel'),//取消
                    okText: $filter('translate')('confirm.window.ok'),//确定
                    cssClass: 'delete-ordinary-application-popup'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        vm.saveReqLine("").then(function (data) {
                            if (data === "S") {
                                $state.go('app.dailyReqHeader', {reqHeaderId: vm.reqHeaderId});
                            }
                        });
                    } else {
                        $state.go('app.dailyReqHeader', {reqHeaderId: vm.reqHeaderId});
                    }
                });
            };

            function goBack() {
                if (vm.isChanged()) {
                    $scope.showPopup();
                } else {
                    $state.go('app.dailyReqHeader', {reqHeaderId: vm.reqHeaderId});
                }
            };
        }]);


