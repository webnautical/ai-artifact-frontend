import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import spiderimage from "../../../assets/images/product (7).webp";
import { useDataContext } from "../../../helper/context/ContextProvider";
import { APICALL } from "../../../helper/api/api";
import { imgBaseURL, timeAgo } from "../../../helper/Utility";
import FrontLoader from "../../../components/FrontLoader";
import orderplaced from "../../../assets/images/orderplace.gif";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (order_id) {
      getOrderDetailsByID();
    } else {
      navigate("/customer/orders");
    }
  }, [order_id]);

  const getOrderDetailsByID = async () => {
    setLoading(true);
    try {
      const res = await APICALL("/user/getOrderById", "post", { id: order_id });
      console.log(res);
      if (res?.status) {
        setOrderDetails(res?.data);
        setLoading(false);
      } else {
        setOrderDetails(null);
        setLoading(false);
      }
    } catch (error) {
      setOrderDetails(null);
      setLoading(false);
    }
  };
  const itemTotal = orderDetails?.orderItems?.reduce((acc, item) => {
    return acc + (item?.price * item?.quantity || 0);
  }, 0);
  return (
    <>
      {loading ? (
        <FrontLoader />
      ) : (
        <div className="main_order_succes_page">
          <Container>
            <Row className="justify-content-center">
              <Col md={7}>
                <div className="order_details_single text-center">
                  <div className="top_space">
                    <img src={orderplaced} alt="" />
                    <p className="order_dec mb-0">Your Order Will be processed with in 24 hour during working days. We will Notify you by email once your order has been shipped</p>

                  </div>
                  <div className="main_order_deatils">
                    <div className="order_details_inner gloab_card">
                      <Row>
                        <Col md={6} className="text-start mb-3">
                          <h3>Shipping Address</h3>
                          <ul className="p-0 m-0">
                            <li>
                              {" "}
                              {orderDetails?.shippingAddress?.firstName +
                                " " +
                                orderDetails?.shippingAddress?.lastName}
                            </li>
                            <li>
                              {" "}
                              {orderDetails?.shippingAddress?.contactPhone}
                            </li>
                            <li>{orderDetails?.shippingAddress?.email}</li>
                            <li>{orderDetails?.shippingAddress?.postalCode}, {orderDetails?.shippingAddress?.state}, {orderDetails?.shippingAddress?.city}</li>
                            <li>
                              {" "}
                              {orderDetails?.shippingAddress?.addressLine1} -{" "}
                              {orderDetails?.shippingAddress?.addressLine2}
                            </li>
                          </ul>
                        </Col>
                        <Col md={6} className="text-start  mb-3">
                          <h3>Order Summary</h3>
                          <ul className="p-0 m-0">
                            <li>
                              <p> Item</p>
                              <p>{orderDetails?.orderItems?.length}</p>
                            </li>

                            <li>
                              <p>Subtotal:</p>
                              <p>${parseInt(itemTotal)}</p>
                            </li>

                            <li>
                              <p> Shipping:</p>
                              <p>+ ${orderDetails?.shippingCharge}</p>
                            </li>
                            <li>
                              <p> Discount:</p>
                              <p> {orderDetails?.couponAmount ? `- $${orderDetails?.couponAmount}` : "---"}</p>
                            </li>
                            <li>
                              <p> Total:</p>
                              <p>${orderDetails?.totalPrice}</p>
                            </li>
                          </ul>
                        </Col>

                        <Col md={12} className="text-start  mb-3">
                          <h3>Payment Method</h3>
                          <ul className="p-0 m-0">
                            <li>{orderDetails?.paymentGateway}</li>
                          </ul>
                        </Col>

                      </Row>
                    </div>

                    <div className="order_all_details_uter">
                      <div>
                        <h2 className="d-flex justify-content-between">
                          <span> Order Id :</span>#{order_id}
                        </h2>
                      </div>
                      <Row className="align-items-center">
                        {orderDetails?.orderItems?.map((row, index) => (
                          <Col md={12}>
                            <Link to={`/product-details/${row.productId?._id}`}>
                              <div className="order_all_details mt-2  ">
                                <div className="order_img">
                                  <img
                                    src={imgBaseURL() + row.productId?.thumbnail}
                                    alt="product-image"
                                  />
                                </div>
                                <div className="order_text_details">
                                  <h3>{row.productId?.title}</h3>
                                  <div className="frame_details">
                                    <ul className="p-0 m-0">
                                      <li>
                                        <span>Size :</span> {row?.size}
                                      </li>
                                      <li>
                                        <span>Finish :</span> {row?.quality}
                                      </li>
                                      {row?.frameType && (
                                        <li>
                                          <span>Color : </span> {row?.frameType}
                                        </li>
                                      )}
                                      {row?.assembly && (
                                        <li>
                                          <span>Assembly : </span> {row?.assembly}
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default OrderSuccess;
