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
  Float,
  Integer,
  Password,
  Select,
  Slug,
  Url,
  Uuid,
  Virtual,
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
    float: { type: Float },
    integer: { type: Integer },
    password: {
      type: Password,
    },
    select: {
      type: Select,
      options: [
        { value: "one", label: "One" },
        { value: "two", label: "Two" },
        { value: "three", label: "Three" },
      ],
    },
    slug: {
      type: Slug,
      from: "text",
    },
    url: {
      type: Url,
    },
    uuid: { type: Uuid },
    virtual: {
      type: Virtual,
      resolver: (item) => `${item.uuid} ${item.slug}`,
    },
  },
});

module.exports = {
  ocop,
  apps: [new GraphQLApp()],
};
