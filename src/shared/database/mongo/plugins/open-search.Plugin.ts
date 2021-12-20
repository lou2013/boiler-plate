import { Schema } from 'mongoose';

export const OpenSearchPlugin = (schema: Schema, { client, index }) => {
  schema.post('save', function (obj) {
    client
      .index({
        id: obj._id.toString(),
        index,
        body: {
          ...obj.toJSON(),
          collection: (schema as any).options.collection.toLowerCase(),
        },
        refresh: true,
      })
      .catch((err) => console.log(err));
  });

  schema.post('findOneAndUpdate', function (obj) {
    if (obj)
      if (obj.deletedAt)
        client
          .delete({
            index,
            id: obj._id.toString(),
          })
          .catch((err) => console.log(err));
      else
        client
          .index({
            id: obj._id.toString(),
            index,
            body: {
              ...obj.toJSON(),
              collection: (schema as any).options.collection.toLowerCase(),
            },
            refresh: true,
          })
          .catch((err) => console.log(err));
  });
};
