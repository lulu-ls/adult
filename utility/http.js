var http = require('http'),
    httpProxy = require('http-proxy'),
    request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//
// Create a proxy server with custom application logic
//
app.use("/",function (req,res,next) {
    console.log(req.body);
    request({
        url:'http://p-api.eticket.juntu.com/'+req.url,
        method: "POST",
        form: req.body
    },function (error, response, body) {
        console.log("error:"+JSON.stringify(error));
        // console.log("response:"+JSON.stringify(response));
        console.log("body:"+JSON.stringify(body));

        // logger(
        //     "time"+new Date()+"type:" + option.type + " path:" + option.path+"\r\n"
        //     +"请求:" + JSON.stringify(reqData)+"\r\n"
        //     +"应答:" +JSON.stringify(body)  +"\r\n"
        // );

        if (error) {
            res.send(error);
            res.end;
            return;
        }
        try{
            res.send(JSON.parse(body));
            res.end;
            return;
        }
        catch(e){
            res.send(body);
            res.end;
            return;
        }
    });
});
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen("5050");
// var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
// var server = http.createServer(function(req, res) {
//     // You can define here your custom logic to handle the request
//     // and then proxy the request.
//     // proxy.web(req, res, { target: 'http://p-api.eticket.juntu.com' });
//     request({
//         url:'http://p-api.eticket.juntu.com/'+req.url,
//         method: "POST",
//         form: req.body
//     },function (error, response, body) {
//         console.log("error:"+JSON.stringify(error));
//         console.log("response:"+JSON.stringify(response));
//         console.log("body:"+JSON.stringify(body));
//         // logger(
//         //     "time"+new Date()+"type:" + option.type + " path:" + option.path+"\r\n"
//         //     +"请求:" + JSON.stringify(reqData)+"\r\n"
//         //     +"应答:" +JSON.stringify(body)  +"\r\n"
//         // );
//
//         if (error) {
//             return res.json(errCode.unknown(error.message));
//         }
//         try{
//             res.json(null,JSON.parse(body));
//         }
//         catch(e){
//             res.json(errCode.unknown(body));
//         }
//     });
// });
//
// console.log("listening on port 5050")
// server.listen(5050);