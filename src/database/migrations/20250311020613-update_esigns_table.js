module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Drop the existing foreign key constraint (if it exists)
    await queryInterface.removeConstraint('esigns', 'esigns_order_id_fkey').catch(err => {
      console.log('No constraint to remove or constraint name differs:', err.message);
    });

    // Step 2: Change the order_id column type from uuid to text
    await queryInterface.changeColumn('esigns', 'order_id', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Step 3: Add a new foreign key constraint referencing orders.order_id
    await queryInterface.addConstraint('esigns', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'esigns_order_id_fkey',
      references: {
        table: 'orders',
        field: 'order_id', // Point to orders.order_id, not id
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes
    await queryInterface.removeConstraint('esigns', 'esigns_order_id_fkey');
    await queryInterface.changeColumn('esigns', 'order_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });
    await queryInterface.addConstraint('esigns', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'esigns_order_id_fkey',
      references: {
        table: 'orders',
        field: 'id', // Revert to original UUID reference
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};