import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import badge from "../../assets/images/badge (1).png";
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
import { auth, getTierImg, imgBaseURL } from "../../helper/Utility";
import FrontLoader from "../../components/FrontLoader";
import BTNLoader from "./../../components/BTNLoader";
import { Link, useNavigate } from "react-router-dom";
import { P_UID, UID_OBJ } from "../../helper/Constant";
import wishlistempty from "../../assets/images/wishlistempty.png";

const Wishlist = () => {
  const navigate = useNavigate();
  const {
    getWishListFun,
    wishlist,
    contextLoader,
    addToCartFun,
    addRemoveWishList,
    guestWishlist,
    getGuestWishListProduct,
  } = useFrontDataContext();

  useEffect(() => {
    if (auth("customer")) {
      getWishListFun();
    } else {
      // if (guestWishlist?.length > 0) {
      getGuestWishListProduct(guestWishlist);
      // }
    }
  }, [guestWishlist]);

  return (
    <>
      <div className="wislist_page">
        <section className="wishlist_box">
          <Container>
            <h1 className="mb-md-5 mb-4">Wishlist</h1>
            {contextLoader?.wishlist ? (
              <FrontLoader />
            ) : (
              <>
                <div className="">
                  {wishlist?.length > 0 ? (
                    <Row
                      className="row-cols-2
               row-cols-sm-2
               row-cols-xl-5
               row-cols-lg-4
               row-cols-md-3
              
               pt-1 justify-content-start wiaslist_sec"
                    >
                      {wishlist?.map((item, i) => (
                        <Col className="mb-4">
                          <div className="product_box">
                            <Link
                              to={`/product-details/${item?.product_id?._id}`}
                            >
                              <div className="main_show_image">
                                <img
                                  className="w-100"
                                  src={
                                    imgBaseURL() + item?.product_id?.thumbnail
                                  }
                                  alt="product-img"
                                />
                              </div>
                              <div className="product_name">
                                {item?.product_id?.title}
                              </div>
                              <div className="tiear_stauts_name d-flex align-items-center">
                                <span className="me-2">
                                  {
                                    getTierImg(
                                      item?.product_id?.artist_id?.currentRank
                                    )?.icon
                                  }
                                </span>
                                <div className="name">
                                  {item?.product_id?.artist_id?.userName}
                                </div>
                              </div>
                            </Link>
                            <button
                              className="wishlist border-0"
                              onClick={() => {
                                addRemoveWishList(
                                  item?.product_id?._id,
                                  getWishListFun,
                                  true
                                );
                              }}
                            >
                            <i
  className="fa-solid fa-heart"
  style={{ color: "#008080" }}
  aria-hidden="true"
></i>
                            </button>

                            {contextLoader?.addToCart[item?.product_id?._id] ? (
                              <BTNLoader className="global_btn w-100 mt-2" />
                            ) : (
                              <button
                                className="global_btn w-100 mt-2"
                                onClick={() => {
                                  addToCartFun(
                                    item?.product_id?._id,
                                    1,
                                    P_UID,
                                    UID_OBJ
                                  );
                                }}
                              >
                                <i class="fa-solid fa-bag-shopping me-2"></i>Add
                                to Cart
                              </button>
                            )}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <>
                      <div className="cart_em_img text-center mt-mb-4">
                        <img
                          style={{ width: "128px" }}
                          src={wishlistempty}
                          alt=""
                        />
                        <h5 className="mt-2 mb-2">Your wishlist is empty.</h5>
                        <p>
                          Your wishlist is currently empty. Start adding items
                          to your cart!
                        </p>
                        <Link
                          className="global_btn d-inline-block "
                          to="/product-list"
                        >
                          Shop
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </Container>
        </section>
      </div>
    </>
  );
};

export default Wishlist;
