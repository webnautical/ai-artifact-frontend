import React, { useEffect } from "react";
import {  Col, Container,  Row, Tab } from "react-bootstrap";
import ContactForm from "../../components/ContactForm";
import { Email, Map, Phone } from "@mui/icons-material";
import { useFrontDataContext } from "../../helper/context/FrontContextProvider";

const ContactUs = () => {
  const {getGeneralSettingFun, generalSetting  } = useFrontDataContext();
  useEffect(() =>{
    getGeneralSettingFun()
  },[])
  return (
    <>
      <section className="faq-page">
        <h2 className="static-title text-center">Contact Us</h2>
        <Container className="">
          <Row>
            <Col md={4} className="mt-5 ">
              <div className="contact_box">
                <div className="icon_boxee">
                  <Map />
                </div>
                <h2>Office Location</h2>
                <p>{generalSetting?.location}</p>
              </div>
            </Col>
            <Col md={4} className="mt-5 ">
              <div className="contact_box">
                <div className="icon_boxee">
                  <Email />
                </div>
                <h2>Email</h2>
                <p>{generalSetting?.adminEmail}</p>
              </div>
            </Col>
            <Col md={4} className="mt-5 ">
              <div className="contact_box">
                <div className="icon_boxee">
                  <Phone />
                </div>
                <h2>Phone</h2>
                <p>{generalSetting?.phone}</p>
              </div>
            </Col>
          </Row>
        </Container>

      </section>
      <ContactForm />
    </>
  );
};

export default ContactUs;
