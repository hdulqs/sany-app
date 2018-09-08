/**
 * Created by hly on 2016/12/14.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('amountInput',function(){
        return {
            restrict:'E',
            scope:{
                prompt:'@',
                amount:'='
            },
            template:'<input type="text" placeholder="prompt" ng-click="showKeyboard($event)" ng-model="amount"> ' +
            '<ion-digit-keyboard settings="keyboardSettings" ng-show="view.keyboardVisible"></ion-digit-keyboard>',
            controller:function($scope){
                $scope.keyboardSettings = {
                    resizeContent:{
                        //enable:true,
                        element: 'ion-content'
                    },
                    action: function(number) {
                        var decimal;
                        if ($scope.view.refundData.repaymentValue.indexOf('.') > -1) {
                            decimal = $scope.view.refundData.repaymentValue.split('.')[1];
                            if (decimal.length < $scope.view.decimalLenght) {
                                $scope.view.refundData.repaymentValue += number;
                            }
                        } else {
                            $scope.view.refundData.repaymentValue += number;
                        }
                    },
                    leftButton: {
                        html: '.',
                        action: function() {
                            var index =$scope.view.refundData.repaymentValue.indexOf('.');
                            if (index === -1) {
                                if ($scope.view.refundData.repaymentValue) {
                                    $scope.view.refundData.repaymentValue = $scope.view.refundData.repaymentValue + '.';
                                } else {
                                    $scope.view.refundData.repaymentValue = '0.';
                                }
                            } else {
                                if (index === 0) {
                                    $scope.view.refundData.repaymentValue = '0.00';
                                } else {
                                    if (!$scope.view.refundData.repaymentValue.split('.')[1]) {
                                        $scope.view.refundData.repaymentValue = $scope.view.refundData.repaymentValue.slice(0, index) + '.00';
                                    }
                                }
                            }
                        }
                    },
                    rightButton: {
                        html: '<i class="icon ion-backspace"></i>',
                        action: function() {
                            $scope.view.refundData.repaymentValue= $scope.view.refundData.repaymentValue.slice(0, -1);
                        }
                    }
                };

            }
        }

    });
