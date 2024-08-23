import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import blogdetails from '../../assets/images/blog-details.png' 
import { imgBaseURL } from "../../helper/Utility";
import HTMLContent from "../../components/HTMLContent";

const BlogDetails = () => {
  const locationData = useLocation()
  const blogDetails = locationData?.state ? locationData?.state?.data : null
  console.log("blogDetails",blogDetails)
  return (
    <>
      <div className="blog_details">
        <Container>
          <Row className="justify-content-center">
            {/* <Col md={4}>
              <div className="table_cnt">
                <h3>Table of Contents</h3>

                <ol className="">
                  <li>
                    <Link to="">Engagement</Link>
                  </li>
                  <li>
                    <Link to="">What is WhatsApp Automation?</Link>
                  </li>
                  <li>
                    <Link to="">How to Implement WhatsApp Automation</Link>
                  </li>
                  <li>
                    <Link to="">Conclusion</Link>
                  </li>
                </ol>
              </div>
            </Col> */}

            <Col md={8}>
            <div className="blog_cnt">
                <h1>{blogDetails?.title}</h1>
                <img className="w-100" src={imgBaseURL() + blogDetails?.image} alt=""/>
                <HTMLContent data={blogDetails?.content} /> 
            </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default BlogDetails;
