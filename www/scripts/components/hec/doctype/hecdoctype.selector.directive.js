/**
 * 类型：combox
 * 费用申请单--单据类型
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecdoctypeSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                docTypeName:'=',
                docTypeCode:'=?',
                companyId:'=',
                employeeId:'@',//
                readonly: '=',
                type:'=',// 费用申请单/ExpReq   费用报销单/ExpReim   借款单/LoanReq
                reqRequiredFlag:'=?',//报销单是否关联申请
                cryCode:'=?',//收款币种
                busAttrCode:'=?',//借款单：业务属性
                paymentMethodId:"=?",//借款单：付款方式
                paymentMethodDisplay:"=?",//借款单：付款方式
                documentPageType:"=?"

            },
            templateUrl: 'scripts/components/hec/doctype/hecdoctype.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecDocTypeSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecDocTypeSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecDocTypeService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecDocTypeService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.nothing = false;
            $scope.doctypes = [];

            $ionicModal.fromTemplateUrl('hecdoctype.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.doctypes = [];
                $scope.nothing = false;
                $scope.loadMore(1);
            };

            $scope.selectItem = function (doctype) {
                $scope.cryCode = doctype.currency_code;
                if($scope.type == 'ExpReq'){
                    $scope.docTypeName = doctype.description;
                    $scope.docTypeCode = doctype.expense_requisition_type_code;
                    $scope.selected = doctype.expense_requisition_type_id;
                }else if($scope.type == 'ExpReport'){
                    $scope.docTypeName = doctype.description;
                    $scope.docTypeCode = doctype.expense_report_type_code;
                    $scope.selected = doctype.exp_report_type_id;
                    $scope.reqRequiredFlag = doctype.req_required_flag;
                    $scope.documentPageType = doctype.document_page_type;
                }else if($scope.type == 'LoanReq'||$scope.type == 'reqRefLoan'){
                    $scope.docTypeName = doctype.description;
                    $scope.docTypeCode = doctype.type_code;
                    $scope.selected = doctype.type_id;
                    $scope.busAttrCode = doctype.business_attribute_code;
                    $scope.paymentMethodId = doctype.payment_method_id;
                    $scope.paymentMethodDisplay = doctype.payment_method_id_display;
                }
                $scope.modal.hide();
            };

            $scope.searchUnit = function () {
                $scope.doctypes = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecDocTypeService.searchKeywords($scope.type,$scope.companyId, page, $scope.size,$scope.employeeId);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage  = dataRes.result.pageCount;
                    if ($scope.lastPage  > 0) {
                        $scope.nothing = false;
                        $scope.doctypes = $scope.doctypes.concat(dataRes.result.record);
                    }else{
                        $scope.nothing = true;
                        $scope.doctypes = [];
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function (error) {
                    // 如果是搜索结果为空,结束搜索,否则提示报错
                    if (error === 'keywords.is.ambiguous') {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        PublicFunction.showToast($filter('translate')('hec_common.searchError'));  // 加载失败
                    }
                });
            };
        }
    ]);

