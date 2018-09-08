/**
 * Created by Yuko on 16/8/13.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.erv_carousel_detail', {
            url: 'erv/carousel/detail?carouselOID',
            cache: false,
            views: {
                'page-content@app': {
                    'templateUrl': 'scripts/pages/expense_report_version/carousel_detail/carousel.detail.tpl.html',
                    'controller': 'com.handchina.huilianyi.ErvCarouselDetailController'
                }
            },
            resolve: {
                carousel: function (CarouselService, $stateParams) {
                    return CarouselService.getCarouselDetail($stateParams.carouselOID);
                },
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('expense_report');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.ErvCarouselDetailController', ['$scope', '$stateParams', 'CarouselService',
        'carousel', '$state', '$filter',
        function ($scope, $stateParams, CarouselService, carousel, $state, $filter) {
            // var init = function () {
            //     CarouselService.getCarouselDetail($stateParams.carouselOID)
            //         .success(function (data) {
            //             $scope.carouselContent = data;
            //         });
            // };
            // init();
            $scope.carouselContent = carousel.data;

            if ($scope.carouselContent.content) {
                $scope.carouselContent.content =
                    $scope.carouselContent.content.replace(/href="([^"]*)"/g,
                    'href=\'javascript:window.open("' + '$1' +
                    '", "_blank", "location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' + $filter('translate')('back.to.HuiLianYi') + '")\'');
            }

            $scope.close = function () {
                $state.go('app.tab_erv.homepage');
            };

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
        }])
    //信任公告信息中的html代码的filter
    .filter("trust", ['$sce', function($sce) {
        return function(htmlCode){
                return $sce.trustAsHtml(htmlCode);
            }
        }
    ]);
