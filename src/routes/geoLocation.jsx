import React, { useEffect } from 'react';

const Geolocation = () => {
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const showPosition = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    fetch('http://18.190.29.212:3000/location', { // Corrected URL with http://
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: latitude,
        longitude: longitude
      })
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      alert('Location data sent to server');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to send location data');
    });
  };

  const showError = (error) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  };

  return (
    <div>
      <h1>Geolocation Tracker</h1>
      <p>Fetching your location...</p>
    </div>
  );
};

export default Geolocation;
