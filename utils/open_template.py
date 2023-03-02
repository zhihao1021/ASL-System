from os.path import isfile, join

from aiofiles import open as aopen
from fastapi.responses import HTMLResponse


async def open_templates(filepath: str) -> HTMLResponse:
    filepath = filepath if filepath.endswith(".html") else f"{filepath}.html"
    filepath = join("templates", filepath)

    if isfile(filepath):
        async with aopen(filepath, mode="rb") as html_file:
            return HTMLResponse(await html_file.read(), 403)
    return await error_404()


async def error_403() -> HTMLResponse:
    async with aopen("templates/errors/403.html", mode="rb") as html_file:
        return HTMLResponse(await html_file.read(), 403)


async def error_404() -> HTMLResponse:
    async with aopen("templates/errors/404.html", mode="rb") as html_file:
        return HTMLResponse(await html_file.read(), 404)


async def error_500() -> HTMLResponse:
    async with aopen("templates/errors/500.html", mode="rb") as html_file:
        return HTMLResponse(await html_file.read(), 500)
