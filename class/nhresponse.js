/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-12 22:29:39 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-13 11:11:14
 */

/**
 * nhentai返回json
 * 
 * @class NHRespense
 */
class NHRespense {
	constructor(code = 20, results = null) {
		this.code = code;
		this.msg = {};
		this.results = Array.isArray(results) ? results : [results];
	}
}

module.exports = NHRespense;
