import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { useDataContext } from "../helper/context/ContextProvider";
import { useFrontDataContext } from "../helper/context/FrontContextProvider";

const FilterShop = ({ setCategoryObj, categoryObj, getArtWorkListFun,setKeyword }) => {
  const { categoryList, } = useDataContext()
  const { headerContent } = useFrontDataContext()
  const [activeKey, setActiveKey] = useState("0");

  const handleCategoryChange = (item,index) => {
    setActiveKey(index.toString());
    setCategoryObj(item)
  }

  useEffect(() => {
    if (categoryObj) {
      headerContent?.forEach((item, i) => {
        if (item?.subcategories?.some(sub => sub?._id === categoryObj?._id)) {
          setActiveKey(i.toString()); 
        }
      });
    }
  }, [categoryObj, headerContent]);

  const [showAll, setShowAll] = useState(false);
  const displayedCategories = showAll ? categoryList : categoryList?.slice(0, 10);

  const clearFilter = () => {
    setCategoryObj(null)
    setKeyword("")
    getArtWorkListFun(1)
  }

  return (
    <>
      <div className="filter_product">
        <p>Category</p>
        <Accordion activeKey={activeKey} onSelect={setActiveKey}>
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
                          onClick={() => handleCategoryChange(subItem, i)}
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
