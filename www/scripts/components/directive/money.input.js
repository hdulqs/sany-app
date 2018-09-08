angular.module('huilianyi.pages')
    .factory('MoneyFunction',['PublicFunction',function(PublicFunction,$filter){
        return{
            moneyToast:function(){
                return PublicFunction.showToast($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
            }
        }
    }])
    .directive('moneyInput', function(MoneyFunction) {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                integerLength: '=',
                decimalLength: '=',
                moneyData:'=?'
            },
            link: function(scope, element, attributes, ngModel) {
                element.bind('input', function () {
                    var moneyPattern=/^\d+(.?\d*)$/;
                    if(scope.moneyData && !moneyPattern.test(ngModel.$viewValue)){
                        scope.moneyData=null;
                        MoneyFunction.moneyToast();
                    }else{
                        //如果多于二位小数，自动削减
                        var number = (ngModel.$viewValue.split('.'));
                        var tmp = 0;
                        if (scope.integerLength > -1 && scope.decimalLength > -1) {
                            if (number[0] && number[0].length > scope.integerLength) {
                                if (number[1]) {
                                    if (scope.integerLength !== 0) {
                                        tmp = parseFloat(number[0].substring(0, scope.integerLength) + '.' + number[1]);
                                    } else {
                                        tmp = parseFloat('0.' + number[1]);
                                    }
                                } else {
                                    if (scope.integerLength !== 0) {
                                        tmp = parseInt(number[0].substring(0, scope.integerLength));
                                    } else {
                                        tmp = 0;
                                    }
                                }
                                scope.$apply(function() {
                                    setValue(tmp);
                                });
                            }
                            if (number[1] && number[1].length > scope.decimalLength) {
                                if (scope.decimalLength !== 0) {
                                    scope.$apply(function() {
                                        setValue(parseFloat(ngModel.$$rawModelValue).toFixedDown(scope.decimalLength));
                                    });
                                } else {
                                    setValue(parseInt(number[0]));
                                }
                            }
                        } else if (scope.integerLength > -1) {
                            if (number[0] && number[0].length > scope.integerLength) {
                                if (number[1]) {
                                    tmp = parseFloat(number[0].substring(0, scope.integerLength) + '.' + number[1]);
                                } else {
                                    tmp = parseInt(number[0].substring(0, scope.integerLength));
                                }
                                scope.$apply(function() {
                                    setValue(tmp);
                                });
                            }
                        } else if (scope.decimalLength > -1) {
                            if (number[1] && number[1].length > scope.decimalLength) {
                                if (scope.decimalLength !== 0) {
                                    scope.$apply(function() {
                                        setValue(parseFloat(ngModel.$$rawModelValue).toFixedDown(scope.decimalLength));
                                    });
                                } else {
                                    setValue(parseInt(number[0]));
                                }
                            }
                        }

                        //如果是负数，赋值为零
                        if (ngModel.$$rawModelValue < 0){
                            scope.$apply(function() {
                                setValue(0);
                            });
                        }
                    }
                });
                function setValue(value) {
                    ngModel.$setViewValue(value);//change value in model
                    element.val(value);//change value in view(which is displayed)
                }

            }
        };
    });
//和toFixed不同，不是四舍五入
Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

