import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  Unique,
  DataType,
} from 'sequelize-typescript';

import { User } from './user.model';
import * as crypto from 'crypto';

@Table({
  tableName: 'document_type', // Matches migration table name
  timestamps: true, // Enables createdAt & updatedAt
  underscored: true, // Uses snake_case for DB columns
})
export class DocumentType extends Model<DocumentType> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @AllowNull(false)
  @Unique
  @Default(() => crypto.randomBytes(8).toString('hex'))
  @Column({ type: DataType.STRING, field: 'public_key' })
  publicKey: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'name' })
  name!: string;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: 'is_active' })
  isActive: boolean;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt: Date;

  @ForeignKey(() => User)
  @AllowNull(true) // Make it optional
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by?: string;

  @ForeignKey(() => User)
  @AllowNull(true) // Make it optional
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by?: string;

  // Associations

  @BelongsTo(() => User, { foreignKey: 'created_by' })
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updated_by' })
  updater: User;

  /** Generate `publicKey` before creation */
  @BeforeCreate
  static generatePublicKey(instance: DocumentType) {
    instance.publicKey = crypto.randomBytes(8).toString('hex'); // Generates a random unique key
  }
}
