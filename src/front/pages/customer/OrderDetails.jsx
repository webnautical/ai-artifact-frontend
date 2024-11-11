import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router'
import spiderimage from "../../../assets/images/product (7).webp";
import { useDataContext } from '../../../helper/context/ContextProvider';
import { APICALL } from '../../../helper/api/api';
import { imgBaseURL, timeAgo } from '../../../helper/Utility';
import FrontLoader from '../../../components/FrontLoader';
import { Link } from 'react-router-dom';

const OrderDetails = () => {
    const order_id = useLocation()?.state?.order_id || null
    const navigate = useNavigate()
    const [orderDetails, setOrderDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [adminDetails, setAdminDetails] = useState('')
    useEffect(() => {
        if (order_id) {
            getOrderDetailsByID()
        } else {
            navigate('/customer/orders')
        }
    }, [order_id])


    const getOrderDetailsByID = async () => {
        setLoading(true)
        try {
            const res = await APICALL('/user/getOrderById', 'post', { id: order_id })
            if (res?.status) {
                setAdminDetails(res?.admin_mail)
                setOrderDetails(res?.data)
                setLoading(false)
            } else {
                setOrderDetails(null)
                setLoading(false)
            }
        } catch (error) {
            setOrderDetails(null)
            setLoading(false)
        }
    }
    const itemTotal = orderDetails?.orderItems?.reduce((acc, item) => {
        return acc + (item?.price * item?.quantity || 0);
    }, 0);
    return (
        <>
            {
                loading ? <FrontLoader /> :
                    <div className="order_details_single">
                        <h2 className='d-md-flex justify-content-between mb-4'>
                            <div className='d-flex
                     
                     '>
                                <div className='back_btn'><Link to="#" onClick={() => navigate(-1)} className='global_btn me-3'><i class="fa-solid fa-arrow-left-long"></i></Link></div>
                                <div > <span> Order Id :</span>#{order_id} </div>
                            </div>
                            <div className='date_order'>Date : {timeAgo(orderDetails?.createdAt)}</div>
                        </h2>
                        <div className="main_order_deatils">
                            <div className="order_details_inner gloab_card">
                                <Row>
                                    <Col md={4} className='mb-3'>
                                        <h3>Shipping Address</h3>
                                        <ul className="p-0 m-0">
                                            <li> {orderDetails?.shippingAddress?.firstName + " " + orderDetails?.shippingAddress?.lastName}</li>
                                            <li> {orderDetails?.shippingAddress?.contactPhone}</li>
                                            <li>{orderDetails?.shippingAddress?.email}</li>
                                            <li>{orderDetails?.shippingAddress?.state}</li>
                                            <li> {orderDetails?.shippingAddress?.city}</li>
                                            <li> {orderDetails?.shippingAddress?.postalCode}</li>
                                            <li> {orderDetails?.shippingAddress?.addressLine1} - {orderDetails?.shippingAddress?.addressLine2}</li>
                                        </ul>
                                    </Col>

                                    <Col md={4} className='mb-3'>
                                        <h3>Billing Address</h3>
                                        <ul className="p-0 m-0">
                                            <li> {orderDetails?.billingAddress?.firstName + " " + orderDetails?.billingAddress?.lastName}</li>
                                            <li> {orderDetails?.billingAddress?.contactPhone}</li>
                                            <li>{orderDetails?.billingAddress?.email}</li>
                                            <li>{orderDetails?.billingAddress?.state}</li>
                                            <li> {orderDetails?.billingAddress?.city}</li>
                                            <li> {orderDetails?.billingAddress?.postalCode}</li>
                                            <li> {orderDetails?.billingAddress?.addressLine1} - {orderDetails?.billingAddress?.addressLine2}</li>
                                        </ul>
                                    </Col>



                                    <Col md={4} className='mb-3'>
                                        <h3>Order Summary</h3>

                                        <ul className="p-0 m-0">
                                            <li>
                                                <p> Order Status</p>
                                                <p>{orderDetails?.status}</p>
                                            </li>
                                            <li>
                                                <p>Quantity</p>
                                                <p>{orderDetails?.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0}</p>
                                            </li>

                                            <li>
                                                <p> Shipping:</p>
                                                <p>+ ${orderDetails?.shippingCharge}</p>
                                            </li>
                                            <li>
                                                <p> Discount:</p>
                                                <p> {orderDetails?.couponAmount ? `- ${orderDetails?.couponAmount}` : "---"}</p>
                                            </li>
                                            <li>
                                                <p> Total:</p>
                                                <p>${orderDetails?.totalPrice}</p>
                                            </li>
                                        </ul>

                                        <h3 className='mt-4'>Payment Method</h3>
                                        <ul className="p-0 m-0">
                                            <li>{orderDetails?.paymentGateway}</li>
                                        </ul>
                                    </Col>



                                </Row>

                            </div>


                            <div className="order_all_details_uter">
                                <Row className="align-items-center">
                                    <p className="order_status">Order Arriving Soon</p>
                                    {
                                        orderDetails?.orderItems?.map((row, index) => (
                                            <Col md={6}>
                                                <div className="order_all_details mt-2">
                                                    <div className="order_img">
                                                        <img src={imgBaseURL() + row.productId?.thumbnail} alt="product-image" />
                                                    </div>
                                                    <div className="order_text_details">
                                                        <h2>{row.productId?.title}</h2>
                                                        <div className="frame_details">
                                                            <ul className="p-0 m-0">
                                                                <li>
                                                                    <span>Size :</span> {row?.size}
                                                                </li>
                                                                <li>
                                                                    <span>Finish :</span> {row?.quality}
                                                                </li>
                                                                {
                                                                    row?.frameType &&
                                                                    <li>
                                                                        <span>Color : </span> {row?.frameType}
                                                                    </li>
                                                                }
                                                                {
                                                                    row?.assembly &&
                                                                    <li>
                                                                        <span>Assembly : </span> {row?.assembly}
                                                                    </li>
                                                                }
                                                            </ul>
                                                        </div>
                                                        <h3 style={{fontSize: "16px"}} className="mt-2">Qnt : {row?.quantity}</h3>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))
                                    }


                                </Row>
                            </div>

                        </div>
                        <div className='mt-2 text-end'>
                            <Link to={`mailto:${adminDetails}?subject=Order Support Request&body=Hello Support, I am experiencing an issue with my order ID: ${order_id}.`}><i class="fa-solid fa-headset me-2"></i><b>Need Help?</b></Link>
                        </div>
                    </div>
            }
        </>
    )
}

export default OrderDetails