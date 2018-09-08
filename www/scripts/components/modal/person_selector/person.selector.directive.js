/**
 * Created by Yuko on 16/7/27.
 */
'use strict';
angular.module('huilianyi.pages')
    //.config(['$stateProvider', function ($stateProvider) {
    //    $stateProvider
    //        .state('app.erv_person_selector', {
    //            url: '/erv/person/selector',
    //            views: {
    //                'page-content@app': {
    //                    templateUrl: 'scripts/components/modal/person_selector/person.selector.tpl.html',
    //                    controller: 'com.handchina.huilianyi.ErvPersonSelectorController'
    //                }
    //            }
    //        })
    //
    //}])
    .directive('personSelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                memberList: '=',
                readonly: '=',
                maxLength: '=',
                showEmptyMember: '=',//是否显示全员列表
                canDeleteOwer: '=',
                authorityData: '=?',
                showAllowanceTips: '=?',
                holder: '=?',
                travelSubsidies: '=?' //差旅补贴
            },
            templateUrl: 'scripts/components/modal/person_selector/person.selector.tpl.html',
            controller: 'com.handchina.huilianyi.ErvPersonSelectorController'
        }
    }])
    .controller('com.handchina.huilianyi.ErvPersonSelectorController', ['$scope', '$ionicModal', 'UserService', 'ParseLinks',
        '$ionicLoading','$filter', 'CustomApplicationServices', 'Principal', '$ionicPopup', 'PublicFunction',
        function ($scope, $ionicModal, UserService, ParseLinks, $ionicLoading, $filter, CustomApplicationServices, Principal, $ionicPopup, PublicFunction) {
            $scope.person = {
                defaultOID: null,
                isSearching: false,
                member: [],
                userOIDList: [],
                defalutMemberList: null,
                memberInfo: {
                    currentPage: 0,
                    size: 10,
                    links: null,
                    searchName: null,
                    nothing: false,
                    lastPage: 0
                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                cancel: function () {
                    $scope.memberList = angular.copy($scope.person.defalutMemberList);
                    $scope.personSelector.hide()
                },
                sure: function () {
                    if($scope.showAllowanceTips){
                        if($scope.memberList.length != $scope.defalutUserOIDList.length){
                            var confirmPopup = $ionicPopup.confirm({
                                title: $filter('translate')('approval_selector_js.tip'), //提示
                                template: '<p style="text-align: center">' + $filter('translate')('approval_selector_js.clear_allowance')+'</p>', //更改参与人将清空已添加的差补
                                cancelText: $filter('translate')('destination.cancel'), //取消
                                cancelType: 'button-calm',
                                okText: $filter('translate')('approval_selector_js.sure_modify'), //确认更改
                                cssClass: 'stop-time-popup'
                            });
                            confirmPopup.then(function (res) {
                                if (res) {
                                    // confirmPopup.close();
                                    $scope.travelSubsidies = null;
                                    if($scope.authorityData){
                                        $scope.authorityData.participantsOID = angular.copy($scope.person.userOIDList);
                                    }
                                    $scope.personSelector.hide();
                                }
                            })
                        } else {
                            var i = 0
                            for(i = 0; i < $scope.memberList.length; i++){
                                if( $scope.defalutUserOIDList.indexOf($scope.memberList[i].userOID) == -1){
                                    var confirmPopup = $ionicPopup.confirm({
                                        title: $filter('translate')('approval_selector_js.tip'), //提示
                                        template: '<p style="text-align: center">' + $filter('translate')('approval_selector_js.clear_allowance')+'</p>', //更改参与人将清空已添加的差补
                                        cancelText: $filter('translate')('destination.cancel'), //取消
                                        cancelType: 'button-calm',
                                        okText: $filter('translate')('approval_selector_js.sure_modify'), //确认更改
                                        cssClass: 'stop-time-popup'
                                    });
                                    confirmPopup.then(function (res) {
                                        if (res) {
                                            if($scope.authorityData){
                                                $scope.authorityData.participantsOID = angular.copy($scope.person.userOIDList);
                                            }
                                            $scope.personSelector.hide();
                                        }
                                    })
                                    break;
                                }
                            }
                            if(i == $scope.memberList.length){
                                if($scope.authorityData){
                                    $scope.authorityData.participantsOID = angular.copy($scope.person.userOIDList);
                                }
                                $scope.personSelector.hide();
                            }
                        }
                    } else {
                        if($scope.authorityData){
                            $scope.authorityData.participantsOID = angular.copy($scope.person.userOIDList);
                        }
                        $scope.personSelector.hide();
                    }
                },
                deleteMember: function (index) {
                    if (index !== 0) {
                        if ($scope.person.member[index].userOID !== $scope.person.defaultOID) {
                            $scope.memberList.splice(index, 1);
                        }
                    }

                },
                removeMember: function (item, index) {
                    if (item.userOID !== $scope.person.defaultOID) {
                        for (var i = 0; i < $scope.person.member.length; i++) {
                            if (item.userOID === $scope.person.member[i].userOID) {
                                $scope.person.member[i].checked = false;
                                break;
                            }
                        }
                        $scope.memberList.splice(index, 1);
                        $scope.person.userOIDList.splice(index, 1);
                    }

                },
                openPersonSelector: function () {
                    $scope.person.defalutMemberList = angular.copy($scope.memberList);
                    $scope.person.userOIDList = [];
                    $scope.defalutUserOIDList = []; //最初的userOID
                    if($scope.memberList.length > 0 && !$scope.canDeleteOwer){
                        $scope.person.defaultOID = $scope.memberList[0].participantOID;
                    }
                    var num = 0;
                    for (; num < $scope.memberList.length; num++) {
                        $scope.memberList[num].userOID = $scope.memberList[num].participantOID;
                        $scope.person.userOIDList.push($scope.memberList[num].userOID);
                    }
                    if (num === $scope.memberList.length) {
                        $scope.defalutUserOIDList = angular.copy($scope.person.userOIDList);
                        $scope.person.memberInfo.searchName = null;
                        $scope.person.member = [];
                        $scope.person.loadMore(0);
                        $scope.adminList = [];
                        Principal.identity().then(function (data) {
                            CustomApplicationServices.getAdminList(data.companyOID, 0, 3)
                                .success(function (data) {
                                    $scope.adminList = data;
                                })
                        })
                        $scope.personSelector.show();
                    }
                },
                addMember: function (item, index) {
                    var temp = $.inArray(item.userOID, $scope.person.userOIDList);
                    if (temp > -1) {
                        if (item.userOID !== $scope.person.defaultOID) {
                            $scope.person.member[index].checked = false;
                            $scope.memberList.splice(temp, 1);
                            $scope.person.userOIDList.splice(temp, 1);
                        }
                    } else {
                        if ($scope.maxLength>0 && $scope.maxLength <= $scope.memberList.length) {
                            $scope.person.openWarningPopup($filter('translate')('approval_selector_js.The.most.optional') + $scope.maxLength + $filter('translate')('person_tpl_js.participants'));//最多可选 个参与人
                        } else {
                            $scope.person.member[index].checked = true;
                            $scope.memberList.push(item);
                            $scope.person.userOIDList.push(item.userOID);
                            if ($scope.person.memberInfo.searchName !== null && $scope.person.memberInfo.searchName !== '') {
                                $scope.person.memberInfo.searchName = null;
                                $scope.person.member = [];
                            }
                        }
                    }
                },
                loadMore: function (page) {
                    if(!$scope.person.isSearching){
                        $scope.person.isSearching = true;
                        $scope.person.memberInfo.currentPage = page;
                        if(page == 0){
                            PublicFunction.showLoading();
                            $scope.person.member = [];
                        }
                        if ($scope.person.memberInfo.searchName !== null && $scope.person.memberInfo.searchName !== '') {
                            if($scope.authorityData && $scope.authorityData.formOID){
                                //根据数据权限搜索
                                CustomApplicationServices.getFormParticipantList($scope.authorityData, page, $scope.person.memberInfo.size, $scope.person.memberInfo.searchName)
                                    .success(function (data, status, headers) {
                                        $ionicLoading.hide();
                                        if (data.length > 0) {
                                            $scope.person.memberInfo.nothing = false;
                                            for (var i = 0; i < data.length; i++) {
                                                var index = $.inArray(data[i].userOID, $scope.person.userOIDList);
                                                if (index > -1) {
                                                    data[i].checked = true;
                                                } else {
                                                    data[i].checked = false;
                                                }
                                                data[i].participantOID = data[i].userOID;
                                                $scope.person.member.push(data[i]);
                                            }
                                        } else {
                                            $scope.person.memberInfo.nothing = true;
                                        }
                                        if (page === 0) {
                                            $scope.person.memberInfo.links = ParseLinks.parse(headers('link'));
                                            $scope.person.memberInfo.lastPage = ParseLinks.parse(headers('link')).last;
                                        }
                                    })
                                    .error(function (error) {
                                        $ionicLoading.hide();
                                        if($scope.person.member.length == 0){
                                            $scope.person.memberInfo.nothing = true;
                                        }
                                        if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].externalPropertyName){
                                            // 2010: 申请人为空  2011:部门为空  2012：成本中心为空
                                            if(error.validationErrors[0].externalPropertyName == '2012'){
                                                PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_costCenter')); //请先选择成本中心
                                            } else if(error.validationErrors[0].externalPropertyName == '2010'){
                                                PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_applicant')); //请先选择申请人
                                            } else if(error.validationErrors[0].externalPropertyName == '2011'){
                                                PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_department')); //请先选择部门
                                            }
                                        } else {
                                            PublicFunction.showToast($filter('translate')('approval_selector_js.mistake')); //出错了
                                        }
                                    })
                                    .finally(function () {
                                        $scope.person.isSearching = false;
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                    })
                            } else {
                                UserService.searchUser($scope.person.memberInfo.searchName, page, $scope.person.memberInfo.size)
                                    .success(function (data, status, headers) {
                                        $ionicLoading.hide();
                                        if (data.length > 0) {
                                            $scope.person.memberInfo.nothing = false;
                                            for (var i = 0; i < data.length; i++) {
                                                var index = $.inArray(data[i].userOID, $scope.person.userOIDList);
                                                if (index > -1) {
                                                    data[i].checked = true;
                                                } else {
                                                    data[i].checked = false;
                                                }
                                                data[i].participantOID = data[i].userOID;
                                                $scope.person.member.push(data[i]);
                                            }
                                        } else {
                                            $scope.person.memberInfo.nothing = true;
                                        }
                                        if (page === 0) {
                                            $scope.person.memberInfo.lastPage = ParseLinks.parse(headers('link')).last;
                                            $scope.person.memberInfo.links = ParseLinks.parse(headers('link'));
                                            if (data.length === 0) {
                                                $scope.person.memberInfo.nothing = true;
                                            }
                                        }
                                    })
                                    .error(function (error) {
                                        $ionicLoading.hide();
                                        if($scope.person.member.length == 0){
                                            $scope.person.memberInfo.nothing = true;
                                        }
                                        if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].message){
                                            PublicFunction.showToast(error.validationErrors[0].message);
                                        }
                                    })
                                    .finally(function () {
                                        $scope.person.isSearching = false;
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                    })
                            }

                        }
                        else {
                            //根据数据权限
                            if($scope.authorityData && $scope.authorityData.formOID){
                                CustomApplicationServices.getFormParticipantList($scope.authorityData, page, $scope.person.memberInfo.size)
                                    .success(function (data, status, headers) {
                                        $ionicLoading.hide();
                                        if (data.length > 0) {
                                            $scope.person.memberInfo.nothing = false;
                                            for (var i = 0; i < data.length; i++) {
                                                var index = $.inArray(data[i].userOID, $scope.person.userOIDList);
                                                if (index > -1) {
                                                    data[i].checked = true;
                                                } else {
                                                    data[i].checked = false;
                                                }
                                                data[i].participantOID = data[i].userOID;
                                                $scope.person.member.push(data[i]);
                                            }
                                        } else {
                                            $scope.person.memberInfo.nothing = true;
                                        }
                                        if (page === 0) {
                                            $scope.person.memberInfo.links = ParseLinks.parse(headers('link'));
                                            $scope.person.memberInfo.lastPage = ParseLinks.parse(headers('link')).last;
                                        }
                                    })
                                    .error(function (error) {
                                        $ionicLoading.hide();
                                        if($scope.person.member.length == 0){
                                            $scope.person.memberInfo.nothing = true;
                                        }
                                        if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].externalPropertyName){
                                            // 2010: 申请人为空  2011:部门为空  2012：成本中心为空
                                            if(error.validationErrors[0].externalPropertyName == '2012'){
                                                PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_costCenter')); //请先选择成本中心
                                            } else if(error.validationErrors[0].externalPropertyName == '2010'){
                                                PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_applicant')); //请先选择申请人
                                            } else if(error.validationErrors[0].externalPropertyName == '2011'){
                                                PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_department')); //请先选择部门
                                            }
                                        } else {
                                            PublicFunction.showToast($filter('translate')('approval_selector_js.mistake')); //出错了
                                        }
                                    })
                                    .finally(function () {
                                        $scope.person.isSearching = false;
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                    })
                            } else {
                                UserService.getAllUsers(page, $scope.person.memberInfo.size)
                                    .success(function (data, status, headers) {
                                        $ionicLoading.hide();
                                        if (data.length > 0) {
                                            $scope.person.memberInfo.nothing = false;
                                            for (var i = 0; i < data.length; i++) {
                                                var index = $.inArray(data[i].userOID, $scope.person.userOIDList);
                                                if (index > -1) {
                                                    data[i].checked = true;
                                                } else {
                                                    data[i].checked = false;
                                                }
                                                data[i].participantOID = data[i].userOID;
                                                $scope.person.member.push(data[i]);
                                            }
                                        } else {
                                            $scope.person.memberInfo.nothing = true;
                                        }
                                        if (page === 0) {
                                            $scope.person.memberInfo.links = ParseLinks.parse(headers('link'));
                                            $scope.person.memberInfo.lastPage = ParseLinks.parse(headers('link')).last;
                                        }
                                    })
                                    .error(function (error) {
                                        $ionicLoading.hide();
                                        if($scope.person.member.length == 0){
                                            $scope.person.memberInfo.nothing = true;
                                        }
                                        if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].message){
                                            PublicFunction.showToast(error.validationErrors[0].message);
                                        }
                                    })
                                    .finally(function () {
                                        $scope.person.isSearching = false;
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                    })
                            }
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }

                }
            };
            $scope.$watch('person.memberInfo.searchName', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.person.memberInfo.nothing = false;
                    $scope.person.member = [];
                    $scope.person.loadMore(0);
                }
            });
            $ionicModal.fromTemplateUrl('member.selector.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.personSelector = modal;
            });
        }]);

