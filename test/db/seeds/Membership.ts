import * as mongoose from 'mongoose';

export default [
  {
    _id: new mongoose.Types.ObjectId('222222222333'),
    ownerId: new mongoose.Types.ObjectId('222222222233').toString(),
    boardMembershipsId: [new mongoose.Types.ObjectId('222222433333')],
    type: 'admin',
    userId: new mongoose.Types.ObjectId('222222222233').toString(),
    workspaceId: new mongoose.Types.ObjectId('222222222223').toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId('322222222333'),
    ownerId: new mongoose.Types.ObjectId('222222222298').toString(),
    boardMembershipsId: [],
    type: 'admin',
    userId: new mongoose.Types.ObjectId('222222222298').toString(),
    workspaceId: new mongoose.Types.ObjectId('322222222223').toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId('322228522333'),
    ownerId: new mongoose.Types.ObjectId('222222222298').toString(),
    boardMembershipsId: [new mongoose.Types.ObjectId('787878787879')],
    type: 'admin',
    userId: new mongoose.Types.ObjectId('222222222298').toString(),
    workspaceId: new mongoose.Types.ObjectId('322232222223').toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
