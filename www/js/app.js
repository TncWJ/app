// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })

    //检测图片指令
    .directive('mySrc', function () {
        return {
            restrict: 'EA',
            replace:true,
            template:'<img src="{{url}}"/>',
            link: function (scope, iElement, attrs) {
                var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                var objExp=new RegExp(Expression);
                if(!objExp.test(attrs.mySrc)==true){
                    scope.url = 'http://app.letyoufun.com'+attrs.mySrc;
                }else{
                    scope.url = attrs.mySrc;
                }
            }
        }
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js

        $ionicConfigProvider.tabs.position("bottom");

        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })

            //      user
            .state('tab.user', {
                url: '/user',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/tab-user.html',
                        controller: 'UserCenterCtrl'
                    }
                }
            })
            .state('tab.user-order', {
                url: '/user-order',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/order.html'
                    }
                }
            })
            .state('tab.user-zhi', {
                url: '/user-zhi',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/zhi.html'
                    }
                }
            })
            .state('tab.user-xin', {
                url: '/user-xin',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/xin.html'
                    }
                }
            })
            .state('tab.user-zhang', {
                url: '/user-zhang',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/zhang.html'
                    }
                }
            })

            .state('tab.user-info', {
                url: '/user-info',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/info.html',
                        controller: 'UserInfoCtrl'
                    }
                }
            })


            .state('tab.user-star', {
                url: '/user-star',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/star.html'
                    }
                }
            })

            .state('tab.user-limitActive', {
                url: '/user-limitActive',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/limitActive.html'
                    }
                }
            })
            .state('tab.user-limitActive2', {
                url: '/user-limitActive2',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/limitActive2.html'
                    }
                }
            })

            .state('tab.user-limitActive3', {
                url: '/user-limitActive3',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/limitActive3.html'
                    }
                }
            })

            .state('tab.user-quan', {
                url: '/user-quan',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/quan.html'
                    }
                }
            })

            .state('tab.user-safe', {
                url: '/user-safe',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/safe.html',
                        controller: 'UserCenterCtrl'
                    }
                }
            })

        /**
         * 用户安全
         */
            .state('tab.user-safe-password-login', {
                url: '/user-safe-password-login',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/loginPass.html',
                        controller: 'UserCenterCtrl'
                    }
                }
            })
            .state('tab.user-safe-password-pay', {
                url: '/user-safe-password-pay',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/payPass.html',
                        controller: 'UserCenterCtrl'
                    }
                }
            })
            .state('tab.user-safe-moblie', {
                url: '/user-safe-moblie',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/moblie.html'
                    }
                }
            })

            //现金贷
            .state('tab.user-dai', {
                url: '/user-dai',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/dai.html',
                        controller: 'UserDaiCtrl'
                    }
                }
            })

        /**
         * 首页导航
         */
            .state('tab.plane', {
                url: '/plane',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-plane.html',
                        controller:'PlaneCtrl'
                    }
                }
            })

            .state('tab.hotel', {
                url: '/hotel',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-hotel.html',
                        controller: 'HotelCtrl'
                    }
                }
            })

            .state('tab.travel', {
                url: '/travel',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-travel.html',
                        controller: 'TravelCtrl'
                    }
                }
            })

            .state('tab.login', {
                url: '/login',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

        /**
         * 酒店
         */
            .state('tab.hotel-choose', {
                url: '/hotel-choose',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/hotel/choose.html',
                        controller: 'HotelCtrl'
                    }
                }
            })

            .state('tab.hotel-content', {
                url: '/hotel-content',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/hotel/content.html',
                        controller: 'HotelCtrl'
                    }
                }
            })

            .state('tab.hotel-facility', {
                url: '/hotel-facility',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/hotel/facility.html',
                        controller: 'HotelCtrl'
                    }
                }
            })

            .state('tab.hotel-img', {
                url: '/hotel-img',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/hotel/img.html',
                        controller: 'HotelCtrl'
                    }
                }
            })


            .state('tab.hotel-list', {
                url: '/hotel-list',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/hotel/list.html',
                        controller: 'HotelCtrl'
                    }
                }
            })


            .state('tab.hotel-order1', {
                url: '/hotel-order1',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/hotel/order1.html',
                        controller: 'HotelCtrl'
                    }
                }
            })

            .state('tab.hotel-order2', {
                url: '/hotel-order2',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/hotel/order2.html',
                        controller: 'HotelCtrl'
                    }
                }
            })

            .state('tab.hotel-select', {
                url: '/hotel-select',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/hotel/select.html',
                        controller: 'HotelCtrl'
                    }
                }
            })


        /**
         * 机票
         */

            .state('tab.plane-choose', {
                url: '/plane-choose',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/plane/choose.html',
                        controller:'PlaneCtrl'
                    }
                }
            })

            .state('tab.plane-detal', {
                url: '/plane-detal',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/plane/detal.html',
                        controller:'PlaneCtrl'

                    }
                }
            })

            .state('tab.plane-flightSel', {
                url: '/plane-flightSel',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/plane/flightSel.html',
                        controller:'PlaneCtrl'
                    }
                }
            })
            .state('tab.plane-list', {
                url: '/plane-list',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/plane/list.html',
                        controller:'PlaneCtrl'
                    }
                }
            })
            .state('tab.plane-order1', {
                url: '/plane-order1',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/plane/order1.html',
                        controller:'PlaneCtrl'
                    }
                }
            })
            .state('tab.plane-order2', {
                url: '/plane-order2',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/plane/order2.html',
                        controller:'PlaneCtrl'
                    }
                }
            })
            .state('tab.plane-seatSel', {
                url: '/plane-detal',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/plane/seatSel.html',
                        controller:'PlaneCtrl'
                    }
                }
            })

        /**
         * 旅游
         */
            .state('tab.travel-calendar', {
                url: '/travel-calendar',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/travel/calendar.html'
                    }
                }
            })

            .state('tab.travel-choose', {
                url: '/travel-choose',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/travel/choose.html'
                    }
                }
            })

            .state('tab.travel-content', {
                url: '/travel-content',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/travel/content.html'
                    }
                }
            })

            .state('tab.travel-order1', {
                url: '/travel-order1',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/travel/order1.html',
                        controller:'TravelCtrl'
                    }
                }
            })

            .state('tab.travel-order2', {
                url: '/travel-order2',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/travel/order2.html',
                        controller:'TravelCtrl'
                    }
                }
            })

        /**
         * 首页
         */
            .state('tab.dash-choose', {
                url: '/dash-choose',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/index/choose.html',
                        controller:'DashCtrl'
                    }
                }
            })

            .state('tab.search', {
                url: '/dash-search',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/index/search.html',
                        controller:'DashCtrl'
                    }
                }
            })

            .state('tab.search-content', {
                url: '/search-content',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/index/searchContent.html',
                        controller:'DashCtrl'
                    }
                }
            })
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/dash');

    });
