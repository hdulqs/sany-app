/**
 * Created by Yuko on 16/8/8.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('CurrencyCodeService', ['CurrencyCode','CashName', function (CurrencyCode,CashName) {
        return {
            getCurrencySymbol: function (currencyCode) {
                if(currencyCode){
                    return CurrencyCode[currencyCode];
                } else {
                    return '¥'
                }
            },
            getCashName:function(currencyCode){
                return CashName[currencyCode];
            }
        }
    }]);
