# Tile Store 瓷砖商城

Tile Store 是一个通用风格的瓷砖选购网站，面向需要挑选地面砖、墙面砖和岩板的用户。当前页面重点展示瓷砖纹理、分类筛选、购物袋、订单填写和手机号登录入口。

## 当前页面

- 深色材料展厅风格的首页
- 首屏瓷砖材质展示和选砖入口
- 首屏瓷砖展厅视频轮播，支持静音自动播放、左右切换、圆点导航和悬停暂停
- 地面砖、墙面砖、岩板分类筛选
- 瓷砖商品卡片和加入购物袋
- 购物袋侧边栏、数量调整和订单填写
- 手机号登录 / 注册界面，带验证码倒计时
- 后端不可用时，仍可用本地精选商品和本地购物袋预览页面
- 页面图片使用 `frontend/public/tiles/catalog/` 中的真实瓷砖展厅与样板素材
- 页面视频使用 `frontend/public/videos/` 中的网页版本瓷砖展厅素材

## 本地启动前端

在 PowerShell 中执行：

```powershell
cd D:\work\Tile_store\frontend
npm install
npm run dev
```

浏览器打开：<http://127.0.0.1:5173>

生成上线文件：

```powershell
npm run build
```

构建结果在 `frontend/dist/`。

## 用 Docker 模拟部署后端

电脑没有公网服务器时，可以先用 Docker 在本机模拟部署。它会启动一个独立的 MySQL 容器和 Spring Boot 容器，不会使用本机 MySQL 的 3306 端口。

首次运行前，在项目根目录执行：

```powershell
Copy-Item .env.docker.example .env.docker
docker compose --env-file .env.docker up --build
```

看到 `Started TileStoreApplication` 后，打开 <http://localhost:8080/api/products> 检查接口。停止服务按 `Ctrl+C`，后台启动可使用 `docker compose --env-file .env.docker up -d --build`。

查看日志：

```powershell
docker compose --env-file .env.docker logs -f api
```

停止并删除容器（保留数据库数据）：

```powershell
docker compose --env-file .env.docker down
```

这只是本机部署练习；正式部署时，服务器平台会提供数据库地址、端口、用户名和密码，再把这些值设置为后端环境变量。

## 前后端地址

前端通过 `VITE_API_BASE_URL` 连接 Java 后端。

- 本地开发留空，Vite 会把 `/api` 请求代理到 `http://localhost:8080`
- 部署到 Netlify 时，填写后端公网地址，例如 `https://api.example.com`
- 修改环境变量后，需要重新构建和部署前端
- 后端需要把 `FRONTEND_ORIGINS` 设置为前端网站地址

示例文件是 [frontend/.env.example](frontend/.env.example)。

## 项目目录

```text
frontend/                 Vue 3 + Vite 前端
frontend/src/App.vue      首页、商品、购物袋、登录交互
frontend/src/styles.css   页面颜色、排版和响应式样式
frontend/public/tiles/    瓷砖图片素材和完整素材目录
frontend/public/videos/   瓷砖展厅视频轮播素材
backend/                  Java Spring Boot 后端
database/                 MySQL 初始化脚本
PRODUCT.md                产品定位和界面约束
```

## 当前接口状态

已经接入的后端接口：

- `GET /api/products` 商品列表
- `GET /api/cart?cartKey=...` 读取购物袋
- `POST /api/cart?cartKey=...` 加入商品
- `PUT /api/cart/{productId}?cartKey=...` 修改数量
- `DELETE /api/cart/{productId}?cartKey=...` 删除商品
- `POST /api/orders?cartKey=...` 创建订单

手机号登录界面目前是前端演示功能：验证码不会真的发送到手机，登录状态只保存在浏览器本地。正式使用时，还需要后端增加用户表、发送验证码接口、验证码校验和登录令牌。

订单页面目前只记录订单信息，不会真实扣款。接入微信支付或支付宝前，需要先在服务端校验订单金额，并使用官方支付接口。

## 数据库初始化

- 本地数据库使用 [database/setup.sql](database/setup.sql)
- Railway MySQL 使用 [database/setup-railway.sql](database/setup-railway.sql)
- 数据库脚本中的商品图片现在使用瓷砖纹理素材地址
- 不要把数据库密码、短信密钥或支付密钥提交到 GitHub 或 Gitee

## 发布到 GitHub 和 Gitee

```powershell
cd D:\work\Tile_store
git add .
git commit -m "优化瓷砖商城界面"
git push github master
git push origin master
```

仓库地址：

- GitHub：<https://github.com/thehansink/Tile_store>
- Gitee：<https://gitee.com/AKAThehan/Tile_store>

## 图片替换

将自有的瓷砖产品图放进 `frontend/public/tiles/catalog/`，然后在 [frontend/src/App.vue](frontend/src/App.vue) 的 `tileImages` 中更新文件名。建议使用同一背景、同一光线和相近尺寸拍摄，商品陈列会更统一。首页视频放进 `frontend/public/videos/`，再在 `carouselSlides` 中替换 `video` 和 `poster`。
