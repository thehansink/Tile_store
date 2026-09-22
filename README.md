# Tile_store 瓷砖商店网站

这是一个不需要安装框架的静态网站，适合先在 Gitee 上发布第一版。

## 第一步：在电脑上打开

1. 打开 PowerShell。
2. 输入：

   ```powershell
   cd D:\work\Tile_store
   python -m http.server 4173
   ```

3. 打开浏览器访问 <http://127.0.0.1:4173>。
4. 关闭网站时，回到 PowerShell 按 `Ctrl + C`。

如果电脑提示找不到 Python，可以先从 <https://www.python.org/downloads/> 安装 Python，安装页面要勾选 `Add Python to PATH`。

## 第二步：修改网站内容

- 页面文字和图片地址：编辑 `index.html`
- 颜色、字体、排版：编辑 `styles.css`
- 产品筛选、收藏和预约弹窗：编辑 `script.js`

最常改的是 `index.html` 里的产品名称、价格、门店地址和图片 `src` 地址。图片建议使用自己的门店照片，替换时保留完整的 `https://...` 地址即可。

## 第三步：上传到 Gitee

### 方式 A：用 Gitee 网页上传（最适合新手）

1. 登录 Gitee，打开你创建的 `Tile_store` 仓库。
2. 点击“上传文件”。
3. 把 `index.html`、`styles.css`、`script.js`、`README.md` 四个文件一起拖进去。
4. 在页面下方填写提交说明，例如“完成瓷砖商店首页”。
5. 点击“提交文件”。

### 方式 B：用 Git 命令上传

在项目文件夹打开 PowerShell，逐行执行：

```powershell
git init
git add .
git commit -m "完成瓷砖商店首页"
git branch -M master
git remote add origin 你的Gitee仓库地址
git push -u origin master
```

把最后一行里的 `你的Gitee仓库地址` 换成 Gitee 仓库页面复制的 HTTPS 地址。

## 第四步：让别人能访问

在 Gitee 仓库的“服务”或“Pages”里开启 Gitee Pages，分支选择 `master`，目录选择根目录，然后点击部署。部署完成后，Gitee 会给你一个公开网址。

## 当前已完成的功能

- 响应式首页，支持手机和电脑
- 产品系列入口和产品筛选
- 产品收藏按钮
- 到店预约弹窗和提交成功提示
- 真实空间图片和产品展示
- 手机号登录 / 注册界面（演示验证码：`123456`）
- 产品加入购物车、数量调整和订单结算界面
- 微信支付、支付宝、到店付款选项（仅演示，不会真实扣款）

## 重要说明

当前手机号验证码和支付页面是前端演示功能：验证码不会真的发到手机，支付也不会真的扣款。正式经营前，需要接入短信服务、订单数据库和微信支付或支付宝官方接口，并在服务器端校验订单金额。

## Netlify 与后端地址

Vue 前端通过环境变量 `VITE_API_BASE_URL` 连接后端：

- 本地开发时保持为空，Vite 会代理到 `http://localhost:8080`。
- 部署到 Netlify 时，在网站设置的 Environment variables 中填写后端公网地址，例如 `https://api.example.com`。
- 修改环境变量后需要重新部署一次前端。
- 后端服务器还要设置 `FRONTEND_ORIGINS`，值为你的 Netlify 网站地址，例如 `https://your-site.netlify.app`。

Netlify 只负责发布前端静态文件；Spring Boot 和 MySQL 仍需要部署到可以被公网访问的服务器。

## Railway 部署准备

当前后端已经支持 Railway：

- `backend/Dockerfile` 会用 Java 17 和 Maven 构建后端。
- 端口从 Railway 的 `PORT` 环境变量读取。
- 数据库连接支持 Railway MySQL 的 `MYSQLHOST`、`MYSQLPORT`、`MYSQLDATABASE`、`MYSQLUSER`、`MYSQLPASSWORD`。
- 本地开发仍可使用 `DB_USERNAME` 和 `DB_PASSWORD` 环境变量。

Railway 部署时需要先创建 MySQL 服务，再把这些数据库变量注入 Java 服务。数据库表仍要通过 Railway 提供的 MySQL 连接执行 `database/setup.sql`；不要把本机的数据库密码提交到 Gitee。
