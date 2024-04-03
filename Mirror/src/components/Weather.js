import React, { useEffect } from 'react';

const Weather = () => {
    
    useEffect(() => {
        // Define the script elements
        const script1 = document.createElement('script');
        const script2 = document.createElement('script');

        script1.src = '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js';
        script1.async = true;

        script2.innerHTML = `
            window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  
            window.myWidgetParam.push({
                id: 11,
                cityid: '2648579',
                appid: '67588773b40a156042943ef5445f8418', // Ensure you replace this with your actual API key
                units: 'metric',
                containerid: 'openweathermap-widget-11',
            });
            (function() {
                var script = document.createElement('script');
                script.async = true;
                script.charset = "utf-8";
                script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(script, s);
            })();
        `;

        // Append script elements to the document body
        document.body.appendChild(script1);
        document.body.appendChild(script2);

        // Clean up: Remove the script when the component unmounts
        return () => {
            document.body.removeChild(script1);
            document.body.removeChild(script2);
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <section>
            <div id="openweathermap-widget-11"></div>
        </section>
    );
};

export default Weather;
