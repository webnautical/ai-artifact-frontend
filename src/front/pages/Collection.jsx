import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import bannerimg from "../../assets/images/banner.png";
import goldtier from "../../assets/images/gold-tiaer.png";
import productimg from "../../assets/images/product (1).webp";
import badge from "../../assets/images/badge (1).png";
import Pagination from "react-bootstrap/Pagination";
import CollectionLIst from "../../components/CollectionLIst";
import { useParams } from "react-router";
import { APICALL } from "../../helper/api/api";
import NoData from "../../components/NoData";
import noDataImg from '../../assets/images/animasi-emptystate.gif'
import FrontLoader from "../../components/FrontLoader";
import { Link } from "react-router-dom";
import { Rating, Stack } from "@mui/material";
import { defaultIMG, getTierImg, imgBaseURL } from "../../helper/Utility";
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
import WishlistIcon from "../../components/WishlistIcon";
 
const Collection = () => {
  const { userInfoByID, getUserByIDFun, addRemoveWishList } = useFrontDataContext();
  const { artist, directory } = useParams()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    getUserByIDFun(artist)
    getData(true)
  }, [artist, directory])
 
  const getData = async (load) => {
    setLoading(load)
    try {
      const param = directory ? { directoryId: directory } : { artistId: artist }
      const res = await APICALL('artist/getDirectoryWiseArtwork', 'post', param)
      setLoading(false)
      if (res?.status) {
        setList(res?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="Home_page collection_inner">
      <section className="hero_section">
        <Container fluid>
          <Row>
            <Col md={12} className="p-0">
            {
              userInfoByID?.banner ? 
              <img className="w-100" src={imgBaseURL() + userInfoByID?.banner} alt="banner-img" />
              :
              <img className="w-100" src={bannerimg} alt="banner-img" />
            }
            </Col>
          </Row>
        </Container>
      </section>
 
      <section className="product_list">
        <Container>
          {loading ? (
            <FrontLoader />
          ) : (
            <>
              {
                directory ?
                  <Row>
                    <Col md={12}>
                      <div className="main_head">
                        <div className="level_heading">
                          {userInfoByID?.userName} {" "}
                          <span className="tier_img">
                            {getTierImg(userInfoByID?.currentRank)?.icon}
                          </span>{" "}
                          {getTierImg(userInfoByID?.currentRank)?.text}
                        </div>
                      </div>
 
                      <div className="product_list_box">
                        <Row className="gx-2 row row-cols-1 row-cols-sm-2 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 g-3 pt-1">
                          {list?.length > 0 ? (
                            list?.map((item, i) => (
                              <Col md={3} sm={3} xs={6} className="mb-4" key={i}>
                                <div className="product_box_outer">
 
                                  <div className="product_box">
                                    <Link to={`/product-details/${item?._id}`}>
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
 
                                    </Link>
 
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
                                        {getTierImg(item?.artist_id?.currentRank)?.icon}
                                      </span>
 
                                      <div className="name">
                                        <Link to={`/collection/${item?.artist_id?._id}`}>{item?.artist_id?.userName}</Link>
                                      </div>
                                    </div>
 
                                  </div>
 
                                  <button
  className="wishlist border-0"
  onClick={() => {
    addRemoveWishList(item?._id, getData, true);
  }}
  aria-label={item?.isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
>
  <WishlistIcon item={item} />
</button>
                                </div>
                              </Col>
                            ))
                          ) : (
                            <NoData msg={"Oops !! No Art Found"} img={noDataImg} />
                          )}
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  :
                  <Row>
                    <div className="main_head mb-5">
                      <div className="level_heading">
                        {userInfoByID?.userName}
                        <span className="tier_img">
                        {getTierImg(userInfoByID?.currentRank)?.icon}
                        </span>{" "}
                        {getTierImg(userInfoByID?.currentRank)?.text}
                      </div>
                     
                    </div>
                    {
                      list?.map((item, i) => (
                        <Col md={6} lg={3} key={i} className="mb-3" >
                          <Link to={`/collection/${item?.artistId?._id}/${item?._id}`} className="popular_box">
                            <Row>
                              {
                                Array(4).fill(null).map((_, i) => (
                                  <Col xs={6} sm={6} md={6} lg={6} className="mb-4" key={i}>
                                    <div className="collection_grid">
                                      <img
                                        className="w-100"
                                        src={
                                          item?.products?.[i]?.thumbnail
                                            ? imgBaseURL() + item.products[i].thumbnail
                                            : defaultIMG
                                        }
                                        alt="popular-collection-img"
                                      />
                                    </div>
                                  </Col>
                                ))
                              }
                            </Row>
 
                            <div className="collection_by">
                              <div className="review_person_img">
                                <h5 className="first_letter">{item?.artistId?.userName.charAt(0)}</h5>
                              </div>
                              <div className="collection_by_details">
                                <h4>{item?.name}</h4>
                                <p>By {item?.artistId?.userName}</p>
                              </div>
                            </div>
                          </Link>
                        </Col>
                      ))
                    }
                  </Row>
 
 
 
              }
 
            </>
          )}
        </Container>
      </section>
 
      {/* <CollectionLIst className="hello" title={"Popular collections this week"} /> */}
 
 
    </div>
  );
};
 
export default Collection;