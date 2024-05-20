const { Text } = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");

module.exports = {
  fields: {
    id: { type: MongoId },
    username: { type: Text },
  },
};
