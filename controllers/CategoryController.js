export default class CategoryController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  index() {
    this.res.writeHead(200, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify({ categories: [] }));
  }

  entity(id) {
    this.res.writeHead(200, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify({ id }));
  }
}
