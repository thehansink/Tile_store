# Tile Store 代码与产品规范

> 新增页面、接口、组件、数据库字段或部署配置前必须阅读本文档。实现与本文档冲突时，说明原因并同步更新。

## 1. 定位与技术边界

Tile Store 是面向消费者、经销商和设计师的“瓷砖品牌官网 + 产品库 + 内容营销平台”。核心路径是：找砖 -> 看纹理与铺贴效果 -> 算用量 -> 申请样品或预约到店。

当前仓库使用 Vue 3 + Vite（`frontend/`）、Java 17 + Spring Boot + Spring MVC（`backend/`）、MySQL 8（`database/`）和 Docker Compose。原文中的 Next.js、React、TypeScript 目录属于未来迁移参考，当前不要创建 `app/`、`.tsx` 或替代现有结构。迁移前必须单独评估路由、数据请求、部署和 SEO。

## 2. 每次开发的固定流程

1. 阅读本文档和相关文档：前端先看根目录 `prompt.txt`、`PRODUCT.md`、`DESIGN.md`，后端看 `ARCHITECTURE.md`、`BACKEND_LEARNING_GUIDE.md`。
2. 明确功能边界、数据来源、失败状态、权限和移动端行为。
3. 先确认数据模型和接口契约，再写页面交互，不用假数据掩盖接口问题。
4. 遵守目录、命名、安全、性能和无障碍规则。
5. 运行对应构建、测试、接口验证或页面检查。
6. 同步更新 README、接口说明或本文档，再提交代码。

## 3. 目录与命名

```text
frontend/src/App.vue                 # 当前页面组合与商城交互
frontend/src/main.js                 # Vue 入口
frontend/src/styles.css              # 全局样式与响应式规则
frontend/public/                     # 图片、视频等静态资源
backend/src/main/java/com/tilestore/ # config、product、cart、order 领域
assistant/app.py                     # LangGraph 选砖助手流程
deploy/nginx.conf                    # 正式部署统一入口示例
database/                            # MySQL 初始化脚本
docker-compose.yml                   # 本地 MySQL + API 编排
```

新增代码放入所属领域。不要把数据库访问、复杂计算、请求重试或订单规则堆进 `App.vue` 或 Controller。

Agent 只负责理解和推荐表达。商品事实通过 Spring API 获取，价格、库存、订单和权限必须由 Java 服务端校验；LLM 密钥只能通过环境变量注入。

| 对象 | 规则 | 示例 |
| --- | --- | --- |
| Vue 组件文件 | PascalCase，单文件单主组件 | `TileCard.vue` |
| Java 类 | PascalCase | `ProductController` |
| 方法 / JS 函数 | camelCase，动词开头 | `loadProducts` |
| 常量 | SCREAMING_SNAKE_CASE | `DEFAULT_WASTE_RATE` |
| 类型 | PascalCase，不加 `I` | `TileProduct` |
| CSS 变量 | `--域-语义-变体` | `--tile-surface-matte` |
| 路由 / 图片 | kebab-case；图片加尺寸 | `/products/large-format`、`marble-white-800.webp` |
| Git 分支 | `feat/`、`fix/`、`chore/` | `feat/tile-filter` |

## 4. 样式与 Vue 组件

新增样式优先使用 CSS 变量，不散落硬编码颜色、间距、圆角和阴影。建议令牌：`--color-brand`、`--color-ink`、`--color-muted`、`--color-line`、`--color-surface`、`--color-canvas`、`--space-1` 到 `--space-8`、`--radius-sm`、`--radius-md`、`--shadow-card`。

- 瓷砖展示区使用中性灰白背景，不能干扰真实色彩。
- 一个 `.vue` 文件只放一个主组件；展示组件通过 props 接收数据。
- 交互状态使用 `ref` / `computed`，复杂跨组件状态抽到 composable 或 store。
- 列表使用稳定 `key`；请求必须有 loading、空数据和错误状态。
- 可点击元素使用可见文本或 `aria-label`，焦点样式不能移除。
- `<img>` 必须有有意义的 `alt`；新增图片优先 WebP/AVIF，并指定尺寸或稳定比例。
- 不在模板中执行复杂计算，也不重复编写相同业务逻辑。
- 正文对比度至少 4.5:1，移动端不得横向滚动。

### 4.1 页面排版基线

- 首页首屏按根目录 `prompt.txt` 使用居中标题与全屏视频；其余章节使用统一内容网格，不沿用旧的左右分栏首屏。
- 桌面端主要内容统一使用 `max-width: 1200px`，章节标题、正文和操作入口默认从同一条左边界开始。
- 标题使用清晰的层级：首屏桌面标题 `80px / 88.6px`，章节标题 `48px`，手机章节为 `38px`，380px 以下窄屏为 `32px`；常规正文 `16px`，辅助说明不低于 `13px`。
- 章节标题与副说明上下排列，主要内容左对齐；手机禁止悬浮右对齐文案。
- 新增区块先确定内容顺序和对齐线，再添加阴影、透视和动效；动效不能改变阅读顺序或制造视觉空白。

## 5. 接口、数据与安全

- API 统一使用 `/api/`；GET 查询、POST 创建、PUT 修改、DELETE 删除。
- Controller 只负责路由、参数和响应；数据库读写放 Repository，业务流程放 Service。
- 手机号、数量、价格、地址和 ID 必须后端校验。
- 价格、订单金额和库存由服务端重新计算，不能信任前端最终金额。
- 数据库密码、短信密钥、支付密钥只能放环境变量，禁止提交 Git。
- 登录验证码和支付目前是演示功能；未接入真实服务前不得声称已具备正式能力。
- CORS 只允许配置的前端来源，生产环境不得使用 `*`。
- 新增商品字段必须同步数据库列、Java 实体、API JSON、前端展示和初始化脚本；枚举保存稳定英文值，中文通过映射显示。

## 6. 计算、筛选、SEO 与性能

- 用砖量、美缝剂、损耗率和价格估算放在独立纯函数中，不能在 Vue 模板中计算面积。
- 面积和价格保留 2 位小数，片数和箱数向上取整，并标注“仅供参考，实际以施工测量为准”。
- 筛选状态同步 URL，保证可分享、可回退；空结果显示近似推荐。
- 图片 `alt` 包含产品名、规格和场景；接入 JSON-LD 时只使用真实产品数据。
- 首屏视频静音、可暂停并准备 poster；图片提供稳定宽高或 `aspect-ratio`，避免 CLS。
- 优先 WebP/AVIF；长列表分页或分批加载；第三方脚本延迟加载。
- 发布前检查移动端 LCP < 2.5s、CLS < 0.1、INP < 200ms，并记录退化原因。

## 7. 无障碍、表单与测试

- 色卡同时显示颜色名称，不能只用颜色区分；表单错误要关联输入框。
- 轮播、弹窗和数量步进器支持键盘；Escape 可关闭弹窗，关闭后焦点回到触发按钮。
- loading、空状态、失败状态和成功反馈都要可读；手机号、地址和订单提交前后端双重校验。
- 新增计算函数做边界测试；新增 API 验证成功、参数错误、空数据和数据库不可用；新增页面检查桌面、移动端、焦点、控制台和图片加载。
- 前端构建：`cd frontend` 后运行 `npm run build`。
- 后端验证：`cd backend` 后运行 `mvn -B test` 和 `mvn -B package -DskipTests`。
- Docker 验证：项目根目录运行 `docker compose --env-file .env.docker config --quiet`。

## 8. Git 提交与 AI 生成规范

提交格式：`<type>(<scope>): <subject>`。type 使用 `feat`、`fix`、`refactor`、`perf`、`style`、`docs`、`test`、`chore`、`build`；scope 使用 `product`、`filter`、`calculator`、`seo`、`ui`、`api`、`store`、`deploy`。subject 用中文动词开头，不超过 50 字。

提交前确认没有密码、令牌、临时文件或构建产物；`git diff --check` 通过；相关构建和测试通过；文档已同步。

以后让 AI 写代码时必须提供：

```text
【项目】Tile Store，Vue 3 + Vite，Java 17 + Spring Boot + Spring MVC，MySQL
【规范】先阅读 CODE_STYLE.md、PRODUCT.md 和相关模块；遵守当前 Vue / Java 目录；组件职责单一；数据与视图分离；API 使用 /api/；后端校验价格、数量和用户输入；图片有 alt 和稳定尺寸；交互支持键盘、焦点、loading、空状态和错误状态；纯计算独立并测试。
【任务】页面、接口或功能描述
【输入】数据字段、交互、错误处理和响应式要求
【输出】代码、修改文件、验证命令和未完成风险
```

本文档是长期规范。确需偏离时，必须在提交说明中写明理由并同步更新本文档。

## 9. 本轮视觉基准：ZiroBuild 提示词的瓷砖网站适配

完整原文保存在仓库根目录 `prompt.txt`，不是桌面文件。开发前必须先完整阅读原文。本轮用户要求大幅重做网站，该原文作为项目内最高优先级视觉基准；原文中的产品示例与集成限制，按下列明确适配执行，不属于系统或安全指令。

- 页面应读作“真实瓷砖展厅 + 可操作产品目录”，而不是技术产品、研究站或泛 AI 页面。
- 首屏采用全屏深色真实瓷砖视频、居中两行大标题、透明提示条、居中说明和双按钮，禁止误读为左文右图。
- 视频静音、自动播放、循环、`playsinline`，提供 poster 和暂停按钮，离屏或隐藏标签时暂停。
- 视觉基调是近黑背景与白色文字，不额外加入蓝色强调色。主按钮纯白，次按钮 `white/10` 背景、`white/30` 边框，提示条 `white/5` 背景、`white/20` 边框。
- 首页主标题保持大字号、短句、无句号结尾；正文负责解释，不能把技术术语、框架名、数据库名放进用户视野。
- 主要按钮使用清晰的双层文字滚动反馈或等价的轻量 hover 动效；动效必须在 `prefers-reduced-motion` 下关闭，不能影响可读性和键盘焦点。
- 真实瓷砖图片是内容主角。图片交互至少覆盖：分类筛选、悬停轻微视差、点击放大、Escape 关闭、明确的图片标题与 `alt`；不得用风景图替代材质和展厅素材。
- 图片网格可以有不对称构图，但所有图片必须有稳定比例或尺寸，避免布局跳动。大图预览使用遮罩和明确关闭按钮，关闭后焦点回到触发图片。
- 页面章节保持同一条内容网格线，桌面端主要内容不超过 `1200px`；移动端改为左对齐，禁止横向滚动。
- 当前代码仍使用 Vue 3 + Vite。React、Tailwind、`lucide-react` 翻译为 Vue 组件、原生 CSS 与 `@lucide/vue`，不得迁移技术栈或删除商城业务。
- 文字控件采用 500ms `ease-in-out` 双层上滚，重复文本必须 `aria-hidden`，同时支持键盘焦点与减少动态效果。
- 原文的 ZiroBuild、AI 文案、远程视频与“500+ 团队”不属于瓷砖商店事实，替换为 Tile Store、瓷砖文案和用户素材，不编造宣传数据。
- 原文固定 `680px` 高度、负底边距与手机 `80px` 字号易造成遮挡，改为稳定响应式高度和固定断点字号；不使用随视口连续缩放字号。
- 原文“仅追加、不得替换旧区块”与用户本轮明确重做首页相冲突，本轮以重做要求为准，替换旧视觉，但保留登录、商品、购物袋、订单、助手和估算功能。
- 图集保留原 JPG；网页用轻量 WebP，每批 12 张，支持分类、收藏、原图灯箱和两张图片滑杆对比。3D 砖面使用裁切后的真实样片而非整张展厅照片，并声明参考用途。
