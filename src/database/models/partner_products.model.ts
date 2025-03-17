import { Table, Column, Model, ForeignKey, DataType } from "sequelize-typescript";
import { Partner } from "./partner.model";
import { Products } from "./products.model";

@Table({
  tableName: "partner_products",
  timestamps: true, // Enable timestamps for this table
})
export class PartnerProducts extends Model<PartnerProducts> {
  
  @ForeignKey(() => Partner)
  @Column({ type: DataType.UUID, field: "partner_id" })
  partner_id: string;

  @ForeignKey(() => Products)
  @Column({ type: DataType.UUID, field: "product_id" })
  product_id: string;
}
