var app = angular.module("app", [
    "ui.router",
    //延迟加载
    "oc.lazyLoad",
    "ngSanitize",
    "infinite-scroll",
    "ionic"
]);
app.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: false
    });
}]);

app.directive("ngTouchstart", function () {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.bind("touchstart", onTouchStart);
            function onTouchStart(event) {
                var method = $element.attr("ng-touchstart");
                $scope.$apply(method);
            }
        }]
    }
})

    .directive("ngTouchmove", function () {
        return {
            controller: ["$scope", "$element", function ($scope, $element) {

                $element.bind("touchstart", onTouchStart);
                function onTouchStart(event) {
                    event.preventDefault();
                    $element.bind("touchmove", onTouchMove);
                    $element.bind("touchend", onTouchEnd);
                }

                function onTouchMove(event) {
                    var method = $element.attr("ng-touchmove");
                    $scope.$apply(method);
                }

                function onTouchEnd(event) {
                    event.preventDefault();
                    $element.unbind("touchmove", onTouchMove);
                    $element.unbind("touchend", onTouchEnd);
                }

            }]
        }
    })
    .directive("ngTouchend", function () {
        return {
            controller: ["$scope", "$element", function ($scope, $element) {
                $element.bind("touchend", onTouchEnd);
                function onTouchEnd(event) {
                    var method = $element.attr("ng-touchend");
                    $scope.$apply(method);
                }
            }]
        }
    });

app.directive("modalCenter", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('show.bs.modal', function () {
                var $clone = element.clone().css('display', 'block').appendTo('body');
                var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
                top = top > 0 ? top : 0;
                $clone.remove();
                element.find('.modal-content').css("margin-top", top);
            });
        }
    }
});

app.directive("heightResizable", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.height($(window).height() - attrs.heightResizable);
            angular.element($(window)).bind('resize', function () {
                element.height($(window).height() - attrs.heightResizable);
            });
        }
    }
});

app.directive("widthResizable", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.width($(window).width() - attrs.widthResizable);
            angular.element($(window)).bind('resize', function () {
                element.width($(window).width() - attrs.widthResizable);
            });
        }
    }
});

app.directive('winTip', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: './app/pop/winTip.html'
    };
});

app.directive('popTip', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: './app/pop/popTip.html'
    };
});

app.directive('winYesNo', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: './app/pop/winYesNo.html'
    };
});

app.directive('loading', ['$rootScope', '$state', 'popService', function ($rootScope, $state, popService) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: './app/pop/loading.html',
        link: function (scope, element, attrs) {
            popService.loading(false);

            $rootScope.$on('$stateChangeStart', function () {
                popService.loading(true);
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                popService.loading(false);
            });
            $rootScope.$on('$stateNotFound', function () {
                popService.loading(false);
            });
            $rootScope.$on('$stateChangeError', function () {
                popService.loading(false);
            });
        }
    };
}]);

app.factory('popService', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    $rootScope.popTip = {};
    $rootScope.winTip = {};
    $rootScope.winYesNo = {
        content:"",
        yesFunc:function(){}
    };

    function popTip(content) {
        $timeout.cancel($rootScope.popTip.timeout);
        $rootScope.popTip.content = content;
        $('#popTip').modal({backdrop: false});

        $rootScope.popTip.timeout = $timeout(function () {
            $('#popTip').modal('hide');
        }, 2000);
    }

    function winTip(content, showClose) {
        $rootScope.winTip.content = content;
        $rootScope.winTip.showClose = showClose;
        $('#winTip').modal("show");
    }

    function loading(show) {
        $rootScope.isLoading = show;
    }

    function showWinYesNo(content,yesFunc) {
        if(content)
            $rootScope.winYesNo.content = content;
        if(yesFunc)
            $rootScope.winYesNo.yesFunc = yesFunc;
        $('#winYesNo').modal("show");
    };

    function hideWinYesNo() {
        $('#winYesNo').modal("hide");
    };

    return {
        winTip: winTip,
        popTip: popTip,
        loading: loading,
        showWinYesNo:showWinYesNo,
        hideWinYesNo:hideWinYesNo
    };
}]);

app.factory('httpInterceptor', ["$q", "$rootScope", "popService", function ($q, $rootScope, popService) {
    return {
        request: function (config) {
            popService.loading(true);
            if($rootScope.user){
                config.headers.user =  JSON.stringify($rootScope.user)
                // config.headers.token =  $rootScope.user.token || '';
                // config.headers.openType =  $rootScope.user.openType || '';
            }
            config.timeout = 300 * 1000;
            return config;
        },
        response: function (res) {
            popService.loading(false);
            if (res.data.respCode == "-1") {
                setTimeout(function () {
                    popService.popTip("请重新登陆");
                    bfmPassport.passport();
                }, 2000);
                return $q.reject(res);
            }
            else {
                return res;
            }
        },
        responseError: function (res) {
            popService.loading(false);
            popService.popTip("网络连接不可用,请检查");
            return $q.reject(res);
        }
    };
}]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
});

app.filter('trustedHtml', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    // Redirect any unmatched url
    //去掉url地址栏# 加上此行表明进行页面刷新的时候先要去后台进行路由匹配 然后才会进入前台进行 state跳转
    //(地址栏若果有#则不进入后台直接在前台进行state url匹配)
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise("/main");

    $stateProvider
        .state('main', {
            url: "/main",
            templateUrl: "./app/main/main.html",
            title: '恭迎陛下',
            controller: "mainCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    var files = [
                    //     {
                    //     insertBefore: '#ng_load_css_before',
                    //     files: [
                    //         // './app/login/login.css',
                    //     ]
                    // },
                        {
                        files: [
                            './app/main/main.js'
                        ]
                    }];
                    return $ocLazyLoad.load(files);
                }]
            }
        })
        .state('choose', {
            url: "/choose",
            templateUrl: "./app/choose/choose.html",
            title: '请选择',
            controller: "chooseCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    var files = [
                        //     {
                        //     insertBefore: '#ng_load_css_before',
                        //     files: [
                        //         // './app/login/login.css',
                        //     ]
                        // },
                        {
                            files: [
                                './app/choose/choose.js'
                            ]
                        }];
                    return $ocLazyLoad.load(files);
                }]
            }
        })
        .state('cList', {
            url: "/cList",
            templateUrl: "./app/cList/cList.html",
            title: '请选择',
            controller: "cListCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    var files = [
                        //     {
                        //     insertBefore: '#ng_load_css_before',
                        //     files: [
                        //         // './app/login/login.css',
                        //     ]
                        // },
                        {
                            files: [
                                './app/cList/cList.js'
                            ]
                        }];
                    return $ocLazyLoad.load(files);
                }]
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "./app/login/login.html",
            title: '佰付美-登录',
            params: {
                searchType: 1
            },
            controller: "loginCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    var files = [{
                        insertBefore: '#ng_load_css_before',
                        files: [
                            './app/login/login.css',
                        ]
                    }, {
                        files: [
                            './app/login/login.js'
                        ]
                    }];
                    return $ocLazyLoad.load(files);
                }]
            }
        })

}]);

app.run(["$rootScope", "$state","popService", function ($rootScope, $state,popService) {


    // $rootScope.historyBack = function () {
    //     history.go(-1);
    // }

    // $rootScope.$on('$stateChangeStart',
    //     function(event, toState, toParams, fromState, fromParams) {

            // if (toState.url !=  '/fueling/main' && toState.url !=  '/fueling/map' && toState.url !=  '/fueling/list' && toState.url !=  '/fueling/navMap'){
            //     if(!$rootScope.user.token){
            //         event.preventDefault();// 取消默认跳转行为
            //
            //         bfmPassport.forceLogin(function(userData){
            //             if(userData){
            //                 $rootScope.user = userData;
            //             }
            //         });
            //     }
            // }
        // })


    $rootScope.requireLogin = true;
    $rootScope.title = "恭迎陛下";

    $rootScope.needData = {
        bottomTitle:'进入图集',
        leftTop:true,
        bottomRight:false
    }

    $rootScope.selData = {
        selAtlas:{},
        selChild:{}
    }

}]);

$(document).ready(function(){
    angular.bootstrap(document, ['app']);
});

// bfmPassport.login(function(userData){
//     window.user = {};
//     // alert(JSON.stringify(userData)+'login');
//     for(var key in userData){
//         if(userData[key]){
//             window.user[key] = userData[key];
//         }
//     }
//     if(window.user.uid && window.user.token){
//         window.user.query = '?uid='+ user.uid + '&token=' + user.token;
//     }
//     else{
//         window.user.query = '';
//     }
//     angular.bootstrap(document.body, ['app']);
// });
