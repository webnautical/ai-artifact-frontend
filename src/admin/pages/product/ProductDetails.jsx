import { Paper } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { tableImg, timeAgo } from '../../../helper/Utility';
import { APICALL } from '../../../helper/api/api';
import AdminLoader from '../../components/AdminLoader';

const ProductDetails = () => {
    const {id} = useParams()
    const [productDetails, setProductDetails] = useState({})
    const [loader, setLoader] = useState(false)
    const getProductDetailsFun = async () => {
        setLoader(true);
        try {
          const res = await APICALL('user/getProduct', 'post', { product_id: id })
          if (res?.status) {
            setProductDetails(res?.data)
          } else {
            setProductDetails(null)
          }
        } catch (error) {
          console.log(error)
          setProductDetails(null)
        } finally {
            setLoader(false);
        }
      }
      useEffect(() =>{
        getProductDetailsFun()
      },[])
    return (
        <>
            <Paper className="table_samepattern p-3">
            {loader ? (
                    <AdminLoader/>
                ) : (
                <div className="row-details">
                    <div className="d-flex" style={{ gap: '10px' }}>
                        <Link className="artist-btn" to={'/admin/products'}>
                            <i class="fa-solid fa-arrow-left"></i>
                        </Link>
                        <h2 className="title-admins-table m-0">Artwork Details</h2>
                    </div>
                    <Row className=" justify-content-center">
                        <Col md={7}>
                            <Row className="art_details_box">

                                <Col md={4}>

                                    <div className="art_work_image">

                                        {tableImg(productDetails?.image)}
                                    </div>

                                </Col>
                                <Col md={8}>
                                    <div>
                                        <p>
                                            <strong>Name:</strong> {productDetails.title}
                                        </p>
                                        <p>
                                            <strong>Category:</strong> {productDetails?.category?.name}
                                        </p>
                                        <p>
                                            <strong>Sub Category:</strong> {productDetails?.subcategory?.name}
                                        </p>
                                        <p>
                                            <strong>Description:</strong> {productDetails.description}
                                        </p>
                                        <p>
                                            <strong>Artist Name:</strong>{" "}
                                            {productDetails?.artist_id?.first_name +
                                                " " +
                                                productDetails?.artist_id?.last_name}
                                        </p>
                                        <p>
                                            <strong>Status:</strong> {productDetails.status ? "Active" : "Inactive"}
                                        </p>
                                        <p>
                                            <strong>Date:</strong> {timeAgo(productDetails.createdAt)}
                                        </p>
                                    </div>
                                </Col>

                            </Row>
                        </Col>
                    </Row>

                </div>
                   )}
            </Paper>
        </>
    )
}

export default ProductDetails