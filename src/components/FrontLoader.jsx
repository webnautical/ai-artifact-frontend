import React from "react";
import loaders from "../../src/assets/images/loaders.svg";
 
const FrontLoader = () => {
  return (
    <div className="loaders-fix">
      <div>
        <img src={loaders} alt="Logo" className="logo" />
        <div className="line-animation"></div>
      </div>
    </div>
  );
};
 
export default FrontLoader;