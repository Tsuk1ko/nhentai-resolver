const Koa = require('koa');
const app = new Koa();

const NHResponse = require('./class/nhresponse');
const nhentai = require('./model/resolve');

app.use(async ctx => {
	//计时
	var st = Date.now();
	//query
	var query = ctx.query;
	//返回json
	var response = new NHResponse();

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

app.listen(8888);
