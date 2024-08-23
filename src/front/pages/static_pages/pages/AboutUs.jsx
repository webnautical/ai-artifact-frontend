import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import HTMLContent from '../../../../components/HTMLContent'
import { imgBaseURL } from '../../../../helper/Utility'
import ContactForm from '../../../../components/ContactForm'
const AboutUs = ({ pageData }) => {
  return (
    <>

      <div className='contact_us_page_static'>
        <Container>
          <Row className='align-items-center'>
            <Col md={6}>
              <h1 className="static-title">{pageData?.mainTitle}</h1>
              <HTMLContent data={pageData?.editorContent1} />
            </Col>
            <Col md={6}>
              <img className="w-100" src={imgBaseURL() + pageData?.image1} alt='img' /></Col>
            <div className="copyright-complai-box mt-4">
              <h2>{pageData?.subTitle}</h2>
              <HTMLContent data={pageData?.editorContent2} />
              <HTMLContent data={pageData?.editorContent3} />

            </div>
          </Row>
        </Container>
      </div>
      <ContactForm />
    </>
  )
}

export default AboutUs
