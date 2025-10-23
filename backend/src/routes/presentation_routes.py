from typing import Annotated

from fastapi import APIRouter, Response, File, UploadFile, Form
from fastapi.responses import StreamingResponse

from src.schemas.presentation_schemas import EditSlideInSchema, GeneratePresInSchema
from src.services.convert_file_service import convert_file
from src.services.model_service import generate_presentation, edit_one_slide

router = APIRouter(prefix="/presentation")


@router.post("/generate", status_code=201)
async def generate(
    text: Annotated[str, Form(min_length=1)],
    file: Annotated[UploadFile, File()],
    model: Annotated[str, Form()] = "",
) -> Response:
    body = GeneratePresInSchema(text=text, model=model)

    context = await convert_file(file)

    return StreamingResponse(
        generate_presentation(body.text, context, body.model),
        media_type="text/markdown",
    )


@router.post("/edit", status_code=200)
async def edit(body: EditSlideInSchema) -> Response:
    model_res = edit_one_slide(body.text, body.slide, body.action, body.model)

    return Response(content=model_res, media_type="text/markdown")
