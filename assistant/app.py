"""LangGraph powered tile recommendation service.

The service keeps product truth in the Spring API. LangGraph only coordinates
conversation state and recommendation reasoning; it never calculates prices
or creates orders.
"""

from __future__ import annotations

import os
from typing import Any, TypedDict

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langgraph.graph import END, START, StateGraph
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)


class AssistantState(TypedDict, total=False):
    message: str
    requirements: dict[str, Any]
    products: list[dict[str, Any]]
    recommendations: list[dict[str, Any]]
    reply: str


PRODUCT_API_URL = os.getenv("PRODUCT_API_URL", "http://localhost:8080/api/products")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "")

app = FastAPI(title="Tile Store 选砖助手", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("ASSISTANT_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if origin.strip()],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"]
)


def extract_requirements(state: AssistantState) -> AssistantState:
    """Collect simple signals first; an LLM can enrich this later."""
    message = state["message"].lower()
    category = ""
    if any(word in message for word in ("卫生间", "厨房", "墙面")):
        category = "wall"
    elif any(word in message for word in ("岩板", "岛台", "台面", "电视墙")):
        category = "slab"
    elif any(word in message for word in ("客厅", "卧室", "地面", "地砖")):
        category = "floor"

    tone = ""
    if any(word in message for word in ("暖", "棕", "木", "米", "奶油")):
        tone = "warm"
    elif any(word in message for word in ("黑", "深", "沉")):
        tone = "dark"
    elif any(word in message for word in ("灰", "冷", "浅")):
        tone = "neutral"

    budget = None
    for token in message.replace("每平方米", " ").replace("预算", " ").split():
        digits = "".join(character for character in token if character.isdigit() or character == ".")
        if digits:
            try:
                budget = float(digits)
                break
            except ValueError:
                continue

    return {"requirements": {"category": category, "tone": tone, "budget": budget}}


async def retrieve_products(state: AssistantState) -> AssistantState:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(PRODUCT_API_URL)
            response.raise_for_status()
            products = response.json()
    except (httpx.HTTPError, ValueError):
        products = []
    return {"products": products}


def rank_products(state: AssistantState) -> AssistantState:
    requirements = state.get("requirements", {})
    products = state.get("products", [])
    category = requirements.get("category")
    tone = requirements.get("tone")
    budget = requirements.get("budget")

    def score(product: dict[str, Any]) -> float:
        value = 0.0
        name = str(product.get("name", ""))
        price = float(product.get("price", 0) or 0)
        if category and product.get("category") == category:
            value += 5
        if tone == "warm" and any(word in name for word in ("棕", "奶油")):
            value += 3
        if tone == "dark" and any(word in name for word in ("黑", "墨")):
            value += 3
        if tone == "neutral" and any(word in name for word in ("灰", "白")):
            value += 3
        if budget is not None:
            value += max(0, 3 - abs(price - budget) / max(budget, 1))
        return value

    recommendations = []
    for product in sorted(products, key=score, reverse=True)[:3]:
        matched = []
        if category and product.get("category") == category:
            matched.append({"floor": "地面砖", "wall": "墙面砖", "slab": "岩板"}.get(category, "适用空间"))
        if tone == "warm" and any(word in str(product.get("name", "")) for word in ("棕", "奶油")):
            matched.append("暖色调")
        elif tone == "dark" and any(word in str(product.get("name", "")) for word in ("黑", "墨")):
            matched.append("深色调")
        elif tone == "neutral" and any(word in str(product.get("name", "")) for word in ("灰", "白")):
            matched.append("中性色")
        item = dict(product)
        item["recommendationReason"] = "、".join(matched) if matched else "综合你的描述筛选"
        recommendations.append(item)
    return {"recommendations": recommendations}


async def generate_reply(state: AssistantState) -> AssistantState:
    recommendations = state.get("recommendations", [])
    requirements = state.get("requirements", {})
    if not recommendations:
        return {"reply": "我暂时没有读到商品数据。你可以先告诉我使用空间、喜欢的颜色和预算，我再继续帮你缩小范围"}

    names = "、".join(str(product.get("name", "精选瓷砖")) for product in recommendations)
    category_text = {"floor": "地面砖", "wall": "墙面砖", "slab": "岩板"}.get(requirements.get("category"), "瓷砖")
    rule_reply = f"根据你的描述，我先从{category_text}里挑了：{names}。你可以打开任意一款查看规格，再用用量估算确认需要买多少"
    if not LLM_API_KEY:
        return {"reply": rule_reply}

    try:
        llm = ChatOpenAI(
            api_key=LLM_API_KEY,
            model=LLM_MODEL,
            base_url=LLM_BASE_URL or None,
            temperature=0.3,
        )
        prompt = (
            "你是瓷砖选购顾问。用简洁、自然的中文回复用户，最多三句话。"
            "只能基于候选商品回答，不得编造库存、功效、价格或支付能力。"
            f"用户需求：{state['message']}。候选商品：{names}。"
            "提醒用户可以查看详情和使用用量估算。"
        )
        response = await llm.ainvoke(prompt)
        content = response.content if isinstance(response.content, str) else rule_reply
        return {"reply": content.strip() or rule_reply}
    except Exception:
        # Model outage should not take down product discovery.
        return {"reply": rule_reply}


def build_graph():
    graph = StateGraph(AssistantState)
    graph.add_node("extract_requirements", extract_requirements)
    graph.add_node("retrieve_products", retrieve_products)
    graph.add_node("rank_products", rank_products)
    graph.add_node("generate_reply", generate_reply)
    graph.add_edge(START, "extract_requirements")
    graph.add_edge("extract_requirements", "retrieve_products")
    graph.add_edge("retrieve_products", "rank_products")
    graph.add_edge("rank_products", "generate_reply")
    graph.add_edge("generate_reply", END)
    return graph.compile()


recommendation_graph = build_graph()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "engine": "langgraph", "llm": "configured" if LLM_API_KEY else "rule-based"}


@app.post("/recommend")
async def recommend(request: RecommendationRequest) -> dict[str, Any]:
    result = await recommendation_graph.ainvoke({"message": request.message})
    return {
        "reply": result.get("reply", "我再帮你看看"),
        "requirements": result.get("requirements", {}),
        "recommendations": result.get("recommendations", []),
        "engine": "langgraph",
        "llmConfigured": bool(LLM_API_KEY)
    }
