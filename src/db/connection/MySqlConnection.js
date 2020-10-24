const AWSXRay = require('aws-xray-sdk-core');
const captureMySQL = require('aws-xray-sdk-mysql');
const MySqlDb = captureMySQL(require('mysql'));
//const MySqlDb = require('mysql');

//const Logger = require('../helpers/LoggerUtils');
const BusinessError = require('../../models/domain/BusinessError');
const HttpConstants = require('../../constants/HttpConstants');
const ObjectMapper = require('../../helpers/ObjectMapper');
const ErrorConstants = require('../../constants/ErrorConstants');

/**
* Abstract class that should be used to connect to MySQL database.
*/
class MySqlConnection {
  static async createPool(dbConfig) {
    const poolConnection = MySqlDb.createPool(dbConfig);
    poolConnection.on('acquire', (connection) => {
      console.log(`MySqlConnection - Connection ${connection.threadId} acquired`);
    });
    poolConnection.on('connection', (connection) => {
      console.log(`MySqlConnection - Connection ${connection.threadId} created`);
    });
    poolConnection.on('enqueue', () => {
      console.log('MySqlConnection - Waiting for available connection slot');
    });
    poolConnection.on('release', (connection) => {
      console.log(`MySqlConnection - Connection ${connection.threadId} released`);
    });
    console.log('MySqlConnection - Pool connection created.');
    return poolConnection;
  }

  /**
   * Get config connection.
   * @override
   */
  static getConfig() {
    return undefined;
  }

  /**
   * Get connection pool.
   * @override
   */
  static async getPool() {
    throw new BusinessError({
      code: ErrorConstants.DB_ERROR.code,
      httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
      messages: ['Esta función debe ser implementada.'],
    });
  }

  static async closePool(pool) {
    try {
      console.log(`MySqlConnection - Closing pool connection time: ${new Date().toISOString()}`);
      const endPromise = new Promise((resolve, reject) => {
        pool.end((error) => {
          if (error) {
            reject(error);
          }
          resolve();
        });
      });
      await endPromise;
      console.log(`MySqlConnection - Pool connection closed time: ${new Date().toISOString()}`);
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: ErrorConstants.DB_ERROR.code,
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: [HttpConstants.INTERNAL_SERVER_ERROR_STATUS.description],
      });
    }
  }

  static async bindQueryParams(connection, sql, bindParams) {
    try {
      let bindSql = `${sql}`;
      Object.keys(bindParams).forEach((tp) => {
        const value = connection.escape(bindParams[tp]);
        bindSql = bindSql.replace(new RegExp(`:${tp}`, 'g'), value);
      });

      return bindSql;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: ErrorConstants.DB_ERROR.code,
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: [HttpConstants.INTERNAL_SERVER_ERROR_STATUS.description],
      });
    }
  }

  static async getConnection(hasPool = true) {
    try {
      console.log(`MySqlConnection - Obtaining database connection time: ${new Date().toISOString()}`);
      let connection;
      if (hasPool) {
        const pool = await this.getPool();
        const connectionPromise = new Promise((resolve, reject) => {
          pool.getConnection((error, conn) => {
            if (error) {
              reject(error);
            }
            resolve(conn);
          });
        });
        connection = await connectionPromise;
        console.log(`MySqlConnection - Database connection obtained time: ${new Date().toISOString()}`);
      } else {
        // eslint-disable-next-line object-curly-newline
        const { user, password, host, database } = this.getConfig();
        connection = await MySqlDb.createConnection({
          user: user,
          password: password,
          host: host,
          database: database,
        });
        console.log(`MySqlConnection - Database connection obtained time: ${new Date().toISOString()}`);
      }
      return connection;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: ErrorConstants.DB_ERROR.code,
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: error.messages || [HttpConstants.INTERNAL_SERVER_ERROR_STATUS.description],
      });
    }
  }

  static async releaseConnection(connection, hasPool = true) {
    try {
      console.log(`MySqlConnection - Releasing database connection time: ${new Date().toISOString()}`);
      if (hasPool) {
        connection.release();
      } else {
        connection.destroy();
      }
      console.log(`MySqlConnection - Database connection released time: ${new Date().toISOString()}`);
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: ErrorConstants.DB_ERROR.code,
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: [HttpConstants.INTERNAL_SERVER_ERROR_STATUS.description],
      });
    }
  }

  static async closeConnection(connection) {
    try {
      console.log(`MySqlConnection - Closing database connection time: ${new Date().toISOString()}`);
      const endPromise = new Promise((resolve, reject) => {
        connection.end((error) => {
          if (error) {
            reject(error);
          }
          resolve();
        });
      });
      await endPromise;
      console.log(`MySqlConnection - Database connection closed time: ${new Date().toISOString()}`);
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: ErrorConstants.DB_ERROR.code,
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: [HttpConstants.INTERNAL_SERVER_ERROR_STATUS.description],
      });
    }
  }

  /**
   * @todo Implement this function.
   */
  static async commit() {
    // write me
  }

  /**
   * @todo Implement this function.
   */
  static async rollback() {
    // write me
  }

  static async _execute(connection, statement) {
    try {
      console.log(`MySqlConnection - Executing SQL statement time: ${new Date().toISOString()}`);
      console.log(statement);
      const queryPromise = new Promise((resolve, reject) => {
        connection.query(statement, (error, results) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          resolve(results);
        });
      });
      const result = await queryPromise;
      console.log(`MySqlConnection - SQL statement executed time: ${new Date().toISOString()}`);
      return result;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: ErrorConstants.DB_ERROR.code,
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: [HttpConstants.INTERNAL_SERVER_ERROR_STATUS.description],
      });
    }
  }

  /**
   * Execute SQL Statement.
   * @param {Object} config - Configuration of Database Connection.
   * @param {string} config.connection - Database Connection.
   * @param {(Object|string)} config.statement - SQL Statement.
   * @param {Object} [config.bindParams] - The query parameters.
   * @param {Object} [config.target] - The object where the query result is linked.
   * @return {Object|Object[]} Query result.
   */
  static async executeSQLStatement({
    connection,
    statement,
    bindParams = {},
    target,
  }) {
    try {
      let result;
      if (typeof statement === 'string') {
        const query = await this.bindQueryParams(connection, statement, bindParams);
        result = await this._execute(connection, query);
      } else {
        result = await this._execute(connection, statement);
      }

      if (target) {
        const data = result;
        const objects = [];
        data.forEach((obj) => {
          objects.push(ObjectMapper.map(obj, target));
        });
        return objects;
      }

      return result;
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: ErrorConstants.DB_ERROR.code,
        httpCode: HttpConstants.INTERNAL_SERVER_ERROR_STATUS.code,
        messages: error.messages,
      });
    }
  }

  /**
   * Execute SQL query with pagination.
   * @param {Object} config - Configuration of Database Connection.
   * @param {string} config.connection - Database Connection.
   * @param {string} config.projection - Projection section of SQL Sentence.
   * @param {string} config.selection - Selection section of SQL Sentence.
   * @param {Object} [config.bindParams] - The query parameters.
   * @param {Object} [config.target] - The object where the query result is linked.
   * @param {Object} [config.pagination={ page = 0, size = 1}] - The parameters of pagination.
   * @return {Object} Query result.
   */
  static async executeQueryPageable({
    connection,
    projection,
    selection,
    bindParams = {},
    target,
    pagination = { page: 0, size: 1 },
  }) {
    try {
      const offset = Number(pagination.page) * Number(pagination.size);
      const query = `
        ${projection} ${selection} limit ${offset}, ${Number(pagination.size)}
      `;

      const queryCount = `select count(*) total ${selection}`;
      const resultCount = await this.executeSQLStatement({
        connection: connection, statement: queryCount, bindParams: bindParams,
      });

      const contenido = await this.executeSQLStatement({
        connection: connection, statement: query, bindParams: bindParams, target: target,
      });
      pagination.total = resultCount[0].total;
      return { pagination: pagination, content: contenido };
    } catch (error) {
      console.log(error);
      throw new BusinessError({
        code: error.code,
        httpCode: error.httpCode,
        messages: error.messages,
      });
    }
  }
}

module.exports = MySqlConnection;
