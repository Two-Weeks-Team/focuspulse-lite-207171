from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from models import engine, Base
from routes import router

app = FastAPI(title="FocusPulse Lite API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/", response_class=HTMLResponse)
async def landing_page():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>FocusPulse Lite API</title>
    </head>
    <body style="background:#121212;color:#f1f1f1;font-family:sans-serif;margin:0;padding:20px;">
        <h1 style="color:#0F9D58;">FocusPulse Lite</h1>
        <p>A zero‑friction timer that logs focus blocks without sign‑up.</p>
        <h2>Endpoints</h2>
        <ul>
            <li>GET <b>/health</b> - health check</li>
            <li>GET <b>/</b> - landing page</li>
            <li>GET <b>/plan</b> - AI‑generated daily plan</li>
            <li>POST <b>/adaptive-timer</b> - AI‑suggested break duration</li>
            <li>POST <b>/logs</b> - create a focus log entry</li>
        </ul>
        <p>Tech Stack: FastAPI, Python 3.12, PostgreSQL, DigitalOcean Inference API.</p>
        <p><a href="/docs" style="color:#0F9D58;">OpenAPI Docs</a> | <a href="/redoc" style="color:#0F9D58;">ReDoc</a></p>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


@app.middleware("http")
async def normalize_api_prefix(request: Request, call_next):
    if request.scope.get("path", "").startswith("/api/"):
        request.scope["path"] = request.scope["path"][4:] or "/"
    return await call_next(request)

app.include_router(router)
