import NotificationRepository from '../repository/NotificationRepository.js';

export default class NotificationController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.repository = new NotificationRepository();
  }

  index() {
    this.res.writeHead(200, { 'Content-Type': 'application/json' });
    this.res.end(JSON.stringify(this.repository.getAll()));
  }
}
