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
          <Row >
            <Col md={6} className='order-md-1 order-2'>
              <h1 className="static-title">{pageData?.mainTitle}</h1>
              <HTMLContent data={pageData?.editorContent1} />
            </Col>
            <Col md={6} className='order-md-2 order-1'>
            <div className='slide_about_image'>
            <img className="w-100" src={imgBaseURL() + pageData?.image1} alt='img' />
            </div>
            </Col>

            </Row>
            <div className="copyright-complai-box mt-4">
              <h2>{pageData?.subTitle}</h2>
              <HTMLContent data={pageData?.editorContent2} />
              <HTMLContent data={pageData?.editorContent3} />

            </div>
        
        </Container>
      </div>
      <ContactForm />
    </>
  )
}

export default AboutUs
