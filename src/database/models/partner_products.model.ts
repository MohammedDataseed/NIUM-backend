import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import { Partner } from "./partner.model";
import { Products } from "./products.model";

@Table({
  tableName: "partner_products",
  timestamps: false, // Set true if you need `createdAt` & `updatedAt`
})
export class PartnerProducts extends Model<PartnerProducts> {
  @ForeignKey(() => Partner)
  @Column({ type: DataType.UUID })
  partner_id: string;

  @ForeignKey(() => Products)
  @Column({ type: DataType.UUID })
  product_id: string;
}
