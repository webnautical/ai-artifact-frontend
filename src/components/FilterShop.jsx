import React, { useState } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { Form } from "react-bootstrap";
import { useDataContext } from "../helper/context/ContextProvider";

const FilterShop = ({ setCategoryObj ,categoryObj,getArtWorkListFun}) => {
  const { categoryList } = useDataContext()

  const [selectedColors, setSelectedColors] = useState({
    black: false,
    white: false,
    grey: false,
    purple: false,
    green: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedColors((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const [setOrientations, setSelectedOrientations] = useState({
    All: false,
    Vertical: false,
    Horizontal: false,
  });

  const handleOrientationsChange = (event) => {
    const { name, checked } = event.target;
    setSelectedOrientations((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [selectedRating, setSelectedRating] = useState([]);

  const handleRatingChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedRating((prevSelectedRating) => [...prevSelectedRating, value]);
    } else {
      setSelectedRating((prevSelectedRating) =>
        prevSelectedRating?.filter((rating) => rating !== value)
      );
    }
  };

  const handleCategoryChange = (item) => {
    setCategoryObj(item)
  }
  const [showAll, setShowAll] = useState(false);
  const displayedCategories = showAll ? categoryList : categoryList?.slice(0, 10);

  const clearFilter = () =>{
    getArtWorkListFun(1)
    setCategoryObj(null)
  }
  return (
    <>
      <div className="filter_product">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Category</Accordion.Header>
            <Accordion.Body>
              <div className="catehory_box">
                <ul>
                  {displayedCategories?.map((item, i) => (
                    <li><Link to={'#'} onClick={() => handleCategoryChange(item)} className={item?._id === categoryObj?._id ? "active" : ''}> {item?.name}</Link></li>
                  ))}
                </ul>
                {categoryList?.length > 10 && (
                  <button onClick={() => setShowAll(!showAll)} className="global_light_btn">
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </Accordion.Body>
          </Accordion.Item>

        </Accordion>
      <div className="text-end">
        <button className="global_light_btn" onClick={()=>clearFilter()}>Reset</button>
      </div>
      </div>
    </>
  );
};

export default FilterShop;
