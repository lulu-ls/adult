var myApp = angular.module("myApp", ['ui.router']);

myApp.controller("cListCtrl", function ($scope, $state, $http,$rootScope,popService,$timeout,$window,$ionicPopup) {

    $rootScope.needData.bottomTitle = '';
    $rootScope.needData.leftTop = false ;
    var cSwiper = new Swiper('.swiper-container', {
        // autoplay: true,//可选选项，自动滑动
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
                if(cSwiper.isEnd && cSwiper.touches.diff<-150) {
                    alert('aaaa')
                }
                    // console.log(mySwiper)
            },
            slideChangeTransitionEnd: function(){
                // alert(this.activeIndex);//切换结束时，告诉我现在是第几个slide
                // console.log(this)
                $rootScope.selData.selChild = $rootScope.selData.selAtlas.child[this.activeIndex];
                // $rootScope.title = $rootScope.selAtlas.title;
                $rootScope.needData.bottomRight =  $rootScope.selData.selChild.isPraise;
                $rootScope.$apply();
            },
        }
    });

    $scope.cList = $rootScope.selData.selAtlas.child ;


    if(!$rootScope.selData.selChild.cid){
        $rootScope.selData.selChild = $rootScope.selData.selAtlas.child[0];
    }

    $rootScope.needData.bottomRight =  $rootScope.selData.selChild.isPraise;

    $rootScope.home = ()=>{
       history.back();
    }



    // cSwiper.init();
// console.log($rootScope.selData.selAtlas)

    // if(!$rootScope.selAtlas)
    //     $rootScope.selAtlas = $rootScope.mList[0] ;
    //
    // $rootScope.title = $rootScope.selAtlas?$rootScope.selAtlas.title:$rootScope.mList[0].title;

    //双击图片
    // $scope.change = (x)=>{
        // alert(JSON.stringify(x));
        // $rootScope.praise();
    // }

    //点击爱心
    $rootScope.praise = ()=>{


        if( $rootScope.selData.selChild.isPraise){

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
        for(var i=0;i< $rootScope.selData.selAtlas.child.length;i++){
            if($rootScope.selData.selAtlas.child[i].cid == $rootScope.selData.selChild.cid){
                $rootScope.selData.selAtlas.child[i].isPraise = true ;
                $rootScope.needData.bottomRight = $rootScope.selData.selAtlas.child[i].isPraise;
            }
        }

        for(var i=0;i<$rootScope.mList.length;i++){
            if($rootScope.mList[i].mid == $rootScope.selData.selAtlas.mid){
                $rootScope.mList[i] = $rootScope.selData.selAtlas ;
            }
        }

    }
    //
    $rootScope.goList = ()=>{
        return;
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





