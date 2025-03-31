'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents_log', {
      log_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dml_action: {
        type: Sequelize.ENUM('I', 'D', 'U'),
        allowNull: false,
      },
      log_timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      entity_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      purpose_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      document_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      document_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      document_url: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      document_expiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_doc_front_image: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_doc_back_image: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_uploaded: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_customer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_documents_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO documents_log (
                dml_action, log_timestamp, id, hashed_key, entity_id, entity_type, purpose_id, 
                document_type_id, document_name, document_url, status, document_expiry, is_doc_front_image, 
                is_doc_back_image, is_uploaded, is_customer, created_by, updated_by, "createdAt", "updatedAt"
            ) VALUES (
                'I', NOW(), NEW.id, NEW.hashed_key, NEW.entity_id, NEW.entity_type, NEW.purpose_id, 
                NEW.document_type_id, NEW.document_name, NEW.document_url, NEW.status, NEW.document_expiry, 
                NEW.is_doc_front_image, NEW.is_doc_back_image, NEW.is_uploaded, NEW.is_customer, 
                NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt"
            );

        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO documents_log (
                dml_action, log_timestamp, id, hashed_key, entity_id, entity_type, purpose_id, 
                document_type_id, document_name, document_url, status, document_expiry, is_doc_front_image, 
                is_doc_back_image, is_uploaded, is_customer, created_by, updated_by, "createdAt", "updatedAt"
            ) VALUES (
                'U', NOW(), NEW.id, NEW.hashed_key, NEW.entity_id, NEW.entity_type, NEW.purpose_id, 
                NEW.document_type_id, NEW.document_name, NEW.document_url, NEW.status, NEW.document_expiry, 
                NEW.is_doc_front_image, NEW.is_doc_back_image, NEW.is_uploaded, NEW.is_customer, 
                NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt"
            );

        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO documents_log (
                dml_action, log_timestamp, id, hashed_key, entity_id, entity_type, purpose_id, 
                document_type_id, document_name, document_url, status, document_expiry, is_doc_front_image, 
                is_doc_back_image, is_uploaded, is_customer, created_by, updated_by, "createdAt", "updatedAt"
            ) VALUES (
                'D', NOW(), OLD.id, OLD.hashed_key, OLD.entity_id, OLD.entity_type, OLD.purpose_id, 
                OLD.document_type_id, OLD.document_name, OLD.document_url, OLD.status, OLD.document_expiry, 
                OLD.is_doc_front_image, OLD.is_doc_back_image, OLD.is_uploaded, OLD.is_customer, 
                OLD.created_by, OLD.updated_by, OLD."createdAt", OLD."updatedAt"
            );
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER documents_trigger
      AFTER INSERT OR UPDATE OR DELETE ON documents
      FOR EACH ROW EXECUTE FUNCTION log_documents_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS documents_trigger ON documents`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_documents_changes`,
    );
    await queryInterface.dropTable('documents_log');
  },
};
