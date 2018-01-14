angular.module('app').controller('loginCtrl', function ($rootScope,$scope,$location,$http,$interval,popService) {

    $scope.codeTxt = '获取验证码';
    $scope.codeDisabled = false;

    $scope.getCode=function(type){
        if($scope.codeDisabled) return;
        var i=60;
        if($rootScope.user.phone.length==11 && $rootScope.user.phone.substr(0,1)==1){
            $scope.codeDisabled=true;
            var path="/api/login/smsCode?name=";
            if(type==2) path="/api/login/voiceCode?name=";


            $http.get(path+$rootScope.user.phone).
            success(function(data, status) {

                if(data.respCode=="00"){
                    $interval(function(){
                        $scope.codeTxt='('+i+'秒)';
                        i--;
                        if(i==0){
                            $scope.codeTxt='获取验证码';
                            $scope.codeDisabled=false;
                        }
                    },1000,60);
                }else{
                    $scope.codeDisabled=false;
                }
                popService.popTip(data.respMsg);
            }).
            error(function(data, status) {
                $scope.codeDisabled=false;
            });
        }
        else{
            if($rootScope.user.phone.length==0){
                popService.popTip("请输入手机号码");
            }
            else{
                popService.popTip("您输入的手机号码格式不正确");
            }
        }
    };


    $scope.login = function() {


        if($rootScope.user.phone.length==11 && $rootScope.user.phone.substr(0,1)==1 && $rootScope.user.loginCode.length>0){


            $http.get("/api/login/confirm?phone="+$rootScope.user.phone+"&code="+$rootScope.user.loginCode).
            success(function(data, status) {
                if(data.respCode=="00"){
                    location.href = data.oriUrl || "/list";
                }
                else {
                    popService.popTip(data.respMsg);
                }
            });
        }
        else{
            if($rootScope.user.phone.length==0){
                popService.popTip("请输入手机号码");
            }
            else{
                if($rootScope.user.loginCode.length==0){
                    popService.popTip("请输入验证码");
                }
                else{
                    popService.popTip("您输入的手机号码格式不正确");
                }
            }
        }
    };
});

