const { Text, Integer } = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");

module.exports = {
  fields: {
    id: { type: MongoId },
    name: { type: Text },
    price: { type: Integer },
    description: {
      type: Text,
      isMultiline: true,
    },
    guide: {
      type: Text,
      isMultiline: true,
    },
    url: { type: Text },
  },
  queryLimits: {
    maxResults: 100,
  },
  adapterConfig: { mongooseSchemaOptions: { collection: "product" } },
};
