import './App.scss';
import React, { useState, useEffect } from 'react';

function App() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isBright, setIsBright] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        setIsBright(prev => !prev); // Toggle the brightness state
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const timeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  const dateFormatOptions = {
    day: 'numeric',
    month: 'long'
  };

  return (
    <div className="App">
      <div className={`userDetectionField ${isBright ? 'brighten' : 'dim'}`}></div>
      <section className='dateTimeModule'>
        <h1>{currentDateTime.toLocaleTimeString([], timeFormatOptions)}</h1>
        <h2>{currentDateTime.toLocaleDateString([], dateFormatOptions)}</h2>
      </section>
    </div>
  );
}

export default App;