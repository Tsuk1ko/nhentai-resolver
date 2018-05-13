/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-13 13:39:00 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-13 20:01:26
 */
const Koa = require('koa');
const app = new Koa();

const NHsql = require('./model/nhsql');
const NHResponse = require('./class/nhresponse');
const nhentai = require('./model/resolve');
const NHConfig = require('./config');

//数据库测试
if(NHConfig.enable_cache){
	NHsql.test();
}

app.use(async ctx => {
	//计时
	var st = Date.now();
	//query
	var query = ctx.query;
	//默认返回的json
	var response = new NHResponse();
	response.msg.text = "Invalid query! Please see https://github.com/YKilin/nhentai-resolution";

	if (query !== null) {
		var gid = query.gid;
		var url = query.url;

		if (typeof (gid) !== "undefined") {
			await nhentai.single(gid, true).then(nhr => {
				response = nhr;
				response.msg.time = Date.now() - st;
			});
		} else if (typeof (url) !== "undefined") {
			await nhentai.multi(url, true).then(nhr => {
				response = nhr;
				response.msg.time = Date.now() - st;
			});
		}
	}
	ctx.body = response;
});

app.listen(NHConfig.port);
