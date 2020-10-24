const SolicitudDao = require('../db/SolicitudDao');

class SolicitudService {
  static async listarSolicitudes(event) {
    try {
  //    const payload = AwsUtils.getPayloadRequest(event);
      let result = [];
      result = await SolicitudDao.listarSolicitudes(event);     
      return result;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = SolicitudService;
