const { underline, yellow } = require("chalk");
const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");

const ocop = new Ocop({
  adapter: new MongooseAdapter({
    mongoUri: process.env.MONGO_CONNECTION,
  }),
  onInit: (port) => {
    console.log("AdminUI:", underline(`http://localhost:${port}/admin`));
    console.log("GraphQL:", underline(`http://localhost:${port}/admin/api`));
    console.log(yellow(`  _      _      _    `.repeat(2)));
    console.log(yellow(`>(.)__ <(.)__ =(.)__ `.repeat(2)));
    console.log(yellow(` (___/  (___/  (___/ `.repeat(2)));
  },
  appName: "ocop",
});

module.exports = { ocop };
