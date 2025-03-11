  
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Order } from "./order.model";

@Table({
  tableName: "esigns",
  timestamps: true,
})
export class ESign extends Model<ESign> {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, // Automatically generate a UUID
    primaryKey: true, // Set as primary key
    allowNull: false,
  })
  id: string;
  
  @ForeignKey(() => Order)
  @Column({ type: DataType.STRING, allowNull: false })
  order_id: string;

  // 🔥 New column to track attempt numbers
  @Column({ type: DataType.INTEGER, allowNull: false })
  attempt_number: number;

  // E-Sign Details from the Request
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

  // E-Sign Details from the Response
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

 // Associations
 @BelongsTo(() => Order, { foreignKey: "order_id", targetKey: "order_id" }) // Specify targetKey
 order: Order;
}
