from pydantic import BaseModel
from app.schemas.song_idea import SongIdeaRequest
from typing import Literal

class LayerGenerationRequest(BaseModel):
    song_idea: SongIdeaRequest
    layer_instruction: str
    resolution: Literal["1/4", "1/8", "1/16", "1/32"]

