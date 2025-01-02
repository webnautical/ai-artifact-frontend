import React, { useState, useRef, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
// import sliderbanner from "../../assets/images/sliderbanner.png";
// import sliderbannertwo from "../../assets/images/bannertwo.webp";
// import baughtlistnew from "../../assets/images/baughtlisttwo.png";
import noDataImg from "../../assets/images/noart.png";
// import baughtlisttwo from "../../assets/images/baughtlist.png";
// import baughtlistthree from "../../assets/images/baought-4.png";
// import baughtlistfour from "../../assets/images/baought-3.png";
// import badge from "../../assets/images/badge (1).png";
// import badgebronze from "../../assets/images/1 - Bronze.png";
// import badgesilver from "../../assets/images/2 - Silver.png";
// import badgegold from "../../assets/images/3 - Gold.png";
// import badgedimond from "../../assets/images/4 - Diamond.png";
import productimg from "../../assets/images/new-1.png";
import Spinner from "react-bootstrap/Spinner";
// import productimgtwo from "../../assets/images/new-2.png";
// import productimgthree from "../../assets/images/new-3.png";
// import productimgfour from "../../assets/images/new-4.png";
// import productimgfive from "../../assets/images/new-5.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
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
// import blogthree from "../../assets/images/blog-3.png";
// import blogfaour from "../../assets/images/blog-4.png";
// import avtar from "../../assets/images/Avatar.png";
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
import {
  defaultIMG,
  getTierImg,
  imgBaseURL,
  timeAgo,
} from "../../helper/Utility";
import { Rating, Stack } from "@mui/material";
import { APICALL } from "../../helper/api/api";
import FrontLoader from "../../components/FrontLoader";
import { useDataContext } from "../../helper/context/ContextProvider";
import HTMLContent from "../../components/HTMLContent";
import WishlistIcon from "../../components/WishlistIcon";

const Home = () => {
  const { categoryList, getCategoryFun, getTierImgFun, getRankTier } =
    useDataContext();
  const navigate = useNavigate();
  const [key, setKey] = useState("one");
  const {
    getProductListFun,
    productList,
    contextLoader,
    addRemoveWishList,
    getHeaderContent,
    getGeneralSettingFun,
    generalSetting,
  } = useFrontDataContext();

  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState({
    artwork: false,
  });
  useEffect(() => {
    getTierImgFun();
    getProductListFun();
    getHeaderContent();
    getBlogFun();
    getCategoryFun();
    getHomePageData();
    getGeneralSettingFun();
  }, []);

  const handleSelect = (k) => {
    setSelected(k);
    getTop10Artwork(k?._id);
  };

  const [top10ArtworkList, setTop10ArtworkList] = useState([]);
  const getTop10Artwork = async (tierId) => {
    setListLoading({ ...listLoading, artwork: true });
    try {
      const res = await APICALL(`user/top10ByTier`, "post", { tierId: tierId });
      if (res?.status) {
        setTop10ArtworkList(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setListLoading({ ...listLoading, artwork: false });
    }
  };

  useEffect(() => {
    if (getRankTier) {
      setSelected(getRankTier[0]);
      getTop10Artwork(getRankTier[0]?._id);
    }
  }, [getRankTier]);

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
        items: 1.1,
        margin: 10,
      },
      600: {
        items: 3,
        margin: 10,
      },
      1000: {
        items: 3,

        loop: true,
      },
    },
  };

  const newestartwork = {
    loop: true, // Enable looping
    autoplay: false, // Autoplay can be turned off
    margin: 30, // General margin for items
    dots: false, // Disable dots
    nav: true, // Enable navigation
    responsiveClass: true, // Use responsive classes
    infinite: true, // Infinite scrolling
    speed: 100, // Speed of transition
    navText: [
      '<i class="fa fa-chevron-left" aria-hidden="true"></i><span class="sr-only">Previous</span>',
      '<i class="fa fa-chevron-right" aria-hidden="true"></i><span class="sr-only">Next</span>',
    ], // Custom Font Awesome arrows
    responsive: {
      0: {
        items: 2, // Show 2 items on small screens
        margin: 0,
      },
      600: {
        items: 4, // Show 4 items on medium screens
        margin: 10,
      },
      1000: {
        items: 5, // Show 5 items on large screens
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
      '<i class="fas fa-chevron-left" aria-hidden="true"></i>',
      '<i class="fas fa-chevron-right" aria-hidden="true"></i>',
    ],

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

  // // Handlers for Previous and Next buttons
  // const handlePrevFirst = () => {
  //   if (firstCarouselRef.current) {
  //     firstCarouselRef.current.prev();
  //   }
  // };

  // const handleNextFirst = () => {
  //   if (firstCarouselRef.current) {
  //     firstCarouselRef.current.next();
  //   }
  // };

  const [selected, setSelected] = useState();

  const owlCarouselRef = useRef(null);

  const firstCarouselRef = useRef(null);

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
  const [justBought, setJustBought] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [trendingArt, setTrendingArt] = useState([]);
  const [popularCollection, setPopularCollection] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [bannerList, setBannerList] = useState([]);

  const habdleRedirect = (page) => {
    const data = { category: page };
    navigate(`/product-list`, { state: { data: data } });
  };

  const getHomePageData = async () => {
    setLoading(true);
    const recentSold = await APICALL("user/recentSoldArtwork", "post", {});
    setLoading(false);
    if (recentSold?.status) {
      setJustBought(recentSold?.data);
    } else {
      setJustBought([]);
    }

    const bestSellingRes = await APICALL("user/bestsellingArtwork", "post", {});
    if (bestSellingRes?.status) {
      setBestSelling(bestSellingRes?.data);
    } else {
      setBestSelling([]);
    }

    const trendingRes = await APICALL("user/trendingArtworks", "post", {});
    if (trendingRes?.status) {
      setTrendingArt(trendingRes?.data);
    } else {
      setTrendingArt([]);
    }

    const popularCollectionRes = await APICALL(
      "user/getPopularCollectionsOverall",
      "post",
      {}
    );
    if (popularCollectionRes?.status) {
      setPopularCollection(popularCollectionRes?.data);
    } else {
      setPopularCollection([]);
    }
  };

  const getBlogFun = async () => {
    setLoading(true);
    const banner = await APICALL("admin/getActiveBanners", "post", {});
    setLoading(false);
    if (banner?.status) {
      setBannerList(banner?.data);
    } else {
      setBannerList([]);
    }

    const blogsRes = await APICALL("admin/allBlogs", "post", {});
    if (blogsRes?.status) {
      setBlogList(blogsRes?.data);
    } else {
      setBlogList([]);
    }
  };

  const viewBlogDetails = (item) => {
    navigate("/blog-details", { state: { data: item } });
  };

  return (
    <div className="main_homapage">
      {loading ? (
        <FrontLoader />
      ) : (
        <section className="slider_sec">
          <Container>
            <Row>
              <Col lg={8} className="web_banner">
                <div className="hero-slider">
                  <OwlCarousel
                    className="owl-theme"
                    {...heroslider}
                    ref={firstCarouselRef}
                  >
                    {bannerList
                      ?.filter((item) => item?.type === "web")
                      ?.map((item, i) => (
                        <div className="item" key={`first-${i}`}>
                          <div className="slider_big">
                            <img
                              className="w-100 full"
                              src={imgBaseURL() + item?.image}
                              alt="slider-img"
                              width="100%"
                              loading="lazy"
                            />
                            <div className="cnt_slider">
                              <h1>{item?.title}</h1>
                              <Link
                                to={item?.redirectUrl}
                                className="global_btn"
                              >
                                View More
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                  </OwlCarousel>
                </div>
              </Col>

              <Col lg={8} className="mobile_banner mb-4">
                <OwlCarousel
                  className=" owl-theme"
                  {...heroslider}
                  ref={owlCarouselRef}
                >
                  {bannerList
                    ?.filter((item) => item?.type === "mobile")
                    ?.map((item, i) => (
                      <div className="item">
                        <div className="slider_big">
                          <img
                            className="w-100 full zoom"
                            src={imgBaseURL() + item?.image}
                            alt="slider-img"
                            width="100%"
                            loading="lazy"
                          />
                          <div className="cnt_slider">
                            <h2>{item?.title}</h2>
                            <Link to={item?.redirectUrl} className="global_btn">
                              View More
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </OwlCarousel>
              </Col>

              <Col lg={4}>
                <div className="just_bought global_card">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2>Just Bought !</h2>
                    <div className="cs_btn">
                      <button onClick={handlePrev} aria-label="Previous">
                        <i
                          className="fa-solid fa-angle-left"
                          aria-hidden="true"
                        ></i>
                      </button>
                      <button onClick={handleNext} aria-label="Next">
                        <i
                          className="fa-solid fa-angle-right"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </div>
                  </div>
                  <OwlCarousel
                    className=" owl-theme"
                    {...knowledgebaseowl}
                    ref={owlCarouselRef}
                  >
                    {justBought?.map((item, i) => (
                      <div className="item">
                        {item?.lists?.map((art, i) => (
                          <div className="main_baught_list_box">
                            <div className="main_baught_list_box_outer">
                              <div>
                                <div className="baught_img">
                                  <Link
                                    to={`/product-details/${art?.productId?._id}`}
                                    className="baought_list"
                                  >
                                    <img
                                      className=" w-100"
                                      src={
                                        imgBaseURL() + art?.productId?.thumbnail
                                      }
                                      alt="poster-img"
                                      loading="lazy"
                                    />
                                  </Link>
                                </div>
                              </div>
                              <div className="my_main_baught_list_box_width">
                                <div className="sub_tittle">
                                  <Link
                                    to={`/collection/${art?.artistId?._id}/${art?.productId?.directoryId?._id}`}
                                  >
                                    {art?.productId?.directoryId?.name}
                                  </Link>
                                </div>

                                <Link
                                  to={`/product-details/${art?.productId?._id}`}
                                  className="baought_list"
                                >
                                  {art?.productId?.title}
                                </Link>

                                <div className="tiear_stauts_name d-flex align-items-center">
                                  <span className="me-2">
                                    {
                                      getTierImg(art?.artistId?.currentRank)
                                        ?.icon
                                    }
                                  </span>
                                  <Link
                                    to={`/collection/${art?.artistId?._id}`}
                                  >
                                    <div className="name text-capitalize">
                                      {art?.artistId?.userName}
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </OwlCarousel>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      <section className="newartwork">
        <Container>
          <div className="left_global_heading">
            <h3>Newest artworks</h3>
          </div>
          <Row>
            <div className="product_list_box">
              {productList?.length > 0 ? (
                <OwlCarousel className="owl-theme" {...newestartwork}>
                  {productList.slice(0, 20)?.map(
                    (
                      item,
                      i // Limit the number of items rendered
                    ) => (
                      <div className="product_box_outer" key={item?._id}>
                        <Link to={`/product-details/${item?._id}`}>
                          <div className="product_box">
                            <div className="main_show_image">
                              <img
                                className="w-100"
                                src={
                                  item?.thumbnail
                                    ? imgBaseURL() + item?.thumbnail
                                    : productimg
                                }
                                alt={item?.title || "product-img"}
                                // loading="lazy" // Add lazy loading for images
                              />
                            </div>
                            <h3 className="product_name">{item?.title}</h3>
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
                              <p className="name m-0">
                                {item?.artist?.userName}
                              </p>
                            </div>
                          </div>
                        </Link>
                        <button
                          className="wishlist border-0"
                          aria-label={`Add or remove ${
                            item?.name || "item"
                          } from wishlist`}
                          onClick={() => {
                            addRemoveWishList(
                              item?._id,
                              getProductListFun,
                              true
                            );
                          }}
                        >
                          <WishlistIcon item={item} />
                        </button>
                      </div>
                    )
                  )}
                </OwlCarousel>
              ) : (
                <p>No products available</p> // Add fallback message
              )}
            </div>
          </Row>
        </Container>
      </section>

      <section className="top_ten">
        <Container>
          <div className="shode_box ">
            <Row className="align-items-center">
              <Col lg={6}>
                <div className="left_global_heading">
                  <h3>Top 10 by tier</h3>
                </div>
              </Col>

              <Col lg={6} className="text-lg-end text-center">
                <div className="tab-cus-buttons">
                  {getRankTier
                    ?.filter((item) => item?.name !== "Unranked")
                    ?.map((item, i) => (
                      <button
                        className={
                          item?.name === selected?.name ? "active" : ""
                        }
                        onClick={() => handleSelect(item)}
                      >
                        <img
                          src={imgBaseURL() + item?.icon}
                          alt="icon_tier"
                          width="41px"
                          height="41px"
                          style={{ objectFit: "contain" }}
                          loading="lazy"
                        />
                      </button>
                    ))}
                </div>
              </Col>
            </Row>

            <Tabs
              class="d-none"
              defaultActiveKey={selected?._id}
              id="uncontrolled-tab-example"
              className="mb-3"
              activeKey={selected?._id}
            >
              <Tab eventKey={selected?._id} title={selected?._id}>
                <Row className="row-cols-2 row-cols-sm-2 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 gx-md-5 pt-1">
                  {listLoading?.artwork ? (
                    <>
                      <div className="col outer_top_ten text-center">
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </div>
                    </>
                  ) : top10ArtworkList?.length > 0 ? (
                    top10ArtworkList.map((row, i) => (
                      <Col className="mb-4">
                        <div className="collection_grid">
                          <Link to={`/product-details/${row?.product?._id}`}>
                            <img
                              className="w-100"
                              src={imgBaseURL() + row?.product?.thumbnail}
                              alt="populat-collection-img"
                              loading="lazy"
                            />
                          </Link>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <>
                      <div className="outer_top_ten">
                        <div className="top_ten_arts text-center mt-3">
                          <img src={noDataImg} alt="no-art" loading="lazy" />
                          <h4 className="mt-3">
                            There are no artwork on this tier !
                          </h4>
                        </div>
                      </div>
                    </>
                  )}
                </Row>
              </Tab>
            </Tabs>
          </div>
        </Container>
      </section>

      <CollectionLIst
        title={"Popular collections this week"}
        data={popularCollection}
      />

      <Artworks
        title={"Best Selling Artworks"}
        data={bestSelling}
        fun={getHomePageData}
      />
      <Artworks
        title={"Trending Artworks"}
        data={trendingArt}
        fun={getHomePageData}
      />

      <section className="all_categores">
        <Container>
          <div className="left_global_heading">
            <h3 class="left_global_heading  mb-4 text-center">
              <Spinner animation="grow" size="sm" /> Still looking for a match?
            </h3>
          </div>
          <Row
            className="row-cols-2
               row-cols-sm-2
               row-cols-xl-5
               row-cols-lg-4
               row-cols-md-3
               gx-md-5
               pt-1
               justify-content-center
               "
          >
            {categoryList?.slice(0, 10)?.map((item, i) => (
              <Col
                className="mb-2"
                key={i}
                style={{ cursor: "pointer" }}
                onClick={() => habdleRedirect(item)}
              >
                <div className="cat_box_inner text-center">
                  <div className="cat_img">
                    <img
                      src={
                        item?.image ? imgBaseURL() + item?.image : defaultIMG
                      }
                      alt="category-image"
                      loading="lazy" // Enable lazy loading
                    />
                  </div>
                  <p>{item?.name}</p>
                </div>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-3">
            <Link to={"/product-list"} class="global_btn">
              View all categories
            </Link>
          </div>
        </Container>
      </section>

      <section className="join_community">
        <Container>
          <div className="main_ouetr">
            <div className="main_icons">
              <Row className="justify-content-center">
                <Col md={4}>
                  <h4 className="mb-0 text-center">
                    Join Our Community
                    <br /> on
                  </h4>
                </Col>
                <Col md={3}>
                  <ul className="social_community mb-0">
                    <li>
                      <Link
                        to={generalSetting?.facebookUrl}
                        target="_blank"
                        aria-label="Visit our Facebook page"
                        title="Facebook"
                      >
                        <img
                          src={Feedback}
                          alt="Facebook icon"
                          loading="lazy"
                          width="54px"
                          height="54px"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={generalSetting?.instagramUrl}
                        target="_blank"
                        aria-label="Visit our Instagram page"
                        title="Instagram"
                      >
                        <img
                          src={insta}
                          alt="Instagram icon"
                          loading="lazy"
                          width="54px"
                          height="54px"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={generalSetting?.redditUrl}
                        target="_blank"
                        aria-label="Visit our Reddit page"
                        title="Reddit"
                      >
                        <img
                          src={redit}
                          alt="Reddit icon"
                          loading="lazy"
                          width="54px"
                          height="54px"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={generalSetting?.tiktokUrl}
                        target="_blank"
                        aria-label="Visit our TikTok page"
                        title="TikTok"
                      >
                        <img
                          src={tiktok}
                          alt="TikTok icon"
                          loading="lazy"
                          width="54px"
                          height="54px"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={generalSetting?.discordUrl}
                        target="_blank"
                        aria-label="Visit our Discord server"
                        title="Discord"
                      >
                        <img
                          src={discord}
                          alt="Discord icon"
                          loading="lazy"
                          width="54px"
                          height="54px"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={generalSetting?.pinterestUrl}
                        target="_blank"
                        aria-label="Visit our Pinterest page"
                        title="Pinterest"
                      >
                        <img
                          src={pinterst}
                          alt="Pinterest icon"
                          loading="lazy"
                          width="54px"
                          height="54px"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={generalSetting?.twitterUrl}
                        target="_blank"
                        aria-label="Visit our Twitter page"
                        title="Twitter"
                      >
                        <img
                          src={twitter}
                          alt="Twitter icon"
                          loading="lazy"
                          width="54px"
                          height="54px"
                        />
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
            {blogList?.length > 0 &&
              blogList?.map((item, i) => (
                <div className="item">
                  <div className="blog_box">
                    <button onClick={() => viewBlogDetails(item)}>
                      <div className="blog_img">
                        <img
                          className="w-100"
                          src={imgBaseURL() + item?.image}
                          alt="blog-img"
                          loading="lazy"
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-4 mb-2">
                        <h3>{item?.title}</h3>
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

                      <div className="d-flex">
                        <HTMLContent data={item?.content.slice(0, 70)} />{" "}
                      </div>

                      <div
                        className="user_details d-flex align-items-center "
                        style={{ gap: "10px" }}
                      >
                        <div>
                          <h4>By Admin</h4>
                          <p>{timeAgo(item?.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
          </OwlCarousel>
        </Container>
      </section>
      <Newsletter />
    </div>
  );
};

export default Home;
