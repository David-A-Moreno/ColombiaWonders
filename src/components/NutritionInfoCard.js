import React from "react";

const NutritionInfoCard = ({ titulo, puntaje, descripcion, porcentaje }) => {
	const getColorClass = (puntaje) => {
		if (puntaje <= 3) {
			return "bg-red-500";
		} else if (puntaje <= 7) {
			return "bg-yellow-500";
		} else {
			return "bg-lime-600";
		}
	};

	return (
		<div className="flex p-4 flex-col justify-center text-center h-full w-full max-w-md rounded-3xl mt-4 bg-zinc-100 border shadow-lg">
			<div className="flex flex-col items-center justify-center p-4">
				<p className="font-bold text-xl pb-4">{titulo}</p>
				<p className="text-sm">Puntuación: {puntaje}/10</p>

				{/* BARRA INDICADORA */}
				<div className="w-full h-4 bg-gray-200 rounded-full">
					<div
						className={`progress rounded-full h-full ${getColorClass(puntaje)}`}
						style={{ width: `${puntaje * 10}%` }}
					></div>
				</div>

				<p className="pt-6">{descripcion}</p>
				<p>{porcentaje}</p>
			</div>
		</div>
	);
};

export default NutritionInfoCard;
