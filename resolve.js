var cheerio = require('cheerio');
var nhURL = 'https://nhentai.net/g/';
var nhHost = 'https://nhentai.net';
//var nhImgURL = 'https://i.nhentai.net/galleries/';
var nhReg = /\/([0-9]+)\//g;

var retry = 5;

//对本子页html解析
function nhResolve(html) {
    $ = cheerio.load(html, {
        decodeEntities: false
    });
    //获取信息
    var tittle1 = $('#info h1').html();
    if (tittle1 === null) {
        return null;
    }
    var tittle2 = $('#info h2').html();
    var pages = $('#thumbnail-container .thumb-container').length;
    //获取本子BaseURL
    var baseURL = $($('#thumbnail-container .thumb-container img')[0]).attr('data-src');
    var searchRes = nhReg.exec(baseURL);
    var nhImgID = 0;
    if (searchRes !== null) {
        nhImgID = searchRes[0].replace(/\//g, '');
    } else {
        return null;
    }

    //返回结果
    var bResult = {
        tittle1: tittle1,
        tittle2: tittle2,
        pages: pages,
        imgID: nhImgID
    };
    console.log(bResult);
    return bResult;
}

//批量解析递归函数
function nhResolveBatchUnit(hrefs,i,results,callback){
    var nhHttp = require('https');
    //所有都解析完了就执行回调
    if(i >= hrefs.length){
        if (callback && typeof(callback) === "function") {
            callback();
        }
        return;
    }
    nhHttp.get(hrefs[i], function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        res.on('end', function() {
            var tempResult = nhResolve(html);
            for(var j=0;j<retry && tempResult === null;j++){
                tempResult = nhResolve(html);
            }
            if(tempResult === null){
                nhResolveBatchUnit(hrefs,i,results,callback);
            }else{
                //储存解析结果
                results.push(tempResult);
                //递归继续解析
                nhResolveBatchUnit(hrefs,i+1,results,callback);
            }
        });
    });
}

//批量解析
function nhResolveBatch(html,results,callback){
    $ = cheerio.load(html, {
        decodeEntities: false
    });
    var hrefs = [];
    var as = $('.cover');
    for(var i=0;i<as.length;i++){
        hrefs.push(nhHost + $(as[i]).attr('href'));
    }
    nhResolveBatchUnit(hrefs,0,results,function(){
        if (callback && typeof(callback) === "function") {
            callback();
        }
    });
}

//单次解析
exports.single = function(gid,callback) {
    console.log("Single resolving...");
    //获取网页内容
    var nhHttp = require('https');
    nhHttp.get(nhURL + gid + '/', function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        //将解析结果传给回调函数
        res.on('end', function() {
            console.log("Done.");
            if (callback && typeof(callback) === "function") {
                var tempResult = nhResolve(html);
                for(var j=0;j<retry && tempResult === null;j++){
                    tempResult = nhResolve(html);
                }
                callback(tempResult);
            }
        });
    });
};

//批量解析
exports.multi = function(weburl,callback) {
    //结果数组
    var bResults = Array();
    //获取网页内容
    var nhHttp = require('https');
    nhHttp.get(weburl, function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        //将解析结果传给回调函数
        res.on('end', function() {
            if (callback && typeof(callback) === "function") {
                nhResolveBatch(html,bResults,function(){
                    callback(bResults);
                });
            }
        });
    });
};