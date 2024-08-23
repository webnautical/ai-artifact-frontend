import React from "react";
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

const ViewAdmin = ({ setPageType, updData,setUpdate }) => {
  return (
    <Card className="card-cusotom ">
      <CardHeader>Admin</CardHeader>
      <CardBody>
        <div className="cutoms-login-artist">
          <Row className="mb-md-3 mb-2">
            <Col md={12} className="mb-2">
              <h2>Personal Info</h2>
            </Col>
            <Col lg={3} sm={4}>
              <div className="view-admin-detials">
                <h5>First Name</h5>
                <p>{updData?.first_name}</p>
              </div>
            </Col>
            <Col lg={3} sm={4}>
              <div className="view-admin-detials">
                <h5>Last Name</h5>
                <p>{updData?.last_name}</p>
              </div>
            </Col>
            <Col lg={3} sm={4}>
              <div className="view-admin-detials">
                <h5>Email</h5>
                <p>{updData?.email}</p>
              </div>
            </Col>
            
          </Row>
          <Row className="mb-md-3 mb-2">
            <Col md={12} className="mb-2">
              <h2>Contact Info</h2>
            </Col>
            <Col lg={3} sm={4}>
              <div className="view-admin-detials">
                <h5>Phone Number</h5>
                <p>{updData?.phone}</p>
              </div>
            </Col>
          </Row>
          <Row className="mb-md-3 mb-2">
            <Col md={12} className="mb-2">
              <h2>Admin Info</h2>
            </Col>
            <Col lg={3} sm={4}>
              <div className="view-admin-detials">
                <h5>Current Status</h5>
                <p>{updData?.status}</p>
              </div>
            </Col>
            <Col lg={3} sm={4}>
              <div className="view-admin-detials">
                <h5>Role</h5>
                <p>{updData?.user_role}</p>
              </div>
            </Col>
           
          </Row>
         
        </div>
      </CardBody>
      <CardFooter>
        <Button className="artist-btn" onClick={() => {setUpdate(null); setPageType(false)}}>Back</Button>
        <Button className="artist-btn" onClick={() => {setPageType('edit')}}>Edit</Button>
      </CardFooter>
    </Card>
  );
};

export default ViewAdmin;
