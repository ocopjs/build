const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");
const { GraphQLApp } = require("@ocopjs/app-graphql");
const {
  CalendarDay,
  Text,
  Checkbox,
  DateTime,
  DateTimeUtc,
  Decimal,
} = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");

const ocop = new Ocop({
  adapter: new MongooseAdapter({ mongoUri: "mongodb://localhost/ocop" }),
});

ocop.createList("Field", {
  fields: {
    id: { type: MongoId },
    calendarDay: { type: CalendarDay },
    text: {
      type: Text,
    },
    checkbox: {
      type: Checkbox,
    },
    dateTime: {
      type: DateTime,
    },
    dateTimeUtc: {
      type: DateTimeUtc,
    },
    decimal: {
      type: Decimal,
    },
  },
});

module.exports = {
  ocop,
  apps: [new GraphQLApp()],
};
