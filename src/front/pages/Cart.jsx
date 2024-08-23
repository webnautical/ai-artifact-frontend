import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Newsletter from "../../components/Newsletter";
import paymentimg from '../../assets/images/payment-method.png'
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";
import { auth, imgBaseURL } from "../../helper/Utility";
import FrontLoader from "../../components/FrontLoader";
import BTNLoader from "../../components/BTNLoader";
import QuantitySelector from "../../components/QuantitySelector ";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import emptycart from "../../assets/images/cart-empty.png";
const Cart = () => {
  const navigate = useNavigate()
  const { contextLoader, getCartListFun, cartList, addToCartFun } = useFrontDataContext();
  useEffect(() => {
    if (auth('customer')) {
      getCartListFun()
    } else {
      navigate('/login/customer')
    }
  }, [])
 
  const qntChange = (qnt, product_id, uid, initialQuantity) => {
    const qntt = initialQuantity === undefined ? 1 : -1
    addToCartFun(product_id, qntt, uid, 0, "qntChange");
  };
 
  const itemTotal = cartList.reduce((acc, item) => {
    return acc + (item?.row_uid?.price * item?.quantity || 0);
  }, 0);
  const totalPrice = parseInt(itemTotal) 
 
  const handleContinue = () => {
    const data = {
      cartItem : cartList,
      subTotal : parseInt(itemTotal),
      totalPrice : totalPrice,
    }
    navigate(`/shipping-details`, {state: {data}})
  }
 
  return (
    <>
      <div className="cart_page">
        <Container>
          <h1 className="mb-md-5 mb-4">Your Cart</h1>
          {
            contextLoader?.cartList ? <FrontLoader /> :
              <Row>
                <Col lg={9} className="mb-lg-0 mb-3">
                  <div className="cart_list_box">
 
                    {
                      cartList?.length > 0 ?
                        cartList?.map((item, i) => (
                          <div className="cart_list">
                            <div className="product_image">
                              <img src={imgBaseURL() + item?.product_id?.thumbnail} alt="product-image" />
                            </div>
 
                            <div className="about_details_product">
                              <h2>{item?.product_id?.title}</h2>
                              <div className="about_frame d-flex justify-content-between align-items-center">
                                <div>
                                <ul>
                                  <li>
                                    <span>Size :</span> {item?.size}
                                  </li>
                                  <li>
                                    <span>Finish :</span> {item?.quality}
                                  </li>
                                  {
                                    item?.frameType &&
                                    <li>
                                      <span>Color : </span> {item?.frameType}
                                    </li>
                                  }
                                  {
                                    item?.assembly &&
                                    <li>
                                      <span>Assembly : </span> {item?.assembly}
                                    </li>
                                  }
                                </ul>

                                <div className="add-remove-btn mt-2">
                                {
                                  contextLoader.addToCart[item?.product_id?._id] ?
                                    <BTNLoader className='remove_btn' /> :
                                    <button className='remove_btn' onClick={() => { addToCartFun(item?.product_id?._id, 0, item?.row_uid?.test_id || item?.row_uid?.productUid, 'remove') }}>Remove</button>
                                }
 
                                {/* <p>Item Price: <strong>${parseInt(item?.row_uid?.price) * item?.quantity}</strong></p> */}
                              </div>
 </div>
                                <div className="price_quantity text-end">
                                  <h3 className="mb-md-3">${parseInt(item?.row_uid?.price)} x {item?.quantity}</h3>
                                  <QuantitySelector initialQuantity={item?.quantity} onQuantityChange={qntChange} product_id={item?.product_id?._id} uid={item?.row_uid?.test_id || item?.row_uid?.productUid} />
                                </div>
                              </div>
 
                           
                            </div>
                          </div>
                        ))
                        :
                        <>
                          <div className="cart_em_img text-center mt-mb-4">
                            <img src={emptycart} alt="" />
                            <h5 className="mt-2">Your Cart is empty.</h5>
                            <p>
                              Your cart is currently empty. Start adding items to
                              your cart!
                            </p>
                            <Link className="global_btn " to="/product-list">Shop</Link>
 
                          </div>
                        </>
                    }
 
 
                  </div>
                </Col>
 
                <Col lg={3}>
 
                  <div className="ship_to gloab_card mb-md-0 mb-3">
                    <ul className="p-0">
                      <h3>Checkout</h3>
                      <li>
                        <div>Est. Total:</div>
                        <div className="Prcie_final">${totalPrice}</div>
                      </li>
                    </ul>
                    {
                      cartList?.length > 0 ?
                        <button class="global_btn w-100" type="button" onClick={() => handleContinue()}>Checkout</button>
                        :
                        <button class="global_btn w-100" type="button" style={{ cursor: "not-allowed" }} disabled>Checkout</button>
                    }
 
                    <div className="payment_method W-100 mt-3">
                      <img className="w-100" src={paymentimg} alt="payment-method-icon" />
                    </div>
                    {/* <p className="mt-3 text-center mb-0">Return with in <b>100</b> days</p> */}
                  </div>
 
 
                </Col>
              </Row>
          }
        </Container>
      </div>
 
      <Newsletter />
    </>
  );
};
 
export default Cart;