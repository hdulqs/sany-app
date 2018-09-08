/**
 * Created by Yuko on 16/7/8.
 */
angular.module('huilianyi.pages')
    .directive('invoiceTypeSelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                expenseList: '=',
                expenseTypeList: '=',
                expenseTotalAmount: '=',
                currencyCode: '=',
                originCurrencyCode: '=',
                code: '='
            },
            templateUrl: 'scripts/pages/expense_report_version/invoice_apply/select.invoice.type.tpl.html',
            controller: 'com.handchina.hly.InvoiceTypeSelectorController'
        }
    }])
    .controller('com.handchina.hly.InvoiceTypeSelectorController', ['$scope', '$ionicPopup', '$ionicModal', '$q', '$ionicLoading', '$filter',
        'SelfDefineExpenseReport', 'Principal', '$ionicActionSheet', 'CurrencyCodeService',
        function ($scope, $ionicPopup, $ionicModal, $q, $ionicLoading, $filter, SelfDefineExpenseReport, Principal, $ionicActionSheet, CurrencyCodeService) {


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

            $scope.rateCanChangeAble = true;
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
                $scope.data = {}
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
                                if(parseFloat($scope.data.inputrate)===0){
                                    PublicFunction.showToast("汇率:0无效");//汇率:0无效
                                    return;
                                }else if(parseFloat($scope.data.inputrate)>=10000000000){
                                    PublicFunction.showToast("汇率过大:无效");
                                    return;
                                }else {
                                    //输入汇率,计算差异,计算金额
                                    expense.actualCurrencyRate = $scope.data.inputrate;
                                    expense.selfCurrencyRateCurrencyRate = getRateDiff(expense.actualCurrencyRate, expense.companyCurrencyRate);
                                    expense.baseCurrencyAmount = $scope.expense.amount * $scope.expense.actualCurrencyRate;
                                }
                            }
                        }
                    ]
                });
            };
            $scope.expense = {
                expenseType: {
                    name: $filter('translate')('invoice.type'), /*类型*/
                    iconName: "no-image",
                    iconURL: 'img/expensetypes/no-image.png'
                },
                expenseTypeOID: null,
                amount: 0
            };
            $scope.view = {
                cashCategoryList: [], //币种列表
                isShowKeyboard: false, //是否显示键盘
                tempExpense: null,
                isUpdate: false,
                equational: '',
                isSymbol: false,
                isZero: false,
                typeList: [],
                numList: [],
                operationList: [],
                hasCalculate: false,
                isNum: true,
                firstEnter: true,
                hasNumber: false,
                originalAmount: null,
                selectExpense: {},
                selectCurrencyCode: function () {   //选择币种
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
                            //console.log($scope.view.cashCategoryList[index]);
                            $scope.currencyCode = $scope.view.cashCategoryList[index].currency;
                            $scope.currencyName = $scope.view.cashCategoryList[index].currencyName;
                            $scope.code = CurrencyCodeService.getCurrencySymbol($scope.currencyCode);
                            $scope.view.isShowKeyboard = true;
                            $scope.hideSheet();
                        }
                    });
                },
                showKeyboard: function () {
                    $scope.view.isShowKeyboard = !$scope.view.isShowKeyboard;
                },
                //如果本位币与外币都有,这种总金额计算方式需要改变,目前费用申请都是换算为本位币计算
                getTotalAmount: function (expenseList) {
                    var total = 0;
                    for (var i = 0; i < expenseList.length; i++) {
                        total += parseFloat(expenseList[i].baseCurrencyAmount);
                    }
                    return total;
                },

                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                //验证输入是否合法
                validateData: function () {
                    var deferred = $q.defer();
                    if ($scope.expense.expenseTypeOID === null) {
                        /*请选择费用类型*/
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.select.the.type.of.cost'));
                        $scope.view.isSymbol = false;
                        deferred.reject(false);
                    } else if (!isFinite($scope.expense.amount)) {
                        /*请输入合法的金额*/
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.amount'));
                        $scope.view.isSymbol = false;
                        deferred.reject(false);
                    } else if ($scope.expense.amount <= 0) {
                        /*请输入合法的金额*/
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.amount'));
                        $scope.view.isSymbol = false;
                        deferred.reject(false);
                    } else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                },
                goBack: function () {
                    try {
                        $scope.expense.amount = eval($scope.expense.amount);
                        if ($scope.expense.amount > 0) {
                            $scope.expense.amount = $scope.expense.amount.toFixed(2);
                            $scope.modal.hide();
                        } else {
                            $scope.expense.amount = 0;
                            $scope.view.equational = '';
                            $scope.view.isZero = false;
                            /*请输入合法的金额*/
                            $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.amount'));
                        }
                    } catch (error) {
                        $scope.expense.amount = 0;
                        $scope.view.equational = '';
                        /*请输入合法的金额*/
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.amount'));
                    }
                },
                selectType: function (type) {
                    $scope.expense.data = type.fields;
                    $scope.expense.expenseTypeOID = type.expenseTypeOID;
                    $scope.expense.expenseType.name = type.name;
                    $scope.expense.expenseType.iconName = type.iconName;
                    $scope.expense.expenseType.iconURL = angular.copy(type.iconURL);
                    $scope.view.isShowKeyboard = true;
                },
                push: function (text) {
                    if (text === '+' || text === '-' || text === 'x' || text === '/') {
                        $scope.view.equational = $scope.expense.amount.toString();
                        $scope.view.hasCalculate = false;
                        $scope.view.isZero = false;
                        $scope.view.isNum = false;
                        if ($scope.view.isSymbol) {
                            $scope.view.equational = $scope.view.equational.substring(0, $scope.view.equational.length);
                            $scope.view.equational += text;

                        } else {
                            $scope.view.isSymbol = true;
                            $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                            try {
                                $scope.expense.amount = eval($scope.view.equal);
                                $scope.view.equational = $scope.expense.amount + text;
                            } catch (error) {
                                $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.amount')/*请输入合法的金额*/);
                            }
                        }
                    }
                    else {
                        if (text === '.') {
                            if ($scope.view.equational === '' || $scope.view.equational === null || $scope.view.equational.substr($scope.view.equational.length - 1) === '.') {
                                $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.expression')/*请输入合法的表达式*/);
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
                                $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.expression')/*请输入合法的表达式*/);
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
                                $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.expression')/*请输入合法的表达式*/);
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
                    //else {
                    //$scope.view.isSymbol = false;
                    //$scope.view.hasNumber = true;
                    //if ($scope.view.hasCalculate) {
                    //    $scope.view.equational = text;
                    //    $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                    //    try{
                    //        $scope.expense.amount = eval($scope.view.equational);
                    //        $scope.view.hasCalculate = false;
                    //    }catch (error) {
                    //        $scope.view.openWarningPopup('请输入合法的金额');
                    //    }
                    //} else {
                    //    $scope.view.equational += text;
                    //    $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                    //    //$scope.expense.amount = eval($scope.view.equational);
                    //    if ($scope.view.firstEnter) {
                    //        try{
                    //            $scope.expense.amount = eval($scope.view.equational);
                    //        }catch (error) {
                    //            $scope.view.openWarningPopup('请输入合法的金额');
                    //        }
                    //    }
                    //}
                    //}
                },
                clear: function () {
                    $scope.view.equational = '';
                    $scope.expense.amount = 0;
                    $scope.view.hasCalculate = true;
                    $scope.view.isZero = false;
                    $scope.view.firstEnter = true;
                },
                clearOne: function () {
                    if ($scope.view.equational.length > 0) {
                        $scope.view.equational = $scope.view.equational.substring(0, $scope.view.equational.length - 1);
                        if ($scope.view.isSymbol) {
                            $scope.view.isSymbol = false;
                        }
                    }
                },
                cancel: function () {
                    $scope.modal.hide();
                    //$scope.view.hasCalculate = false;
                    $scope.view.equational = '';
                    $scope.expense.amount = $scope.view.originalAmount;
                },
                calculate: function () {
                    if ($scope.view.isSymbol) {

                    } else {
                        $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                        try {
                            $scope.expense.amount = eval($scope.view.equal);
                            if (!isFinite($scope.expense.amount)) {
                                //请输入合法的表达式
                                $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.expression'));
                                return
                            }
                            $scope.view.hasCalculate = true;
                        } catch (error) {
                            //请输入合法的金额
                            $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.amount'));
                        }
                    }
                },
                calculationOver: function () {


                    if ($scope.view.isSymbol) {
                        //请输入合法的金额
                        $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.amount'));
                    } else {
                        if ($scope.view.equational === null || $scope.view.equational === '') {
                            $scope.view.validateData().then(function () {
                                $scope.view.equational = '';
                                $scope.view.hasCalculate = false;
                                $scope.view.isSymbol = false;
                                if ($scope.view.isUpdate) {
                                    $scope.expenseTotalAmount = $scope.view.getTotalAmount($scope.expenseList);
                                } else if ($scope.expense.expenseTypeOID !== 'no-image') {
                                    $scope.expenseList.push($scope.expense);
                                    $scope.expenseTotalAmount = $scope.view.getTotalAmount($scope.expenseList);
                                }
                                $scope.view.goBack();
                                //$scope.modal.hide();
                            });
                        } else {
                            if (!$scope.view.firstEnter) {
                                $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                                try {
                                    //费用输入的金额
                                    $scope.expense.amount = eval($scope.view.equal);
                                    //费用输入的货币
                                    $scope.expense.currencyCode = $scope.currencyCode || $scope.originCurrencyCode;
                                    //费用输入的货币与汇率计算的金额
                                    if ($scope.expense.currencyCode != $scope.originCurrencyCode) {
                                        //查询汇率需要时间,就用当前的时间:获取客户端的当前时间,与服务端的当前时间不大一样
                                        $scope.timeforrate = (new Date());
                                        var query_str = "currency=" + $scope.expense.currencyCode + "&currencyDate=" +
                                            $filter('date')($scope.timeforrate, 'yyyy-MM-dd hh:mm:ss');
                                        SelfDefineExpenseReport.getCashRate(query_str).then(function (data) {
                                            $scope.expense.companyCurrencyRate = data.data.rate;
                                            if ($scope.expense.updateRate) {
                                                $scope.expense.actualCurrencyRate = $scope.expense.companyCurrencyRate;
                                                $scope.expense.baseCurrencyAmount = $scope.expense.amount * $scope.expense.actualCurrencyRate
                                            } else {
                                                $scope.expense.baseCurrencyAmount = $scope.expense.amount * $scope.expense.companyCurrencyRate;
                                            }
                                        })
                                    } else {
                                        $scope.expense.baseCurrencyAmount = $scope.expense.amount
                                    }
                                    $scope.view.validateData().then(function () {
                                        $scope.view.equational = '';
                                        $scope.view.hasCalculate = false;
                                        $scope.view.isSymbol = false;
                                        $scope.view.firstEnter = true;
                                        $scope.expenseTotalAmount = $scope.view.getTotalAmount($scope.expenseList);
                                        $scope.view.goBack();
                                        //$scope.modal.hide();
                                    });
                                } catch (error) {
                                    /*请输入合法的金额*/
                                    $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.amount')
                                    );
                                }
                            } else {
                                $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                                try {
                                    $scope.expense.amount = eval($scope.view.equal);
                                    $scope.expense.currencyCode = $scope.currencyCode || $scope.originCurrencyCode;
                                    if ($scope.expense.currencyCode != $scope.originCurrencyCode) {
                                        //查询汇率需要时间,就用当前的时间:获取客户端的当前时间,与服务端的当前时间不大一样
                                        $scope.timeforrate = (new Date());
                                        var query_str = "currency=" + $scope.expense.currencyCode + "&currencyDate=" +
                                            $filter('date')($scope.timeforrate, 'yyyy-MM-dd hh:mm:ss');
                                        SelfDefineExpenseReport.getCashRate(query_str).then(function (data) {
                                            $scope.expense.companyCurrencyRate = data.data.rate;
                                            if ($scope.expense.updateRate) {
                                                $scope.expense.actualCurrencyRate = $scope.expense.companyCurrencyRate;
                                                $scope.expense.baseCurrencyAmount = $scope.expense.amount * $scope.expense.actualCurrencyRate
                                            } else {
                                                $scope.expense.baseCurrencyAmount = $scope.expense.amount * $scope.expense.companyCurrencyRate;
                                            }
                                        })
                                    } else {
                                        $scope.expense.baseCurrencyAmount = $scope.expense.amount
                                    }
                                    $scope.view.validateData().then(function () {
                                        $scope.view.equational = '';
                                        $scope.view.hasCalculate = false;
                                        $scope.view.isSymbol = false;
                                        if ($scope.view.isUpdate) {
                                            $scope.expenseTotalAmount = $scope.view.getTotalAmount($scope.expenseList);
                                        } else if ($scope.expense.expenseTypeOID !== 'no-image') {
                                            $scope.expenseList.push($scope.expense);
                                            $scope.expenseTotalAmount = $scope.view.getTotalAmount($scope.expenseList);
                                        }
                                        $scope.view.goBack();
                                        //$scope.modal.hide();
                                    });
                                } catch (error) {
                                    /*请输入合法的金额*/
                                    $scope.view.openWarningPopup($filter('translate')('invoice.please.enter.a.valid.amount')
                                    );
                                }
                            }
                        }

                    }
                }
            };
            $ionicModal.fromTemplateUrl('expense.type.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.deleteInvoice = function (expense) {
                $scope.expenseList.splice($scope.expenseList.indexOf(expense), 1);
                $scope.expenseTotalAmount = $scope.view.getTotalAmount($scope.expenseList);
            };
            $scope.changeDialog = function (expense) {
                $scope.view.firstEnter = true;

                $scope.expense = $scope.expenseList[$scope.expenseList.indexOf(expense)];

                $scope.view.equational = $scope.expense.amount.toString();
                $scope.view.hasCalculate = true;

                $scope.view.isUpdate = true;
                $scope.modal.show();

                $scope.view.originalAmount = angular.copy($scope.expense.amount);

            };
            //打开弹窗增加费用
            $scope.openDialog = function () {
                $scope.view.isShowKeyboard = false; //不显示键盘
                $scope.view.isUpdate = false;
                $scope.expense = {
                    expenseType: {
                        name: $filter('translate')('invoice.type')/*类型*/,
                        iconName: "no-image",
                        iconURL: 'img/expensetypes/no-image.png'
                    },
                    expenseTypeOID: null,
                    amount: 0,
                    baseCurrencyAmount: 0,//外币计算为本位币的金额
                    companyCurrencyRate: 1,
                    actualCurrencyRate: 1,
                    updateRate: false,//是否可以修改汇率
                    //updateRate:$scope.rateCanChangeAble,//是否可以修改汇率
                    currencyCode: $scope.currencyCode//费用的币种
                };

                $scope.modal.show();
                $scope.view.firstEnter = true;
                $scope.view.isZero = false;
                $scope.view.isZero = false;
                $scope.currencyName = null; //币种名称
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
                            }
                        }
                    })

                $scope.historyList = [];

                type_list = document.getElementsByClassName("type-list");
                for (var index = 0; index < type_list.length; index++) {
                    type_list[index].style.padding = "10px " + String(((window.innerWidth % 60) / 2)) + "px";
                }
            };


            //深度监听费用,一旦汇率改变,总金额就会改变
            $scope.$watch("expenseList", function (newValue, oldValue) {

                $scope.expenseTotalAmount = $scope.view.getTotalAmount(newValue);
            }, true)


        }]);
