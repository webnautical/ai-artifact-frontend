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
      </section>
      <ContactForm />
    </>
  );
};

export default ContactUs;
