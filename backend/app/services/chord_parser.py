def parse_chord_progression(chord_progression: str) -> list[list[str]]:
    bars = chord_progression.split("|")
    parsed_bars: list[list[str]] = []

    for bar in bars:
        chords = bar.strip().split()
        parsed_bars.append(chords)

    return parsed_bars