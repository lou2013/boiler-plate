import * as dotenv from 'dotenv';
dotenv.config();

import { seed } from './seed';

console.log(process.argv);
switch (process.argv[2]) {
  case '--seed':
    seed(
      process.argv.slice(3).filter((a) => a !== 'fresh'),
      process.argv.includes('fresh'),
    ).catch((error) => {
      console.debug(error);
    });
    break;
}
