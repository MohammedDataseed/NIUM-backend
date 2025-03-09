import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
} from "sequelize-typescript";

@Table({
  tableName: "purposes",
  timestamps: true,
})
export class Purpose extends Model<Purpose> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "purpose_name" })
  purposeName: string;

  // @Default(DataType.NOW)
  // @Column({ type: DataType.DATE, field: "created_at" })
  // created_at: Date;

  // @Default(DataType.NOW)
  // @Column({ type: DataType.DATE, field: "updated_at" })
  // updated_at: Date;
}
