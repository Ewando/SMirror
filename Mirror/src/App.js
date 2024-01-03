import './App.scss';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalking, faCircleExclamation, faFaceSmileBeam } from '@fortawesome/free-solid-svg-icons';
import 'animate.css';
import axios from 'axios';
import QRCode from 'qrcode.react'; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


function App() {

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isBright, setIsBright] = useState(false);
  const [ip, setIp] = useState('');

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

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        setIsBright(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    
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

    <>

    <div className="App">

      <section className={`systemPrompts ${isBright ? 'brighten' : ''}`}>

        <p className='hidden'><FontAwesomeIcon className='green' icon={faFaceSmileBeam}/> <span>Hello Ewan</span></p>
        <p className='animate__animated animate__flash'><FontAwesomeIcon className='orange' icon={faPersonWalking}/> <span>Motion Detected</span></p>
        <p className='animate__animated animate__flash hidden'><FontAwesomeIcon className='red' icon={faCircleExclamation}/> <span>Unknown user</span></p>
        
      </section>

      <div className={`dateTimeModule ${isBright ? 'whiteBackground' : ''}`}> 
          <div className="qrCodeContainer hidden">
            <QRCode value='https://www.youtube.com/watch?v=dQw4w9WgXcQ' size={100}  />
          </div>
          <div className="timeContainer">
            <h1>{currentDateTime.toLocaleTimeString([], timeFormatOptions)}</h1>
            <h2>{currentDateTime.toLocaleDateString([], dateFormatOptions)}</h2>
          </div>
      </div>


      <section className='contentSection'>
       <Calendar />
      </section>

    </div>

      <section className={`userDetectionField ${isBright ? 'brighten' : ''}`}>
       
      </section>

    </>
  );
}

export default App;