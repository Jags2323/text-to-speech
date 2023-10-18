

// // export default Chat;
// import React, { useState } from 'react';
// import './App.css'; // Import your CSS file for styling

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [audio, setAudio] = useState(null);

//   const addMessage = (text, isUser) => {
//     setMessages((prevMessages) => [...prevMessages, { text, isUser }]);
//   };

//   const synthesizeText = async () => {
//     try {
//       const response = await fetch(`http://localhost:8080/texttospeech?text=${text}`);
//       if (response.ok) {
//         const base64Audio = await response.text();
//         setAudio(`data:audio/mp3;base64,${base64Audio}`);
//       } else {
//         console.error('Error:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleSend = () => {
//     addMessage(text, true); // Add the user's message to the list
//     synthesizeText(); // Start text synthesis after adding the message
//     setText(''); // Clear the input text after adding the message
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat">
//         {messages.map((message, index) => (
//           <div key={index} className={`chat-message ${message.isUser ? 'user' : 'assistant'}`}>
//             <div className="chat-bubble">
//               {message.text}
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
//         />
//         <button className="send-button" onClick={handleSend}>
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useState } from 'react';
import './App.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const addMessage = (text, isUser) => {
    setMessages((prevMessages) => [...prevMessages, { text, isUser }]);
  };

  const synthesizeText = async () => {
    try {
      const response = await fetch(`http://localhost:8080/texttospeech?text=${text}`, {
        method: 'GET',
        responseType: 'blob',
      });
  
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        throw new Error('Text synthesis failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleSend = () => {
    addMessage(text, true);
    synthesizeText();
    setText('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default Enter key behavior (form submission)
      handleSend(); // Trigger form submission when Enter key is pressed
    }
  };

  return (
    <div className="chat-container">
      <div className="chat">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.isUser ? 'user' : 'assistant'}`}>
            <div className="chat-bubble">
              {message.text}
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
  );
};

export default Chat;
