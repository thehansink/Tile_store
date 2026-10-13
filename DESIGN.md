---
name: Tile Store
description: 以真实瓷砖展厅、材质照片和黑白控件组织的瓷砖生活馆
colors:
  canvas: "#010000"
  surface: "#131415"
  ink: "#f5f5f5"
  muted: "#b4b5b7"
  line: "rgba(255, 255, 255, 0.2)"
  primary: "#fff"
  primary-ink: "#111"
  primary-hover: "#e7e7e7"
  glass: "rgba(255, 255, 255, 0.1)"
  glass-hover: "rgba(255, 255, 255, 0.2)"
  glass-line: "rgba(255, 255, 255, 0.3)"
  pill: "rgba(255, 255, 255, 0.05)"
typography:
  display:
    fontFamily: '"Microsoft YaHei", "PingFang SC", system-ui, sans-serif'
    fontSize: "80px"
    fontWeight: 500
    lineHeight: "88.6px"
    letterSpacing: "0"
  headline:
    fontFamily: '"Microsoft YaHei", "PingFang SC", system-ui, sans-serif'
    fontSize: "48px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0"
  title:
    fontSize: "17px"
    fontWeight: 500
    letterSpacing: "0"
  body:
    fontSize: "16px"
    lineHeight: 1.9
    letterSpacing: "0"
  label:
    fontSize: "15px"
    fontWeight: 500
    letterSpacing: "0"
rounded:
  sm: "6px"
  md: "8px"
  pill: "999px"
spacing:
  control-gap: "14px"
  action-gap: "16px"
  grid-gap: "24px"
  section: "112px"
  section-mobile: "80px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-glass:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
  button-glass-hover:
    backgroundColor: "{colors.glass-hover}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    size: "44px"
    padding: "0"
  text-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
  navigation-link:
    backgroundColor: "transparent"
    textColor: "#d1d5db"
    typography:
      fontSize: "14px"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "8px 20px"
  filter-chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-ink}"
  gallery-card:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
---

# Design System: Tile Store

## Overview

**Creative North Star: "真实瓷砖展厅"**

让瓷砖的纹理、光泽和铺贴现场成为视觉主角。近黑底色与白色文字退到材质之后，首屏用真实展厅长廊视频建立空间感，居中的“瓷砖生活馆 / Tile Store”直接说明品牌与品类。

设计依据是根目录 `prompt.txt` 的 ZiroBuild 构图，并按 `CODE_STYLE.md` 第 9 节适配为现有 Vue 商城。首屏的透明提示条和双按钮是已确认的视觉要求；后续章节采用左对齐的统一内容网格。这里记录已实现的系统，不另设字体、配色或品牌概念。

**Key Characteristics:**

- 真实瓷砖照片与视频承担内容，黑白控件保持克制。
- 居中视频首屏与左对齐章节形成明确的阅读层级。
- 白色主操作、透明次操作与双层文字上滚提供一致反馈。
- 图集、视频、3D 样片和商城各有独立职责，素材参考与商品事实明确区分。

## Colors

配色由白色主操作和中性深色表面组成，颜色差异来自真实材质素材。

### Primary

- 纯白主操作用于主要按钮、选中筛选项与焦点环；按钮文字使用近黑。主按钮悬停改用柔白，保持同一操作层级。
- 透明白次操作用于次按钮；更亮的透明白用于悬停反馈。其边框比普通分隔线更明显，首屏提示条使用更轻的透明白。

### Neutral

- 近黑画布是页面底色；炭灰表面用于输入框与商品详情。
- 柔白正文用于主要信息；中性灰用于说明、分类与参考提示；透明白细线用于分隔、表单与次级入口。
- 图像预览、抽屉和播放器存在相邻的局部深色背景。这些是媒体与工具表面的处理，不扩展为另一套强调色。

**The Material Color Rule.** 新区块沿用黑白界面；材质颜色由真实照片承担，不额外加入蓝色强调色或渐变文字。

## Typography

显示与正文共用系统无衬线字体，优先 Microsoft YaHei、PingFang SC，再回退到 system-ui 与 sans-serif。没有加载专用显示字体；这符合视觉参考允许的无衬线回退。所有文字字距为零。

首屏显示字的桌面值由前置令牌定义，用于品牌和品类的短句，两行呈现且不以句号收尾。章节标题使用中等字重与平衡换行；说明通常限制在 640px 宽内，正文负责解释纹理、选样与实际使用。

图集标题使用 title 角色；按钮使用 label 角色；正文使用 body 角色。首屏说明是独立的较大正文（18px / 26px），手机改为常规正文（16px / 1.9）。商品系列标题、弹窗与购物袋有各自紧凑的字号，不复用首屏显示字。

**The Fixed Step Rule.** 字号通过固定断点切换，不随视口连续缩放。首屏依次为桌面显示字、平板（64px / 1.15）、手机（48px / 1.3）、窄屏（40px / 1.3）。章节标题在平板及普通手机为（38px），窄屏才降为（32px）。

## Layout

桌面主内容宽度不超过（1200px），页面章节使用同一条左边界。章节垂直间隔由 section 令牌控制，手机使用 section-mobile；段落和标题紧密成组，媒体与操作保持明确间隔。章节本身不包进浮动卡片。

首屏全宽视频铺底，标题、说明和双按钮居中。桌面最小高度为 `max(650px, calc(100dvh - 46px))`，手机为 `max(580px, calc(100dvh - 40px))`，底部留下下一章节的线索，不使用固定 680px 高度或负底边距。

| 范围 | 已实现的布局行为 |
| --- | --- |
| 大于 1023px | 章节总侧边留白 80px；导航横排；图集三列且首图跨两列；商品四列；视频和 3D 章节分栏 |
| 不超过 1023px | 章节总侧边留白 48px；导航改菜单入口；图集、商品改两列；助手与估算器改单列 |
| 不超过 767px | 章节间距缩小；首屏按钮纵排；登录与购物袋以图标呈现；视频、3D、系列与服务改单列；图集仍两列，分类控件内部横向滚动 |
| 不超过 380px | 章节总侧边留白 32px；显示字与章节标题降至窄屏档；播放器高度降为 460px |
| 最小 320px | 页面最小宽度；仍保留两列图集和商品，控件与说明在本身区域内换行 |

图集常规图片为（4:3），桌面首图为（8.25:3），末图按剩余列补齐。商品封面为（4:5），系列图片为（4:3）。图片与媒体使用固定比例或高度，避免加载后改变网格。

## Elevation & Depth

页面主要依靠近黑与炭灰表面、细线和媒体本身建立层次。首屏视频上叠加黑色遮罩，透明提示条与次按钮使用（12px）背景模糊。该处理来自明确的首屏参考，不能扩散为装饰卡片体系。

固定对比栏使用有垂直偏移的软阴影（`0 12px 32px rgba(0, 0, 0, 0.4)`）表达浮于页面之上的操作；图集灯箱使用深色遮罩与（10px）背景模糊保护预览焦点。普通图集和商品不依赖大阴影。

3D 样片在单独的材质体验章节呈现，以真实裁切样片为贴图，保留图片后备画面。它用于观察材质方向，不替代真实商品规格或实物看样。

## Shapes

小控件和输入框使用 sm 圆角，主要按钮、媒体和弹窗使用 md 圆角，数值由前置令牌定义。大面积章节不加外框。

完整胶囊形仅用于首屏提示条，不将章节标题、分类或主要按钮改成胶囊。圆形缩放提示、移除图标与步骤数字是紧凑符号的例外；缩略图等局部元素有（4px）圆角。

细边框表达功能边界，照片在自己的稳定比例内裁切。灯箱与对比媒体采用 contain，用户能查看完整原图。

## Components

### Buttons

主要按钮是纯白、近黑字，次按钮是透明白与清晰细边框；共用最小高度（52px），首屏增加横向内边距（16px 32px）。悬停时背景改变并轻抬（2px），全局 focus-visible 提供白色双像素轮廓和（4px）偏移。禁用按钮降低不透明度且显示不可操作光标。

文字滚动由 `RollingText.vue` 提供：两层相同文字在（500ms ease-in-out）内上下移动（120%）。第二层标记 `aria-hidden`；悬停和键盘焦点都可触发，外层裁切保持控件尺寸不变。减少动态效果时隐藏副本并停用位移。

图标按钮使用 Lucide Vue 图标，标准尺寸（44px），图集操作在手机与窄屏有紧凑尺寸。选中收藏或对比后以白底近黑图标反馈，并提供文字名称、title 和 `aria-pressed`。

### Chips

图集分类使用平直的小圆角文字控件，普通状态为灰字透明底，悬停时变亮，选中为白底近黑字。分类同步 URL 的 `material` 参数并支持浏览器返回。商品分类采用底部白线选中状态，不能混用两种分类语义。

### Cards / Containers

照片和商品是无独立外壳的重复项目：媒体在上，名称、分类或规格在下，操作沿同一网格排列。图集默认显示十二张，可继续加载。收藏保存在当前浏览器；对比最多两张，选齐后开启滑杆对比。

图集悬停或焦点轻微放大照片（1.045 倍），缩放提示显现。商品的指针透视属于轻量查看反馈，手机停用；所有媒体都有稳定比例与有意义的替代文字。照片只作搭配参考，颜色、纹理与规格以实物为准。

### Inputs / Fields

深色输入表面配透明细线，最小高度（48px），沿用 sm 圆角；白色插入光标与全局焦点环保持可见。占位文字使用中性灰，表单说明、校验消息与操作反馈放在关联控件附近。加载、空结果、连接失败与本地演示状态使用直接中文说明，不以假数据隐藏错误。

### Navigation

桌面字标位于左侧、导航居中、登录和购物袋位于右侧；导航灰字在悬停时变白，文字沿用滚动反馈。平板及手机使用菜单按钮打开深色导航面板，菜单链接和 Escape 可关闭。手机隐藏登录和购物袋文字，保留可访问名称与数量。

### Media / Dialogs

首屏使用本地展厅视频 `/videos/showroom-08.mp4` 与对应 poster，静音、循环、内联播放，并提供暂停/播放按钮。离屏、隐藏标签页或减少动态效果时自动暂停。

独立视频章节采用 contain 展示完整片幅，缩略图切换选中的本地视频；3D 体验继续保持独立章节。素材不是背景装饰，也不使用远程风景片替代瓷砖。

图集灯箱使用原图，提供关闭、缩放、前后切换与双图滑杆。原生 dialog 和焦点管理保证键盘留在弹窗内，Escape 关闭并恢复触发入口焦点。商品详情采用紧凑媒体与信息布局；购物袋和演示登录从右侧抽屉打开，手机适配全宽。

## Do's and Don'ts

### Do:

- **Do** 优先使用真实瓷砖照片、样片与展厅视频，让材质成为首要视觉信号。
- **Do** 复用黑白令牌、统一内容网格、固定断点字号与小圆角控件。
- **Do** 为交互提供悬停、键盘焦点、选中、禁用和可读状态反馈。
- **Do** 保留稳定媒体比例、完整灯箱预览、视频暂停与减少动态效果支持。
- **Do** 明确标注本地图片参考、演示价格、手机号登录与支付边界，商品事实以后端为准。

### Don't:

- **Don't** 将已确认的居中视频首屏改回左文右图，或移除首屏透明提示条。
- **Don't** 引入蓝色强调色、渐变文字、风景替代图或编造宣传数字。
- **Don't** 用首屏显示字填充紧凑面板，或让动效改变布局和阅读顺序。
- **Don't** 用浮动卡片包裹整章、嵌套卡片或把所有控件改成胶囊。
- **Don't** 将 ZiroBuild 的 AI 文案、技术栈和远程素材当作瓷砖商品事实。
