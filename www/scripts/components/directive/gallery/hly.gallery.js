"use strict";
angular.module('huilianyi.pages')
    .directive('hlyGallery', [function () {
        return {
            restrict: 'AE',
            scope: {
                attachmentSrc: '=attachmentSrc'
            },
            controller: 'com.handchina.hly.AttachmentsGalleryController',
            replace: true,
            templateUrl: 'scripts/components/directive/gallery/hly-gallery.html',
        };
    }])
    .directive('hlyRowHeight',[function () {
        return {
            restrict: 'A',
            link : function (scope, element, attrs) {
                element.css('height',element[0].offsetWidth * 0.33 + 'px');
            }
        };
    }])
    .controller('com.handchina.hly.AttachmentsGalleryController', function controller($scope) {
        var _drawGallery = function(){
            var items = $scope.attachmentSrc;
            var _gallery = [];
            var row = -1;
            var col = 0;
            for(var i=0;i<items.length;i++){
                if(i % 3 === 0){
                    row++;
                    _gallery[row] = [];
                    col = 0;
                }
                items[i].position = i;
                _gallery[row][col] = items[i];
                col++;
            }
            $scope.items =  _gallery;
        };
        _drawGallery();
        (function () {
            $scope.$watch(function () {
                return $scope.attachmentSrc.length;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    _drawGallery();
                }
            });
        }());
    })
;
