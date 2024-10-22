import React, { useState, useEffect } from 'react';

function App() {
  const [currentURL, setCurrentURL] = useState('');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const queryTabs = async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs && tabs.length > 0) {
          const url = tabs[0].url || '';
          setCurrentURL(url);
          const storedText = localStorage.getItem(`annotation-${url}`);
          setText(storedText || '');
        }
      } catch (error) {
        console.error('Error querying tabs:', error);
      }
    };

    queryTabs();

    const handleTabChange = () => {
      queryTabs();
    };

    chrome.tabs.onActivated.addListener(handleTabChange);
    chrome.tabs.onUpdated.addListener(handleTabChange);

    return () => {
      chrome.tabs.onActivated.removeListener(handleTabChange);
      chrome.tabs.onUpdated.removeListener(handleTabChange);
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    localStorage.setItem(`annotation-${currentURL}`, newText);
    setMessage('Notes saved!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative">
            <p className="text-gray-600 mb-2 text-center">Current URL: {currentURL}</p>
            <textarea
              value={text}
              onChange={handleTextChange}
              className="p-2 border border-gray-300 w-full h-full" 
              placeholder="Enter your annotation here..."
            />
            {message && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-green-500">{message}</div>
            )}
    </div>
  );
}

export default App;
