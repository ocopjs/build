const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");
const { GraphQLApp } = require("@ocopjs/app-graphql");
const { AdminUIApp } = require("@ocopjs/app-admin-ui");
const {
  Text,
  Password,
  Checkbox,
  DateTime,
  Select,
  Virtual,
  File,
} = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");
const { PasswordAuthStrategy } = require("@ocopjs/auth-password");
const { LocalFileAdapter } = require("@ocopjs/file-adapters");

const ocop = new Ocop({
  adapter: new MongooseAdapter({ mongoUri: "mongodb://localhost/ocop" }),
});

const fileAdapter = new LocalFileAdapter({
  src: "./files",
  path: "/files",
});

const options = [
  { value: 1, label: "One" },
  { value: 2, label: "Two" },
  { value: 3, label: "Three" },
];

ocop.createList("Thing", {
  fields: {
    id: { type: MongoId },
    number: { type: Select, options: options, dataType: "integer" },
    name: {
      type: Virtual,
      resolver: (item) => `${item.number} ${item.id}`,
    },
    file: {
      type: File,
      adapter: fileAdapter,
      isRequired: true,
      adminConfig: { host: "http://localhost:3000" },
    },
  },
});

const USER = "User";

ocop.createList(USER, {
  fields: {
    id: { type: MongoId },
    // CREDENTIALS ========================================
    username: { type: Text, isRequired: true, isUnique: true, isIndex: true },
    password: {
      type: Password,
    },
    // STATUS ========================================
    isActive: {
      type: Checkbox,
      adminConfig: { className: "col-sm-12 col-md-6" },
    },
    forgotAt: {
      type: DateTime,
      access: {
        read: true,
        create: false,
        update: true,
      },
    },
  },
});

const authStrategy = ocop.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: USER,
  config: {
    identityField: "username",
    secretField: "password",
    cookieSecret: "anyrandomstring",
  },
});

module.exports = {
  ocop,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      adminPath: "/admin",
      authStrategy,
    }),
  ],
  configureExpress: (app) => {
    app.set("trust proxy", 1);
  },
};
