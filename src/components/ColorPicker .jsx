// src/ColorPicker.js
import React from 'react';

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'black'];

const ColorPicker = ({ onColorSelect }) => {
  return (
    <div>
      {colors.map(color => (
        <div
          key={color}
          onClick={() => onColorSelect(color)}
          style={{
            width: 50,
            height: 50,
            backgroundColor: color,
            margin: 5,
            cursor: 'pointer'
          }}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;
