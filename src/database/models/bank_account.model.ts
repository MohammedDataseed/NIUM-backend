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
  BeforeCreate,
  BeforeDestroy,
  BeforeUpdate,
  AfterDestroy,
  AfterUpdate,
  AfterCreate,
} from 'sequelize-typescript';
import { User } from './user.model';
import { BankAccountLog } from './bank_account_log.model'; // Import the log model
import * as crypto from 'crypto';

@Table({
  tableName: 'bank_accounts',
  timestamps: true,
})
export class bank_account extends Model<bank_account> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'account_holder_name' })
  account_holder_name: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'account_number' })
  account_number: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'bank_name' })
  bank_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'bank_branch' })
  bank_branch: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'ifsc_code' })
  ifsc_code: string;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_beneficiary',
    defaultValue: false,
  })
  is_beneficiary: boolean;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  /**
   * Generates a hashed key based on essential bank account details.
   */
  @BeforeCreate
  static generatehashed_key(instance: bank_account) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: bank_account, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    console.log(`🔵 Logging INSERT for ID: ${instance.id}`);

    // 🚨 Prevent duplicate logs
    const existingLog = await BankAccountLog.findOne({
      where: { id: instance.id },
    });
    if (existingLog) {
      console.log(
        `⚠️ Log already exists for ID: ${instance.id}, skipping duplicate log.`,
      );
      return;
    }

    await BankAccountLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        account_holder_name: instance.account_holder_name,
        account_number: instance.account_number,
        bank_name: instance.bank_name,
        bank_branch: instance.bank_branch,
        ifsc_code: instance.ifsc_code,
        is_beneficiary: instance.is_beneficiary,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt ?? new Date(),
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: bank_account, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping update log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);

    // 🚨 Prevent duplicate logs
    const existingLog = await BankAccountLog.findOne({
      where: { id: instance.id, dml_action: 'U' },
    });
    if (existingLog) {
      console.log(
        `⚠️ Update log already exists for ID: ${instance.id}, skipping duplicate.`,
      );
      return;
    }

    await BankAccountLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        account_holder_name: instance.account_holder_name,
        account_number: instance.account_number,
        bank_name: instance.bank_name,
        bank_branch: instance.bank_branch,
        ifsc_code: instance.ifsc_code,
        is_beneficiary: instance.is_beneficiary,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Delete */
  @AfterDestroy
  static async logDelete(instance: bank_account, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    console.log(`🔴 Logging DELETE for ID: ${instance.id}`);

    // 🚨 Prevent duplicate logs
    const existingLog = await BankAccountLog.findOne({
      where: { id: instance.id, dml_action: 'D' },
    });
    if (existingLog) {
      console.log(
        `⚠️ Delete log already exists for ID: ${instance.id}, skipping duplicate.`,
      );
      return;
    }

    await BankAccountLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        account_holder_name: instance.account_holder_name,
        account_number: instance.account_number,
        bank_name: instance.bank_name,
        bank_branch: instance.bank_branch,
        ifsc_code: instance.ifsc_code,
        is_beneficiary: instance.is_beneficiary,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
