angular.module('starter.controllers', ['ngCordova', 'ionic'])

/**
 * 首页
 */
    .controller('DashCtrl', function ($scope, $ionicNavBarDelegate, Index, Common, $ionicScrollDelegate, $ionicLoading, $rootScope, $ionicPopup, $ionicSlideBoxDelegate, $timeout, $location, Travel, Hotel) {
        if ($rootScope.keyword == undefined) {
            $rootScope.keyword = ''; //关键词
        }
        if ($rootScope.time == undefined) $rootScope.time = '获取验证码';

        $scope.show = false; //是否显示打电话

        if ($rootScope.pay == undefined) {
            $rootScope.pay = {
                type: '', //订单类型
                id: '' //订单号
            }
        }
        if ($rootScope.conf == undefined) {
            $rootScope.conf = {
                phone: conf.common.phone
            }
        }
        $scope.showPhone = function (bool) {
            $scope.show = bool;
        }
        if ($rootScope.place == undefined) {
            Index.getData($ionicSlideBoxDelegate);
        }
        $timeout(function () {
            $rootScope.plane = {
                aCity: '北京',
                dCity: $rootScope.place.city,
                dDate: new Date().format('yyyy-MM-dd'),
                curSel: 'dCity', //当前选择，aCtiy or dCity
                seatCode: 'Y',
                sortKey: '',
                sort: '',
                aCode: 'BJS',
                dCode: 'SHA',
                timeD: '',  //筛选时间段
                airCode: '',

                moreSeat: {} //座位信息
            };
        }, 2500)
        if ($rootScope.curMenu == undefined)   $rootScope.curMenu = ''; //当前栏目 = '';

        $scope.setTravelCurMenu = function (name) {
            $rootScope.curMenu = name;
            $location.url('/tab/travel');
        }
        $scope.setCurCity = function (city) {
            Common.updateUsedCity(city);
            Index.setCurCity(city, Hotel);
            $rootScope.plane.dCity = city;
            $location.url('/tab/dash');
        }

        $scope.showTravel = function (id) {
            Travel.getDetal(id);
            $location.url('/tab/travel-content');
        }

        $scope.showHotel = function (id) {
            Hotel.getDetal(id);
            $location.url('/tab/hotel-content');
        }


        $scope.search = function (keyword) {
            if (keyword == '') {
                $ionicPopup.alert({title: '错误', subTitle: '请输入关键字', okText: '确认'});
                return;
            }
            Index.search(keyword);
        }

        //获取搜索详情
        $scope.getSearchDetal = function (id) {
            Index.getSearchDetal(id);
            $location.url('/tab/search-content');
        }

        $scope.selCity = function (city) {
            $location.url('/tab/travel');
            Travel.selCity($scope, city);
        }

        //    获取Banner
        Index.getBanner($ionicSlideBoxDelegate);

        // Banner跳转 type:travel|id:512
        $scope.bannerGoTo = function (src) {
            var arr = src.split('|');
            var type = arr[0].split(':')[1];
            var id = arr[1].split(':')[1];
            switch (type) {
                case 'travel':
                    Travel.getDetal(id);
                    $location.url('tab/travel-content');
                    break;
                case 'hotel':
                    Hotel.getDetal(id, $ionicSlideBoxDelegate, $ionicLoading);
                    $location.url('tab/hotel-content');
                    break;
                default :
                    break;
            }
        }

        //    下一页
        $scope.loadMore = function (page) {
            $scope.curPage = page;
            Index.getNextPage(page, $ionicScrollDelegate);
        }

        //上一页
        $scope.getLastPage = function (page) {
            $scope.curPage = page;
            Index.getLastPage(page, $ionicScrollDelegate);
        }

        $scope.selCurCity = function (city) {
            Common.searchCity(city, $scope.setCurCity, $ionicPopup);
        }

        //    获取城用城市
        $rootScope.usedCity = Common.readUsedCity();

    })

/**
 * 公用
 */
    .controller('CommonCtrl', function (User, $scope, $rootScope, $ionicPopup) {
        $scope.checkLogin = function (tplName) {
            $scope.goTplName = tplName;
            User.checkLogin(tplName);
        }


    })
/**
 * 用户
 */
    .controller('UserCenterCtrl', function (User, Common) {
        User.checkLogin();
        User.getData();

    })

    .controller('UserBillCtrl', function (User, $scope, $rootScope, $location) {
        //还款
        $scope.refund = function (id, conNum) {
            if ($rootScope.pay == undefined) {
                $rootScope.pay = {
                    amount: ''
                }
            }

            $rootScope.pay.amount = conNum;
            $rootScope.pay.id = id;

            $location.url('/tab/pay-refund');
        }
    })

/**
 * 余额操作
 */
    .controller('UserBalanceCtrl', function ($scope, User, $ionicPopup, $rootScope, $location) {
        //    提现
        $scope.returnMoneyToBank = function (conNum) {
            User.returnMoneyToBank($ionicPopup, conNum);
        }

        //    充值
        $scope.recharge = function (conNum) {
            if (isNaN(conNum) || conNum == 0) {
                $ionicPopup.alert({title: '失败', subTitle: '充值数值必须不能为0！', okText: '确认'});
                return;
            }
            if ($rootScope.pay == undefined) {
                $rootScope.pay = {
                    amount: ''
                }
            }

            $rootScope.pay.amount = conNum;

            $location.url('/tab/pay-topUp');
        }
    })

    .controller('UserVerifyCtrl', function ($scope, User, $ionicPopup, $rootScope, $http, Common, $cordovaImagePicker) {
        $scope.verify = {
            real_name: $rootScope.userInfo.real_name,
            id_number: $rootScope.userInfo.id_number,
            alipay_account: $rootScope.userInfo.alipay_account,
            user_login: $rootScope.userInfo.user_login,
            weixin_account: $rootScope.userInfo.weixin_account,
            contactors: {
                relation: '',
                name: '',
                phone: ''
            },
            school_id: $rootScope.userInfo.school_id,
            institude_name: $rootScope.userInfo.institude_name,
            major: $rootScope.userInfo.major,
            grade: $rootScope.userInfo.grade,
            dorm_address: $rootScope.userInfo.dorm_address,
            education_background: $rootScope.userInfo.education_background,
            school_year: $rootScope.userInfo.school_year,
            student_number: $rootScope.userInfo.student_number,
            xuexin_uesername: $rootScope.userInfo.xuexin_uesername,
            xuexin_password: $rootScope.userInfo.xuexin_password
        }

        $scope.imgSrc = {
            id_card_pic1: '',
            id_card_pic2: '',
            id_card_hand: '',
            student_card_pic: ''
        }

        $scope.linkManType = ['父母', '同学', '朋友'];
        //    图片选择器
        Common.imgSelector($cordovaImagePicker);

        //用户认证第三步（上传身份图片）
        var doactive_step3 = function () {
            var url = 'http://app.letyoufun.com/AppServer/User/doactive_step3?from_app=\'\'';
            angular.element(document.querySelector('#submit')).src(url);
            $ionicPopup.alert({title: '成功', subTitle: '资料已经填写完毕，等待管理员审核！', okText: '确认'});
        }
        //认证
        $scope.userRzCenter = function (num) {
            switch (num) {
                case 1:
                    User.doactive_step1($scope, $ionicPopup);
                    break;
                case 2:
                    User.doactive_step2($scope, $ionicPopup);
                    break;
                case 3:
                    doactive_step3();
                    $ionicPopup.alert({title: '成功', subTitle: '证件照片上传成功，等待审核！', okText: '确认'});
                    //User.doactive_step3($scope , $ionicPopup);
                    break;
            }
        }

        //获取省级行政区
        $scope.provinceName = '广东省';
        $scope.city = '深圳市';
        $scope.provinceId = 0;
        $scope.cityData = {};
        $scope.schoolName = '';
        $scope.schoolIndex = 0;
        $scope.edBackground = ['专科', '本科', '研究生'];
        var year = new Date().getFullYear();
        $scope.schoolYearList = [year - 3, year - 2, year - 1, year];

        if ($rootScope.provinceList == undefined) {
            $http.get(lyf.go('statics', '/query_province_city.json')).then(function (d) {
                $rootScope.provinceList = d.data;
            })
        }

        //更新城市列表
        $scope.updateProvince = function (index) {
            var data = $rootScope.provinceList.result_rows[index];
            $scope.provinceName = data.region_name;
            $scope.cityData = data.child;
            $scope.showCity = true;

        }

        //更新学校列表
        $scope.updateSchoolList = function (city) {
            User.getSchoolList($scope.provinceName, city);
        }

        //    更新大学名称
        $scope.updateSchoolName = function (index) {
            var data = $rootScope.schoolList[index];
            $scope.verify.school_id = data.id;
            $scope.schoolName = data.name;
        }


    })
/**
 * 用户注册
 */
    .controller('UserRegCtrl', function (User, $scope, $rootScope, $ionicPopup, Common, $interval) {

        if ($rootScope.reg == undefined) {
            $rootScope.reg = {
                verify: '',
                terms: 1,
                phone_number: '',
                sms_code: '',
                user_pass: '',
                user_pass2: ''
            };
        }

        //获取手机验证码
        $scope.getSMScode = function (phone) {
            $rootScope.tempPhone = phone;
            if (!lyf.isMoblie(phone)) {
                $ionicPopup.alert({title: '失败', subTitle: '手机号格式不正确', okText: '确认'});
                return;
            }
            User.getRegSMScode(phone, $ionicPopup);
        }

        //重新获取验证码
        $scope.rGetSMScode = function () {
            Common.rGetSMScode($interval, $scope.getSMScode, $ionicPopup);
        }

        //    注册
        $scope.doReg = function () {
            User.doReg($ionicPopup);
        }

        $scope.checkCodeSrc = conf.common.webHost + '/api/checkcode/index/code_len/4/font_size/16/width/120/height/45/charset/1234567890/time=' + Math.random();
        $scope.getCheckCode = function () {
            $scope.checkCodeSrc = conf.common.webHost + '/api/checkcode/index/code_len/4/font_size/16/width/120/height/45/charset/1234567890/time=' + Math.random();
        }
    })

    //用户找回登录密码
    .controller('UserFindCtrl', function (User, $scope, $rootScope, $ionicPopup, $http, $location, Common, $interval) {
        if ($rootScope.find == undefined) {
            $rootScope.find = {
                phone: '',
                user_pass: '',
                user_pass2: '',
                sms_code: ''
            }
        }

        $scope.getSMScode = function (phone) {
            $rootScope.tempPhone = phone;
            $http.get(lyf.go('user/login/send_sms', '?type=change_login_password&phone=' + phone + '&rad=' + Math.random())).then(function (d) {
                if (d.status) {
                    $location.url('/tab/user-find-password')
                } else {
                    $ionicPopup.alert({title: '失败', subTitle: d.error, okText: '确认'});
                }
            })
        }
        //重新获取验证码
        $scope.rGetSMScode = function () {
            Common.rGetSMScode($interval, $scope.getSMScode, $ionicPopup);
        }

        /**
         * 找回登陆密码
         */
        $scope.findPassWord = function () {
            User.findLoginPass();
        }
    })

    //个人资料
    .controller('UserInfoCtrl', function (User, $scope) {
        $scope.logOut = function () {
            User.logOut();
        }
    })

    //用户中心-安全
    .controller('UserSafeCtrl', function (User, $scope, $rootScope, $ionicPopup, $location, Common, $interval) {
        if ($rootScope.safe == undefined) {
            $rootScope.safe = {
                oldpassword: '',
                password: '',
                repassword: '',
                pay_pass: '',
                sms_code: '',
                user_login: '', //邮箱号
                phone: ''
            }
        }


        $scope.changeLoginPass = function () {
            User.changeLoginPass($ionicPopup);
        }

        $scope.getSMScode = function (name) {
            var str = name == 'user-safe-password-pay' ? 'changePayPass' : 'changePhone';
            $rootScope.tempPhone = $rootScope.userInfo.phone_number;
            User.getCheckCode($ionicPopup, $rootScope.userInfo.phone_number, str);
            if (name) $location.url('/tab/' + name);
        }

        //重新获取验证码
        $scope.rGetSMScode = function () {
            Common.rGetSMScode($interval, $scope.getSMScode, $ionicPopup, 'safe');
        }

        $scope.changePayPass = function () {
            User.getCheckCode($ionicPopup, $rootScope.userInfo.phone_number, 'changePhone');
            User.changePayPass($ionicPopup);
        }

        $scope.changeEmail = function () {
            User.changeEmail($ionicPopup);
        }

        //    获取激活邮件
        $scope.doactive = function () {
            User.doactive($ionicPopup);
        }

    })
//    借款
    .controller('UserDaiCtrl', function (User, $scope, $ionicPopup, Common, $rootScope, $interval) {
        User.dai().getInfo($interval);
        User.getData();
        $scope.loanNum = ['100', '200', '500', '700', '800', '1000', '1500', '2000', '3000'];
        $scope.timeMsg = lyf.getTimeMsg();
        $scope.monthNum = []; //分期月数
        $scope.alipayNo = ''; //支付宝号
        $scope.payPass = ''; //支付密码
        $scope.showTotal = true; //显示信用额度或剩余额度（开关）
        for (var i = 3; i <= 24; i++) {
            $scope.monthNum.push(i);
        }
        $scope.curPayMonth = 12; //当前分期月数
        $scope.curLoanPrice = 500; //当前借款数
        User.dai().getPayMonth([12, 500], Common); //当前还款额度
        /**
         * 更新月分期信息
         * @param param array [month , price]
         */
        $scope.updateMonthPay = function (param) {
            $scope.curPayMonth = param[0];
            $scope.curLoanPrice = param[1];
            User.dai().getPayMonth(param, Common);
        }

        /**
         * 提交借款
         */

        $scope.commitLoan = function (alipayNo, payPass) {
            User.dai().commitLoan({
                alipayNo: alipayNo,
                amount: $scope.curLoanPrice,
                finance_count: $scope.curPayMonth,
                pay_pass: payPass
            }, $ionicPopup);
        }

    })

/**
 * 登陆
 */

    .controller('LoginCtrl', function (User, $scope, $ionicPopup, Common) {

        $scope.doLogin = function (username, password, checkCode) {
            User.doLogin(username, password, checkCode, $scope.goTplNam, $ionicPopup);
            $scope.getCheckCode();
        }

        $scope.checkCodeSrc = conf.common.webHost + '/api/checkcode/index/code_len/4/font_size/16/width/120/height/45/charset/1234567890/time=' + Math.random();
        $scope.getCheckCode = function () {
            $scope.checkCodeSrc = conf.common.webHost + '/api/checkcode/index/code_len/4/font_size/16/width/120/height/45/charset/1234567890/time=' + Math.random();
        }
    })


/**
 * 机票
 */

    .controller('PlaneCtrl', function (Plane, $scope, $rootScope, $ionicPopup, $location, User, Common, $cordovaDatePicker, $ionicLoading) {
        if ($rootScope.plane == undefined) {
            $rootScope.plane = {
                dDate: new Date().format('yyyy-MM-dd')
            }
        }
        $scope.changeTpl = function (curSel) {
            $rootScope.plane.curSel = curSel;
            $location.url('/tab/plane-choose');
        }

        //交换城市
        $scope.exchangeCity = function () {
            var temp = $rootScope.plane.dCity;
            $rootScope.plane.dCity = $rootScope.plane.aCity;
            $rootScope.plane.aCity = temp;

        }
        //    日期选择器
        Common.dateSelector($cordovaDatePicker);

        //    航班搜索
        $scope.searchFlight = function () {
            Plane.getFlight($ionicLoading);
            $location.url('/tab/plane-list');
        }

        /**
         * 更多舱位
         * @param index
         */
        $scope.searchSeat = function (index) {
            Plane.searchSeat(index, User);

            $location.url('tab/plane-seatSel');
        }

        /**
         * 预定航班订单
         */
        $scope.planeBook = function (flightNo, seatCode) {
            Plane.getOrderInfo(seatCode, User, $ionicLoading);
        }

    })

/**
 * 城市选择
 */
    .controller('PlaneChooseCtrl', function (Plane, $scope, $location, Common, $ionicPopup) {
        $scope.setCurCity = function (city) {
            Common.updateUsedCity(city);
            Plane.selCity(city);
            $location.url('/tab/plane');
        }

        $scope.selCurCity = function (city) {
            Common.searchCity(city, $scope.setCurCity, $ionicPopup);
        }
    })

/**
 * 旅游
 */
    .controller('TravelCtrl', function (Travel, Common, $rootScope, $ionicLoading, $scope, $ionicPopup, $location, $ionicScrollDelegate) {
        $scope.curCity = '北京'; //当前城市
        $scope.tplName = 'travel.html';
        $scope.tplLastTpl = '';

        $scope.adultNum = 1; //成人数量
        $scope.dDate = '2015-08-31'; //出发日期
        $scope.urgency = {
            name: '',
            phone: ''
        };//紧急联系人方式
        $scope.mudi = '北京';
        $scope.curPage = 1;
        $scope.index = 0; //菜单选中索引

        Travel.getData($ionicLoading);

        $scope.changeBox = function (id) {
            switch (id) {
                case 1:
                    $scope.boxClose();
                    $scope.box1 = true;
                    break;
                case 2:
                    $scope.boxClose();
                    $scope.box2 = true;
                    break;
                case 3:
                    $scope.boxClose();
                    $scope.box3 = true;
                    break;
            }
        }

        $scope.boxClose = function () {
            $scope.box1 = false;
            $scope.box2 = false;
            $scope.box3 = false;
        }

        $scope.showDetal = function (id) {
            Travel.getDetal(id);
            $location.url('tab/travel-content');
        }

        /**
         * 选择城市
         * @param city
         */
        $scope.setCurCity = function (city) {
            Common.updateUsedCity(city);
            Travel.selCity($scope, city);
        }

        //    下一页
        $scope.loadMore = function (page) {
            $scope.curPage = page;
            Travel.getNextPage(page, $scope, $ionicScrollDelegate);
        }

        //上一页
        $scope.getLastPage = function (page) {
            $scope.curPage = page;
            Travel.getLastPage(page, $scope, $ionicScrollDelegate);
        }

        /**
         * 菜单栏改变事件
         */
        $scope.changeMenu = function (name) {
            $scope.curPage = 1
            $scope.update('curMenu', name);
            Travel.searchCurMenu();
        }

        if (typeof Zepto == 'undefined') {
            var oHead = document.getElementsByTagName('head').item(0);
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = "js/common/zepto.js";
            oHead.appendChild(oScript);
        }

        var default_customer = {'name': '', 'ename': '', phone: '', email: '', idnumber: ''};
        $rootScope.updateCustomers = function () {
            var User = $scope.userInfo;
            if (!User) {
                $scope.customers = [default_customer];
            } else {
                $scope.customers = [{
                    'name': User.real_name,
                    'ename': '',
                    phone: User.phone_number,
                    email: User.user_login,
                    idnumber: User.id_number
                }];
            }
            $scope.contactor_name = User ? User.real_name : '';
            $scope.contactor_phone = User ? User.phone_number : '';
            $scope.contactor_email = User ? User.user_login : '';
        }
        $scope.updateCustomers();
        var User = $scope.user;
        if (!User) {
            $scope.customers = [default_customer];
        } else {
            $scope.customers = [{
                'name': User.real_name,
                'ename': '',
                phone: User.phone_number,
                email: User.user_login,
                idnumber: User.id_number
            }];
        }
        $scope.contactor_name = User ? User.real_name : '';
        $scope.contactor_phone = User ? User.phone_number : '';
        $scope.contactor_email = User ? User.user_login : '';
        $scope.terms = true;
        $scope.submitForm = function (isValid, e) {
            e.preventDefault();
            if (!isValid) {
                $ionicPopup.alert({title: '请补齐必填项', subTitle: '', okText: '确认'});
                return;
            }
            var para1 = $(e.target).serializeArray();
            var para = {
                down_pay: 0,
                pay_months: 12,
                room_count: 0,
                insurance30_count: 0,
                insurance50_count: 0,
                insurance10_count: 0,
                _r: Math.random()
            }
            for (var i in para1) {
                para[para1[i].name] = para1[i].value;
            }
            $.post(conf.common.webHost + $(e.target).attr('action'), para, function (recv) {
                if (recv.state == 'fail') {
                    $ionicPopup.alert({title: '成功', subTitle: recv.info, okText: '确认'});
                } else {
                    $ionicPopup.alert({title: '错误', subTitle: recv.info, okText: '确认'});
                    $location.url('tab/travel-content');
                }
            }, 'json');
        };
        $scope.setUserCount = function (direction) {
            var cnt = $scope.customers.length;
            cnt += direction;
            if (cnt < 1 || cnt > 10) {
                return;
            }
            $scope.customers.splice(1);
            for (var i = 1; i < cnt; i++) {
                $scope.customers.push(default_customer);
            }
        };

        $scope.selCurCity = function (city) {
            Common.searchCity(city, $scope.setCurCity, $ionicPopup);
        }
    })


/**
 * 酒店
 */
    .controller('HotelCtrl', function (Hotel, $scope, $rootScope, $ionicScrollDelegate, Common, $ionicPopup, $location, $ionicSlideBoxDelegate, $cordovaDatePicker, $ionicLoading) {
        $scope.tplName = 'search.html';
        $scope.lastTplName = '';
        $scope.btn = '';
        $scope.curPage = 1;

        $rootScope.curAreasCode = ''; //当前的行政区查询代码
        $rootScope.curAreasName = ''; //当前的行政区名字
        $rootScope.curZonesCode = ''; //当前的商圈查询代码
        $rootScope.curZonesName = ''; //当前的商圈名字
        $rootScope.curbandsCode = ''; //酒店品牌查询代码
        $rootScope.curbandsName = ''; //酒店品牌名字
        $rootScope.curSelectIndex = {
            Areas: -1,
            Zones: -1,
            bands: -1
        }; //当前选中的index值

        $rootScope.hotel = {
            curMenuIndex: 0
        };

        $scope.star = [-1];
        $scope.price = new Array({
            go: 0,
            end: 150
        });
        $rootScope.dDate = new Date().format('yyyy-MM-dd', 1); //出发日期
        $rootScope.aDate = new Date().format('yyyy-MM-dd', 2); //到达日期
        //酒店价格筛选条件
        Hotel.getData();

        $scope.setCurCity = function (city) {
            Common.updateUsedCity(city);
            Hotel.setCurCity(city);
            $rootScope.plane.dCity = city;
            $location.url('/tab/hotel');
        }

        $scope.getAreasAndZones = function () {
            Hotel.getAreasAndZones($scope);
        }


        /**
         * 返回默认选择不限
         */
        $scope.clear = function () {
            $scope.curAreasCode = '';
            $scope.curZonesCode = '';
            $scope.curZonesCode = '';

            $scope.curSelectIndex.Areas = -1;
            $scope.curSelectIndex.Zones = -1;
            $scope.curSelectIndex.bands = -1;

        }

        $scope.search = function () {
            Hotel.search($scope, $ionicLoading);
        }

        $scope.updateSearch = function (name, value, isAppend) {
            isAppend = arguments[2] ? arguments[2] : false;
            if (!isAppend) {
                $scope[name] = value;
            } else {
                //    更新多个
                //    待解决重复
                var objArr = $scope[name];
                objArr.push(value);
                $scope[name] = objArr;
            }
        }

        //    下一页
        $scope.loadMore = function (page) {
            $scope.curPage = page;
            Hotel.getNextPage(page, $scope, $ionicScrollDelegate);
        }

        //上一页
        $scope.getLastPage = function (page) {
            $scope.curPage = page;
            Hotel.getLastPage(page, $scope, $ionicScrollDelegate);
        }

        /**
         * 检查用户填写的订单表单
         */
        $scope.checkOrderTable = function ($ionicPopup, $scope) {
            var roomNum = $scope.order.roomNum;
            var name = $scope.order.name;
            var lastTime = $scope.order.lastTime;
            var phone = $scope.order.phone;

            if (!roomNum || !name || !lastTime || !phone) {
                $ionicPopup.alert({title: '错误', subTitle: '为了保证您的利益，请认真填写！！', okText: '确认'});
                return false;
            } else {
                if (typeof roomNum != "number") {
                    $scope.order.roomNum = 1;
                    return false;
                }
                if (!lyf.isCnName(name)) {
                    $scope.order.name = '';
                    return false;
                }
                if (!lyf.IsDate(lastTime)) {
                    $scope.order.lastTime = '';
                    return false;
                }
                if (!lyf.isMoblie(phone)) {
                    $scope.order.phone = '';
                    return false;
                }
                $location.url('/tab/hotel-order2');
            }

        }

        $scope.getDetal = function (id) {
            Hotel.getDetal(id, $ionicSlideBoxDelegate, $ionicLoading);
        }

        $scope.hotelBook = function (id) {
            Hotel.hotelBook(id);
        }

        //    日期选择器
        Common.dateSelector($cordovaDatePicker);

        //    下一页
        $scope.doRefresh = function () {
            Hotel.getNextPage($scope.curPage);
        }

        //    筛选
        $scope.selectOn = function (selName, data, index) {
            Hotel.selectOn(selName, data, index);
        }

        $scope.changeMenu = function (index) {
            $rootScope.hotel.curMenuIndex = index;
        }

        $scope.selCurCity = function (city) {
            Common.searchCity(city, $scope.setCurCity, $ionicPopup);
        }

    })

/**
 * 订单相关
 */
    //酒店订单
    .controller('HotelOrderCtrl', function (Hotel, $scope, $rootScope, User, Common, Order, $cordovaDatePicker, $ionicPopup) {
        if ($rootScope.temp == undefined) {
            $rootScope.temp = User.getInfo();
        }

        $rootScope.temp.then(function (d) {
            if ($rootScope.hotel.order == undefined) {
                $rootScope.hotel.order = {
                    Customer: d[1],//姓名，多个用逗号分割
                    roomNum: 1,
                    ByStages: 12,//分期数
                    RefundEachMonth: $rootScope.hotelOrderInfo.RefundEachMonth,//月付
                    TotalPrice: $rootScope.hotelOrderInfo.TotalPrice,
                    roomid: $rootScope.hotelOrderInfo.roomid,
                    ReserveRoomNumber: 1, //订购的房间数量
                    CheckInDate: $rootScope.hotelOrderInfo.checkindate, //可选
                    CheckOutDate: $rootScope.hotelOrderInfo.checkoutdate, //可选
                    Arrival: '12:00', //入住人最晚入住时间
                    PhoneNumber: d[0],
                    Memo: '', //备注
                    recommender_phone_number: d[0]
                };
            }
        });

        Common.dateSelector($cordovaDatePicker, 'time');
        $scope.roomList = [];
        $scope.fenList = [];
        for (var i = 1; i <= 24; i++) {
            if (i <= 12) {
                $scope.roomList.push(i);
            }

            if (i >= 3) {
                $scope.fenList.push(i);
            }
        }

        $scope.getMonthPay = function (month, money) {
            Common.getMonthPay([month, money], 'hotel.order.RefundEachMonth');
        }

        //更新结算价
        $scope.updateTotalPay = function (roomNum) {
            $rootScope.hotel.order.TotalPrice = roomNum * $rootScope.hotelOrderInfo.TotalPrice;
            $scope.getMonthPay($rootScope.hotel.order.ByStages, $rootScope.hotel.order.TotalPrice);
        }

        /**
         * 提交订单
         */
        $scope.createHotelOrder = function () {
            Order.createHotelOrder($ionicPopup);
        }
    })

/**
 * 机票订单
 */
    .controller('PlaneOrderCtrl', function ($scope, $rootScope, Order, $ionicPopup, Common, User) {
        if ($rootScope.curIndex == undefined) {
            $rootScope.curIndex = 0;
        }
        User.getInfo().then(function (d) {
            if ($rootScope.plane == undefined || $rootScope.plane.order == undefined) {
                $rootScope.plane.order = {
                    totalPay: $rootScope.plane.orderInfo.flight.totalprice,
                    passenger_count: 0,//乘客数
                    contactName: d[1],//联系人姓名
                    contactPhone: d[0],//联系人电话
                    finance_month: 12,//分期月数
                    monthPay: $scope.getMonthPay(12, this.totalPay)//月付
                    //username0:'',//联系人1
                    //useridtype0:1,//证件类型 默认身份证
                    //userid0:''//证件号码
                }
            }
            if ($rootScope.temp == undefined) {
                $rootScope.temp = {
                    linkManList: []
                };
                //    初始化
                $scope.addLinkMan();
            } else {
                if ($rootScope.temp.linkManList == undefined) {
                    $rootScope.temp.linkManList = [];
                }
            }
            $scope.fenList = [];
            for (var i = 3; i <= 24; i++) {
                $scope.fenList.push(i)
            }
            ;
        })

        //创建乘客数据，生成订单前和初始化调用
        var createData = function () {
            var list = $rootScope.temp.linkManList;
            var order = $rootScope.plane.order;
            for (var i = 0; i < list.length; i++) {
                order['username' + i] = list[i].username;
                order['useridtype' + i] = list[i].useridtype;
                order['userid' + i] = list[i].userid;
            }
        }

        //月付
        $scope.getMonthPay = function (month, money) {
            Common.getMonthPay([month, money], 'plane.order.monthPay');
        }

        $scope.createPlaneOrder = function () {
            createData();
            Order.createPlaneOrder($ionicPopup);
        }


        //    添加联系人
        $scope.addLinkMan = function () {
            var linkMan = {};
            linkMan['username' + $rootScope.curIndex] = '';
            linkMan['useridtype' + $rootScope.curIndex] = 1;
            linkMan['userid' + $rootScope.curIndex] = '';
            linkMan['length'] = $rootScope.curIndex;
            if ($rootScope.curIndex + 1 > 9) {
                $ionicPopup.alert({title: '失败', subTitle: '联系人不能超过9个！', okText: '确认'});
                return;
            }
            $rootScope.temp.linkManList.push(linkMan);
            $rootScope.curIndex += 1;
            $rootScope.plane.order.passenger_count += 1;
            updateTotalPay();
        }

        //    删除联系人
        $scope.delLinkMan = function (index) {
            if ($rootScope.curIndex - 1 <= 0) {
                return;
            }
            var temp = $rootScope.temp.linkManList[0];
            $rootScope.temp.linkManList.shift();
            $rootScope.temp.linkManList[index - 1] = temp;
            $rootScope.plane.order.passenger_count -= 1;
            $rootScope.curIndex -= 1;
            updateTotalPay();
        }


        //    更新结算价
        var updateTotalPay = function () {
            $rootScope.plane.order.totalPay = $rootScope.plane.orderInfo.flight.totalprice * $rootScope.plane.order.passenger_count;
            $scope.getMonthPay($rootScope.plane.order.finance_month, $rootScope.plane.order.totalPay);
        }


    })

/**
 * 支付
 */
    .controller('PayCtrl', function ($scope, $rootScope, Common) {
        $scope.pay = {
            url: {
                topUp: 'http://app.letyoufun.com/User/Center/mywallet_charge/amount/' + $rootScope.pay.amount + '/app/1/redirect_url/AppServer/Pay/topUpResult',
                refund: 'http://app.letyoufun.com/User/Center/alipay/id/' + $rootScope.pay.id + '/count/' + $rootScope.pay.amount + '/app/1/redirect_url/AppServer/Pay/topUpResult'
            }
        };

        $scope.getSrc = function (src) {
            return Common.getSrc(src);
        }

        //分期付款
        $scope.payable = function () {

        }

        //    全款支付
        $scope.fullPay = function () {

        }

    })


