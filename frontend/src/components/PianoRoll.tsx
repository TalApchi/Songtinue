import './PianoRoll.css'

const pitchClasses = [
    'C', 'C#', 'D', 'D#', 'E', 'F',
    'F#', 'G', 'G#', 'A', 'A#', 'B'
]

const pitches = [3, 4, 5, 6]
    .flatMap((octave) =>
        pitchClasses.map((pitchClass) => `${pitchClass}${octave}`)
    )
    .reverse()

const stepsPerBar = 32
const barCount = 4
const totalSteps = stepsPerBar * barCount
const stepWidth = 16
const gridWidth = totalSteps * stepWidth

type PianoNote = {
    pitch: string
    step: number
    duration: number
}

const exampleNotes: PianoNote[] = [
    { pitch: 'C4', step: 0, duration: 4 },
    { pitch: 'E4', step: 8, duration: 4 },
    { pitch: 'G4', step: 16, duration: 8 },
    { pitch: 'C5', step: 24, duration: 4 }
]

function PianoRoll() {
    return (
        <section className="pianoRoll">
            <h2>Piano Roll</h2>

            <div className="pianoGrid">
                {pitches.map((pitch) => (
                    <div className="pianoRow" key={pitch}>
                        <div className="pianoKey">{pitch}</div>

                        <div
                            className="noteLane"
                            style={{ width: `${gridWidth}px` }}
                        >
                            {exampleNotes
                                .filter((note) => note.pitch === pitch)
                                .map((note) => (
                                    <div
                                        className="pianoNote"
                                        key={`${note.pitch}-${note.step}`}
                                        style={{
                                            left: `${note.step * stepWidth}px`,
                                            width: `${note.duration * stepWidth}px`
                                        }}
                                    ></div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PianoRoll