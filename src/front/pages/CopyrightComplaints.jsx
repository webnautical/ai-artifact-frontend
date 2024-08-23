import React from "react";
import { Container } from "react-bootstrap";
import ContactForm from "../../components/ContactForm";
import HTMLContent from "../../components/HTMLContent";

const CopyrightComplaints = ({ pageData }) => {
  return (
    <>
      <section className="content-page-static">
        <Container>
          <h1 className="static-title">{pageData?.mainTitle}</h1>
          <HTMLContent data={pageData?.editorContent1} />
          <div className="copyright-complai-box mt-4">
            <h2>{pageData?.subTitle}</h2>
            <HTMLContent data={pageData?.editorContent2} />
          </div>
        </Container>
      </section>
      <ContactForm></ContactForm>
    </>
  );
};

export default CopyrightComplaints;
