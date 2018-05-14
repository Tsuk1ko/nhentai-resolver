/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-13 13:39:00 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-15 02:50:50
 */
const Koa = require('koa');
const app = new Koa();

const NHResolver = require('./nhresolver');
NHResolver.init('./config');

app.use(async ctx => {
	//计时
	var st = Date.now();
	//query
	var query = ctx.query;
	//默认返回的json
	var response = NHResolver.getDefaultResponse();
	response.msg.text = "Invalid query! Please see https://github.com/YKilin/nhentai-resolution";

	if (query !== null) {
		var gid = query.gid;
		var url = query.url;

		if (typeof (gid) !== "undefined") {
			await NHResolver.byGid(gid, true).then(nhr => {
				response = nhr;
				response.msg.time = Date.now() - st;
			});
		} else if (typeof (url) !== "undefined") {
			await NHResolver.byUrl(url, true).then(nhr => {
				response = nhr;
				response.msg.time = Date.now() - st;
			});
		}
	}
	ctx.body = response;
});

app.listen(global.nhconfig.port);
