import requests

from app.schemas.layer_request import LayerGenerationRequest
from app.schemas.layer_response import LayerGenerationResponse


def generate_layer_with_ai(
    request: LayerGenerationRequest,
    parsed_bars: list[list[str]],
    steps_per_bar: int,
    total_steps: int,
    api_key: str,
) -> LayerGenerationResponse:
    prompt = f"""
Create a musical note layer.

Chord progression by bars: {parsed_bars}
Root note: {request.song_idea.root_note}
Scale: {request.song_idea.scale_type}
BPM: {request.song_idea.bpm}
Layer instruction: {request.layer_instruction}
Resolution: {request.resolution}
Steps per bar: {steps_per_bar}
Total steps: {total_steps}

Return notes with:
- pitch
- step
- duration

Every step must be between 0 and {total_steps - 1}.
Every duration must be at least 1.
A note must not continue past step {total_steps}.
"""

    openrouter_request = {
        "model": "openai/gpt-5-mini",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You create musical note layers. "
                    "Return only valid JSON with a notes array. "
                    "Each note must contain pitch, step and duration."
                ),            
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "response_format": {
          "type": "json_object",
        },
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json=openrouter_request,
        timeout=60,
    )

    response.raise_for_status()
    response_data = response.json()

    ai_content = response_data["choices"][0]["message"]["content"]

    return LayerGenerationResponse.model_validate_json(ai_content)