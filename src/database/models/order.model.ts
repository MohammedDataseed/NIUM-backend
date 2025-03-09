import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user.model";

@Table({
  tableName: "orders",
  timestamps: true,
})
export class Order extends Model<Order> {
  @Column({ type: DataType.UUID, allowNull: false })
  partner_id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  order_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  transaction_type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  purpose_type: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isEsignRequired: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isVkycRequired: boolean;

  // Customer Details
  @Column({ type: DataType.STRING, allowNull: false })
  customer_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_pan: string;

  // Aadhaar Details
  @Column({ type: DataType.STRING, allowNull: false })
  aadhaar_pincode: string;

  @Column({ type: DataType.STRING, allowNull: false })
  aadhaar_yob: string;

  @Column({ type: DataType.STRING, allowNull: false })
  aadhaar_gender: string;

  // // Timestamps & User Tracking
  // @Default(DataType.NOW)
  // @Column({ type: DataType.DATE, field: "created_at" })
  // created_at: Date;

  // @Default(DataType.NOW)
  // @Column({ type: DataType.DATE, field: "updated_at" })
  // updated_at: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;

  // // Associations
  // @BelongsTo(() => User, { foreignKey: "created_by" })
  // creator: User;

  // @BelongsTo(() => User, { foreignKey: "updated_by" })
  // updater: User;
}
