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
