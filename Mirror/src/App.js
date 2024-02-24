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

    const ws = new WebSocket('ws://192.168.1.82:5678');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      console.log('Message received: ', event.data);
      if (event.data === "Motion detected") { // Ensure this matches exactly
        setIsBright(prev => !prev); // Toggle or set state based on the message
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    
  }, []);
  
  

  const timeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  const dateFormatOptions = {
    weekday: 'long', 
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

      <div className='dateTimeModule'> 
          <div className="qrCodeContainer hidden">
            <QRCode value='https://www.youtube.com/watch?v=dQw4w9WgXcQ' size={100}  />
          </div>
          <div className={`timeContainer ${isBright ? 'whiteBackground brighten' : ''}`}>
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