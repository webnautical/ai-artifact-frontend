import React, { useState } from 'react';

const SelectableButtons = ({ onSelect }) => {
  const [selectedButton, setSelectedButton] = useState('Ready-to-hang');

  const handleButtonClick = (button,button2) => {
    setSelectedButton(button);
    onSelect(button, button2);
  };

  return (
    <div className="d-flex">
      <button
        onClick={() => handleButtonClick('Ready-to-hang', 'Ready-to-hang')}
        style={{
          margin: 5,
          cursor: 'pointer',
          backgroundColor: selectedButton === 'Ready-to-hang' ? '#008080' : '#e0e0e0',
          color: selectedButton === 'Ready-to-hang' ? '#fff' : '#000',
          borderRadius: '5px',
          padding: '10px 20px',
          border: selectedButton === 'Ready-to-hang' ? '2px solid #008080' : '1px solid #ccc'
        }}
      >
        Ready-to-hang
      </button>
      <button
        onClick={() => handleButtonClick('Not assembled', 'Not assembled')}
        style={{
          margin: 5,
          cursor: 'pointer',
          backgroundColor: selectedButton === 'Not assembled' ? '#008080' : '#e0e0e0',
          color: selectedButton === 'Not assembled' ? '#fff' : '#000',
          borderRadius: '5px',
          padding: '10px 20px',
          border: selectedButton === 'Not assembled' ? '2px solid #008080' : '1px solid #ccc'
        }}
      >
        Not assembled
      </button>
    </div>
  );
};

export default SelectableButtons;
