import { useState } from 'react'
import './PianoRoll.css'

const pitchClasses = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
]

const pitches = [3, 4, 5, 6]
    .flatMap((octave) =>
        pitchClasses.map((pitchClass) => `${pitchClass}${octave}`)
    )
    .reverse()

const stepsPerBar = 32
const stepWidth = 16
const barWidth = stepsPerBar * stepWidth
const resolutionMultipliers: Record<string, number> = {
    '1/4': 8,
    '1/8': 4,
    '1/16': 2,
    '1/32': 1
}

type PianoNote = {
    pitch: string
    step: number
    duration: number
}

type PianoRollProps = {
    chordProgression: string
    rootNote: string
    scaleType: string
    bpm: string
}

function PianoRoll(props: PianoRollProps) {
    const [layerInstruction, setLayerInstruction] = useState('')
    const [resolution, setResolution] = useState('1/16')
    const resolutionMultiplier = resolutionMultipliers[resolution]
    const [notes, setNotes] = useState<PianoNote[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationError, setGenerationError] = useState('')

    const chordProgression = props.chordProgression
    const rootNote= props.rootNote
    const scaleType = props.scaleType
    const bpm = props.bpm

    const bars = chordProgression
        .split('|')
        .map((bar) => bar.trim())
        .filter((bar) => bar.length > 0)

    const barCount = bars.length
    const totalSteps = stepsPerBar * barCount
    const gridWidth = totalSteps * stepWidth

    const chordsByBar = bars.map((bar) => bar.split(/\s+/))

    async function handleGenerateLayer() {
        setIsGenerating(true)
        setGenerationError('')

        const instructionForAi = 
            notes.length > 0
                ? `${layerInstruction}. Create a different variation from these previous notes: ${JSON.stringify(notes)}`
                : layerInstruction

        try {
            const requestBody = {
                song_idea: {
                    chord_progression: chordProgression,
                    root_note: rootNote,
                    scale_type: scaleType,
                    bpm: Number(bpm)
                },
                layer_instruction: instructionForAi,
                resolution: resolution
            }

            const response = await fetch(
                'http://127.0.0.1:8000/layers/generate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            )

            const data = await response.json()
            console.log(data)
            
            if (!response.ok) {
                throw new Error('Layer generation failed')
            }

            setNotes(data.notes)

        } catch (error) {
            console.error(error)
            setGenerationError('Layer generation failed. Please try again')
        }
        
        finally {
            setIsGenerating(false)
        }
    }

    return (
        <section className="pianoRoll">
            <h2>Piano Roll</h2>

            <div className="layerControls">
                <label className="layerField">
                    <span>What should the AI create?</span>
                    <textarea
                        value={layerInstruction}
                        onChange={(event) =>
                            setLayerInstruction(event.target.value)
                        }
                        placeholder="Create an ascending kalimba melody"
                    />
                </label>

                <label className="layerField">
                    <span>Resolution</span>

                    <select
                        value={resolution}
                        onChange={(event) =>
                            setResolution(event.target.value)
                        }
                    >
                        <option value="1/4">1/4</option>
                        <option value="1/8">1/8</option>
                        <option value="1/16">1/16</option>
                        <option value="1/32">1/32</option>
                    </select>
                </label>

                <button
                    type="button"
                    onClick={handleGenerateLayer}
                    className="generateButton"
                    disabled={isGenerating}
                    >
                        {isGenerating? 'Generating...' : 'Generate Layer'}
                    </button>


            </div>

            {generationError && (
                <p className="generationError">
                    {generationError}
                </p>
            )}

            <div className="pianoScroll">
                <div className="chordTimeline">
                    {chordsByBar.map((chords, barIndex) => (
                        <div
                            className="chordBar"
                            key={barIndex}
                            style={{ width: `${barWidth}px` }}
                        >
                            {chords.map((chord, chordIndex) => (
                                <div
                                    className="chordLabel"
                                    key={`${barIndex}-${chordIndex}`}
                                >
                                    {chord}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="pianoGrid">
                    {pitches.map((pitch) => (
                        <div className="pianoRow" key={pitch}>
                            <div className="pianoKey">
                                {pitch}
                            </div>

                            <div
                                className="noteLane"
                                style={{ width: `${gridWidth}px` }}
                            >
                                {notes
                                    .filter((note) => note.pitch === pitch)
                                    .map((note) => (
                                        <div
                                            className="pianoNote"
                                            key={`${note.pitch}-${note.step}`}
                                            style={{
                                            left: `${note.step * resolutionMultiplier * stepWidth}px`,
                                            width: `${note.duration * resolutionMultiplier * stepWidth}px`                                            }}
                                        ></div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {notes.length > 0 && (
                <div className="layerActions">
                    <button
                        type="button"
                        className="tryAgainButton"
                        onClick={handleGenerateLayer}
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Generating...' : 'Try Again'}
                    </button>
                </div>
            )}

        </section>
    )
}

export default PianoRoll