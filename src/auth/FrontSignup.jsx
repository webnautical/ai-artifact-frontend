import React, { useRef, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import loginbanner from "../../src/assets/images/loginslide.png";
import SocialIcon from "./SocialIcon";
import { APICALL } from "../helper/api/api";
import artistLogin from "../../src/admin/assets/images/artistlogin.png";
import logo from "../../src/admin/assets/images/logo.png";
import { encryptLocalStorageData } from "../helper/Utility";
import TextMessage from "./../components/TextMessage";
import { emailPattern, strongPasswordPattern } from "../helper/Constant";

const FrontSignup = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const [loading, setLoading] = useState(false);
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [passToggle, setPassToggle] = useState(false);

  const [resMsg, setResMsg] = useState(null);

  const [formData, setFormData] = useState({
    user_role: role,
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    iaccept: true,
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    iaccept: "",
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const errorMessage = validateField(name, fieldValue);
    setErrors({
      ...errors,
      [name]: errorMessage,
    });
    setFormData({
      ...formData,
      [name]: fieldValue,
    });
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    if (!value) {
      errorMessage = "Required";
    }

    if (name === "email") {
      if (value && !emailPattern.test(value)) {
        errorMessage = "Invalid email format";
      }
    }

    if (name === "password" && value) {
      if (value.length < 8) {
        errorMessage = "Password must be at least 8 characters";
      } else {
        if (!strongPasswordPattern.test(value)) {
          errorMessage =
            "Password must include at least one letter, one number, and one special character";
        }
      }
    }

    return errorMessage;
  };

  const isFormFilled = () => {
    for (const key in formData) {
      if (formData[key] === "") {
        return false;
      }
    }

    for (const key in errors) {
      if (errors[key]) {
        return false;
      }
    }

    return true;
  };

  const handleRegister = async () => {
    setLoading(true);

    try {
      const res = await APICALL("/user/registerUser", "post", formData);
      if (res?.status) {
        const dataParam = {
          token: res?.token,
          name: res?.registerUser?.first_name,
          email: res?.registerUser?.email,
          user_role: res?.registerUser?.user_role,
          id: res?.registerUser?._id,
        };
        if (role === "customer") {
          encryptLocalStorageData(
            `customer-secret`,
            dataParam,
            "DoNotTryToAccess"
          );
          navigate("/");
        } else {
          encryptLocalStorageData(
            `admin-secret`,
            dataParam,
            "DoNotTryToAccess"
          );
          navigate(`/${res?.registerUser?.user_role}/dashboard`);
          window.location.reload();
        }
        setLoading(false);
        setResMsg("Something Went Wrong !!");
      } else {
        setLoading(false);
        setResMsg("Something Went Wrong !!");
      }
    } catch (error) {
      console.log(error);
      setResMsg(error.response?.data?.message);
      setLoading(false);
    }
  };
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  const handleOtpChange = (index, value) => {
    if (value.length > 1 || isNaN(value)) {
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < otpInputs.length - 1) {
      otpInputs[index + 1].current.focus();
    }

    if (value === "" && index > 0) {
      otpInputs[index - 1].current.focus();
    }
  };

  const [msgOnVerificationPage, setMsgVerificationPage] = useState(null);

  const sendOTP = async (type) => {
    setLoading(true);
    try {
      const res = await APICALL("/user/sendOtp", "post", formData);
      if (res?.status) {
        setIsOtpSend(true);
        setLoading(false);
        setResMsg(null);
        if (type == "resent") {
          setMsgVerificationPage(
            `Your OTP has been resent. Please check your email ${formData?.email} for the new OTP`
          );
        } else {
          setMsgVerificationPage(
            `Enter the OTP code that we sent to your email ${formData?.email}, Be careful not to share the code with anyone.`
          );
        }
      } else {
        setResMsg("Something Went Wrong !!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setResMsg(error.response?.data?.message);
      setLoading(false);
    }
  };

  const verifyOTPAnd = async () => {
    const otpValue = otp.join("");
    const params = { ...formData, otp: otpValue };
    setLoading(true);
    try {
      const res = await APICALL("/user/verifyOtp", "post", params);
      if (res?.status) {
        handleRegister();
        setIsOtpSend(true);
        setResMsg(null);
      } else {
        setLoading(false);
        setResMsg("Something Went Wrong !!");
      }
    } catch (error) {
      console.log(error);
      setResMsg(error.response?.data?.message);
      setLoading(false);
    }
  };

  console.log(errors);

  return (
    <>
      {role === "artist" || role === "affiliate" ? (
        <>
          <div className="artist-login-container">
            <Container fluid>
              <Row className="align-items-center justify-content-end">
                <Col md={5} className="login-form ml-auto">
                  <img className="mx-auto logo-login" src={logo} alt="" />
                  <h1 className="login-title text-capitalize">
                    {role} Register
                  </h1>
                  {/* <p className="login-subtitle">Enter your details to register your account.</p> */}

                  <div className="cutoms-login-artist mt-3">
                    <Form>
                      <div className="steppers-outer row">
                        <div className=" col-6 ">
                          <div
                            className={`steppers-inner ${
                              !isOtpSend && "activestepss"
                            }`}
                          >
                            <p>Step 1</p>
                            <h6>Personal Data </h6>
                          </div>
                        </div>
                        <div className=" col-6">
                          <div
                            className={`steppers-inner ${
                              isOtpSend && "activestepss"
                            }`}
                          >
                            <p>Step 2</p>
                            <h6>Verification </h6>
                          </div>
                        </div>
                      </div>

                      {!isOtpSend ? (
                        <>
                          <Row>
                            <Col md={6} className="mb-2">
                              <Form.Group
                                className={`form-group ${
                                  formData.first_name.length ? "not-empty" : ""
                                }`}
                              >
                                <Form.Label
                                  htmlFor="first_name"
                                  className="animated-label"
                                >
                                  First Name
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  className="form-control"
                                  name="first_name"
                                  id="first_name"
                                  value={formData.first_name}
                                  onChange={handleChange}
                                  maxLength={16}
                                />
                              </Form.Group>
                              <span className="errmsg">
                                {errors.first_name}
                              </span>
                            </Col>
                            <Col md={6} className="mb-2">
                              <Form.Group
                                className={`form-group ${
                                  formData.last_name.length ? "not-empty" : ""
                                }`}
                              >
                                <Form.Label
                                  htmlFor="last_name"
                                  className="animated-label"
                                >
                                  Last Name
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  className="form-control"
                                  name="last_name"
                                  id="last_name"
                                  value={formData.last_name}
                                  onChange={handleChange}
                                  maxLength={16}
                                />
                              </Form.Group>
                              <span className="errmsg">{errors.last_name}</span>
                            </Col>
                          </Row>

                          <Col md={12} className="mb-2">
                            <Form.Group
                              className={`form-group ${
                                formData.email.length ? "not-empty" : ""
                              }`}
                            >
                              <Form.Label
                                htmlFor="email"
                                className="animated-label"
                              >
                                Email
                              </Form.Label>
                              <Form.Control
                                type="email"
                                className="form-control"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                maxLength={100}
                              />
                            </Form.Group>
                            <span className="errmsg">{errors.email}</span>
                          </Col>

                          <Form.Group
                            className={`artist_tagg main_tagg form-group ${
                              formData.password.length ? "not-empty" : ""
                            }`}
                          >
                            <Form.Label
                              htmlFor="password"
                              className="animated-label"
                            >
                              Password
                            </Form.Label>
                            <Form.Control
                              type={passToggle ? "text" : "password"}
                              className="form-control "
                              name="password"
                              id="password"
                              value={formData.password}
                              onChange={handleChange}
                              maxLength={16}
                            />
                            <div className="taggole_eyw">
                              {" "}
                              <i
                                className={`fa ${
                                  passToggle ? "fa-eye" : "fa-eye-slash"
                                }`}
                                onClick={() => setPassToggle(!passToggle)}
                              />
                            </div>
                          </Form.Group>

                          <span className="errmsg">{errors.password}</span>

                          <div className="text-end mb-4 mt-3">
                            {/* <Form.Group
                                  controlId="formBasicCheckbox"
                                  className="d-flex justify-content-between mb-4 mt-3 "
                                > */}
                            <Link
                              to="/forgot-password"
                              className="forgetpassword"
                            >
                              Forget password?
                            </Link>
                            {/* </Form.Group> */}
                          </div>

                          {resMsg && (
                            <div className="col-12">
                              <TextMessage msg={resMsg} type={false} />
                            </div>
                          )}

                          <div className="submit">
                            {isFormFilled() ? (
                              <>
                                {loading ? (
                                  <button
                                    class="global_btn  w-100"
                                    type="button"
                                  >
                                    <span
                                      class="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Loading...
                                  </button>
                                ) : (
                                  <button
                                    className="global_btn w-100"
                                    onClick={() => sendOTP("signin")}
                                  >
                                    Sign Up
                                  </button>
                                )}
                              </>
                            ) : (
                              <button
                                className="global_btn w-100"
                                disabled
                                style={{ cursor: "not-allowed" }}
                              >
                                Sign Up
                              </button>
                            )}
                          </div>

                          <p className="signup-link">
                            Don't have an account?
                            <Link to={`/login/${role}`}>Log In now</Link>
                          </p>
                          <p className="privacy-notice">
                            Our privacy notice includes information about how we
                            use your personal data and your rights.
                          </p>
                        </>
                      ) : (
                        <div className="cutoms-login-artist">
                          <p className="login-subtitle">
                            {" "}
                            {msgOnVerificationPage}
                          </p>
                          <Form>
                            <Form.Group
                              className="mb-3"
                              controlId="formBasicEmail"
                            >
                              <Form.Label>Verify Code</Form.Label>
                              <div className="row">
                                {otp?.map((digit, index) => (
                                  <div className="col">
                                    <Form.Control
                                      key={index}
                                      ref={otpInputs[index]}
                                      type="text"
                                      maxLength="1"
                                      value={digit}
                                      onChange={(e) =>
                                        handleOtpChange(index, e.target.value)
                                      }
                                      style={{
                                        textAlign: "center",
                                      }}
                                      className="otp-input text-center"
                                    />
                                  </div>
                                ))}
                              </div>
                            </Form.Group>
                            {resMsg && (
                              <div className="col-12">
                                <TextMessage msg={resMsg} type={false} />
                              </div>
                            )}
                            <div className="submit">
                              {isFormFilled() ? (
                                <>
                                  {loading ? (
                                    <button
                                      class="global_btn  w-100"
                                      type="button"
                                    >
                                      <span
                                        class="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      Loading...
                                    </button>
                                  ) : (
                                    <button
                                      className="global_btn w-100"
                                      onClick={() => verifyOTPAnd()}
                                    >
                                      Verify Email
                                    </button>
                                  )}
                                </>
                              ) : (
                                <button
                                  className="global_btn w-100"
                                  disabled
                                  style={{ cursor: "not-allowed" }}
                                >
                                  Verify Email
                                </button>
                              )}
                            </div>

                            <p className="signup-link">
                              Don’t received verify code?{" "}
                              <Link to="#" onClick={() => sendOTP("resent")}>
                                Resend OTP Again
                              </Link>
                            </p>
                          </Form>
                        </div>
                      )}
                    </Form>
                  </div>
                </Col>
                <Col md="1" className="d-md-block d-none"></Col>
                <Col md={5} className="login-image d-md-block d-none">
                  <img
                    src={artistLogin}
                    alt="Artist working"
                    className="img-fluid"
                  />
                </Col>
              </Row>
            </Container>
          </div>
        </>
      ) : (
        <>
          <div className="log_in_page sign_up_page">
            <Container fluid>
              <Row>
                <Col lg={6} className="p-0">
                  <div className="log_in">
                    <img
                      className="w-100"
                      src={loginbanner}
                      alt="log-in-banner"
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="outer_login">
                    <form action="#" className="custom-form">
                      <h1>Create an account</h1>
                      <p className="mb-4 mt-4">Enter your details below</p>
                      <div>
                        <Form.Group
                          className={`form-group ${
                            formData.first_name.length ? "not-empty" : ""
                          }`}
                        >
                          <Form.Control
                            type="text"
                            className="form-control"
                            name="first_name"
                            id="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            maxLength={16}
                          />
                          <Form.Label
                            htmlFor="first_name"
                            className="animated-label"
                          >
                            First Name
                          </Form.Label>
                        </Form.Group>
                        <span className="errmsg">{errors.first_name}</span>
                      </div>

                      <div>
                        <Form.Group
                          className={`form-group ${
                            formData.last_name.length ? "not-empty" : ""
                          }`}
                        >
                          <Form.Control
                            type="text"
                            className="form-control"
                            name="last_name"
                            id="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            maxLength={16}
                          />
                          <Form.Label
                            htmlFor="last_name"
                            className="animated-label"
                          >
                            Last Name
                          </Form.Label>
                        </Form.Group>
                        <span className="errmsg">{errors.last_name}</span>
                      </div>
                      <div>
                        <Form.Group
                          className={`form-group ${
                            formData.email.length ? "not-empty" : ""
                          }`}
                        >
                          <Form.Control
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            maxLength={26}
                          />
                          <Form.Label
                            htmlFor="email"
                            className="animated-label"
                          >
                            Email
                          </Form.Label>
                        </Form.Group>
                        <span className="errmsg">{errors.email}</span>
                      </div>

                      <div className="">
                        <Form.Group
                          className={` form-group ${
                            formData.password.length ? "not-empty" : ""
                          }`}
                        >
                          <Form.Control
                            type={passToggle ? "text" : "password"}
                            className="form-control"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            maxLength={30}
                          />
                          <div className="taggole_eyw">
                            {" "}
                            <i
                              className={`fa ${
                                passToggle ? "fa-eye" : "fa-eye-slash"
                              }`}
                              onClick={() => setPassToggle(!passToggle)}
                            />
                          </div>
                          <Form.Label
                            htmlFor="password"
                            className="animated-label"
                          >
                            Password
                          </Form.Label>
                        </Form.Group>
                        <span className="errmsg">{errors.password}</span>
                      </div>

                      <div className="remember_forgot d-flex justify-content-between">
                        <Form>
                          {/* {["checkbox"].map((type) => (
                            <div key={`inline-${type}`} className="mb-3 p-0">
                              <Form.Check
                                inline
                                label="Accept everything"
                                name="group1"
                                type={type}
                                id={`inline-${type}-1`}
                              />

                            </div>
                          ))} */}
                          <div className="mb-3 p-0">
                            <Form.Check
                              inline
                              type="checkbox"
                              id="inline-checkbox-2"
                              name="iaccept"
                              checked={formData.iaccept}
                              onChange={handleChange}
                              label={
                                <span>
                                  I accept the{" "}
                                  <Link to="/terms-of-use">Terms of Use</Link> and{" "}
                                  <Link to="/privacy-policy">Privacy Policy</Link>
                                </span>
                              }
                            />
                          </div>
                          {/* <div className="mb-3 p-0">
                            <Form.Check
                              inline
                              label="Sign me up for exclusive deals, new arrivals, and a whole lot of geeky stuff"
                              name="group1"
                              type="checkbox"
                              id="inline-checkbox-3"
                            />
                          </div> */}
                        </Form>
                      </div>
                      {resMsg && (
                        <div className="col-12">
                          <TextMessage msg={resMsg} type={false} />
                        </div>
                      )}
                      <div className="submit">
                        {isFormFilled() ? (
                          <>
                            {loading ? (
                              <button class="global_btn  w-100" type="button">
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Loading...
                              </button>
                            ) : (
                              <button
                                className="global_btn w-100"
                                onClick={() => handleRegister()}
                              >
                                Sign Up
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            className="global_btn w-100"
                            disabled
                            style={{ cursor: "not-allowed" }}
                          >
                            Sign Up
                          </button>
                        )}
                      </div>
                      {role === "customer" && <SocialIcon />}
                      <div className="mt-5">
                        Already have an account?{" "}
                        <Link className="highlight_txt" to={`/login/${role}`}>
                          Sign in Now
                        </Link>
                      </div>
                    </form>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </>
      )}
    </>
  );
};

export default FrontSignup;
