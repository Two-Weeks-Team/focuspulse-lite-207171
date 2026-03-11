import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.orm import declarative_base

# Database URL handling
_db_url = os.getenv("DATABASE_URL", os.getenv("POSTGRES_URL", "sqlite:///./app.db"))
if _db_url.startswith("postgresql+asyncpg://"):
    _db_url = _db_url.replace("postgresql+asyncpg://", "postgresql+psycopg://", 1)
if _db_url.startswith("postgres://"):
    _db_url = _db_url.replace("postgres://", "postgresql+psycopg://", 1)

connect_args = {}
if not _db_url.startswith("sqlite://"):
    host = os.getenv("POSTGRES_HOST", "")
    if host not in ("localhost", "127.0.0.1"):
        connect_args["sslmode"] = "require"

engine = create_engine(_db_url, connect_args=connect_args, echo=False)
Base = declarative_base()

TABLE_PREFIX = "focuspulse_lite_207171_"

class LogEntry(Base):
    __tablename__ = TABLE_PREFIX + "logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    blocks = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
