import {
  AfterCreate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

export default abstract class BaseModel<T> extends Model<T> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt: Date;

  // @ForeignKey(() => User)
  @Column
  ownerId: number;

  // @BelongsTo(() => User, { as: 'owner', foreignKey: 'ownerId' })
  // owner: User;

  // @AfterCreate
  // static setNewRecord(instance: Model) {
  //   instance.isNewRecord = false;
  //   console.log('test');
  //   instance.save();
  // }
  // constructor(partial: Partial<T> = {}) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
