const { Text } = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");
const { Relationship } = require("@ocopjs/fields-relationship");

module.exports = {
  fields: {
    id: { type: MongoId },
    username: { type: Text },
    todos: {
      type: Relationship,
      ref: "Todo.assignee",
      many: true,
    },
  },
  access: {
    create: true,
    read: () => {
      console.log("read");
      return {
        OR: [
          { username_not: "test" },
          {
            todos_some: {
              name_not: "test",
            },
          },
        ],
      };
    },
    update: true,
    delete: true,
  },
};
