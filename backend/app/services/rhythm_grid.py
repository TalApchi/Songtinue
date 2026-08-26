def get_steps_per_bar(resolution: str) -> int:
    steps_by_resolution = {
        "1/4": 4,
        "1/8": 8,
        "1/16": 16,
        "1/32": 32,
    }

    return steps_by_resolution[resolution]