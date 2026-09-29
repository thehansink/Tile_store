# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: existing Vue 3 + Vite frontend with a Java Spring backend and MySQL data layer

## Users

正在装修或准备改善居住空间、需要挑选地面砖、墙面砖或岩板的家庭用户

## Product Purpose

Tile Store 是一个瓷砖选购网站，让用户浏览精选款式、按空间寻找灵感、加入购物袋并提交订单信息。当前阶段优先完成清晰、可信、美观的选砖体验

## Positioning

用清晰的瓷砖纹理、材质对比和小样先看的服务帮助用户减少选砖犹豫，而不是只展示一串规格和价格

## Capabilities and Constraints

- 前端需要支持商品浏览、分类筛选、购物袋、订单信息填写和手机号登录界面
- 当前手机号登录只有前端交互，真实短信验证码服务尚未接入
- 商品、购物袋和订单接口已有 Java 后端；前端 API 基础地址通过 `VITE_API_BASE_URL` 配置
- 后端不可用时，前端可以使用本地精选商品和浏览器本地购物袋完成界面预览
- 页面使用低亮度的暖灰背景和深色商品陈列区，避免大面积纯白造成刺眼感
- 图片应优先是瓷砖样片、表面纹理或产品近景，不使用风景图作为商品视觉

## Brand Commitments

- 保留 `Tile Store` 名称和“瓷砖生活馆”中文定位
- 首页不出现 Vue、数据库、接口、MySQL 等技术术语
- 大标题保持简洁，避免以句号收尾

## Evidence on Hand

- 数据库初始化脚本中的四款商品和瓷砖纹理素材
- 现有 Vue 3 + Vite 前端代码
- 现有商品、购物袋和订单 Java API

## Product Principles

- 先让用户看懂并喜欢，再让用户下决定
- 用真实材质和空间语境替代空泛的宣传语
- 每个操作都给出明确反馈
- 桌面端有呼吸感，移动端保持顺手
