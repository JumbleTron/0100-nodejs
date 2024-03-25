export default class DefaultController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  index() {
    this.res.writeHead(404, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify({ error: 'Not found' }));
  }
}
