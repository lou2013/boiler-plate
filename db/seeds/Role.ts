import * as mongoose from 'mongoose';
export default [
  {
    _id: new mongoose.Types.ObjectId('222222222222'),
    title: 'manager',
    domain: '*',
    permissionIds: [new mongoose.Types.ObjectId('111111111111')],
  },
];
