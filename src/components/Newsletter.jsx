import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Newsletter = () => {
  return (
    <section className="neweletter_main">
      <Container>
     <div className="neweletter">
     <Row>
            <Col md={6}>
          <h3>  Sign up and <br /> never miss a deal</h3>
          <p>Join our newsletter for the latest<br /> discounts and AiArtifact goodies</p>
          <div className="email_subs_box">
            <input type="text" placeholder="Enter Your Email"/>
            <button className="global_btn">Subscribe</button>
          </div>
            </Col>
           
        </Row>
     </div>
      </Container>
    </section>
  );
};

export default Newsletter;
