import React, { useEffect, useState } from "react";
import {
  Row,
  Button,
  CardHeader,
  CardFooter,
  Card,
  CardBody,
  Col,
  Form,
} from "react-bootstrap";
import { APICALL, axiosInstance } from "../../helper/api/api";
import BTNLoader from "../../components/BTNLoader";
import AdminLoader from "../components/AdminLoader";
import swal from "sweetalert";
const StaticPages = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    adminEmail: "",
    location: "",
    phone: "",
    comission: "",
  });

  useEffect(() => {
    getPageContentFun();
  }, []);

  console.log("formData", formData);

  const getPageContentFun = async () => {
    setLoading(true);
    try {
      const res = await APICALL("user/getgeneralSettings", "post", {});
      console.log(res, "response");
      if (res?.status) {
        setFormData(res?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const res = await axiosInstance.post(
        "/admin/updategeneralSettings",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSubmitLoading(false);
      if (res?.status) {
        getPageContentFun();
        swal({
          title: "General Settings Updated Successfully !!",
          icon: "success",
          button: { text: "OK", className: "swal_btn_ok" },
        });
      } else {
        swal({
          title: "Something Went Wrong !!",
          icon: "error",
          button: { text: "OK", className: "swal_btn_ok" },
        });
      }
    } catch (error) {
      console.log(error);
      setSubmitLoading(false);
      swal({
        title: "Something Went Wrong !!",
        icon: "error",
        button: { text: "OK", className: "swal_btn_ok" },
      });
    }
  };

  return (
    <Card className="card-cusotom ">
      {loading ? (
        <AdminLoader />
      ) : (
        <>
          <CardHeader>General Settings</CardHeader>
          <CardBody>
            <div className="cutoms-login-artist">
              <Row className="mb-md-3 mb-2">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Admin Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Comission (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="comission"
                      value={formData.comission}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </CardBody>
          <CardFooter>
            {submitLoading ? (
              <BTNLoader className={"artist-btn"} />
            ) : (
              <Button
                className="artist-btn"
                type="button"
                onClick={() => handleSubmit()}
              >
                Save
              </Button>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default StaticPages;
