import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { imgBaseURL, timeAgo } from '../../../helper/Utility'

const SoldArtDetails = ({ selectedRow }) => {
    console.log("selectedRow", selectedRow)
    return (
        <Row className=" justify-content-center">
            <Col md={7}>
                <Row className="art_details_box mb-4">



                    <Col md={12}>
                        <div className='row'>
                        <div className='col-md-4 mb-3'>
                                <img className='w-100' src={imgBaseURL() + selectedRow?.productId?.thumbnail} alt="" />
                            </div>
                            <div className='col-md-12 table_border'>
                                <h6>Order Details:</h6>
                                <hr />
                                <p> <strong>Order ID:</strong> #{selectedRow.orderId?._id} </p>
                                <p> <strong>Quantity:</strong> {selectedRow?.quantity}</p>
                                <p> <strong>Price:</strong> {selectedRow?.price}</p>
                                <p><strong>Order Date:</strong> {timeAgo(selectedRow.createdAt)}</p>

                                <div className="mt-2">
                               
                                    <p> <strong>Product Title:</strong> {selectedRow?.productId?.title}</p>
                                    <p> <strong>Product Description:</strong> {selectedRow.productId?.description}</p>
                                </div>

                                {/* <div>
                                    <h5>Customer Details:</h5>
                                    <hr />
                                     <p><strong>Customer Name:</strong> {selectedRow?.userId?.first_name + " " + selectedRow?.userId?.last_name}</p>
                                    <p> <strong>Customer Email:</strong> {selectedRow?.userId?.email}</p>
                                </div> */}

                            </div>
                        
                        </div>
                        {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong><strong>Order ID:</strong> #{selectedRow.orderId?._id}</strong>
                                <hr />
                                <p><strong>Customer Name:</strong> {selectedRow?.userId?.first_name + " " + selectedRow?.userId?.last_name}</p>
                                <p> <strong>Art Name:</strong> {selectedRow?.productId?.title}</p>
                                <p> <strong>Quality:</strong> {selectedRow?.quality}</p>
                                <p> <strong>Size:</strong> {selectedRow?.size}</p>
                                <p> <strong>Frame:</strong> {selectedRow?.frame}</p>
                                <p> <strong>Quantity:</strong> {selectedRow?.quantity}</p>
                                <p> <strong>Price:</strong> {selectedRow?.price}</p>
                                <p><strong>Order Date:</strong> {timeAgo(selectedRow.createdAt)}</p>
                            </div>
                            <div>
                                <img src={imgBaseURL() + selectedRow?.productId?.thumbnail} alt="" />
                            </div>
                        </div> */}
                    </Col>


                </Row>
            </Col>
        </Row>
    )
}

export default SoldArtDetails