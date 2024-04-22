import Notifications from '../models/notifications.js';

export default class NotificationRepository {
  getAll() {
    return Notifications.findAll();
  }
}
