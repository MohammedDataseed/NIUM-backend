//document_type_log_model.ts

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  AutoIncrement,
  Sequelize 
} from "sequelize-typescript";

@Table({
  tableName: "document_type_log",
  timestamps: false,
  underscored: true,
})
export class DocumentTypeLog extends Model<DocumentTypeLog> {
  // @PrimaryKey
  // @Default(DataType.INTEGER)
  // @Column({ type: DataType.INTEGER, field: "log_id" })
  // log_id: number;

  @PrimaryKey
@AutoIncrement
@Column({ type: DataType.INTEGER, field: "log_id" })
log_id: number;


  @Column({
    type: DataType.ENUM("I", "D", "U"),
    allowNull: false,
    field: "dml_action",
  })
  dml_action: "I" | "D" | "U";

  @Default(() => new Date())
  @Column({ type: DataType.DATE, field: "log_timestamp" })
  log_timestamp: Date;

  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @Column({ type: DataType.STRING, field: "hashed_key" })
  hashed_key: string;

  @Column({ type: DataType.STRING, field: "name" })
  name: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true, field: "is_active" })
  is_active: boolean;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
created_at: Date;

@Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
updated_at: Date;


  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;
}