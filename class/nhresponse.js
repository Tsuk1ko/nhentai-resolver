/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-12 22:29:39 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-13 02:09:35
 */

/**
 * nhentai返回json
 * 
 * @class NHRespense
 */
class NHRespense {
	constructor(code = 20, results = null) {
		this.code = code;
		this.time = 0;
		this.results = Array.isArray(results) ? results : [results];
	}
	setTime(time) {
		this.time = time;
	}
}

module.exports = NHRespense;
