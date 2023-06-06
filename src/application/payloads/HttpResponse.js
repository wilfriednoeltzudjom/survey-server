const { serializeResponse } = require('../_helpers/serialization.helper');

module.exports = class HttpResponse {
  status;
  success;
  message;
  data;

  constructor(status, success, message, data, serialize = true) {
    this.status = status;
    this.success = success;
    this.message = message;
    if (data) this.data = serialize ? serializeResponse(data) : false;
  }

  toJSON() {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }

  static fromJSON({ status, success, message, data }, { serialize = true } = {}) {
    return new HttpResponse(status, success, message, data, serialize);
  }

  static created({ message, data }) {
    return new HttpResponse(201, true, message, data);
  }

  static succeeded({ message, data }) {
    return new HttpResponse(200, true, message, data);
  }
};
