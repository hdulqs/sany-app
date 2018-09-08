/**
 * Created by Yuko on 16/7/7.
 */
angular.module('huilianyi.pages')
    .controller('MainAppController', ['$scope', '$ionicLoading', function ($scope, $ionicLoading) {
        //公共函数，很多地方用到，需要把loading的状态进行显示，加载gif
        $scope.showLoading = function (){
            $ionicLoading.show({
                template: '<img style="height: 3em" ng-src="img/loading.gif">',
                delay: 500,//0.5秒delay，如果页面加载时间小于0.5秒，不显示loading gif
                noBackdrop: true
            });
        }

    }])
    .controller('MainTabsController', ['$scope', '$state',
        function ($scope, $state) {

            $scope.go = function (stateName) {
                $state.go(stateName);
            }
        }]);
