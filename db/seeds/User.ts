import * as mongoose from 'mongoose';
import { UserStatus } from '../../src/api/v1/modules/user/enum/user-status.enum';
import { Gender } from '../../src/api/v1/modules/user/enum/gender.enum';

export default [
  {
    username: 'manager',
    firstName: 'manager',
    lastName: 'manager',
    status: UserStatus.ACTIVE,
    phoneNumber: '09381893855',
    password: '$2b$10$0ZIl8Fv22KG7tzzdBGtpnOpXq06zzAzkZVDIBTOzlfayVt3L4TrwK',
    memberships: [],
    bio: 'admin',
    config: {},
    cards: [],
    notifications: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    gender: Gender.MALE,
    birthDate: new Date(),
    rolesId: [new mongoose.Types.ObjectId('222222222222')],
  },
  {
    username: 'stz',
    firstName: 's',
    lastName: 'tabibzadeh',
    status: UserStatus.ACTIVE,
    phoneNumber: '09030746745',
    password: '$2b$10$3nGlI5hpigokCLPei1F1weE.rkQJk2EWTqQHDEeU/yiptRZZ4Cl3u',
    memberships: [],
    bio: 'admin',
    config: {},
    cards: [],
    notifications: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    gender: Gender.MALE,
    rolesId: [new mongoose.Types.ObjectId('222222222222')],
  },
];
