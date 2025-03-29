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
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';

import { User } from './user.model';
import { TransactionTypeLog } from './transaction_type_log.model';
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
  //@Default(() => crypto.randomBytes(8).toString("hex"))
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

  // /** Generate `hashed_key` before creation */
  // @BeforeCreate
  // static generatehashed_key(instance: transaction_type) {
  //   instance.hashed_key = crypto.randomBytes(8).toString("hex"); // Generates a random unique key
  // }

  /** Generate `publicKey` before creation */
  // @BeforeCreate
  // static generatePublicKey(instance: transaction_type) {
  //   const randomPart = crypto.randomBytes(16).toString("hex"); // 16-character random string
  //   const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
  //   instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  // }

  @BeforeValidate
  static generateHashedKey(instance: transaction_type) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: transaction_type, options: any) {
    if (!options.transaction) return;

    await TransactionTypeLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
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
  static async logUpdate(instance: transaction_type, options: any) {
    if (!options.transaction) return;

    await TransactionTypeLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
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
  static async logDelete(instance: transaction_type, options: any) {
    if (!options.transaction) return;

    await TransactionTypeLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
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
