import fs from 'fs';
import ejs from 'ejs';

export default class DefaultController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  index() {
    this.res.writeHead(404, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify({ error: 'Not found' }));
  }

  entity() {
    const htmlContent = fs.readFileSync('views/index.ejs', 'utf-8');
    this.res.writeHead(200, { 'Content-Type': 'text/html' });
    const template = ejs.compile(htmlContent, { views: ['views'] });
    this.res.end(template({ userName: 12, products: [] }));
  }
}
