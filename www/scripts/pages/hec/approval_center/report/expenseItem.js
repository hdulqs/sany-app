/**
 * Created by Hurong on 2017/8/8.
 *  报销审批页面-查看费用项目
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.expenseItem', {
                cache: false,
                url: '/expenseItem',
                data: {
                    roles: []
                },
                params: {
                    item: null,
                    type: 'approval',//approval:审批中心模块、report:报销单模块
                    status: '',
                    headerId: ''//报销单待提交模块headerId
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/approval_center/report/expenseItem.html',
                        controller: 'expenseItemController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecapproval');
                        $translatePartialLoader.addPart('hecexp.common');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('expenseItemController', ['$scope', '$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading',
        '$timeout', '$stateParams', 'approvalService', 'PublicFunction', 'HecImageService',
        function ($scope, $filter, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, $stateParams
            , approvalService, PublicFunction, HecImageService) {
            var vm = this;
            vm.type = $stateParams.type;
            console.log("报销item type:" + vm.type);
            vm.status = $stateParams.status;
            //行对象
            vm.item = $stateParams.item;
            //行明细信息字段
            vm.lineDetail = [];
            vm.attachments = [];   //附件

            //初始化页面
            vm.initPage = initPage;
            vm.initPage();

            function initPage() {
                if (vm.item != null) {
                    //加载附件
                    HecImageService.downloadImage("erl", vm.item.barcode).then(function (res) {
                        vm.attachments = res;
                    });
                    //获取报销行：明细字段
                    var lineId = vm.item.exp_report_line_id;//1943;
                    PublicFunction.showLoading(200);
                    console.log("lineId======" + lineId);
                    approvalService.searchExpenseLineDetail(lineId).then(function (res) {
                        var pageCnt = res.data.result.pageCount;
                        if (pageCnt > 0) {
                            vm.lineDetail = res.data.result.record;
                        }
                        $ionicLoading.hide();
                    }, function (error) {
                        console.log("请求获取行明细信息失败： " + angular.toJson(error));
                        PublicFunction.showToast($filter('translate')('error.get.line.detail.failed'));  // 获取行明细信息失败!
                    });
                }
            }

            $scope.goBack = function () {
                /*if ($ionicHistory.backView()) {
                 $ionicHistory.goBack();
                 } else {
                 if (vm.type == 'approval') {
                 $state.go('app.approvalList');
                 } else if (vm.type == 'report') {
                 $state.go('app.tab_erv.reportList');
                 }
                 }*/
                if (vm.type == 'approval') {
                    $state.go('app.approvalReport');
                } else if (vm.type == 'report') {
                    if (vm.status == 'waitSubmit') {
                        var params = {
                            headerId: $stateParams.headerId,
                        }
                        $state.go('app.reportHeader', params);
                    } else {
                        $state.go('app.approvalReport');
                    }
                } else {
                    $state.go('app.tab_erv.homepage');
                }
            };
        }]);

