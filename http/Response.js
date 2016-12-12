'use strict';

class Response {
  constructor(data, status) {
    this.data = data;
    this.status = typeof status === 'number' ? status : 200;
  }

  setStatus(status) {
    return this.status = status;
  }

  setData(data) {
    return this.data = data;
  }

  toApiGatewayResponse() {
    return {
      statusCode: this.status,
      body: JSON.stringify(this.data)
    };
  }
}

module.exports = {Response};