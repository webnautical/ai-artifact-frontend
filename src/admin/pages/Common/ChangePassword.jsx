import { Paper } from "@mui/material";
import { Col, Row, Form, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { APICALL } from "../../../helper/api/api";
import TextMessage from "../../../components/TextMessage";
import { auth } from "../../../helper/Utility";
 
const ChangePassword = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [resMsg, setResMsg] = useState(false);
  const [value, setValue] = useState({
    email: auth("admin")?.email,
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
 
  const [errors, setErrors] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
 
  const validate = (name, fieldValue) => {
    let error = "";
 
    if (name === "current_password" && fieldValue.trim() === "") {
      error = "Current password is required";
    }
 
    if (name === "new_password" && fieldValue.trim() === "") {
      error = "New password is required";
    }
 
    if (name === "confirm_password") {
      if (fieldValue.trim() === "") {
        error = "Confirm password is required";
      } else if (fieldValue !== value.new_password) {
        error = "Passwords do not match";
      }
    }
 
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
 
  const handleChange = (e) => {
    const { name, value: fieldValue } = e.target;
    setValue((prevValue) => ({
      ...prevValue,
      [name]: fieldValue,
    }));
 
    validate(name, fieldValue);
  };
 
  const isFormFilled = () => {
    for (const key in value) {
      if (value[key] === "") {
        return false;
      }
    }
    return !errors.current_password && !errors.new_password && !errors.confirm_password;
  };
 
  const updateUserDetails = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    if (!isFormFilled()) {
      setSubmitLoading(false);
      return;
    }
 
    try {
      const res = await APICALL("/admin/updateAdminDetails", "post", value);
      if (res?.status) {
        setResMsg(true);
      }
      setSubmitLoading(false);
    } catch (error) {
      console.error(error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        "current_password": error?.response?.data?.message,
      }));
      setSubmitLoading(false);
    }
  };
 
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
 
  const toggleShowPassword = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
 
  return (
    <>
      <Paper className="table_samepattern">
        <div className="p-4">
          <Form onSubmit={updateUserDetails}>
            <div className="cutoms-login-artist">
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3" controlId="formCurrentPassword">
                    <Form.Label>Current Password*</Form.Label>
                    <div className="pass_main">
                      <Form.Control
                        type={showPassword.current ? "text" : "password"}
                        placeholder="Enter current password"
                        name="current_password"
                        value={value?.current_password}
                        onChange={handleChange}
                      />
                      <div className="eye_btn_show_hide"> <i className={`fa ${showPassword.current ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => toggleShowPassword('current')} /></div>
                    </div>
                    <span className="error">{errors.current_password}</span>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3" controlId="formNewPassword">
                    <Form.Label>New Password*</Form.Label>
                    <div className="pass_main">
                      <Form.Control
                        type={showPassword.new ? "text" : "password"}
                        placeholder="Enter new password"
                        name="new_password"
                        value={value?.new_password}
                        onChange={handleChange}
                      />
                      <div className="eye_btn_show_hide"> <i className={`fa ${showPassword.new ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => toggleShowPassword('new')} /></div>
                    </div>
                    <span className="error">{errors.new_password}</span>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password*</Form.Label>
                    <div className="pass_main">
                      <Form.Control
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        name="confirm_password"
                        value={value?.confirm_password}
                        onChange={handleChange}
                      />
                      <div className="eye_btn_show_hide"> <i className={`fa ${showPassword.confirm ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => toggleShowPassword('confirm')} /></div>
                    </div>
                    <span className="error">{errors.confirm_password}</span>
                  </Form.Group>
                </Col>
 
                <div className="col-12">
                  {resMsg && (
                    <TextMessage msg={"Password changed successfully!"} type={true} />
                  )}
                </div>
 
                <Col md="12" className="text-end">
                  {submitLoading ? (
                    <Button className="global_btn" type="button" block>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </Button>
                  ) : (
                    <>
                      {isFormFilled() ? (
                        <Button className="global_btn" type="submit" block>
                          Change Password
                        </Button>
                      ) : (
                        <Button className="global_btn" type="button" block disabled>
                          Change Password
                        </Button>
                      )}
                    </>
                  )}
                </Col>
              </Row>
            </div>
          </Form>
        </div>
      </Paper>
    </>
  );
};
 
export default ChangePassword;