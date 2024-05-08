import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import React from "react";
import axios from "axios";
import OpenAI from "openai";

const citiesWithTildes = ["Cali", "Medellín", "Barranquilla", "Cartagena"];

// Crear un mapeo de ciudades con y sin tildes
const citiesMapping = {
  "Cali": "Cali",
  "Bogotá": "Bogota",
  "Medellín": "Medellin",
  "Barranquilla": "Barranquilla",
  "Cartagena": "Cartagena",
  "Santa Marta": "Santa_Marta"
};

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_GPT_KEY,
  dangerouslyAllowBrowser: true,
});

const SendImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("");

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  async function handleSubmit() {
    // Guardar la ciudad sin tildes en el localStorage
    const cityWithoutTildes = citiesMapping[selectedCity];

    localStorage.setItem("city", selectedCity);
    setIsLoading(true);

    try {
      const minubeInfo = await axios.get(`https://tourinsightsscraping.onrender.com/minube-info?city=${cityWithoutTildes}`);
      const googleInfo = await axios.get(`https://tourinsightsscraping.onrender.com/google-info?city=${cityWithoutTildes}`);
      const tripadvisorInfo = await axios.get(`https://tourinsightsscraping.onrender.com/tripadvisor-info?city=${cityWithoutTildes}`);

      const emptyResponsesCount = [minubeInfo.data, googleInfo.data, tripadvisorInfo.data].filter(response => Array.isArray(response) && response.length === 0).length;

      if (emptyResponsesCount < 2) {
        // Llamar a la función gpt solo si no hay al menos dos respuestas vacías
        gpt(minubeInfo.data, googleInfo.data, tripadvisorInfo.data);
      }
      else {
        setIsLoading(false);
        console.log("MINUBE: " + minubeInfo.data)
        console.log("Tripadvisor: " + tripadvisorInfo.data)
        console.log("Google: "+ googleInfo.data)
        alert("Por algún motivo solo obtuvimos información de un sitio web, por favor intentalo de nuevo o prueba con otra ciudad")
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error, maybe display a message to the user
    }
  };

  async function gpt(minubeData, googleData, tripadvisorData) {
    // Construir el mensaje que se enviará al modelo GPT
    let message = `
      Te pasare tres json con informacion de los mejores lugares de una ciudad, la informacion de cada json proviene de tres paginas web, tripadvisor, minube y google. cada json sigue esta estructura (con excepcion de google que no se incluye link de imagen):
          
      [
        {
            "calificaciones": "(20)",
            "imagen": "https://images.mnstatic.com/01/f5/01f57230949ba45930d794eff9a1cbc4.jpg",
            "nombre": "Carnaval de Barranquilla",
            "puesto": "1",
            "rating": 4.7
        },
        {
            "calificaciones": "(10)",
            "imagen": "https://images.mnstatic.com/12/a5/12a5ddcb972934dd410ba9d6a95535d8.jpg",
            "nombre": "Puerto Colombia",
            "puesto": "2",
            "rating": 5.0
        },
      ]
      "calificaciones" es el numero de usuarios que calificaron el lugar, "nombre" es el nombre del lugar, "puesto" es el ranging en el que esta siendo el puesto 1 el mejor, el "rating" es la calificacion que obtuvo el lugar.

      deberas procesar la información obtenida de cada sitio web y definir cuales son los mejores 10 lugares teniendo en cuenta la informacion que resulta de cada sitio web, sus coincidencias, sus calificaciones y el numero de personas que lo calificaron, es por eso que los lugares escogidos deben coincidir en la informacion de los tres lugares. Ten en cuenta que a veces los lugares no se llaman exactamente igual, por ejemplo: en un sitio un lugar puede llamarse "cristo rey" y en otro "monumento cristo rey", otro ejemplo es que en un sitio un lugar puede llamarse "Iglesia La Ermita" y en otro "Iglesia Ermita", otro ejemplo es que en un sitio un lugar puede llamarse "Plaza Caicedo" y en otro "Plaza de Caicedo", por lo general, deben coincidir un 60% las palabras del nombre del lugar. por lo que en esos caso tendras que saber qué lugares son los mismos. Es importante que entiendas esto porque todos los lugares se repiten en los sitios web.

      Todo lo anterior lo retornarás en un json de 10 campos ordenados en forma de top 10, es decir, el primer campo sera el top 1, el segundo campo sera el top 2 y así. todos los campos seguiran esta estructura:
      {
        {
          name: "Nombre del Lugar 1",
          averageRating: "4.7 de 5",
          tripadvisorRating: "4.5",
          tripadvisorReviews: "105",
          minubeRating: "4.5",
          minubeReviews: "66",
          googleRating: "4.5",
          googleReviews: "1055",
          imageUrl: "https://via.placeholder.com/150",
        }
      }
      
      donde "name" es el nombre del lugar, "averageRating" es el rating promedio del lugar en los tres sitios web (debe estar redondeado hacia abajo y solo tener un decimal), "tripadvisorRating" es el rating que se obtuvo en trip advisor, "tripadvisorReviews" es el numero de calificaciones que obtuvo el lugar en tripadvisor, "minubeRating" es el rating que obtuvo el lugar en minube, "minubeReviews" es el numero de calificaciones que obtuvo el lugar en minube, "googleRating" es el rating que obtuvo el lugar en google, "googleReviews" es el numero de personas que calificaron el lugar en google, "imageUrl" es una de las imagenes del lugar, puede ser de tripAdvisor o minube (en caso de que falte la imagen de una, usas la otra), si por algun motivo no recibes el json de la información de algun sitio web, simplemente tomas en cuenta la información de los otros sitios y en el json que retornas dejas el espacio vacio para la información de ese sitio web que faltó. RECUERDA, ES MUY IMPORANTE QUE ABSOLUTAMENTE TODOS LOS LUGARES QUE PONGAS EN EL JSON TIENEN QUE HABER APARECIDO EN ALMENOS DOS DE LOS TRES SITIOS WEB, la unica excepcion es que por algún motivo hayas recibido el json de informacion de solo un sitio web. Tu respuesta la voy a convertir directamente con JSON.parse así que asegurate de solo responder con el JSON.
      Los json son los siguientes:
      
    `;

    message += `
      \nMinube Data:
      ${JSON.stringify(minubeData)}
      \nGoogle Data:
      ${JSON.stringify(googleData)}
      \nTripAdvisor Data:
      ${JSON.stringify(tripadvisorData)}
    `;

    console.log(message);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ content: message, role: "user" }],
      });

      const responseData = JSON.parse(completion.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").replace(/\n/g, ""));
      console.log(JSON.stringify(responseData))
      localStorage.setItem("cityInfo", JSON.stringify(responseData));
      setIsLoading(false);
      navigate("/places");

    } catch (error) {
      setIsLoading(false);
      alert("Algo salio mal, intentalo otra vez")
      console.error('Error processing data with GPT:', error);
      // Handle error, maybe display a message to the user
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="z-10 w-[45rem] text-center mb-14 text-lg font-bold pt-[-2rem] text-black ">
        ¡Bienvenido a ColombiaWonders! Selecciona una ciudad y te brindaremos sus mejores lugares turisticos basandonos en la información de las páginas web TripAdvisor, Google y Minube
      </p>
      <div className="w-64">
        <label htmlFor="city" className="block mb-2">Selecciona una ciudad:</label>
        <select
          id="city"
          name="city"
          value={selectedCity}
          onChange={handleCityChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        >
          {!selectedCity && <option value="">Selecciona una ciudad</option>}
          {citiesWithTildes.map((city, index) => (
            <option key={index} value={city}>{city}</option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-4">
          <p className="text-sm mb-2">Estamos recopilando la información, esto puede tardar unos segundos...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!selectedCity}
          className={`mt-4 px-6 py-3 rounded-md shadow focus:outline-none focus:ring ${selectedCity ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
        >
          Enviar
        </button>
      )}

    </div>
  );
};

export default SendImage;
