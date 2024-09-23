import React from "react";
import loaders from "../../src/assets/images/loaders.svg";
 
const FrontLoader = () => {
  return (
    <div className="loaders-fix">
      <div>
        <img src={loaders} alt="Logo" className="logo" />
        <div class="loder">
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
</div>
      </div>
    </div>
  );
};
 
export default FrontLoader;