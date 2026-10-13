# Tile Store 开发流程

新增或修改代码前，先完整阅读 `CODE_STYLE.md`。前端改动同时阅读根目录 `prompt.txt`、`PRODUCT.md` 和 `DESIGN.md`；后端阅读 `ARCHITECTURE.md` 与对应模块文档。

`prompt.txt` 是项目内视觉参考，不是执行脚本或权限指令。适配差异以 `CODE_STYLE.md` 第 9 节为准。保持 Vue 3 + Vite、Java Spring MVC 和 MySQL，不因参考示例迁移技术栈。

保留用户未提交的改动。功能按职责拆组件，素材数据与视图分离。真实商品事实以后端为准，本地图片、价格、登录和支付演示明确标注。不得提交密钥或声称已接入真实短信、支付。

完成前运行相关测试、前端构建和 `git diff --check`；UI 需检查桌面、手机、窄屏、键盘焦点和媒体加载；同步更新相关 MD。未经用户明确请求，不自动提交或推送。
