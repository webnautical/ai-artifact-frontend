import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useFrontDataContext } from "../helper/context/FrontContextProvider";
import { auth, imgBaseURL } from "../helper/Utility";
import { Link } from "react-router-dom";
import BTNLoader from "./BTNLoader";
import { P_UID, UID_OBJ } from "../helper/Constant";
import { APICALL } from "../helper/api/api";
 
const Artworks = ({ title, type, category_id, data, fun }) => {
  const { addToCartFun, contextLoader, addRemoveWishList } = useFrontDataContext();
  const obj = { limit: 6, categoryId: category_id }
 
  useEffect(() => {
    relatedProduct()
  }, [])
 
  const [productList, setProductList] = useState([])
  const relatedProduct = async () => {
    const res = await APICALL("user/allArtwork", "post", obj);
    if (res?.status) {
      setProductList(res?.data);
    } else {
      setProductList([]);
    }
  }
 
  return (
    <section className="artworks">
      <Container>
        <Row className="align-items-center" >
          <Col md={6}>
          <div className="left_global_heading ">
            <h3 className="mb-4">{title || "Best Selling Artworks"}</h3>
            </div>
          </Col>
        </Row>
 
        {
          type === 'related_art' ?
            productList?.length > 0 ?
              <Row>
                <Col lg={6} className="mb-lg-0 mb-3">
                  <div className="artworks_box">
                    <Row>
                      {
                        productList[0] &&
                        <Col md={8} sm={8} className="mb-sm-0 mb-3" >
                          <div className="grid_box_artwork_big">
                            <Link to={`/product-details/${productList[0]?._id}`}>
                              <img
                                src={imgBaseURL() + productList[0]?.thumbnail}
                                alt="artwork-images"
                                className="w-100"
                                  loading="lazy" 
                              />
                            </Link>
                            <div className="animation_btn d-flex justify-content-between">
                              {
                                contextLoader.addToCart[productList[0]?._id] ?
                                  <BTNLoader className='white_global_btn w-100' /> :
                                  <button type="button" onClick={() => addToCartFun(productList[0]?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                    <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                              }
 
                              {
                                auth('customer') &&
                                <button className="wish_list bg-none border-0" onClick={() => {
                                  addRemoveWishList(productList[0]?._id, relatedProduct, true)
                                }}>
                                  {productList[0]?.isWishlist ?
                                    <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                </button>
                              }
                            </div>
                          </div>
                        </Col>
                      }
                      <Col md={4} sm={4} className="mb-sm-0 mb-3">
                        <div className="grid_box_artwork">
                          {productList[1] &&
                            <div className="img_box">
                              <Link to={`/product-details/${productList[1]?._id}`}>
                                <img
                                  src={imgBaseURL() + productList[1]?.thumbnail}
                                  alt="artwork-images"
                                  className="w-100"
                                    loading="lazy" 
                                />
                              </Link>
                              <div className="animation_btn d-flex justify-content-between">
                                {
                                  contextLoader.addToCart[productList[1]?._id] ?
                                    <BTNLoader className='white_global_btn w-100' /> :
                                    <button type="button" onClick={() => addToCartFun(productList[1]?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                      <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                                }
                                {
                                  auth('customer') &&
                                  <button className="wish_list bg-none border-0" onClick={() => {
                                    addRemoveWishList(productList[1]?._id, relatedProduct, true)
                                  }}>
                                    {productList[1]?.isWishlist ?
                                      <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                  </button>
                                }
                              </div>
                            </div>
                          }
                          {productList[2] &&
                            <div className="img_box">
                              <Link to={`/product-details/${productList[2]?._id}`}>
                                <img
                                  src={imgBaseURL() + productList[2]?.thumbnail}
                                  alt="artwork-images"
                                  className="w-100"
                                    loading="lazy" 
                                />
                              </Link>
                              <div className="animation_btn d-flex justify-content-between">
                                {
                                  contextLoader.addToCart[productList[2]?._id] ?
                                    <BTNLoader className='white_global_btn w-100' /> :
                                    <button type="button" onClick={() => addToCartFun(productList[2]?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                      <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                                }
                                {
                                  auth('customer') &&
                                  <button className="wish_list bg-none border-0" onClick={() => {
                                    addRemoveWishList(productList[2]?._id, relatedProduct, true)
                                  }}>
                                    {productList[2]?.isWishlist ?
                                      <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                  </button>
                                }
                              </div>
                            </div>
                          }
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
 
                <Col lg={6} className="mb-lg-0 mb-3">
                  <div className="artworks_box">
                    <Row>
                      {
                        productList[3] &&
                        <Col md={8} sm={8} className="mb-sm-0 mb-3" >
                          <div className="grid_box_artwork_big">
                            <Link to={`/product-details/${productList[3]?._id}`}>
                              <img
                                src={imgBaseURL() + productList[3]?.thumbnail}
                                alt="artwork-images"
                                className="w-100"
                                  loading="lazy" 
                              />
                            </Link>
                            <div className="animation_btn d-flex justify-content-between">
                              {
                                contextLoader.addToCart[productList[3]?._id] ?
                                  <BTNLoader className='white_global_btn w-100' /> :
                                  <button type="button" onClick={() => addToCartFun(productList[3]?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                    <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                              }
                              {
                                auth('customer') &&
                                <button className="wish_list bg-none border-0" onClick={() => {
                                  addRemoveWishList(productList[3]?._id, relatedProduct, true)
                                }}>
                                  {productList[3]?.isWishlist ?
                                    <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                </button>
                              }
                            </div>
                          </div>
                        </Col>
                      }
                      <Col md={4} sm={4} className="mb-sm-0 mb-4">
                        <div className="grid_box_artwork">
                          {productList[4] &&
                            <div className="img_box">
                              <Link to={`/product-details/${productList[4]?._id}`}>
                                <img
                                  src={imgBaseURL() + productList[4]?.thumbnail}
                                  alt="artwork-images"
                                  className="w-100"
                                    loading="lazy" 
                                />
                              </Link>
                              <div className="animation_btn d-flex justify-content-between">
                                {
                                  contextLoader.addToCart[productList[4]?._id] ?
                                    <BTNLoader className='white_global_btn w-100' /> :
                                    <button type="button" onClick={() => addToCartFun(productList[4]?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                      <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                                }
                                {
                                  auth('customer') &&
                                  <button className="wish_list bg-none border-0" onClick={() => {
                                    addRemoveWishList(productList[4]?._id, relatedProduct, true)
                                  }}>
                                    {productList[4]?.isWishlist ?
                                      <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                  </button>
                                }
                              </div>
                            </div>
                          }
                          {productList[5] &&
                            <div className="img_box">
                              <Link to={`/product-details/${productList[5]?._id}`}>
                                <img
                                  src={imgBaseURL() + productList[5]?.thumbnail}
                                  alt="artwork-images"
                                  className="w-100"
                                    loading="lazy" 
                                />
                              </Link>
                              <div className="animation_btn d-flex justify-content-between">
                                {
                                  contextLoader.addToCart[productList[5]?._id] ?
                                    <BTNLoader className='white_global_btn w-100' /> :
                                    <button type="button" onClick={() => addToCartFun(productList[5]?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                      <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                                }
                                {
                                  auth('customer') &&
                                  <button className="wish_list bg-none border-0" onClick={() => {
                                    addRemoveWishList(productList[5]?._id, relatedProduct, true)
                                  }}>
                                    {productList[5]?.isWishlist ?
                                      <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                  </button>
                                }
                              </div>
                            </div>
                          }
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
 
              </Row>
              :
              <>There are no related art</>
            :
            data?.length > 0 ?
              <Row >
                <Col lg={6} className="mb-lg-0 mb-0">
                  <div className="artworks_box">
                    <Row>
                      {
                        data[0]?.product &&
                        <Col md={8} sm={8} className="mb-sm-0 mb-3" >
                          <div className="grid_box_artwork_big">
                            <Link to={`/product-details/${data[0]?.product?._id}`}>
                              <img
                                src={imgBaseURL() + data[0]?.product?.thumbnail}
                                alt="artwork-images"
                                className="w-100"
                                  loading="lazy" 
                              />
                            </Link>
                            <div className="animation_btn d-flex justify-content-between">
                              {
                                contextLoader.addToCart[data[0]?.product?._id] ?
                                  <BTNLoader className='white_global_btn w-100' /> :
                                  <button type="button" onClick={() => addToCartFun(data[0]?.product?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                    <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                              }
                              {
                                auth('customer') &&
                                <button className="wish_list bg-none border-0" onClick={() => {
                                  addRemoveWishList(data[0]?.product?._id, fun, true)
                                }}>
                                  {data[0]?.product?.isWishlist ?
                                    <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                </button>
                              }
                            </div>
                          </div>
                        </Col>
                      }
                      <Col md={4} sm={4} className="mb-sm-0 mb-4">
                        <div className="grid_box_artwork">
                          {data[1]?.product &&
                            <div className="img_box">
                              <Link to={`/product-details/${data[1]?.product?._id}`}>
                                <img
                                  src={imgBaseURL() + data[1]?.product?.thumbnail}
                                  alt="artwork-images"
                                  className="w-100"
                                    loading="lazy" 
                                />
                              </Link>
                              <div className="animation_btn d-flex justify-content-between">
                                {
                                  contextLoader.addToCart[data[1]?.product?._id] ?
                                    <BTNLoader className='white_global_btn w-100' /> :
                                    <button type="button" onClick={() => addToCartFun(data[1]?.product?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                      <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                                }
                                {
                                  auth('customer') &&
                                  <button className="wish_list bg-none border-0" onClick={() => {
                                    addRemoveWishList(data[1]?.product?._id, fun, true)
                                  }}>
                                    {data[1]?.product?.isWishlist ?
                                      <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                  </button>
                                }
                              </div>
                            </div>
                          }
                          {data[2]?.product &&
                            <div className="img_box">
                              <Link to={`/product-details/${data[2]?.product?._id}`}>
                                <img
                                  src={imgBaseURL() + data[2]?.product?.thumbnail}
                                  alt="artwork-images"
                                  className="w-100"
                                    loading="lazy" 
                                />
                              </Link>
                              <div className="animation_btn d-flex justify-content-between">
                                {
                                  contextLoader.addToCart[data[2]?.product?._id] ?
                                    <BTNLoader className='white_global_btn w-100' /> :
                                    <button type="button" onClick={() => addToCartFun(data[2]?.product?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                      <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                                }
                                {
                                  auth('customer') &&
                                  <button className="wish_list bg-none border-0" onClick={() => {
                                    addRemoveWishList(data[2]?.product?._id, fun, true)
                                  }}>
                                    {data[2]?.product?.isWishlist ?
                                      <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                  </button>
                                }
                              </div>
                            </div>
                          }
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
 
                <Col lg={6} className="mb-lg-0 mb-3">
                  <div className="artworks_box">
                    <Row>
                      {
                        data[3]?.product &&
                        <Col md={8} sm={8} className="mb-sm-0 mb-3" >
                          <div className="grid_box_artwork_big">
                            <Link to={`/product-details/${data[3]?.product?._id}`}>
                              <img
                                src={imgBaseURL() + data[3]?.product?.thumbnail}
                                alt="artwork-images"
                                className="w-100"
                                  loading="lazy" 
                              />
                            </Link>
                            <div className="animation_btn d-flex justify-content-between">
                              {
                                contextLoader.addToCart[data[3]?.product?._id] ?
                                  <BTNLoader className='white_global_btn w-100' /> :
                                  <button type="button" onClick={() => addToCartFun(data[3]?.product?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                    <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                              }
                              {
                                auth('customer') &&
                                <button className="wish_list bg-none border-0" onClick={() => {
                                  addRemoveWishList(data[3]?.product?._id, fun, true)
                                }}>
                                  {data[3]?.product?.isWishlist ?
                                    <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                </button>
                              }
                            </div>
                          </div>
                        </Col>
                      }
                      <Col md={4} sm={4} className="mb-sm-0 mb-4">
                        <div className="grid_box_artwork">
                          {data[4]?.product &&
                            <div className="img_box">
                              <Link to={`/product-details/${data[4]?.product?._id}`}>
                                <img
                                  src={imgBaseURL() + data[4]?.product?.thumbnail}
                                  alt="artwork-images"
                                  className="w-100"
                                    loading="lazy" 
                                />
                              </Link>
                              <div className="animation_btn d-flex justify-content-between">
                                {
                                  contextLoader.addToCart[data[4]?.product?._id] ?
                                    <BTNLoader className='white_global_btn w-100' /> :
                                    <button type="button" onClick={() => addToCartFun(data[4]?.product?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                      <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                                }
                                {
                                  auth('customer') &&
                                  <button className="wish_list bg-none border-0" onClick={() => {
                                    addRemoveWishList(data[4]?.product?._id, fun, true)
                                  }}>
                                    {data[4]?.product?.isWishlist ?
                                      <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                  </button>
                                }
                              </div>
                            </div>
                          }
                          {data[5]?.product &&
                            <div className="img_box">
                              <Link to={`/product-details/${data[5]?.product?._id}`}>
                                <img
                                  src={imgBaseURL() + data[5]?.product?.thumbnail}
                                  alt="artwork-images"
                                  className="w-100"
                                    loading="lazy" 
                                />
                              </Link>
                              <div className="animation_btn d-flex justify-content-between">
                                {
                                  contextLoader.addToCart[data[5]?.product?._id] ?
                                    <BTNLoader className='white_global_btn w-100' /> :
                                    <button type="button" onClick={() => addToCartFun(data[5]?.product?._id, 1, P_UID, UID_OBJ, 'addToCart')} className="white_global_btn w-100">
                                      <i className="fa-solid fa-bag-shopping"></i>  Cart</button>
                                }
                                {
                                  auth('customer') &&
                                  <button className="wish_list bg-none border-0" onClick={() => {
                                    addRemoveWishList(data[5]?.product?._id, fun, true)
                                  }}>
                                    {data[5]?.product?.isWishlist ?
                                      <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i> : <i className="fa-regular fa-heart"></i>}
                                  </button>
                                }
                              </div>
                            </div>
                          }
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
 
              </Row>
              :
              <>There are no art to display</>
        }
 
 
        <div className="text-center mt-md-5 mt-0 ">
          <Link to='/product-list' className="global_btn">View More</Link>
        </div>
      </Container>
    </section>
  );
};
 
export default Artworks;