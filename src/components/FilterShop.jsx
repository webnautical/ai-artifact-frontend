import React, { useState } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { useDataContext } from "../helper/context/ContextProvider";
import { useFrontDataContext } from "../helper/context/FrontContextProvider";

const FilterShop = ({ setCategoryObj, categoryObj, getArtWorkListFun }) => {
  const { categoryList, } = useDataContext()
  const { headerContent } = useFrontDataContext()

  const handleCategoryChange = (item) => {
    setCategoryObj(item)
  }
  const [showAll, setShowAll] = useState(false);
  const displayedCategories = showAll ? categoryList : categoryList?.slice(0, 10);

  const clearFilter = () => {
    getArtWorkListFun(1)
    setCategoryObj(null)
  }

  // console.log("categoryList", categoryList)
  // console.log("headerContent", headerContent)

  return (
    <>
      <div className="filter_product">
        {/* <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Category</Accordion.Header>
            <Accordion.Body> */}
        {/* <div className="catehory_box"> */}
        {/* <ul>
                  {displayedCategories?.map((item, i) => (
                    <li><Link to={'#'} onClick={() => handleCategoryChange(item)} className={item?._id === categoryObj?._id ? "active" : ''}> {item?.name}</Link></li>
                  ))}
                </ul>
                {categoryList?.length > 10 && (
                  <button onClick={() => setShowAll(!showAll)} className="global_light_btn">
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                )} */}
        <p>Category</p>
        <Accordion defaultActiveKey="0">
          {headerContent?.map((item, i) => (
            <Accordion.Item eventKey={i.toString()} key={i}>
              <Accordion.Header>{item?.name}</Accordion.Header>
              <Accordion.Body>
                <div className="category_box">
                  <ul>
                    {item?.subcategories?.map((subItem, j) => (
                      <li key={j}>
                        <Link
                          to={'#'}
                          onClick={() => handleCategoryChange(subItem)}
                          className={subItem?._id === categoryObj?._id ? "active" : ''}
                        >
                          {subItem?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        <div className="text-end">
          <button className="global_light_btn" onClick={() => clearFilter()}>Reset</button>
        </div>
      </div>
    </>
  );
};

export default FilterShop;
