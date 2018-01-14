/**
 * Created by Administrator on 2017/6/2.
 */
var express = require('express');
var router = express.Router();

router .get('/',function (req,res,next) {
    res.render('index',{title:'欢迎'});
});

module.exports = router;
