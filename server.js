var httpServer = require('http');
var nh = require('./resolve');
var url = require('url');
var util = require('util');
var data = {
    error: 1,
    msg: '参数不合法',
    results: []
};

//服务器监听
httpServer.createServer(function(serverReq, serverRes) {
    var params = url.parse(serverReq.url, true).query;
    var gid = params.gid;
    var nhUrl = params.url;
    //设置返回header
    serverRes.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
    });
    if(typeof(gid) !== "undefined"){
        if (gid.match(/[0-9]+/) !== null){
            //解析
            nh.single(gid,function(result){
                if(result !== null){
                    data = {
                        error: 0,
                        msg: '成功',
                        results: [result]
                    };
                    serverRes.end(JSON.stringify(data));
                }
            });
        }else{
            serverRes.end(JSON.stringify(data));
            return;
        }
    }else if(typeof(nhUrl) !== "undefined"){
        //解析
        nh.multi(nhUrl,function(results){
            data = {
                error: 0,
                msg: '成功',
                results: results
            };
            serverRes.end(JSON.stringify(data));
        });
    }else{
        serverRes.end(JSON.stringify(data));
        return;
    }
}).listen(8888);