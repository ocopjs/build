# Tạo dự án mới

Bài này sẽ hướng dẫn các bạn cách khởi tạo thủ công dự án OcopJS.

[Xem chi tiết](https://docs.ocopee.com/docs/ocopjs/tutorials/new-project)

## Chuẩn bị về cơ sở dữ liệu

Trước khi khởi chạy dự án OcopJS bạn cần phải có cơ sở dữ liệu trước. Bài này
yêu cầu cài MongoDB.

## Khởi tạo

Đầu tiên cần phải tạo thư mục trước:

```sh
mkdir new-project
cd new-project
yarn init
```

Bắt đầu với các cài đặt cơ bản nhất. Chúng ta có hai gói ở đây: @ocopjs/ocop, là
thành phần chính của OcopJS. Và @ocopjs/adapter-mongoose, gói giúp kết nối với
cơ sở dữ liệu MongoDB.

```sh
yarn add @ocopjs/ocop @ocopjs/adapter-mongoose
```

## Bước đầu tiên

Sau một số cài đặt trên, ta có thể bắt đầu viết mã. Đầu tiên tạo tệp chính cho
OcopJS `index.js`. Tệp này nằm ngoài (hay còn gọi là gốc thư mục). Viết như sau:

```js
const { Ocop } = require("@ocopjs/ocop");
const { MongooseAdapter } = require("@ocopjs/adapter-mongoose");

const ocop = new Ocop({
  adapter: new MongooseAdapter({ mongoUri: "mongodb://localhost/ocop" }),
});
```

> Lưu ý đảm bảo `mongoUri` đang đúng với MongoDB hiện tại của bạn.

Tiếp tục `export` đối tượng `ocop` để chạy được OcopJS.

```js
module.exports = {
  ocop,
};
```

Xong bước này chúng ta có thể chạy dự án OcopJS với kết nối MongoDB. Vẫn còn các
cấu hình cho nhiều tính năng khác.

## Cài đặt cho GraphQL API

Như các bước trên, bước này cũng cần cài một số gói:

```sh
yarn add @ocopjs/app-graphql
```

Khai báo gói này trong `index.js`

```js
const { GraphQLApp } = require("@ocopjs/app-graphql");
```

Xuất bản ra để chạy cùng dự án OcopJS đã thiết lập ở trên.

```js
module.exports = {
  ocop,
  apps: [new GraphQLApp()],
};
```

## Thêm một bảng

Để chạy được OcopJS tối thiểu cần một bảng dữ liệu. Bảng dữ liệu này sẽ có một
giao diện quản trị tương ứng tạo ra bởi gói `@ocopjs/app-admin-ui`.

Bảng dữ liệu và sự kết hợp của các trường-dữ-liệu. Nên để tạo ra bảng dữ liệu
đầu tiên phải cài gói trường-dữ-liệu:

```sh
yarn add @ocopjs/fields @ocopjs/fields-mongoid
```

> @ocopjs/fields-mongoid dùng để chạy khoá chính cho MongoDB.

Trong ví dụ này, hãy dùng thử trường-dữ-liệu kiểu Chữ. Khai báo trong index.js
như sau:

```js
const { Text } = require("@ocopjs/fields");
const { MongoId } = require("@ocopjs/fields-mongoid");
```

Tạo bảng-dữ-liệu đầu tiên trong index.js bằng cách thêm ngay sau khi dựng đối
tượng ocop các cài đặt sau:

```js
ocop.createList("Todo", {
  fields: {
    id: { type: MongoId },
    name: { type: Text },
  },
});
```

In our example, the Todo list has a single field called name of type Text.

Đoạn mã cài đặt trên sẽ tạo ra bảng-dữ-liệu với tên Todo. Tham số thứ hai trong
hàm gọi là tham-số-cấu-hình. Hiện tại đang cấu hình chỉ một trường-dữ-liệu. Đây
là Khung để OcopJS đọc và tạo Mô hình.

Trường dữ liệu trong ví dụ trên có khoá là name, kiểu Chữ.

## Cuối cùng, khởi chạy

Khởi tạo package.json nếu chưa có bằng lệnh yarn init. Thêm vào trong:

```json
{
  "scripts": {
    "start:dev": "ocop dev"
  }
}
```

Hãy chắc là cơ sở dữ liệu của bạn đang chạy, rồi chạy dự án OcopJS bằng lệnh
sau:

```
yarn start:dev
```

Bạn sẽ thấy các dòng tương tự như sau xuất hiện ở terminal:

```sh
ℹ Command: ocop dev
✔ Tệp đầu vào hợp lệ ./index.js
✔ Đã khởi tạo.
✔ Đã khởi tạo middlewares.
✔ Đã kết nối đến cơ sở dữ liệu.
✔ Đã sẵn sàng tại 3000

🔗 GraphQL Playground:	http://localhost:3000/admin/graphiql
🔗 GraphQL API:		http://localhost:3000/admin/api
```

Bây giờ hãy mở trình duyệt lên và truy cập thử xem mọi thứ có đang hoạt động như
mong đợi không nhé.

## Tóm lại

Chúng mừng bạn, cuối cùng thì cũng đã cài thành công dự án OcopJS đầu tiên bao
gồm GraphQL API, GraphQL Playground. Từng nãy đã giúp bạn có thể xây dựng giao
diện và kết nối chúng với GraphQL API rồi. Trong các hướng dẫn tiếp theo, chúng
tôi sẽ giúp bạn biết cụ thể hơn về cách sử dụng API. Và chạy giao diện quản trị
trên trình duyệt để biên tập nội dung một cách dễ dàng.
