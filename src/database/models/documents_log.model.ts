import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'documents_log',
  timestamps: false,
})
export class DocumentsLog extends Model<DocumentsLog> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  log_id: number;

  @AllowNull(false)
  @Column({ type: DataType.ENUM('I', 'D', 'U'), field: 'dml_action' })
  dml_action: 'I' | 'D' | 'U';

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'log_timestamp' })
  log_timestamp: Date;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'entity_id' })
  entityId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'entity_type' })
  entityType: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'purpose_id' })
  purpose_id: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'document_type_id' })
  document_type_id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'document_name' })
  document_name: string;

  @AllowNull(false)
  @Column({ type: DataType.JSON, field: 'document_url' })
  documentUrl: {
    url: string;
    mimeType?: string;
    size?: number;
    uploadedAt?: string;
  };

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'status' })
  status: string;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'document_expiry' })
  documentExpiry: Date;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_doc_front_image' })
  isDocFrontImage: boolean;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_doc_back_image' })
  isDocBackImage: boolean;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_uploaded' })
  isUploaded: boolean;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_customer' })
  isCustomer: boolean;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'createdAt' })
  createdAt: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'updatedAt' })
  updatedAt: Date;
}
