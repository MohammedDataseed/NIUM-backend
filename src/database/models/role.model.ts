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
  BeforeValidate,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { User } from './user.model';
import { RoleLog } from './role_log.model';
import * as crypto from 'crypto';

@Table({
  tableName: 'roles',
  schema: 'public',
  timestamps: true,
})
export class Role extends Model<Role> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' }) // Add hashed_key
  hashed_key: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(
      'admin',
      'co-admin',
      'maker',
      'checker',
      'maker-checker',
    ),
    field: 'name',
  })
  name: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: 'status' })
  status: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  @BelongsTo(() => User, 'created_by')
  creator: User;

  @BelongsTo(() => User, 'updated_by')
  updater: User;

  /** Generate `publicKey` before creation */
  @BeforeValidate
  static generatePublicKey(instance: Role) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }

  @AfterCreate
  static async logInsert(instance: Role, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await RoleLog.findOne({
      where: { id: instance.id, dml_action: 'I' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🔵 Logging INSERT for Role ID: ${instance.id}`);

    await RoleLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
        status: instance.status,
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
  static async logUpdate(instance: Role, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping update log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await RoleLog.findOne({
      where: { id: instance.id, dml_action: 'U' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🟡 Logging UPDATE for Role ID: ${instance.id}`);

    await RoleLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
        status: instance.status,
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
  static async logDelete(instance: Role, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await RoleLog.findOne({
      where: { id: instance.id, dml_action: 'D' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Delete log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🔴 Logging DELETE for Role ID: ${instance.id}`);

    await RoleLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
        status: instance.status,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
