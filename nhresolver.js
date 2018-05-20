/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-15 00:08:55 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-20 15:28:40
 */
const NHResponse = require('./class/nhresponse');

/**
 * nhentai初始化&解析
 * 
 * @class NHResolver
 */
class NHResolver {
	/**
	 * 初始化
	 * 
	 * @static
	 * @param {string} config_path 配置文件路径
	 * @memberof NHResolver
	 */
	static init(config_path) {
		global.nhconfig = require(config_path);

		this.NHSql = require('./module/nhsql');
		this.NHResolve = require('./module/resolve');

		//数据库测试
		if (global.nhconfig.enable_cache) {
			this.NHSql.test();
		}
	}

	/**
	 * 根据gid解析单个本子
	 * 
	 * @static
	 * @param {number} gid 本子id
	 * @param {boolean} [withResponse=false] 是否用Response封装
	 * @returns (Promise) 单个解析结果或结果的Response封装
	 * @memberof NHResolver
	 */
	static byGid(gid, withResponse = false) {
		return this.NHResolve.single(gid, withResponse);
	}

	/**
	 * 根据url解析多个本子
	 * 
	 * @static
	 * @param {number} url 含有多本子的url
	 * @param {boolean} [withResponse=false] 是否用Response封装
	 * @returns (Promise) 解析结果数组或结果的Response封装
	 * @memberof NHResolver
	 */
	static byUrl(url, withResponse = false) {
		return this.NHResolve.multi(url, withResponse);
	}

	/**
	 * 获取默认Response
	 * 
	 * @static
	 * @returns 默认Response
	 * @memberof NHResolver
	 */
	static getDefaultResponse() {
		return new NHResponse();
	}
}

module.exports = NHResolver;
