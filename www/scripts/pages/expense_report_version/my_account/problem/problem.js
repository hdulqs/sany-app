/**
 * Created by Yuko on 16/7/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.account_problem', {
            url: '/account_problem',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/expense_report_version/my_account/problem/problem.tpl.html',
                    controller: 'com.handchina.hly.ErvAccountProblemController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('my_account');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.hly.ErvAccountProblemController', ['$scope', 'Principal', '$state',
        function ($scope, Principal, $state) {
            $scope.goTo = function (stateName) {
                //$state.go(stateName);
                if (stateName === 'app.didi_sync') {
                    $state.go('app.didi_sync',
                        {
                            message: 'account_book'
                        }
                    );
                } else {
                    $state.go(stateName);
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
            // $scope.$on("$ionicView.enter", function () {
            //     Principal.identity().then(function (data) {
            //         $scope.person = data;
            //         if ($scope.person && $scope.person.filePath)
            //             $scope.imgUrl = $scope.person.filePath;
            //         else
            //             $scope.imgUrl = '/img/title-icon.png';
            //     });
            // });
        }]);
