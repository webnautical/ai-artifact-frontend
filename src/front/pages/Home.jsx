import React, { useState, useRef, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import sliderbanner from "../../assets/images/sliderbanner.png";
import sliderbannertwo from "../../assets/images/bannertwo.webp";
// import baughtlistnew from "../../assets/images/baughtlisttwo.png";

// import baughtlisttwo from "../../assets/images/baughtlist.png";
// import baughtlistthree from "../../assets/images/baought-4.png";
// import baughtlistfour from "../../assets/images/baought-3.png";
import badge from "../../assets/images/badge (1).png";
import badgebronze from "../../assets/images/1 - Bronze.png";
// import badgesilver from "../../assets/images/2 - Silver.png";
// import badgegold from "../../assets/images/3 - Gold.png";
// import badgedimond from "../../assets/images/4 - Diamond.png";
import productimg from "../../assets/images/new-1.png";
import Spinner from 'react-bootstrap/Spinner';
// import productimgtwo from "../../assets/images/new-2.png";
// import productimgthree from "../../assets/images/new-3.png";
// import productimgfour from "../../assets/images/new-4.png";
// import productimgfive from "../../assets/images/new-5.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
// import collectionimg from "../../assets/images/top (1).png";
// import toptwo from "../../assets/images/top (2).png";
// import topthree from "../../assets/images/top (3).png";
// import topfour from "../../assets/images/top (4).png";
// import topfive from "../../assets/images/top-5.png";
// import topsix from "../../assets/images/top-6.png";

// import firsttier from "../../assets/images/1 - Bronze.png";
// import silver from "../../assets/images/2 - Silver.png";
// import gold from "../../assets/images/3 - Gold.png";
// import diamond from "../../assets/images/4 - Diamond.png";
// import topimages from "../../assets/images/top (1).png";
// import topimagesone from "../../assets/images/top (2).png";
// import topimagestwo from "../../assets/images/top (3).png";
// import topimagesthree from "../../assets/images/top (4).png";
import CollectionLIst from "../../components/CollectionLIst";
import Artworks from "../../components/Artworks";
import Newsletter from "../../components/Newsletter";
// import harry from "../../assets/images/harry.png";
// import cattwo from "../../assets/images/cat-2.png";
// import catthree from "../../assets/images/cat-3.png";
// import catfaour from "../../assets/images/cat-4.png";
import { Link, useNavigate } from "react-router-dom";
import Feedback from "../../assets/images/facebook.png";
import redit from "../../assets/images/redit.png";
import insta from "../../assets/images/insta.png";
import tiktok from "../../assets/images/tiktok.png";
import pinterst from "../../assets/images/pinterset.png";
import twitter from "../../assets/images/twitter.png";
import discord from "../../assets/images/discord.png";
import blog from "../../assets/images/blog-1.png";
import blogthree from "../../assets/images/blog-3.png";
import blogfaour from "../../assets/images/blog-4.png";
import avtar from "../../assets/images/Avatar.png";
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
import { defaultIMG, imgBaseURL, timeAgo } from "../../helper/Utility";
import { Rating, Stack } from "@mui/material";
import { APICALL } from "../../helper/api/api";
import FrontLoader from "../../components/FrontLoader";
import { useDataContext } from "../../helper/context/ContextProvider";
import HTMLContent from "../../components/HTMLContent";

const Home = () => {

  const { categoryList, getCategoryFun } = useDataContext()
  const navigate = useNavigate()
  const [key, setKey] = useState("one");

  const { getProductListFun, productList, contextLoader, addRemoveWishList, getHeaderContent } = useFrontDataContext();
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getProductListFun()
    getHeaderContent()
    getBlogFun()
    getCategoryFun()
    getHomePageData()
  }, [])

  const handleSelect = (k) => {
    setKey(k);
  };

  const knowledgebaseowl = {
    loop: true,
    autoplay: false,
    autoplaySpeed: 100,
    margin: 30,
    dots: false,
    nav: false,
    responsiveClass: true,
    infinite: true,
    speed: 100,

    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,

        loop: true,
      },
    },
  };

  const article = {
    loop: true,
    autoplay: false,
    autoplaySpeed: 100,
    margin: 30,
    dots: false,
    nav: false,
    responsiveClass: true,
    infinite: true,
    speed: 100,

    responsive: {
      0: {
        items: 1.3,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 3,

        loop: true,
      },
    },
  };

  const newestartwork = {
    loop: true,
    autoplay: false,
    autoplaySpeed: 100,
    margin: 30,
    dots: false,
    nav: true,
    responsiveClass: true,
    infinite: true,
    speed: 100,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ], // Custom Font Awesome arrows

    responsive: {
      0: {
        items: 2,
        margin: 0,
      },
      600: {
        items: 4,
        margin: 10,
      },
      1000: {
        items: 5,

        // loop: true,
      },
    },
  };


  const heroslider = {
    loop: false,
    autoplay: false,
    autoplaySpeed: 100,
    margin: 30,
    dots: false,
    nav: true,
    responsiveClass: true,
    infinite: true,
    speed: 100,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ], // Custom Font Awesome arrows

    responsive: {
      0: {
        items: 1,
        margin: 0,
      },
      600: {
        items: 1,
        margin: 10,
      },
      1000: {
        items: 1,

        // loop: true,
      },
    },
  };



  const owlCarouselRef = useRef(null);

  const handlePrev = () => {
    if (owlCarouselRef.current) {
      owlCarouselRef.current.prev();
    }
  };

  const handleNext = () => {
    if (owlCarouselRef.current) {
      owlCarouselRef.current.next();
    }
  };
  const [justBought, setJustBought] = useState([])
  const [bestSelling, setBestSelling] = useState([])
  const [trendingArt, setTrendingArt] = useState([])
  const [popularCollection, setPopularCollection] = useState([])
  const [blogList, setBlogList] = useState([])

  const habdleRedirect = (page) => {
    const data = { category: page }
    navigate(`/product-list`, { state: { data: data } })
  }

  const getHomePageData = async () => {
    setLoading(true)
    const recentSold = await APICALL('user/recentSoldArtwork', 'post', {})
    setLoading(false)
    if (recentSold?.status) { setJustBought(recentSold?.data) } else { setJustBought([]) }

    const bestSellingRes = await APICALL('user/bestsellingArtwork', 'post', {})
    if (bestSellingRes?.status) { setBestSelling(bestSellingRes?.data) } else { setBestSelling([]) }

    const trendingRes = await APICALL('user/trendingArtworks', 'post', {})
    if (trendingRes?.status) { setTrendingArt(trendingRes?.data) } else { setTrendingArt([]) }

    const popularCollectionRes = await APICALL('user/getpopularCollection', 'post', {})
    if (popularCollectionRes?.status) { setPopularCollection(popularCollectionRes?.data) } else { setPopularCollection([]) }

    
  }

  const getBlogFun = async () => {
    const blogsRes = await APICALL('admin/allBlogs', 'post', {})
      if (blogsRes?.status) { setBlogList(blogsRes?.data) } else { setBlogList([]) }
  }

  const viewBlogDetails = (item) => {
    navigate('/blog-details', { state: { data: item } })
  }

  return (
    <div className="main_homapage">
      {
        loading ? <FrontLoader /> :
          <section className="slider_sec">
            <Container>
              <Row>
                <Col lg={8}>
                  <OwlCarousel className=" owl-theme" {...heroslider} ref={owlCarouselRef}>
                    <div className="item">
                      <div className="slider_big" >
                        <img className="w-100 full zoom" src={sliderbanner} alt="slider-img" />
                        <div className="cnt_slider">
                          <div className="sub_tittle">Inspirations</div>
                          <h2>Passion revealed, space elevated</h2>
                          <button className="global_btn">View More</button>
                        </div>
                      </div>
                    </div>

                    <div className="item">
                      <div className="slider_big" >
                        <img className="w-100 full zoom" src={sliderbannertwo} alt="slider-img" />
                        <div className="cnt_slider">

                          <h2>Passion revealed, space elevated</h2>
                          <button className="global_btn">View More</button>
                        </div>
                      </div>
                    </div>
                  </OwlCarousel>
                </Col>

                <Col lg={4} >
                  <div className="just_bought global_card">
                    <div className="d-flex justify-content-between align-items-center">
                      <h1>Just Bought !</h1>
                      <div className="cs_btn">
                        <button onClick={handlePrev}>
                          <i className="fa-solid fa-angle-left"></i>
                        </button>
                        <button onClick={handleNext}>
                          <i className="fa-solid fa-angle-right"></i>
                        </button>
                      </div>
                    </div>
                    <OwlCarousel className=" owl-theme" {...knowledgebaseowl} ref={owlCarouselRef}>

                      {
                        justBought?.map((item, i) => (
                          <div className="item">
                            {item?.lists?.map((art, i) => (
                              <div className="main_baught_list_box">
                                <Row>
                                  <Col md={5} sm={5} xs={5}>
                                    <div className="baught_img">
                                      <Link to={`/product-details/${art?.productId?._id}`} className="baought_list">
                                        <img
                                          className="list_tumb w-100"
                                          src={imgBaseURL() + art?.productId?.thumbnail}
                                          alt="poster-img"
                                        />
                                      </Link>

                                    </div>
                                  </Col>
                                  <Col md={7} sm={7} xs={7} className="p-0">
                                    <div className="sub_tittle"><Link to={`/collection/${art?.artistId?._id}/${art?.productId?.directoryId?._id}`}>{art?.productId?.directoryId?.name}</Link></div>

                                    <Link to={`/product-details/${art?.productId?._id}`} className="baought_list">
                                      <h3>{art?.productId?.title}</h3>
                                    </Link>

                                    <div className="tiear_stauts_name d-flex align-items-center">
                                      <span className="me-2">
                                        <img src={badgebronze} alt="badge" />
                                      </span>
                                      <Link to={`/collection/${art?.artistId?._id}`}><div className="name text-capitalize">{art?.artistId?.first_name + " " + art?.artistId?.last_name}</div></Link>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            ))}

                          </div>
                        ))
                      }

                    </OwlCarousel>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
      }


      <section className="newartwork">
        <Container>
          <h4 className="left_global_heading">Newest artworks</h4>
          <Row>
            <div className="product_list_box">
              <OwlCarousel className=" owl-theme" {...newestartwork}>
                {productList?.length > 0 ? (
                  productList?.map((item, i) => (
                    <div className="product_box_outer">
                      <Link to={`/product-details/${item?._id}`}>

                        <div className="product_box">
                          <div className="main_show_image">
                            <img className="w-100" src={
                              item?.image
                                ? imgBaseURL() + item?.image
                                : productimg
                            }
                              alt="product-img"
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
                              <img src={badge} alt="badge" />
                            </span>
                            <div className="name">
                              {item?.artist?.first_name +
                                " " +
                                item?.artist?.last_name}
                            </div>
                          </div>

                        </div>

                      </Link>
                      <button className="wishlist border-0" onClick={() => {
                        addRemoveWishList(item?._id, getProductListFun, true)
                      }}>
                        {
                          item?.isWishlist ?
                            <i class="fa-solid fa-heart" style={{ color: '#008080' }}></i>
                            :
                            <i className="fa-regular fa-heart"></i>
                        }
                      </button>
                    </div>
                  ))
                ) : (
                  <></>
                )}


              </OwlCarousel>
            </div>
          </Row>
        </Container>
      </section>

      {/* 
      <section className="top_ten">
        <Container>
          <div className="shode_box " >
            <Row className="align-items-center">
              <Col lg={6}>
                <h4 class="left_global_heading">Top 10 by tier</h4>
              </Col>
              <Col lg={6} className="text-lg-end text-center">
                <div className="tab-cus-buttons">
                  <button
                    className={key === "one" ? "active" : ""}
                    onClick={() => handleSelect("one")}
                  >
                    <img src={firsttier} alt="icon_tier" />
                  </button>
                  <button
                    className={key === "two" ? "active" : ""}
                    onClick={() => handleSelect("two")}
                  >
                    <img src={silver} alt="icon_tier" />
                  </button>

                  <button
                    className={key === "three" ? "active" : ""}
                    onClick={() => handleSelect("three")}
                  >
                    <img src={gold} alt="icon_tier" />
                  </button>

                  <button
                    className={key === "four" ? "active" : ""}
                    onClick={() => handleSelect("four")}
                  >
                    <img src={diamond} alt="icon_tier" />
                  </button>
                </div>
              </Col>
            </Row>

            <Tabs
              class="d-none"
              defaultActiveKey="one"
              id="uncontrolled-tab-example"
              className="mb-3"
              activeKey={key}
            >
              <Tab eventKey="one" title="One">
                <Row
                  className="    row-cols-2
               row-cols-sm-2
               row-cols-xl-5
               row-cols-lg-4
               row-cols-md-3
               gx-md-5
               pt-1"
                >
                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={toptwo}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topthree}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topfour}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topfive}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topsix}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="two" title="Two">
                <Row
                  className="    row-cols-2
               row-cols-sm-2
               row-cols-xl-5
               row-cols-lg-4
               row-cols-md-3
               gx-5
               pt-1"
                >
                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimages}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimagesone}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimagestwo}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimagesthree}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="three" title="Three">
                <Row
                  className="    row-cols-2
               row-cols-sm-2
               row-cols-xl-5
               row-cols-lg-4
               row-cols-md-3
               gx-5
               pt-1"
                >
                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimages}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimagesone}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimagestwo}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimagesthree}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="four" title="Four">
                <Row
                  className="    row-cols-2
               row-cols-sm-2
               row-cols-xl-5
               row-cols-lg-4
               row-cols-md-3
               gx-5
               pt-1"
                >
                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimages}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimagesone}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimagestwo}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={topimagesthree}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>

                  <Col className="mb-4">
                    <div className="collection_grid" data-aos="zoom-in">
                      <img
                        className="w-100"
                        src={collectionimg}
                        alt="populat-collection-img"
                      />
                    </div>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </div>
        </Container>
      </section>
    */}
      <CollectionLIst title={"Popular collections this week"} data={popularCollection} />

      <Artworks title={"Best Selling Artworks"} data={bestSelling} fun={getHomePageData} />
      <Artworks title={"Trending Artworks"} data={trendingArt} fun={getHomePageData} />

      <section className="all_categores">
        <Container>
          <h4 class="left_global_heading mb-4 text-center">
            <Spinner animation="grow" size="sm" />  Still looking for a match?
          </h4>
          <Row
            className="row-cols-2
               row-cols-sm-2
               row-cols-xl-5
               row-cols-lg-4
               row-cols-md-3
               gx-md-5
               pt-1"
          >

            {
              categoryList?.slice(0, 10)?.map((item, i) => (
                <Col className="mb-2" key={i} style={{ cursor: 'pointer' }} onClick={() => habdleRedirect(item)}>
                  <div className="cat_box_inner text-center">
                    <div className="cat_img">
                      <img src={item?.image ? imgBaseURL() + item?.image : defaultIMG} alt="category-image" />
                    </div>
                    <p>{item?.name}</p>
                  </div>
                </Col>
              ))
            }


          </Row>

          <div className="text-center mt-3">
            <Link to={'/product-list'} class="global_btn">View All Category</Link>
          </div>
        </Container>
      </section>

      <section className="join_community">
        <Container>
          <div className="main_ouetr">
            <div className="main_icons">
              <Row className="justify-content-center">
                <Col md={4}>
                  <h5 className="mb-0 text-center">
                    Join Our Community
                    <br /> on
                  </h5>
                </Col>
                <Col md={3}>
                  <ul className="social_community mb-0">
                    <li>
                      <Link>
                        <img src={Feedback} alt="facebook-icon" />
                      </Link>
                    </li>
                    <li>
                      <Link>
                        <img src={insta} alt="facebook-icon" />
                      </Link>
                    </li>
                    <li>
                      <Link>
                        <img src={redit} alt="facebook-icon" />
                      </Link>
                    </li>
                    <li>
                      <Link>
                        <img src={tiktok} alt="facebook-icon" />
                      </Link>
                    </li>
                    <li>
                      <Link>
                        <img src={discord} alt="facebook-icon" />
                      </Link>
                    </li>
                    <li>
                      <Link>
                        <img src={pinterst} alt="facebook-icon" />
                      </Link>
                    </li>
                    <li>
                      <Link>
                        <img src={twitter} alt="facebook-icon" />
                      </Link>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </section>

      <section className="article">
        <Container>
          <OwlCarousel className=" owl-theme" {...article}>

            {
              blogList?.length > 0 &&
              blogList?.map((item, i) => (
                <div className="item">

                  <div className="blog_box">

                    <button onClick={() => viewBlogDetails(item)}>
                      <div className="blog_img">
                        <img className="w-100" src={imgBaseURL() + item?.image} alt="blog-img" />
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-4 mb-2">
                        <h6>{item?.title}</h6>
                        <div>
                          <svg
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.33337 17.5508L17.3334 7.55078M17.3334 7.55078H7.33337M17.3334 7.55078V17.5508"
                              stroke="#212121"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="d-flex"><HTMLContent data={item?.content.slice(0, 70)} /> </div>

                      <div
                        className="user_details d-flex align-items-center "
                        style={{ gap: "10px" }}
                      >

                        <div>
                          <h2>By Admin</h2>
                          <p>{timeAgo(item?.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  </div>

                </div>
              ))
            }

          </OwlCarousel>
        </Container>
      </section>

      <Newsletter />
    </div>
  );
};

export default Home;
