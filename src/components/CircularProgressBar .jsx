import React from 'react';


const Gauge = ({ value, max = 100 }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="gauge-container">
      <div className="gauge">
        <div
          className="gauge-progress"
          style={{ transform: `rotate(${percentage * 1.8 - 90}deg)` }}
        ></div>
        <div className="gauge-label">
          <span>{value}</span>
        </div>
      </div>
    </div>
  );
};

export default Gauge;
