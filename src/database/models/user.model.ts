import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Unique,
    DataType,
  } from 'sequelize-typescript';
  
  @Table({
    tableName: 'users',
  })
  export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column({
      type: DataType.INTEGER,
      field: 'user_id',
    })
    userId: number;
  
    @Unique
    @Column({
      field: 'username',
    })
    username: string;
  
    @Column({
      field: 'email',
    })
    email: string;
  
    @Column({
      field: 'password',
    })
    password: string;
  
    @Column({
      field: 'first_name',
    })
    firstName: string;
  
    @Column({
      field: 'last_name',
    })
    lastName: string;
  
    @Column({
      field: 'role',
    })
    role: string;
  
    @Column({
      field: 'is_active',
      type: DataType.BOOLEAN,
    })
    isActive: boolean;
  
    @Column({
      field: 'created_at',
    })
    createdAt: Date;
  
    @Column({
      field: 'created_by',
    })
    createdBy: number;
  
    @Column({
      field: 'updated_at',
    })
    updatedAt: Date;
  
    @Column({
      field: 'updated_by',
    })
    updatedBy: number;
  }
  