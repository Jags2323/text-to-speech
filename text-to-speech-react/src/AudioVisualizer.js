import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const AudioVisualizer = ({ messageText }) => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);

  const startAudioVisualization = () => {
    const audioElement = audioRef.current;
    const canvasElement = canvasRef.current;
    if (!audioElement || !canvasElement) return;

    if (!audioContext) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(context);

      const analyser = context.createAnalyser();
      const source = context.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(context.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasElement;
      const canvasCtx = canvas.getContext('2d');

      function draw() {
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        dataArray.forEach((value) => {
          const barHeight = value;

          canvasCtx.fillStyle = `rgb(50, 50, ${barHeight + 100})`;
          canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

          x += barWidth + 1;
        });

        requestAnimationFrame(draw);
      }

      audioElement.addEventListener('play', () => {
        context.resume().then(() => {
          draw();
        });
      });

      // Set the audio source and start playback when the component mounts
      audioElement.src = `http://localhost:8080/texttospeech?text=${messageText}`;
      audioElement.play();
    }
  };

  return (
    <div>
      <audio
        ref={audioRef}
        controls
        onPlay={startAudioVisualization}
        style={{ display: 'none' }} // Hide the audio element
      ></audio>
      <FontAwesomeIcon
        icon={faPlay}
        onClick={() => audioRef.current.play()}
        style={{ cursor: 'pointer' }}
      />
      <canvas ref={canvasRef} width={300} height={100} />
    </div>
  );
};

export default AudioVisualizer;
