angular.module('starter.services', [])

/**
 * 用户
 */
    .factory('User', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
        var user = {};
        var server = new ClientServer($http, $rootScope);
        user.checkLogin = function (name) {
            server.createRequest('user', 'checkLogin', '').then(function (d) {
                if (d.type == 'success' && d.data == 'ok') {
                    //    ok
                    $location.url('/tab/' + name);
                } else {
                    //    error
                    $location.url('/tab/login');
                }
            })
        }

        user.doLogin = function (name, password, checkCode, goTplName, $ionicPopup) {
            server.createRequest('user', 'dologin', '', {
                username: name,
                password: password,
                verify: checkCode
            }).then(function (d) {
                if (d.status) {
                    //    ok
                    $location.url('/tab/' + goTplName);
                } else {
                    //    error
                    $ionicPopup.alert({title: '登陆失败', subTitle: d.error, okText: '确认'});
                }
            })
        }

        user.logOut = function () {
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
            userDai.getInfo = function () {
                server.createRequest('user', 'curApplyNum', 'curApplyNum');
            }
            //获取分期月支付
            userDai.getPayMonth = function (param) {
                $http.post(lyf.go('AppServer/Index/getMonthPay'), {
                    'month': param[0],
                    'totalprice': param[1]
                }).then(function (d) {
                    $rootScope.payPrice = d.data.pay;
                    $rootScope.payMonth = param[0];
                })
            }

            //提交现金贷申请
            userDai.commitLoan = function (param, $ionicPopup) {
                server.createRequest('user', 'commitLoan', '', param).then(function (d) {
                    var str = '';
                    if (d.success) {
                        $ionicPopup.alert({title: '成功', subTitle: '您的借款将在24小时内到帐！', okText: '确认'});
                        $location.goBack();
                    } else {
                        $ionicPopup.alert({title: '失败', subTitle: d.data, okText: '确认'});

                    }
                })
            }
            return userDai;
        }

        /**
         * 还款
         */
        user.refund = function () {
            return {
                //从服务器获取一个表单
                getForm: function (id) {
                    server.createRequest('user', 'getAlipayForm/id/' + id + '/count/1', '').then(function (d) {
                        $("#pay_result").html(d);
                    });
                },
                //申请提现
                commitBank: function (num) {
                    server.createRequest('user', 'returnMoneyToBank', '', {amount: num}).then(function (d) {
                        if (d.success) {
                            lyf.alert('成功', '提现成功！', 3000);
                        }
                    });
                },
                //    充值
                recharge: function (num) {
                    server.createRequest('user', 'mywallet_charge', '', {amount: num}).then(function (d) {
                        if (d.success) {
                            $("#pay_result").html(d.data);
                        }
                    });
                }
            }
        }

        /**
         * 用户认证
         */

        user.verify = function () {
            var userRz = {};
            var server = new ClientServer($http, $rootScope);


            /**
             * 认证第一步
             */
            userRz.rz1 = function ($scope) {
                var param = {};
                param.real_name = $scope.userRz.name;
                param.id_number = $scope.userRz.idcard;
                param.user_login = $scope.userInfo.user_login;
                param.alipay_account = $scope.userRz.alipayNo;
                param.weixin_account = $scope.userRz.weixin;
                param.contactors = {
                    0: {
                        relation: '父亲',
                        name: $scope.userRz.linkMan.name,
                        phone: $scope.userRz.linkMan.phone
                    }
                };
                $scope.rzInfo = param;
                server.createRequest('user', 'doactive_step1', '', param).then(function (d) {
                    if (d.status) {
                        $scope.changeTpl('limitActivate2.html');
                    } else {
                        lyf.alert('错误提醒', d.error, 3000);
                    }
                });
            }

            userRz.rz2 = function ($scope) {
                var param = $scope.rzInfo;
                param.school_id = '? number:0 ?';
                param.institude_name = $scope.userRz.schoolRool.academy;
                param.major = $scope.userRz.schoolRool.major;
                param.grade = $scope.userRz.schoolRool.classNo;
                param.dorm_address = $scope.userRz.schoolRool.dormDir;
                param.education_background = $scope.userRz.schoolRool.studentBack;
                param.school_year = $scope.userRz.schoolRool.year;
                param.student_number = $scope.userRz.schoolRool.studentNo;
                param.xuexin_uesername = $scope.userRz.schoolRool.xuexin.username;
                param.xuexin_password = $scope.userRz.schoolRool.xuexin.userpass;

                $scope.rzInfo = param;
                server.createRequest('user', 'doactive_step2', '', param).then(function (d) {
                    if (d.status) {
                        $scope.changeTpl('limitActivate3.html');
                    } else {
                        lyf.alert('操作失败', d.info, 3000);
                    }
                });
            };

            /**
             * 认证三，上传证件照
             * @param $scope
             */
            userRz.rz3 = function ($scope) {

            }
            return userRz;
        }

        /**
         * 修改密码
         */
        user.changePass = function ($scope, nmae, $ionicPopup) {
            server.createRequest('user', 'checkSMSCode?sms_code=' + $scope.checkCode, '').then(function (d) {

                if (d.type == 'success') {
                    switch ($scope.type) {
                        case 'changeLoginPass':
                            //修改登录密码
                            server.createRequest('user', 'changeLoginPass', '', {
                                oldpassword: $scope.curPass,
                                password: $scope.pass1,
                                repassword: $scope.pass2
                            }).then(function (d) {
                                if (d.status != 1) {
                                    $ionicPopup.alert({title: '失败', subTitle: d.error, okText: '确认'});
                                } else {
                                    $ionicPopup.alert({title: '成功', subTitle: '下次请使用新密码登陆！', okText: '确认'});
                                    server.createRequest('user', 'logout', '').then(function (d) {
                                        if (d.status) {
                                            //    ok
                                            $location.url('/tab/dash');
                                        }
                                    })
                                }
                            })
                            break;
                        case 'changePayPass':
                            //    修改支付密码
                            server.createRequest('user', 'changePayPass', '', {
                                oldpassword: $scope.curPass,
                                password: $scope.pass1,
                                repassword: $scope.pass2
                            }).then(function (d) {
                                if (d.status != 1) {
                                    $ionicPopup.alert({title: '失败', subTitle: d.error, okText: '确认'});
                                } else {
                                    $ionicPopup.alert({title: '成功', subTitle: '支付密码修改成功，请使用新密码支付！', okText: '确认'});
                                }
                            })
                            break;
                        default :
                            break;
                    }
                } else {
                    $ionicPopup.alert({title: '失败', subTitle: '验证码不正确！', okText: '确认'});
                }
            })

        }

        /**
         * 获取验证码
         */

        user.getCheckCode = function ($scope, $ionicPopup, moblie, type) {
            var phone = {phone_number: moblie, type: type};
            server.createRequest('user', 'getSMSCode', '', phone).then(function (d) {
                if (d.status) {
                    $scope.time = '已发送';
                } else {
                    $ionicPopup.alert({title: '失败', subTitle: d.info, okText: '确认'});
                }
            })
        }

        /**
         * 获取相关数据
         */
        user.getData = function ($rootScope) {
            server.createRequest('user', 'getMyWallet', 'userWallet');
            server.createRequest('user', 'getBill', 'userBill');
            server.createRequest('user', 'getMyOrder', 'userOrder');
            server.createRequest('user', 'getCollect', 'userCollect');
            server.createRequest('user', 'getUserInfo', '').then(function (d) {
                $rootScope.userInfo = d;
                if (lyf.isMoblie(d.phone_number)) {
                    $rootScope.moblie = d.phone_number;

                    //激活额度信息
                    $rootScope.userRz = {
                        name: '',
                        phone: d.phone_number,
                        idcard: '',
                        email: '',
                        alipayNo: '',
                        weixin: '',
                        linkMan: {
                            name: '',
                            phone: ''
                        },
                        //学籍信息
                        schoolRool: {
                            place: '',
                            name: '',
                            academy: '', //学院
                            major: '', //专业
                            classNo: '', //班级名或编号
                            dormDir: '', //宿舍完整地址
                            studentBack: '',//学历
                            year: '', // 入学年份
                            studentNo: '', //学号
                            //学信网
                            xuexin: {
                                username: '',
                                userpass: ''
                            }
                        }
                    }
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
        plane.getFlight = function ($scope) {
            var time = new Date().getTime();
            $scope.seatCode = $scope.seatCode ? $scope.seatCode : 'Y';
            server.createRequest('flight', 'getSearch/c/' + $scope.dCity + '-' + $scope.aCity + '-' + parseInt(time / 1000), '').then(function (d) {
                var data = {
                    date: $scope.today,
                    dCity: d.aCityCode,
                    aCity: d.dCityCode,
                    //服务器端命名错误，次处交换位置
                    dCityName: $scope.dCity,
                    aCityName: $scope.aCity,
                    condition: {
                        filter_Classes: [$scope.seatCode]
                    },
                    column: $scope.sortKey,
                    sort: $scope.sort
                };
                if ($scope.airCode) data.condition['filter_Airline'] = [$scope.airCode];
                if ($scope.timeD) data.condition['filter_DTime'] = [$scope.timeD];
                $scope.aCode = d.aCityCode;
                $scope.dCode = d.dCityCode;
                //server.createRequest('flight' , 'getLowPrice' , 'lowList' , param);
                return (  server.createRequest('flight', 'flightSearch', '', data) );


            }).then(function (d) {
                $scope.flightList = d;
                server.createRequest('flight', 'getLowPriceList', '', {
                    'aCity': $scope.aCode,
                    'dCity': $scope.dCode,
                    'date': $scope.today
                }).then(function (d) {
                    for (var i = 0; i < d.length; i++) {
                        d[i].departdate = new Date(d[i].departdate).format('yyyy-MM-dd');
                        d[i].day = run.getDay(new Date(d[i].departdate).getDay());
                    }
                    $scope.lowPriceList = d;
                });

                //查询相关航空公司
                server.createRequest('flight', 'getAirlineList', 'airList', {
                    'aCity': $scope.aCode,
                    'dCity': $scope.dCode,
                    'date': $scope.today
                });
            })
        }

        plane.getOrderInfo = function (seatCode, $scope) {
            server.createRequest('flight', 'getOrderInfo/t/' + seatCode, '').then(function (d) {
                $scope.orderInfo = d;
                $scope.curDay = run.getDay(parseInt(d.flight.day));
                console.log($scope.curDay);
            });
        }
        //创建订单
        plane.createOrder = function ($scope) {
            //
        }

        //获取更多仑位
        plane.searchSeat = function (index, $scope, User) {
            User.checkLogin('plane-seatSel');
            $scope.moreSeat = $scope.flightList.data[index];

        }
        return plane;
    }])

/**
 * 旅游
 */
    .factory('Travel', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
        var travel = {};
        var server = new ClientServer($http, $rootScope);

        travel.getData = function () {
            server.createRequest('user', 'getUserInfo', '').then(function (d) {
                $rootScope.userInfo = d;
                $rootScope.user = {
                    name: d.real_name,
                    phone: d.phone_number,
                    email: d.user_login,
                    idcard: d.id_number,
                    enname: ''
                }; //联系人信息
            });
            server.createRequest('index', 'getHotCity', 'hotCity');
            server.createRequest('travel', 'getTravel', 'zhoubian');
            //server.createRequest('travel' , 'getTravel/class/3' , 'zhoubian');
            server.createRequest('travel', 'getTravel/class/1', 'jingnei');
            server.createRequest('travel', 'getTravel/class/2', 'jingwai');
        }

        travel.getDetal = function (id) {
            server.createRequest('travel', 'getTravelDetal/id/' + id, 'travelDetal')
        }

        /**
         * 搜索选择城市的旅游
         */
        travel.selCity = function ($scope, city) {
            server.createRequest('travel', 'getTravel/placearrive/' + city, $scope.curMenu);
        }
        return travel;
    }])

/**
 * 酒店
 */
    .factory('Hotel', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
        var hotel = {};
        var server = new ClientServer($http, $rootScope);
        hotel.getData = function () {
            server.createRequest('index', 'getCurPlace', 'place');
            server.createRequest('index', 'getHotCity', 'hotCity');
            server.createRequest('index', 'getStarAndPrice', 'starAndPrice');
        }

        hotel.setCurCity = function (city) {
            server.createRequest('index', 'setCurPlace?curCity=' + city, '').then(function (d) {
                if (d.status) {
                    $rootScope.place.city = city;
                } else {
                    $ionicPopup.alert({title: '错误', subTitle: '网络错误！', okText: '确认'});
                }
            })
        }

        //获得行政区和商圈
        hotel.getAreasAndZones = function ($scope) {
            server.createRequest('index', 'getAreasAndZones?mudi=' + $scope.place.city, '').then(function (d) {
                $rootScope.data = d;
                $location.url('/tab/hotel-select');
            })

        }

        //酒店搜索
        hotel.search = function ($scope) {
            var selPriceCode = '';//价格查询码
            var selStar = ''; //星级码
            //不限制
            var len = $scope.price.length;
            for (var i = 0; i < len; i++) {
                var goPrice = $scope.price[i].go;
                var endPrice = $scope.price[i].end;

                if (goPrice == -1 && endPrice == -1) {
                    selPriceCode = '';
                } else {
                    if (endPrice == -1) {
                        //    无上限搜索
                        if (len - i - 1) {
                            selPriceCode += goPrice + 'TO' + ',';
                        } else {
                            selPriceCode += goPrice + 'TO'
                        }
                    } else if (goPrice == 0) {
                        //以下
                        if (len - i - 1) {
                            selPriceCode += endPrice + 'TO' + ',';
                        } else {
                            selPriceCode += endPrice + 'TO'
                        }
                    } else {
                        //区间搜索
                        if (len - i - 1) {
                            selPriceCode += goPrice + 'TO' + endPrice + ',';
                        } else {
                            selPriceCode += endPrice + 'TO'
                        }
                    }
                }
            }

            for (i = 0; i < $scope.star.length; i++) {
                var num = $scope.star[i];
                if (num == -1) {
                    selStar = '';
                } else {
                    selStar += num;
                }
            }
            var data = {};
            data.mudi = $scope.place.city;
            data.hotel_start = $scope.today;
            data.hotel_end = $scope.tomorrow;
            data.AreaId = $scope.curAreasCode;
            data.OurPrice = selPriceCode;
            data.HotelStarRate = selStar;
            server.createRequest('hotel', 'searchHotel', 'hotelList', data);
            $location.url('/tab/hotel-list');
        }
        //获取详情
        hotel.getDetal = function (hotelId, $ionicSlideBoxDelegate) {
            server.createRequest('hotel', 'getDetal/hotelid/' + hotelId, '').then(function (d) {
                $rootScope.hotelDetal = d;
                $ionicSlideBoxDelegate.update();
                $location.url('tab/hotel-content');
            })
        }

        //预定显示

        hotel.hotelBook = function (id, $scope) {
            var data = {};
            data.roomNum = 1;
            data.name = '';
            data.lastTime = '';
            data.phone = '';
            $scope.order = data;
            server.createRequest('hotel', 'getOderInfo/roomid/' + id + '/checkindate/' + $scope.today + '/checkoutdate/' + $scope.tomorrow, '').then(function (d) {
                if (d.status == 0) {
                    $location.url('/tab/login');
                } else {
                    $scope.hotelOrderInfo = d;
                    $location.url('tab/hotel-order1');
                }
            });
        }

//        提交酒店订单
        hotel.createHotelOrder = function ($scope) {
            var param = {};
            param.CheckInDate = $scope.today;
            param.CheckOutDate = $scope.tomorrow;
            param.ReserveRoomNumber = $scope.roomNum;
            param.Customer = [$scope.order.name];
            param.PhoneNumber = $scope.order.phone;
            param.Arrival = '14:00'; //后续用真实时间
            param.ByStages = 12;
            param.terms = 1;
            param.roomid = $scope.hotelOrderInfo.roomid;
            param.TotalPrice = $scope.hotelOrderInfo.TotalPrice;
            param.RefundEachMonth = $scope.hotelOrderInfo.RefundEachMonth;
            server.createRequest('hotel', 'createHotelOrder', '', param).then(function (d) {
                if (d.status == 0) {
                    $ionicPopup.alert({title: '失败', subTitle: d.error, okText: '确认'});
                } else {
                    $ionicPopup.alert({title: '成功', subTitle: '预定成功，请尽快支付！', okText: '确认'});
                    $location.url('/tab/user');
                }
            });
        }

        return hotel;
    }])

/**
 * 首页
 */
    .factory('Index', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
        var index = {};
        var server = new ClientServer($http, $rootScope);
        index.getData = function ($ionicSlideBoxDelegate) {
            server.createRequest('index', 'getCurPlace', 'place');
            server.createRequest('index', 'getHotCity', '').then(function (d) {
                $rootScope.hotCity = d;
                server.createRequest('index', 'getTravel', '').then(function (d) {
                    $rootScope.travelList = d;
                    server.createRequest('index', 'getHotHotel', '').then(function (d) {
                        server.createRequest('index', 'getHotHotel', '').then(function (d) {
                            $rootScope.hotHotel = d;
                            $ionicSlideBoxDelegate.update();
                        })
                    })
                })
            })
        }

        /**
         * 搜索
         * @param keyword
         * @param $scope
         */
        index.search = function (keyword) {
            server.createRequest('index', 'search?keyword=' + keyword, '').then(function (d) {
                $rootScope.searchList = d;
                $location.url('/tab/dash-search');
            })
        }

        /**
         * 获取搜索详情
         * @param id
         */
        index.getSearchDetal = function (id) {
            server.createRequest('index', 'getSearchDetal?id=' + id, 'searchDetal');
        }

        //选择当前城市
        index.setCurCity = function (city, Hotel) {
            Hotel.setCurCity(city);
        }
        return index;
    }])