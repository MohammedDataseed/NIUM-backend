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
} from 'sequelize-typescript';
import { Order } from './order.model';
import { User } from './user.model';
import * as crypto from 'crypto';

@Table({
  tableName: 'esigns',
  timestamps: false,
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

  /** Generate `hashed_key` before creation */
  @BeforeValidate
  static generatehashed_key(instance: ESign) {
    const randomPart = crypto.randomBytes(16).toString('hex');
    const timestampPart = Date.now().toString(36);
    instance.hashed_key = `${randomPart}${timestampPart}`;
  }
}
