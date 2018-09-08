/**
 * Created by fangqiang on 17/5/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('contactQuickBar', function ($ionicPlatform) {
            return {
                restrict: 'E',
                replace: true,
                require: ['contactQuickBar'],
                controller: 'contactQuickBarCtrl',
                controllerAs: 'cityView',
                template: '<div><div class="contact-quick-bar-header" ng-if="showHeaderFlag" ng-bind-html="contactHeaderItem"></div>' +
                '<div class="contact-quick-bar" ng-style="quickBarStyle">' +
                '<div class="contact-quick-content" id="contactQuickHandle" ng-style="quickContentStyle">' +
                '<div ng-repeat="item in quickSearchBar" ng-style="item.style">' +
                '<div ng-bind="item.element" ng-click="cityView.contactQuick(item.element)" >' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div></div>',
                link: function ($scope, $element, $attrs, ctrls) {

                    var contactCtrl = ctrls[0];
                    // console.log(typeof($('#contactQuickHandle')));
                    // console.log($('#contactQuickHandle'));
                    // console.log(angular.element('#contactQuickHandle')[0].offsetTop);
                    // console.log(angular.element('#contactQuickHandle')[0].offsetHeight);
                    setTimeout(function () {
                        if($ionicPlatform.is('ios')){
                            contactCtrl.init(138);//因为获取不到DOM还未加载到文本中.所以只能钉死为138px....
                        }else {
                            contactCtrl.init(118);//因为获取不到DOM还未加载到文本中.所以只能钉死为118px....
                        }
                        // var offsetTop = angular.element('#contactQuickHandle')[0].offsetTop;
                    }, 0);

                }
            }
        }
    )
    .controller('contactQuickBarCtrl', [
        '$scope',
        '$state',
        '$attrs',
        '$ionicBind',
        '$ionicGesture',
        '$location',
        '$anchorScroll',
        '$filter',
        function ($scope,
                  $state,
                  $attrs,
                  $ionicBind,
                  $ionicGesture,
                  $location,
                  $anchorScroll,
                  $filter) {

            var vm = this;
            //字母检索栏的字母的默认大小
            var barDefaultElementSize = '12px';

            //字母检索栏的字母的默认颜色
            var barDefaultElementColor = 'blue';

            //字母检索栏的字母的默认占用高度
            var barDefaultElementHeight = 20;

            var touchDefaultOffset = 3;

            //字母检索栏的默认高度，后面可以根据屏幕尺寸设置自适应匹配
            var barDefaultHeight = screen.height;

            //字母检索栏的默认背景颜色
            var barDefaultBackground = 'gray';

            //当前选中的字母
            var currentElement = '';

            //字母检索滑动动画的半径
            // var roundRate = 9;

            //一共多少个检索标签
            var elementNum = 24;

            $scope.contactHeaderItem = '';//当前选中的标签

            $scope.showHeaderFlag = false;
            var elementBarTopHeight = 44;//字母咧距离顶部的距离 初始化
            var barElementHeight;//元素字母的高度
            var touchOffset;

            //是否显示快速检索的动画
            var showAnimate;

            if (angular.isDefined($attrs.showAnimate) && $attrs.showAnimate == 'true') {
                showAnimate = true;
            } else {
                showAnimate = false;
            }
            // console.log($attrs);

            if (!angular.isDefined($attrs.barElementSize) || $attrs.barElementSize === '') {
                $attrs.$set('barElementSize', barDefaultElementSize);
            }
            if (!angular.isDefined($attrs.barElementColor) || $attrs.barElementColor === '') {
                $attrs.$set('barElementColor', barDefaultElementColor);
            }
            if (!angular.isDefined($attrs.barElementHeight) || $attrs.barElementHeight === '') {
                $attrs.$set('barElementHeight', barDefaultElementHeight);
            }
            if (!angular.isDefined($attrs.barBackground) || $attrs.barBackground === '') {
                $attrs.$set('barBackground', barDefaultBackground);
            }
            if (!angular.isDefined($attrs.touchOffset) || $attrs.touchOffset === '') {
                $attrs.$set('touchOffset', touchDefaultOffset);
            }

            try {//设置默认字符高度
                barElementHeight = parseInt($attrs.barElementHeight);
                if (barElementHeight > 20) {
                    barElementHeight = barDefaultElementHeight;
                    // console.log('字符的高度不能超过20');
                }
            }
            catch (e) {
                // console.log('字符的高度必须为数字');
                barElementHeight = barDefaultElementHeight;
            }

            try {
                touchOffset = parseInt($attrs.touchOffset);
                if (touchOffset < 1 || touchOffset >= $attrs.barElementHeight) {
                    touchOffset = barDefaultElementHeight;
                    //  console.log('字符的高度不能超过20');
                }
            }
            catch (e) {
                // console.log('字符的高度必须为数字');
                touchOffset = barDefaultElementHeight;
            }

            var barActualHeight = barDefaultHeight;

            var offsetTop = (parseInt($attrs.barHeight) + 44) / 2;

            if (ionic.Platform.isIOS()) {
                offsetTop = (parseInt($attrs.barHeight) + 64) / 2;
                //elementBarTopHeight = elementBarTopHeight + 24;
            }

            $scope.quickContentStyle = {
                "margin-top": "0px",
                "height": barActualHeight + "px"
            };

            $ionicBind($scope, $attrs, {
                $onElementClick: '&onElementClick',
                $onElementTouched: '&onElementTouched'
            });
            //快速检索条
            $scope.quickSearchBar = [];
            $scope.elementList = [
                $filter('translate')('city_js.history'), $filter('translate')('city_js.popular'), 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','J', 'K', 'L', 'M',
                'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'
            ];
            function getElementStyle(offset, selectedFlag) {
                if (selectedFlag) {
                    return {
                        "color": $attrs.barElementColor,
                        "font-size": '16px',
                        "font-weight": "bold",
                        //"border-radius": "8px",
                        //"border": "1px solid #f5f5f5",
                        "height": $attrs.barElementHeight + "px",
                        "line-height": $attrs.barElementHeight + "px",
                        "width": "40px",
                        "margin-left": (0 - offset) + "px"
                    };
                } else {
                    return {
                        "color": $attrs.barElementColor,
                        "font-size": $attrs.barElementSize,
                        "height": $attrs.barElementHeight + "px",
                        "line-height": $attrs.barElementHeight + "px",
                        "width": "40px",
                        "margin-left": (0 - offset) + "px"
                    };
                }
            }

            //初始化数据
            vm.init = function (offsetTop) {
                barDefaultElementHeight = (screen.height - offsetTop) / 24;//设置每一个字符的高度
                $attrs.$set('barElementHeight', barDefaultElementHeight);

                angular.forEach($scope.elementList, function (data) {
                    var item = {
                        "element": data,
                        "style": getElementStyle(0)
                    };
                    $scope.quickSearchBar.push(item);
                });
                elementBarTopHeight = offsetTop;
                $scope.quickContentStyle = {
                    "margin-top": offsetTop - 44 + "px",
                    "width": 20 + "px",
                    "height": screen.height  - offsetTop + "px"
                };

                $scope.quickBarStyle = {
                    "background": $attrs.barBackground
                }
            };
            vm.numberFlag = 0;
            vm.contactQuick = function (item) {
                if ($scope.$onElementClick) {
                    $scope.$onElementClick();
                }

                //正式使用
                //$location.hash('element' + item);
                //$anchorScroll();
                //只是为了演示使用
                // if($attrs.barTab === "0"){
                document.getElementById('element' + item).scrollIntoView();

                // }else {
                //     document.getElementById('elementInter' + item).scrollIntoView();
                //
                // }


                if (vm.numberFlag === 0) {//触发监听事件,在加载完DOM的时候再给元素添加监听.
                    vm.numberFlag++;
                    setTimeout(function () {
                        var element = angular.element(document.querySelector('#contactQuickHandle'));
                        // //拖拽滑动数据
                        $ionicGesture.on("drag", function (e) {
                            quickLocate(e.gesture.touches[0].pageY);
                        }, element);
                        $ionicGesture.on("touch", function (e) {
                        }, element);
                        $ionicGesture.on("release", function (e) {
                            $scope.showHeaderFlag = false;
                            angular.forEach($scope.quickSearchBar, function (data) {
                                data.style = getElementStyle(0);
                            });
                            $scope.$apply();
                        }, element);
                    }, 100)
                }
            };
            function isLocateToElement(top, y, index) {//判断当前drag到的元素的Y坐标是否是当前遍历到的元素
                if (y > (top + (index) * $attrs.barElementHeight) + $attrs.touchOffset
                    && y <= (top + (index + 1) * $attrs.barElementHeight) - $attrs.touchOffset) {
                    return true;
                }
                return false;
            }

            function getElementStyle(offset, selectedFlag) {
                if (selectedFlag) {
                    return {
                        "color": $attrs.barElementColor,
                        "font-size": '16px',
                        "font-weight": "bold",
                        "height": $attrs.barElementHeight + "px",
                        "line-height": $attrs.barElementHeight + "px",
                        "width": "40px",
                        "margin-left": (0 - offset) + "px"
                    };
                } else {
                    return {
                        "color": $attrs.barElementColor,
                        "font-size": $attrs.barElementSize,
                        "height": $attrs.barElementHeight + "px",
                        "line-height": $attrs.barElementHeight + "px",
                        "width": "40px",
                        "margin-left": (0 - offset) + "px"
                    };
                }
            }

            function animate(index, showAnimate) {
                angular.forEach($scope.quickSearchBar, function (data) {
                    data.style = getElementStyle(0);
                });

                if (!showAnimate) {
                    $scope.quickSearchBar[index].style = getElementStyle(0, false);
                    return;
                }
                $scope.quickSearchBar[index].style = getElementStyle(0, true);
            }

            function quickLocate(pageY) {
                for (var i = 0; i < elementNum; i++) {
                    if (isLocateToElement(elementBarTopHeight, pageY, i)) {
                        if (currentElement === '' || currentElement != $scope.elementList[i]) {
                            $scope.showHeaderFlag = true;
                            currentElement = $scope.elementList[i];
                            $scope.contactHeaderItem = $scope.elementList[i];
                            animate(i, showAnimate);//改变样式,或者加入动画
                            $scope.$apply();
                            //正式使用
                            // if($attrs.barTab === "0"){
                            $location.hash('element' + $scope.elementList[i]);

                            // }else {
                            //     $location.hash('elementInter' + $scope.elementList[i]);
                            //
                            // }
                            $anchorScroll();
                            //只是为了演示使用
                            // document.getElementById('element' + $scope.elementList[i]).scrollIntoView();
                        }
                    }
                }
            }

        }]);
