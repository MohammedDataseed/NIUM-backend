// migrations/20250309-rename-esign-vkyc-columns.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('orders', 'isEsignRequired', 'is_esign_required');
    await queryInterface.renameColumn('orders', 'isVkycRequired', 'is_v_kyc_required');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('orders', 'is_esign_required', 'isEsignRequired');
    await queryInterface.renameColumn('orders', 'is_v_kyc_required', 'isVkycRequired');
  },
};