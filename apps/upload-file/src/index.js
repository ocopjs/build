const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");
const { GraphQLApp } = require("@ocopjs/app-graphql");
const { File } = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");
const { LocalFileAdapter } = require("@ocopjs/file-adapters");

const ocop = new Ocop({
  adapter: new MongooseAdapter({ mongoUri: "mongodb://localhost/ocop" }),
});

const fileAdapter = new LocalFileAdapter({
  src: "./files",
  path: "/files",
});

ocop.createList("UploadFile", {
  fields: {
    id: { type: MongoId },
    file: {
      type: File,
      adapter: fileAdapter,
      isRequired: true,
      adminConfig: { host: "http://localhost:3000" },
    },
  },
});

module.exports = {
  ocop,
  apps: [new GraphQLApp()],
};
