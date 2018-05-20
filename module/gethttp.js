/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-12 19:55:37 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-13 01:03:54
 */

/**
 * 根据url获取网页内容
 * 
 * @param {string} url 网页地址
 * @returns Promise
 */
function getHttps(url) {
	return new Promise((resolve, reject) => {
		//获取网页内容
		var https = require('https');
		https.get(url, res => {
			var html = '';
			//累加接收到的网页数据
			res.on('data', data => {
				html += data;
			});
			//将网页内容传回
			res.on('end', () => {
				resolve(html);
			});
			//错误
			res.on('error', e => {
				console.error(e);
				reject();
			})
		});
	});
}

exports.https = getHttps;
