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
import { useDataContext } from "../../helper/context/ContextProvider";
import { filterByKey } from "../../helper/Utility";
const StaticPages = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    adminEmail: "",
    location: "",
    phone: "",
    comission: "",
  });
  const { permisionData, getPermision } = useDataContext();
  const permisionCheck = filterByKey("generalSettings", permisionData?.permissions);
  useEffect(() => {
      getPermision()
  }, [])
  useEffect(() => {
    getPageContentFun();
  }, []);
 
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
      const res = await APICALL('admin/updategeneralSettings', 'post', formData)
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
 
    <>
      <div className="general-setting">
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
                      <Form.Label>Affiliate Comission (%)</Form.Label>
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
          </>
        )}
      </Card>
 
      <Card className="card-cusotom mt-3">
          <>
            <CardHeader>Social media</CardHeader>
            <CardBody>
              <div className="cutoms-login-artist">
                <Row className="mb-md-3 mb-2">
                 
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>facebook url</Form.Label>
                      <Form.Control
                        type="text"
                        name="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>instagram Url</Form.Label>
                      <Form.Control
                        type="text"
                        name="instagramUrl"
                        value={formData.instagramUrl}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>discord Url</Form.Label>
                      <Form.Control
                        type="text"
                        name="discordUrl"
                        value={formData.discordUrl}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>pinterest Url</Form.Label>
                      <Form.Control
                        type="text"
                        name="pinterestUrl"
                        value={formData.pinterestUrl}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>reddit Url</Form.Label>
                      <Form.Control
                        type="text"
                        name="redditUrl"
                        value={formData.redditUrl}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>tiktok Url</Form.Label>
                      <Form.Control
                        type="text"
                        name="tiktokUrl"
                        value={formData.tiktokUrl}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>twitter Url</Form.Label>
                      <Form.Control
                        type="text"
                        name="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </CardBody>
            {
              permisionCheck?.edit &&
            <CardFooter>
              {submitLoading ? (
                <BTNLoader className={"artist-btn"} />
              ) : (
                <Button className="artist-btn" type="button" onClick={() => handleSubmit()}> Save </Button>
              )}
            </CardFooter>
            }
          </>
      </Card>
      </div>
    </>
  );
};
 
export default StaticPages;