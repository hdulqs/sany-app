/**
 * 费用增专directive
 *
 * Created by lizhi on 17/4/11.
 */
angular.module('huilianyi.pages')
    .directive('vatSpecial', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                expense: '=',   // 费用数据
                readonly: '='   // 是否只读
            },
            templateUrl: 'scripts/components/directive/vat_special/vat.special.directive.tpl.html',
            controller: 'com.handchina.hly.VatSpecialController'
        }
    }])
    .controller('com.handchina.hly.VatSpecialController',
        ['$scope', '$ionicModal', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate','$filter', 'SelfDefineExpenseReport',
            'CompanyConfigurationService', 'PublicFunction', '$location', '$ionicPlatform', 'ExpenseService', '$ionicActionSheet',
            '$timeout',
        function ($scope, $ionicModal, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $filter, SelfDefineExpenseReport,
                  CompanyConfigurationService, PublicFunction, $location, $ionicPlatform, ExpenseService, $ionicActionSheet,
                  $timeout) {

            $ionicModal.fromTemplateUrl('vat.special.amount.description.modal.tpl.html', {
                scope: $scope,
                animation: 'slide-in-left'
            }).then(function (modal) {
                $scope.amountDescriptionModal = modal;
            });

            $scope.view = {
                taxRates: [],   // 税率
                cashCategoryList: [],   // 币种,
                currencyName: "",   // 币种中文名称

                // 选择税率
                selectTaxRates: function () {
                    // 如果只读,直接return
                    if($scope.readonly) {
                        return
                    }

                    var actionSheet = $ionicActionSheet.show({
                        cssClass: 'action-sheet-style',
                        buttons: $scope.view.taxRates,
                        titleText: $filter('translate')('create_expense_js.Please.select.a.rate'),//请选择税率,
                        buttonClicked: function (index) {
                            $scope.expense.taxRate = $scope.view.taxRates[index].taxRateValue;
                            $scope.view.calculateAmount();
                            return true;
                        }
                    });
                },

                // 获取税率
                getTaxRates: function() {
                    //获取税率
                    ExpenseService.getTaxRates()
                        .then(function (response) {
                            $scope.view.taxRates = response.data;
                            if ($scope.view.taxRates && $scope.view.taxRates.length > 0) {
                                angular.forEach($scope.view.taxRates, function(taxRate) {
                                    taxRate.text = taxRate.taxRateKey;

                                    // 费用没有税率时选择默认税率
                                    if(typeof $scope.expense.taxRate!=='number') {
                                        $scope.expense.taxRate = taxRate.defaultValue ? taxRate.taxRateValue : null;
                                    }
                                });
                                $scope.view.taxRates.sort(function (a, b) {
                                    return a.taxRateValue - b.taxRateValue;
                                });
                            }
                        });
                },

                // 选择币种
                selectCurrencyCode: function () {
                    var selectList = [];

                    // 如果只读,直接return
                    if($scope.readonly) {
                        return
                    }

                    for(var i = 0; i < $scope.view.cashCategoryList.length; i++){
                        var item = {};
                        item.text = '<p class="code">' + $scope.view.cashCategoryList[i].currency +
                            '</p><p class="name">(' + $scope.view.cashCategoryList[i].currencyName + ')</p>';
                        selectList.push(item);
                    }

                    var actionSheet = $ionicActionSheet.show({
                        cssClass: 'action-sheet-style',
                        buttons: selectList,
                        titleText: $filter('translate')('select_type_js.Please.select.currency'),//请选择币种
                        buttonClicked: function (index) {
                            $scope.expense.vatInvoiceCurrencyCode = $scope.view.cashCategoryList[index].currency;
                            $scope.view.currencyName = $scope.view.cashCategoryList[index].currencyName;
                            return true
                        }
                    });
                },

                // 获取币种
                getCashCategoryList: function() {
                    //获取币种
                    CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                        // 如果增专币种为空,初始化为本位币
                        if(!$scope.expense.vatInvoiceCurrencyCode) {
                            $scope.expense.vatInvoiceCurrencyCode = data.currencyCode;
                        }

                        SelfDefineExpenseReport.getCashCategoryList()
                            .then(function (response) {
                                var data = response.data;

                                data = data.filter(function (item) {
                                    return item.enable;
                                });

                                //币种列表
                                if(data.length > 0){
                                    // 保存币种列表
                                    $scope.view.cashCategoryList = data;

                                    for(var i = 0; i < $scope.view.cashCategoryList.length; i++){
                                        if($scope.view.cashCategoryList[i].currency ===
                                            $scope.expense.vatInvoiceCurrencyCode){

                                            // 获取本位币的显示名称
                                            $scope.view.currencyName = $scope.view.cashCategoryList[i].currencyName;
                                            break;
                                        }
                                    }
                                }
                            });
                    });
                },

                // 显示金额填写说明
                showAmountDescription: function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $scope.amountDescriptionModal.show();
                },

                // 隐藏金额填写说明
                hideAmountDescription: function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $scope.amountDescriptionModal.hide();
                },

                // 计算税额合计和价税合计
                calculateAmount: function() {
                    // 金额合计没输入或者税率没选择时,税额清0,金额合计没输入,价税总计清0
                    if(typeof $scope.expense.nonVATinclusiveAmount!=='number') {
                        if (typeof $scope.expense.nonVATinclusiveAmount === 'undefined') {
                            $scope.expense.nonVATinclusiveAmount = 0;
                        }
                        $scope.expense.taxAmount = 0;
                        $scope.expense.priceTaxAmount = 0;
                    } else if(typeof $scope.expense.taxRate!=='number') {
                        $scope.expense.taxAmount = 0;
                        $scope.expense.priceTaxAmount = $scope.expense.nonVATinclusiveAmount.toFixed(2);

                    } else {
                        // 强制类型转换,先转换成string保留两位小数,再转换为number显示
                        $scope.expense.taxAmount =
                            Number(($scope.expense.nonVATinclusiveAmount * $scope.expense.taxRate).toFixed(2));

                        $scope.expense.priceTaxAmount =
                            (Number($scope.expense.nonVATinclusiveAmount) + Number($scope.expense.taxAmount)).toFixed(2);
                    }
                },

                // 金额合计改变时
                totalAmountChange: function() {
                    // 计算税额合计和价税合计
                    this.calculateAmount();
                },

                // 选择税额,上下浮动最多0.04,间距0.01
                selectTaxAmount: function() {
                    var i,
                        items = [];

                    // 如果只读或者税额不是数字,直接return
                    if($scope.readonly) {
                        return
                    }

                    if(typeof $scope.expense.nonVATinclusiveAmount!=='number') {
                        // 请先输入金额
                        PublicFunction.showToast($filter('translate')('vatSpecial.pleaseInput'));
                        return
                    } else if(typeof $scope.expense.taxRate!=='number') {
                        // 请先选择税率
                        PublicFunction.showToast($filter('translate')('vatSpecial.pleaseSelect'));
                        return
                    }

                    for(i=-4; i<=4; i++) {
                        items.push({
                            text: ($scope.expense.nonVATinclusiveAmount * $scope.expense.taxRate + i * 0.01).toFixed(2)
                        });
                    }

                    var actionSheet = $ionicActionSheet.show({
                        cssClass: 'action-sheet-style',
                        buttons: items,
                        titleText: $filter('translate')('vatSpecial.selectAmount'), //您可在以下范围内选择税额
                        buttonClicked: function (index) {
                            // 税额
                            $scope.expense.taxAmount = Number(items[index].text);
                            // 价税合计
                            $scope.expense.priceTaxAmount = $scope.expense.nonVATinclusiveAmount + $scope.expense.taxAmount;
                            return true;
                        }
                    });
                }
            };

            // 初始化
            $scope.init = (function() {
                $scope.view.getTaxRates();
                $scope.view.getCashCategoryList();
            }());
        }])
;
