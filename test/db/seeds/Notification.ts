import * as mongoose from 'mongoose';

export default [
  {
    _id: new mongoose.Types.ObjectId('222222223333'),
    ownerId: new mongoose.Types.ObjectId('222222222233').toString(),
    seen: false,
    body: 'test',
    title: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
