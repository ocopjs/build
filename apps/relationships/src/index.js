const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");
const { GraphQLApp } = require("@ocopjs/app-graphql");
const todoSchema = require("./schemas/Todo");
const userSchema = require("./schemas/User");

const ocop = new Ocop({
  adapter: new MongooseAdapter({ mongoUri: "mongodb://localhost/ocop" }),
});

ocop.createList("Todo", todoSchema);
ocop.createList("User", userSchema);

module.exports = {
  ocop,
  apps: [new GraphQLApp()],
};
