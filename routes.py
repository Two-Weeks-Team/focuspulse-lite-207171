from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime

from models import LogEntry, engine
from ai_service import call_daily_plan, call_adaptive_timer
from sqlalchemy.orm import sessionmaker

router = APIRouter()
SessionLocal = sessionmaker(bind=engine)

class LogCreate(BaseModel):
    date: str
    startTime: str
    endTime: str
    blocks: int

class LogResponse(BaseModel):
    id: int
    createdAt: str

class AdaptiveTimerRequest(BaseModel):
    recentBlocks: list[int]
    recentBreaks: list[int]

class AdaptiveTimerResponse(BaseModel):
    suggestedBreak: int

class PlanResponse(BaseModel):
    planItems: list[str]

@router.post("/logs", response_model=LogResponse)
async def create_log(log: LogCreate):
    db = SessionLocal()
    try:
        new_log = LogEntry(
            date=log.date,
            start_time=log.startTime,
            end_time=log.endTime,
            blocks=log.blocks,
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return LogResponse(id=new_log.id, createdAt=new_log.created_at.isoformat())
    finally:
        db.close()

@router.get("/plan", response_model=PlanResponse)
async def get_plan():
    result = await call_daily_plan(messages=[])
    plan_items = result.get("plan_items", [])
    return PlanResponse(planItems=plan_items)

@router.post("/adaptive-timer", response_model=AdaptiveTimerResponse)
async def adaptive_timer(req: AdaptiveTimerRequest):
    messages = [
        {"role": "system", "content": "You are a helpful productivity assistant."},
        {"role": "user", "content": f"Recent blocks: {req.recentBlocks}. Recent breaks: {req.recentBreaks}. Suggest a break duration in minutes."}
    ]
    resp = await call_adaptive_timer(messages=messages)
    suggested = resp.get("suggested_break")
    if suggested is None:
        raise HTTPException(status_code=500, detail="Could not get break suggestion")
    return AdaptiveTimerResponse(suggestedBreak=int(suggested))
