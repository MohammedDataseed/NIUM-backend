import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Purpose } from "./purpose.model";

// Document Master Model
@Table({
  tableName: "document_master",
})
export class DocumentMaster extends Model<DocumentMaster> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "document_type" })
  documentType: string;

  @ForeignKey(() => Purpose)
  @Column({ type: DataType.UUID, field: "purpose_id" })
  purposeId: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "created_at" })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "updated_at" })
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;
}
