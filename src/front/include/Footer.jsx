import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import partner from "../../assets/images/partner.png";
import payment from "../../assets/images/payment.png";
import iconprmises from "../../assets/images/ship.png";
import iconprmisestwo from "../../assets/images/moneyback.png";
import iconprmisesthree from "../../assets/images/money.png";
import iconprfour from "../../assets/images/discount.png";
import marvel from '../../assets/images/marvel.png'
import dc from '../../assets/images/dc.png'
import starwars from '../../assets/images/starwars.png'
import destiny from '../../assets/images/destiny.png'
import Cyberpunk from '../../assets/images/cyberpunk.png'
import eldunring from '../../assets/images/eldenring.png'
import harrypotter from '../../assets/images/harrypotter.png'
import strangerthing from '../../assets/images/harrypotter.png'





import { Link } from "react-router-dom";
// import { Link } from 'react-router-dom'
import { useLocation } from "react-router-dom";
const Footer = () => {
  const location = useLocation().pathname;
  return (
    <div>
      {(location !== "/favorite" || location !== "/favorite") && (
        <div className="promisses">
          <Container>
            <Row>
              <Col md={6} lg={6} xl={3} mb-4>
                <div className="promisses_box">
                  <div className="icon">
                    <img src={iconprmises} alt="icon" />
                  </div>
                  <div>
                    <h5 className="m-0">Free Shipping & Returns</h5>
                    <p className="m-0">Available as quick or express</p>
                  </div>
                </div>
              </Col>

              <Col md={6} lg={6} xl={3} mb-4>
                <div className="promisses_box">
                  <div className="icon">
                    <img src={iconprmisestwo} alt="icon" />
                  </div>
                  <div>
                    <h5 className="m-0">Money Back Guarantee</h5>
                    <p className="m-0">Best quality is a must at organic</p>
                  </div>
                </div>
              </Col>

              <Col md={6} lg={6} xl={3} mb-4>
                <div className="promisses_box">
                  <div className="icon">
                    <img src={iconprmisesthree} alt="icon" />
                  </div>
                  <div>
                    <h5 className="m-0">Secure Payment</h5>
                    <p className="m-0">100% Secure payment systems</p>
                  </div>
                </div>
              </Col>

              <Col md={6} lg={6} xl={3} mb-4>
                <div className="promisses_box">
                  <div className="icon">
                    <img src={iconprfour} alt="icon" />
                  </div>
                  <div>
                    <h5 className="m-0">Big Discount</h5>
                    <p className="m-0">The timeframe is usually stated</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      <footer>
        <Container>
          <Row>
            <Col md={3}>
              <div className="footetr_links">
                <h6>Support</h6>

                <ul className="p-0">
                  <li>
                    <Link>Check Order Status</Link>
                  </li>
                  <li>
                    <Link to={'/shipping'}>Shippng & Returns</Link>
                  </li>
                  <li>
                    <Link to={'/faq'}>HelpFAQ</Link>
                  </li>
                  <li>
                    <Link to={'/terms-of-use'}>Terms of Use</Link>
                  </li>
                  <li>
                    <Link to={'/mounting-instructions'}>Mounting instructions</Link>
                  </li>
                  <li>
                    <Link to={'/contact-us'}>Contact us</Link>
                  </li>
                  <li>
                    <Link to={'/copyright-complaints'}>Copyrights</Link>
                  </li>
                  <li>
                    <Link to={'#'}>Privacy Policy</Link>
                  </li>
                </ul>
              </div>
            </Col>

            <Col md={3}>
              <div className="footetr_links">
                <h6>About</h6>

                <ul className="p-0">
                  <li>
                    <Link to="/what-is-aiartifact">What's a AiArtifact?</Link>
                  </li>
                  <li>
                    <Link  to="/aiartifact-club">AiArtifact Club</Link>
                  </li>
                  <li>
                    <Link to="/about-us">About us</Link>
                  </li>
                  <li>
                    <Link to='/blog'>Blog</Link>
                  </li>
                </ul>
              </div>
            </Col>

            <Col md={3}>
              <div className="footetr_links">
                <h6>Earn with AiArtifact</h6>

                <ul className="p-0">
                  <li>
                    <Link to="/signup/artist">Become an Artist</Link>
                  </li>
                  <li>
                    <Link to="/signup/affiliate">Become an Affiliate</Link>
                  </li>
                </ul>
              </div>
            </Col>

            <Col md={3}>
              <div className="footetr_links">
                <h6>Partners</h6>
                <div className="partnerimg mb-4">
                <ul className="p-0">
                  <li>
                    <Link to="">
                    <img src={marvel} alt="ivon"/></Link>
                  </li>
                  <li>
                    <Link to=""> <img src={strangerthing} alt="ivon"/></Link>
                  </li>
                  <li>
                    <Link to=""> <img src={harrypotter} alt="ivon"/></Link>
                  </li>
                  <li>
                    <Link to=""> <img src={eldunring} alt="ivon"/></Link>
                  </li>

                  <li>
                    <Link to=""> <img src={dc} alt="ivon"/></Link>
                  </li>

                  <li>
                    <Link to=""> <img src={starwars} alt="ivon"/></Link>
                  </li>

                  <li>
                    <Link to=""> <img src={destiny} alt="ivon"/></Link>
                  </li>
                </ul>
                </div>

                <h6>Secure payment</h6>
                <div className="partnerimg">
                  {" "}
                  <img className="w-100" src={payment} alt="partners-img" />
                </div>
              </div>
            </Col>
          </Row>
          <hr></hr>

          <div className="copy_right text-center m-0">Copyright All right reserved. </div>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
