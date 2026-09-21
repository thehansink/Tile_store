# Tile_store 技术架构

## 组件关系

```text
Vue 3 + Vite（5173）
          │ HTTP / JSON
Spring Boot / Spring MVC（8080，最终可打 WAR 给 Tomcat）
          │ JPA / JDBC
MySQL 8.0（3306）
```

Tomcat 是 Java Web 服务器，不是数据库。MySQL 才负责保存商品、用户、购物车和订单。

## 当前已完成

- `backend/`：Spring MVC 商品查询和新增接口
- `frontend/`：Vue 页面读取 `/api/products`
- `database/setup.sql`：创建数据库并写入 4 个示例商品
- 原静态首页仍在根目录，避免线上页面立即中断

## 第一次运行

1. 用 MySQL Workbench 或 MySQL 命令行执行 `database/setup.sql`。
2. 打开 `backend/src/main/resources/application.yml`，把 `CHANGE_ME` 改成你的 MySQL 密码。
3. 安装 Maven，并检查 `mvn -version` 能正常显示。
4. 在 `backend` 目录运行 `mvn spring-boot:run`。
5. 在 `frontend` 目录运行 `npm install`，再运行 `npm run dev`。
6. 浏览器打开 <http://localhost:5173>。

## 接下来怎么扩展

先做商品管理，再做用户登录、购物车、订单，最后接入真实短信和支付。短信验证码和支付密钥必须由 Java 后端保存，不能放在 Vue 页面里。
