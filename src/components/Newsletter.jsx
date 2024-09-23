import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { APICALL } from "../helper/api/api";

const Newsletter = () => {
  const [msg, setMsg] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const handleSubmit = async () => {
    if (email.trim() === "") {
      setMsg(<span className="succes_email_error text-danger"><i class="fa-solid fa-triangle-exclamation me-2"></i>Email is required</span>);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMsg(<span className="succes_email_error text-danger"><i class="fa-solid fa-triangle-exclamation me-2"></i>Please enter a valid email address</span>);
      return false;
    }
    setMsg("");
    setLoading(true)
    try {
      const res = await APICALL('user/createSubscribe', 'post', { email })
      if (res?.status) {
        setMsg(<span className="succes_email text-success"><i class="fa-solid fa-circle-check me-2"></i>{res?.message}</span>)
        setEmail('')
      }
    } catch (error) {
      setMsg(<span className="text-danger">{error?.response?.message || "SERVER ERROR"}</span>)
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="neweletter_main">
      <Container>
        <div className="neweletter">
          <Row>
            <Col md={6}>
              <h3>  Sign up and <br /> never miss a deal</h3>
              <p>Join our newsletter for the latest<br /> discounts and AiArtifact goodies</p>
              <div className="email_subs_box">
                <input type="text" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {
                  loading ?
                    <button className="global_btn">Loading...</button>
                    :
                    <button className="global_btn" onClick={() => handleSubmit()}>Subscribe</button>
                }
              </div>
              <div>
                {msg}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;
