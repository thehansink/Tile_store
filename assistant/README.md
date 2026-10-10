# Tile Store 选砖助手

这是一个独立的 Python 服务，用 LangGraph 编排选砖推荐流程。它不直接操作订单和支付，也不把价格计算交给模型。

## 流程

```text
用户描述需求
    -> extract_requirements：提取空间、颜色、预算
    -> retrieve_products：从 Spring Boot 商品接口读取真实商品
    -> rank_products：按需求对商品排序
    -> generate_reply：生成解释；有模型密钥时调用 LLM，无密钥时使用规则回复
```

## 本地运行

```powershell
cd D:\work\Tile_store\assistant
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app:app --reload --port 8000 --env-file .env
```

检查：<http://127.0.0.1:8000/health>

## 配置 LLM

`LLM_API_KEY`、`LLM_MODEL` 和可选的 `LLM_BASE_URL` 都只放环境变量，不要提交到 Git。推荐让 LLM 做意图理解和自然语言表达；商品事实、价格、库存、订单金额仍然由 Java 和 MySQL 决定。
