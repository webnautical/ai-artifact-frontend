import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import payment from "../../assets/images/payment.webp";
import iconprmises from "../../assets/images/ship.png";
import iconprmisestwo from "../../assets/images/premium.webp";
import iconprmisesthree from "../../assets/images/money.png";
import iconprfour from "../../assets/images/robot.webp";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Footer = () => {
  const location = useLocation().pathname;
  const currentYear = new Date().getFullYear();
  return (
    <div>
      {(location !== "/favorite" || location !== "/favorite") && (
        <div className="promisses">
          <Container>
            <Row>
              <Col md={6} lg={6} xl={3} mb-4>
                <div className="promisses_box">
                  <div className="icon">
                    <img
                      src={iconprmises}
                      alt="shipping-policy"
                      width="54px"
                      height="54px"
                      loading="lazy" // This defers the image load until it's near the viewport
                    />
                  </div>
                  <div>
                    <h3 className="m-0">Quick and reliable shipping</h3>
                    <p className="m-0">Worldwide production hubs</p>
                  </div>
                </div>
              </Col>

              <Col md={6} lg={6} xl={3} mb-4>
                <div className="promisses_box">
                  <div className="icon">
                    <img
                      src={iconprmisestwo}
                      alt="quality"
                      width="64px"
                      height="64px"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="m-0">High-Quality Prints</h3>
                    <p className="m-0">Printed on Premium Materials</p>
                  </div>
                </div>
              </Col>

              <Col md={6} lg={6} xl={3} mb-4>
                <div className="promisses_box">
                  <div className="icon">
                    <img
                      src={iconprmisesthree}
                      alt="secure-payment"
                      width="54px"
                      height="54px"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="m-0">Secure Payment</h3>
                    <p className="m-0">100% Secure With Stripe</p>
                  </div>
                </div>
              </Col>

              <Col md={6} lg={6} xl={3} mb-4>
                <div className="promisses_box">
                  <div className="icon">
                    <img
                      src={iconprfour}
                      alt="ai-platform"
                      width="64px"
                      height="64px"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="m-0">Ai-Friendly Platform</h3>
                    <p className="m-0">Support a new era of creativity</p>
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
                <h3>Support</h3>

                <ul className="p-0">
                  <li>
                    <Link to={"/shipping"}>Shipping & Returns</Link>
                  </li>
                  <li>
                    <Link to={"/faq"}>Help / FAQ</Link>
                  </li>
                  <li>
                    <Link to={"/terms-of-use"}>Terms of Use</Link>
                  </li>
                  {/* <li>
                    <Link to={'/mounting-instructions'}>Mounting instructions</Link>
                  </li> */}
                  <li>
                    <Link to={"/contact-us"}>Contact us</Link>
                  </li>
                  <li>
                    <Link to={"/copyright-complaints"}>Copyrights</Link>
                  </li>
                  <li>
                    <Link to={"/privacy-policy"}>Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to={"/content-guidelines"}>Content Guidelines</Link>
                  </li>
                </ul>
              </div>
            </Col>

            <Col md={3}>
              <div className="footetr_links">
                <h3>About</h3>

                <ul className="p-0">
                  <li>
                    <Link to="/what-is-aiartifact">What's a AiArtifact?</Link>
                  </li>
                  {/* <li>
                    <Link  to="/aiartifact-club">AiArtifact Club</Link>
                  </li> */}
                  <li>
                    <Link to="/about-us">About us</Link>
                  </li>
                  <li>
                    <Link to="/blog">Blog</Link>
                  </li>
                </ul>
              </div>
            </Col>

            <Col md={3}>
              <div className="footetr_links">
                <h3>Earn with AiArtifact</h3>

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
                <h3>Secure payment</h3>
                <div className="partnerimg">
                  {" "}
                  <img
                    className="w-100"
                    src={payment}
                    alt="partners-img"
                    width="100%"
                    height="100%"
                    loading="lazy"
                  />
                </div>
              </div>
            </Col>
          </Row>
          <hr></hr>

          <div className="copy_right text-center m-0">
            Copyright © {currentYear} <b>AIARTIFACT</b>. All rights reserved. Designed
            and developed by{" "}
            <Link className="web_nautical" to="https://www.webnautical.com/">
              {" "}
              <b>Web Nautical</b>
            </Link>
            .{" "}
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
