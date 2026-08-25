from fastapi import FastAPI
from app.schemas.song_idea import SongIdeaRequest, SongIdeaResponse
from app.services.chord_parser import parse_chord_progression

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/song-ideas/validate")
def validate_song_idea(song_idea: SongIdeaRequest) -> SongIdeaResponse:
    parsed_bars = parse_chord_progression(song_idea.chord_progression)
    
    return SongIdeaResponse(
        bars = parsed_bars,
        root_note = song_idea.root_note,
        scale_type = song_idea.scale_type,
        bpm = song_idea.bpm,
    )