/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-12 19:18:41 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-22 19:48:33
 */
const nhURL = 'https://nhentai.net/g/';
const nhHost = 'https://nhentai.net';
//const nhImgURL = 'https://i.nhentai.net/galleries/';

const cheerio = require('cheerio');
const GetHtml = require('./gethtml');
const NHResult = require('../class/nhresult');
const NHResponse = require('../class/nhresponse');
const NHSql = require('./nhsql');

var enable_cache = global.nhconfig.enable_cache;

/**
 * 给定本子id，得到本子URL
 * 
 * @param {number} gid 本子id
 * @returns 本子URL
 */
function gidToUrl(gid) {
	return 'https://nhentai.net/g/' + gid + '/';
}


/**
 * 给定一个含有多个本子的结果页，得到所有本子的链接
 * 
 * @param {string} url 结果页地址
 * @returns 本子链接数组
 */
async function getHrefsFromPage(url) {
	var html;
	await GetHtml.get(url).then(nhhtml => {
		html = nhhtml;
	});
	var $ = cheerio.load(html, {
		decodeEntities: false
	});

	var hrefs = [];
	var as = $('.cover');
	for (var i = 0; i < as.length; i++) {
		hrefs.push(nhHost + $(as[i]).attr('href'));
	}
	return hrefs;
}


/**
 * 对一个nhentai本子页进行解析
 * 
 * @param {number} gid 本子id
 * @param {NHSql} [nhsql=(enable_cache ? new NHSql : null)] NHSql对象
 * @param {boolean} [autoCloseSql=true] 是否自动关闭数据库连接（用于提升批量解析效率）
 * @returns 这个网页的本子的解析结果
 */
async function nhResolve(gid, nhsql = (enable_cache ? new NHSql : null), autoCloseSql = true) {
	//先看看数据库有缓存没
	if (enable_cache) {
		var cache;
		await nhsql.getCache(gid).then(nhr => {
			cache = nhr;
			if (autoCloseSql) nhsql.close();
		});
		if (cache.isValid()) {
			cache.cache = true;
			return cache;
		}
	}

	//获取本子页html内容
	var html;
	await GetHtml.get(gidToUrl(gid)).then(async nhhtml => {
		html = nhhtml;
	});

	var nhReg = /\/([0-9]+)\//g;
	var $ = cheerio.load(html, {
		decodeEntities: false
	});

	//获取本子信息
	var tittle1 = $('#info h1').html();
	var tittle2 = $('#info h2').html();
	var pages = $('#thumbnail-container .thumb-container').length;

	//提取tag
	var tags = {};
	$('.tag .count').remove();
	var tag_containers = $('#tags .tag-container.field-name:not(.hidden)');
	for (var i = 0; i < tag_containers.length; i++) {
		var tag_container = $($(tag_containers)[i]);
		var tags_span = tag_container.find('.tag');
		//tag成员
		var tags_group_array = Array();
		for (var j = 0; j < tags_span.length; j++) {
			tags_group_array.push($($(tags_span)[j]).html().replace(/[^a-zA-Z ]|( $)/g, ''));
		}
		tag_container.children('.tags').remove();
		//tag标题
		var tag_group_name = tag_container.html().replace(/[^a-zA-Z ]|( $)/g, '');
		tags[tag_group_name] = tags_group_array;
	}

	var baseURL = $($('#thumbnail-container .thumb-container img')[0]).attr('data-src');
	var searchRes = nhReg.exec(baseURL);
	var nhImgID = parseInt(searchRes[0].replace(/\//g, ''));

	var result = new NHResult(gid, tittle1, tittle2, tags, pages, nhImgID);

	//缓存至数据库
	if (enable_cache) {
		nhsql = new NHSql();
		await nhsql.addCache(gid, result).then(() => {
			if (autoCloseSql) nhsql.close;
		});
		result.cache = false;
	}

	return result;
}


/**
 * 进行单次解析
 * 
 * @param {number} gid 本子id
 * @param {boolean} withResponse 是否套上专用response
 * @returns 单个解析结果
 */
exports.single = async (gid, withResponse) => {
	if (typeof gid != "number") gid = parseInt(gid);
	var response;
	var result;
	//获取解析结果
	await nhResolve(gid).then(r => {
		result = r;
	});
	if (withResponse) {
		var code = 0;
		//无效结果返回错误代码
		if (!result.isValid()) {
			code = 11;
		}
		//创建返回json
		response = new NHResponse(code, result);
	} else {
		response = result;
	}

	return response;
};


/**
 * 进行批量解析
 * 
 * @param {string} url 含有多个本子的页面链接
 * @param {boolean} withResponse 是否套上专用response
 * @returns 解析结果数组
 */
exports.multi = async (url, withResponse) => {
	var results = Array();
	var hrefs;
	//获取本子页所有链接
	await getHrefsFromPage(url).then(nhhrefs => {
		hrefs = nhhrefs;
	});

	//对每个链接都进行解析
	var nhsql = new NHSql();
	for (var href of hrefs) {
		var nhReg = /\/([0-9]+)\//g;
		var gid = parseInt(nhReg.exec(href)[1]);
		await nhResolve(gid, nhsql, false).then(r => {
			results.push(r);
		})
	}
	nhsql.close();

	if (withResponse) {
		//检测结果完整性
		var check = 0;
		for (var result of results) {
			if (!result.isValid()) {
				check++;
			}
		}

		var code = 0;
		//结果完全无效&部分无效
		if (check == results.lengh) {
			code = 11;
		} else if (check > 0) {
			code = 10;
		}
		return new NHResponse(code, results);
	} else {
		return results;
	}
};
