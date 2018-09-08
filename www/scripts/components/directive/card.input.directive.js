/**
 * Created by hly on 2016/12/9.
 */
'use strict';
angular.module('huilianyi.pages')
    .factory('cardLoading', ['PublicFunction', function (PublicFunction) {
        return {
            loading: function () {
                return PublicFunction.showToast($filter('translate')('status.Bank.account.only.Numbers'));//银行账号只能是数字
            },
            numberLoading:function(){
                return PublicFunction.showToast($filter('translate')('status.Please.enter.the.legal.amount'));//请输入合法的金额
            }
        }
    }])
    .directive('cardInput', ['cardLoading', function (cardLoading) {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope:{
              accountData:'='
            },
            link: function (scope, elements, attrs, ngModel) {
                var val;
                //处理初始值
                scope.$watch('accountData', function () {
                    val =scope.accountData;
                    if (val) {
                        getValue(val)
                    }
                });
                //处理keyup事件
                elements[0].onkeyup = function () {
                    val = elements[0].value;
                    getValue(val);
                };
                function getValue(val) {
                    var newVal = '';
                    var reg =/^[\d\s]+$/;
                    if (val.match(reg)) {
                        val = val.replace(/\s/g, '');
                        for (var i = 0; i < val.length; i++) {
                            if (i % 4 == 0 && i > 0) {
                                newVal = newVal.concat(' ');
                            }
                            newVal = newVal.concat(val[i]);
                        }
                        elements[0].value = newVal;
                        scope.accountData=newVal;
                    } else {
                        if(val !==''){
                            elements[0].value='';
                            scope.accountData='';
                            cardLoading.loading();
                        }

                    }

                }
            }
        }
    }]);
