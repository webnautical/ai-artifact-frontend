import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import trackorder from "../../../assets/images/track-order.png";
import Form from "react-bootstrap/Form";
import BTNLoader from './../../../components/BTNLoader';
import { APICALL } from "../../../helper/api/api";
const TrackOrders = () => {
  const [orderId, setOrderId] = useState("")
  const [trackingURL, setTrackingURL] = useState("")
  const [keyword, setKeyword] = useState({
    'loading': false,
    "msg": "",
    "url": ""
  })
  const handleSubmit = async (e) => {
    e.preventDefault();
    setKeyword((prevKeyword) => ({
      ...prevKeyword,
      msg: "",
    }));

    if (/[^a-zA-Z0-9]/.test(orderId)) {
      setKeyword((prevKeyword) => ({
        ...prevKeyword,
        msg: "Order ID contains invalid characters. Please use valid order ID",
      }));
      setTrackingURL("");
      return false;
    }

    if (orderId.trim() === "") {
      setKeyword((prevKeyword) => ({
        ...prevKeyword,
        msg: "Please enter your Order ID",
      }));
      setTrackingURL("");
      return false;
    }
    try {
      setKeyword({ ...keyword, 'loading': true })
      const res = await APICALL("user/trackOrder", "post", { orderId: orderId })
      if (res?.status) {
        console.log("res", res)
        setTrackingURL(res?.trackingUrl)
        setKeyword((prevKeyword) => ({
          ...prevKeyword,
          msg: "",
        }));
      } else {
        setKeyword((prevKeyword) => ({
          ...prevKeyword,
          msg: res?.message || "Unabled to track your order",
        }));
        setTrackingURL("")
      }
    } catch (error) {
      setKeyword((prevKeyword) => ({
        ...prevKeyword,
        msg: error?.response?.data?.message || "Unabled to track your order",
      }));
      setTrackingURL("")
    } finally {
      setKeyword((prevKeyword) => ({
        ...prevKeyword,
        loading: false,
      }));
    }
  }
  return (
    <>
      <section className="track_order_outer">
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <div className="track_order_box cutoms-login-artist">
                <div className="text-center mb-3">
                  <img src={trackorder} alt="icon-track" />
                  <h1>Track Your Order</h1>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
                    <Form.Control type="text" placeholder="Enter your Order id" value={orderId} onChange={(e) => setOrderId(e.target.value)} maxLength={60} />

                    <p className="mt-2 text-center text-danger">{keyword?.msg}</p>
                  </Form.Group>
                  {
                    keyword?.loading ?
                      <BTNLoader className={"global_btn w-100"} />
                      :
                      <button type="submit" className="global_btn w-100">Track Order</button>
                  }

                  <div className="mt-2 text-center">
                    <a href={trackingURL} target="_blank" style={{ color: "#008080 !important", fontWeight: "bold" }}>{trackingURL}</a>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default TrackOrders;
