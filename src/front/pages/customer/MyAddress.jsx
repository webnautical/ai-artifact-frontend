import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { APICALL } from "../../../helper/api/api";
import { auth } from "../../../helper/Utility";
import TextMessage from "../../../components/TextMessage";
import FrontLoader from './../../../components/FrontLoader';

const MyAddress = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [userDetails, setUserDetails] = useState({})
    const [resMsg, setResMsg] = useState(false)
    useEffect(() => {
        if (!auth('customer')) {
            navigate('/login/customer')
        }
        getCustomerDetailsFunt()
    }, [])

    const [value, setValue] = useState({
        "address1": "",
        "address2": "",
        "country": "",
        "state": "",
        "city": "",
        "postalCode": "",
        "phone": ""
    })


    useEffect(() => {
        if (userDetails?._id) {
            setValue({
                ...value,
                "address1": userDetails?.address1,
                "address2": userDetails?.address2,
                "country": userDetails?.country,
                "state": userDetails?.state,
                "city": userDetails?.city,
                "postalCode": userDetails?.postalCode,
                "phone": userDetails?.phone,
            })
        }
    }, [userDetails])

    const getCustomerDetailsFunt = async () => {
        setLoading(true)
        try {
            const res = await APICALL('/user/userData', 'post', { id: auth('customer')?.id })
            if (res?.status) {
                console.log("res", res)
                setUserDetails(res?.user)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    const [errors, setErrors] = useState({
        'address1': '',
        'address2': '',
    })
    const validate = (name, value) => {
        let error = '';
        if (name === 'address1' && value.trim() === '') {
            error = 'Required';
        }
        if (name === 'address2' && value.trim() === '') {
            error = 'Required';
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue((prevValue) => ({
            ...prevValue,
            [name]: value,
        }));
        validate(name, value);
    };

    const updateUserDetails = async (e) => {
        e.preventDefault()
        setSubmitLoading(true)
        try {
            const res = await APICALL('/user/updateUser', 'post', value)
            if (res?.status) {
                setUserDetails(res?.user)
                setSubmitLoading(false)
                setResMsg(true)
            } else {
                setSubmitLoading(false)
            }
        } catch (error) {
            console.log(error)
            setSubmitLoading(false)
        }
    }
    return (
        <>
            {
                loading ? <FrontLoader /> :
                    <>
                        <div className="account-profile-title">
                            <h1>Edit Your Address</h1>
                        </div>
                        <div className="account-content-box cutoms-login-artist">
                            <Form onSubmit={updateUserDetails}>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Address 1</Form.Label>
                                            <Form.Control
                                                type="text"
                                                as={'textarea'}
                                                placeholder="Address 1"
                                                name='address1'
                                                value={value?.address1}
                                                onChange={handleChange}
                                            />
                                            <span className="error">{errors.address1}</span>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Address 2</Form.Label>
                                            <Form.Control
                                                type="text"
                                                as={'textarea'}
                                                placeholder="Address 2"
                                                name='address2'
                                                value={value?.address2}
                                                onChange={handleChange}
                                            />
                                            <span className="error">{errors.address2}</span>

                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Country</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Country"
                                                name='country'
                                                value={value?.country}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="State"
                                                name='state'
                                                value={value?.state}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="City"
                                                name='city'
                                                value={value?.city}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Postal Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Postal Code"
                                                name='postalCode'
                                                value={value?.postalCode}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Phone"
                                                name='phone'
                                                value={value?.phone}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <div className="col-12">
                                        {
                                            resMsg &&
                                            <TextMessage msg={"Profile Updated Successfully !!"} type={true} />
                                        }
                                    </div>
                                    <Col md="12 text-end">
                                        {
                                            submitLoading ?
                                                <Button className="global_btn" type="button" block>
                                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Loading...
                                                </Button>
                                                :
                                                <>
                                                    {/* {
                                                        isFormFilled() ? */}
                                                            <Button className="global_btn" type="submit" block>Save Changes</Button>
                                                            {/* :
                                                            <Button className="global_btn" type="button" block disabled>Save Changes</Button>

                                                    } */}
                                                </>
                                        }
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </>
            }

        </>
    )
}

export default MyAddress