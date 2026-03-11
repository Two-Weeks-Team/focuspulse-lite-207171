import os
import httpx
import json
import re

API_URL = "https://inference.do-ai.run/v1/chat/completions"
MODEL = os.getenv("DO_INFERENCE_MODEL", "openai-gpt-oss-120b")
TOKEN = os.getenv("DIGITALOCEAN_INFERENCE_KEY")


def _extract_json(text: str) -> str:
    m = re.search(r"```(?:json)?\s*\n?([\s\S]*?)\n?\s*```", text, re.DOTALL)
    if m:
        return m.group(1).strip()
    m = re.search(r"(\{.*\}|\[.*\])", text, re.DOTALL)
    if m:
        return m.group(1).strip()
    return text.strip()

def _coerce_unstructured_payload(raw_text: str) -> Dict[str, Any]:
    compact = raw_text.strip()
    tags = [part.strip(" -•\t") for part in re.split(r",|\\n", compact) if part.strip(" -•\t")]
    return {
        "note": "Model returned plain text instead of JSON",
        "raw": compact,
        "text": compact,
        "summary": compact,
        "tags": tags[:6],
    }


async def _call_inference(messages, max_tokens=512):
    payload = {
        "model": MODEL,
        "messages": messages,
        "max_completion_tokens": max_tokens,
    }
    headers = {}
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            resp = await client.post(API_URL, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            json_str = _extract_json(content)
            try:
                return json.loads(json_str)
            except Exception:
                return {"note": "Failed to parse AI JSON response"}
    except Exception as e:
        return {"note": f"AI service unavailable: {e}"}

async def call_daily_plan(messages):
    return await _call_inference(messages=messages, max_tokens=512)

async def call_adaptive_timer(messages):
    return await _call_inference(messages=messages, max_tokens=512)

async def call_mood_intensity(messages):
    return await _call_inference(messages=messages, max_tokens=512)
