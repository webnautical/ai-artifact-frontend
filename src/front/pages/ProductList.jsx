import React, { useEffect, useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, useLocation } from "react-router-dom";
import productimg from "../../assets/images/product (1).webp";
import badge from "../../assets/images/badge (1).png";
import Pagination from "react-bootstrap/Pagination";
import Newsletter from "../../components/Newsletter";
import FilterShop from "../../components/FilterShop";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useDataContext } from "../../helper/context/ContextProvider";
import { APICALL } from "../../helper/api/api";
import { getTierImg, imgBaseURL } from "../../helper/Utility";
import FrontLoader from "../../components/FrontLoader";
import NoData from "../../components/NoData";
import noDataImg from '../../assets/images/animasi-emptystate.gif'
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
import { Rating, Stack } from "@mui/material";
import WishlistIcon from "../../components/WishlistIcon";
const catslide = {
  loop: false,
  autoplay: false,
  autoplaySpeed: 100,
  margin: 20,
  dots: false,
  nav: true,
  responsiveClass: true,
  infinite: false,
  speed: 100,
  navText: [
    '<i class="fas fa-chevron-left"></i>',
    '<i class="fas fa-chevron-right"></i>',
  ],
 
  responsive: {
    0: {
      items: 1.3,
      nav: true,
    },
    600: {
      items: 4,
      nav: true,
    },
    1000: {
      items: 5,
      nav: true,
      loop: false,
    },
  },
};
const ProductList = () => {
  const locationData = useLocation()
  const category = locationData?.state ? locationData?.state?.data?.category : null
 
  const { categoryList, getCategoryFun } = useDataContext();
  const { addRemoveWishList } = useFrontDataContext();
  const [artWorkListing, setArtWorkListing] = useState([]);
  const [categoryObj, setCategoryObj] = useState(null)
  const [sortBy, setSortBy] = useState("")
  const [keyword, setKeyword] = useState("")
 
  const [loading, setLoading] = useState({
    list: false,
    submit: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
 
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
 
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
 
    return debouncedValue;
  }
  const debouncedKeyword = useDebounce(keyword, 500);
 
  useEffect(() => {
    setKeyword(category)
  }, [category])
 
  useEffect(() => {
    if (category?._id) {
      setCategoryObj(category)
    }
  }, [category])
 
  useEffect(() => {
    getCategoryFun();
    getArtWorkListFun(currentPage, sortBy, categoryObj, true, debouncedKeyword);
  }, [currentPage, sortBy, categoryObj, category, debouncedKeyword]);
 
  console.log("categoryObj",categoryObj)
 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 
  const getArtWorkListFun = async (page, sortBy, categoryObj, loader, keyword) => {
    if (loader) {
      setLoading({ ...loading, list: true });
    }
    try {
      const params = {
        page,
        categoryId: categoryObj?._id,
        keyword: keyword,
        sortBy: sortBy,
      };
      const res = await APICALL("user/allArtwork", "post", params);
      if (res?.status) {
        setArtWorkListing(res?.data);
        setTotalPages(res?.totalPages);
        setLoading({ ...loading, list: false });
      } else {
        setArtWorkListing([]);
        setLoading({ ...loading, list: false });
      }
    } catch (error) {
      setArtWorkListing([]);
      setLoading({ ...loading, list: false });
    }
  };
 
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  const handleFilterChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(currentPage);
  };
 
  const handleCategoryChange = (item) => {
    setCategoryObj(item)
  };
 
 
  return (
    <div className="product_list_page">
      <div className="sortlist_product mb-4">
        <Container>
          <Row className="align-items-center ">
 
            <Col md={12} className="text-end">
              <div className="filter_mobile_menu ">
                <div class="main_select me-3">
                  <select onChange={handleFilterChange}>
                    <option value="">Sort By</option>
                    <option value="highrated">Highrated</option>
                    <option value="mostsold">Most Sold</option>
                  </select>
                  <div class="arrwoicon">
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>
                </div>
                <Button
                  variant=""
                  className=" Filter_mobile_btn"
                  onClick={handleShow}
                >
                  <i class="fa-solid fa-filter me-2"></i>Filter
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
 
      <section className="productlist">
        <Container>
          <Row className="justify-content-between gx-lg-5">
            <Col lg={3}>
              <FilterShop setCategoryObj={setCategoryObj} categoryObj={categoryObj} getArtWorkListFun={getArtWorkListFun} setKeyword={setKeyword} />
            </Col>
            <Col lg={9}>
              <div className="product_tags ">
                <ul>
                  <OwlCarousel className="owl-theme" {...catslide}>
                    {categoryList?.map((item, i) => (
                      <div className="item" key={i}>
                        <li>
                          <button type="button" onClick={() => handleCategoryChange(item)} className={`white_global_btn d-inline-block ${item?._id === categoryObj?._id ? 'active' : ''}`}>
                            {" "}
                            {item?.name}
                          </button>
                        </li>
                      </div>
                    ))}
                  </OwlCarousel>
                </ul>
              </div>
              <h2 className="global_main_top_heading mt-md-4">
                Posters & Art Prints
              </h2>
 
              <div className="catgory_fliter_product mt-4">
                {loading?.list ? (
                  <FrontLoader />
                ) : (
                  <Row className="gx-2">
                    {artWorkListing?.length > 0 ? (
                      artWorkListing?.map((item, i) => (
                        <Col md={3} sm={3} xs={6} className="mb-4" key={i}>
                          <div className="product_box_outer">
                            <Link to={`/product-details/${item?._id}`}>
 
                              <div className="product_box">
                                <div className="main_show_image">
                                  <img className="w-100" src={
                                    item?.thumbnail
                                      ? imgBaseURL() + item?.thumbnail
                                      : productimg
                                  }
                                    alt="product-img"
                                    loading="lazy"
                                  />
                                </div>
 
                                <div className="product_name">{item?.title}</div>
                                <div className="product_rating">
                                  <Stack spacing={1}>
                                    <Rating
                                      name="half-rating-read"
                                      defaultValue={item?.averageRating}
                                      precision={0.5}
                                      readOnly
                                    />
                                  </Stack>
                                </div>
 
                                <div className="tiear_stauts_name d-flex align-items-center">
                                  <span className="me-2">
                                    {getTierImg(item?.artist?.currentRank)?.icon}
                                  </span>
                                  <div className="name">
                                    {item?.artist?.userName}
                                  </div>
                                </div>
 
                              </div>
 
                            </Link>
                            <button className="wishlist border-0" onClick={() => {
                              addRemoveWishList(item?._id, getArtWorkListFun, true)
                            }}>
                              <WishlistIcon item={item} />
                            </button>
                          </div>
                        </Col>
                      ))
                    ) : (
                      <NoData msg={"Oops !! No Art Found"} img={noDataImg} />
                    )}
                  </Row>
                )}
 
                {
                  totalPages > 1 &&
                  <Row>
                    <Col md={12}>
                      <div className="pagination_box">
                        <Pagination
                          className="justify-content-center"
                          style={{ gap: "20px" }}
                        >
                          <Pagination.Prev className="prev_btn_page"
                            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                          >
                            <i class="fa-solid fa-chevron-left"></i>
                          </Pagination.Prev>
 
                          {[...Array(totalPages)].map((_, i) => (
                            <Pagination.Item
                              key={i}
                              active={i + 1 === currentPage}
                              onClick={() => handlePageChange(i + 1)}
                            >
                              {i + 1}
                            </Pagination.Item>
                          ))}
 
                          <Pagination.Next className="next_btn_page"
                            onClick={() =>
                              handlePageChange(
                                currentPage < totalPages
                                  ? currentPage + 1
                                  : totalPages
                              )
                            }
                          >
                            <i class="fa-solid fa-chevron-right"></i>
                          </Pagination.Next>
                        </Pagination>
                      </div>
                    </Col>
                  </Row>
                }
 
              </div>
            </Col>
          </Row>
        </Container>
      </section>
 
      <Newsletter />
 
      <Offcanvas class="mobile_filter" show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterShop onFilterChange={handleFilterChange} />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
 
export default ProductList