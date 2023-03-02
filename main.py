from config import WEB_CONFIG
from utils import error_403, error_404, error_500

from asyncio import all_tasks, new_event_loop

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from uvicorn import Config, Server

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
async def index():
    pass


@app.exception_handler(403)
async def access_denied(requests, exc):
    return await error_403()


@app.exception_handler(404)
async def not_found(requests, exc):
    return await error_404()


@app.exception_handler(500)
async def internal_server_error(requests, exc):
    return await error_500()


if __name__ == "__main__":
    from platform import system
    if system() == "Windows":
        from asyncio import set_event_loop_policy, WindowsSelectorEventLoopPolicy
        set_event_loop_policy(WindowsSelectorEventLoopPolicy())

    server_config = Config(
        app=app,
        host=WEB_CONFIG.host,
        port=WEB_CONFIG.port
    )
    server = Server(server_config)

    loop = new_event_loop()
    app_task = loop.create_task(server.serve())
    loop.run_until_complete(app_task)

    for task in all_tasks(loop):
        task.cancel()
    loop.stop()
