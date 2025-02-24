// import {
//   Table,
//   Column,
//   Model,
//   PrimaryKey,
//   AutoIncrement,
//   AllowNull,
//   Unique,
//   DataType,
// } from "sequelize-typescript";

// @Table({
//   tableName: "partner",
// })
// export class Partner extends Model<Partner> {
//   @PrimaryKey
//   @AutoIncrement
//   @Column({
//     type: DataType.SMALLINT,
//     field: "partner_id",
//   })
//   partnerid: number;

//   @Column({
//     field: "name",
//   })
//   name: string | null;

//   @AllowNull
//   @Column({
//     field: "description",
//   })
//   description: string | null;

//   @Unique
//   @Column({
//     field: "partner_key",
//   })
//   partnerKey: string;

//   @Column({
//     field: "type",
//   })
//   type: string;

//   @Column({ type: DataType.JSONB, field: "config" })
//   config: any;

//   @Column({
//     field: "is_active",
//     type: DataType.BOOLEAN,
//   })
//   is_active: boolean;

//   @Column({
//     field: "created_at",
//   })
//   createdAt: Date;

//   @Column({
//     field: "created_by",
//   })
//   created_by: number;

//   @Column({
//     field: "updated_at",
//   })
//   updatedAt: Date;

//   @Column({
//     field: "updated_by",
//   })
//   updated_by: number;

//   @Column({
//     field: "code",
//   })
//   code: string;

//   @Column({ type: DataType.JSONB, field: "notification_config" })
//   notificationConfig: JSON;
// }

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
import { Role } from "./role.model";
import { Branch } from "./branch.model";
import { BankAccount } from "./bankAccount.model";
import { Products } from "./products.model";
import { DocumentMaster } from "./document_master.model";

@Table({
  tableName: "partners",
})
export class Partner extends Model<Partner> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, field: "role_id" })
  role_id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "email" })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "password" })
  password: string;

  @ForeignKey(() => Branch)
  @Column({ type: DataType.UUID, field: "branch_id" })
  branch_id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "api_key" })
  api_key: string;

  @ForeignKey(() => BankAccount)
  @Column({ type: DataType.UUID, field: "bank_account_id" })
  bank_account_id: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  is_active: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM("cash&carry", "large_enterprise"),
    field: "business_type",
  })
  business_type: string;

  // Associations
  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => Branch)
  branch: Branch;

  @BelongsTo(() => BankAccount)
  bankAccount: BankAccount;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "created_at" })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "updated_at" })
  updatedAt: Date;

  @ForeignKey(() => Partner)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => Partner)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;
}
