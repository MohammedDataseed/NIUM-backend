import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  DataType,
  ForeignKey,
  Default,
  BeforeValidate,
  BeforeCreate,
  Unique,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';

import { validate as isUUID, v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto'; // For generating hashed keys
import { User } from './user.model';
import { DocumentType } from './documentType.model';
import { Purpose } from './purpose.model';
import { DocumentRequirements } from './document_requirements.model';
import { DocumentsLog } from './documents_log.model';

import * as crypto from 'crypto';
@Table({
  tableName: 'documents',
  timestamps: true,
})
export class Documents extends Model<Documents> {
  @Column({
    type: DataType.UUID, // Change to UUID
    defaultValue: DataType.UUIDV4, // Auto-generate UUID v4
    field: 'id',
  })
  documentId: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @Column({ type: DataType.UUID, field: 'entity_id' })
  entityId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM('user', 'customer'), field: 'entity_type' })
  entityType: 'user' | 'customer';

  @ForeignKey(() => Purpose)
  @Column({ type: DataType.UUID, field: 'purpose_id' })
  purposeId: string;

  @ForeignKey(() => DocumentType)
  @Column({ type: DataType.UUID, field: 'document_type_id' })
  document_type_id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'document_name' })
  document_name: string;

  // Store file details as JSON (e.g., URL, MIME type, size)
  @AllowNull(false)
  @Column({
    type: DataType.JSON,
    field: 'document_url',
    validate: {
      isObject(value: any) {
        if (typeof value !== 'object' || value === null) {
          throw new Error('document_url must be a valid JSON object');
        }
      },
    },
  })
  documentUrl: {
    url: string;
    mimeType?: string; // e.g., "application/pdf"
    size?: number; // Size in bytes
    uploadedAt?: string; // ISO timestamp
  };

  @Default('pending')
  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected'),
    field: 'status',
  })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: DataType.DATE, field: 'document_expiry' })
  documentExpiry: Date;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_doc_front_image' })
  isDocFrontImage: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_doc_back_image' })
  isDocBackImage: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_uploaded' })
  isUploaded: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_customer' })
  isCustomer: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  /** Generate `publicKey` before creation */
  @BeforeValidate
  static generatePublicKey(instance: Documents) {
    if (!instance.hashed_key) {
      const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
      const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
      instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
    }
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: Documents, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await DocumentsLog.findOne({
      where: { id: instance.id, dml_action: 'I' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }
    console.log(`🔵 Logging INSERT for ID: ${instance.documentId}`);
    await DocumentsLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.documentId,
        hashed_key: instance.hashed_key,
        entityId: instance.entityId,
        entityType: instance.entityType,
        purpose_id: instance.purposeId,
        document_type_id: instance.document_type_id,
        document_name: instance.document_name,
        documentUrl: instance.documentUrl,
        status: instance.status,
        documentExpiry: instance.documentExpiry,
        isDocFrontImage: instance.isDocFrontImage,
        isDocBackImage: instance.isDocBackImage,
        isUploaded: instance.isUploaded,
        isCustomer: instance.isCustomer,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt ?? new Date(),
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: Documents, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping update log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await DocumentsLog.findOne({
      where: { id: instance.id, dml_action: 'U' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🟡 Logging UPDATE for ID: ${instance.documentId}`);
    await DocumentsLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.documentId,
        hashed_key: instance.hashed_key,
        entityId: instance.entityId,
        entityType: instance.entityType,
        purpose_id: instance.purposeId,
        document_type_id: instance.document_type_id,
        document_name: instance.document_name,
        documentUrl: instance.documentUrl,
        status: instance.status,
        documentExpiry: instance.documentExpiry,
        isDocFrontImage: instance.isDocFrontImage,
        isDocBackImage: instance.isDocBackImage,
        isUploaded: instance.isUploaded,
        isCustomer: instance.isCustomer,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Delete */
  @AfterDestroy
  static async logDelete(instance: Documents, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    // 🚨 Prevent duplicate logs
    const existingLog = await DocumentsLog.findOne({
      where: { id: instance.id, dml_action: 'D' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Delete log already exists for ID: ${instance.id}, skipping duplicate.`,
      );
      return;
    }
    console.log(`🔴 Logging DELETE for ID: ${instance.documentId}`);
    await DocumentsLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.documentId,
        hashed_key: instance.hashed_key,
        entityId: instance.entityId,
        entityType: instance.entityType,
        purpose_id: instance.purposeId,
        document_type_id: instance.document_type_id,
        document_name: instance.document_name,
        documentUrl: instance.documentUrl,
        status: instance.status,
        documentExpiry: instance.documentExpiry,
        isDocFrontImage: instance.isDocFrontImage,
        isDocBackImage: instance.isDocBackImage,
        isUploaded: instance.isUploaded,
        isCustomer: instance.isCustomer,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
