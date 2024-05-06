import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OpenAI from "openai";
import Button from "../../components/button";

const openai = new OpenAI({
	apiKey: process.env.REACT_APP_GPT_KEY,
	dangerouslyAllowBrowser: true,
});

const SendImage = () => {
	const [image, setImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleImageChange = (event) => {
		setImage(event.target.files[0]);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true); // Mostrar el spinner

		const formData = new FormData();
		formData.append("image", image);

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
		<div className="flex justify-center items-center h-screen pb-8 font-text">
			<form
				onSubmit={handleSubmit}
				className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[36rem]"
			>
				<div className="mb-4">
					<label htmlFor="image" className="block text-gray-700 text-xl font-bold mb-2 text-center">
						Sube una imagen clara de la tabla nutricional del producto que deseas consumir:
					</label>
					<input
						type="file"
						id="image"
						name="image"
						onChange={handleImageChange}
						className="border border-gray-400 rounded w-full py-16 px-16 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
					/>
				</div>
				<div className="flex items-center justify-center">
					{isLoading ? (
						<div className="flex items-center justify-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-900"></div>
						</div>
					) : (
						<button
							type="submit"
							className="w-48 z-10 bg-lime-900 hover:bg-lime-700 active:bg-lime-600 text-white font-bold py-2 px-4 rounded-xl text-xl border h-12 shadow-sm"
						>
							Enviar
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default SendImage;
