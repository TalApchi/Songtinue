import { useState } from 'react'
import './App.css'
import PianoRoll from './components/PianoRoll'


function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [chords, setChords] = useState('')
  const [rootNote, setRootNote] = useState('C')
  const [scaleType, setScaleType] = useState('major')
  const [bpm, setBpm] = useState('120')
  const [isPianoRollOpen, setIsPianoRollOpen] = useState(false)
  
  if (isPianoRollOpen) {
    return <PianoRoll />
  }

  return (
    <main className="app">
      <section className="intro">
        <p className="eyebrow">AI MUSIC COPILOT</p>
        <h1>Turn your idea into music.</h1>
      </section>

      <section className="songCard">
        <button
          type="button"
          className="startButton"
          onClick={() => setIsFormOpen(true)}
        >
          Start with your song idea
        </button>

        {isFormOpen && (
          <form className="songForm">
            <label className="field">
              <span>Chord progression</span>
              <input
              type="text"
              value={chords}
              onChange={(event) => setChords(event.target.value)}
              placeholder="C | Am | Dm7 G7 | Fmaj7"
              />
            </label>

            <div className="fieldRow">
              <label className="field">
                <span>Root note</span>
                <select
                  value={rootNote}
                  onChange={(event) => setRootNote(event.target.value)}
                >
                  <option value="C">C</option>
                  <option value="C#/Db">C♯ / D♭</option>
                  <option value="D">D</option>
                  <option value="D#/Eb">D♯ / E♭</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="F#/Gb">F♯ / G♭</option>
                  <option value="G">G</option>
                  <option value="G#/Ab">G♯ / A♭</option>
                  <option value="A">A</option>
                  <option value="A#/Bb">A♯ / B♭</option>
                  <option value="B">B</option>
                </select>
              </label>
              <label className="field">
                <span>Scale</span>
                <select
                  value={scaleType}
                  onChange={(event) => setScaleType(event.target.value)}>
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                </select>
              </label>
              <label className="field">
                <span>BPM</span>
                <input
                  type="number"
                  min="40"
                  max="240"
                  value={bpm}
                  onChange={(event) => setBpm(event.target.value)}
                />
              </label>
            </div>
            <button 
              type="button" 
              className="continueButton"
              onClick={() => setIsPianoRollOpen(true)}>
              Continue
              <span aria-hidden="true">→</span>
            </button>
          </form>
        )}
        
      </section>
    </main>
  )
}

export default App