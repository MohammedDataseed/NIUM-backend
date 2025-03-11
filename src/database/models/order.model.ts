import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Unique,
  AllowNull,
  BeforeCreate,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Partner } from "./partner.model";
import { ESign } from "./esign.model";
import { Vkyc } from "./vkyc.model";
import { Optional } from "@nestjs/common";
import * as crypto from "crypto";

@Table({
  tableName: "orders",
  timestamps: true,
})
export class Order extends Model<Order> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "hashed_key" })
  hashed_key: string;

  @Column({ type: DataType.UUID, allowNull: false })
  partner_id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  order_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  transaction_type: string;

  @Column({ type: DataType.STRING, allowNull: true })
  purpose_type: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_esign_required: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_v_kyc_required: boolean;

  // Customer Details
  @Column({ type: DataType.STRING, allowNull: false })
  customer_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_pan: string;

  // Order Details
  @Column({ type: DataType.STRING, allowNull: true })
  @Optional()
  order_status: string;

  // E-Sign Details
  @Column({ type: DataType.STRING, allowNull: true })
  @Optional()
  e_sign_status: string; // Values: "Pending", "Completed"

  @Column({ type: DataType.STRING, allowNull: true })
  @Optional()
  e_sign_link_status: string;

  @Column({ type: DataType.DATE, allowNull: true })
  @Optional()
  e_sign_link_expires: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @Optional()
  e_sign_completed_by_customer: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  @Optional()
  e_sign_customer_completion_date: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  @Optional()
  e_sign_doc_comments: string;

  // V-KYC Details
  @Column({ type: DataType.STRING, allowNull: true })
  @Optional()
  v_kyc_status: string; // Values: "Pending", "Completed"

  @Column({ type: DataType.STRING, allowNull: true })
  @Optional()
  v_kyc_link_status: string;

  @Column({ type: DataType.DATE, allowNull: true })
  @Optional()
  v_kyc_link_expires: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @Optional()
  v_kyc_completed_by_customer: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  @Optional()
  v_kyc_customer_completion_date: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  @Optional()
  v_kyc_comments: string;

  // E-Sign Regeneration
  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  @Optional()
  is_esign_regenerated: boolean;

  @Column({ type: DataType.JSONB, allowNull: true })
  @Optional()
  is_esign_regenerated_details: any;

  // Video KYC Link Regeneration
  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  @Optional()
  is_video_kyc_link_regenerated: boolean;

  @Column({ type: DataType.JSONB, allowNull: true })
  @Optional()
  is_video_kyc_link_regenerated_details: any;

  // User Tracking (created_by and updated_by)
  @ForeignKey(() => Partner)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => Partner)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "checker_id" })
  checker_id: string; // Added for checker (user) details

  // Associations
  @BelongsTo(() => Partner, { foreignKey: "created_by" })
  creator: Partner;

  @BelongsTo(() => Partner, { foreignKey: "updated_by" })
  updater: Partner;

  @BelongsTo(() => User, { foreignKey: "checker_id" })
  checker: User;

  @Column({ type: DataType.JSONB, allowNull: true }) // Store structured data
  @Optional()
  merged_document: {
    url: string;
    mimeType: string;
    size: number;
    createdAt: string;
    documentIds: string[];
  };

  // Corrected Relationship (One Order -> Many ESigns)
  @HasMany(() => ESign, { foreignKey: "order_id" })
  esigns: ESign[];

  /** Generate `hashed_key` before creation */
  @BeforeCreate
  static generatehashed_key(instance: Order) {
    const randomPart = crypto.randomBytes(16).toString("hex"); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }
  // @BelongsTo(() => Vkyc, { foreignKey: "order_id" })
  // vkyc: Vkyc;
}
