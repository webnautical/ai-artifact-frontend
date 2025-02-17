import React from 'react'
import { Container, Row } from 'react-bootstrap'
import HTMLContent from '../../../../components/HTMLContent'
const AiartifactClub = ({ pageData }) => {
  return (
    <>
      <div className='contact_us_page_static'>
        <Container>
          <Row>
            <h1 className="static-title">{pageData?.mainTitle}</h1>
            <HTMLContent data={pageData?.editorContent1} />
            <div className="copyright-complai-box mt-4">
              <h2>{pageData?.subTitle}</h2>
              <HTMLContent data={pageData?.editorContent2} />
            </div>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default AiartifactClub
