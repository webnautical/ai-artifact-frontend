import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import favlist from '../../assets/images/fav-list.png'
import sectumb from '../../assets/images/sec-thumb.png'
import Artworks from '../../components/Artworks'

const Favorite = () => {
  return (
    <div className='fav_page'>
      <section>
        <Container>
          <h1 class="left_global_heading_small">My Favorite</h1>
          <Row className='justify-content-between'>
            <Col md={4}>
              <div className='fav_box'>
                <div className='faourtiw_list'>
                  <img src={favlist} alt='fav-thumb' />
                  <img className='cl_list' src={sectumb} alt='fav-thumb' />
                  <img className='cl_list_two' src={sectumb} alt='fav-thumb' />
                  <img className='cl_list_three' src={sectumb} alt='fav-thumb' />
                </div>

                <div>
                  <h2>Spider Man</h2>
                  <p>3 Faourtite</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className='fav_box'>
                <div className='faourtiw_list'>
                  <img src={favlist} alt='fav-thumb' />
                  <img className='cl_list' src={sectumb} alt='fav-thumb' />
                  <img className='cl_list_two' src={sectumb} alt='fav-thumb' />
                  <img className='cl_list_three' src={sectumb} alt='fav-thumb' />
                </div>

                <div>
                  <h2>Spider Man</h2>
                  <p>3 Faourtite</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className='fav_box'>
                <div className='faourtiw_list'>
                  <img src={favlist} alt='fav-thumb' />
                  <img className='cl_list' src={sectumb} alt='fav-thumb' />
                  <img className='cl_list_two' src={sectumb} alt='fav-thumb' />
                  <img className='cl_list_three' src={sectumb} alt='fav-thumb' />
                </div>

                <div>
                  <h2>Spider Man</h2>
                  <p>3 Faourtite</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Artworks />
      <Artworks />

    </div>
  )
}

export default Favorite
