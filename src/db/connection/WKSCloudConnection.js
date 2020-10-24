const MySqlDatabase = require('./MySqlDatabase');
const MySqlConnection = require('./MySqlConnection');

let poolConnection;

const dbconfig = {
  user: process.env.WKS_CLOUD_USER,
  password: process.env.WKS_CLOUD_PASSWORD,
  host: process.env.WKS_CLOUD_HOST,
  port: 3306,
  database: process.env.WKS_CLOUD_DATABASE,
};

class WKSCloudConnection extends MySqlConnection {
  static async getPool() {
    if (!poolConnection) {
      poolConnection = await this.createPool(dbconfig);
    }
    return poolConnection;
  }

  static async _createPool() {
    console.log("dbconfig --> " + dbconfig.host)
    //[1,2,3,4].map
    if (!poolConnection) {
      console.log("jfhuerhfiuheruif")
      poolConnection = await MySqlDatabase.createPool(dbconfig);
      console.log("jfhuerhfiuheruif --> " + poolConnection)
    }
  }

  static async executeSQL(sql, bindParams, target) {
    await this._createPool();

    console.log("executeSQL --> " + poolConnection)
    const result = await MySqlDatabase.executeSQL(sql, bindParams, target, poolConnection);
    return result;
  }
}

module.exports = WKSCloudConnection;
