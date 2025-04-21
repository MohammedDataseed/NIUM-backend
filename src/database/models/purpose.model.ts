import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  BeforeValidate, // ✅ Change from BeforeCreate
  Unique,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.model';
import * as crypto from 'crypto';

@Table({
  tableName: 'purposes',
  timestamps: true,
  underscored: true,
})
export class Purpose extends Model<Purpose> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'purpose_name' })
  purposeName: string;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: 'is_active' })
  isActive: boolean;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'created_at' })
  created_at: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updated_at: Date;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by?: string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by?: string;

  @BelongsTo(() => User, { foreignKey: 'created_by' })
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updated_by' })
  updater: User;

  /** ✅ Ensure `hashed_key` is generated before validation */
  @BeforeValidate
  static ensureHashedKey(instance: Purpose) {
    if (!instance.hashed_key) {
      const randomPart = crypto.randomBytes(16).toString('hex');
      const timestampPart = Date.now().toString(36);
      instance.hashed_key = `${randomPart}${timestampPart}`;
    }
  }
}
