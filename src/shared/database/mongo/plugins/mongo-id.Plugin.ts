export const IdPlugin = (schema) => {
  const transform = function (doc, ret) {
    ret.id = ret?._id?.toString();

    delete ret._id;
    delete ret.__v;
  };

  schema.options.versionKey = false;

  schema.options.toJSON = schema.options.toJSON || {};
  schema.options.toJSON.virtuals = true;
  schema.options.toJSON.transform = transform;
  schema.set('toJSON', schema.options.toJSON);
};
