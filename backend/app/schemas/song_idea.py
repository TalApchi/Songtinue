from pydantic import BaseModel

class SongIdeaRequest(BaseModel):
    chord_progression: str
    root_note: str
    scale_type: str
    bpm: int

class SongIdeaResponse(BaseModel):
    bars: list[list[str]]
    root_note: str
    scale_type: str
    bpm: int