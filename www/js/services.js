angular.module('starter.services', [])
/**
 * 公用
 */
    .factory('Common', ['$rootScope', '$http', '$sce', '$location', function ($rootScope, $http, $sce, $location) {
        var com = {};

        //    时间选择器
        com.dateSelector = function ($cordovaDatePicker, type) {
            var t = type ? type : 'date';
            var options = {
                date: new Date(),
                mode: t, // or 'time'
                minDate: new Date() - 10000,
                allowOldDates: true,
                allowFutureDates: false,
                doneButtonLabel: 'DONE',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: 'CANCEL',
                cancelButtonColor: '#000000'
            };
            //时间选择
            $rootScope.selDate = function (name) {
                $cordovaDatePicker.show({
                    date: new Date(),
                    mode: 'date'
                }).then(function (date) {
                    var time = new Date(date).format('yyyy-MM-dd');
                    var str = name.split('.');
                    if (str.length == 2) {
                        $rootScope[str[0]][str[1]] = time;
                    }
                    if (str.length == 1) {
                        $rootScope[str[0]] = time;
                    }
                    if (str.length == 3) {
                        $rootScope[str[0]][str[1]][str[2]] = time
                    }
                });
            }
        }

        //获取分期月付
        com.getMonthPay = function (param, name) {
            $http.post(lyf.go('AppServer/Index/getMonthPay'), {
                'month': param[0],
                'totalprice': param[1]
            }).then(function (d) {
                if (!name) {
                    $rootScope.payPrice = d.data.pay;
                    $rootScope.payMonth = param[0];
                } else {
                    var str = name.split('.');
                    if (str.length == 1) $rootScope[name] = d.data.pay;
                    if (str.length == 2) $rootScope[str[0]][str[1]] = d.data.pay;
                    if (str.length == 3) $rootScope[str[0]][str[1]][str[2]] = d.data.pay;
                }
            })
        }

        //图片选择器
        com.imgSelector = function ($cordovaImagePicker) {
            var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 80
            };

            $rootScope.selPhotos = function (name) {
                $cordovaImagePicker.getPictures(options)
                    .then(function (results) {
                        $rootScope.imgSrc[name] = results[0];
                    }, function (error) {
                        // error getting photos
                    });
            }

        }

        //文件上传
        com.fileUpload = function ($cordovaFileTransfer, server, typeName) {
            $rootScope.upload = function () {
                var filePath = $rootScope['img'][typeName];
                var options = {};
                $cordovaFileTransfer.upload(server, filePath, options)
                    .then(function (d) {
                        // Success!
                        if (d.status) {
                            alert('ok');
                        }
                    }, function (err) {
                        // Error
                    }, function (progress) {
                        // constant progress updates
                    });
            }

        }

        //解决ng不允许iframe跨域
        com.getSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        //搜索城市
        com.searchCity = function (city, fn, $ionicPopup) {
            var list = $rootScope.hotCity.lists;
            var more = $rootScope.hotCity.moreCity;
            var allCity = this.getCache('moreCity', true).moreCity;

            var isOk = false;
            for (var i in list) {
                if (city == list[i].cityname) {
                    isOk = true;
                }
            }
            for (var i in allCity) {
                if (city == allCity[i].cityname) {
                    isOk = true;
                }
            }

            if (!isOk) {
                if (lyf.inArray(city, more)) {
                    fn(city);
                } else {
                    $ionicPopup.alert({title: '', subTitle: '暂不支持该城市', okText: '确认'});
                }
            } else {
                fn(city);
            }
        }

        //重新获取验证码
        com.rGetSMScode = function ($interval, fn, $ionicPopup, type) {
            if ($rootScope.time != '获取验证码') {
                $ionicPopup.alert({title: '', subTitle: '请不要重复获取！', okText: '确认'});
                return;
            } else {
                $rootScope.time = 60;
            }
            var p = $interval(function () {
                $rootScope.time -= 1;
                if ($rootScope.time == 0) {
                    $interval.cancel(p);
                    $rootScope.time = '获取验证码';
                }
            }, 1000, 60);
            if (type == 'safe') {
                fn(false);
            } else {
                fn($rootScope.tempPhone);
            }
        }

        //读常用城市
        com.readUsedCity = function () {
            var json = [
                {
                    name: '上海',
                    ctr: 0
                },
                {
                    name: '北京',
                    ctr: 0
                }
            ];
            if (localStorage.getItem('usedCity') == undefined) {
                localStorage.setItem('usedCity', JSON.stringify(json));
            }

            return JSON.parse(localStorage.getItem('usedCity'));
        }

        //写常用城市
        com.writeUsedCity = function (v) {
            localStorage.setItem('usedCity', JSON.stringify(v));
        }

        //更新常用城市
        com.updateUsedCity = function (city) {
            var data = com.readUsedCity();
            var index = lyf.inObject(city, data);

            if (index) {
                data[index].ctr++;
            } else {
                data.push({name: city, ctr: 0});
            }
            data.sort(function (a, b) {
                return -(parseInt(a.ctr - b.ctr));
            })
            this.writeUsedCity(data);
        }

        //首页Bar隐藏
        com.barShow = function () {
            var url = $location.url();
            if (url == '/tab/dash') {
                $rootScope.showBar = false;
            } else {
                $rootScope.showBar = true;
            }
        }

        //清除本地缓存
        com.clearCache = function () {
            localStorage.clear();
        }

        //设置本地缓存
        com.setCache = function (name, val, isJson) {
            var data = isJson ? JSON.stringify(val) : val;
            localStorage.setItem(name, data);
            return true;
        }

        //读取本地缓存
        com.getCache = function (name, isJson) {
            var data = isJson ? JSON.parse(localStorage.getItem(name)) : localStorage.getItem(name);
            return data;
        }

        //初始化城市选择列表
        com.initPyCityList = function () {
            var d = this.getCache('moreCity', true);
            var list = d.moreCity;
            var arr = [];

            for (var i in list) {
                arr.push({py: lyf.getHeaderPy(list[i].cityename), city: list[i].cityname});
            }

            this.setCache('pyCityList', arr, true);
        }

        //拼音搜索城市
        com.pySearchCity = function (key) {
            $rootScope.curPy = key;
            $rootScope.pyCityList = lyf.getKeyInObjList(key, this.getCache('pyCityList', true));
        }
        return com;
    }])
/**
 * 用户
 */
    .factory('User', ['$rootScope', '$http', '$location', '$timeout', 'Common', function ($rootScope, $http, $location, $timeout, Common) {
        var user = {};
        var server = new ClientServer($http, $rootScope);
        user.checkLogin = function (name, com) {
            if ($rootScope.isLogin == undefined) {
                server.createRequest('user', 'checkLogin', '').then(function (d) {
                    if (d.type == 'success' && d.data == 'ok') {
                        //    ok
                        $rootScope.isLogin = true;
                    } else {
                        //    error
                        $rootScope.isLogin = false;
                    }
                })
                $timeout(function () {
                    $rootScope.isLogin ? $location.url('/tab/' + name) : $location.url('/tab/login');
                }, 1500)
            } else if ($rootScope.isLogin == false) {
                $location.url('/tab/login');
            } else {
                $location.url('/tab/' + name)
            }
            Common.barShow();

        }

        user.doLogin = function (name, password, checkCode, goTplName, $ionicPopup) {
            server.createRequest('user', 'dologin', '', {
                username: name,
                password: password,
                verify: checkCode
            }).then(function (d) {
                if (d.status) {
                    //    ok
                    $rootScope.isLogin = true;
                    user.getData();
                    $location.url('/tab/' + goTplName);
                } else {
                    //    error
                    $rootScope.isLogin = false;
                    $ionicPopup.alert({title: '登陆', subTitle: d.error, okText: '确认'});
                }
            })
        }

        user.logOut = function () {
            $rootScope.isLogin = false;
            server.createRequest('user', 'logout', '').then(function (d) {
                if (d.status) {
                    $location.url('tab/dash');
                }
            })
        }

        /**
         * 现金贷
         */
        user.dai = function () {
            var userDai = {};
            /**
             * 获取当前借款信息
             */
            userDai.getInfo = function ($interval) {
                server.createRequest('user', 'getLoanData', '').then(function (d) {
                    $rootScope.curApplyNum = d;
                    //    借款滚动
                    var list = $rootScope.curApplyNum.new_rows, s = false, temp = {};
                    var p = $interval(function () {
                        if ($location.url() != '/tab/dai') {
                            $interval.cancel(p);
                        }
                        if (!s) {
                            for (var i in list) {
                                temp = list[i][0];
                                list[i][0] = list[i][1];
                                list[i][1] = temp;
                            }
                        } else {
                            for (var i in list) {
                                temp = list[i][1];
                                list[i][1] = list[i][0];
                                list[i][0] = temp;
                            }
                        }

                    }, 3000)
                })
            }
            //获取分期月支付
            userDai.getPayMonth = function (param, Common) {
                Common.getMonthPay(param);
            }

            //提交现金贷申请
            userDai.commitLoan = function (param, $ionicPopup) {
                if (!$rootScope.userInfo.pay_pass) {
                    $ionicPopup.alert({title: '', subTitle: '支付密码未设置！', okText: '确认'});
                    $location.url('/tab/user-safe-password-pay');
                    return;
                }
                server.createRequest('user', 'commitLoan', '', param).then(function (d) {
                    var str = '';
                    if (d.success) {
                        $ionicPopup.alert({title: '', subTitle: '您的借款将在24小时内到帐！', okText: '确认'});
                        $location.goBack();
                    } else {
                        $ionicPopup.alert({title: '', subTitle: d.data, okText: '确认'});

                    }
                })
            }
            return userDai;
        }


        /**
         * 修改登陆密码
         */
        user.changeLoginPass = function ($ionicPopup) {
            server.createRequest('user', 'changeLoginPass', '', $rootScope.safe).then(function (d) {
                if (d.status) {
                    $ionicPopup.alert({title: '', subTitle: '登录密码修改，下次记得使用新密码登陆！', okText: '确认'});
                    $location.url('/tab/user');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                }
            })
        }

        //修改支付密码

        user.changePayPass = function ($ionicPopup) {
            server.createRequest('user', 'changePayPass', '', $rootScope.safe).then(function (d) {
                if (d.status) {
                    $ionicPopup.alert({title: '', subTitle: '支付密码修改，下次记得使用新密码支付！', okText: '确认'});
                    $location.url('/tab/user');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                }
            })
        }

        /**
         * 修改邮箱
         */
        user.changeEmail = function ($ionicPopup) {
            server.createRequest('user', 'changeEmail?user_login=' + $rootScope.safe.user_login, '').then(function (d) {
                if (d.status) {
                    $ionicPopup.alert({title: '', subTitle: '邮箱修改！', okText: '确认'});
                    $location.url('/tab/user');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.info, okText: '确认'});
                }
            });
        }

        user.changePhone = function ($ionicPopup) {
            var sms_code = $rootScope.safe.sms_code;
            var phone = $rootScope.safe.phone;

            server.createRequest('user', 'changePhone?phone=' + phone + '&sms_code=' + sms_code).then(function (d) {
                if (d.status) {
                    $ionicPopup.alert({title: '', subTitle: '手机修改！', okText: '确认'});
                    $location.url('/tab/user');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                }
            })
        }

        //提现
        user.returnMoneyToBank = function ($ionicPopup, conNum) {
            server.createRequest('user', 'returnMoneyToBank', '', {amount: conNum}).then(function (d) {
                if (d.success) {
                    $rootScope.userWallet.customer.cash -= conNum;
                    $ionicPopup.alert({title: '', subTitle: '您的提现已经申请。！', okText: '确认'});
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.data, okText: '确认'});
                }
            })
        }

        //充值
        user.recharge = function ($ionicPopup, conNum) {
            server.createRequest('user', 'mywallet_charge', '', {amount: conNum}).then(function (d) {
                if (d.success) {
                    angular.element(document.querySelector('#pay_result')).append(script);
                    //由于框架视图的限制，此处需要手动执行JS脚本
                    eval(angular.element(document.querySelector('#pay_result')).find('script').html());
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.data, okText: '确认'});
                }
            })
        }


        /**
         * 获取验证码
         */

        user.getCheckCode = function ($ionicPopup, moblie, type) {
            var phone = {phone_number: moblie, type: type};
            server.createRequest('user', 'getSMSCode?r=' + Math.random(), '', phone).then(function (d) {
                if (d.status) {
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.info, okText: '确认'});
                }
            })
        }

        /**
         * 获取相关数据
         */
        user.getData = function () {
            server.createRequest('user', 'getMyWallet', 'userWallet');
            server.createRequest('user', 'getBill', 'userBill');
            server.createRequest('user', 'getMyOrder', 'userOrder');
            server.createRequest('user', 'getCollect', 'userCollect');
            server.createRequest('user', 'getUserInfo', 'userInfo');

        }
        //可获取userInfo
        user.getInfo = function () {
            return (server.createRequest('user', 'getUserInfo', '').then(function (d) {
                return [d.phone_number, d.real_name];
            }));
        }

        // 用户注册


        user.getRegSMScode = function (phone, $ionicPopup) {
            server.createRequest('reg', 'getSMScode?phone=' + phone + '&r=' + Math.random(), '').then(function (d) {
                if (d.status) {
                    $location.url('/tab/user-reg2');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.info, okText: '确认'});
                }
            })
        }

        user.doReg = function ($ionicPopup) {
            server.createRequest('reg', 'doReg', '', $rootScope.reg).then(function (d) {
                if (d.status) {
                    $location.url('/tab/user-reg4');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                }
            })
        }

        //找回登录密码

        user.findLoginPass = function ($ionicPopup) {
            server.createRequest('user', 'findLoginPass', '', $rootScope.find).then(function (d) {
                if (d.status) {
                    $location.url('/tab/user-find-findPassSuccess');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                }
            })
        }

        //额度激活
        user.doactive_step1 = function ($scope, $ionicPopup) {
            server.createRequest('user', 'doactive_step1', '', $scope.verify).then(function (d) {
                if (d.status) {
                    $ionicPopup.alert({title: '', subTitle: '个人信息保存！', okText: '确认'});
                    $location.url('/tab/user-limitActive2');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                }
            })
            //    test
            //$location.url('/tab/user-limitActive2');

        }

        user.doactive_step2 = function ($scope, $ionicPopup) {
            server.createRequest('user', 'doactive_step2', '', $scope.verify).then(function (d) {
                if (d.status) {
                    $ionicPopup.alert({title: '', subTitle: '身份信息保存！', okText: '确认'});
                    $location.url('/tab/user-limitActive3');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                }
            })

            //    test
            //$location.url('/tab/user-limitActive3');
        }

        user.doactive_step3 = function ($scope, $ionicPopup) {
            server.createRequest('user', 'doactive_step3', '', $scope.verify).then(function (d) {
                if (d.status) {
                    $ionicPopup.alert({title: '', subTitle: '证件信息保存！', okText: '确认'});
                    $location.url('/tab/user-limitActive2');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                }
            })
        }

        user.getSchoolList = function (provinceName, city) {
            server.createRequest('user', 'get_school_list?provinceName=' + provinceName + '&city=' + city, '').then(function (d) {
                $rootScope.schoolList = d;
                $rootScope.showSchool = true;
            })
        }

        user.doactive = function ($ionicPopup) {
            server.createRequest('user', 'doactive', '').then(function (d) {
                if (d.status) {
                    $ionicPopup.alert({title: '', subTitle: '激活邮件发送，请重新登录！', okText: '确认'});
                    user.logOut();
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                }
            })
        }
        return user;
    }])
/**
 * 机票
 */
    .factory('Plane', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
        var server = new ClientServer($http, $rootScope);
        var plane = {};
        plane.getData = function () {

        }
        plane.getFlight = function ($ionicLoading) {
            $ionicLoading.show(
                {template: '加载中...'}
            );
            var time = new Date().getTime();
            server.createRequest('flight', 'getSearch/c/' + $rootScope.plane.dCity + '-' + $rootScope.plane.aCity + '-' + parseInt(time / 1000), '').then(function (d) {
                var data = {
                    date: $rootScope.plane.dDate,
                    dCity: d.aCityCode,
                    aCity: d.dCityCode,
                    //服务器端命名，次处交换位置
                    dCityName: $rootScope.plane.dCity,
                    aCityName: $rootScope.plane.aCity,
                    condition: {
                        filter_Classes: [$rootScope.plane.seatCode]
                    },
                    column: $rootScope.plane.sortKey,
                    sort: $rootScope.plane.sort
                };
                if ($rootScope.plane.airCode) data.condition['filter_Airline'] = [$rootScope.plane.airCode];
                if ($rootScope.plane.timeD) data.condition['filter_DTime'] = [$rootScope.plane.timeD];
                $rootScope.plane.aCode = d.aCityCode;
                $rootScope.plane.dCode = d.dCityCode;
                //server.createRequest('flight' , 'getLowPrice' , 'lowList' , param);
                return (  server.createRequest('flight', 'flightSearch', '', data) );


            }).then(function (d) {
                $rootScope.plane.flightList = d;
                //server.createRequest('flight', 'getLowPriceList', '', {
                //    'aCity': $rootScope.plane.aCode,
                //    'dCity': $rootScope.plane.dCode,
                //    'date': $rootScope.plane.dDate
                //}).then(function (d) {
                //    for (var i = 0; i < d.length; i++) {
                //        d[i].departdate = new Date(d[i].departdate).format('yyyy-MM-dd');
                //        d[i].day = lyf.getDay(new Date(d[i].departdate).getDay());
                //    }
                //    $rootScope.lowPriceList = d;
                //});

                //查询相关航空公司
                server.createRequest('flight', 'getAirlineList', '', {
                    'aCity': $rootScope.plane.aCode,
                    'dCity': $rootScope.plane.dCode,
                    'date': $rootScope.plane.dDate
                }).then(function (d) {
                    $rootScope.plane.airList = d;
                    //加载完成
                    $ionicLoading.hide();
                });
            })
        }

        plane.getOrderInfo = function (seatCode, User, $ionicLoading) {
            $ionicLoading.show(
                {template: '加载中...'}
            );
            server.createRequest('flight', 'getOrderInfo/t/' + seatCode, '').then(function (d) {
                $rootScope.plane.orderInfo = d;
                $rootScope.plane.curDay = lyf.getDay(parseInt(d.flight.day));
                User.checkLogin('plane-order1');
                $ionicLoading.hide();
            });
        }

        //获取更多仑位
        plane.searchSeat = function (index) {
            //User.checkLogin('plane-seatSel');
            $rootScope.plane.moreSeat = $rootScope.plane.flightList.data[index];
        }

        //选择城市
        plane.selCity = function (city) {
            $rootScope.place.city = city;
            if ($rootScope.plane.curSel == 'dCity') {
                $rootScope.plane.dCity = city;
            } else {
                $rootScope.plane.aCity = city;
            }
        }
        return plane;
    }])

/**
 * 旅游
 */
    .factory('Travel', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
        var travel = {};
        var server = new ClientServer($http, $rootScope);

        travel.getData = function ($ionicLoading) {
            $ionicLoading.show({
                template: '加载中...'
            });
            server.createRequest('user', 'getUserInfo', '').then(function (d) {
                $rootScope.userInfo = d;
                $rootScope.user = {
                    name: d.real_name,
                    phone: d.phone_number,
                    email: d.user_login,
                    idcard: d.id_number,
                    enname: ''
                }; //联系人信息
                typeof $rootScope.updateCustomers == 'function' && $rootScope.updateCustomers();
                server.createRequest('travel', 'getTravel', '').then(function (d) {
                    $rootScope.zhoubian = d;
                    $ionicLoading.hide();
                })
            });

            //server.createRequest('travel' , 'getTravel/class/3' , 'zhoubian');
        }

        travel.getDetal = function (id, $ionicSlideBoxDelegate) {
            server.createRequest('travel', 'getTravelDetal/id/' + id, '').then(function (d) {
                $rootScope.travelDetal = d;
                $ionicSlideBoxDelegate.update();
            })
        }

        /**
         * 搜索选择城市的旅游
         */
        travel.selCity = function ($scope, city) {
            $rootScope.plane.dCity = city;
            $rootScope.place.city = city;
            server.createRequest('travel', 'getTravel/placestart/' + city, 'zhoubian');
        }

        ////获取列表下一页
        travel.getNextPage = function (page, $scope, $ionicScrollDelegate) {
            $ionicScrollDelegate.scrollTop(true);
            var strPage = page ? '/p/' + page : '';
            server.createRequest('travel', 'getTravel/' + travel._getCode() + strPage, '').then(function (d) {
                $rootScope.zhoubian = d;
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        ////获取列表上一页
        travel.getLastPage = function (page, $scope, $ionicScrollDelegate) {
            var pos = $ionicScrollDelegate.getScrollPosition();
            $ionicScrollDelegate.scrollTo(pos.left, pos.top + 200);
            var strPage = page ? '/p/' + page : '';
            if (page >= 1) {
                server.createRequest('travel', 'getTravel/' + travel._getCode() + strPage, '').then(function (d) {
                    $rootScope.zhoubian = d;
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }
        }

        //获取当前菜单代码
        travel._getCode = function () {
            var code = '';
            if ($rootScope.curMenu == 'zhoubian') code = 'class/3';
            if ($rootScope.curMenu == 'jingwai') code = 'class/2';
            if ($rootScope.curMenu == 'jingnei') code = 'class/1';
            return code;
        }


        //搜索当前栏目
        travel.searchCurMenu = function () {
            server.createRequest('travel', 'getTravel/' + travel._getCode(), 'zhoubian');
        }
        return travel;
    }])

/**
 * 酒店
 */
    .factory('Hotel', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location, $ionicScrollDelegate) {
        var hotel = {};
        var server = new ClientServer($http, $rootScope);
        hotel.getData = function () {
            //server.createRequest('index', 'getHotCity', 'hotCity');
            server.createRequest('index', 'getStarAndPrice', 'starAndPrice');
        }

        hotel.setCurCity = function (city) {
            server.createRequest('index', 'setCurPlace?curCity=' + city, '').then(function (d) {
                if (d.status) {
                    $rootScope.place.city = city;
                } else {
                    $ionicPopup.alert({title: '', subTitle: '网络连接异常！', okText: '确认'});
                }
            })
        }

        //获得行政区和商圈
        hotel.getAreasAndZones = function ($scope) {
            server.createRequest('index', 'getAreasAndZones?mudi=' + $rootScope.place.city, '').then(function (d) {
                $rootScope.data = d;
                $location.url('/tab/hotel-select');
            })

        }

        //酒店搜索
        hotel.search = function ($scope, $ionicLoading) {
            $ionicLoading.show(
                {template: '加载中...'}
            );
            server.createRequest('hotel', 'searchHotel', '', $rootScope.hotel.sel).then(function (d) {
                $rootScope.hotelList = d;
                //加載完成
                $ionicLoading.hide();
            });
            $location.url('/tab/hotel-list');
        }
        //获取详情
        hotel.getDetal = function (hotelId, $ionicSlideBoxDelegate, $ionicLoading) {
            $ionicLoading.show(
                {template: '加载中...'}
            );
            server.createRequest('hotel', 'getDetal/hotelid/' + hotelId, '').then(function (d) {
                $rootScope.hotelDetal = d;
                $ionicSlideBoxDelegate.update();
                $ionicLoading.hide();
                $location.url('tab/hotel-content');
            })
        }

        //预定显示

        hotel.hotelBook = function (id) {
            server.createRequest('hotel', 'getOderInfo/roomid/' + id + '/checkindate/' + $rootScope.dDate + '/checkoutdate/' + $rootScope.aDate, '').then(function (d) {
                if (d.status == 0) {
                    $location.url('/tab/login');
                } else {
                    $rootScope.hotelOrderInfo = d;
                    $location.url('tab/hotel-order1');
                }
            });
        }


        //获取列表下一页
        hotel.getNextPage = function (page, $scope, $ionicScrollDelegate) {
            var sel = $rootScope.hotel.sel;
            sel.mudi = $rootScope.place.city;
            sel.page = page;
            $ionicScrollDelegate.scrollTop(true);
            server.createRequest('hotel', 'searchHotel', '', sel).then(function (d) {
                $rootScope.hotelList = d;
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        ////获取列表上一页
        hotel.getLastPage = function (page, $scope, $ionicScrollDelegate) {
            var sel = $rootScope.hotel.sel;
            sel.mudi = $rootScope.place.city;
            sel.page = page;
            var pos = $ionicScrollDelegate.getScrollPosition();
            $ionicScrollDelegate.scrollTo(pos.left, pos.top + 200);
            if (page >= 1) {
                server.createRequest('hotel', 'searchHotel', '', sel).then(function (d) {
                    $rootScope.hotelList = d;
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }
        }
        /**
         * 选择
         * @param selName
         * @param data
         * @param index
         */
        hotel.selectOn = function (selName, data, index) {
            switch (selName) {
                case 'Areas':
                    //行政区域
                    $rootScope.hotel.sel.AreaId = data.code;
                    $rootScope.curSelectIndex.Areas = index;
                    $rootScope.curAreasName = data.name;
                    break;
                case 'Zones':
                    //    商圈
                    $rootScope.hotel.sel.ZoneId = data.code;
                    $rootScope.curSelectIndex.Zones = index;
                    $rootScope.curZonesName = data.name;
                    break;
                case 'Showbands':
                    //酒店品牌
                    $rootScope.hotel.sel.HotelBand = data.code;
                    $rootScope.curSelectIndex.bands = index;
                    $rootScope.curbandsName = data.name;
                    break;
                default :
                    break;
            }

        }
        return hotel;
    }])

/**
 * 首页
 */
    .factory('Index', ['$rootScope', '$http', '$location', 'Common', 'Hotel' , 'Plane' , function ($rootScope, $http, $location, Common , Hotel , Plane) {
        var index = {};
        var server = new ClientServer($http, $rootScope);
        index.getData = function ($ionicSlideBoxDelegate, $ionicLoading) {
            $ionicLoading.show({
                template: '加载中...'
            });
            if ($rootScope.travelList == undefined) {
                server.createRequest('index', 'getCurPlace', '').then(function (d) {
                    $rootScope.place = d;
                    server.createRequest('index', 'getHotCity', '').then(function (d) {
                        $rootScope.hotCity = d;
                        server.createRequest('index', 'getTravel?city=' + $rootScope.place.city, '').then(function (d) {
                            $rootScope.travelList = d;
                            var jingnei = [], jingwai = [], zhoubian = [];
                            for (var i = 0; i < 5; i++) {
                                jingnei.push(d.jingnei[i]);
                                jingwai.push(d.jingwai[i]);
                                zhoubian.push(d.zhoubian[i]);
                            }
                            $rootScope.travelList.zhoubian = zhoubian;
                            $rootScope.travelList.jingnei = jingnei;
                            $rootScope.travelList.jingwai = jingwai;
                            server.createRequest('index', 'getHotHotel', '').then(function (d) {
                                server.createRequest('index', 'getHotHotel', '').then(function (d) {
                                    $rootScope.hotHotel = d;
                                    $ionicSlideBoxDelegate.update();
                                    $ionicLoading.hide();
                                })
                            })
                        })
                    })
                })
            }
            if (localStorage.moreCity == undefined) {
                server.createRequest('index', 'getMoreCity', '').then(function (d) {
                    Common.setCache('moreCity', d, true);
                    Common.initPyCityList();
                })
            }
            Common.pySearchCity('A');

        }

        /**
         * 搜索
         * @param keyword
         * @param $scope
         * @param type
         */
        index.search = function (keyword , type) {
            server.createRequest('index', 'search?keyword=' + keyword+'&type='+type, '').then(function (d) {
                $rootScope.searchList = d;
                $rootScope.keyword = keyword;
                $rootScope.searchType = type;
                $location.url('/tab/dash-search');
            })
        }

        /**
         * 获取搜索详情
         * @param id
         * @param type
         */
        index.getSearchDetal = function (id , type ,  $ionicSlideBoxDelegate, $ionicLoading) {
            var searchTravel = function(){
                server.createRequest('index', 'getSearchDetal?id=' + id, '').then(function (d) {
                    $rootScope.searchDetal = d;
                    $rootScope.travelDetal = d;
                });
            }
            switch (type){
                case 'travel':
                    searchTravel();
                    break;
                case 'plane':
                    //机票
                    Plane.getFlight($ionicLoading);
                    break;
                case 'hotel':
                    //酒店
                    Hotel.getDetal(id ,  $ionicSlideBoxDelegate, $ionicLoading);
                    break;
                default : searchTravel(); break;
            }
        }

        ////获取列表下一页
        index.getNextPage = function (page, $ionicScrollDelegate) {
            var strPage = page ? '/p/' + page : '';
            $ionicScrollDelegate.scrollTop(true);
            server.createRequest('index', 'search/keyword/' + $rootScope.keyword + '/page' + strPage +'/type/'+$rootScope.searchType, '').then(function (d) {
                $rootScope.searchList = d;
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        ////获取列表上一页
        index.getLastPage = function (page, $ionicScrollDelegate) {
            var pos = $ionicScrollDelegate.getScrollPosition();
            $ionicScrollDelegate.scrollTo(pos.left, pos.top + 200);
            var strPage = page ? '/p/' + page : '';
            if (page >= 1) {
                server.createRequest('index', 'search/keyword/' + $rootScope.keyword + '/page' + strPage +'/type/'+$rootScope.searchType, '').then(function (d) {
                    $rootScope.searchList = d;
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                });
            }
        }

        //选择当前城市
        index.setCurCity = function (city, Hotel) {
            Hotel.setCurCity(city);
        }

        /**
         * 获取Banner
         */
        index.getBanner = function ($ionicSlideBoxDelegate) {
            if ($rootScope.banner == undefined) {
                server.createRequest('index', 'getBanner', '').then(function (d) {
                    $rootScope.banner = d;
                    $ionicSlideBoxDelegate.update();
                });
            }
        }
        return index;
    }])

/**
 * 订单
 */
    .factory('Order', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
        var server = new ClientServer($http, $rootScope);
        var order = {};

        //创建酒店订单
        order.createHotelOrder = function ($ionicPopup) {
            server.createRequest('order', 'createHotelOrder', '', $rootScope.hotel.order).then(function (d) {
                if (d.status) {
                    $rootScope.hotel.orderInfo = d;
                    $ionicPopup.alert({title: '', subTitle: '创建订单成功，请尽快支付！', okText: '确认'});
                    $location.url('/tab/user-order');
                } else {
                    //    error
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                    $location.url('/tab/dash');

                }
            })
        }

        //创建机票订单
        order.createPlaneOrder = function ($ionicPopup) {
            server.createRequest('order', 'createPlaneOrder?t=' + $rootScope.plane.orderInfo.flightId, '', $rootScope.plane.order).then(function (d) {
                if (d.status) {
                    $ionicPopup.alert({title: '', subTitle: '机票订单创建成功，请尽快支付', okText: '确认'});
                    $rootScope.plane.order.orderId = d.orderId.
                        $location.url('/tab/pay');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                    $location.url('/tab/dash');

                }
            })
        }

        //        取消酒店订单
        order.cancelHotelOrder = function () {

        }

        //    取消机票订单
        order.cancelPlaneOrder = function () {

        }

        //初始化支付数据
        order.beforePay = function (data) {
            if ($rootScope.pay.order == undefined) {
                $rootScope.pay.order = {
                    order_type: '', //1 旅游 2机票 3酒店 5现金贷
                    order_id: '',
                    credit_amount: '', //信用额度
                    wallet_amount: '', //钱包充值
                    pay_pass: '',//支付密码
                    coupon_id: '' //优惠券
                }
            } else {
                $rootScope.pay.order = data;
            }

        }

        //支付
        order.payNow = function ($ionicPopup) {
            server.createRequest('user', 'pay_now', '', $rootScope.pay.order).then(function (d) {
                if (d.status) {
                    $location.url('/tab/pay-sucess');
                } else {
                    $ionicPopup.alert({title: '', subTitle: d.error, okText: '确认'});
                }

            })
        }
        return order;
    }])