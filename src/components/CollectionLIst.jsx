import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { defaultIMG, imgBaseURL } from "../helper/Utility";
import { Link } from "react-router-dom";

const CollectionLIst = ({ title, data }) => {
  return (
    <section className="popular_collection">
      <Container>
        <Row className="mb-4">
          <Col md={12}>
            <h4 class="left_global_heading">{title}</h4>
          </Col>
        </Row>

        <Row className="gx-md-5">

          {
            data?.map((item, i) => (
              <Col md={6} lg={3} className="mb-md-0 mb-4">
                <Link to={`/collection/${item?.artist?._id}/${item?._id}`} className="popular_box">
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
                      <h5 className="first_letter" style={{background : '#849393 !important'}}>{item?.artist?.first_name.charAt(0)}</h5>
                    </div>
                    <div className="collection_by_details">
                      <h4>{item?.directoryName}</h4>
                      <p>By {item?.artist?.first_name + " " + item?.artist?.last_name}</p>
                    </div>
                  </div>
                </Link>
              </Col>
            ))
          }

        </Row>

        <div className="text-center mt-5">
          <button class="global_btn">Sell All Collections</button>
        </div>
      </Container>
    </section>
  );
};

export default CollectionLIst;
