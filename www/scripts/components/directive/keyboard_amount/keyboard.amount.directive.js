/**
 * Created by Yuko on 17/3/29.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('keyboardAmount', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                amount: '=',    // 数字
                equational: '=',    // 表达式
                finish: '&'     // 点击OK回调函数
            },
            templateUrl: 'scripts/components/directive/keyboard_amount/keyboard.amount.directive.html',
            controller: 'com.handchina.hly.KeyboardAmountDirectiveController'
        }
    }])
    .controller('com.handchina.hly.KeyboardAmountDirectiveController', [
        '$scope', '$filter', '$ionicLoading', '$timeout',
        function ($scope, $filter, $ionicLoading, $timeout) {
            $scope.view = {
                equational: '',
                originAmount: 0,
                isSymbol: false,
                isZero: false,
                numList: [],
                operationList: [],
                hasCalculate: false,
                isNum: true,
                firstEnter: true,
                hasNumber: false,
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                goBack: function () {
                    try {
                        $scope.amount = eval($scope.amount);
                        $scope.amount = $scope.amount.toFixed(2);
                        // 延时等待金额改变
                        $timeout(function() {
                            $scope.finish();
                        }, 10)
                    } catch (error){
                        $scope.amount = 0;
                        $scope.equational = '';
                        $scope.view.openWarningPopup($filter('translate')('status.Please.enter.the.legal.amount'));//请输入合法的金额
                    }
                },
                push: function (event, text) {
                    event.preventDefault();
                    event.stopPropagation();

                    if (text === '+' || text === '-' || text === 'x' || text === '/') {
                        $scope.view.isZero = false;
                        if ($scope.view.firstEnter) {
                            $scope.equational = $scope.amount.toString();
                            $scope.view.firstEnter = false;
                        }
                        $scope.view.hasCalculate = false;
                        $scope.view.isNum = false;
                        if ($scope.view.isSymbol) {
                            $scope.equational = $scope.equational.substring(0, $scope.equational.length - 1);
                            $scope.equational += text;
                        } else {
                            $scope.view.isSymbol = true;
                            $scope.view.equal = $scope.equational.replace(/x/g, "*");
                            try{
                                $scope.amount = eval($scope.view.equal);
                                $scope.equational = $scope.amount + text;
                            }catch (error) {
                                $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                            }
                        }
                    }
                    else {
                        if (text === '.') {
                            if ($scope.equational === '' || $scope.equational === null || $scope.equational.substr($scope.equational.length - 1) === '.') {
                                $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                            } else {
                                $scope.view.isSymbol = false;
                                $scope.view.hasNumber = true;
                                $scope.view.isZero = false;
                                if ($scope.view.hasCalculate) {
                                    $scope.equational = text;
                                    $scope.amount = parseInt($scope.equational);
                                    $scope.view.hasCalculate = false;
                                } else {
                                    $scope.equational += text;
                                    if ($scope.view.firstEnter) {
                                        $scope.amount = $scope.equational;
                                    }
                                }
                            }
                        } else if (text === '0') {
                            if ($scope.view.isZero) {
                                $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                            } else {
                                if ($scope.equational === '' || $scope.equational === null || $scope.view.isSymbol) {
                                    $scope.view.isZero = true;
                                }
                                $scope.view.isSymbol = false;
                                $scope.view.hasNumber = true;
                                if ($scope.view.hasCalculate) {
                                    $scope.equational = text;
                                    $scope.amount = parseInt($scope.equational);
                                    $scope.view.hasCalculate = false;
                                } else {
                                    $scope.equational += text;
                                    if ($scope.view.firstEnter) {
                                        $scope.amount = $scope.equational;
                                    }
                                }
                            }
                        } else {
                            if ($scope.view.isZero) {
                                $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                            } else {
                                $scope.view.isSymbol = false;
                                $scope.view.hasNumber = true;
                                $scope.view.isZero = false;
                                if ($scope.view.hasCalculate) {
                                    $scope.equational = text;
                                    $scope.amount = parseInt($scope.equational);
                                    $scope.view.hasCalculate = false;
                                } else {
                                    $scope.equational += text;
                                    if ($scope.view.firstEnter) {
                                        $scope.amount = $scope.equational;
                                    }
                                }
                            }
                        }
                    }
                },
                clear: function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $scope.equational = '';
                    $scope.amount = 0;
                    $scope.view.isZero = false;
                    $scope.view.hasCalculate = true;
                },
                clearOne: function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if($scope.equational.length > 0){
                        $scope.equational = $scope.equational.substring(0, $scope.equational.length - 1);
                        if ($scope.view.isSymbol) {
                            $scope.view.isSymbol = false;
                        }
                    }
                },
                calculate: function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if ($scope.view.isSymbol) {

                    } else {
                        $scope.view.equal = $scope.equational.replace(/x/g, "*");
                        try{
                            $scope.amount = eval($scope.view.equal);
                            if(!isFinite($scope.amount)){
                                $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                                return
                            }
                            $scope.view.hasCalculate = true;
                        }catch (error) {
                            $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                        }
                    }
                },
                calculationOver: function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if ($scope.view.isSymbol) {
                        $scope.equational = '';
                        $scope.view.hasCalculate = false;
                        $scope.view.isSymbol = false;
                        $scope.view.goBack();
                    } else {
                        if (!$scope.view.firstEnter) {
                            $scope.view.equal = $scope.equational.replace(/x/g, "*");
                            try{
                                $scope.amount = eval($scope.view.equal);
                                if(!isFinite($scope.amount)){
                                    $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                                    return
                                }
                                $scope.equational = '';
                                $scope.view.hasCalculate = false;
                                $scope.view.isSymbol = false;
                                $scope.view.firstEnter = true;
                                $scope.view.goBack();
                            }catch (error) {
                                $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                            }
                        } else {
                            $scope.equational = '';
                            $scope.view.hasCalculate = false;
                            $scope.view.isSymbol = false;
                            $scope.view.goBack();
                        }
                    }
                }
            };

            var init = function () {
                $scope.view.isNum = true;
                $scope.view.firstEnter = true;
                $scope.view.isSymbol = false;
                $scope.view.hasCalculate = false;
                $scope.view.hasNumber = false;
                $scope.equational = '';
                $scope.view.isZero = false;
                $scope.view.originAmount = $scope.amount;
            };
            init()

        }]);
