import './App.scss';
import React, { useState, useEffect } from 'react';
import 'animate.css';
import axios from 'axios';
import QRCode from 'qrcode.react'; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isBright, setIsBright] = useState(true);
  const [ip, setIp] = useState('');
  const [activeCardIndex, setActiveCardIndex] = useState(0); // State for active card index

  useEffect(() => {

    axios.get('http://localhost:3001/getIP') // Adjust the URL as needed
    .then(response => {
      setIp(response.data.ip);
      console.log(response.data.ip);
    })
    .catch(error => {
      console.error('There was an error fetching the IP address:', error);
    });

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    const handleKeyPress = (event) => {
      if (event.key === 'ArrowUp') {
        setActiveCardIndex(prevIndex => (prevIndex - 1 + 4) % 4); // Cycle up through 4 cards
      } else if (event.key === 'ArrowDown') {
        setActiveCardIndex(prevIndex => (prevIndex + 1) % 4); // Cycle down through 4 cards
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const motionSocket = new WebSocket('ws://192.168.1.82:5678');
    const gestureSocket = new WebSocket('ws://192.168.1.82:5679');

    motionSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    gestureSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    motionSocket.onmessage = (event) => {
      console.log('Message received: ', event.data);
    
      switch (event.data) {
        case "Motion detected":
          console.log("Motion Detected");
          setIsBright(true); // Example of setting state based on motion detection
          break;
        default:
          console.log("Unrecognized message or gesture");
      }
    };
    
    gestureSocket.onmessage = (event) => {
      console.log('Message received: ', event.data);
    
      switch (event.data) {
        case "Open Palm":
          console.log("Open Palm gesture detected");
          // Perform an action or update the state based on the Open Palm gesture
          break;
        case "Thumbs Up":
          console.log("Thumbs Up gesture detected");
          setActiveCardIndex(prevIndex => (prevIndex - 1 + 4) % 4); 
          // Perform an action or update the state based on the Thumbs Up gesture
          break;
        case "Pointing Up":
          console.log("Pointing Up gesture detected");
          // Perform an action or update the state based on the Pointing Up gesture
          break;
        case "Thumbs Down":
          console.log("Thumbs Down gesture detected");
          // Perform an action or update the state based on the Thumbs Down gesture
          break;
        default:
          console.log("Unrecognized message or gesture");
      }
    };

    motionSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    gestureSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyPress);
      motionSocket.close();
      gestureSocket.close();
    };
  }, []);

  const renderActiveCard = () => {
    switch (activeCardIndex) {
      case 0:
        return <div className='contentCard'><p>Weather</p></div>;
      case 1:
        return <div className='contentCard'><p>Anecdotes</p></div>;
      case 2:
        return <div className='contentCard'><p>Ask Myra</p></div>;
      case 3:
        return <div className='contentCard'><p>Calendar</p><Calendar /></div>;
      default:
        return <div className='contentCard'><p>Unknown Card</p></div>;
    }
  };

  return (
    <div className={`App ${isBright ? 'brighten' : ''}`}>
      <div className='headerBar'>
        <div className="qrCodeContainer hidden">
          <QRCode value='https://www.youtube.com/watch?v=dQw4w9WgXcQ' size={100} />
        </div>
        <div className={`timeContainer ${isBright ? 'whiteBackground brighten' : ''}`}>
          <h2>{currentDateTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
          <h1>{currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>
        </div>
        <div className='userContainer'>
          <i className="fa-solid fa-user-slash"></i>
          <p>No user detected</p>
        </div>
      </div>

      <section className='contentSection'>
        {renderActiveCard()}
      </section>

      <section className={`userDetectionField ${isBright ? 'brighten' : ''}`}>
      </section>
    </div>
  );
}

export default App;

