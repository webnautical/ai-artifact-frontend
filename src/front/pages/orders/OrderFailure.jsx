import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import failimg from '../../../assets/images/faild.png'

const OrderFailure = () => {
  return (
    <>
    <div className='order_faild_page'>
      <Container>
        <Row className='justify-content-center'>
          <Col md={5} className='text-center'>
          <div className='fail_inner_box'>
            <img className='' src={failimg} alt='order-fail-image'/>
            <h1>Your Purchase Failed</h1>
            <p>There was an issue processing your payment. We're sorry, but your transaction could not be completed.</p>
          </div>
          </Col>
        </Row>
      </Container>
    </div>
    </>
  )
}

export default OrderFailure