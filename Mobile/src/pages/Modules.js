import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Modules = () => {

    const [expandedCard, setExpandedCard] = useState(null);
    const [weatherShownOnMirror, setWeatherShownOnMirror] = useState(false);
    const [weatherLocation, setWeatherLocation] = useState('');



    const handleCardOpen = cardId => {
        setExpandedCard(cardId);
        if (cardId === 'weather') {
            initializeAutocomplete();
        }
    };

    const handleCardClose = (event) => {
        event.stopPropagation(); 
        setExpandedCard(null);
    };

    useEffect(() => {

        const fetchConfigs = async () => {
            const userId = await fetchUserIdByEmail(); // Reuse the previously defined function
            if (!userId) {
                console.error('User ID is missing');
                return;
            }
    
            try {
                const response = await axios.get(`http://localhost:3001/getModuleConfig/${userId}`);
                if (response.status === 200 && response.data) {
            
                    response.data.forEach(config => {
                        if (config.moduleId === 'weather') {
                            // Set state based on fetched config
                            setWeatherShownOnMirror(config.config.shownOnMirror);
                           setWeatherLocation(config.config.location);
                        }
                        // Handle other modules similarly
                    });
                } else {
                    throw new Error('Failed to fetch configurations');
                }
            } catch (error) {
                console.error('Error fetching configurations:', error);
            }
        };
    
        fetchConfigs();
    }, []); 
    

    const initializeAutocomplete = () => {
        
        const input = document.getElementById('autocomplete');

        if (!input) {
            console.error('Autocomplete input field not found');
            return;
        }
        
        const autocomplete = new window.google.maps.places.Autocomplete(input);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            console.log(place); 
        });
    };

    const fetchUserIdByEmail = async () => {

        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            console.error('User email is missing');
            return null;
        }
    
        try {
            const response = await axios.get(`http://localhost:3001/user?email=${encodeURIComponent(userEmail)}`);
            if (response.status === 200 && response.data) {
                console.log('User ID fetched successfully');
                return response.data._id; 
            } else {
                throw new Error('Failed to fetch user ID');
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return null;
        }

    };
    

    const saveModuleConfig = async (moduleId, config) => {

        const userId = await fetchUserIdByEmail();
        if (!userId) {
            console.error('Failed to fetch user ID or user ID is missing');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3001/saveModuleConfig', {
                userId,
                moduleConfig: {
                    moduleId,
                    config,
                },
            });
    
            if (response.status === 201) {
                console.log('Configuration saved successfully');
            } else {
                throw new Error('Failed to save configuration');
            }
        } catch (error) {
            console.error('Error saving module configuration:', error);
        }
    };
    

    const handleSaveWeatherConfig = (event) => {

        event.stopPropagation();
    
        const config = {
            shownOnMirror: weatherShownOnMirror,
            location: weatherLocation 
        };
    
        saveModuleConfig('weather', config).then(() => {
            setExpandedCard(null);
        }).catch(error => {
            console.error('Error saving weather configuration:', error);
        });

    };
    
    return (
        <section className='appSection'>

            <main className='moduleContainer'>

                <div className={`moduleCard ${expandedCard === 'weather' ? 'expanded' : ''}`} onClick={() => handleCardOpen('weather')}>
                    <h2><i className="fa-solid fa-cloud"></i> Weather</h2>
                    {expandedCard === 'weather' && (
                        <>
                            <hr />

                            <h3>Show on mirror</h3>

                            <label className="switch">
                            <input 
                            id="weatherShownOnMirror" 
                            type="checkbox"
                            checked={weatherShownOnMirror} 
                            onChange={(e) => setWeatherShownOnMirror(e.target.checked)} />
                            <span className="slider round"></span>
                            </label>

                            <hr />

                            <h3>Weather Location</h3>

                            <input 
                            id="autocomplete" 
                            type="text" 
                            placeholder="Enter city name"
                            value={weatherLocation} 
                            onChange={(e) => setWeatherLocation(e.target.value)} 
                            />
                        </>
                    )}
                  {expandedCard === 'weather' && <button className='closeModule' onClick={handleSaveWeatherConfig}>Save changes</button>}
                </div>

                <div className={`moduleCard ${expandedCard === 'news' ? 'expanded' : ''}`} onClick={() => handleCardOpen('news')}>
                    <h2><i className="fa-regular fa-newspaper"></i> News</h2>
                    {expandedCard === 'news' && (
                        <>
                           <hr />

                           <h3>Show on mirror</h3>

                            <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                            </label>

                            <hr />

                            <h3>News Preferences</h3>

                            <label className="newsBox" htmlFor="newsBusiness">Business<input type="checkbox" id="newsBusiness" name="newsBusiness" value="Business"/></label><br/>

                            <label className="newsBox" htmlFor="newsEntertainment">Entertainment<input type="checkbox" id="newsEntertainment" name="newsEntertainment" value="Entertainment"/></label><br/>

                            <label className="newsBox" htmlFor="newsGeneral">General<input type="checkbox" id="newsGeneral" name="newsGeneral" value="General"/></label><br/>

                            <label className="newsBox" htmlFor="newsHealth">Health<input type="checkbox" id="newsHealth" name="newsHealth" value="Health"/></label><br/>

                            <label className="newsBox" htmlFor="newsScience">Science<input type="checkbox" id="newsScience" name="newsScience" value="Science"/></label><br/>

                            <label className="newsBox" htmlFor="newsSports">Sports<input type="checkbox" id="newsSports" name="newsSports" value="Sports"/></label><br/>
                            
                            <label className="newsBox" htmlFor="newsTechnology">Technology<input type="checkbox" id="newsTechnology" name="newsTechnology" value="Technology"/></label><br/>
                           
                        </>
                    )}
                    {expandedCard === 'news' && <button className='closeModule' onClick={handleCardClose}>Save changes</button>}
                </div>

                <div className={`moduleCard ${expandedCard === 'calendar' ? 'expanded' : ''}`} onClick={() => handleCardOpen('calendar')}>
                    <h2><i className="fa-solid fa-calendar"></i> Calendar</h2>
                    {expandedCard === 'calendar' && (
                        <>
                           
                        </>
                    )}
                    {expandedCard === 'calendar' && <button onClick={handleCardClose}>Save changes</button>}
                </div>

                <div className={`moduleCard ${expandedCard === 'checklist' ? 'expanded' : ''}`} onClick={() => handleCardOpen('checklist')}>
                    <h2><i className="fa-solid fa-bullseye"></i> Checklist</h2>
                    {expandedCard === 'checklist' && (
                        <>
                           
                        </>
                    )}
                    {expandedCard === 'checklist' && <button className='closeModule' onClick={handleCardClose}>Save changes</button>}
                </div>

                <div className={`moduleCard ${expandedCard === 'directions' ? 'expanded' : ''}`} onClick={() => handleCardOpen('directions')}>
                    <h2><i className="fa-solid fa-map"></i> Directions</h2>
                    {expandedCard === 'directions' && (
                        <>
                           
                        </>
                    )}
                    {expandedCard === 'directions' && <button className='closeModule' onClick={handleCardClose}>Save changes</button>}
                </div>

                <div className={`moduleCard ${expandedCard === 'anecdotes' ? 'expanded' : ''}`} onClick={() => handleCardOpen('anecdotes')}>
                    <h2><i className="fa-solid fa-brain"></i> Anecdotes</h2>
                    {expandedCard === 'anecdotes' && (
                        <>

                        <hr />

                        <h3>Show on mirror</h3>

                        <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                        </label>

                        <hr />

                        <h3>Prefereces</h3>
                           
                        <label className="newsBox" htmlFor="anecdotesJokes">Jokes<input type="checkbox" id="anecdotesJokes" name="anecdotesJokes" value="Jokes"/></label><br/>

                        <label className="newsBox" htmlFor="anecdotesFacts">Facts<input type="checkbox" id="anecdotesFacts" name="anecdotesFacts" value="Facts"/></label><br/>

                        <label className="newsBox" htmlFor="anecdotesQuotes">Quotes<input type="checkbox" id="anecdotesQuotes" name="anecdotesQuotes" value="Quotes"/></label><br/>

                        </>
                    )}
                    {expandedCard === 'anecdotes' && <button className='closeModule' onClick={handleCardClose}>Save changes</button>}
                </div>

            </main>

        </section>
    );
};

export default Modules;