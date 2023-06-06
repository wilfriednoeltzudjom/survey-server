module.exports = class HttpRequest {
  body;
  params;
  query;
  user;

  constructor(body, params, query, user) {
    this.body = body;
    this.params = params;
    this.query = query;
    this.user = user;
  }

  static fromExpress({ body, params, query, user }) {
    return new HttpRequest(body, params, query, user);
  }
};
