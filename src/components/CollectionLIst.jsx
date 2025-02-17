import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { createSlug, defaultIMG, imgBaseURL } from "../helper/Utility";
import { Link } from "react-router-dom";

const CollectionLIst = ({ title, data, btnHide }) => {
  return (
    <section className="popular_collection">
      <Container>
        <Row className="mb-4">
          <Col md={12}>
          <div className="left_global_heading">
            <h3>{title}</h3>
            </div>
          </Col>
        </Row>

        <Row className="gx-md-5">
          {
            data?.map((item, i) => (
              <Col md={6} lg={3} className="mb-md-3 mb-4">
                <Link to={`/collection/${item?.artist?.userName}/${createSlug(item?.directoryName)}`} className="popular_box">
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
                              loading="lazy" 
                            />
                          </div>
                        </Col>
                      ))
                    }
                  </Row>
                  <div className="collection_by">
                    <div className="review_person_img">
                      <div className="first_letter" style={{ background: '#849393 !important' }}>{item?.artist?.userName.charAt(0)}</div>
                    </div>
                    <div className="collection_by_details">
                      <h4>{item?.directoryName}</h4>
                      <p>By {item?.artist?.userName}</p>
                    </div>
                  </div>
                </Link>
              </Col>
            ))
          }

        </Row>
        {
          !btnHide &&
          <div className="text-center mt-5">
            <Link to={`/collections`} className="global_btn">Sell All Collections</Link>
          </div>
        }
      </Container>
    </section>
  );
};

export default CollectionLIst;
