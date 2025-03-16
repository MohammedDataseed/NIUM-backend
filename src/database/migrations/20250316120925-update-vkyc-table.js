'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('vkycs', 'created_by', {
      type: Sequelize.UUID,
      allowNull: true, // Make created_by optional
    });
    await queryInterface.changeColumn('vkycs', 'updated_by', {
      type: Sequelize.UUID,
      allowNull: true, // Make updated_by optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('vkycs', 'created_by', {
      type: Sequelize.UUID,
      allowNull: false, // Revert created_by to non-optional
    });
    await queryInterface.changeColumn('vkycs', 'updated_by', {
      type: Sequelize.UUID,
      allowNull: false, // Revert updated_by to non-optional
    });
  },
};

