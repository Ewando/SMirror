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
  const canvasRef = useRef(null);

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
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
  
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
  
      // Define the maximum dot size and the number of dots
      const dotCount = 50; // Adjust the dot count as needed
      const maxDotSize = 5; // Maximum size of a dot at the edges
  
      // Fill the background with black color
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
  
      // Draw the white dots
      for (let i = 0; i < dotCount; i++) {
        for (let j = 0; j < dotCount; j++) {
          const x = (width / dotCount) * i;
          const y = (height / dotCount) * j;
  
          // Calculate the distance from the center of the canvas
          const dx = centerX - x;
          const dy = centerY - y;
          const distance = Math.sqrt(dx * dx + dy * dy) + 250;
  
          // Determine the size of the dot based on its distance from the center
          const size = maxDotSize * (distance / maxRadius);
  
          // Set the opacity of the dot based on its distance from the center
          // Closer to the center, the dot is more transparent
          const opacity = distance / maxRadius;
  
          // Set the fill style for the dot with the calculated opacity
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  
          // Draw the dot
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
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

      <div className="dateTimeModule"> 
        
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
        <canvas ref={canvasRef}></canvas>
      </section>

    </>
  );
}

export default App;