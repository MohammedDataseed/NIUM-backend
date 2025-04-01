import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  AfterUpdate,
  AfterDestroy,
  AfterCreate,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { Branch } from './branch.model';
import { bank_account } from './bank_account.model';
import { Products } from './products.model';
import { UsersLog } from './users_log.model';
import * as crypto from 'crypto';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'email' })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'password' })
  password: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, field: 'role_id' })
  role_id: string;

  @ForeignKey(() => Branch)
  @Column({ type: DataType.UUID, field: 'branch_id' })
  branch_id: string;

  @ForeignKey(() => bank_account)
  @Column({ type: DataType.UUID, field: 'bank_account_id' })
  bank_account_id: string;

  // @ForeignKey(() => Products)
  // @Column({ type: DataType.UUID, field: "product_id" })
  // product_id: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  is_active: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('cash&carry', 'large_enterprise'),
    field: 'business_type',
  })
  business_type: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  // Associations
  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => Branch)
  branch: Branch;

  @BelongsTo(() => bank_account)
  bank_account: bank_account;

  // @BelongsTo(() => Products)
  // product: Products;

  @BelongsTo(() => User, { foreignKey: 'created_by', as: 'creator' })
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updated_by', as: 'updater' })
  updater: User;

  // @BeforeCreate
  // static generateHashedKey(instance: User) {
  //   const hash = crypto
  //     .createHash("sha256")
  //     .update(`${instance.email}-${Date.now()}`)
  //     .digest("hex");
  //   instance.hashed_key = hash;
  // }

  /** Generate `publicKey` before creation */
  @BeforeCreate
  static generatePublicKey(instance: User) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: User, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    // 🚨 Prevent duplicate logs
    const existingLog = await UsersLog.findOne({
      where: { id: instance.id, dml_action: 'I' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Log already exists for ID: ${instance.id}, skipping duplicate log.`,
      );
      return;
    }

    console.log(`🔵 Logging INSERT for ID: ${instance.id}`);

    await UsersLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        email: instance.email,
        password: instance.password,
        role_id: instance.role_id,
        branch_id: instance.branch_id,
        hashed_key: instance.hashed_key,
        is_active: instance.is_active,
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
  static async logUpdate(instance: User, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping update log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    // 🚨 Prevent duplicate logs
    const existingLog = await UsersLog.findOne({
      where: { id: instance.id, dml_action: 'U' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Update log already exists for ID: ${instance.id}, skipping duplicate.`,
      );
      return;
    }

    console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);

    await UsersLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        email: instance.email,
        password: instance.password,
        role_id: instance.role_id,
        branch_id: instance.branch_id,
        hashed_key: instance.hashed_key,
        is_active: instance.is_active,
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
  static async logDelete(instance: User, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    // 🚨 Prevent duplicate logs
    const existingLog = await UsersLog.findOne({
      where: { id: instance.id, dml_action: 'D' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Delete log already exists for ID: ${instance.id}, skipping duplicate.`,
      );
      return;
    }

    console.log(`🔴 Logging DELETE for ID: ${instance.id}`);

    await UsersLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        email: instance.email,
        password: instance.password,
        role_id: instance.role_id,
        branch_id: instance.branch_id,
        hashed_key: instance.hashed_key,
        is_active: instance.is_active,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
