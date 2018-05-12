/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-12 19:31:16 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-13 01:02:42
 */

/**
 * nhentai解析结果
 * 
 * @class NHResult
 */
class NHResult {
	constructor(gid = 0, tittle1 = null, tittle2 = null, pages = 0, iid = 0) {
		this.gid = gid;
		this.tittle1 = tittle1;
		this.tittle2 = tittle2;
		this.pages = pages;
		this.iid = iid;
	}
	isValid() {
		return this.gid > 0 && this.tittle1 !== null && this.tittle2 !== null && this.pages > 0 && this.iid > 0;
	}
}

module.exports = NHResult;
