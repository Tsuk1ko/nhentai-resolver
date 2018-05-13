/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-12 19:31:16 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-13 19:34:03
 */

/**
 * nhentai解析结果
 * 
 * @class NHResult
 */
class NHResult {
	constructor(gid = 0, tittle1 = null, tittle2 = null, tags = null, pages = 0, iid = 0) {
		this.gid = gid;
		this.tittle1 = tittle1;
		this.tittle2 = tittle2;
		this.tags = tags;
		this.pages = pages;
		this.iid = iid;
		this.cover = 'https://t.nhentai.net/galleries/' + iid + '/cover.jpg';
	}
	isValid() {
		return this.gid > 0 && this.tittle1 !== null && this.tittle2 !== null && this.pages > 0 && this.iid > 0;
	}
	static getFromDB(str) {
		var obj = JSON.parse(str);
		return new NHResult(obj.gid, obj.tittle1, obj.tittle2, obj.tags, obj.pages, obj.iid);
	}
}

module.exports = NHResult;
