'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'merged_document', {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: 'Stores details about the merged document, including URL, mimeType, size, createdAt, and documentIds'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'merged_document');
  }
};
