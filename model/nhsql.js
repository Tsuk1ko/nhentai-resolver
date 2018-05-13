/*
 * @Author: JindaiKirin 
 * @Date: 2018-05-13 15:38:11 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-05-13 19:49:50
 */
const NHResult = require('../class/nhresult');
const NHConfig = require('../config');

//数据库表名
const reslove_db = 'resolutions';

/**
 * 数据库操作
 * 
 * @class NHsql
 */
class NHsql {
	constructor() {
		this.co = require('co');
		this.mysql = require('mysql-co').createConnection({
			host: NHConfig.mysql_host,
			database: NHConfig.mysql_database,
			user: NHConfig.mysql_user,
			password: NHConfig.mysql_passwd
		});
	}

	/**
	 * 增加解析缓存
	 * 
	 * @param {any} gid 本子id
	 * @param {any} obj 缓存对象
	 * @returns Promise
	 * @memberof NHsql
	 */
	addCache(gid, obj) {
		return this.co(function* () {
			yield this.mysql.query('INSERT IGNORE INTO `' + reslove_db + '` (`gid`, `data`) VALUES (?, ?)', [gid, JSON.stringify(obj)]);
		});
	}

	/**
	 * 获取解析缓存
	 * 
	 * @param {any} gid 本子id
	 * @returns 缓存对象，如果没有找到缓存，则返回的是一个非法的缓存对象
	 * @memberof NHsql
	 */
	getCache(gid) {
		return this.co(function* () {
			var que = yield this.mysql.query('SELECT * from `' + reslove_db + '` WHERE gid=?', [gid]);
			var rq = que[0];
			if (rq.length > 0) {
				return NHResult.getFromDB(rq[0].data);
			}
			return new NHResult();
		});
	}

	/**
	 * 关闭数据库连接
	 * 
	 * @memberof NHsql
	 */
	close() {
		this.mysql.end();
	}

	/**
	 * 测试是否有数据库和表，没有表会自动新建
	 * 
	 * @static
	 * @returns Promise
	 * @memberof NHsql
	 */
	static test() {
		var mysql = require('mysql-co').createConnection({
			host: NHConfig.mysql_host,
			database: NHConfig.mysql_database,
			user: NHConfig.mysql_user,
			password: NHConfig.mysql_passwd
		});
		var co = require('co');
		return co(function* () {
			yield mysql.query('CREATE TABLE IF NOT EXISTS `' + reslove_db + '` ( `gid` INT NOT NULL , `data` TEXT NOT NULL , `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`gid`)) ENGINE = InnoDB;');
		});
	}
}

module.exports = NHsql;
