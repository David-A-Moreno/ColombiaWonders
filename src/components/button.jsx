import React from 'react';

const Button = ({ texto, onClick}) => {

  return (
    <button onClick={onClick} className={`w-48 z-10 bg-lime-900 hover:bg-lime-700 active:bg-lime-600 text-white font-bold py-2 px-4 rounded-xl text-xl border h-12 shadow-sm `}>
      {texto}
    </button>
  );
}

export default Button;