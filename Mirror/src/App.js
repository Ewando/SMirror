import './App.scss';
import React, { useState, useEffect } from 'react';
import 'animate.css';
import axios from 'axios';
import QRCode from 'qrcode.react'; 
import Calendar from 'react-calendar';
import Weaher from './components/Weather';
import News from './components/News';
import 'react-calendar/dist/Calendar.css';
import Anecdotes from './components/Anecdotes';

function App() {

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isBright, setIsBright] = useState(false);
  const [ip, setIp] = useState('');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [recognizedUser, setRecognizedUser] = useState('');
  const [lastDetectionTime, setLastDetectionTime] = useState(Date.now());

  useEffect(() => {

    axios.get('http://localhost:3001/getIP')
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

    const motionSocket = new WebSocket('ws://192.168.1.82:5678');
    const recognitionSocket = new WebSocket('ws://192.168.1.82:5670');

    motionSocket.onopen = () => {
      console.log('Motion WebSocket connection established');
    };

    recognitionSocket.onopen = () => {
      console.log('Recognition WebSocket connection established');
    };

    motionSocket.onmessage = (event) => {
      console.log('Message received: ', event.data);
    
      switch (event.data) {
        case "Motion detected":
          setLastDetectionTime(Date.now());
          setIsBright(true); 
          break;
        default:
          console.log("Unrecognized message or gesture");
      }
    };
    
    recognitionSocket.onmessage = (event) => {

      console.log('Message received: ', event.data);
      const data = JSON.parse(event.data);

      if (data.faces.length > 0 && data.faces[0] !== "Unknown") {
        setRecognizedUser(data.faces[0]);
      } else {
        setRecognizedUser('');
      }

      switch (data.gesture) {
        case "Open Palm":
          console.log("Open Palm gesture detected");
          break;
        case "Thumbs Up":
          console.log("Thumbs Up gesture detected");
          setActiveCardIndex(prevIndex => (prevIndex - 1 + 4) % 4); 
          break;
        case "Pointing Up":
          console.log("Pointing Up gesture detected");
          break;
        case "Thumbs Down":
          console.log("Thumbs Down gesture detected");
          break;
        default:
          
      }
    };

    recognitionSocket.onclose = () => {
      console.log('Recognition WebSocket connection closed');
    };

    motionSocket.onclose = () => {
      console.log('Motion WebSocket connection closed');
    };

    setRecognizedUser('ewan');
    setIsBright('true');

    return () => {
      clearInterval(timer);
      motionSocket.close();
      recognitionSocket.close();
    };

    
  }, []);

  const getNextIndex = (currentIndex) => {
    return (currentIndex + 1) % contentTitles.length;
  };

  useEffect(() => {

    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        setActiveCardIndex(prevIndex => (prevIndex + 1) % contentTitles.length);
        console.log("Current Active Card Index:", activeCardIndex);
      }
    };
  
    // Add the keydown event listener
    window.addEventListener('keydown', handleKeyDown);

    const intervalId = setInterval(() => {

      const timeSinceLastDetection = Date.now() - lastDetectionTime;

      if (timeSinceLastDetection > 3000 && recognizedUser === '') {
        setIsBright(false);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(intervalId);
    };
  }, [lastDetectionTime, recognizedUser]);

  const contentTitles = ["Mirror", "Anecdotes", "Ask Myra", "News", "Weather", "Mobile"];

  const showContentAndFooter = recognizedUser && recognizedUser !== "No user detected";

  const renderActiveCard = () => {

    if (!showContentAndFooter) return null; 

    switch (activeCardIndex) {
      case 0: return <div className='contentCard'><p></p></div>;
      case 1: return <div className='contentCard'><Anecdotes /></div>;
      case 2: return <div className='contentCard'><p>Ask Myra</p></div>;
      case 3: return <div className='contentCard'><News/></div>;
      case 4: return <div className='contentCard'><Weaher/></div>;
      case 5: return <div className='contentCard'><p>Mobile</p></div>;
      default: return <div className='contentCard'><p>Unknown Card</p></div>;
    }
  };

  const getNextPageTitle = () => {
    const nextIndex = getNextIndex(activeCardIndex);
    return contentTitles[nextIndex];
  };
  
  return (
    
    <div className={`App ${isBright ? 'brighten' : 'dim'}`}>

      <div className='headerBar'>
       
        <div className={`timeContainer ${isBright ? 'whiteBackground brighten' : ''}`}>
          <h2>{currentDateTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
          <h1>{currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>
        </div>

        <div className='userContainer'>
          <i className={`fa-solid ${recognizedUser === "Unknown" ? 'fa-user-slash' : 'fa-user'}`}></i>
          <p>{recognizedUser === "Unknown" ? 'Unknown user' : recognizedUser || 'No user detected'}</p>
        </div>

      </div>

      {showContentAndFooter && (
        <>
          <section className='content'>
            {renderActiveCard()}
          </section>

          <section className='footer'>
            <p><i className="fa-solid fa-thumbs-up"></i> {getNextPageTitle()}</p>
          </section>
        </>
      )}

      <section className={`userDetectionField ${isBright ? 'brighten' : ''}`}>
      </section>
    </div>
  );
}

export default App;

