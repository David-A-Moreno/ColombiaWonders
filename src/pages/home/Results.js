import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@material-tailwind/react";
import NutritionInfoCard from "../../components/NutritionInfoCard";
import NutritionScore from "../../components/NutritionScore";

function Results() {
  const navigate = useNavigate();
  const [nutritionData, setNutritionData] = useState(null);

  useEffect(() => {
    // Recuperar los datos del localStorage
    const data = localStorage.getItem('nutritionData');
    if (data) {
      setNutritionData(JSON.parse(data));
    }
  }, []);

  const getColorFromScore = (score) => {
    if (score <= 3) {
      return "text-red-500";
    } else if (score <= 7) {
      return "text-yellow-500";
    } else {
      return "text-green-500";
    }
  };

  return (
    <div className="font-text flex-column w-full">
      {nutritionData ? (
        <>
          {/* RESUMEN DEL ALIMENTO - PARTE SUPERIOR */}
          <div className="flex justify-center items-center text-center w-full py-6 px-4">
            <div className="flex-column justify-center items-center text-center w-full max-w-2xl py-6 px-4">
              <h1 className="text-2xl font-bold">ANÁLISIS ALIMENTICIO</h1>
              <NutritionScore score={nutritionData.alimento_general.calificacion_general} />
              <p className="pt-4">{nutritionData.alimento_general.resumen}</p>
            </div>
          </div>

          {/* DESCRIPCION DE LOS ITEMS DEL ALIMENTO */}
          <div className="flex flex-column w-auto justify-center items-center pb-24">
            <div className="grid gap-5 md:grid-cols-2 flex-column w-auto justify-center items-center px-4">
              {/* NUTRITION INFO CARDS */}
              {Object.entries(nutritionData).map(([key, value]) => {
                if (key !== "alimento_general") {
                  return (
                    <NutritionInfoCard
                      key={key}
                      titulo={key.charAt(0).toUpperCase() + key.slice(1)} // Capitaliza la primera letra
                      puntaje={value.calificacion}
                      descripcion={value.descripcion}
                      porcentaje={value.recomendacion}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </>
      ) : (
        <div>Cargando datos...</div>
      )}
    </div>
  );
}

export default Results;
