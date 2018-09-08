/**
 * Created by lizhi on 17/1/14.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('applicantSelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                fieldName: '=',
                applicant: '=',        // 申请人
                readonly: '=',         // 是否只读
                maxLength: '=',
                showAlert: '=?', //申请人是否在参与人列表里
                hasAllowance: '=?', //如果修改申请人了，该申请单是否有差补
                showEmptyMember: '=',   //是否显示全员列表
                formType: '=',          // 表单类型,只能是京东申请单或者其他申请单或者报销单,jingdong || application || expenseReport
                searchAll: '=',          // 是否搜索所有人, 默认为不搜索
                promptInfo: '=?'   //placeholder
            },
            templateUrl: 'scripts/components/modal/applicant_selector/applicant.selector.modal.tpl.html',
            controller: 'com.handchina.huilianyi.ApplicantCenterSelectorController'
        }
    }])
    .controller('com.handchina.huilianyi.ApplicantCenterSelectorController', ['$scope', '$ionicModal', 'UserService',
                'ParseLinks', '$ionicLoading', 'AgencyService', '$rootScope', '$ionicPopup', '$filter',
        function ($scope, $ionicModal, UserService, ParseLinks, $ionicLoading, AgencyService, $rootScope, $ionicPopup, $filter) {
            $scope.person = {
                defaultOID: null,         // 默认OID
                isSearching: false,       // 是否搜索
                member: [],               // 获取到的人员列表
                userOIDList: [],          // 用户OID列表
                defalutApplicant: null,   // 默认申请人
                memberInfo: {             //
                    currentPage: 0,
                    size: 10,
                    links: null,
                    keyword: null,
                    nothing: false,
                    lastPage: 0
                },
                // 消息提示
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                // 取消
                cancel: function () {
                    $scope.applicant = angular.copy($scope.person.defalutApplicant);
                    $scope.personSelector.hide()
                },
                openPersonSelector: function () {
                    // 如果只读,直接退出
                    if ($scope.readonly){
                        return
                    }
                    // 拷贝传过来的数据,初始化
                    $scope.person.defalutApplicant = angular.copy($scope.applicant);
                    $scope.person.defaultOID = $scope.applicant.userOID;
                    $scope.person.memberInfo.keyword = null;
                    $scope.person.member = [];
                    $scope.person.loadMore(0);
                    $scope.personSelector.show();
                },
                // 添加申请人
                addMember: function (item, index) {
                    // 赋值并关闭modal
                    if($scope.formType == 'application'){
                        if($scope.person.defalutApplicant.userOID != item.userOID && $scope.showAlert){
                            var confirmPopup = $ionicPopup.confirm({
                                scope: $scope,
                                title: $filter('translate')('common.tip'), //提示
                                template: '<p style="text-align: center">' + $filter('translate')('common.appliant.change_title') + '</p> ' + //新的申请人将替换原参与人员中的默认数据
                                '<span ng-if="hasAllowance"> ' + $filter('translate')('common.appliant.clear_allowance') + '</span>',  //更改参与人员将清空已添加的差补
                                cancelText: $filter('translate')('common.cancel'), //取消
                                cancelType: 'button-calm',
                                okText: $filter('translate')('common.sure_modify'), //确认更改
                                cssClass: 'stop-time-popup'
                            });
                            confirmPopup.then(function (res) {
                                if (res) {
                                    $scope.applicant = item;
                                    angular.forEach($scope.person.member, function(selected){
                                        selected.checked = selected.userOID===$scope.applicant.userOID;
                                    });
                                    // 如果申请人改变了,保存申请人OID,触发ApplicantChanged事件
                                    if($scope.applicant.userOID!==AgencyService.getApplicantOID()){
                                        AgencyService.setApplicantOID($scope.applicant.userOID);
                                        // 根据不同的单据类型出发不同的申请人改变事件
                                        $rootScope[$scope.formType+'ApplicantChanged'] = true;
                                    }
                                    $scope.person.closePersonSelector();
                                } else {

                                }
                            })
                        } else {
                            $scope.applicant = item;
                            angular.forEach($scope.person.member, function(selected){
                                selected.checked = selected.userOID===$scope.applicant.userOID;
                            });
                            // 如果申请人改变了,保存申请人OID,触发ApplicantChanged事件
                            if($scope.applicant.userOID!==AgencyService.getApplicantOID()){
                                AgencyService.setApplicantOID($scope.applicant.userOID);
                                // 根据不同的单据类型出发不同的申请人改变事件
                                $rootScope[$scope.formType+'ApplicantChanged'] = true;
                            }
                            $scope.person.closePersonSelector();
                        }
                    } else {
                        $scope.applicant = item;
                        angular.forEach($scope.person.member, function(selected){
                            selected.checked = selected.userOID===$scope.applicant.userOID;
                        });
                        // 如果申请人改变了,保存申请人OID,触发ApplicantChanged事件
                        if($scope.applicant.userOID!==AgencyService.getApplicantOID()){
                            AgencyService.setApplicantOID($scope.applicant.userOID);
                            // 根据不同的单据类型出发不同的申请人改变事件
                            $rootScope[$scope.formType+'ApplicantChanged'] = true;
                        }
                        $scope.person.closePersonSelector();
                    }
                },
                closePersonSelector: function () {
                    $scope.personSelector.hide();
                },
                loadMore: function (page) {
                    if(!$scope.searchAll) {
                        AgencyService.getApplicantsCanSelect($scope.person.memberInfo.keyword)
                            .success(function (data) {
                                if (data.length > 0) {
                                    $scope.person.memberInfo.nothing = false;
                                    for (var i = 0; i < data.length; i++) {
                                        data[i].checked = data[i].userOID === $scope.applicant.userOID;
                                        $scope.person.member.push(data[i]);
                                    }
                                }
                            })
                            .finally(function () {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            });
                    } else {
                        // 搜索所有人
                        if ($scope.person.memberInfo.keyword) {
                            UserService.searchUser($scope.person.memberInfo.keyword, page, $scope.person.memberInfo.size)
                                .success(function (data, status, headers) {
                                    if (data.length > 0) {
                                        $scope.person.memberInfo.nothing = false;
                                        for (var i = 0; i < data.length; i++) {
                                            data[i].checked = data[i].userOID === $scope.applicant.userOID;
                                            $scope.person.member.push(data[i]);
                                        }
                                    }
                                    if (page === 0) {
                                        $scope.person.memberInfo.lastPage = ParseLinks.parse(headers('link')).last;
                                        $scope.person.memberInfo.links = ParseLinks.parse(headers('link'));
                                        if (data.length === 0) {
                                            $scope.person.memberInfo.nothing = true;
                                        }
                                    }
                                })
                                .finally(function () {
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                })
                        } else {
                            UserService.getAllUsers(page, $scope.person.memberInfo.size)
                                .success(function (data, status, headers) {
                                    if (data.length > 0) {
                                        $scope.person.memberInfo.nothing = false;
                                        for (var i = 0; i < data.length; i++) {
                                            data[i].checked = data[i].userOID === $scope.applicant.userOID;
                                            $scope.person.member.push(data[i]);
                                        }
                                    }
                                    if (page === 0) {
                                        $scope.person.memberInfo.links = ParseLinks.parse(headers('link'));
                                        $scope.person.memberInfo.lastPage = ParseLinks.parse(headers('link')).last;
                                    }
                                })
                                .finally(function () {
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                })
                        }
                    }
                }
            };
            $scope.$watch('person.memberInfo.keyword', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.person.memberInfo.nothing = false;
                    $scope.person.member = [];
                    $scope.person.loadMore(0);
                }
            });
            $ionicModal.fromTemplateUrl('applicant.selector.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.personSelector = modal;
            });
        }]);
