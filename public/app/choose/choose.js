var myApp = angular.module("myApp", ['ui.router']);

myApp.controller("chooseCtrl", function ($scope, $state, $http,$rootScope,popService,$timeout,$window,$ionicPopup) {

    $rootScope.needData.bottomTitle = '进入图集';
    $rootScope.needData.leftTop = false ;

    var mySwiper = new Swiper('.swiper-container', {
        // autoplay: true,//可选选项，自动滑动
        // initialSlide:0, //默认index
        direction : 'horizontal',
        roundLengths : true,//设定为true将slide的宽和高取整(四舍五入)以防止某些分辨率的屏幕上文字或边界(border)模糊。
        preloadImages:false,//默认为true，Swiper会强制加载所有图片。
        init:true, // 初始化
        // zoom : true,//调节焦点
        observer:true,
        runCallbacksOnInit : true,
        // autoHeight:true,
        // effect : 'flip',
        on: {
            touchEnd: function(event){
                //你的事件
                if(mySwiper.isEnd && mySwiper.touches.diff<-150) {
                    // alert('aaaa')
                }
                    // console.log(mySwiper)
            },
            slideChangeTransitionEnd: function(){
                // alert(this.activeIndex);//切换结束时，告诉我现在是第几个slide
                // console.log(this)
                $rootScope.selData.selAtlas = $rootScope.mList[this.activeIndex];
                $rootScope.title =  $rootScope.selData.selAtlas.title;
                $rootScope.needData.bottomRight =  $rootScope.selData.selAtlas.isPraise;
                $rootScope.$apply();
            },
        }
    });

    // mySwiper.init();

    if(!$rootScope.selData.selAtlas.title){
        $rootScope.selData.selAtlas = $rootScope.mList[0] ;
    }
    else{
        $rootScope.needData.bottomRight = $rootScope.selData.selAtlas.isPraise;
    }

    $rootScope.title =  $rootScope.selData.selAtlas? $rootScope.selData.selAtlas.title:$rootScope.mList[0].title;

    $rootScope.home = ()=>{
        history.back();
    }

    //双击图片
    $scope.change = (x)=>{
        // alert(JSON.stringify(x));
        // $rootScope.praise();
    }

    //点击爱心
    $rootScope.praise = ()=>{

        // console.log($rootScope.selData.selAtlas)

        if( $rootScope.selData.selAtlas.isPraise){

            var alertPopup = $ionicPopup.alert({
                title: '启禀陛下',
                template: '您已经顶过这位爱妃了！'
            });
            //确定之后
            alertPopup.then(function(res) {
                // console.log('Thank you for not eating my delicious ice cream cone');
            });

            return;
        }

        for(var i=0;i< $rootScope.mList.length;i++){
            if( $rootScope.selData.selAtlas.mid == $scope.mList[i].mid){
                $rootScope.mList[i].isPraise = true ;
                $rootScope.needData.bottomRight = $rootScope.mList[i].isPraise;
            }
        }

    }

    $rootScope.goList = ()=>{
        // alert(JSON.stringify($rootScope.selData.selAtlas));

        if($rootScope.selData.selAtlas.child.length <= 0){
            var alertPopup = $ionicPopup.alert({
                title: '启禀陛下',
                template: '这个爱妃只有这一张图哟！'
            });
            //确定之后
            alertPopup.then(function(res) {
                // console.log('Thank you for not eating my delicious ice cream cone');
            });
            return ;
        }

        $state.go('cList');
    }
        // <div class="swiper-slide"><img src="../images/timg6.jpg"/></div>
        // <div class="swiper-slide"><img src="../images/timg2.jpg"/></div>
        // <div class="swiper-slide"><img src="../images/timg7.jpg"/></div>

    // $http.post('api/jtlist/getScenicList').success(function (result) {
    //     // console.log(result);
    //     if (result.respCode != 'undefined' && result.respCode == '00') {
    //         for(var i=0;i<result.data.poiData.data.length;i++){
    //             if(result.data.poiData.data[i].poiName.length >= 13){
    //                 result.data.poiData.data[i].poiName = result.data.poiData.data[i].poiName.substring(0,13)+'...';
    //             }
    //         }
    //         $rootScope.oList = result.data.oList;
    //         $rootScope.result = result.data.poiData.data;
    //     }
    //     else {
    //         popService.winTip(result.respMsg,1);
    //         // $state.go('err', {respMsg: result.respMsg});
    //     }
    // });


})





