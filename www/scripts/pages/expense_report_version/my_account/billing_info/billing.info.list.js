'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.billing_info_list', {
            url: '/billing/info/list',
            cache: false,
            views: {
                'page-content': {
                    templateUrl: 'scripts/pages/my_account/billing_info/billing.info.list.tpl.html',
                    controller: 'com.handchina.hly.BillingInfoListController'
                }
            }
        })
    }])
    .controller('com.handchina.hly.BillingInfoListController', ['$scope', function ($scope) {

    }]);
