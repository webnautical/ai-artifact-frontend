import React from "react";
import { Container, } from "react-bootstrap";
import HTMLContent from "../../../../components/HTMLContent";
const PlainTextPage = ({ pageData }) => {
  return (
    <>
      <section className="content-page-static">
        <Container>
          <h1 className="static-title">{pageData?.mainTitle}</h1>
          <HTMLContent data={pageData?.editorContent1} />
        </Container>
      </section>
    </>
  );
};

export default PlainTextPage;
