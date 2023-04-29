from api import api_router
from config import NOWTIME, WEB_CONFIG
from sql_init import sql_init

from asyncio import all_tasks, new_event_loop, run
from copy import deepcopy
from os import getenv, getpid, makedirs
from os.path import isdir, isfile

from dotenv import load_dotenv
from fastapi import FastAPI
from uvicorn import Config, Server
from uvicorn.config import LOGGING_CONFIG

if isfile(".env"):
    load_dotenv(".env")
DEBUG = getenv("DEBUG", False)
if type(DEBUG) != bool:
    DEBUG = DEBUG.lower() == "true"
print(f"DEBUG: {DEBUG}")

if __name__ == "__main__":
    with open("PID", mode="w") as pid_file:
        pid_file.write(str(getpid()))

    from platform import system
    if system() == "Windows":
        from asyncio import set_event_loop_policy, WindowsSelectorEventLoopPolicy
        set_event_loop_policy(WindowsSelectorEventLoopPolicy())
    run(sql_init())

    app = FastAPI()
    app.mount("/api", api_router)

    if not isdir("logs"):
        makedirs("logs")

    log_file = f"logs/uvicorn-{NOWTIME().isoformat().replace(':', '_')[:-6]}.log"
    logging_config = deepcopy(LOGGING_CONFIG)
    logging_config["formatters"]["file"] = {
        "()": "uvicorn.logging.DefaultFormatter",
        "fmt": "%(asctime)s %(levelprefix)s %(message)s",
        "use_colors": False,
    }
    logging_config["handlers"]["file"] = {
        "class": "logging.FileHandler",
        "formatter": "file",
        "filename": log_file,
    }
    logging_config["loggers"]["uvicorn"]["handlers"].append("file")
    logging_config["loggers"]["uvicorn.access"]["handlers"].append("file")

    server_config = Config(
        app=app,
        host=WEB_CONFIG.host,
        port=WEB_CONFIG.port,
        log_config=logging_config
    )
    server = Server(server_config)

    loop = new_event_loop()
    app_task = loop.create_task(server.serve())
    loop.run_until_complete(app_task)

    for task in all_tasks(loop):
        task.cancel()
    loop.stop()
