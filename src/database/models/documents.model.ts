import {
  Table,
  Column,
  Model,
  AllowNull,
  DataType,
  ForeignKey,
  Default,
  BeforeValidate,
  Unique,
} from 'sequelize-typescript';

// import { validate as isUUID, v4 as uuidv4 } from 'uuid';
// import { createHash } from 'crypto'; // For generating hashed keys
import { User } from './user.model';
import { DocumentType } from './documentType.model';
import { Purpose } from './purpose.model';
// import { DocumentRequirements } from './document_requirements.model';

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
}
