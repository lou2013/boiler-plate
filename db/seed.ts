/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
import * as fs from 'fs';

const basePath = __dirname + '/seeds';

const { MONGO_URL } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Database Name
const dbName = process.env.MAIN_DB_NAME;

async function importCollection(c: string, drop = false): Promise<void> {
  // Use connect method to connect to the server
  const client = await MongoClient.connect(MONGO_URL, {
    directConnection: true,
  });

  const db = client.db(dbName);

  if (drop) await db.dropCollection(c);

  const collection = db.collection(c);

  // Insert some documents
  const objs = require(`${basePath}/${c}.ts`).default;
  await collection.insertMany(objs);
  // if (!process.env.ENVIRONMENT.startsWith('test'))
  //   console.log(
  //     '\x1b[32m%s\x1b[0m',
  //     `Inserted ${objs.length} documents into the ${c} collection`,
  //   );

  await client.close();
}

export const seed = async (
  collections: string[] = [],
  drop = false,
): Promise<void> => {
  if (drop) console.log('\x1b[33m%s\x1b[0m', `Drop Collections First`);
  else console.log('\x1b[33m%s\x1b[0m', `Append to collections`);
  const files = fs.readdirSync(basePath);
  if (collections.length)
    collections.forEach(async (c) => {
      if (files.includes(c + '.ts')) await importCollection(c, drop);
      else console.log('\x1b[31m%s\x1b[0m', `File ${c}.ts not exists!`);
    });
  else
    files
      .filter((f) => !f.includes('index'))
      .forEach(async (f) => {
        await importCollection(f.split('.')[0], drop);
      });
};
