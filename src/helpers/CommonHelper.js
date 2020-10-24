const HttpConstants = require('../constants/HttpConstants');

class CommonHelper{
    static buildResponse(payload) {
        const response = {
            statusCode: HttpConstants.OK_STATUS.code,
            body: JSON.stringify(payload),
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
              'X-Content-Type-Options': 'nosniff',
              'X-XSS-Protection': '1; mode=block',
              'X-Frame-Options': 'SAMEORIGIN',
              'Referrer-Policy': 'no-referrer-when-downgrade',
              'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            },
          };
          return response;
    }
}
module.exports = CommonHelper;
