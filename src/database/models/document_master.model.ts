import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
  ForeignKey,
  Unique,
  BeforeCreate,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';

import * as crypto from 'crypto';
import { User } from './user.model';
import { Purpose } from './purpose.model';
import { DocumentMasterLog } from './document_master_log.model';

// Document Master Model
@Table({
  tableName: 'document_master',
  timestamps: true,
})
export class DocumentMaster extends Model<DocumentMaster> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'document_type' })
  documentType: string;

  @ForeignKey(() => Purpose)
  @Column({ type: DataType.UUID, field: 'purpose_id' })
  purposeId: string;

  // @Default(DataType.NOW)
  // @Column({ type: DataType.DATE, field: "created_at" })
  // created_at: Date;

  // @Default(DataType.NOW)
  // @Column({ type: DataType.DATE, field: "updated_at" })
  // updated_at: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  /** Generate `hashed_key` before creation */
  @BeforeCreate
  static generatehashed_key(instance: DocumentMaster) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: DocumentMaster, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await DocumentMasterLog.findOne({
      where: { id: instance.id, dml_action: 'I' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🔵 Logging INSERT for ID: ${instance.id}`);

    await DocumentMasterLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        document_type: instance.documentType,
        purpose_id: instance.purposeId,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: DocumentMaster, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping update log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await DocumentMasterLog.findOne({
      where: { id: instance.id, dml_action: 'U' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);
    await DocumentMasterLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        document_type: instance.documentType,
        purpose_id: instance.purposeId,
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
  static async logDelete(instance: DocumentMaster, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    console.log(`🔴 Logging DELETE for ID: ${instance.id}`);

    // 🚨 Prevent duplicate logs
    const existingLog = await DocumentMasterLog.findOne({
      where: { id: instance.id, dml_action: 'D' },
      transaction: options.transaction ?? null, // 🛠️ Fix applied here
    });
    if (existingLog) {
      console.log(
        `⚠️ Delete log already exists for ID: ${instance.id}, skipping duplicate.`,
      );
      return;
    }

    await DocumentMasterLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        document_type: instance.documentType,
        purpose_id: instance.purposeId,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
