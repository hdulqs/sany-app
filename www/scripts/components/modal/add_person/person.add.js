/**
 * Created by Yuko on 16/9/8.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('personAdd', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                fieldName: '=',
                readonly: '=',
                memberList: '='
            },
            templateUrl: 'scripts/components/modal/add_person/person.add.tpl.html',
            controller: 'com.handchina.huilianyi.PersonAddController'
        }
    }])
    .controller('com.handchina.huilianyi.PersonAddController', ['$scope', '$ionicModal', '$ionicLoading', 'TravelERVService', '$q','$filter',
        function ($scope, $ionicModal, $ionicLoading, TravelERVService, $q,$filter) {
            $scope.historyMember = [];
            $scope.view = {
                user: null,
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                closePersonAdd: function () {
                    $scope.memberList = angular.copy($scope.view.memberList);
                    $scope.personAddModal.hide();
                },
                showPersonAdd: function () {
                    if (!$scope.readonly) {
                        $scope.view.memberList = angular.copy($scope.memberList);
                        TravelERVService.getHistroyExternalParticipant()
                            .success(function (data) {
                                $scope.historyMember = data;
                                $scope.personAddModal.show();
                            })
                    }
                },
                validate: function (name) {
                    var deferred = $q.defer();
                    var i = 0;
                    for (; i < $scope.memberList.length; i++) {
                        if ($scope.memberList[i].name === name) {
                            $scope.view.openWarningPopup($filter('translate')('add_js.The.user.has.been.added'));//已添加该用户
                            deferred.reject(false);
                            break;
                        }
                    }
                    if (i === $scope.memberList.length) {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                },
                addHistoryPerson: function (member) {
                    $scope.view.validate(member)
                        .then(function () {
                            var user = {};
                            user.name = member;
                            user.index = $scope.memberList.length;
                            $scope.memberList.push(user);
                        });
                },
                showFillOutForm: function () {
                    $scope.view.user = null;
                    $scope.personForm.show();
                },
                clearHistory: function () {
                    TravelERVService.deleteHistoryExternalParticipant()
                        .success(function () {
                            $scope.historyMember = [];
                        })
                },
                addMember: function () {
                    if ($scope.view.user.index) {
                        $scope.memberList[$scope.view.user.index] = angular.copy($scope.view.user);
                    } else {
                        $scope.view.validate($scope.view.user.name)
                            .then(function () {
                                $scope.view.user.index = $scope.memberList.length;
                                $scope.memberList.push($scope.view.user);
                            });
                    }
                    $scope.personForm.hide();
                },
                removePerson: function (index) {
                    $scope.memberList.splice(index, 1);
                    $scope.view.openWarningPopup($filter('translate')('add_js.Has.been.removed'));//已移除
                },
                editPerson: function (item, index) {
                    item.index = index;
                    $scope.view.user = item;
                    $scope.personForm.show();
                }
            };
            $ionicModal.fromTemplateUrl('person.add.modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.personAddModal = modal;
            });
            $ionicModal.fromTemplateUrl('scripts/components/modal/add_person/information.fill.out.tpl.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.personForm = modal;
            });
        }]);

