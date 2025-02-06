import { Table, Column, Model, PrimaryKey, Default, AllowNull, DataType, ForeignKey } from 'sequelize-typescript';

import { User } from './user.model';
import { Purpose } from './purpose.model';

// Document Master Model
@Table({
  tableName: 'document_master',
})
export class DocumentMaster extends Model<DocumentMaster> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'document_type' })
  documentType: string;

  @ForeignKey(() => Purpose)
  @Column({ type: DataType.UUID, field: 'purpose_id' })
  purposeId: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  createdBy: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updatedBy: string;
}

// Document Requirements Model
@Table({
  tableName: 'document_requirements',
})
export class DocumentRequirements extends Model<DocumentRequirements> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'document_type' })
  documentType: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: 'is_required' })
  isRequired: boolean;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  createdBy: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updatedBy: string;
}

// Documents Model
@Table({
  tableName: 'documents',
})
export class Documents extends Model<Documents> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @Column({ type: DataType.UUID, field: 'entity_id' })
  entityId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM('user', 'customer'), field: 'entity_type' })
  entityType: 'user' | 'customer';

  @ForeignKey(() => Purpose)
  @Column({ type: DataType.UUID, field: 'purpose_id' })
  purposeId: string;

//   @ForeignKey(() => CustomerDetails)
//   @Column({ type: DataType.UUID, field: 'customer_id' })
//   customerId: string;

  @ForeignKey(() => DocumentRequirements)
  @Column({ type: DataType.UUID, field: 'document_type_id' })
  documentTypeId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'document_name' })
  documentName: string;

  @AllowNull(false)
  @Column({ type: DataType.JSON, field: 'document_url' })
  documentUrl: object;

  @Default('pending')
  @Column({ type: DataType.ENUM('pending', 'approved', 'rejected'), field: 'status' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: DataType.DATE, field: 'document_expiry' })
  documentExpiry: Date;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_doc_front_image' })
  isDocFrontImage: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_doc_back_image' })
  isDocBackImage: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_uploaded' })
  isUploaded: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_customer' })
  isCustomer: boolean;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  createdBy: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updatedBy: string;
}
