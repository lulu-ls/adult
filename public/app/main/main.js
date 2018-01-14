var myApp = angular.module("myApp", ['ui.router']);

myApp.controller("mainCtrl", function ($scope, $state, $http,$rootScope,popService,$timeout) {

    $scope.mainShow = false ;
    $rootScope.needData.leftTop = true ;
    $scope.images = [
        {
            src:'../images/timg1.jpg',
            // text:'<b><span class="myclass">没有人会喜欢，没有人去爱</span></b>',
            url:''
        }
    ];

    var progress = $.AMUI.progress;

    progress.start();

    $timeout(function () {
        $scope.mainShow = true ;
        // $scope.$apply();
        progress.done();
    },0);

    $rootScope.mList = [
        {mid:0,title:'test0',mPraiseNum:1,mSrc:'../images/timg6.jpg',description:'test000',
            child:[
                {
                    cid:0,cSrc:'../images/timg(10).jpg',cPraiseNum:1
                },
                {
                    cid:1,cSrc:'../images/timg(11).jpg',cPraiseNum:1
                },
                {
                    cid:2,cSrc:'../images/timg(12).jpg',cPraiseNum:1
                },
                {
                    cid:3,cSrc:'../images/timg(13).jpg',cPraiseNum:1
                },
                {
                    cid:4,cSrc:'../images/timg(14).jpg',cPraiseNum:1
                }
            ]
        },
        {mid:1,title:'test1',praiseNum:1,mSrc:'../images/timg2.jpg',description:'test001',
            child:[
                {
                    cid:5,cSrc:'../images/timg(15).jpg',cPraiseNum:1
                },
                {
                    cid:6,cSrc:'../images/timg(16).jpg',cPraiseNum:1
                },
                {
                    cid:7,cSrc:'../images/timg(17).jpg',cPraiseNum:1
                },
                {
                    cid:8,cSrc:'../images/timg(18).jpg',cPraiseNum:1
                },
                {
                    cid:9,cSrc:'../images/timg(19).jpg',cPraiseNum:1
                },
            ]
        },
        {mid:2,title:'test2',praiseNum:1,mSrc:'../images/timg7.jpg',description:'test002',
            child:[
                {
                    cid:10,cSrc:'../images/timg(20).jpg',cPraiseNum:1
                },
                {
                    cid:11,cSrc:'../images/timg(21).jpg',cPraiseNum:1
                },
                {
                    cid:12,cSrc:'../images/timg(22).jpg',cPraiseNum:1
                }
            ]
        }
    ];

    $rootScope.home = ()=>{
        alert('home');
    }

    $scope.goChoose=()=>{
        $state.go('choose');
    }

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





