/**
 * Created by Hurong on 2017/8/2.
 *  审批申请页面-查看借款项目
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.paymentItem', {
                cache: false,
                url: '/paymentItem',
                data: {
                    roles: []
                },
                params: {
                    item: null,
                    approvalPayment: null,
                    status: '',
                    passFlag: '',
                    type: 'approval'
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/approval_center/payment/paymentItem.html',
                        controller: 'paymentItemController',
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
    .controller('paymentItemController', ['$scope', '$filter', '$ionicHistory', '$document', 'Auth', '$state',
        '$ionicLoading', '$timeout', '$stateParams', 'PublicFunction',
        function ($scope, $filter, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, $stateParams,
                  PublicFunction) {
            var vm = this;
            vm.item = $stateParams.item;
            $scope.goBack = function () {
                /* if ($ionicHistory.backView()) {
                 $ionicHistory.goBack();
                 } else {
                 $state.go('app.approvalList');
                 }*/
                var params = {
                    approvalPayment: $stateParams.approvalPayment,
                    status: $stateParams.status,
                    passFlag: $stateParams.passFlag,
                    type: $stateParams.type,
                }
                $state.go('app.approvalPayment', params);
            };


        }]);

