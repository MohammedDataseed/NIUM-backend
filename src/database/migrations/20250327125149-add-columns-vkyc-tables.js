'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vkycs', 'resources_documents_files', {
      type: Sequelize.DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn('vkycs', 'resources_images_files', {
      type: Sequelize.DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn('vkycs', 'resources_videos_files', {
      type: Sequelize.DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vkycs', 'resources_documents_files');
    await queryInterface.removeColumn('vkycs', 'resources_images_files');
    await queryInterface.removeColumn('vkycs', 'resources_videos_files');
  },
};