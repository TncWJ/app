/**
 * Created by jiangjiacai on 2015/8/6.
 */


/**
 * 本地服务
 */
function ClientServer($http , $scope){
    this.init($http , $scope);
}

/**
 * 创建一个对API的ajax请求
 * @param apiName
 * @param getParam
 * @param templateName
 * @param postData
 * @returns void || object
 */
ClientServer.prototype.createRequest = function(apiName , getParam , templateName , postData ){
    apiName = arguments[0] ? apiName : 'index';
    getParam = arguments[1] ? getParam : '';
    templateName = arguments[2] ? templateName : '';
    postData = arguments[3] ? postData : '';

    var scope = this.scope;
        scope['loadOk'] = false;
    if( !postData ){
        this.data =  (
            this.http.get(lyf.go(this.api[apiName] , getParam)).then(function(response){
                return response.data;
        }));
    }else{
        //post
        //this.data =  (
        //this.http.post(lyf.go(this.api[apiName] , getParam) , postData).then(function(response){
        //    return response.data;
        //}));

        this.data = (this.http({'method':'post','url':lyf.go(this.api[apiName] , getParam),data:postData,'headers':{ 'Content-Type': 'application/x-www-form-urlencoded' }}).then(function(response){
            return response.data;
        }))
    }

    if( templateName == ''){
        return this.data;
    }
    this.data.then(function(d){
        scope['loadOk'] = true;
        scope[templateName] = d;
    })
}

/**
 * 初始化一些常用函数或常量
 */
ClientServer.prototype.init = function($http , $scope){
    this.http = $http;
    var api = new Array();
    api['index'] = 'AppServer/Index'
    api['flight'] = 'AppServer/Flight';
    api['travel'] = 'AppServer/Travel';
    api['user'] = 'AppServer/User';
    api['hotel'] = 'AppServer/Hotel';

    this.api = api;
    this.data = {};
    this.scope = $scope;


    /**
     * 跳转到详情页面
     * @param type
     * @param id
     * @param templateName
     * @param apiName
     */
    $scope.goToDetal = function(apiName , id , templateName , type){
        type = arguments[3] ? arguments[3] : 'travelCon';
        window.location.href = './'+type+'.html?apiName='+apiName+'&id='+id+'&templateName='+templateName+'&type='+type;
    }

    /**
     * 带登录验证的跳转
     * @param apiName
     * @param id
     * @param templateName
     * @param type
     */
    $scope.goToCheck = function(apiName , id , templateName , type){

        type = arguments[3] ? arguments[3] : 'travelCon';
        $http.get(lyf.go(api['user'] ,'checkLogin')).success(function(d){
            if(d.type == 'success' && d.data == 'ok'){
               lyf.goToServerTpl(type+'.html?apiName='+apiName+'&id='+id+'&templateName='+templateName+'&type='+type);
            }else{
                lyf.goToServerTpl('userlogin.html');

            }
        })

    }


    /**
     * 更新表单值
     * @param name
     * @param value
     */
    $scope.update = function (name, value) {
        $scope[name] = value;
    }


    /**
     * 切换模板
     * @param tplName
     * @param way 方法，如修改登录密码
     */
    $scope.changeTpl = function(tplName , way){
        $scope.lastTplName = $scope.tplName;
        $scope.tplName = tplName;

        if(arguments[1]){
            $scope.btn = way;
        }
    }

    /**
     * 切换到上个模板
     */
    $scope.goToLastTpl = function(){
        $scope.tplName = $scope.lastTplName;
    }


    $scope.goToServer = function(name){
        lyf.goToServerTpl(name);
    }

}







