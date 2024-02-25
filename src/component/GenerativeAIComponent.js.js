import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GenerativeAIComponent = () => {
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputText) return; // Don't run if inputText is empty

    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyDT75CtEx_UizmxF85vcJZ3hTj0Ply5B0Y");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = "Respond with 'True' or 'False' only for the sensitivity/nudity/gore/sexual content of the following text, i.e., if detected, then true, else false: Response with only a boolean value true or false. If vulgar, then true or false. " + inputText;
      const result = await model.generateContent(prompt);
      
      if (result && result.response) {
        const response = result.response;
        response.promptFeedback.safetyRatings.forEach(item => {
          if (item.probability === "HIGH") {
            console.log("High probability vulgar chat");
            // Handle high probability vulgar chat here
            // For example, display a warning message instead of reloading the page
            return;
          }
        });

        const newChatMessages = [...chatMessages, { user: 'You', message: inputText }];
        setChatMessages(newChatMessages);
        setInputText('');
      } else {
        console.error("Invalid response from AI.");
        // Handle error appropriately
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className='flex justify-center flex-col items-center gap-10 bg-white opacity-70 h-[50vh] w-auto ml-auto mr-14 p-10'>
      <div className='flex flex-col justify-center items-center gap-10 bg-transparent mt-auto'>
      <div className="chat-space ml-auto">
        {chatMessages.map((message, index) => (
          <div key={index} className={message.user === 'You' ? 'chat-message user-message' : 'chat-message other-message'}>
            {message.message}
            <strong> : {message.user}</strong>
          </div>
        ))}
      </div>
      <div className='flex justify-center items-center'>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text."
          className='border-2 border-gray-500'
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSubmit} className='text-white bg-black px-5 py-3'>Send</button>
      </div>
      </div>
    </div>
  );
};

export default GenerativeAIComponent;
