const { Text } = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");
const { Relationship } = require("@ocopjs/fields-relationship");

module.exports = {
  fields: {
    id: { type: MongoId },
    name: { type: Text },
    assignee: {
      type: Relationship,
      ref: "User.todos",
      many: false,
      noIndexed: true,
    },
  },
};
