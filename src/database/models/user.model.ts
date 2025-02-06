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
} from 'sequelize-typescript';
import { Role } from './role.model';
import { Branch } from './branch.model';
import { BankAccount } from './bankAccount.model';
import { Products } from './products.model';
// import { DocumentRequirement } from './documentRequirement.model';

@Table({
  tableName: 'users',
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  // @ForeignKey(() => Role)
  // @Column({ type: DataType.UUID, field: 'role_id' })
  // roleId: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'email' })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'password' })
  password: string;

  // @ForeignKey(() => Branch)
  // @Column({ type: DataType.UUID, field: 'branch_id' })
  // branchId: string;

  // @ForeignKey(() => BankAccount)
  // @Column({ type: DataType.UUID, field: 'bank_account_id' })
  // bankAccountId: string;

  // @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  // isActive: boolean;

  // @ForeignKey(() => Products)
  // @Column({ type: DataType.UUID, field: 'products' })
  // products: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('cash&carry', 'large_enterprise'),
    field: 'business_type',
  })
  businessType: string;

  // @ForeignKey(() => DocumentRequirement)
  // @Column({ type: DataType.UUID, field: 'document_id' })
  // documentId: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt: Date;

  // @ForeignKey(() => User)
  // @Column({ type: DataType.UUID, field: 'created_by' })
  // createdBy: string;

  // @ForeignKey(() => User)
  // @Column({ type: DataType.UUID, field: 'updated_by' })
  // updatedBy: string;
}