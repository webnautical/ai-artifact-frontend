import React from 'react'
import { Container, Row } from 'react-bootstrap'
import HTMLContent from '../../../../components/HTMLContent'

const MountingInstructions = ({ pageData }) => {
  return (
    <>
      <div className='contact_us_page_static'>
        <Container>
          <Row>
            <h1 className="static-title">{pageData?.mainTitle}</h1>
            <HTMLContent data={pageData?.editorContent1} />
          </Row>
        </Container>
      </div>
    </>
  )
}

export default MountingInstructions
