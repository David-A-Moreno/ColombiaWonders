import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import OpenAI from "openai";

const TopPlaces = () => {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [city, setCity] = useState([]);

  useEffect(() => {
    const storedCityInfo = localStorage.getItem('cityInfo');
    setCity(localStorage.getItem('city'));
    if (storedCityInfo) {
      const cityInfo = JSON.parse(storedCityInfo);
      const placesArray = Object.values(cityInfo);
      setPlaces(placesArray);
      setPlaces(placesArray);
    } 
    console.log(places)
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-36">
      <h1 className="text-3xl font-bold mb-12">Top {places.length} Lugares en {city}</h1>
      <div className="flex flex-col gap-4">
        {Array.isArray(places) && places.map((place, index) => (
          <div key={index} className="flex items-center">
            <img src={place.imageUrl} alt={place.name} className="w-32 h-32 object-cover mb-2 mr-12" />
            <div className="flex flex-col content-start">
              <p className="text-lg font-semibold">{index + 1}.{place.name}</p>
              <p className="text-sm">Calificación promedio: {place.averageRating}</p>
              <p className="text-sm">TripAdvisor: {place.tripadvisorRating} ({place.tripadvisorReviews})</p>
              <p className="text-sm">Minube: {place.minubeRating} ({place.minubeReviews})</p>
              <p className="text-sm">Google: {place.googleRating} ({place.googleReviews})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPlaces;