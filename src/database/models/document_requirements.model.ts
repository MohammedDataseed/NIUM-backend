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
} from 'sequelize-typescript';
import { User } from './user.model';
import * as crypto from 'crypto';
// Document Requirements Model
@Table({
  tableName: 'document_requirements',
  timestamps: false,
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
}
