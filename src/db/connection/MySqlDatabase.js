const AWSXRay = require('aws-xray-sdk-core');
const captureMySQL = require('aws-xray-sdk-mysql');
const MySqlDb = captureMySQL(require('mysql'));
//const MySqlDb = require('mysql');
const Util = require('util');
const BusinessError = require('../../models/domain/BusinessError');
const HttpConstants = require('../../constants/HttpConstants');
const ObjectMapper = require('../../helpers/ObjectMapper');
const ErrorConstants = require('../../constants/ErrorConstants');


class MySqlDatabase {
  static async createPool(dbconfig) {
    const poolConnection = MySqlDb.createPool(dbconfig);
    poolConnection.query = Util.promisify(poolConnection.query);
    poolConnection.end = Util.promisify(poolConnection.end);
    return poolConnection;
  }

  static async closePool(poolConnection) {
    try {
      if (poolConnection) {
        await poolConnection.end();
      }
    } catch (error) {
      console.error(error);
      throw new BusinessError({
        code: ErrorConstants.DB_ERROR.code,
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: [error.sqlMessage],
      });
    }
  }

  static async executeSQL(sql, bindParams, target, pool) {
    try {
      console.log("sql --> " +sql)
      console.log("bindParams --> " +bindParams)
      console.log("pool --> " +pool)
      //console.log("pool 22 --> " +JSON.stringify(pool))
      
      const result = await pool.query(
        sql, [bindParams]
      );

      console.log("result --> " +result.length)
      const data = result;
      const list = [];
      for (let i = 0, size = data.length; i < size; i += 1) {
        list.push(ObjectMapper.map(data[i], target));
      }
      return list;
    } catch (error) {
      console.log("errrrrror")
      console.error(error);
      throw new BusinessError({
        code: ErrorConstants.DB_ERROR.code,
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: error.sqlMessage,
      });
    }
  }
}

module.exports = MySqlDatabase;
