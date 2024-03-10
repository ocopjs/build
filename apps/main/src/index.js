const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");
const { GraphQLApp } = require("@ocopjs/app-graphql");
const { AdminUIApp } = require("@ocopjs/app-admin-ui");
const { Text } = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");

const ocop = new Ocop({
  adapter: new MongooseAdapter({ mongoUri: "mongodb://localhost/ocop" }),
});

ocop.createList("Todo", {
  fields: {
    id: { type: MongoId },
    name: { type: Text },
  },
});

module.exports = {
  ocop,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      adminPath: "/admin",
    }),
  ],
};
