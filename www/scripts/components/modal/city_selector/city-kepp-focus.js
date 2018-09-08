/**
 * Created by fangqiang on 17/3/21.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive("detectFocus", function () {
        return {
            restrict: "A",
            scope: {
                onFocus: '&onFocus',
                onBlur: '&onBlur',
                focusOnBlur: '=focusOnBlur'
            },
            link: function (scope, elem) {

                elem.on("focus", function () {
                    scope.onFocus();
                    scope.focusOnBlur = false;  //设置重新分配,使用'='而不是使用@
                });

                elem.on("blur", function () {
                    scope.onBlur();
                    if (scope.focusOnBlur){
                        elem[0].focus();
                        scope.focusOnBlur= false;
                    }
                });
            }
        }
    });
