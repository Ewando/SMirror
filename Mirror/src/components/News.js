import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react'; // Import QRCode component

const News = () => {
    const [articles, setArticles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('https://newsapi.org/v2/everything', {
                    params: {
                        q: 'technology',
                        apiKey: 'f5d5715050494b79a86cc042eaccee91', // Use your actual API key
                    },
                });
                setArticles(response.data.articles);
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((currentIndex) => (currentIndex + 1) % articles.length);
        }, 10000); // Change article every 10 seconds

        return () => clearInterval(interval);
    }, [articles.length]);

    if (articles.length === 0) {
        return <div>Loading news...</div>;
    }

    const currentArticle = articles[currentIndex];

    const formattedDate = new Date(currentArticle.publishedAt).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <section>
            <article className='newsArticle'>
                <span>{formattedDate} - {currentArticle.source.name}</span>
                <h2>{currentArticle.title}</h2>
                <p>{currentArticle.description}</p>
                <QRCode className="newsQR" value={currentArticle.url} size={256} level={"H"} />
                <p>Scan to continue reading</p>
            </article>
        </section>
    );
};

export default News;
