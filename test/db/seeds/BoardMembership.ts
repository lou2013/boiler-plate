import * as mongoose from 'mongoose';

export default [
  {
    _id: new mongoose.Types.ObjectId('222222433333'),
    ownerId: new mongoose.Types.ObjectId('222222222233').toString(),
    boardId: new mongoose.Types.ObjectId('222222233333').toString(),
    isFavorite: false,
    type: 'admin',
    userId: new mongoose.Types.ObjectId('222222222233').toString(),
    workspaceId: new mongoose.Types.ObjectId('222222222223').toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId('787878787879'),
    ownerId: new mongoose.Types.ObjectId('222222222233').toString(),
    boardId: new mongoose.Types.ObjectId('787878787878').toString(),
    isFavorite: false,
    type: 'admin',
    userId: new mongoose.Types.ObjectId('222222222233').toString(),
    workspaceId: new mongoose.Types.ObjectId('222222222223').toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
