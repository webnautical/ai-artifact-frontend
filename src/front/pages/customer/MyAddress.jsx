import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { APICALL } from "../../../helper/api/api";
import { auth } from "../../../helper/Utility";
import TextMessage from "../../../components/TextMessage";
import FrontLoader from './../../../components/FrontLoader';
import { Autocomplete, Box, TextField } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { Country, State, City } from "country-state-city";

const MyAddress = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [userDetails, setUserDetails] = useState({})
    const [resMsg, setResMsg] = useState(false)
    const [stateList, setStateList] = useState([]);

    useEffect(() => {
        if (!auth('customer')) {
            navigate('/login/customer')
        }
        getCustomerDetailsFunt()
    }, [])

    const countryOptions = Country?.getAllCountries()?.map((country) => ({
        value: country.isoCode,
        label: (
            <div style={{ display: "flex", alignItems: "center" }}>
                <ReactCountryFlag
                    countryCode={country.isoCode}
                    svg
                    style={{ width: "1.5em", height: "1.5em", marginRight: "0.5em" }}
                />
                {country.name}
            </div>
        ),
    }));

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
            getStateFun(userDetails?.country)
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
    const handleCountryChange = (event, selectedOption) => {
        handleChange({
            target: { name: "country", value: selectedOption ? selectedOption.value : "" },
        });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "country") {
            setValue({ ...value, country: e.target.value });
            getStateFun(e.target.value);
        }
        setValue((prevValue) => ({
            ...prevValue,
            [name]: value,
        }));
        validate(name, value);
    };
    const getStateFun = (country) => {
        const stateData = State?.getStatesOfCountry(country).map((state) => ({
            value: state.isoCode,
            displayValue: state.name,
        }));
        setStateList(stateData);
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
                        <div className="account-content-box cutoms-login-artist ship_address ">
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
                                                maxLength={35}
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
                                                maxLength={35}
                                            />
                                            <span className="error">{errors.address2}</span>

                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label>Choose Country</Form.Label>
                                        <Autocomplete
                                            options={countryOptions}
                                            autoComplete={"off"}
                                            getOptionLabel={(option) => option.label.props.children[1]}
                                            renderOption={(props, option) => (
                                                <Box component="li" {...props}>
                                                    {option.label}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                //   error={Boolean(error.country)}
                                                //   helperText={error.country}
                                                />
                                            )}
                                            value={countryOptions.find((option) => option.value === value.country) || null}
                                            onChange={handleCountryChange}
                                        />
                                    </Col>

                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Choose State</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="state"
                                                value={value.state}
                                                onChange={handleChange}
                                            >
                                                <option value="">--SELECT--</option>
                                                {stateList?.map((item, i) => (
                                                    <option value={item?.value}>
                                                        {item.displayValue}
                                                    </option>
                                                ))}
                                            </Form.Control>

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
                                                maxLength={30}

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
                                                maxLength={8}

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
                                                maxLength={12}

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