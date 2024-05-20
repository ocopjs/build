# Bắt đầu nhanh

## Khởi tạo thư mục

```
mkdir tên-thư-mục
cd tên-thư-mục
```

## Cài đặt

```
npm install @ocopjs/adapter-mongoose@latest @ocopjs/app-graphql@latest @ocopjs/fields@latest @ocopjs/fields-mongoid@latest @ocopjs/ocop@latest @ocopjs/file-adapters@latest
```

## Tạo các tệp gốc

```
tên-thư-mục
  src
    index.js
  package.json
```

tên-thư-mục/src/index.js

```js
const { Ocop } = require("@ocopjs/ocop");

const ocop = new Ocop({});

module.exports = {
  ocop,
};
```

tên-thư-mục/package.json

```json
{
  "name": "app-main",
  "scripts": {
    "dev": "ocop dev --entry=src"
  },
  "license": "ISC",
  "dependencies": {
    "@ocopjs/common": "^1.0.3",
    "@ocopjs/ocop": "^1.0.0",
    "@ocopjs/utils": "^1.0.5"
  }
}
```
