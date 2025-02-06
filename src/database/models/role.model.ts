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
  
  @Table({
    tableName: 'roles',
  })
  export class Role extends Model<Role> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID, field: 'id' })
    id: string;
  
    @AllowNull(false)
    @Column({ type: DataType.ENUM('admin', 'co-admin', 'maker', 'checker', 'maker-checker'), field: 'name' })
    name: string;
  
    @Default(true)
    @Column({ type: DataType.BOOLEAN, field: 'status' })
    status: boolean;
  
    @Default(DataType.NOW)
    @Column({ type: DataType.DATE, field: 'created_at' })
    createdAt: Date;
  
    @Default(DataType.NOW)
    @Column({ type: DataType.DATE, field: 'updated_at' })
    updatedAt: Date;
  }