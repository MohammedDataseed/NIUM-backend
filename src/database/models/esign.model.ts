// //esign.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Unique,
  BeforeValidate,
  AllowNull,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { Order } from './order.model';
import { ESignLog } from './esign_log.model';
import * as crypto from 'crypto';

@Table({
  tableName: 'esigns',
  timestamps: true,
})
export class ESign extends Model<ESign> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Unique
  @AllowNull(true)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @Column({ type: DataType.STRING, allowNull: false })
  partner_order_id: string; // 🔥 This is just for storing user input

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false })
  order_id: string; // 🔥 This will store the actual primary key of Order

  @BelongsTo(() => Order, { foreignKey: 'order_id', targetKey: 'id' })
  order: Order;

  @Column({ type: DataType.INTEGER, allowNull: false })
  attempt_number: number;

  @Column({ type: DataType.STRING, allowNull: false })
  task_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  group_id: string;

  @Column({ type: DataType.JSONB, allowNull: false })
  esign_file_details: object;

  @Column({ type: DataType.JSONB, allowNull: false })
  esign_stamp_details: object;

  @Column({ type: DataType.JSONB, allowNull: false })
  esign_invitees: object;

  @Column({ type: DataType.JSONB, allowNull: true })
  esign_details: object;

  @Column({ type: DataType.STRING, allowNull: true })
  esign_doc_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  request_id: string;

  @Column({ type: DataType.DATE, allowNull: true })
  completed_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  esign_expiry: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  active: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  expired: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  rejected: boolean;

  // 🔥 New Fields
  @Column({ type: DataType.JSONB, allowNull: true })
  result: object;

  @Column({ type: DataType.JSONB, allowNull: true })
  esigners: object;

  @Column({ type: DataType.JSONB, allowNull: true })
  file_details: object;

  @Column({ type: DataType.JSONB, allowNull: true })
  request_details: object;

  @Column({ type: DataType.STRING, allowNull: true })
  esign_irn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  esign_folder: string;

  @Column({ type: DataType.STRING, allowNull: true })
  esign_type: string;

  @Column({ type: DataType.STRING, allowNull: true })
  esign_url: string;

  @Column({ type: DataType.STRING, allowNull: true })
  esigner_email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  esigner_phone: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_signed: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  type: string;

  /** Generate `hashed_key` before creation */
  @BeforeValidate
  static generatehashed_key(instance: ESign) {
    const randomPart = crypto.randomBytes(16).toString('hex');
    const timestampPart = Date.now().toString(36);
    instance.hashed_key = `${randomPart}${timestampPart}`;
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: ESign, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit')
      return;

    const existingLog = await ESignLog.findOne({
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
    await ESignLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        partner_order_id: instance.partner_order_id,
        order_id: instance.order_id,
        attempt_number: instance.attempt_number,
        task_id: instance.task_id,
        group_id: instance.group_id,
        esign_file_details: instance.esign_file_details,
        esign_stamp_details: instance.esign_stamp_details,
        esign_invitees: instance.esign_invitees,
        esign_details: instance.esign_details,
        esign_doc_id: instance.esign_doc_id,
        status: instance.status,
        request_id: instance.request_id,
        completed_at: instance.completed_at,
        esign_expiry: instance.esign_expiry,
        active: instance.active,
        expired: instance.expired,
        rejected: instance.rejected,
        result: instance.result,
        esigners: instance.esigners,
        file_details: instance.file_details,
        request_details: instance.request_details,
        esign_irn: instance.esign_irn,
        esign_folder: instance.esign_folder,
        esign_type: instance.esign_type,
        esign_url: instance.esign_url,
        esigner_email: instance.esigner_email,
        esigner_phone: instance.esigner_phone,
        is_signed: instance.is_signed,
        type: instance.type,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: ESign, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit')
      return;

    const existingLog = await ESignLog.findOne({
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
    await ESignLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        partner_order_id: instance.partner_order_id,
        order_id: instance.order_id,
        attempt_number: instance.attempt_number,
        task_id: instance.task_id,
        group_id: instance.group_id,
        esign_file_details: instance.esign_file_details,
        esign_stamp_details: instance.esign_stamp_details,
        esign_invitees: instance.esign_invitees,
        esign_details: instance.esign_details,
        esign_doc_id: instance.esign_doc_id,
        status: instance.status,
        request_id: instance.request_id,
        completed_at: instance.completed_at,
        esign_expiry: instance.esign_expiry,
        active: instance.active,
        expired: instance.expired,
        rejected: instance.rejected,
        result: instance.result,
        esigners: instance.esigners,
        file_details: instance.file_details,
        request_details: instance.request_details,
        esign_irn: instance.esign_irn,
        esign_folder: instance.esign_folder,
        esign_type: instance.esign_type,
        esign_url: instance.esign_url,
        esigner_email: instance.esigner_email,
        esigner_phone: instance.esigner_phone,
        is_signed: instance.is_signed,
        type: instance.type,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Delete */
  @AfterDestroy
  static async logDelete(instance: ESign, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit')
      return;

    const existingLog = await ESignLog.findOne({
      where: { id: instance.id, dml_action: 'D' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Delete log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🔴 Logging DELETE for ID: ${instance.id}`);
    await ESignLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        partner_order_id: instance.partner_order_id,
        order_id: instance.order_id,
        attempt_number: instance.attempt_number,
        task_id: instance.task_id,
        group_id: instance.group_id,
        esign_file_details: instance.esign_file_details,
        esign_stamp_details: instance.esign_stamp_details,
        esign_invitees: instance.esign_invitees,
        esign_details: instance.esign_details,
        esign_doc_id: instance.esign_doc_id,
        status: instance.status,
        request_id: instance.request_id,
        completed_at: instance.completed_at,
        esign_expiry: instance.esign_expiry,
        active: instance.active,
        expired: instance.expired,
        rejected: instance.rejected,
        result: instance.result,
        esigners: instance.esigners,
        file_details: instance.file_details,
        request_details: instance.request_details,
        esign_irn: instance.esign_irn,
        esign_folder: instance.esign_folder,
        esign_type: instance.esign_type,
        esign_url: instance.esign_url,
        esigner_email: instance.esigner_email,
        esigner_phone: instance.esigner_phone,
        is_signed: instance.is_signed,
        type: instance.type,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
