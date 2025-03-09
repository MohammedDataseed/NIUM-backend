import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
  } from "sequelize-typescript";
  import { Order } from "./order.model";
  
  @Table({
    tableName: "v_kycs",
  })
  export class Vkyc extends Model<Vkyc> {
    @ForeignKey(() => Order)
    @Column({ type: DataType.UUID })
    order_id: string;
  
    @Column({ type: DataType.STRING, allowNull: false })
    v_kyc_link: string;
  
    @Column({ type: DataType.STRING, allowNull: false })
    v_kyc_link_status: string;
  
    @Column({ type: DataType.DATE, allowNull: false })
    v_kyc_link_expires: Date;
  
    @Column({ type: DataType.STRING, allowNull: true })
    v_kyc_comments: string;
  
    @Column({ type: DataType.DATE, allowNull: true })
    v_kyc_doc_completion_date: Date;
  }
  