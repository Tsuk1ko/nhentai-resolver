var cheerio = require('cheerio');
var nhHttp = require('https');
var nhURL = 'https://nhentai.net/g/';
var nhHost = 'https://nhentai.net';
//var nhImgURL = 'https://i.nhentai.net/galleries/';
var nhReg = /\/([0-9]+)\//g;

var bResults = [];

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
    //console.log(baseURL);
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
    return bResult;
}

//批量解析递归函数
function nhResolveBatchUnit(hrefs,i,callback){
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
            //console.log(hrefs[i]);
            var tempResult = nhResolve(html);
            for(var j=0;j<10 && tempResult === null;j++){
                tempResult = nhResolve(html);
            }
            if(tempResult === null){
                nhResolveBatchUnit(hrefs,i,callback);
            }else{
                //储存解析结果
                bResults.push(tempResult);
                //递归继续解析
                nhResolveBatchUnit(hrefs,i+1,callback);
            }
        });
    });
}

//批量解析
function nhResolveBatch(html,callback){
    $ = cheerio.load(html, {
        decodeEntities: false
    });
    var hrefs = [];
    var as = $('.cover');
    for(var i=0;i<as.length;i++){
        hrefs.push(nhHost + $(as[i]).attr('href'));
    }
    nhResolveBatchUnit(hrefs,0,function(){
        if (callback && typeof(callback) === "function") {
            callback();
        }
    });
}

//单次解析
exports.single = function(gid,callback) {
    //获取网页内容
    nhHttp.get(nhURL + gid + '/', function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        //将解析结果传给回调函数
        res.on('end', function() {
            if (callback && typeof(callback) === "function") {
                callback(nhResolve(html));
            }
        });
    });
};

//批量解析
exports.multi = function(weburl,callback) {
    //获取网页内容
    nhHttp.get(weburl, function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        //将解析结果传给回调函数
        res.on('end', function() {
            if (callback && typeof(callback) === "function") {
                nhResolveBatch(html,function(){
                    callback(bResults);
                });
            }
        });
    });
};