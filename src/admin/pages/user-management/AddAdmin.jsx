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
import '../../../App.css'
import { APICALL } from "../../../helper/api/api";
import BTNLoader from "../../../components/BTNLoader";
import { Link } from "react-router-dom";
const AddAdmin = ({ setPageType, updData, setUpdate, getListFun }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    // password: "",
    phone: "",
    role_id: "",
    status: true,
  });

  const [userRoleList, setUserRoleList] = useState([])
  useEffect(() => {
    getRoleListFunc()
    if (updData?._id) {
      setFormData({
        ...formData,
        'first_name': updData?.first_name,
        'last_name': updData?.last_name,
        'email': updData?.email,
        // 'password' : updData?.password,
        'phone': updData?.phone,
        'role_id': updData?.role_id,
        'user_role': updData?.user_role,
        'status': updData?.status,
      })
    } else {
      setFormData({
        ...formData,
        'first_name': '',
        'last_name': '',
        'email': '',
        // 'password' : '',
        'phone': '',
        'role_id': '',
        'user_role': '',
        'status': true
      })
    }
  }, [updData])
  const getRoleListFunc = async () => {
    try {
      const res = await APICALL('admin/roles')
      if (res?.status) { setUserRoleList(res?.data) }
    } catch (error) { }
  }

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let error = "";

    switch (name) {
      case "first_name":
        if (!value.trim()) error = "First Name is required";
        break;
      case "last_name":
        if (!value.trim()) error = "Last Name is required";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
        break;
      case "password":
        if (!value.trim()) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else {
          const strongPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          if (!strongPasswordPattern.test(value)) {
            error = "Password must include at least one letter, one number, and one special character";
          }
        }
        break;
      case "phone":
        if (!value.trim()) error = "Phone Number is required";
        else if (!/^\d+$/.test(value)) error = "Phone Number is invalid";
        break;
      case "role_id":
        if (!value) error = "User Role is required";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role_id") {
      const selectedRole = userRoleList.find(item => item.roles._id === value);
      setFormData((prevData) => ({
        ...prevData,
        role_id: value,
        user_role: selectedRole ? selectedRole.roles.name : ""
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    validate(name, value);
  };

  const handleSubmit = async () => {
    let isValid = true;
    let newErrors = {};
    for (const [name, value] of Object.entries(formData)) {
      validate(name, value);
      if (errors[name]) isValid = false;
    }
    setErrors(newErrors);
    if (isValid) {
      setLoading(true)
      try {
        const res = await APICALL('admin/adminSignup', 'post', formData)
        setLoading(false)
        if (res?.status) {
          getListFun()
          setPageType(false)
        } else {
          setPageType(false)
        }
      } catch (error) {
        console.log(error)
        setPageType(false)
      }
    }
  };

  const handleCancel = () => {
    setUpdate(null)
    setPageType(false)
  }

  const [passDisbled, setPasswordDis] = useState(true)
  const [passToggle, setPassToggle] = useState(false)

  
  return (
    <Card className="card-cusotom ">
      <CardHeader>Admin</CardHeader>
      <CardBody>
        <div className="cutoms-login-artist">
          <Row className="mb-md-3 mb-2">
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label>First Name*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  isInvalid={!!errors.first_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.first_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label>Last Name*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  isInvalid={!!errors.last_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.last_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email*</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
           <div className="">
           <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password*</Form.Label>
              <div className="pass_main">
              <Form.Control
                  type={passToggle ? 'text' : "password"}
                  placeholder={(passDisbled && updData?._id) ? `*********` : "Enter Password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  disabled={updData?._id ? passDisbled : false}
                />
                   <div className="eye_btn_show_hide"> <i className={`fa ${passToggle ? 'fa-eye' : 'fa-eye-slash'}`} onClick={()=>setPassToggle(!passToggle)}/></div>
              </div>
            
                {
                  updData?._id &&
                  <p className="text-end"><Link to={'#'} onClick={() => setPasswordDis(false)}>Changes Password</Link></p>
                }
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
           </div>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formUserRole">
                <Form.Label>User Role*</Form.Label>
                <Form.Control
                  as="select"
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  isInvalid={!!errors.role_id}
                >
                  <option value="">Select Role</option>
                  {
                    userRoleList?.map((item, i) => (
                      <option value={item?.roles?._id}>{item?.roles?.name}</option>
                    ))
                  }
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.role_id}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mb-2">
              <h2>Contact Info</h2>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label>Phone Number*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                  maxLength={10}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </div>
      </CardBody>
      <CardFooter>
        <Button className="line-close-btn" onClick={() => handleCancel()}>Cancel</Button>
        {
          loading ? <BTNLoader className={"artist-btn"} /> :
            <Button className="artist-btn" type="button" onClick={() => handleSubmit()}>{updData?._id ? "Update" : "Create"}</Button>
        }
      </CardFooter>
    </Card>
  );
};

export default AddAdmin;
