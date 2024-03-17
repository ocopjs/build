const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");
const { GraphQLApp } = require("@ocopjs/app-graphql");
const { AdminUIApp } = require("@ocopjs/app-admin-ui");
const { Text, Password, Checkbox, DateTime } = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");
const { PasswordAuthStrategy } = require("@ocopjs/auth-password");

const ocop = new Ocop({
  adapter: new MongooseAdapter({ mongoUri: "mongodb://localhost/ocop" }),
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
