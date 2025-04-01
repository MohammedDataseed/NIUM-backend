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
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { User } from './user.model';
import { PurposeLog } from './purpose_log.model';
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
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt: Date;

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

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: Purpose, options: any) {
    if (!options.transaction) return;

    await PurposeLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        purpose_name: instance.purposeName,
        is_active: instance.isActive,
        created_at: instance.createdAt,
        updated_at: instance.updatedAt,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: Purpose, options: any) {
    if (!options.transaction) return;

    await PurposeLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        purpose_name: instance.purposeName,
        is_active: instance.isActive,
        created_at: instance.createdAt,
        updated_at: instance.updatedAt,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction },
    );
  }

  /** ✅ Log Delete */
  @AfterDestroy
  static async logDelete(instance: Purpose, options: any) {
    if (!options.transaction) return;

    await PurposeLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        purpose_name: instance.purposeName,
        is_active: instance.isActive,
        created_at: instance.createdAt,
        updated_at: instance.updatedAt,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction },
    );
  }
}
