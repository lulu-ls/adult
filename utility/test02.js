/**
 * Created by main on 2017/11/27.
 */
// function stringToHexWide(s) {
//     var result = '';
//     for (var i=0; i<s.length; i++) {
//         var b = s.charCodeAt(i);
//         if(0<=b && b<16){
//             result += '000'+b.toString(16)
//         }
//         if(16<=b && b<255){
//             result += '00'+b.toString(16)
//         }
//         if(255<=b && b<4095){
//             result += '0'+b.toString(16)
//         }
//         if(4095<=b && b<65535){
//             result += b.toString(16)
//         }
//     }
//     return result;
// };

// var aa = '6d6f62696c653d3133383235383032353830266461746174696d653d3230313731313330303933343338';
// //6d6f62696c653d3133313532303031323637266461746174696d653d3230313731313237313531343337
// var bb = 'mobile=13152001267&datatime=20171127151437';
// var bb =new Buffer(aa, 'hex').toString('utf8');
// console.log(new Buffer(bb, 'utf8').toString('hex'));
// console.log(new Buffer(aa, 'hex').toString('utf8'));
// var myString="JAVAJAVA";
// var s=bb.indexOf("=");
// var e=bb.indexOf("&");
// console.log(s);
// console.log(e);
// var ss = bb.substring(s+1,e)
// console.log(bb.substring(s+1,e));6d6f62696c653d3133383235383032353830266461746174696d653d3230313731313330303933343338
// console.log(ss == 'null');6d6f62696c653d3133383235383032353830266461746174696d653d3230313731313330303933343338

// console.log('6d6f62696c653d3133383235383032353830266461746174696d653d3230313731313330303933343338' == '6d6f62696c653d3133383235383032353830266461746174696d653d3230313731313330303933343338')
// console.log(console.log(new Buffer('eyJ0IjoxNTE0NzY0ODAwLCJkIjoxMTE2OTQsImEiOiJ7XCI0OTRcIjo1MH0ifQ==', 'base64').toString('utf8')))

// var aa = 'aa,vvv'
// var bb = 'aa'
// console.log(bb.split(','));