/**
 * Created by Yuko on 16/11/6.
 */
angular.module('huilianyi.pages')
    .directive('invoiceSelectTypeModel', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                invoiceList: '=',
                rateCanChangeAble: '=',
                expenseTypeList: '=',
                expenseTotalAmount: '=',
                currencyCode: '=',
                originCurrencyCode: '=',
                code: '=',
                readonly: '='
            },
            templateUrl: 'scripts/components/modal/invoice_select_type/invoice.select.type.model.html',
            controller: 'com.handchina.hly.InvoiceTypeSelectorModalController'
        }
    }])
    .controller('com.handchina.hly.InvoiceTypeSelectorModalController',
        ['$scope', '$ionicModal', '$ionicPopup', 'CurrencyCodeService', '$ionicLoading', '$q',
            'PublicFunction', '$filter', 'SelfDefineExpenseReport', 'Principal', '$ionicActionSheet','$timeout',
            function ($scope, $ionicModal, $ionicPopup, CurrencyCodeService, $ionicLoading, $q, PublicFunction,
                      $filter, SelfDefineExpenseReport, Principal, $ionicActionSheet,$timeout) {

                $timeout(function(){
                    $scope.invoiceList.forEach(function(item,i){
                        if(item.actualCurrencyRate){
                            item.selfCurrencyRateCurrencyRate=getRateDiff(item.actualCurrencyRate,item.companyCurrencyRate);
                            item.updateRate =$scope.rateCanChangeAble;
                        }
                    })
                },1000)

                //计算汇率差异,保留一位小数的百分数;四舍五入
                function getRateDiff(actualCurrencyRate, companyCurrencyRate) {
                    var a = (actualCurrencyRate - companyCurrencyRate) * 100 / companyCurrencyRate;
                    var b = Math.round(a * 10);
                    var c = b / 10;
                    if(c<0){
                        c=(-c);
                    }
                    return c + "%";
                }

                $scope.clearNoNum = function(val){
                    if (isNaN(val)) {
                        $scope.data.inputrate="";
                    } else {
                        if(parseFloat(val)<0){
                            $scope.data.inputrate=(-val)
                        }
                    }
                }
                //修改汇率的弹窗
                $scope.showinputrate = function (expense) {
                    $scope.data = {};
                    var myPopup = $ionicPopup.show({
                        template: '<div><input class="inputrate" ng-model="data.inputrate" ng-keyup="clearNoNum(data.inputrate)" placeholder="请输入">' +
                        '</div><p class="inputrate-des">企业汇率:' + expense.companyCurrencyRate + '</p>',
                        title: '请输入汇率',
                        scope: $scope,
                        cssClass: "rate-confirm-popup",
                        buttons: [
                            {
                                text: '取消',
                                type: 'botton-height'
                            },
                            {
                                text: '<b>保存</b>',
                                type: 'left-line botton-height',
                                onTap: function (e) {
                                    //输入汇率,计算差异,计算金额
                                    if( parseFloat($scope.data.inputrate) === 0){
                                       PublicFunction.showToast("汇率:0无效");//汇率:0无效
                                       return;
                                    }else if(parseFloat($scope.data.inputrate) >= 10000000000){
                                        PublicFunction.showToast("汇率过大:无效");
                                        return;
                                    }else {
                                        expense.actualCurrencyRate = $scope.data.inputrate;
                                        expense.selfCurrencyRateCurrencyRate=getRateDiff(expense.actualCurrencyRate,expense.companyCurrencyRate);
                                        expense.baseCurrencyAmount = parseFloat(expense.amount) * parseFloat(expense.actualCurrencyRate);
                                    }

                                }
                            }
                        ]
                    });
                };


                $scope.view = {
                    calculationOverDisable:true,
                    isShowKeyboard: false, //是否显示键盘
                    companyOID: null, //公司oid
                    cashCategoryList: [], //币种列表
                    currentIndex: -1,
                    equational: '',
                    originAmount: 0,
                    isSymbol: false,
                    isZero: false,
                    typeList: [],
                    numList: [],
                    operationList: [],
                    hasCalculate: false,
                    isNum: true,
                    firstEnter: true,
                    hasNumber: false,
                    selectExpense: {},
                    oldExpenseIndex: "", // 保存旧的费用数据
                    oldExpense: "", // 保存旧的费用数据
                    // 拷贝旧的数据,以便取消的时候恢复
                    copyOldData: function (i) {
                        this.oldExpense = angular.copy($scope.expense);
                        this.oldExpenseIndex = i;
                    },
                    // 恢复旧的数据
                    resumeOldData: function () {
                        $scope.invoiceList[this.oldExpenseIndex]=this.oldExpense;
                    },
                    showKeyboard: function () {
                        $scope.view.isShowKeyboard = !$scope.view.isShowKeyboard;
                    },
                    selectCurrencyCode: function () {
                        $scope.selectList = [];
                        for (var i = 0; i < $scope.view.cashCategoryList.length; i++) {
                            var item = {};
                            item.text = item.text = '<p class="code">' +
                                $scope.view.cashCategoryList[i].currency +
                                '</p><p class="name">(' +
                                $scope.view.cashCategoryList[i].currencyName +
                                ')</p>';
                            $scope.selectList.push(item);
                        }
                        $scope.hasFilter = false;
                        $scope.hideSheet = $ionicActionSheet.show({
                            cssClass: 'currency-sheet',
                            buttons: $scope.selectList,
                            titleText: '请选择币种',//请选择供应商
                            buttonClicked: function (index) {
                                $scope.currencyCode = $scope.view.cashCategoryList[index].currency;
                                $scope.expense.currencyCode = $scope.currencyCode;
                                $scope.currencyName = $scope.view.cashCategoryList[index].currencyName;
                                $scope.code = CurrencyCodeService.getCurrencySymbol($scope.currencyCode);
                                //选择了币种,显示键盘
                                $scope.view.isShowKeyboard = true;
                                $scope.hideSheet();
                                //$scope.view.clear();
                                //与产品沟通过,切换币种,汇率就清空
                                $scope.expense.baseCurrencyAmount = parseFloat($scope.expense.amount) * parseFloat($scope.expense.companyCurrencyRate);
                                if ($scope.rateCanChangeAble) {
                                } else {
                                    //如果汇率不能修改了,就把手输汇率改为"";
                                    $scope.expense.actualCurrencyRate = "";
                                }
                            }
                        });
                    },
                    cancel: function () {
                        $scope.view.resumeOldData();    // 恢复初始数据
                        $scope.view.getTotal();
                        $scope.modal.hide();
                    },
                    openWarningPopup: function (message) {
                        $ionicLoading.show({
                            template: message,
                            duration: 1000
                        });
                    },
                    deleteInvoice: function (index, expense) {
                        $scope.expenseTotalAmount -= parseFloat(expense.baseCurrencyAmount);
                        $scope.invoiceList.splice(index, 1);
                    },
                    validate: function () {
                        var defer = $q.defer();
                        if (!$scope.expense.amount || $scope.expense.amount == 0) {
                            PublicFunction.showToast($filter('translate')('invoice_type_js.Please.enter.the.amount'));//请输入金额
                            defer.reject(false);
                        } else if ($scope.expense.amount < 0 || !isFinite(eval($scope.view.equational.replace(/x/g, "*")))) {
                            PublicFunction.showToast($filter('translate')('status.Please.enter.the.legal.amount'));//请输入合法的金额
                            defer.reject(false);
                        } else if ($scope.expense.expenseType.name === $filter('translate')('invoice_type_js.type')) {//类型
                            PublicFunction.showToast($filter('translate')('invoice_type_js.Please.select.a.cost.type'));//请选择费用类型
                            defer.reject(false);
                        } else {
                            defer.resolve(true);
                        }
                        return defer.promise;
                    },
                    //计算费用总和
                    getTotal: function () {
                        if($scope.invoiceList instanceof Array){
                            var total = 0;
                            for (var i = 0; i < $scope.invoiceList.length; i++) {
                                total += parseFloat($scope.invoiceList[i].baseCurrencyAmount);
                            }
                            $scope.expenseTotalAmount = total;
                        }
                    },
                    goBack: function () {
                        try {
                            $scope.expense.amount = eval($scope.expense.amount);
                            $scope.expense.amount = $scope.expense.amount.toFixed(2);
                            if ($scope.view.currentIndex === -1) {
                                $scope.invoiceList.push($scope.expense);
                            } else {
                                $scope.invoiceList[$scope.view.currentIndex] = angular.copy($scope.expense);
                            }

                            $scope.view.getTotal();
                            //点击弹出数字键盘ok后,先保持键盘显示,以免用户点到币种,把选择币种的列表显示出来;
                            setTimeout(function(){
                                //隐藏键盘是因为,下次创建新费用的时候,这个键盘要先隐藏
                                $scope.view.isShowKeyboard = false;
                            },500)

                            $scope.modal.hide();
                        } catch (error) {
                            $scope.expense.amount = 0;
                            $scope.view.equational = '';
                            $scope.view.openWarningPopup($filter('translate')('status.Please.enter.the.legal.amount'));//请输入合法的金额
                        }
                    },
                    selectType: function (type) {
                        $scope.expense.expenseTypeOID = type.expenseTypeOID;
                        $scope.expense.expenseType.name = type.name;
                        $scope.expense.expenseType.iconName = type.iconName;
                        $scope.expense.expenseType.iconURL = type.iconURL;
                        $scope.expense.valid = type.valid;
                        $scope.expense.unit = type.unit;
                        //选择费用类型之后显示键盘
                        $scope.view.isShowKeyboard = true;
                    },
                    push: function (text) {
                        if (text === '+' || text === '-' || text === 'x' || text === '/') {
                            $scope.view.isZero = false;
                            if ($scope.view.firstEnter) {
                                $scope.view.equational = $scope.expense.amount.toString();
                                $scope.view.firstEnter = false;
                            }
                            $scope.view.hasCalculate = false;
                            $scope.view.isNum = false;
                            if ($scope.view.isSymbol) {
                                $scope.view.equational = $scope.view.equational.substring(0, $scope.view.equational.length - 1);
                                $scope.view.equational += text;
                            } else {
                                $scope.view.isSymbol = true;
                                $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                                try {
                                    $scope.expense.amount = eval($scope.view.equal);
                                    $scope.view.equational = $scope.expense.amount + text;
                                } catch (error) {
                                    $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                                }
                            }
                        }
                        else {
                            if (text === '.') {
                                if ($scope.view.equational === '' || $scope.view.equational === null || $scope.view.equational.substr($scope.view.equational.length - 1) === '.') {
                                    $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                                } else {
                                    $scope.view.isSymbol = false;
                                    $scope.view.hasNumber = true;
                                    $scope.view.isZero = false;
                                    if ($scope.view.hasCalculate) {
                                        $scope.view.equational = text;
                                        $scope.expense.amount = parseInt($scope.view.equational);
                                        $scope.view.hasCalculate = false;
                                    } else {
                                        $scope.view.equational += text;
                                        if ($scope.view.firstEnter) {
                                            $scope.expense.amount = $scope.view.equational;
                                        }
                                    }
                                }
                            } else if (text === '0') {
                                if ($scope.view.isZero) {
                                    $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                                } else {
                                    if ($scope.view.equational === '' || $scope.view.equational === null || $scope.view.isSymbol) {
                                        $scope.view.isZero = true;
                                    }
                                    $scope.view.isSymbol = false;
                                    $scope.view.hasNumber = true;
                                    if ($scope.view.hasCalculate) {
                                        $scope.view.equational = text;
                                        $scope.expense.amount = parseInt($scope.view.equational);
                                        $scope.view.hasCalculate = false;
                                    } else {
                                        $scope.view.equational += text;
                                        if ($scope.view.firstEnter) {
                                            $scope.expense.amount = $scope.view.equational;
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
                                        $scope.view.equational = text;
                                        $scope.expense.amount = parseInt($scope.view.equational);
                                        $scope.view.hasCalculate = false;
                                    } else {
                                        $scope.view.equational += text;
                                        if ($scope.view.firstEnter) {
                                            $scope.expense.amount = $scope.view.equational;
                                        }
                                    }
                                }
                            }
                        }
                    },
                    clear: function () {
                        $scope.view.equational = '';
                        $scope.expense.amount = 0;
                        $scope.view.isZero = false;
                        $scope.view.hasCalculate = true;
                    },
                    clearOne: function () {
                        if ($scope.view.equational.length > 0) {
                            $scope.view.equational = $scope.view.equational.substring(0, $scope.view.equational.length - 1);
                            if ($scope.view.isSymbol) {
                                $scope.view.isSymbol = false;
                            }
                        }
                    },
                    finish: function () {
                        var pattMoney = /^(\d+(\.\d{0,2})?)$/g;
                        var pattDay = /^(\d+(\.\d{0,1})?)$/g;
                        var validMoney = pattMoney.test($scope.expense.unitPrice);
                        var validDate = pattDay.test($scope.expense.number);
                        if (!validMoney) {
                            $scope.view.openWarningPopup($filter('translate')('status.Please.enter.the.legal.amount'));//请输入合法的金额
                        } else if (!validDate) {
                            $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legal.number.of.days'));//请输入合法的天数
                        } else {
                            if (parseFloat($scope.expense.unitPrice * $scope.expense.number)) {
                                $scope.expense.amount = $scope.expense.unitPrice * $scope.expense.number;


                                if ($scope.expense.currencyCode != $scope.originCurrencyCode) {
                                    //查询汇率需要时间,就用当前的时间:获取客户端的当前时间,与服务端的当前时间不大一样
                                    $scope.timeforrate = (new Date());
                                    var query_str = "currency=" + $scope.expense.currencyCode + "&currencyDate=" +
                                        $filter('date')($scope.timeforrate, 'yyyy-MM-dd hh:mm:ss');
                                    SelfDefineExpenseReport.getCashRate(query_str).then(function (data) {
                                        $scope.expense.companyCurrencyRate = data.data.rate;
                                        if ($scope.rateCanChangeAble) {
                                            $scope.expense.actualCurrencyRate = $scope.expense.companyCurrencyRate;
                                            $scope.expense.baseCurrencyAmount = parseFloat($scope.expense.amount) * parseFloat($scope.expense.actualCurrencyRate);
                                            $scope.invoiceList[$scope.view.currentIndex] = angular.copy($scope.expense);
                                        } else {
                                            //不可修改汇率,还需要判断以前是否修改过汇率
                                            if($scope.expense.actualCurrencyRate &&
                                                $scope.expense.actualCurrencyRate != "" &&
                                                $scope.expense.actualCurrencyRate != 0 &&
                                                $scope.expense.actualCurrencyRate != null &&
                                                $scope.expense.actualCurrencyRate != undefined){
                                                $scope.expense.baseCurrencyAmount = parseFloat($scope.expense.amount) * parseFloat($scope.expense.actualCurrencyRate);
                                                $scope.invoiceList[$scope.view.currentIndex] = angular.copy($scope.expense);
                                            }else {
                                                $scope.expense.baseCurrencyAmount = parseFloat($scope.expense.amount) * parseFloat($scope.expense.companyCurrencyRate);
                                                $scope.invoiceList[$scope.view.currentIndex] = angular.copy($scope.expense);
                                            }
                                        }
                                        $scope.view.goBack();
                                    })
                                } else {
                                    $scope.expense.baseCurrencyAmount = $scope.expense.amount;
                                    $scope.view.goBack();
                                }

                            } else {
                                $scope.expense.amount = 0;
                                $scope.expense.baseCurrencyAmount = 0;
                                $scope.view.goBack();
                            }
                        }
                    },
                    calculate: function () {
                        if ($scope.view.isSymbol) {
                        } else {
                            $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                            try {
                                $scope.expense.amount = eval($scope.view.equal);
                                //费用输入的货币
                                $scope.expense.currencyCode = $scope.currencyCode || $scope.originCurrencyCode;
                                if ($scope.expense.currencyCode != $scope.originCurrencyCode) {
                                    //查询汇率需要时间,就用当前的时间:获取客户端的当前时间,与服务端的当前时间不大一样
                                    $scope.timeforrate = (new Date());
                                    var query_str = "currency=" + $scope.expense.currencyCode + "&currencyDate=" +
                                        $filter('date')($scope.timeforrate, 'yyyy-MM-dd hh:mm:ss');
                                    SelfDefineExpenseReport.getCashRate(query_str).then(function (data) {
                                        $scope.expense.companyCurrencyRate = data.data.rate;

                                        if ($scope.rateCanChangeAble) {
                                            $scope.expense.actualCurrencyRate = $scope.expense.companyCurrencyRate;
                                            $scope.expense.baseCurrencyAmount = parseFloat($scope.expense.amount) * parseFloat($scope.expense.actualCurrencyRate);
                                            //防止在异步请求过程中数据被修改
                                            $scope.invoiceList[$scope.view.currentIndex] = angular.copy($scope.expense);
                                        } else {

                                            //不可修改汇率,还需要判断以前是否修改过汇率
                                            if($scope.expense.actualCurrencyRate &&
                                                $scope.expense.actualCurrencyRate != "" &&
                                                $scope.expense.actualCurrencyRate != 0 &&
                                                $scope.expense.actualCurrencyRate != null &&
                                                $scope.expense.actualCurrencyRate != undefined){
                                                $scope.expense.baseCurrencyAmount = parseFloat($scope.expense.amount) * parseFloat($scope.expense.actualCurrencyRate);
                                                $scope.invoiceList[$scope.view.currentIndex] = angular.copy($scope.expense);
                                            }else {
                                                $scope.expense.baseCurrencyAmount = parseFloat($scope.expense.amount) * parseFloat($scope.expense.companyCurrencyRate);
                                                $scope.invoiceList[$scope.view.currentIndex] = angular.copy($scope.expense);
                                            }


                                        }

                                        $scope.view.hasCalculate = true;
                                    })

                                } else {
                                    $scope.expense.baseCurrencyAmount = $scope.expense.amount;
                                    $scope.view.hasCalculate = true;
                                }


                            } catch (error) {
                                //请输入合法的表达式
                                $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));
                            }
                        }
                    },

                    calculationOver: function () {
                        //为了禁止测试人员以及用户狂点,创建多条相同的无用的费用,设置0.4秒的disable;
                        $scope.view.calculationOverDisable=false;
                        setTimeout(function(){
                            $scope.view.calculationOverDisable=true;
                        },400);

                        if ($scope.view.isSymbol) {
                            $scope.view.equational = $scope.view.equational.substring(0, $scope.view.equational.length - 1);
                            $scope.view.isSymbol = false;
                        }
                        $scope.view.calculate();
                        $scope.view.validate()
                            .then(function () {
                                if ($scope.view.isSymbol) {
                                    $scope.view.equational = '';
                                    $scope.view.hasCalculate = false;
                                    $scope.view.isSymbol = false;
                                    $scope.view.goBack();
                                } else {
                                    if (!$scope.view.firstEnter) {
                                        $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                                        try {
                                            $scope.expense.amount = eval($scope.view.equal);
                                            //费用输入的货币
                                            $scope.expense.currencyCode = $scope.currencyCode || $scope.originCurrencyCode;

                                            if ($scope.expense.currencyCode != $scope.originCurrencyCode) {
                                                //查询汇率需要时间,就用当前的时间:获取客户端的当前时间,与服务端的当前时间不大一样
                                                $scope.timeforrate = (new Date());
                                                var query_str = "currency=" + $scope.expense.currencyCode + "&currencyDate=" +
                                                    $filter('date')($scope.timeforrate, 'yyyy-MM-dd hh:mm:ss');
                                                SelfDefineExpenseReport.getCashRate(query_str).then(function (data) {
                                                    $scope.expense.companyCurrencyRate = data.data.rate;
                                                    if ($scope.rateCanChangeAble) {
                                                        $scope.expense.actualCurrencyRate = $scope.expense.companyCurrencyRate;
                                                        $scope.expense.baseCurrencyAmount = parseFloat($scope.expense.amount) * parseFloat($scope.expense.actualCurrencyRate);
                                                        $scope.invoiceList[$scope.view.currentIndex] = angular.copy($scope.expense);
                                                    } else {

                                                        //不可修改汇率,还需要判断以前是否修改过汇率
                                                        if($scope.expense.actualCurrencyRate &&
                                                            $scope.expense.actualCurrencyRate != "" &&
                                                            $scope.expense.actualCurrencyRate != 0 &&
                                                            $scope.expense.actualCurrencyRate != null &&
                                                            $scope.expense.actualCurrencyRate != undefined){
                                                            $scope.expense.baseCurrencyAmount = parseFloat($scope.expense.amount) * parseFloat($scope.expense.actualCurrencyRate);
                                                            $scope.invoiceList[$scope.view.currentIndex] = angular.copy($scope.expense);
                                                        }else {
                                                            $scope.expense.baseCurrencyAmount = parseFloat($scope.expense.amount) * parseFloat($scope.expense.companyCurrencyRate);
                                                            $scope.invoiceList[$scope.view.currentIndex] = angular.copy($scope.expense);
                                                        }



                                                    }
                                                    $scope.view.equational = '';
                                                    $scope.view.hasCalculate = false;
                                                    $scope.view.isSymbol = false;
                                                    $scope.view.goBack();
                                                })
                                            } else {

                                                $scope.expense.baseCurrencyAmount = $scope.expense.amount;
                                                $scope.view.equational = '';
                                                $scope.view.hasCalculate = false;
                                                $scope.view.isSymbol = false;
                                                $scope.view.goBack();
                                            }
                                        } catch (error) {
                                            $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                                        }

                                    } else {
                                        //$scope.view.equational = '';
                                        $scope.view.hasCalculate = false;
                                        $scope.view.isSymbol = false;
                                        $scope.view.goBack();
                                    }
                                }
                            }, function () {
                            })
                    }
                };


                $scope.$watch('expense.unitPrice', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if ($scope.expense.valid && $scope.expense.unitPrice && $scope.expense.number) {
                            $scope.expense.amount = $scope.expense.unitPrice * $scope.expense.number;
                        }
                    }
                });
                $scope.$watch('expense.number', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if ($scope.expense.valid && $scope.expense.unitPrice && $scope.expense.number) {
                            $scope.expense.amount = $scope.expense.unitPrice * $scope.expense.number;
                        }
                    }
                });

                $scope.getCurrencyDisplay = function (amount, currencyCode) {
                    return $filter('currency')(amount, CurrencyCodeService.getCurrencySymbol(currencyCode), 2);
                };

                $ionicModal.fromTemplateUrl('select.invoice.type.dialog.html', {
                    scope: $scope,
                    animation: 'slide-in-right'
                }).then(function (modal) {
                    $scope.modal = modal;
                });

                //$scope.code = CurrencyCodeService.getCurrencySymbol($scope.expense.currencyCode);
                //点击添加费用
                $scope.openDialog = function () {
                    $scope.view.isShowKeyboard = false;
                    $scope.hasValid = false; //是否有补贴
                    $scope.expense = {
                        expenseType: {
                            name: $filter('translate')('invoice_type_js.type'),//类型
                            iconName: "no-image",
                            iconURL: 'img/expensetypes/no-image.png'
                        },
                        expenseTypeOID: null,
                        amount: 0,
                        baseCurrencyAmount: 0,//外币计算为本位币的金额
                        companyCurrencyRate: 1,
                        actualCurrencyRate: "",
                        updateRate: $scope.rateCanChangeAble,//是否可以修改汇率
                        currencyCode: $scope.currencyCode//费用的币种
                    };
                    $scope.view.currentIndex = -1;
                    if (!$scope.readonly) {
                        $scope.view.isNum = true;
                        $scope.view.firstEnter = true;
                        $scope.view.isSymbol = false;
                        //改为true,第一次修改金额的时候,会把金额重置:比如美元120;点击修改,让键盘输入2,那么金额就变为2美元;而不是1202美元;
                        $scope.view.hasCalculate = true;
                        $scope.view.hasNumber = false;
                        $scope.view.equational = '';
                        $scope.view.isZero = false;
                        try{
                            if($scope.expenseTypeList && $scope.expenseTypeList.length > 0){
                                $scope.modal.show();
                                //获取币种
                                Principal.identity().then(function (data) {
                                    $scope.view.companyOID = data.companyOID;
                                    SelfDefineExpenseReport.getCashCategoryList()
                                        .success(function (data) {
                                            data = data.filter(function (item) {
                                                return item.enable === true;
                                            });
                                            //币种列表
                                            if (data.length > 0) {
                                                $scope.view.cashCategoryList = data;
                                                for (var i = 0; i < $scope.view.cashCategoryList.length; i++) {
                                                    if ($scope.view.cashCategoryList[i].currency == $scope.currencyCode) {
                                                        $scope.currencyName = $scope.view.cashCategoryList[i].currencyName;
                                                        break;
                                                    }
                                                }
                                            }
                                        });
                                });
                                PublicFunction.showLoading();
                                //获取费用类别分类
                                SelfDefineExpenseReport.getCategoryList()
                                    .then(function (data) {
                                        $scope.categoryList = data;
                                        for (var i = 0; i < $scope.categoryList.length; i++) {
                                            $scope.categoryList[i].hasExpense = false;
                                            if ($scope.expenseTypeList && $scope.expenseTypeList.length > 0) {
                                                for (var j = 0; j < $scope.expenseTypeList.length; j++) {
                                                    if ($scope.expenseTypeList[j].expenseTypeCategoryOID == $scope.categoryList[i].expenseTypeCategoryOID) {
                                                        $scope.categoryList[i].hasExpense = true;
                                                        break;
                                                    }
                                                    if(!$scope.expenseTypeList[j].readonly){
                                                        if($scope.expenseTypeList[j].valid){
                                                            $scope.hasValid = true;
                                                        }
                                                    }
                                                }
                                            }
                                            if (i == ($scope.categoryList.length - 1)) {
                                                $ionicLoading.hide();
                                            }
                                        }
                                    });
                                type_list = document.getElementsByClassName("type-list");
                                for (var index = 0; index < type_list.length; index++) {
                                    type_list[index].style.padding = "10px " + String(((window.innerWidth % 60) / 2)) + "px";
                                }
                            } else {
                                PublicFunction.showToast('暂无费用可选,请稍后再试');
                            }
                        }
                        catch (error){
                            PublicFunction.showToast('暂无费用可选,请稍后再试');
                        }
                        $scope.view.originAmount = $scope.expense.amount;
                        //测试人员建议添加时,费用的币种保持本位币,修改费用才是保持
                        $scope.currencyCode = $scope.originCurrencyCode;
                    }
                };

                //点击费用,去修改
                $scope.changeDialog = function (index,expense) {
                    $scope.view.isShowKeyboard = false;
                    $scope.hasValid = false; //是否有补贴
                    $scope.view.currentIndex = index;
                    $scope.expense=expense;
                    // 保存初始数据
                    $scope.view.copyOldData(index);
                    if (!$scope.readonly) {
                        $scope.view.isNum = true;
                        $scope.view.firstEnter = true;
                        $scope.view.isSymbol = false;
                        //改为true,第一次修改金额的时候,会把金额重置:比如美元120;点击修改,让键盘输入2,那么金额就变为2美元;而不是1202美元;
                        $scope.view.hasCalculate = true;
                        $scope.view.hasNumber = false;
                        $scope.view.equational = $scope.expense.amount+"";
                        $scope.view.isZero = false;
                        try{
                            if($scope.expenseTypeList && $scope.expenseTypeList.length > 0){
                                $scope.modal.show();
                                type_list = document.getElementsByClassName("type-list");
                                for (var index = 0; index < type_list.length; index++) {
                                    type_list[index].style.padding = "10px " + String(((window.innerWidth % 60) / 2)) + "px";
                                }


                                //获取币种
                                Principal.identity().then(function (data) {
                                    $scope.view.companyOID = data.companyOID;
                                    SelfDefineExpenseReport.getCashCategoryList()
                                        .success(function (data) {
                                            data = data.filter(function (item) {
                                                return item.enable === true;
                                            });
                                            //币种列表
                                            if (data.length > 0) {
                                                $scope.view.cashCategoryList = data;
                                                for (var i = 0; i < $scope.view.cashCategoryList.length; i++) {
                                                    if ($scope.view.cashCategoryList[i].currency == $scope.currencyCode) {
                                                        $scope.currencyName = $scope.view.cashCategoryList[i].currencyName;
                                                        break;
                                                    }
                                                }
                                            }
                                        });
                                });
                                PublicFunction.showLoading();
                                $scope.historyList = [];
                                //获取费用类别分类
                                SelfDefineExpenseReport.getCategoryList()
                                    .then(function (data) {
                                        $scope.categoryList = data;
                                        for (var i = 0; i < $scope.categoryList.length; i++) {
                                            $scope.categoryList[i].hasExpense = false;
                                            for (var j = 0; j < $scope.expenseTypeList.length; j++) {
                                                if ($scope.expenseTypeList[j].expenseTypeCategoryOID == $scope.categoryList[i].expenseTypeCategoryOID) {
                                                    $scope.categoryList[i].hasExpense = true;
                                                    break;
                                                }
                                                if(!$scope.expenseTypeList[j].readonly){
                                                    if($scope.expenseTypeList[j].valid){
                                                        $scope.hasValid = true;
                                                    }
                                                }
                                            }
                                            if (i == ($scope.categoryList.length - 1)) {
                                                $ionicLoading.hide();
                                            }
                                        }
                                    });
                                $scope.historyList = [];
                            } else {
                                PublicFunction.showToast('暂无费用可选,请稍后再试');
                            }
                        }
                        catch (error){
                            PublicFunction.showToast('暂无费用可选,请稍后再试');
                        }
                        $scope.view.originAmount = $scope.expense.amount;
                        if($scope.expense.currencyCode==null){
                            //为了兼容以前非币种版本创建的费用数据
                            $scope.currencyCode = $scope.originCurrencyCode;
                        }else {
                            $scope.currencyCode = $scope.expense.currencyCode;
                        }
                    }
                }



                //深度监听费用,一旦汇率改变,总金额就会改变
                $scope.$watch("invoiceList", function (newValue, oldValue) {
                    $scope.view.getTotal(newValue);
                }, true)




            }]);

