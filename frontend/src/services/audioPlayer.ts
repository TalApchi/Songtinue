type PlaybackNote = {
    pitch: string
    step: number
    duration: number
}

type PianoSample = {
    path: string
    rootMidi: number
    lowestMidi: number
    highestMidi: number
}

const pianoSamples: PianoSample[] = [
    {
        path: '/samples/piano/B2.wav',
        rootMidi: 47,
        lowestMidi: 45,
        highestMidi: 48
    },
    {
        path: '/samples/piano/Ds3.wav',
        rootMidi: 51,
        lowestMidi: 49,
        highestMidi: 52
    },
    {
        path: '/samples/piano/Fs3.wav',
        rootMidi: 54,
        lowestMidi: 53,
        highestMidi: 55
    },
    {
        path: '/samples/piano/A3.wav',
        rootMidi: 57,
        lowestMidi: 56,
        highestMidi: 58
    },
    {
        path: '/samples/piano/C4.wav',
        rootMidi: 60,
        lowestMidi: 59,
        highestMidi: 61
    },
    {
        path: '/samples/piano/Ds4.wav',
        rootMidi: 63,
        lowestMidi: 62,
        highestMidi: 64
    },
    {
        path: '/samples/piano/Fs4.wav',
        rootMidi: 66,
        lowestMidi: 65,
        highestMidi: 67
    },
    {
        path: '/samples/piano/A4.wav',
        rootMidi: 69,
        lowestMidi: 68,
        highestMidi: 70
    },
    {
        path: '/samples/piano/C5.wav',
        rootMidi: 72,
        lowestMidi: 71,
        highestMidi: 73
    },
    {
        path: '/samples/piano/Ds5.wav',
        rootMidi: 75,
        lowestMidi: 74,
        highestMidi: 76
    },
    {
        path: '/samples/piano/Fs5.wav',
        rootMidi: 78,
        lowestMidi: 77,
        highestMidi: 79
    },
    {
        path: '/samples/piano/A5.wav',
        rootMidi: 81,
        lowestMidi: 80,
        highestMidi: 82
    },
    {
        path: '/samples/piano/C6.wav',
        rootMidi: 84,
        lowestMidi: 83,
        highestMidi: 85
    },
    {
        path: '/samples/piano/Ds6.wav',
        rootMidi: 87,
        lowestMidi: 86,
        highestMidi: 88
    },
    {
        path: '/samples/piano/Fs6.wav',
        rootMidi: 90,
        lowestMidi: 89,
        highestMidi: 91
    },
    {
        path: '/samples/piano/A6.wav',
        rootMidi: 93,
        lowestMidi: 92,
        highestMidi: 94
    },
    {
        path: '/samples/piano/C7.wav',
        rootMidi: 96,
        lowestMidi: 95,
        highestMidi: 97
    }
]

const pitchOffsets: Record<string, number> = {
    C: 0,
    'C#': 1,
    Db: 1,
    D: 2,
    'D#': 3,
    Eb: 3,
    E: 4,
    F: 5,
    'F#': 6,
    Gb: 6,
    G: 7,
    'G#': 8,
    Ab: 8,
    A: 9,
    'A#': 10,
    Bb: 10,
    B: 11
}

const resolutionLengths: Record<string, number> = {
    '1/4': 1,
    '1/8': 0.5,
    '1/16': 0.25,
    '1/32': 0.125
}

let audioContext: AudioContext | null = null

const sampleBuffers = new Map<string, AudioBuffer>()
const activeSources = new Set<AudioBufferSourceNode>()

function pitchToMidi(pitch: string): number {
    const octave = Number(pitch[pitch.length - 1])
    const noteName = pitch.slice(0, -1)
    const offset = pitchOffsets[noteName]

    if (offset === undefined || Number.isNaN(octave)) {
        throw new Error(`Invalid pitch: ${pitch}`)
    }

    return (octave + 1) * 12 + offset
}

function findPianoSample(midi: number): PianoSample {
    const exactSample = pianoSamples.find(
        (pianoSample) =>
            midi >= pianoSample.lowestMidi &&
            midi <= pianoSample.highestMidi
    )

    if (exactSample) {
        return exactSample
    }

    return pianoSamples.reduce((closestSample, currentSample) => {
        const closestDistance = Math.abs(
            midi - closestSample.rootMidi
        )

        const currentDistance = Math.abs(
            midi - currentSample.rootMidi
        )

        return currentDistance < closestDistance
            ? currentSample
            : closestSample
    })
}

function getAudioContext(): AudioContext {
    if (audioContext === null) {
        audioContext = new AudioContext()
    }

    return audioContext
}

async function loadSample(
    context: AudioContext,
    path: string
): Promise<AudioBuffer> {
    const savedBuffer = sampleBuffers.get(path)

    if (savedBuffer) {
        return savedBuffer
    }

    const response = await fetch(path)
    const contentType = response.headers.get('Content-Type')

    if (
        !response.ok ||
        contentType?.includes('text/html')
    ) {
        throw new Error(
            `Piano sample was not found: ${path}`
        )
    }

    const fileData = await response.arrayBuffer()

    try {
        const decodedAudio =
            await context.decodeAudioData(fileData)

        sampleBuffers.set(path, decodedAudio)

        return decodedAudio
    } catch {
        throw new Error(
            `Could not decode piano sample: ${path}`
        )
    }
}

export function stopPlayback() {
    activeSources.forEach((source) => {
        source.stop()
    })

    activeSources.clear()
}

export async function playNotes(
    notes: PlaybackNote[],
    bpm: string | number,
    resolution: string
) {
    if (notes.length === 0) {
        return
    }

    const numericBpm = Number(bpm)
    const resolutionLength = resolutionLengths[resolution]

    if (
        Number.isNaN(numericBpm) ||
        numericBpm <= 0 ||
        resolutionLength === undefined
    ) {
        throw new Error('Invalid BPM or resolution')
    }

    const context = getAudioContext()

    if (context.state === 'suspended') {
        await context.resume()
    }

    stopPlayback()

    const secondsPerQuarterNote = 60 / numericBpm
    const secondsPerStep = secondsPerQuarterNote * resolutionLength

    const preparedNotes = notes.map((note) => {
        const midi = pitchToMidi(note.pitch)
        const sample = findPianoSample(midi)

        return {
            note,
            midi,
            sample
        }
    })

    const samplePaths = [
        ...new Set(
            preparedNotes.map((preparedNote) => preparedNote.sample.path)
        )
    ]

    await Promise.all(
        samplePaths.map((path) => loadSample(context, path))
    )

    const playbackStart = context.currentTime + 0.1

    preparedNotes.forEach(({ note, midi, sample }) => {
        const audioBuffer = sampleBuffers.get(sample.path)

        if (!audioBuffer) {
            return
        }

        const source = context.createBufferSource()
        const gain = context.createGain()

        const startTime =
            playbackStart + note.step * secondsPerStep

        const noteDuration =
            note.duration * secondsPerStep

        const endTime =
            startTime + noteDuration

        const envelopeTime =
            Math.min(0.01, noteDuration / 4)

        source.buffer = audioBuffer

        source.playbackRate.value = Math.pow(
            2,
            (midi - sample.rootMidi) / 12
        )

        gain.gain.setValueAtTime(0, startTime)
        gain.gain.linearRampToValueAtTime(
            0.75,
            startTime + envelopeTime
        )
        gain.gain.setValueAtTime(
            0.75,
            endTime - envelopeTime
        )
        gain.gain.linearRampToValueAtTime(0, endTime)

        source.connect(gain)
        gain.connect(context.destination)

        activeSources.add(source)

        source.onended = () => {
            activeSources.delete(source)
        }

        source.start(startTime)
        source.stop(endTime + 0.05)
    })
}