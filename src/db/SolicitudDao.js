const WKSCloudConnection = require('./connection/WKSCloudConnection');
const BusinessError = require('../models/domain/BusinessError');
const SolicitudRes  = require('../models/response/SolicitudRes');
const DatabaseConstants = require('../constants/DatabaseConstants');

class SolicitudDb {

  static async listarSolicitudes(payload) {
    let connection;
    try {

      console.log("eeeeee --> " + JSON.parse(payload.body).solicitud);
      const condicion = [
        JSON.parse(payload.body).solicitud
      ]
      console.log("dudhueh --> " + condicion);
    /*  connection = await WKSCloudConnection.getConnection();
      const listaSolicitudes = await WKSCloudConnection.executeSQLStatement({
        connection: connection,
        statement: DatabaseConstants.QUERY.LISTAR_SOLICITUDES,
        bindParams: source,
        target: new SolicitudRes({}),
      });*/

      const lista_n = await WKSCloudConnection.executeSQL(DatabaseConstants.QUERY.LISTAR_SOLICITUDES_2,
        condicion,
        new SolicitudRes({})) 
      console.log("lalal --> " + lista_n);

      console.log("separacion ----------------");

      //console.log(listaSolicitudes);
      return lista_n;
    } catch (e) {
      throw new BusinessError({
        code: e.code,
        httpCode: e.httpCode,
        messages: e.messages,
      });
    } finally {
      if (connection) {
        await WKSCloudConnection.releaseConnection(connection);
      }
    }
  }
}

module.exports = SolicitudDb;
