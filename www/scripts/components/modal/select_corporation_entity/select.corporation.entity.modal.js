/**
 * Created by Yuko on 16/11/21.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('corporationEntitySelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                name: '=',
                title: '=',
                prompt: '='

            },
            templateUrl: 'scripts/components/modal/select_corporation_entity/select.corporation.entity.modal.html',
            controller: 'com.handchina.huilianyi.CorporationEntitySelectorController'
        }
    }])
    .controller('com.handchina.huilianyi.CorporationEntitySelectorController', ['$scope', '$ionicModal', 'CorporationEntityService', 'ParseLinks',
        function ($scope, $ionicModal, CorporationEntityService, ParseLinks) {
            $scope.view = {
                page: 0,
                size: 20,
                lastPage: 0,
                corporationEntityItems: [],
                selectCorporationEntity: function(item){
                    $scope.name = item.companyName;
                    $scope.selected = item.companyReceiptedOID;
                    $scope.modal.hide();
                },
                loadMore: function(page){
                    $scope.view.page = page;
                    if(page === 0){
                        $scope.view.corporationEntityItems = [];
                    }
                    if($scope.view.lastPage >= page){
                        CorporationEntityService.getCorporationEntityList(page, $scope.view.size)
                            .success(function (data, status, headers) {
                                if (page === 0) {
                                    $scope.view.lastPage = ParseLinks.parse(headers('link')).last;
                                }
                                if (data.length > 0) {
                                    for (var i = 0; i < data.length; i++) {
                                        $scope.view.corporationEntityItems.push(data[i]);
                                    }
                                }
                            })
                            .finally(function () {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            });
                    }

                }
            }
            $ionicModal.fromTemplateUrl('corporation.entity.selector.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.view.loadMore(0);
                $scope.modal.show();
            };
        }]);

