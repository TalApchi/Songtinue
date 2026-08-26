from fastapi import FastAPI
from app.schemas.layer_request import LayerGenerationRequest
from app.services.chord_parser import parse_chord_progression
from app.services.rhythm_grid import get_steps_per_bar

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/layers/generate")
def generate_layer(request: LayerGenerationRequest):
    
    parsed_bars = parse_chord_progression(request.song_idea.chord_progression)

    steps_per_bar = get_steps_per_bar(request.resolution)
    total_steps = len(parsed_bars) * steps_per_bar

    return {
        "bars": parsed_bars,
        "steps_per_bar": steps_per_bar,
        "total_steps": total_steps,
    }
    