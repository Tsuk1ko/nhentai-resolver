/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-12 19:55:37 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-22 19:46:52
 */

const request = require('request');

/**
 * 根据url获取网页内容
 * 
 * @param {string} url 网页地址
 * @returns Promise
 */
function get(url) {
	return new Promise((resolve, reject) => {
		request.get({
			url: url
		}, (err, response, body) => {
			resolve(body);
		});
	});
}

exports.get = get;
