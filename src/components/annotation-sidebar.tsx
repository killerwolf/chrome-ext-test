'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Search } from 'lucide-react'

export function AnnotationSidebarComponent() {
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
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex items-center gap-2 p-2 bg-muted/50">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={currentURL}
          readOnly
          className="text-sm bg-transparent border-none"
        />
      </div>

      <div className="flex-grow overflow-auto">
        <Textarea
          placeholder="Enter your annotation here..."
          value={text}
          onChange={handleTextChange}
          className="min-h-[200px] resize-none p-0 h-full"
        />
      </div>

      {message && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-green-500">
          {message}
        </div>
      )}
    </div>
  )
}
