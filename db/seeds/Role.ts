import * as mongoose from 'mongoose';
export default [
  {
    _id: new mongoose.Types.ObjectId('222222222222'),
    title: 'manager',
    domain: '*',
    permissionIds: [new mongoose.Types.ObjectId('111111111111')],
  },
  {
    _id: new mongoose.Types.ObjectId('222222222223'),
    title: 'normal',
    domain: '*',
    permissionIds: [
      new mongoose.Types.ObjectId('111111111112'),
      new mongoose.Types.ObjectId('111111111113'),
      new mongoose.Types.ObjectId('111111111114'),
      new mongoose.Types.ObjectId('111111111115'),
      new mongoose.Types.ObjectId('111111111116'),
      new mongoose.Types.ObjectId('111111111117'),
      new mongoose.Types.ObjectId('111111111118'),
      new mongoose.Types.ObjectId('111111111119'),
      new mongoose.Types.ObjectId('111111111120'),
    ],
  },
];
