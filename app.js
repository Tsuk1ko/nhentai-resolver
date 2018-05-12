const Koa = require('koa');
const app = new Koa();

const NHResponse = require('./class/nhresponse');
const nhentai = require('./model/resolve');

app.use(async ctx => {
	//query
	var query = ctx.query;
	//返回json
	var response = new NHResponse();
	
	if (query !== null) {
		var gid = query.gid;
		var url = query.url;

		if (typeof (gid) !== "undefined") {
			await nhentai.single(gid).then(nhr => {
				response = nhr;
			});
		} else if (typeof (url) !== "undefined") {
			await nhentai.multi(url).then(nhr => {
				response = nhr;
			});
		}
	}
	ctx.body = response;
});

app.listen(8888);
