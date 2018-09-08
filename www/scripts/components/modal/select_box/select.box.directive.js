/**
 * Created by Yuko on 16/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('selectBoxModal', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                field: '='
            },
            templateUrl: 'scripts/components/modal/select_box/select.box.tpl.html',
            controller: 'com.handchina.huilianyi.SelectBoxController'
        }
    }])
    .controller('com.handchina.huilianyi.SelectBoxController', ['$scope', '$ionicModal', 'UserService', 'ParseLinks', '$ionicLoading',
        function ($scope, $ionicModal, UserService, ParseLinks, $ionicLoading) {
            $scope.keyword = '';
            $scope.view = {
                cancel: function () {
                    $scope.field.selectValue = angular.copy($scope.originValue);
                    $scope.selectBox.hide();
                },
                openSelector: function () {
                    $scope.originValue = angular.copy($scope.field.selectValue);
                    $scope.selectBox.show();
                },
                selector: function (item) {
                    var index = $scope.field.selectID.indexOf(item.id);
                    if(index > -1){
                        $scope.field.selectID.splice(index, 1);
                        for(var i = 0; i < $scope.field.selectValue.length; i++){
                            if($scope.field.selectValue[i].id === item.id){
                                $scope.field.selectValue.splice(i, 1);
                                break;
                            }
                        }
                    } else {
                        if($scope.field.type == '0'){
                            $scope.field.selectID = [];
                            $scope.field.selectValue = [];
                            $scope.field.selectValue.push(item);
                            $scope.selectBox.hide();
                        } else {
                            $scope.field.selectValue.push(item);
                        }
                        $scope.field.selectID.push(item.id);
                    }
                }
            }
            $ionicModal.fromTemplateUrl('select.box.value.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.selectBox = modal;
            });
        }]);

