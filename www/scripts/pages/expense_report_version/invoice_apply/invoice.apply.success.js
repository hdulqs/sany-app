/**
 * Created by Yuko on 16/8/8.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.erv_invoice_apply_success', {
                url: '/erv/invoice/apply/success',
                cache: false,
                params: {
                  expense: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/invoice_apply/invoice.apply.success.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvInvoiceApplySuccessController'
                    }
                },
                resolve:{
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        //$translatePartialLoader.addPart('homepage');
                        $translatePartialLoader.addPart('invoice_apply');
                        return $translate.refresh();
                    }]
                }
            })

    }])
    .controller('com.handchina.huilianyi.ErvInvoiceApplySuccessController', ['$scope', '$state', '$stateParams',
        function ($scope,$state, $stateParams) {
            $scope.goExpense = function(){
                $state.go('app.tab_erv.expense_report');
            };
        }]);
