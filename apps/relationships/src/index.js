const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");
const { GraphQLApp } = require("@ocopjs/app-graphql");
const todoSchema = require("./schemas/Todo");
const userSchema = require("./schemas/User");

MongooseAdapter.onQuery = (params) => {
  return console.log(JSON.stringify(params.aggregation));
};

const ocop = new Ocop({
  adapter: new MongooseAdapter({ mongoUri: "mongodb://localhost/ocop" }),
  defaultAccess: {
    list: {
      create: true,
      read: () => {
        console.log("123123213");
        return true;
      },
      update: true,
      delete: true,
    },
  },
});

ocop.createList("Todo", todoSchema);
ocop.createList("User", userSchema);

module.exports = {
  ocop,
  apps: [new GraphQLApp()],
};
