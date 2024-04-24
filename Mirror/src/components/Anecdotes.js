import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Anecdotes = () => {
    const [fact, setFact] = useState('');

    useEffect(() => {
        // Define the function to fetch the fact from your backend
        const fetchFact = async () => {
            try {
                // Update the URL to point to your backend endpoint
                const response = await axios.get('http://localhost:3001/getFact');

                // Check if the API returns a fact and set it
                if (response.data && response.data.fact) {
                    setFact(response.data.fact);
                } else {
                    setFact('No fact found.');
                }
            } catch (error) {
                console.error('Error fetching fact from backend:', error);
                setFact('Failed to load a fact.');
            }
        };

        fetchFact();
    }, []);

    return (
        <section className='anecdotes'>
            <h1>Fact of the day...</h1>
            <p>{fact}</p>
        </section>
    );
};

export default Anecdotes;
