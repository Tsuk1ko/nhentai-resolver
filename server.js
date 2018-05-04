var httpServer = require('http');

//服务器监听
httpServer.createServer(function(serverReq, serverRes) {
    //requires
    var url = require('url');
    if(url.parse(serverReq.url).path=='/favicon.ico')
        return;
    var nh = require('./resolve');
    //start
    var data = {
        error: 1,
        msg: '参数不合法',
        results: []
    };
    var params = url.parse(serverReq.url, true).query;
    var gid = params.gid;
    var nhUrl = params.url;
    //设置返回header
    serverRes.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
    });
    if(typeof(gid) !== "undefined"){
        console.log("Get gid "+gid);
        if (gid.match(/[0-9]+/) !== null){
            //解析
            nh.single(gid,function(result){
                if(result !== null){
                    data = {
                        error: 0,
                        msg: '成功',
                        results: [result]
                    };
                }else{
                    data = {
                        error: 2,
                        msg: '无解析结果',
                        results: [result]
                    };
                }
                serverRes.end(JSON.stringify(data));
            });
        }else{
            serverRes.end(JSON.stringify(data));
        }
    }else if(typeof(nhUrl) !== "undefined"){
        console.log("Get url "+nhUrl);
        //解析
        nh.multi(nhUrl,function(results){
            if(results.length>0){
                data = {
                    error: 0,
                    msg: '成功',
                    results: results
                };
            }else{
                data = {
                    error: 2,
                    msg: '无解析结果',
                    results: results
                };
            }
            serverRes.end(JSON.stringify(data));
        });
    }else{
        console.log("Get noting.");
        serverRes.end(JSON.stringify(data));
    }
}).listen(8888);