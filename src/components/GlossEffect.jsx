// src/GlossEffect.js
import React, { useState } from 'react';


const brightnessOptions = [
  { label: 'Matte', value: 1, url: '', 'Museum-Quality Matte': '250-gsm-100lb-uncoated-offwhite-archival', type:  'Museum-Quality Matte'},

  { label: 'Glossy', value: 1.25, url: '', 'Premium Semi-Glossy': '200-gsm-80lb-coated-silk', type: 'Premium Semi-Glossy' }
];

const GlossEffect = ({ onBrightnessChange, light }) => {
  const [brightness, setBrightness] = useState(light || 1);

  const handleBrightnessChange = (option) => {
    setBrightness(option.value);
    onBrightnessChange(option);
  };

  return (
    <div className="gloss-effect">
      {brightnessOptions.map(option => (
        <button
          key={option.label}
          onClick={() => handleBrightnessChange(option)}
          style={{
         
            backgroundImage: `url(${option.url})`,
            backgroundSize: 'cover',
            margin: 5,
            cursor: 'pointer',
          
            border: brightness === option.value ? '2px solid #008080' : '1px solid #ccc'
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default GlossEffect;