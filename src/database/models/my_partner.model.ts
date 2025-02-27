import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";


@Table({
  tableName: "my_partners",
})
export class Partner extends Model<Partner> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "email" })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "password" })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone_number: string;

  @Column({ type: DataType.STRING, allowNull: true })
  company_name: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  is_active: boolean;
}
