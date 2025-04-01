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
  AfterDestroy,
  AfterUpdate,
  AfterCreate,
} from 'sequelize-typescript';
import * as crypto from 'crypto';
import { User } from './user.model';
import { BranchLog } from './branch-log.model';
import { CreateBranchDto } from 'src/dto/branch.dto';
@Table({
  tableName: 'branches',
  timestamps: true,
})
export class Branch extends Model<Branch> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'name' })
  name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'location' })
  location: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'city' })
  city: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'state' })
  state: string;

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

  /** Generate `hashed_key` before creation */
  @BeforeValidate
  static generatehashed_key(instance: Branch) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: Branch, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await BranchLog.findOne({
      where: { id: instance.id, dml_action: 'I' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🔵 Logging INSERT for ID: ${instance.id}`);

    await BranchLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
        location: instance.location,
        city: instance.city,
        state: instance.state,
        business_type: instance.business_type as any, // 🚨 Fix ENUM Issue
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: Branch, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping update log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await BranchLog.findOne({
      where: { id: instance.id, dml_action: 'U' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);

    await BranchLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
        location: instance.location,
        city: instance.city,
        state: instance.state,
        business_type: instance.business_type as any, // 🚨 Fix ENUM Issue
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
  static async logDelete(instance: Branch, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    // 🚨 Prevent duplicate logs
    const existingLog = await BranchLog.findOne({
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

    await BranchLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
        location: instance.location,
        city: instance.city,
        state: instance.state,
        business_type: instance.business_type as any, // 🚨 Fix ENUM Issue
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
