from pydantic import BaseModel

class GeneratedNote(BaseModel):
    pitch: str
    step: int
    duration: int

class LayerGenerationResponse(BaseModle):
    notes: list[GeneratedNote]