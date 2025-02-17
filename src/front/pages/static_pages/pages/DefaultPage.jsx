import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import HTMLContent from '../../../../components/HTMLContent'
import { imgBaseURL } from '../../../../helper/Utility'
const DefaultPage = ({ pageData }) => {
    return (
        <>
            <div className='contact_us_page_static'>
                <Container>
                    <Row >
                        {pageData?.image1 &&
                            <Col md={12} className=''>
                                <div className='slide_about_image'>
                                    <img className="w-100" src={imgBaseURL() + pageData?.image1} alt='img' />
                                </div>
                            </Col>}
                        <Col md={12} className=''>
                            <h1 className="static-title">{pageData?.mainTitle}</h1>
                            <HTMLContent data={pageData?.editorContent1} />
                        </Col>

                        {pageData?.image2 &&
                            <Col md={12} className=''>
                                <div className='slide_about_image'>
                                    <img className="w-100" src={imgBaseURL() + pageData?.image1} alt='img' />
                                </div>
                            </Col>}

                        <Col md={12} className=''>
                            <h1 className="static-title">{pageData?.subTitle}</h1>
                            <HTMLContent data={pageData?.editorContent2} />
                        </Col>

                        <Col md={12} className=''>
                            <HTMLContent data={pageData?.editorContent3} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default DefaultPage
