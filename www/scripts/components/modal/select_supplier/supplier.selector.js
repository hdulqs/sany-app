/**
 * Created by Yuko on 16/9/8.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('supplierSelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                selectedSupplier: '=',
                readonly: '=',
                supplier: '=',
                textRight: '=?'
            },
            templateUrl: 'scripts/components/modal/select_supplier/supplier.selector.tpl.html',
            controller: 'com.handchina.huilianyi.SupplierSelectorDirectiveController'
        }
    }])
    .controller('com.handchina.huilianyi.SupplierSelectorDirectiveController', ['$scope', '$timeout', '$ionicActionSheet','$filter',
        function ($scope, $timeout, $ionicActionSheet,$filter) {
            $scope.view = {
                selectSupplier: function () {
                    if (!$scope.readonly) {
                        $scope.selectList = [];
                        var i = 0;
                        for (; i < $scope.supplier.length; i++) {
                            var item = {};
                            item.text = $scope.supplier[i].name;
                            $scope.selectList.push(item);
                        }
                        if (i === $scope.supplier.length) {
                            $scope.hideSheet = $ionicActionSheet.show({
                                buttons: $scope.selectList,
                                titleText: $filter('translate')('supplier_tpl.Please.select.a.supplier.new'),//请选择供应商
                                buttonClicked: function (index) {
                                    $scope.selectedSupplier = $scope.supplier[index];
                                    $scope.hideSheet();
                                }
                            });
                        }
                    }
                }
            }

        }]);

