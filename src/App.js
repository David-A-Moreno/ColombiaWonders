import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import { useNavigate } from "react-router-dom";
import "./index.css";
import React from "react";
import axios from "axios";

const openai = new OpenAI({
	apiKey: "sad",
	dangerouslyAllowBrowser: true,
});

const cities = ["Cali", "Bogotá", "Medellín", "Barranquilla", "Cartagena", "Santa Marta"];

const SendImage = () => {

	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const [selectedCity, setSelectedCity] = useState("");

	const handleCityChange = (e) => {
		setSelectedCity(e.target.value);
	};

	const handleSubmit = () => {
		// Verificar si ya hay una ciudad seleccionada en el localStorage
		const storedCity = localStorage.getItem("selectedCity");

		// Si no hay ninguna ciudad almacenada, guardar la seleccionada
		if (!storedCity) {
			localStorage.setItem("selectedCity", selectedCity);
		} else {
			// Si ya hay una ciudad almacenada, actualizarla con la nueva selección
			localStorage.setItem("selectedCity", selectedCity);
		}
		navigate("/places")
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen">

			<p className="z-10 w-[60rem] text-center mb-14 text-lg font-bold pt-[-2rem] text-black ">
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
					{cities.map((city, index) => (
						<option key={index} value={city}>{city}</option>
					))}
				</select>
			</div>
			<button
				onClick={handleSubmit}
				disabled={!selectedCity}
				className={`mt-4 px-6 py-3 rounded-md shadow focus:outline-none focus:ring ${selectedCity ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
			>
				Enviar
			</button>

		</div>
	);
};

export default SendImage;
