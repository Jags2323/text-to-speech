
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import playButtonGif from "./wave.gif";
import staticImage from "./wave-static.jpg";
import playButtonImage from "./play.jpg";
import stopButtonImage from "./pause.jpg";
import LCPTImage from "./LCPT.gif";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [messageStates, setMessageStates] = useState([]);
  const audioRef = useRef(null);
  const [showLCPTImage, setShowLCPTImage] = useState(false);

  const addMessage = (text, isUser) => {
    setMessages((prevMessages) => [...prevMessages, { text, isUser }]);
    setMessageStates((prevStates) => [...prevStates, { isPlaying: true }]);
  };

  const handlePlayClick = (index) => {
    const newMessageStates = [...messageStates];
    newMessageStates[index].isPlaying = !newMessageStates[index].isPlaying;
    setMessageStates(newMessageStates);

    if (newMessageStates[index].isPlaying) {
      // Start or restart playing the audio when the "Play" button is clicked
      synthesizeText(messages[index].text, index);
      setShowLCPTImage(true);
    } else {
      // Stop the audio when the "Stop" button is clicked
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setShowLCPTImage(false); 
    }
  };

  const handleSend = () => {
    if (text) {
      addMessage(text, true);
      setText("");
      setShowLCPTImage(true); // Show the LCPT image when "Submit" is clicked
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };
  

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessageIndex = messages.length - 1;
      synthesizeText(messages[lastMessageIndex].text, lastMessageIndex);
      setShowLCPTImage(true); // Show the LCPT image when audio starts
    }
  }, [messages]);

  const synthesizeText = async (text, index) => {
    try {
      const response = await fetch(
        `https://text-to-speech-java-h44vex6pvq-uc.a.run.app/texttospeech?text=${text}`,
        {
          method: "GET",
          responseType: "blob",
        }
      );

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const newAudio = new Audio(audioUrl);

        newAudio.onended = () => {
          // Stop the LCPT image when audio ends
          setShowLCPTImage(false);
          // Stop the GIF when audio ends
          const newMessageStates = [...messageStates];
          newMessageStates[index].isPlaying = false;
          setMessageStates(newMessageStates);
        };

        audioRef.current = newAudio; // Set the audio element reference
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      } else {
        console.error("Audio response was not ok.");
      }
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <div className="chat">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.isUser ? "user" : "assistant"
              }`}
            >
              <div className="text-container">{message.text}</div>
              <div className="button-container">
                {message.isUser && (
                  <button
                  className="play-button"
                  onClick={() => handlePlayClick(index)}
                >
                  {messageStates[index].isPlaying ? (
                    <img
                      src={stopButtonImage}
                      alt="Stop"
                      className="stop-button"
                      style={{
                        borderTopLeftRadius: "10px", /* Adjust the border radius value as needed */
                        borderBottomLeftRadius: "10px" /* Adjust the border radius value as needed */
                      }}
                    />
                  ) : (
                    <img
                      src={playButtonImage}
                      alt="Play"
                      className="play-button"
                      style={{
                        borderTopLeftRadius: "10px", /* Adjust the border radius value as needed */
                        borderBottomLeftRadius: "10px" /* Adjust the border radius value as needed */
                      }}
                    />
                  )}
                </button>
                )}

                <img
                  src={
                    messageStates[index].isPlaying ? playButtonGif : staticImage
                  }
                  alt="Play"
                  style={{
                    width: "200px",
                    height: "40px",
                    borderTopRightRadius: "10px", /* Adjust the border radius value as needed */
      borderBottomRightRadius: "10px"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            className="user-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-button" onClick={handleSend}>
            Submit
          </button>
        </div>
      </div>
      <div className="lcpt-container">
        {showLCPTImage && (
          <img
            src={LCPTImage}
            alt="LCPT"
            style={{
              height:"400px",
              width:"500px",
            }}
             />
        )}
      </div>
    </div>
  );
};

export default App;
