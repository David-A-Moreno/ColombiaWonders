import React from "react";

const NutritionScore = ({ score }) => {
	const getColorFromScore = (score) => {
		if (score <= 3) {
			return "text-red-500";
		} else if (score <= 7) {
			return "text-yellow-500";
		} else {
			return "text-lime-600";
		}
	};

	const consumeRecommendation = (score) => {
		if (score >= 8) {
			return "Lo puedes consumir regularmente";
		} else if (score >= 4) {
			return "Consúmelo con moderación";
		} else {
			return "Evita consumir este alimento";
		}
	};

	return (
		<div>
			<p className="text-lg pt-6">
				Puntuación nutricional:{" "}
				<span className={`font-bold ${getColorFromScore(score)}`}>{score}/10</span>
			</p>

			<p className={`text-lg ${getColorFromScore(score)}`}>{consumeRecommendation(score)}</p>
		</div>
	);
};

export default NutritionScore;
