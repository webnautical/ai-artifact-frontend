import { Paper } from "@mui/material";
import { Col, Row, Form, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { APICALL } from "../../../helper/api/api";
import { auth, getTokenType } from "../../../helper/Utility";
import TextMessage from "../../../components/TextMessage";
import AdminLoader from "../../components/AdminLoader";
const EditProfile = () => {
    const [submitLoading, setSubmitLoading] = useState(false)
    const [loading, setLoading] = useState(false)

    const [userDetails, setUserDetails] = useState({})
    const [resMsg, setResMsg] = useState(false)
    const [value, setValue] = useState({
        'first_name': '',
        'last_name': '',
    })

    useEffect(() => {
        getCustomerDetailsFunt()
    }, [])
    useEffect(() => {
        if (userDetails?._id) {
            setValue({
                ...value,
                'first_name': userDetails?.first_name,
                'last_name': userDetails?.last_name,
            })
        }
    }, [userDetails])

    const getCustomerDetailsFunt = async () => {
        setLoading(true)
        try {
            const res = await APICALL('/user/userData', 'post', { id: auth('admin')?.id })
            if (res?.status) {
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
        'first_name': '',
        'last_name': '',
    })
    const validate = (name, value) => {
        let error = '';
        if (name === 'first_name' && value.trim() === '') {
            error = 'Required';
        }
        if (name === 'last_name' && value.trim() === '') {
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

    const isFormFilled = () => {
        for (const key in value) {
            if (value[key] === '') {
                return false;
            }
        }
        return true;
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

    console.log("userDetails",userDetails)
    return (
        <>
            {loading ? (
                <AdminLoader />
            ) : (
                <Paper className="table_samepattern">
                    <div className="p-4">
                        <Form onSubmit={updateUserDetails}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>First Name*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your First Name"
                                            name='first_name'
                                            value={value?.first_name}
                                            onChange={handleChange}
                                        />
                                        <span className="error">{errors.first_name}</span>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Last name*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your Last Name"
                                            name='last_name'
                                            value={value?.last_name}
                                            onChange={handleChange}
                                        />
                                        <span className="error">{errors.last_name}</span>

                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your Email"
                                            value={userDetails?.email}
                                            disabled
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
                                                {
                                                    isFormFilled() ?
                                                        <Button className="global_btn" type="submit" block>Save Changes</Button>
                                                        :
                                                        <Button className="global_btn" type="button" block disabled>Save Changes</Button>

                                                }
                                            </>
                                    }
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Paper>
            )}
        </>
    )
}

export default EditProfile