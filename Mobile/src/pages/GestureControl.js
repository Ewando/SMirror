import React from 'react';
import './pages.css';
import hand1 from '../content/1.png';
import hand2 from '../content/2.png';
import hand3 from '../content/3.png';
import hand4 from '../content/4.png';
import hand5 from '../content/5.png';

const GestureControl = () => {
    return (
        <section className='appSection'>

            <main className='gestureContainer'>

                <div className='gestureCard'>
                    <h2>1</h2>
                    <img src={hand1} alt="Gesture 1" />
                </div>

                <div className='gestureCard'>
                    <h2>2</h2>
                    <img src={hand2} alt="Gesture 2" />
                </div>

                <div className='gestureCard'>
                    <h2>3</h2>
                    <img src={hand3} alt="Gesture 3" />
                </div>

                <div className='gestureCard'>
                    <h2>4</h2>
                    <img src={hand4} alt="Gesture 4" />
                </div>

                <div className='gestureCard'>
                    <h2>5</h2>
                    <img src={hand5} alt="Gesture 5" />
                </div>

            </main>

        </section>
    );
};

export default GestureControl;
