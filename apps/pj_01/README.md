# Liên kết bảng

Khởi tạo dự án đơn giản theo [bài hướng dẫn bắt đầu nhanh](https://ocopee.com/open-source/ocopjs/tutorials/new-project) ta có các tệp như sau:

```sh
│ index.js
│ package.json
└ README.md
```

Hãy chia mã nguồn theo cấu trúc tương tự:

```sh
src
│ schemas
│ │ Todo
│ │ └ index.js
│ └ index.js
│ package.json
└ README.md
```

Thêm định nghĩa bảng `User` mới tại `src/schemas/User/index.js`:

```js
const { Text } = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");

module.exports = {
  fields: {
    id: { type: MongoId },
    username: { type: Text },
  },
};
```

Liên bảng mới vào tệp thực thi `src/index.js`:

```js
// ...
const userSchema = require("./schemas/User");
// ...
ocop.createList("User", userSchema);
// ...
```

> `User` là tên bảng, `userSchema` là định nghĩa bảng.

Liên kết `1-n` giữa `User` và `Todo` tại `src/schemas/Todo/index.js`, ta thêm:

```js
//...
module.exports = {
  fields: {
    //...
    assignee: {
      type: Relationship,
      ref: "User",
    },
    //...
  },
};
```

Chạy dự án và truy cập vào trình duyệt , ta sẽ thấy một trường `assignee` mới trong bảng `Todo`:

> Playground thường là `http://localhost:3000/admin/api` nếu bạn không đổi `PORT` mặc định.

```graphql
query {
  allTodos {
    id
    assignee {
      id
      username
    }
  }
}
```
