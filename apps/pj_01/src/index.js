const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");
const { GraphQLApp } = require("@ocopjs/app-graphql");
const productSchema = require("./schemas/Product");

const ocop = new Ocop({
  adapter: new MongooseAdapter({ mongoUri: "mongodb://localhost/pj_01" }),
});

ocop.createList("Product", productSchema);

module.exports = {
  ocop,
  apps: [new GraphQLApp()],
};
