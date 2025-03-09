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

// Document Requirements Model
@Table({
  tableName: "document_requirements",
  timestamps: true,
})
export class DocumentRequirements extends Model<DocumentRequirements> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "document_type" })
  documentType: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: "is_required" })
  isRequired: boolean;

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
}
