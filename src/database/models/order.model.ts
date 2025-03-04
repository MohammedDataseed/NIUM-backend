import {
    Table,
    Column,
    Model,
    PrimaryKey,
    Default,
    AllowNull,
    DataType,
  } from 'sequelize-typescript';
  
  @Table({
    tableName: 'orders',
    timestamps: true,
  })
  export class Order extends Model<Order> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, field: 'id' })
    id: string;
  
    @AllowNull(false)
    @Column({ type: DataType.STRING, field: 'partner_id' })
    partnerId: string;
  
    @AllowNull(false)
    @Column({ type: DataType.STRING, field: 'order_id' })
    orderId: string;
  
    @AllowNull(false)
    @Column({ type: DataType.STRING, field: 'transaction_type' })
    transactionType: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING, field: 'purpose_type' })
    purposeType: string;
  
    @AllowNull(false)
    @Column({ type: DataType.BOOLEAN, field: 'is_esign_required' })
    isEsignRequired: boolean;
  
    @AllowNull(false)
    @Column({ type: DataType.BOOLEAN, field: 'is_vkyc_required' })
    isVkycRequired: boolean;
  
    // Extracted customer_details fields
    @AllowNull(false)
    @Column({ type: DataType.STRING, field: 'customer_name' })
    customerName: string;
  
    @AllowNull(false)
    @Column({ type: DataType.STRING, field: 'customer_email' })
    customerEmail: string;
  
    @AllowNull(false)
    @Column({ type: DataType.STRING, field: 'customer_phone' })
    customerPhone: string;
  
    @AllowNull(false)
    @Column({ type: DataType.STRING, field: 'customer_pan' })
    customerPan: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING, field: 'aadhaar_pincode' })
    aadhaarPincode: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING, field: 'aadhaar_yob' })
    aadhaarYob: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING, field: 'aadhaar_gender' })
    aadhaarGender: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING, field: 'kyc_document' })
    kycDocument: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING, field: 'request_id' })
    requestId: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING, field: 'task_id' })
    taskId: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING, field: 'group_id' })
    groupId: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING, field: 'action' })
    action: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING, field: 'type' })
    type: string;
  
    @AllowNull(true)
    @Column({
      type: DataType.ENUM('completed', 'failed', 'pending'),
      field: 'status',
      defaultValue: 'pending',
    })
    status: 'completed' | 'failed' | 'pending';
  
    @AllowNull(true)
    @Column({ type: DataType.JSON, field: 'ekyc_response_data' })
    ekycResponseData: any;
  
    @Default(DataType.NOW)
    @Column({ type: DataType.DATE, field: 'created_at' })
    createdAt: Date;
  
    @Default(DataType.NOW)
    @Column({ type: DataType.DATE, field: 'updated_at' })
    updatedAt: Date;
  }