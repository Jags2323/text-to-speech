// import React, { useState } from 'react';
// import './App.css';
// import AudioVisualizer from './AudioVisualizer';

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [wave, setWave] = useState(null); // New state for the wave

//   const addMessage = (text, isUser) => {
//     setMessages((prevMessages) => [...prevMessages, { text, isUser }]);
//   };

//   const synthesizeText = async (text) => {
//     try {
//       const response = await fetch(`http://localhost:8080/texttospeech?text=${text}`, {
//         method: 'GET',
//         responseType: 'blob',
//       });

//       if (response.ok) {
//         const audioBlob = await response.blob();
//         const audioUrl = URL.createObjectURL(audioBlob);
//         const audio = new Audio(audioUrl);
//         audio.play();

//         // Generate a wave image
//       } else {
//         throw new Error('Text synthesis failed');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleSend = () => {
//     if (text) {
//       addMessage(text, true);
//       synthesizeText(text);
//       setText('');
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <><div className="chat-container">
//       <div className="chat">
//         {messages.map((message, index) => (
//           <div key={index} className={`chat-message ${message.isUser ? 'user' : 'assistant'}`}>
//             <div className="chat-bubble">
//               <div className="text-container">
//                 {message.text}
//               </div>
//               <div className="button-container">
//                 {message.isUser && (
//                   <button className="play-button" onClick={() => synthesizeText(message.text)}>
//                     Play
//                   </button>
//                 )}
//                 {wave && (
//                   <img src={wave.toDataURL()} alt="Wave" />
//                 )}

//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="user-input"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyDown} />
//         <button className="send-button" onClick={handleSend}>
//           Submit
//         </button>
//       </div>
//     </div></>
//   );
// };

// export default Chat;

// ////////////

// import React, { useState, useEffect } from 'react';
// import './App.css';
// // import AudioVisualizer from './AudioVisualizer';
// import playButtonGif from './BLkE.gif'; // Replace with the actual path to your GIF

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [messageStates, setMessageStates] = useState([]); // State to manage GIF play state for each message

//   const addMessage = (text, isUser) => {
//     setMessages((prevMessages) => [...prevMessages, { text, isUser }]);
//     setMessageStates((prevStates) => [...prevStates, { isPlaying: false }]); // Initialize the GIF play state
//   };

//   const synthesizeText = async (text, index) => {
//     try {
//       const response = await fetch(`http://localhost:8080/texttospeech?text=${text}`, {
//         method: 'GET',
//         responseType: 'blob',
//       });

//       if (response.ok) {
//         const audioBlob = await response.blob();
//         const audioUrl = URL.createObjectURL(audioBlob);
//         const audio = new Audio(audioUrl);

//         // Start playing the GIF for the corresponding message
//         const newMessageStates = [...messageStates];
//         newMessageStates[index].isPlaying = true;
//         setMessageStates(newMessageStates);

//         audio.onended = () => {
//           // Stop the GIF when audio ends
//           const newMessageStates = [...messageStates];
//           newMessageStates[index].isPlaying = false;
//           setMessageStates(newMessageStates);
//         };

//         audio.play();
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleSend = () => {
//     if (text) {
//       addMessage(text, true);
//       synthesizeText(text, messages.length); // Pass the index of the new message
//       setText('');
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       handleSend();
//     }
//   };

//   // Ensure the GIF starts playing when a new message is added
//   useEffect(() => {
//     if (messages.length > 0) {
//       const lastMessageIndex = messages.length - 1;
//       synthesizeText(messages[lastMessageIndex].text, lastMessageIndex);
//     }
//   }, [messages]);

//   return (
//     <div className="chat-container">
//       <div className="chat">
//         {messages.map((message, index) => (
//           <div key={index} className={`chat-message ${message.isUser ? 'user' : 'assistant'}`}>
//             <div className="chat-bubble">
//               <div className="text-container">
//                 {message.text}
//               </div>
//               <div className="button-container">
//                 {message.isUser && !messageStates[index].isPlaying && (
//                   <button className="play-button" onClick={() => synthesizeText(message.text, index)}>
//                     Play
//                   </button>
//                 )}
//                 {messageStates[index].isPlaying && (
//                   <img
//                     src={playButtonGif}
//                     alt="Play"
//                     style={{
//                       width: '200px', // Set a fixed width
//                       height: '40px', // Set a fixed height
//                     }}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="user-input"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//         <button className="send-button" onClick={handleSend}>
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;

//////

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
      setShowLCPTImage(true); // Show the LCPT image when audio starts
    } else {
      // Stop the audio when the "Stop" button is clicked
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleSend = () => {
    if (text) {
      addMessage(text, true);
      setText("");
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
    }
  }, [messages]);

  const synthesizeText = async (text, index) => {
    try {
      const response = await fetch(
        `http://localhost:8080/texttospeech?text=${text}`,
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
             />
        )}
      </div>
    </div>
  );
};

export default App;
