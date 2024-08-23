import React from "react";
import { Container } from "react-bootstrap";
import ContactForm from "../../components/ContactForm";
import HTMLContent from "../../components/HTMLContent";

const Shipping = ({pageData}) => {
  return (
    <>
      <section className="content-page-static">
        <Container>
          <h1 className="static-title">{pageData?.mainTitle}</h1>
          <HTMLContent data={pageData?.editorContent1} />
        </Container>
      </section>
      <ContactForm></ContactForm>
    </>
  );
};

export default Shipping;
