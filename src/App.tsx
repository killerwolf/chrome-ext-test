import React from 'react';
import { Ghost } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Ghost className="w-16 h-16 text-purple-600 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Hello World!</h1>
      <p className="text-gray-600 text-center">
        Welcome to your Chrome extension side panel.
      </p>
    </div>
  );
}

export default App;