import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { APICALL } from "../helper/api/api";
import swal from "sweetalert";
import BTNLoader from "./BTNLoader";
import HTMLContent from "./HTMLContent";
import { useFrontDataContext } from "../helper/context/FrontContextProvider";
import { Link } from "react-router-dom";

function ContactForm() {
  const [submitLoading, setSubmitLoading] = useState(false);
  const { getGeneralSettingFun, generalSetting } = useFrontDataContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    query: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    query: "",
  });

  useEffect(() => {
    getPageContentFun();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email address is invalid";
        }
        break;
      case "query":
        if (!value.trim()) {
          error = "Message is required";
        } else if (value.length < 20) {
          error = "Message must be at least 20 characters";
        }
        break;
      default:
        break;
    }
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const validateForm = () => {
    const formErrors = {};
    Object.keys(form).forEach((key) => {
      let error = "";
      switch (key) {
        case "name":
          if (!form[key].trim()) {
            error = "Name is required";
          }
          break;
        case "email":
          if (!form[key].trim()) {
            error = "Email is required";
          } else if (!/\S+@\S+\.\S+/.test(form[key])) {
            error = "Email address is invalid";
          }
          break;
        case "query":
          if (!form[key].trim()) {
            error = "Message is required";
          } else if (form[key].length < 20) {
            error = "Message must be at least 20 characters";
          }
          break;
        default:
          break;
      }
      if (error) {
        formErrors[key] = error;
      }
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    if (validateForm()) {
      const res = await APICALL("/user/contactQuery", "post", form);
      if (res?.status) {
        setSubmitLoading(false);
        swal({
          title: "Your Query Submitted Successfully !!",
          icon: "success",
          button: { text: "OK", className: "swal_btn_ok" },
        });
        setForm({ name: "", email: "", query: "" });
      } else {
        setSubmitLoading(false);
        swal({
          title: "Something Went Wrong !!",
          icon: "error",
          button: { text: "OK", className: "swal_btn_ok" },
        });
      }
    } else {
      setSubmitLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);
  const getPageContentFun = async () => {
    setLoading(true);
    try {
      const res = await APICALL("user/getPageByRoute", "post", {
        route: "contact-us",
      });
      if (res?.status) {
        setPageData(res?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Container className="mb-md-3 mb-2">
      <div className="contact-us-section">
        <Row className="justify-content-center align-items-center">
          <Col md={6} className="text-left mb-md-0 mb-4">
            <h3>{pageData?.mainTitle}</h3>
            <HTMLContent data={pageData?.editorContent1} />
            <div>
              <i class="fa-solid fa-envelope me-2 me-3"></i>For Other Query<br/>
              <b>
              <Link to={`mailto:${generalSetting?.adminEmail}`}>
  {generalSetting?.adminEmail}
</Link>
              </b>
            </div>
          </Col>
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Enter your Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="formQuery" className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Enter your message."
                      name="query"
                      value={form.query}
                      onChange={handleChange}
                      isInvalid={!!errors.query}
                      maxLength={150}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.query}
                    </Form.Control.Feedback>
                    <div className="text-end mt-2">
                      <span>Charecter {form.query?.length}/150</span>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={12} className="text-md-end text-center">
                  {submitLoading ? (
                    <BTNLoader className={"global_btn"} />
                  ) : (
                    <Button className="global_btn" type="submit">
                      Send Message
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default ContactForm;
