import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [audio, setAudio] = useState('');

  const synthesizeText = async () => {
    try {
      const response = await fetch(`http://localhost:8080/texttospeech/synthesize?text=${text}`);
      if (response.ok) {
        const base64Audio = await response.text();
        setAudio(base64Audio);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Text-to-Speech App</h1>
      <textarea
        placeholder="Enter text to synthesize"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={synthesizeText}>Synthesize</button>
      {audio && <audio controls src={`data:audio/mp3;base64,${audio}`} />}
    </div>
  );
}

export default App;
