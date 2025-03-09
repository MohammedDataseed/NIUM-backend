import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
  import { Order } from "./order.model";  // Assuming Order model is already defined
  
  @Table({
    tableName: "esigns",
    timestamps: true,
  })
  export class ESign extends Model<ESign> {
    @ForeignKey(() => Order)
    @Column({ type: DataType.UUID, allowNull: false })
    order_id: string;
  
    @ForeignKey(() => Order)
    @Column({ type: DataType.UUID, allowNull: false })
    partner_id: string;
  
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
    created_at: Date;
  
    @Column({ type: DataType.DATE, allowNull: true })
    esign_expiry: Date;
  
    // Associations
    @BelongsTo(() => Order, { foreignKey: "order_id" })
    order: Order;
  }
  