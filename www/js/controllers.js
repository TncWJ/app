angular.module('starter.controllers', [])

/**
 * 首页
 */
    .controller('DashCtrl', function ($scope, Index , $ionicPopup  , $ionicSlideBoxDelegate , $timeout , $location , Travel , Hotel) {
        $scope.keyword = '' ; //关键词
        $scope.setCurCity = function (city) {
            Index.setCurCity(city , Hotel);
            $location.url('/tab/dash');
        }

        $scope.showTravel = function(id){
            Travel.getDetal(id);
            $location.url('/tab/travel-content');
        }

        $scope.showHotel = function(sid){
            Hotel.getDetal(id);
            $location.url('/tab/hotel-content');
        }
        Index.getData( $ionicSlideBoxDelegate);


        $scope.search = function(keyword){
            if ( keyword == ''){
                $ionicPopup.alert({title: '错误', subTitle: '请输入关键字', okText: '确认'});
                return ;
            }
            Index.search(keyword);
        }

        //获取搜索详情
        $scope.getSearchDetal = function(id){
            Index.getSearchDetal(id);
            $location.url('/tab/search-content');
        }

        $scope.selCity = function(city){
            $location.url('/tab/travel');
            Travel.selCity($scope , city);
        }

    })

    .controller('ChatsCtrl', function ($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        }

    })

/**
 * 公用
 */
    .controller('CommonCtrl', function (User, $scope) {
        $scope.checkLogin = function (tplName) {
            $scope.goTplName = tplName;
            User.checkLogin(tplName);
        }

    })
/**
 * 用户
 */
    .controller('UserCenterCtrl', function (User, $scope, $ionicPopup) {
        User.checkLogin();
        User.getData($scope);
        $scope.type = 'changeLoginPass';
        //    密码
        $scope.time = '点击获取验证码';
        $scope.getCheckCode = function (type) {
            $scope.type = type;
            $scope.check();
            User.getCheckCode($scope, $ionicPopup, $scope.userInfo.phone_number, type);
        }

        //    提交修改
        $scope.submit = function () {
            $scope.check();
            User.changePass($scope, $ionicPopup)
        }

        $scope.check = function () {
            //检查两次密码是否一致
            if (!lyf.checkRpPass($scope.pass1, $scope.pass2)) {
                $ionicPopup.alert({title: '错误', subTitle: '两次密码不一致！', okText: '确认'});
                $scope.pass1 = '';
                $scope.pass2 = '';
                return false;
            }

            if ($scope.pass1 == '' || $scope.curPass == '' || $scope.pass2 == '') {
                $ionicPopup.alert({title: '错误', subTitle: '为了保证您的利益，请认真填写！！', okText: '确认'});
                return false;
            }
        }
    })

    //个人资料
    .controller('UserInfoCtrl', function (User, $scope) {
        $scope.logOut = function () {
            User.logOut();
        }
    })

//    借款
    .controller('UserDaiCtrl', function (User, $scope, $ionicPopup) {
        User.dai().getInfo();
        $scope.loanNum = ['100', '200', '500', '700', '800', '1000', '1500', '2000', '3000'];
        $scope.monthNum = []; //分期月数
        $scope.alipayNo = ''; //支付宝号
        $scope.payPass = ''; //支付密码
        $scope.showTotal = true; //显示信用额度或剩余额度（开关）
        for (var i = 3; i <= 24; i++) {
            $scope.monthNum.push(i);
        }
        $scope.curPayMonth = 12; //当前分期月数
        $scope.curLoanPrice = 500; //当前借款数
        User.dai().getPayMonth([12, 500]); //当前还款额度
        /**
         * 更新月分期信息
         * @param param array [month , price]
         */
        $scope.updateMonthPay = function (param) {
            $scope.curPayMonth = param[0];
            $scope.curLoanPrice = param[1];
            User.dai().getPayMonth(param, $ionicPopup);
        }

        /**
         * 提交借款
         */

        $scope.commitLoan = function (alipayNo, payPass) {
            User.dai().commitLoan({
                alipayNo: alipayNo,
                amount: $scope.curLoanPrice,
                monthNum: $scope.curPayMonth,
                pay_pass: payPass
            }, $ionicPopup);
        }
    })

/**
 * 登陆
 */

    .controller('LoginCtrl', function (User, $scope, $ionicPopup) {
        $scope.doLogin = function (username, password , checkCode) {
            User.doLogin(username, password, checkCode ,$scope.goTplNam, $ionicPopup);
            $scope.getCheckCode();
        }

        $scope.checkCodeSrc = conf.common.webHost+'/api/checkcode/index/code_len/4/font_size/16/width/120/height/45/charset/1234567890/time='+Math.random();
        $scope.getCheckCode = function(){
            $scope.checkCodeSrc = conf.common.webHost+'/api/checkcode/index/code_len/4/font_size/16/width/120/height/45/charset/1234567890/time='+Math.random();
        }
    })


/**
 * 机票
 */

    .controller('PlaneCtrl', function (Plane, $scope, $ionicPopup , $location , User) {
        $scope.host = conf.common.webHost;
        //$scope.today = new Date().format('yyyy-MM-dd');
        $scope.today = '2015-08-28';
        $scope.dCity = '北京'; //出发城市
        $scope.aCity = '上海'; //到达城市
        $scope.tplName = 'plane.html';
        $scope.lastTplName = '';
        $scope.btn = '';
        $scope.airCode = '' ;//航空公司代码，筛选条件
        $scope.timeD = ''; // mo 上午 af 下午 ev 晚间
        $scope.seatCode = 'Y'; // Y 经济仓 CF 公务/头等
        $scope.sTime = 'ASC'; //排序规则
        $scope.sPrice = 'ASC'; //排序规则
        $scope.sortKey = 'OurPrice'; //默认排序字段
        $scope.sort = 'ASC';
        $scope.passe = {
            //乘客列表
            0:[
                {
                    name:'',
                    idcard:''
                }
            ]
        };
        //联系人
        $scope.linkMan = {
            name:'',
            phone:''
        };
        $scope.passeIndex = 0; //乘客计数器

        /**
         * 搜索机票
         */
        $scope.searchFlight = function(){
            Plane.getFlight($scope );
            $location.url('/tab/plane-list');
        }

        /**
         * 交换城市，对调
         */
        $scope.exchangeCity = function(){
            var temp = $scope.dCity;
            $scope.dCity = $scope.aCity;
            $scope.aCity = temp;
        }

        //设置当前城市

        $scope.setCurCity = function(city){
            if ( $scope.btn == 'aCity' ){
                $scope.aCity = city;
            }else{
                $scope.dCity = city;
            }
            $location.url('/tab/plane');
        }

        /**
         * 更多舱位
         * @param index
         */
        $scope.searchSeat = function(index){
            Plane.searchSeat(index , $scope , User);
        }


        /**
         * 排序
         */

        $scope.sortFlightList = function(key , sort_name){
            $scope[key] =  $scope[key]  == 'ASC' ? 'DESC' : 'ASC';
            $scope.sortKey = sort_name;
            $scope.sort = $scope[key];
            Plane.getFlight($scope);
        }

        /**
         * 预定行班订单
         */
        $scope.planeBook = function(flightNo , seatCode){
            Plane.getOrderInfo(seatCode , $scope);
            $location.url('/tab/plane-order1');
        }

        /**
         * 改变乘客列表
         */
        $scope.changePasse = function(num , index){
            if ( $scope.passeIndex + num <= 0 ){
                $scope.passeIndex = 0;
                return;
            }

            if ( $scope.passeIndex + num < $scope.passeIndex ){
                //    删除处理
                //    delete $scope.passe[index];
                return;
            }
            $scope.passe[$scope.passeIndex += num] = {name:'' , idcard : ''};
        }

        /**
         * 订单提交
         */
        $scope.bookCommit = function(){
            //   验证
            $scope.changeTpl('planeOrder2.html');
        }

        /**
         * 创建机票订单
         */
        $scope.createPlaneOrder = function(){

        }

        $scope.changeTpl = function(tplName , way){
            if(arguments[1]){
                $scope.btn = way;
            }
            $location.url('/tab/plane-'+tplName);
        }
    })

/**
 * 旅游
 */
    .controller('TravelCtrl', function (Travel, $scope, $ionicPopup, $location)
    {
        $scope.curCity = '北京'; //当前城市
        $scope.tplName = 'travel.html';
        $scope.tplLastTpl = '';

        $scope.adultNum = 1; //成人数量
        $scope.dDate = '2015-08-31'; //出发日期
        $scope.urgency = {
            name:'',
            phone:''
        };//紧急联系人方式
        $scope.mudi = '北京';
        $scope.curMenu = 'zhoubian'; //当前栏目

        $scope.box1 = true;
        $scope.box2 = false;
        $scope.box3 = false;

        Travel.getData();

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
        $scope.selCity = function(city){
            Travel.selCity($scope , city);
        }
    })


/**
 * 酒店
 */
    .controller('HotelCtrl', function (Hotel, $scope, $ionicPopup , $location , $ionicSlideBoxDelegate) {
        $scope.tplName = 'search.html';
        $scope.lastTplName = '';
        $scope.btn = '';

        $scope.today = new Date().format('yyyy-MM-dd', 1);
        $scope.tomorrow = new Date().format('yyyy-MM-dd', 2);
        $scope.curAreasCode = ''; //当前的行政区查询代码
        $scope.curAreasName = ''; //当前的行政区名字
        $scope.curZonesCode = ''; //当前的商圈查询代码
        $scope.curZonesName = ''; //当前的商圈名字
        $scope.curbandsCode = ''; //酒店品牌查询代码
        $scope.curbandsName = ''; //酒店品牌名字
        $scope.curSelectIndex = {
            Areas: -1,
            Zones: -1,
            bands: -1
        }; //当前选中的index值
        $scope.star = [-1];
        $scope.price = new Array({
            go: 0,
            end: 150
        });
        //酒店价格筛选条件
        Hotel.getData();

        $scope.setCurCity = function (city) {
            Hotel.setCurCity(city);
            $location.url('/tab/hotel');
        }

        $scope.getAreasAndZones = function () {
            Hotel.getAreasAndZones($scope);
        }

        /**
         * 选择
         * @param selName
         * @param data
         * @param index
         */
        $scope.selectOn = function (selName, data, index) {
            switch (selName) {
                case 'Areas':
                    //行政区域
                    $scope.curAreasCode = data.code;
                    $scope.curAreasName = data.name;
                    $scope.curSelectIndex.Areas = index;
                    break;
                case 'Zones':
                    //    商圈
                    $scope.curZonesCode = data.code;
                    $scope.curZonesName = data.name;
                    $scope.curSelectIndex.Zones = index;
                    break;
                case 'Showbands':
                    //酒店品牌
                    $scope.curbandsCode = data.code;
                    $scope.curbandsName = data.name;
                    $scope.curSelectIndex.bands = index;
                    break;
                default :
                    break;
            }

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
            Hotel.search($scope);
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


        /**
         * 检查用户填写的订单表单
         */
        $scope.checkOrderTable = function ($ionicPopup , $scope) {
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

        $scope.getDetal = function(id){
            Hotel.getDetal(id  ,$ionicSlideBoxDelegate);
        }

        $scope.hotelBook = function(id){
            Hotel.hotelBook(id , $scope);
        }
    })