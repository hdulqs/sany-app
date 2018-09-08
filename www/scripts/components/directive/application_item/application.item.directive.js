/**
 * Created by Yuko on 16/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('applicationItem', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                item: '=item',
                originCurrencyCode:'=',
                canDelete: '=',
                isShowType: '=',
                withdraw: '=',
                isHideState: '=',
                deleteTravel: '&',
                goDetail: '&',
                withdrawTravel: '&',
                canApproval: '=',
                agree: '&',
                reject: '&',
                //code: '=',
                canClose: '=?', //停用
                closeTravel: '&',
                canRestart: '=?',  //启用
                restartTravel: '&'
            },
            templateUrl: 'scripts/components/directive/application_item/application.item.directive.tpl.html',
            controller: 'com.handchina.hly.ApplicationItemDirectiveController'
        }
    }])
    .controller('com.handchina.hly.ApplicationItemDirectiveController', [
        '$scope', 'CurrencyCodeService',
        function ($scope, CurrencyCodeService) {
            if ($scope.item.warning) {
                $scope.item.errorMsg = JSON.parse($scope.item.warning);
            }
            //code不用了,code代表以前的
            //if($scope.item.type===2005){
            //     $scope.code = CurrencyCodeService.getCurrencySymbol($scope.item.loanApplication.currencyCode);
            //}else{
            //    if($scope.item.travelBookerApplication){
            //        $scope.code = CurrencyCodeService.getCurrencySymbol($scope.item.travelBookerApplication.currencyCode);
            //    }else{
            //        $scope.code = CurrencyCodeService.getCurrencySymbol("CNY");
            //    }
            //}

        }]);


