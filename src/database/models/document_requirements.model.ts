import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
  ForeignKey,
  BeforeCreate,
  Unique,
  AfterDestroy,
  AfterUpdate,
  AfterCreate,
} from 'sequelize-typescript';
import { User } from './user.model';
import * as crypto from 'crypto';
import { DocumentRequirementsLog } from './document-requirements-log.model';
// Document Requirements Model
@Table({
  tableName: 'document_requirements',
  timestamps: true,
})
export class DocumentRequirements extends Model<DocumentRequirements> {
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

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: 'is_required' })
  isRequired: boolean;

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
  static generatehashed_key(instance: DocumentRequirements) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: DocumentRequirements, options: any) {
    if (!options.transaction) return;
    await DocumentRequirementsLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        document_type: instance.documentType,
        is_required: instance.isRequired,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt ?? new Date(),
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: DocumentRequirements, options: any) {
    if (!options.transaction) return;
    await DocumentRequirementsLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        document_type: instance.documentType,
        is_required: instance.isRequired,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction },
    );
  }

  /** ✅ Log Delete */
  @AfterDestroy
  static async logDelete(instance: DocumentRequirements, options: any) {
    if (!options.transaction) return;
    await DocumentRequirementsLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        document_type: instance.documentType,
        is_required: instance.isRequired,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction },
    );
  }
}
