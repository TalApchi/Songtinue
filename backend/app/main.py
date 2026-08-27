from fastapi import FastAPI, HTTPException
import os

from app.schemas.layer_response import LayerGenerationResponse
from app.services.openrouter_client import generate_layer_with_ai
from dotenv import load_dotenv
from app.schemas.layer_request import LayerGenerationRequest
from app.services.chord_parser import parse_chord_progression
from app.services.rhythm_grid import get_steps_per_bar

load_dotenv()

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/layers/generate")
def generate_layer(request: LayerGenerationRequest) -> LayerGenerationResponse:
    
    parsed_bars = parse_chord_progression(request.song_idea.chord_progression)
    steps_per_bar = get_steps_per_bar(request.resolution)
    total_steps = len(parsed_bars) * steps_per_bar

    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENROUTER_API_KEY is missing"
            )

    generated_layer = generate_layer_with_ai(
        request=request,
        parsed_bars=parsed_bars,
        steps_per_bar=steps_per_bar,
        total_steps=total_steps,
        api_key=api_key,
    )

    return generated_layer

    
    