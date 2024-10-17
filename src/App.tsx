import React, { useState, useEffect } from 'react';

function App() {
  const [currentURL, setCurrentURL] = useState('');
  const [text, setText] = useState('');

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
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Annotation App</h1>
      <input
        type="text"
        value={currentURL}
        onChange={(e) => setCurrentURL(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <textarea
        value={text}
        onChange={handleTextChange}
        className="mb-2 p-2 border border-gray-300 rounded w-full"
        rows={10}
      />
    </div>
  );
}

export default App;
