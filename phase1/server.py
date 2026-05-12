import os
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from ai_engine import AEGISAI
from scanner.analyzer import scan_project
import uvicorn

app = FastAPI(title="AEGIS Web Dashboard")
templates = Jinja2Templates(directory="templates")
ai_engine = AEGISAI()

# Create templates directory if not exists
os.makedirs("templates", exist_ok=True)

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse(request=request, name="index.html", context={})

@app.post("/scan", response_class=HTMLResponse)
async def scan_folder(request: Request, path: str = Form(".")):
    results = scan_project(path)
    return templates.TemplateResponse(request=request, name="results.html", context={"results": results, "path": path})

@app.post("/fix", response_class=HTMLResponse)
async def fix_code(request: Request, code: str = Form(...), filename: str = Form(None)):
    result = ai_engine.analyze_and_fix(code)
    return templates.TemplateResponse(request=request, name="fix_result.html", context={"result": result, "filename": filename})

def start_web_server():
    print("🚀 AEGIS Web Server starting on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    start_web_server()
