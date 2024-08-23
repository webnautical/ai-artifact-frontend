import React, { useEffect, useState } from "react";
import {
    Row,
    Button,
    CardBody,
    Col,
    Form,
} from "react-bootstrap";
import BTNLoader from "../../../components/BTNLoader";
import { APICALL } from "../../../helper/api/api";
import swal from "sweetalert";
import { imgBaseURL } from "../../../helper/Utility";
import CKEditorCom from "../../../components/CKEditorCom";
const AddUpdBlog = ({ setAddUpdPage, getListFun, editData, setEditData }) => {
    const [submitLoading, setSubmitLoading] = useState(false)
    const [imgPreview, setImgPreview] = useState({ image: "" });
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: "",
    });

    useEffect(() => {
        if (editData?._id) {
            setFormData({
                ...formData,
                id: editData?._id,
                title: editData?.title,
                content: editData?.content,
                image: editData?.image,
            })
            setImgPreview({ ...imgPreview, image: imgBaseURL() + editData?.image })
        } else {
            setFormData({
                ...formData,
                title: "",
                content: "",
                image: "",
            })
        }
    }, [editData])

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setFormData({ ...formData, image: e.target.files[0] });
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImgPreview({ ...imgPreview, image: e.target.result });
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [e.target.name]: e.target.value,
            }));
        }
    }

    const handleEditorChange = (value) => {
        setFormData((prevValues) => {
            return { ...prevValues, ["content"]: value };
        });
    }


    const [error, setError] = useState({
        title: "",
        content: "",
        image: "",
    });

    const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);
    const handleValidate = () => {
        setAddUpdateApiCallCount(addUpdateApiCallCount + 1);
        const { title, content, image } = formData;
        const errors = {};
        if (title.trim() === "") errors.title = "Required *";
        if (content.trim() === "") errors.content = "Required *";
        if (image === "") errors.image = "Required *";
        setError(errors);
        if (Object.keys(errors).length === 0) {
            handleSubmit()
        }
    }


    const handleSubmit = async () => {
        setSubmitLoading(true)
        try {
            const params = new FormData();
            formData.id && params.append("id", formData.id);
            params.append("title", formData.title);
            params.append("content", formData.content);
            params.append("image", formData.image);
            const api = formData?.id ? "updateBlog" : "addBlog"
            const res = await APICALL(`admin/${api}`, 'post', params)
            if (res?.status) {
                swal({
                    title: res?.message,
                    icon: "success",
                    button: { text: "OK", className: "swal_btn_ok" },
                });
                setAddUpdPage(false)
                getListFun()
            } else {
                swal({
                    title: "Something Went Wrong !!",
                    icon: "error",
                    button: { text: "OK", className: "swal_btn_ok" },
                });
            }
        } catch (error) {
            swal({
                title: "Something Went Wrong !!",
                icon: "error",
                button: { text: "OK", className: "swal_btn_ok" },
            });
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleCancel = () => {
        setAddUpdPage(false)
        setEditData(null)
        setImgPreview({ ...imgPreview, image: '' })
    }

    return (
        <>
            <CardBody>
                <div className="cutoms-login-artist px-3">
                    <Row className="mb-md-3 g-3">


                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                                <span className="errmsg">{error.title}</span>

                            </Form.Group>
                        </Col>
                        <Col md={12} className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <CKEditorCom handleEditorChange={handleEditorChange} ckValue={formData.content} />
                            <span className="errmsg">{error.content}</span>
                        </Col>
                        <Col md={12} className="mb-3">
                            <div class="file-uploader">
                                <label for="logoID" class="global_file_upload_deisgn">
                                    <i class="fa-solid fa-arrow-up-from-bracket"></i>
                                    Upload blog image here
                                    <input type="file" id="logoID" name="image" value={formData.name} onChange={handleChange} />
                                </label>
                            </div>
                            {imgPreview.image && (
                                <div className="text-end">  <img src={imgPreview.image} style={{ height: '60px', width: '60px', marginTop: '20px' }} alt="alt" /></div>
                            )}
                        </Col>

                        

                        <Col md={12} className="text-end">
                            <Button className="artist-btn me-2" type="button" onClick={() => handleCancel()} >Cancel</Button>
                            {submitLoading ? (
                                <BTNLoader className={"artist-btn"} />
                            ) : (
                                <Button className="artist-btn" type="button" onClick={() => handleValidate()} >{formData?.id ? "Update" : "Save"}</Button>
                            )}
                        </Col>
                    </Row>
                </div>
            </CardBody>
        </>
    )
}

export default AddUpdBlog