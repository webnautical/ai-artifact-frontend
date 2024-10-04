import { Paper } from "@mui/material";
import { Col, Row, Form, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { APICALL } from "../../../helper/api/api";
import { apiBaseURL, auth, getTokenType, imgBaseURL } from "../../../helper/Utility";
import TextMessage from "../../../components/TextMessage";
import AdminLoader from "../../components/AdminLoader";
import axios from "axios";
const EditProfile = () => {
    const [submitLoading, setSubmitLoading] = useState(false)
    const [loading, setLoading] = useState(false)

    const [userDetails, setUserDetails] = useState({})
    const [resMsg, setResMsg] = useState(false)
    const [value, setValue] = useState({
        'first_name': '',
        'last_name': '',
        'userName': '',
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
                'userName': userDetails?.userName,
            })
            setImgPreview({ ...imgPreview, image: imgBaseURL() + userDetails?.banner });
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
        'userName': '',
    })
    const validate = (name, value) => {
        let error = '';
        if (name === 'first_name' && value.trim() === '') {
            error = 'Required';
        }
        if (name === 'last_name' && value.trim() === '') {
            error = 'Required';
        }
        if (name === 'userName' && value.trim() === '') {
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

    const [imgErr, setImgErr] = useState()
    const [imgPreview, setImgPreview] = useState({ image: "" });
    const [uploadProgress, setUploadProgress] = useState(0);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSizeMB = 30;
        if (file.size > maxSizeMB * 1024 * 1024) {
            setImgErr("Image size must be less than 30MB!");
            return;
        }

        const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validImageTypes.includes(file.type)) {
            setImgErr("Image must be in JPG, JPEG, or PNG format!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = async () => {
                const params = new FormData();
                params.append("image", file);
                try {
                    const res = await axios.post(`${apiBaseURL()}/user/updateArtistBanner`, params,
                        {
                            headers: {
                                Authorization: `Bearer ${auth('admin')?.token}`,
                            },
                            onUploadProgress: (progressEvent) => {
                                const percentCompleted = Math.round(
                                    (progressEvent.loaded * 100) / progressEvent.total
                                );
                                setUploadProgress(percentCompleted);
                            },
                        }
                    );
                    setImgErr();
                    setImgPreview({ ...imgPreview, image: e.target.result });
                    setUploadProgress(0);
                } catch (error) {
                    setUploadProgress(0);
                    setImgErr("Something Wen't Wrong !!");
                }
            };
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            {loading ? (
                <AdminLoader />
            ) : (
                <Paper className="table_samepattern cutoms-login-artist ">
                    <div className="p-4">
                        <h1 class="title-admins-table">Update Profile</h1>
                        <Form onSubmit={updateUserDetails}>
                            <Row className="justify-content-center">

                                {
                                    auth("admin")?.user_role === "artist" &&
                                    <Col md={7} className="mb-4">
                                        <div className="text-center mb-4">
                                            {imgPreview.image && (
                                                <img
                                                    src={imgPreview.image}
                                                    style={{ height: "208px", width: "100%" }}
                                                    alt="alt"
                                                />
                                            )}
                                        </div>
                                        <div class="file-uploader">
                                            <label for="logoID" class="global_file_upload_deisgn">
                                                <i class="fa-solid fa-arrow-up-from-bracket"></i>  Upload banner here - (1920x477 PX)
                                                <input
                                                    type="file"
                                                    id="logoID"
                                                    name="image"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                        {uploadProgress > 0 && (
                                            <div className="progress">
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{ width: `${uploadProgress}%` }}
                                                    aria-valuenow={uploadProgress}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                >
                                                    {uploadProgress}%
                                                </div>
                                            </div>
                                        )}
                                        <span className="text-danger">{imgErr}</span>
                                    </Col>
                                }


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
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Username*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your Last Name"
                                            name='userName'
                                            value={value?.userName}
                                            onChange={handleChange}
                                        />
                                        <span className="error">{errors.userName}</span>
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