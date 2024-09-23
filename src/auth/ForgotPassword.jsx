import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import loginbanner from "../../src/assets/images/loginslide.png";

import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { APICALL } from "../helper/api/api";
import { Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { useLocation } from 'react-router-dom';
import { emailPattern, strongPasswordPattern } from "../helper/Constant";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};
const ForgotPassword = () => {
    const navigate = useNavigate()
    const query = useQuery();
    const token = query.get('token');
    const email = query.get('email');

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
    })
    const [errors, setErrors] = useState({
        email: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';
        if (!value) {
            errorMessage = 'Required';
        }

        if (name === 'email') {
            if (value && !emailPattern.test(value)) {
                errorMessage = 'Invalid email format';
            }
        }
        setErrors({
            ...errors,
            [name]: errorMessage
        });
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const isFormFilled = () => {
        for (const key in formData) {
            if (formData[key] === '') {
                return false;
            }
        }
        return true;
    };

    const [isSend, setIsSend] = useState(false)
    const handleLogin = async () => {
        setLoading(true)
        try {
            const res = await APICALL('/user/forgotPassword', 'post', formData)
            console.log(res)
            if (res?.status) {
                setIsSend(true)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setErrors({ ...errors, email: error.response?.data.message })
            setLoading(false)
        }
    }

    const [value, setValue] = useState({
        email: email || '',
        password: '',
        confirm_password: '',
        token: token || ''
    })
    const [resetErrors, setResetErrors] = useState({
        password: '',
        confirm_password: '',
    });

    const passwordChange = (e) => {
        const { name, value: fieldValue } = e.target;

        setValue((prevState) => {
            const newState = {
                ...prevState,
                [name]: fieldValue,
            };

            const errors = {};

            if (!newState.password) {
                errors.password = "Password is required";
            } else if (newState.password.length < 8) {
                errors.password = "Password must be at least 8 characters";
            } else {
                // const strongPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!strongPasswordPattern.test(newState.password)) {
                    errors.password = "Password must include at least one letter, one number, and one special character";
                }
            }

            if (!newState.confirm_password) {
                errors.confirm_password = "Confirm Password is required";
            } else if (newState.password !== newState.confirm_password) {
                errors.confirm_password = "Passwords do not match";
            }

            setResetErrors(errors);

            return newState;
        });
    };
    const isFormFilledReset = () => {
        return value.password.length > 0 &&
            value.confirm_password.length > 0 &&
            !resetErrors.password &&
            !resetErrors.confirm_password;
    };

    const updatePassword = async () => {
        setLoading(true)
        try {
            const res = await APICALL('/user/updatePassword', 'post', value)
            if (res?.status) {
                setLoading(false)
                navigate('/login/customer')
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setErrors({ ...errors, email: error.response?.data.message })
            setLoading(false)
        }
    }
    return (
        <div className="log_in_page">
            <Container fluid>
                <Row className="align-items-center">
                    <Col lg={6} className="p-0">
                        <div className="log_in">
                            <img className="w-100" src={loginbanner} alt="log-in-banner" />
                        </div>
                    </Col>

                    {
                        (email && token) ? <>
                            <Col lg={6}>
                                <div className="outer_login">

                                    <form action="#" class="custom-form">
                                        <h1>Set Your Password</h1>
                                        <Form.Group className={`form-group ${value.password.length ? 'not-empty' : ''}`}>
                                            <Form.Control
                                                type="text"
                                                className="form-control"
                                                name="password"
                                                id="password"
                                                value={value.password}
                                                onChange={passwordChange}
                                                maxLength={20}
                                            />
                                            <Form.Label htmlFor="password" className="animated-label">Enter New Password </Form.Label>
                                        </Form.Group>
                                        <span className="errmsg">{resetErrors.password}</span>

                                        <Form.Group className={`form-group ${value.confirm_password.length ? 'not-empty' : ''}`}>
                                            <Form.Control
                                                type="text"
                                                className="form-control"
                                                name="confirm_password"
                                                id="confirm_password"
                                                value={value.confirm_password}
                                                onChange={passwordChange}
                                                maxLength={20}

                                            />
                                            <Form.Label htmlFor="confirm_password" className="animated-label">Confirm Password </Form.Label>
                                        </Form.Group>
                                        <span className="errmsg">{resetErrors.confirm_password}</span>
                                        <div class="submit mt-4">
                                            {
                                                isFormFilledReset() ?
                                                    <>
                                                        {
                                                            loading ?
                                                                <button class="global_btn  w-100" type="button">
                                                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    Loading...
                                                                </button>
                                                                :
                                                                <button className="global_btn w-100" onClick={() => updatePassword()}>Change Password</button>
                                                        }
                                                    </>
                                                    :
                                                    <button className="global_btn w-100" disabled style={{ cursor: 'not-allowed' }}>Change Password</button>
                                            }
                                        </div>
                                    </form>
                                </div>

                            </Col>
                        </>
                            :
                            <Col lg={6}>

                                <div className="outer_login">

                                    <form action="#" class="custom-form">
                                        <h1 className="mb-5">Forgot Password</h1>
                                        <Form.Group className={`form-group ${formData.email.length ? 'not-empty' : ''}`}>
                                            <Form.Control
                                                type="text"
                                                className="form-control"
                                                name="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                            <Form.Label htmlFor="email" className="animated-label">Enter Your Email </Form.Label>
                                        </Form.Group>
                                        <span className="errmsg">{errors.email}</span>

                                        {
                                            isSend &&
                                            <div>
                                                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                                                    A password reset link has been sent to your email address {formData.email} Please check your email to reset your password.
                                                </Alert>
                                            </div>
                                        }

                                        <div class="submit mt-4">
                                            {
                                                isFormFilled() && !isSend ?
                                                    <>
                                                        {
                                                            loading ?
                                                                <button class="global_btn  w-100" type="button">
                                                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    Loading...
                                                                </button>
                                                                :
                                                                <button className="global_btn w-100" onClick={() => handleLogin()}>Reset</button>
                                                        }
                                                    </>
                                                    :
                                                    <button className="global_btn w-100" disabled style={{ cursor: 'not-allowed' }}>Reset</button>
                                            }
                                        </div>
                                    </form>
                                </div>


                            </Col>
                    }

                </Row>
            </Container>
        </div>
    );
};

export default ForgotPassword;
