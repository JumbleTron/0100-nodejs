'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('notifications', [
      {
        description: 'Description for the Notification 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Description for the Notification 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Description for the Notification 3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Description for the Notification 4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('notifications', null, {});
  },
};
