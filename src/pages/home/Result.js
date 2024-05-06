import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import OpenAI from "openai";

const topPlaces = [
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
  },
  {
    name: "Nombre del Lugar 2",
    averageRating: "4.7 de 5",
    tripadvisorRating: "4.5",
    tripadvisorReviews: "300",
    minubeRating: "4.5",
    minubeReviews: "4.5",
    googleRating: "4.5",
    googleReviews: "4.5",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    name: "Nombre del Lugar 3",
    averageRating: "4.7 de 5",
    tripadvisorRating: "4.5",
    tripadvisorReviews: "224",
    minubeRating: "4.5",
    minubeReviews: "4.5",
    googleRating: "4.5",
    googleReviews: "4.5",
    imageUrl: "https://via.placeholder.com/150",
  },
];

const openai = new OpenAI({
  apiKey: "jeje",
  dangerouslyAllowBrowser: true,
});

const TopPlaces = () => {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Mostrar el spinner

    const formData = new FormData();
    try {
      const response = await axios.post(
        "https://computervisionwithopencvbackend.onrender.com/get_characters_of_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Obtener las respuestas del localStorage
      const respuestas = JSON.parse(localStorage.getItem("respuestas"));

      // Llamar a la función gpt() con la información recibida del servidor y las respuestas del usuario
      gpt(response.data.characters, respuestas);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  async function gpt(characters, respuestas) {
    // Construir el mensaje que se enviará al modelo GPT
    let mensaje = `
      Se hicieron una serie de preguntas para conocer el estado actual de la persona que desea consumir el alimento, las cuales son:
    `;

    // Agregar las preguntas y respuestas al mensaje
    respuestas.forEach((pregunta, index) => {
      mensaje += `
        ${index + 1}. ${pregunta.pregunta}: ${pregunta.respuesta}
      `;
    });

    // Agregar el mensaje final al prompt
    mensaje += `
      Debes hacer un análisis de la información nutricional de este producto. 

      Analizarás cada uno de estos apartados, darás una descripción, una recomendación y una calificación, y cada apartado lo harás en formato JSON: calorías, proteínas, grasas, colesterol, sodio, carbohidratos, azúcares, fibra y vitaminas. 
      Si no hay información sobre algún apartado, no lo incluyas en el JSON, ni lo tomes en cuenta para el análisis. 
      Ten en cuenta que la información nutricional puede contener errores en el texto, puede estar en inglés u otro idioma, pero la respuesta debe ser en español.

      Además, darás una calificación al alimento en general, dirás si lo consumirías (Lo puedes consumir regularmente, Consúmelo con moderación, No lo consumas) y harás una descripción sobre el alimento, en formato JSON.
      Las calificaciones serán de 1 a 10.
      Todas las recomendaciones y calificaciones deben ser personalizadas en base a las características de la persona.
          
      La estructura del JSON se podría ver así:
          
      {
        "calorías": {
          "descripcion": "",
          "recomendacion": "",
          "calificacion": 6
        },
        "proteínas": {
          "descripcion": "",
          "recomendacion": "",
          "calificacion": 8
        },
        "vitamina B12": {
          "descripcion": "",
          "recomendacion": "",
          "calificacion": 2
        },
        "vitamina B1": {
          "descripcion": "",
          "recomendacion": "",
          "calificacion": 2
        },
        "ácido fólico": {
          "descripcion": "",
          "recomendacion": "",
          "calificacion": 2
        },
        "alimento_general": {
          "consumiria": "",
          "resumen": "",
          "calificacion_general": 6
        },
      }
    `;

    console.log(mensaje);
    const completion = await openai.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            content: mensaje,
            role: "user",
          },
          {
            content: characters,
            role: "user",
          },
        ],
      })
      .then((response) => {
        const data = JSON.parse(response.choices[0].message.content.replace(/\n/g, ""));

        // Guardar los datos en localStorage
        localStorage.setItem("nutritionData", JSON.stringify(data));

        console.log("Respuesta de OpenAI:", data);
        setIsLoading(false); // Ocultar el spinner
        navigate("/results");
      });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Top 3 Lugares</h1>
      <div className="grid grid-cols-1 gap-4">
        {topPlaces.map((place, index) => (
          <div key={index} className="flex items-center">
            <img src={place.imageUrl} alt={place.name} className="mb-2 mr-12" />
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold">{place.name}</p>
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