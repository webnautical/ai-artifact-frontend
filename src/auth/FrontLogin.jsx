import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import loginbanner from "../../src/assets/images/loginslide.png";
import artistLogin from "../../src/admin/assets/images/artistlogin.png";
import logo from "../../src/admin/assets/images/logo.png";
import Form from "react-bootstrap/Form";
import { Link, useNavigate, useParams } from "react-router-dom";
import SocialIcon from "./SocialIcon";
import { APICALL } from "../helper/api/api";
import { auth, encryptLocalStorageData } from "../helper/Utility";
import { Alert, Button } from "@mui/material";

const FrontLogin = () => {
  const navigate = useNavigate();
  const { role } = useParams();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember_me: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    remember_me: false,
  });

  useEffect(() => {
    const savedEmail = auth("remember_me")?.email;
    const savedPassword = auth("remember_me")?.password;
    const rememberMe = auth("remember_me")?.remember_me;

    if (savedEmail && savedPassword && rememberMe) {
      console.log("IF Call");
      setFormData({
        email: savedEmail,
        password: savedPassword,
        remember_me: rememberMe,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    let errorMessage = "";
    const fieldValue = type === "checkbox" ? checked : value;
    if (!value) {
      errorMessage = "Required";
    }

    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailPattern.test(value)) {
        errorMessage = "Invalid email format";
      }
    }
    setErrors({
      ...errors,
      [name]: errorMessage,
    });
    setFormData({
      ...formData,
      [name]: fieldValue,
    });
  };

  const isFormFilled = () => {
    for (const key in formData) {
      if (formData[key] === "") {
        return false;
      }
    }
    return true;
  };

  const [serverMsg, setServerMsg] = useState();
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await APICALL("/user/loginUser", "post", formData);
      console.log("loginRes",res)
      if (res?.status) {
        const dataParam = {
          token: res?.token,
          name: res?.user?.first_name,
          email: res?.user?.email,
          password: formData?.password,
          id: res?.user?._id,
          user_role: res?.user?.user_role,
        };
        const rememberVal = {
          name: res?.user?.first_name,
          email: res?.user?.email,
          password: formData?.password,
          remember_me: formData?.remember_me,
        };
        if (formData?.remember_me) {
          encryptLocalStorageData(
            "remember_me",
            rememberVal,
            "DoNotTryToAccess"
          );
        } else {
          localStorage.removeItem("remember_me");
        }
        if (res?.user?.user_role === "customer") {
          encryptLocalStorageData(
            "customer-secret",
            dataParam,
            "DoNotTryToAccess"
          );
          const productURL = sessionStorage.getItem('p-url')
          if(productURL){
            navigate(productURL)
            sessionStorage.removeItem('p-url')
          }else{
            navigate("/");
          }
        } else {
          encryptLocalStorageData(
            "admin-secret",
            dataParam,
            "DoNotTryToAccess"
          );
          navigate(`/${res?.user?.user_role}/dashboard`);
          window.location.reload();
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setServerMsg(error?.response?.data?.message);
      setLoading(false);
    }
  };
  const [passToggle, setPassToggle] = useState(false);

  return (
    <>
      {role === "customer" ? (
        <div className="log_in_page">
          <Container fluid>
            <Row className="align-items-center">
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
                  <form action="#" class="custom-form">
                    <h1>Log In</h1>
                    <p className="mb-md-4 mt-md-4 mb-2 mt-3">
                      Enter your details below
                    </p>

                  <div>
                  <Form.Group
                      className={`form-group mb-3 ${
                        formData.email.length ? "not-empty" : ""
                      }`}
                    >
                      <Form.Control
                        type="text"
                        className="form-control"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <Form.Label htmlFor="email" className="animated-label">
                        Email Or Phone Number
                      </Form.Label>
                    </Form.Group>
                    <span className="errmsg">{errors.email}</span>
                  </div>

                   <div className="main_tagg">
                   <Form.Group
                      className={`form-group ${
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
                      />
                      <Form.Label htmlFor="password" className="animated-label">
                        Password
                      </Form.Label>
                    </Form.Group>
                    <div className="taggole_eyw">
                      {" "}
                      <i
                        className={`fa ${
                          passToggle ? "fa-eye" : "fa-eye-slash"
                        }`}
                        onClick={() => setPassToggle(!passToggle)}
                      />
                    </div>
                    <span className="errmsg">{errors.password}</span>
                   </div>

                    <div className="remember_forgot d-flex justify-content-between">
                      <Form>
                        <div className=" p-0">
                          <Form.Check
                            inline
                            label="Remember Me"
                            name="remember_me"
                            type={"checkbox"}
                            id={`inline-1`}
                            checked={formData.remember_me}
                            onChange={handleChange}
                          />
                        </div>
                      </Form>

                      <Link to={"/forgot-password"}>Forgot Password</Link>
                    </div>

                    {serverMsg && <Alert severity="error">{serverMsg}</Alert>}

                    <div class="submit mt-2">
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
                              className="mt-2 global_btn w-100"
                              onClick={() => handleLogin()}
                            >
                              Log In
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          className="mt-2 global_btn w-100"
                          disabled
                          style={{ cursor: "not-allowed" }}
                        >
                          Log In
                        </button>
                      )}
                    </div>

                    <SocialIcon />

                    <div className="mt-5">
                      Don’t have an account ?{" "}
                      <Link className="highlight_txt" to={`/signup/${role}`}>
                        Sign Up Now
                      </Link>
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      ) : (
        <>
          <div className="artist-login-container">
            <Container fluid>
              <Row className="align-items-center justify-content-end">
                <Col md={5} className="login-form ml-auto">
                  <img className="mx-auto logo-login" src={logo} alt="" />
                  <h1 className="login-title text-capitalize">{role} Login</h1>
                  <p className="login-subtitle">
                    Enter your credentials to login your account.
                  </p>

                  <div className="cutoms-login-artist">
                    <Form>
                    <Form.Group
  className={`form-group ${formData.email.length ? "not-empty" : ""} mb-3`}
>
                        <Form.Label htmlFor="email" className="animated-label">
                          Email Or Phone Number
                        </Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <span className="errmsg">{errors.email}</span>

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
                          className="form-control"
                          name="password"
                          type={passToggle ? "text" : "password"}
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
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

                      <Form.Group
                        controlId="formBasicCheckbox"
                        className="d-flex justify-content-between mb-4 mt-3"
                      >
                        <Form>
                          <div className="   p-0">
                            <Form.Check
                              inline
                              label="Remember Me"
                              name="remember_me"
                              type={"checkbox"}
                              id={`inline-1`}
                              checked={formData.remember_me}
                              onChange={handleChange}
                            />
                          </div>
                        </Form>
                        <Link to="/forgot-password" className="forgetpassword">
                          Forget password?
                        </Link>
                      </Form.Group>
                      {serverMsg && <Alert severity="error">{serverMsg}</Alert>}
                      <div class="submit mt-4">
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
                                onClick={() => handleLogin()}
                              >
                                Log In
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            className="global_btn w-100"
                            disabled
                            style={{ cursor: "not-allowed" }}
                          >
                            Log In
                          </button>
                        )}
                      </div>
                      <p className="signup-link">
                        Don't have an account ?{" "}
                        <Link to={`/signup/${role}`}> Sign Up now</Link>
                      </p>
                      <p className="privacy-notice">
                        Our privacy notice includes information about how we use
                        your personal data and your rights.
                      </p>
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
      )}
    </>
  );
};

export default FrontLogin;
