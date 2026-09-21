# Tile_store 后端学习指南

## 1. 这套项目由谁做什么

| 名称 | 作用 | 当前状态 |
| --- | --- | --- |
| Vue 3 | 用户在浏览器里看到的商城页面 | 已创建，已验证可以打包 |
| Spring MVC | Java 后端，提供商品、用户和订单接口 | 已创建商品接口 |
| MySQL | 保存商品、用户、购物车、订单数据 | 已安装，等待创建数据库 |
| Tomcat | 运行 Java 后端的网站服务器 | 后期部署使用 |
| Maven | 下载 Java 依赖、编译和打包后端 | 已安装 |

## 2. Maven 是什么

Maven 相当于 Java 项目的“安装和打包工具”。

当你运行 `mvn spring-boot:run` 时，它会读取 `backend/pom.xml`，下载 Spring MVC、MySQL 驱动等依赖，再启动 Java 后端。

当你运行 `mvn clean package` 时，它会把 Java 后端打成 `tile-store-api.war`。这个 `.war` 文件未来可以复制到 Tomcat 的 `webapps` 文件夹里运行。

## 3. Maven 已安装在哪里

```text
D:\tools\apache-maven-3.9.16
```

已经设置的环境变量：

```text
MAVEN_HOME = D:\tools\apache-maven-3.9.16
Path 中已加入 D:\tools\apache-maven-3.9.16\bin
```

## 4. 怎样确认 Maven 可以使用

1. 关闭当前 PowerShell 窗口。
2. 新打开一个 PowerShell 窗口。
3. 输入：

```powershell
mvn -version
```

看到 `Apache Maven 3.9.16` 和 `Java version: 17` 就是成功。

## 5. 当前后端代码做了什么

### `backend/pom.xml`

它声明 Java 后端需要的组件：

- `spring-boot-starter-web`：Spring MVC 接口
- `spring-boot-starter-data-jpa`：Java 读写数据库
- `mysql-connector-j`：Java 连接 MySQL 的驱动
- `spring-boot-starter-tomcat`：将来部署到 Tomcat

### `Product.java`

这是商品表的 Java 模型，每件商品包含名称、分类、价格、规格、图片地址和是否上架。

### `ProductRepository.java`

这是商品数据的查询工具。Java 通过它从 MySQL 查找商品。

### `ProductController.java`

这是浏览器可以访问的接口，目前有：

```text
GET  /api/products
GET  /api/products/category/floor
POST /api/products
```

### `frontend/src/App.vue`

这是 Vue 页面。页面打开时会请求 `/api/products`，并把数据库中的商品显示出来。

## 6. 下一步：用 Navicat Premium 16 创建数据库

你的电脑中 MySQL 服务名为 `MySQL80`，当前已经在运行。

### 第一次连接 MySQL

1. 打开 Navicat Premium 16。
2. 点击左上角“连接”，选择“MySQL”。
3. 在“常规”页填写：

```text
连接名：Tile_store 本地数据库
主机：127.0.0.1
端口：3306
用户名：root
密码：你安装 MySQL 时设置的 root 密码
```

4. 点击“测试连接”。显示“连接成功”后，点击“确定”。

密码只填写在 Navicat 里，不要发到聊天中，也不要提交到 Gitee。

### 执行建库脚本

1. 在 Navicat 左侧双击刚创建的 `Tile_store 本地数据库` 连接。
2. 右键连接名称，选择“新建查询”。
3. 点击查询窗口工具栏的“打开”或“打开文件”。
4. 选择文件：`D:\work\Tile_store\database\setup.sql`。
5. 点击工具栏绿色三角形“运行”。
6. 下方显示“查询已成功执行”后，右键左侧连接并选择“刷新”。
7. 左侧会出现 `tile_store` 数据库；展开它，会看到 `products` 表。

### 验证数据是否创建成功

在新查询窗口输入并运行：

```sql
USE tile_store;
SELECT * FROM products;
```

下方结果表应该显示 4 条瓷砖商品。

执行成功后，下一步才是填写 MySQL 密码并启动 Java 后端。

## 7. 创建网站专用数据库账号

不要让网站后端使用 `root`。`root` 是 MySQL 管理员账号，权限太大；后端应该使用只负责本商城数据的 `tile_store_app` 账号。

在 Navicat 新建查询，先把下面命令中的 `请自己设置一个新密码` 换成你要使用的新密码，再运行：

```sql
CREATE USER IF NOT EXISTS 'tile_store_app'@'localhost'
IDENTIFIED BY '请自己设置一个新密码';

GRANT SELECT, INSERT, UPDATE, DELETE
ON tile_store.*
TO 'tile_store_app'@'localhost';

FLUSH PRIVILEGES;
```

这个账号只能读写 `tile_store` 数据库，不能删除其他数据库。

## 8. 启动后端时隐藏密码

后端配置已经改为读取环境变量，不再把密码写进 `application.yml` 或上传 Gitee。

在 PowerShell 输入下面三行。第二行会隐藏输入内容，请输入刚为 `tile_store_app` 设置的密码后按回车：

```powershell
$env:DB_USERNAME = 'tile_store_app'
$securePassword = Read-Host '输入 tile_store_app 数据库密码' -AsSecureString
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new('', $securePassword).Password
```

然后在同一个 PowerShell 窗口运行：

```powershell
cd D:\work\Tile_store\backend
mvn spring-boot:run
```

关闭这个 PowerShell 窗口后，临时密码会自动消失。

## 9. 安全提醒

不要把真实 MySQL 密码、短信密钥、微信支付密钥提交到 Gitee。真实密钥以后放在本机环境变量或服务器环境变量中。

## 10. 第二个功能：数据库购物车

购物车表是 `cart_items`，一行代表一个购物车中的商品：

- `cart_key`：购物车标识。现在演示使用 `demo-user`，以后换成真实登录用户 ID。
- `product_id`：商品编号，关联 `products.id`。
- `quantity`：购买数量。

### 创建购物车表

在 Navicat 新建查询，执行下面代码：

```sql
USE tile_store;

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  cart_key VARCHAR(100) NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT uk_cart_product UNIQUE (cart_key, product_id),
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 重启 Java 后端

回到正在运行后端的 PowerShell 窗口，按 `Ctrl + C` 停止旧版本。然后重新设置数据库账号环境变量，再启动：

```powershell
$env:DB_USERNAME = 'tile_store_app'
$securePassword = Read-Host '输入 tile_store_app 数据库密码' -AsSecureString
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new('', $securePassword).Password
cd D:\work\Tile_store\backend
mvn spring-boot:run
```

看到 `Started TileStoreApplication` 后，测试购物车接口：

```text
http://localhost:8080/api/cart?cartKey=demo-user
```

第一次应该返回空数组 `[]`。

### Vue 页面里的购物车操作

- 点击“加入购物车”：调用 `POST /api/cart`
- 增加或减少数量：调用 `PUT /api/cart/{productId}`
- 页面加载时读取购物车：调用 `GET /api/cart`

这次刷新页面后，购物车仍然存在，因为数据已经在 MySQL 中，而不是只存在浏览器内存里。

## 11. 第三个功能：创建订单

订单由两张表组成：

- `store_orders`：一张订单的收货人、电话、地址、支付方式、总金额和状态。
- `order_items`：订单中的每一种商品、下单时单价、数量。

这样设计的原因是：商品以后可能改名或改价，但老订单仍然要保留下单当时的名称和金额。

### 在 Navicat 创建订单表

用能管理数据库的 Navicat 连接打开新建查询，执行：

```sql
USE tile_store;

CREATE TABLE IF NOT EXISTS store_orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  cart_key VARCHAR(100) NOT NULL,
  receiver_name VARCHAR(100) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  shipping_address VARCHAR(300) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  unit VARCHAR(10),
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES store_orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

刷新 Navicat 后，`tile_store` 中应有四张表：

```text
products
cart_items
store_orders
order_items
```

### 重启后端并验证订单接口

订单表创建成功后，停止旧后端并使用第 8 节的环境变量命令重新启动。启动成功后，浏览器访问：

```text
http://localhost:8080/api/orders?cartKey=demo-user
```

第一次会返回 `[]`。这代表订单接口已经可以工作，但还没有订单。

### 创建演示订单的流程

1. 在 Vue 页面先把商品加入购物车。
2. 在“确认订单”区域填写姓名、11 位手机号、地址和支付方式。
3. 点击“创建订单”。
4. 后端会在一个事务里写入 `store_orders` 和 `order_items`，成功后才清空购物车。
5. 页面会显示订单号和应付金额。

当前只创建订单记录，绝不调用真实支付接口，也不会发生扣款。
