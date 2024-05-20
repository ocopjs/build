const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");
const { GraphQLApp } = require("@ocopjs/app-graphql");
const { AdminUIApp } = require("@ocopjs/app-admin-ui");
const { Text } = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");
const hash = require("object-hash");
const LRUCache = require("lru-cache");
const cuid = require("cuid");

const lru = new LRUCache({
  ttl: 1000,
});

MongooseAdapter.onQuery = (params) => {
  if (params.duration < 100) return;
  const level = (params.duration / 100).toFixed(0);
  return console.log(level, JSON.stringify(params.aggregation));
};

MongooseAdapter.getCache = (listKey, aggregation) => {
  const key = hash(JSON.stringify(aggregation));
  const cached = lru.get(key);
  if (cached) return cached;
};

MongooseAdapter.setCache = (listKey, aggregation, ret) => {
  const key = hash(JSON.stringify(aggregation));
  lru.set(key, ret);
};

const ocop = new Ocop({
  adapter: new MongooseAdapter({
    mongoUri: "mongodb://localhost:27017/education",
  }),
});

ocop.createList("Todo", {
  fields: {
    id: { type: MongoId },
    name: { type: Text },
  },
  access: {
    read: () => {
      console.log("read");
      return { name_not: "huy" };
    },
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
