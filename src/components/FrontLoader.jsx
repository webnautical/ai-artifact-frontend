import React from "react";
import loaders from "../../src/assets/images/loaders.svg";

const FrontLoader = () => {
  return (
    <div className="loaders-fix">
      <div className="front_loder">
        <img src={loaders} alt="Logo" className="logo" />
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default FrontLoader;
