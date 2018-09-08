/**
 * Created by Yuko on 16/7/8.
 */

angular.module('huilianyi.pages')
    .directive('expenseTypeSelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                currencycodechangeable: '=',
                currencyCode: '=',
                rateChangeAbled:'=',
                originCurrencyCode: '=',
                selfCurrencyRateCurrencyRate: '=',
                webInvoiceKeepConsistentWithExpense:'=',
                timeforrate: '=',
                expense: '=',
                expenseTypeList: '=',
                status: '=',
                code: '=',
                readonly: '=',
                hasValid: '=',
                hasHistory: '=',
                reportExpenseAbleSelectCurrency:"=",
                appliantOid: '=?' //申请人oid
            },
            templateUrl: 'scripts/components/modal/expense_select_type/select.type.tpl.html',
            controller: 'com.handchina.hly.ExpenseTypeSelectorController'
        }
    }])
    .directive('ionSticky', ['$ionicPosition', '$compile', '$timeout', function ($ionicPosition, $compile, $timeout) {
        return {
            restrict: 'A',
            require: '^?$ionicScroll',
            link: function ($scope, $element, $attr, $ionicScroll) {
                var scroll = angular.element($ionicScroll.element);
                var clone;
                var cloneVal = function (original, to) {
                    var my_textareas = original.getElementsByTagName('textarea');
                    var result_textareas = to.getElementsByTagName('textarea');
                    var my_selects = original.getElementsByTagName('select');
                    var result_selects = to.getElementsByTagName('select');
                    for (var i = 0, l = my_textareas.length; i < l; ++i)
                        result_textareas[i].value = my_textareas[i].value;
                    for (var i = 0, l = my_selects.length; i < l; ++i)
                        result_selects[i].value = my_selects[i].value;
                };
                // creates the sticky divider clone and adds it to DOM
                var createStickyClone = function ($element) {
                    if ($attr.ionSticky == 'expenseType') { //费用类型吸顶
                        clone = $element.clone().css({
                            position: 'absolute',
                            top: $ionicPosition.position(scroll).top + "px", // put to top
                            left: 0,
                            right: 0,
                            backgroundColor: '#F1F6F9',
                            padding: '8px 15px',
                            color: '#959595',
                            fontSize: '14px'
                        });
                    } else if ($attr.ionSticky == 'travelElement') {
                        clone = $element.clone().css({ //差旅元素吸顶
                            // position: 'absolute',
                            top: $ionicPosition.position(scroll).top + "px", // put to top
                            left: 0,
                            right: 0,
                            backgroundColor: '#fff',
                            padding: '0px',
                            color: '#4c4c4c',
                            fontSize: '14px',
                            borderBottom: 'thin solid #e2e2e2'
                        });
                    }

                    $attr.ionStickyClass = ($attr.ionStickyClass) ? $attr.ionStickyClass : 'assertive';
                    cloneVal($element[0], clone[0]);
                    clone[0].className += ' ' + $attr.ionStickyClass;

                    clone.removeAttr('ng-repeat-start').removeAttr('ng-if');

                    scroll.parent().append(clone);

                    // compile the clone so that anything in it is in Angular lifecycle.
                    $compile(clone)($scope);
                    $scope.$apply();
                };

                var removeStickyClone = function () {
                    if (clone)
                        clone.remove();
                    clone = null;
                };

                $scope.$on("$destroy", function () {
                    // remove the clone and unbind the scroll listener
                    removeStickyClone();
                    angular.element($ionicScroll.element).off('scroll');
                });

                var lastActive;
                var updateSticky = ionic.throttle(function () {
                    var divHeight = $ionicPosition.offset($element[0].getElementsByClassName("item-divider")).height;
                    var active = null;
                    var dividers = [];
                    var tmp = $element[0].getElementsByClassName("item-divider");
                    for (var i = 0; i < tmp.length; ++i) {
                        dividers.push(angular.element(tmp[i]));
                    }
                    for (var i = 0; i < dividers.length; ++i) { // can be changed to binary search
                        if ($ionicPosition.offset(dividers[i]).top - $ionicPosition.offset($element).top - divHeight < 0) { // this equals to jquery outerHeight
                            if (i === dividers.length - 1 || $ionicPosition.offset(dividers[i + 1]).top -
                                ($ionicPosition.offset($element).top + dividers[i + 1].prop('offsetHeight')) + divHeight > 0) { //when clone covers new header
                                active = dividers[i][0];
                                break;
                            }
                        }
                    }

                    if (lastActive != active) {
                        removeStickyClone();
                        lastActive = active;
                        if (active != null)
                            createStickyClone(angular.element(active));
                    }
                    //console.log(performance.now());
                }, 200);
                scroll.on('scroll', function (event) {
                    updateSticky();
                });
            }
        }
    }])
    .controller('com.handchina.hly.ExpenseTypeSelectorController', ['$scope', '$ionicModal', 'CurrencyCodeService',
        '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', '$filter', 'CustomValueService', '$ionicActionSheet',
        'SelfDefineExpenseReport', 'Principal', 'PublicFunction', '$rootScope', 'ExpenseService', 'LocationService',
        function ($scope, $ionicModal, CurrencyCodeService, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $filter,
                  CustomValueService, $ionicActionSheet, SelfDefineExpenseReport, Principal, PublicFunction, $rootScope,
                  ExpenseService, LocationService) {


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
            $scope.showinputrate = function () {
                $scope.data = {}
                var myPopup = $ionicPopup.show({
                    template: '<div><input class="inputrate" ng-model="data.inputrate" ng-keyup="clearNoNum(data.inputrate)" placeholder="请输入">' +
                    '</div><p class="inputrate-des">企业汇率:' + $scope.expense.companyCurrencyRate + '</p>',
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
                                if( parseFloat($scope.data.inputrate)===0){
                                    PublicFunction.showToast("汇率:0无效");//汇率:0无效
                                    return;
                                }else if(parseFloat($scope.data.inputrate)>=10000000000){
                                    PublicFunction.showToast("汇率过大:无效");
                                    return;
                                }else {
                                    //输入汇率,计算差异,计算金额
                                    $scope.expense.actualCurrencyRate = $scope.data.inputrate;
                                    $scope.selfCurrencyRateCurrencyRate = getRateDiff($scope.expense.actualCurrencyRate , $scope.expense.companyCurrencyRate);
                                    $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.actualCurrencyRate
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
                oldExpense: angular.copy($scope.expense),     // 保存旧的费用数据
                // 拷贝旧的数据,以便取消的时候恢复
                copyOldData: function () {
                    this.oldExpense = angular.copy($scope.expense);    // 保存旧的费用数据
                },
                // 恢复旧的数据
                resumeOldData: function () {
                    $scope.expense = this.oldExpense;   // 恢复旧的费用数据
                },
                hideModel: function () {
                    $scope.view.closeModal();
                },
                showKeyboard: function () {
                    $scope.view.isShowKeyboard = !$scope.view.isShowKeyboard;
                },
                selectCurrencyCode: function () {
                    //webInvoiceKeepConsistentWithExpense代表fp配置是否币种可选,如果配置为只能选择本位币,就不能选择币种
                    //reportExpenseAbleSelectCurrency代表报销单头部币种是否是外币,如果是外币,就不能选择币种
                    if($scope.webInvoiceKeepConsistentWithExpense || !$scope.reportExpenseAbleSelectCurrency){
                        return;
                    }

                   //如果是从报销单里面进入的,不要改变币种
                    $scope.selectList = [];
                    for (var i = 0; i < $scope.view.cashCategoryList.length; i++) {
                        var item = {};
                        item.text = '<p class="code">' + $scope.view.cashCategoryList[i].currency + '</p>' +
                            '<p class="name">(' + $scope.view.cashCategoryList[i].currencyName + ')</p>';
                        $scope.selectList.push(item);
                    }
                    $scope.hasFilter = false;
                    $scope.hideSheet = $ionicActionSheet.show({
                        cssClass: 'currency-sheet',
                        buttons: $scope.selectList,
                        titleText: $filter('translate')('select_type_js.Please.select.currency'),//请选择币种
                        buttonClicked: function (index) {
                            $scope.currencyCode = $scope.view.cashCategoryList[index].currency;
                            $scope.expense.currencyCode = $scope.view.cashCategoryList[index].currency;
                            $scope.currencyName = $scope.view.cashCategoryList[index].currencyName;
                            $scope.code = CurrencyCodeService.getCurrencySymbol($scope.currencyCode);
                            $scope.view.isShowKeyboard = true;
                            $scope.hideSheet();

                            //与产品沟通过,切换币种,汇率就清空
                            $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.companyCurrencyRate;
                            if ($scope.expense.updateRate) {
                            } else {
                                //如果汇率不能修改了,就把手输汇率改为"";
                                $scope.expense.actualCurrencyRate = "";
                            }

                        }
                    });

                },
                // 关闭modal
                closeModal: function () {
                    // 判断费用类型是否改变
                    if ($scope.expense.expenseTypeOID !== $scope.view.oldExpense.expenseTypeOID) {
                        $rootScope.expenseTypeChanged = true;
                    }
                    $scope.modal.hide();
                    // 判断金额是否改变
                    if ($scope.expense.amount !== $scope.view.oldExpense.amount) {
                        $rootScope.expenseAmountChanged = true;
                    }
                },

                cancel: function () {
                    $scope.view.resumeOldData();    // 恢复初始数据
                    $scope.view.equational = '';
                    $scope.view.closeModal();
                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                goBack: function () {
                    try {
                        $scope.expense.amount = eval($scope.expense.amount);
                        $scope.expense.amount = $scope.expense.amount.toFixed(2);
                        $scope.view.closeModal();
                    } catch (error) {
                        $scope.expense.amount = 0;
                        $scope.view.equational = '';
                        $scope.view.openWarningPopup($filter('translate')('status.Please.enter.the.legal.amount'));//请输入合法的金额
                    }

                },
                getMessageKeyDetail: function (index, customEnumerationOID) {
                    CustomValueService.getCustomValueDetail(customEnumerationOID)
                        .then(function (res) {
                            var enabled = res.data.enabled;
                            //值列表项不可用时，该值列表不可打开
                            if (enabled) {
                                $scope.expense.data[index].enabledStatus = true;
                            } else {
                                $scope.expense.data[index].enabledStatus = false;
                                $scope.expense.data[index].required = false;
                            }
                            CustomValueService.getCustomValueListByPagination(res.data.dataFrom, customEnumerationOID, 0, 1000, '', $scope.appliantOid)
                                .then(function (data) {
                                    if (data.data && data.data.length > 0) {
                                        data.data.forEach(function (item) {
                                            //值列表启用，值列表项启用且有默认值且全员可见才显示默认值
                                            if (item.patientia && enabled) {
                                                $scope.expense.data[index].value = item.value;
                                                $scope.expense.data[index].valueKey = item.messageKey;
                                            }
                                        })
                                    }
                                    //没有值列表项的时候显示未启用
                                    else {
                                        $scope.expense.data[index].enabledStatus = false;
                                        $scope.expense.data[index].required = false;

                                    }
                                });
                        })
                },
                selectType: function (type) {
                    $scope.expense.data = type.fields;
                    $scope.expense.data.sort(function(a,b){
                        return a.sequence > b.sequence ? 1 : (a.sequence < b.sequence ? -1 : 0);
                    });
                    $scope.view.isShowKeyboard = true;
                    $scope.expense.data.forEach(function (item, index) {
                        //处理非外部值列表的默认值
                        if (item.customEnumerationOID) {
                            //根据默认值处理valueKey
                            $scope.view.getMessageKeyDetail(index, item.customEnumerationOID);
                        }
                    });
                    // 初始化城市控件数据
                    ExpenseService.initExpenseCityDate($scope.expense.data).then(function(data) {
                        $scope.expense.data = data;
                    }, function() {});
                    $scope.expense.expenseTypeIconURL = type.iconURL;
                    $scope.expense.expenseTypeOID = type.expenseTypeOID;
                    $scope.expense.expenseTypeName = type.name;
                    $scope.expense.expenseTypeIconName = type.iconName;
                    $scope.expense.valid = type.valid;
                    $scope.expense.unit = type.unit;
                    $scope.expense.withReceipt = type.pasteInvoiceNeeded; //是否需要贴票
                    $scope.expense.apportionEnabled = type.apportionEnabled;    // 费用类型是否开启分摊
                    if (type.valid) {
                        $ionicScrollDelegate.$getByHandle('typeScroll').scrollBottom();
                    }
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
                calculate: function () {
                    if ($scope.view.isSymbol) {

                    } else {
                        $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                        try {
                            $scope.expense.amount = eval($scope.view.equal);
                            if (!isFinite($scope.expense.amount)) {
                                $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                                return
                            }
                            $scope.view.hasCalculate = true;
                        } catch (error) {
                            $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
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
                        } else {
                            $scope.expense.amount = 0;
                        }
                        $scope.view.goBack();
                    }
                },
                calculationOver: function () {
                    //为了禁止测试人员以及用户狂点,创建多条相同的无用的费用,设置0.4秒的disable;
                    $scope.view.calculationOverDisable=false;
                    setTimeout(function(){
                        $scope.view.calculationOverDisable=true;
                    },400);
                    $scope.view.calculate();
                    var query_str = "currency=" + $scope.currencyCode + "&currencyDate=" + $filter('date')($scope.timeforrate, 'yyyy-MM-dd hh:mm:ss');
                    SelfDefineExpenseReport.getCashRate(query_str).then(function (data) {

                        //虽然改变了币种,这个地方判断一下,是否与上次的币种一样,如果一样,就要保留手动汇率
                        if($scope.expense.currencyCode == $scope.view.oldExpense.currencyCode){
                            if($scope.view.oldExpense.companyCurrencyRate){
                                $scope.expense.companyCurrencyRate = $scope.view.oldExpense.companyCurrencyRate;
                            }else {
                                //这种情况属于从报销单创建费用
                                $scope.expense.companyCurrencyRate = data.data.rate;
                            }

                            if($scope.view.oldExpense.actualCurrencyRate){
                                $scope.expense.actualCurrencyRate = $scope.view.oldExpense.actualCurrencyRate;
                                $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.actualCurrencyRate;
                                $scope.selfCurrencyRateCurrencyRate = getRateDiff($scope.expense.actualCurrencyRate , $scope.expense.companyCurrencyRate) ;
                            }else {
                                $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.companyCurrencyRate;
                            }

                        }else {
                            /*
                             * 币种切换后,公司的汇率就覆盖手动汇率;手动汇率可以稍后重新输入
                             * */
                            $scope.expense.companyCurrencyRate = data.data.rate;
                            if($scope.rateChangeAbled){
                                $scope.expense.actualCurrencyRate = $scope.expense.companyCurrencyRate;
                                $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.actualCurrencyRate;
                                $scope.selfCurrencyRateCurrencyRate = getRateDiff($scope.expense.actualCurrencyRate , $scope.expense.companyCurrencyRate)
                            }else {
                                $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.companyCurrencyRate;
                            }
                        }

                    })
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
                                if (!isFinite($scope.expense.amount)) {
                                    $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                                    return
                                }
                                $scope.view.equational = '';
                                $scope.view.hasCalculate = false;
                                $scope.view.isSymbol = false;
                                $scope.view.firstEnter = true;
                                $scope.view.goBack();
                            } catch (error) {
                                $scope.view.openWarningPopup($filter('translate')('select_type_js.Please.enter.the.legitimate.expression'));//请输入合法的表达式
                            }
                        } else {
                            $scope.view.equational = '';
                            $scope.view.hasCalculate = false;
                            $scope.view.isSymbol = false;
                            $scope.view.goBack();
                        }
                    }
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

            $ionicModal.fromTemplateUrl('expense.type.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            //修改里程
            $scope.modifyMileage = function () {
                var mileage = angular.copy($scope.expense.mileage);
                opinionPopup = $ionicPopup.show({
                    template: '<input type="number" style="padding:5px 2px;color: #4c4c4c;" pattern="[0-9.]*" placeholder="' + $filter("translate")("value_tpl.pleaseInputMileage") + '" ng-model="expense.mileage"/> <p style="color: #959595;">' + $filter("translate")("select_type.Refer.to.the.mileage") + '{{expense.referenceMileage}}km</p>',//请输入里程--参考里程
                    title: '<h5>' + $filter("translate")("value_tpl.amendMileage") + '(km)</h5>',//修改里程
                    scope: $scope,
                    buttons: [
                        {text: $filter('translate')('destination.cancel')},//取消
                        {
                            text: $filter('translate')('select_type_js.confirm'),//确认
                            type: 'button-positive',
                            onTap: function (e) {
                                var pattDay = /^(\d+(\.\d{0,1})?)$/g;
                                var number = ($scope.expense.mileage.toString().split('.'));
                                var validDate = pattDay.test($scope.expense.mileage);
                                if (number[1] && number[1].length > 1) {
                                    $ionicLoading.show({
                                        template: $filter('translate')('select_type_js.Mileage.up.to.a.decimal'),//里程最多保留一位小数
                                        duration: '500'
                                    });
                                    e.preventDefault();
                                } else if (!validDate) {
                                    $ionicLoading.show({
                                        template: $filter('translate')('select_type_js.Please.enter.the.legal.range'),//请输入合法里程
                                        duration: '500'
                                    });
                                    e.preventDefault();
                                } else if ($scope.expense.mileage <= 0) {
                                    $ionicLoading.show({
                                        template: $filter('translate')('select_type_js.Length.must.be.greater.than.zero'),//里程必须大于0
                                        duration: '500'
                                    });
                                    e.preventDefault();
                                } else {
                                    $scope.expense.amount = parseFloat($scope.expense.mileage * $scope.expense.unitPrice).toFixed(2);
                                    return $scope.expense.amount;
                                }
                            }
                        }
                    ]
                });
                opinionPopup.then(function (res) {
                    if (!res) {
                        $scope.expense.mileage = mileage;
                    }
                });
            }

            //$scope.code = CurrencyCodeService.getCurrencySymbol($scope.expense.currencyCode);
            $scope.openDialog = function () {
                $scope.view.isShowKeyboard = false;
                //关闭键盘
                if(!ionic.Platform.is('browser')){
                    cordova.plugins.Keyboard.close();
                }

                PublicFunction.showLoading();
                // 保存初始数据
                $scope.view.copyOldData();
                if (!$scope.readonly) {
                    //是否是数字
                    $scope.view.isNum = true;
                    //是否有输入过
                    $scope.view.firstEnter = true;
                    //是否是符号
                    $scope.view.isSymbol = false;
                    //改为true,第一次修改金额的时候,会把金额重置:比如美元120;点击修改,让键盘输入2,那么金额就变为2美元;而不是1202美元;
                    $scope.view.hasCalculate = true;
                    //是否有数字
                    $scope.view.hasNumber = false;
                    if(parseInt($scope.expense.amount) == 0){
                        //不然程序会以为是二进制
                        $scope.view.equational = "";
                    }else {
                        $scope.view.equational = $scope.expense.amount+"";
                    }
                    $scope.view.isZero = false;
                    $scope.modal.show();
                    $scope.view.originAmount = $scope.expense.amount;
                }

                //获取币种
                SelfDefineExpenseReport.getCashCategoryList()
                    .success(function (data) {
                        //只有可用的币种可以选,有些币种是不可以选的
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
                            if (i == ($scope.categoryList.length - 1)) {
                                $ionicLoading.hide();
                            }
                        }
                    })
                $scope.historyList = [];
                //获取历史记录
                if ($scope.hasHistory) {
                    SelfDefineExpenseReport.getHistoryExpenseList(0, 5)
                        .success(function (data) {
                            if (data.length > 0) {
                                $scope.historyList = data;
                            }
                        })
                }
                type_list = document.getElementsByClassName("type-list");
                for (var index = 0; index < type_list.length; index++) {
                    type_list[index].style.padding = "10px " + String(((window.innerWidth % 60) / 2)) + "px";
                }
            };



            //监听expense时间变化date
            $scope.$watch("expense.date",function(new_val,old_val){
                if (new_val !== old_val) {
                    //如果手动汇率与公司汇率一样,那就一直保持一样
                    if( $scope.expense.actualCurrencyRate ===  $scope.expense.companyCurrencyRate){
                        var query_str = "currency=" + $scope.expense.currencyCode + "&currencyDate=" + $filter('date')(new_val, 'yyyy-MM-dd hh:mm:ss');
                        SelfDefineExpenseReport.getCashRate(query_str).then(function (data) {
                            $scope.expense.companyCurrencyRate = data.data.rate;
                            if ($scope.expense.updateRate) {
                                //如果可以修改汇率
                                $scope.expense.actualCurrencyRate = $scope.expense.companyCurrencyRate;
                                $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.actualCurrencyRate;
                                $scope.selfCurrencyRateCurrencyRate = getRateDiff($scope.expense.actualCurrencyRate , $scope.expense.companyCurrencyRate);
                            } else {
                                //不可修改汇率,还需要判断以前是否修改过汇率
                                if($scope.expense.actualCurrencyRate &&
                                    $scope.expense.actualCurrencyRate != "" &&
                                    $scope.expense.actualCurrencyRate != 0 &&
                                    $scope.expense.actualCurrencyRate != null &&
                                    $scope.expense.actualCurrencyRate != undefined){
                                    $scope.expense.actualCurrencyRate = $scope.expense.companyCurrencyRate;
                                    $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.actualCurrencyRate;
                                    $scope.selfCurrencyRateCurrencyRate = getRateDiff($scope.expense.actualCurrencyRate , $scope.expense.companyCurrencyRate);

                                }else {
                                    $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.companyCurrencyRate;
                                }
                            }
                        })
                    }else {
                        var query_str = "currency=" + $scope.expense.currencyCode + "&currencyDate=" + $filter('date')(new_val, 'yyyy-MM-dd hh:mm:ss');
                        SelfDefineExpenseReport.getCashRate(query_str).then(function (data) {
                            $scope.expense.companyCurrencyRate = data.data.rate;
                            if ($scope.expense.updateRate) {
                                //如果可以修改汇率
                                if($scope.expense.actualCurrencyRate){
                                    $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.actualCurrencyRate;
                                    $scope.selfCurrencyRateCurrencyRate = getRateDiff($scope.expense.actualCurrencyRate , $scope.expense.companyCurrencyRate);
                                }
                            } else {
                                //不可修改汇率,还需要判断以前是否修改过汇率
                                if($scope.expense.actualCurrencyRate &&
                                    $scope.expense.actualCurrencyRate != "" &&
                                    $scope.expense.actualCurrencyRate != 0 &&
                                    $scope.expense.actualCurrencyRate != null &&
                                    $scope.expense.actualCurrencyRate != undefined){
                                    $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.actualCurrencyRate;
                                    $scope.selfCurrencyRateCurrencyRate = getRateDiff($scope.expense.actualCurrencyRate , $scope.expense.companyCurrencyRate);

                                }else {
                                    $scope.expense.baseAmount = $scope.expense.amount * $scope.expense.companyCurrencyRate;
                                }
                            }
                        })
                    }
                }
            },true)

        }]);

