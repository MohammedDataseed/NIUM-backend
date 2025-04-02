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
  BeforeValidate,
  Unique,
  DataType,
} from 'sequelize-typescript';

import { User } from './user.model';
import * as crypto from 'crypto';

@Table({
  tableName: 'transaction_type', // Matches migration table name
  timestamps: true, // Enables createdAt & updatedAt
  underscored: true, // Uses snake_case for DB columns
})
export class transaction_type extends Model<transaction_type> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @AllowNull(false)
  @Unique
  // @Default(() => crypto.randomBytes(8).toString("hex"))
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

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

  @BeforeValidate
  static generateHashedKey(instance: transaction_type) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }
}
