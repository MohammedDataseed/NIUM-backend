//vkyc.model.ts
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
    BeforeCreate,
  } from "sequelize-typescript";
  import { Order } from "./order.model";
  import * as crypto from "crypto";

@Table({
  tableName: "vkycs",
  timestamps: true,
})
export class Vkyc extends Model<Vkyc> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;
  @Unique
  @AllowNull(true)
  @Column({ type: DataType.STRING, field: "hashed_key" })
  hashed_key: string;

  @Column({ type: DataType.STRING, allowNull: false })
  partner_order_id: string; // 🔥 This is just for storing user input

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false })
  order_id: string; // 🔥 This will store the actual primary key of Order

  @BelongsTo(() => Order, { foreignKey: "order_id", targetKey: "id" })
  order: Order;

  @Column({ type: DataType.INTEGER, allowNull: false })
  attempt_number: number;

  // New fields from the first API response

  @Column({ type: DataType.STRING, allowNull: true })
  reference_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  profile_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  v_kyc_link: string;

  @Column({ type: DataType.DATE, allowNull: false })
  v_kyc_link_expires: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  v_kyc_link_status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  v_kyc_comments: string;

  @Column({ type: DataType.DATE, allowNull: true })
  v_kyc_doc_completion_date: Date;

  // New fields from the second API response

  @Column({ type: DataType.JSONB, allowNull: true })
  device_info: any;  // stores device info like IP and User Agent

  @Column({ type: DataType.JSONB, allowNull: true })
  profile_data: any;  // stores profile details like email, mobile, and notes

  @Column({ type: DataType.JSONB, allowNull: true })
  performed_by: any[];  // stores actions performed by various accounts

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_documents: any[];  // stores the document resources

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_images: any[];  // stores the image resources

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_videos: any[];  // stores video resources

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_text: any[];  // stores text resources such as location, name, dob
  
  @Column({ type: DataType.JSONB, allowNull: true })
  location_info: any;  // stores location data like address and coordinates

  @Column({ type: DataType.STRING, allowNull: true })
  first_name: string;  // stores first name from the profile data
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reviewer_action!: string;

  @Column({
    type: DataType.JSONB, // You can use JSONB if tasks is an array or object.
    allowNull: true,
  })
  tasks!: object;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status!: string;

  @Column({
    type: DataType.JSONB, // You can use JSONB if tasks is an array or object.
    allowNull: true,
  })
  status_description!: object;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status_detail!: string | null; // Allowing null

  /** Generate `hashed_key` before creation */
      @BeforeValidate
      static generatehashed_key(instance: Vkyc) {
        const randomPart = crypto.randomBytes(16).toString("hex");
        const timestampPart = Date.now().toString(36);
        instance.hashed_key = `${randomPart}${timestampPart}`;
      }
}
