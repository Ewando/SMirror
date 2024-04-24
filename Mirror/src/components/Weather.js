import React, { useEffect } from 'react';

const Weather = () => {
  useEffect(() => {
    // First script for d3
    const d3Script = document.createElement('script');
    d3Script.src = '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js';
    d3Script.async = true;
    document.body.appendChild(d3Script);

    // Second script for widget
    const widgetScript = document.createElement('script');
    widgetScript.async = true;
    widgetScript.charset = "utf-8";
    widgetScript.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
    document.body.appendChild(widgetScript);

    // Widget params
    window.myWidgetParam = window.myWidgetParam || [];
    window.myWidgetParam.push({
      id: 11,
      cityid: '2643743',
      appid: '67588773b40a156042943ef5445f8418',
      units: 'metric',
      containerid: 'openweathermap-widget-11',
    });

    // Cleanup function to remove scripts when the component unmounts
    return () => {
      document.body.removeChild(d3Script);
      document.body.removeChild(widgetScript);
    };
  }, []);

  return <div id="openweathermap-widget-11"></div>;
};

export default Weather;
