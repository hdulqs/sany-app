/**
 * Created by lizhi on 17/3/22.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('searchLoading',function(){
        return {
            restrict:'E',
            scope:{
            },
            templateUrl:'scripts/components/directive/search_loading/search.loading.directive.tpl.html',
            controller:function($scope){
            }
        }
    });
