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
import { APICALL, axiosInstance } from "../../helper/api/api";
import BTNLoader from "../../components/BTNLoader";
import CKEditorCom from './../../components/CKEditorCom';
import { useParams } from "react-router";
import { imgBaseURL } from "../../helper/Utility";
import AdminLoader from "../components/AdminLoader";
import swal from "sweetalert";
import NewCKEditor from "../../components/NewCKEditor";
const StaticPages = () => {
    const { route } = useParams()
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [pageData, setPageDaa] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        parentId: "",
        route: route,
        mainTitle: "",
        metaTitle: "",
        metaDesc: "",
        subTitle: "",
        editorContent1: "",
        editorContent2: "",
        editorContent3: "",
        image1: "",
        image2: "",
    });

    useEffect(() => {
        getPageContentFun()
    }, [route])

    useEffect(() => {
        getListFun()
    }, [])

    useEffect(() => {
        if (pageData?._id) {
            setFormData({
                ...formData,
                'name': pageData?.name,
                'route': pageData?.route,
                'metaTitle': pageData?.metaTitle,
                'metaDesc': pageData?.metaDesc,
                'mainTitle': pageData?.mainTitle,
                'subTitle': pageData?.subTitle,
                'parentId': pageData?.parentId,
                'editorContent1': pageData?.editorContent1 ? pageData?.editorContent1 : "",
                'editorContent2': pageData?.editorContent2 ? pageData?.editorContent2 : "",
                'editorContent3': pageData?.editorContent3 ? pageData?.editorContent3 : "",
                'image1': pageData?.image1,
                'image2': pageData?.image2,
            })
            setImgPreview({ ...imgPreview, image1: imgBaseURL() + pageData?.image1, image2: imgBaseURL() + pageData?.image2 });
        } else {
            setFormData({
                ...formData,
                'parentId': '',
                'name': '',
                'route': route,
                'mainTitle': '',
                'subTitle': '',
                'metaTitle': "",
                'metaDesc': "",
                'editorContent1': '',
                'editorContent2': '',
                'editorContent3': '',
                'image1': '',
                'image2': '',
            })
        }
    }, [pageData])

    const getPageContentFun = async () => {
        setLoading(true)
        try {
            const res = await APICALL('user/getPageByRoute', 'post', { route: route })
            if (res?.status) { setPageDaa(res?.data); setLoading(false) }
        } catch (error) { setLoading(false) }
    }

    const [imgPreview, setImgPreview] = useState({
        image1: "",
        image2: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.target.name === "image1") {
            setFormData({ ...formData, image1: e.target.files[0] });
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImgPreview({ ...imgPreview, image1: e.target.result });
                };
                reader.readAsDataURL(file);
            }
        } else if (e.target.name === "image2") {
            setFormData({ ...formData, image2: e.target.files[0] });
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImgPreview({ ...imgPreview, image2: e.target.result });
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async () => {
        setSubmitLoading(true)
        const params = new FormData();
        params.append("name", formData.name);
        params.append("metaTitle", formData.metaTitle);
        params.append("metaDesc", formData.metaDesc);
        params.append("mainTitle", formData.mainTitle);
        params.append("route", formData.route);
        params.append("subTitle", formData.subTitle);
        params.append("editorContent1", formData.editorContent1);
        params.append("editorContent2", formData.editorContent2);
        params.append("editorContent3", formData.editorContent3);
        params.append("image1", formData.image1);
        params.append("image2", formData.image2);
        params.append("parentId", formData?.parentId);
        try {
            const res = await axiosInstance.post('/admin/createPage', params, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSubmitLoading(false)
            if (res?.status) {
                getPageContentFun()
                swal({ title: "Page Updated Successfully !!", icon: "success", button: { text: "OK", className: "swal_btn_ok" } });
            } else {
                swal({ title: "Something Went Wrong !!", icon: "error", button: { text: "OK", className: "swal_btn_ok" } });
            }
        } catch (error) {
            console.log(error)
            setSubmitLoading(false)
            swal({ title: "Something Went Wrong !!", icon: "error", button: { text: "OK", className: "swal_btn_ok" } });
        }
    };

    const handleEditorChange = (value, type) => {
        if (type === 'editorContent1') {
            setFormData((prevValues) => { return { ...prevValues, ["editorContent1"]: value }; });
        } else if (type === 'editorContent2') {
            setFormData((prevValues) => { return { ...prevValues, ["editorContent2"]: value } });
        } else if (type === 'editorContent3') {
            setFormData((prevValues) => { return { ...prevValues, ["editorContent3"]: value } });
        }
    };
    const [pageList, setPageList] = useState([])
    const getListFun = async () => {
        try {
            const res = await APICALL("/admin/getNestedPages", 'post', { role: "admin" })
            if (res?.status) setPageList(res?.data); else setPageList([])
        } catch (error) {
            setPageList([])
        }
    }

    return (
        <Card className="card-cusotom ">
            {loading ? (
                <AdminLoader />
            ) : (
                <>
                    <CardHeader>Page</CardHeader>
                    <CardBody>
                        <div className="cutoms-login-artist">
                            <Row className="mb-md-3 mb-2">
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formFirstName">
                                        <Form.Label>Page Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formFirstName">
                                        <Form.Label>Meta title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="metaTitle"
                                            value={formData.metaTitle}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formFirstName">
                                        <Form.Label>Meta Description</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="metaDesc"
                                            value={formData.metaDesc}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                {
                                    (pageData === null || (pageData !== null && formData?.mainTitle !== "")) &&
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formmainTitle">
                                            <Form.Label>Main Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="mainTitle"
                                                value={formData.mainTitle}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                }

                                {
                                    (pageData === null || (pageData !== null && formData?.subTitle !== "")) &&
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formmainTitle">
                                            <Form.Label>Sub Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="subTitle"
                                                value={formData.subTitle}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                }
                                <Col md={6}>

                                    <Form.Group controlId="formSelect">
                                        <Form.Label>Select Parent Menu</Form.Label>
                                        <Form.Select value={formData?.parentId} name="parentId" onChange={handleChange}>
                                            <option value="">-- Select an option --</option>
                                            {pageList?.map((item, i) => (
                                                <option value={item?._id}>{item?.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <label htmlFor="">Content 1</label>
                                    <CKEditorCom
                                        ckValue={formData?.editorContent1}
                                        handleEditorChange={(e) => handleEditorChange(e, 'editorContent1')}
                                    />
                                </Col>
                                {
                                    (pageData === null || (pageData !== null && formData?.editorContent2 !== "")) &&
                                    <Col md={12} className="mt-3">
                                        <label htmlFor="">Content 2</label>
                                        <CKEditorCom
                                            ckValue={formData?.editorContent2}
                                            handleEditorChange={(e) => handleEditorChange(e, 'editorContent2')}
                                        />
                                    </Col>
                                }

                                {
                                    (pageData === null || (pageData !== null && formData?.editorContent3 !== "")) &&
                                    <Col md={12} className="mt-3">
                                        <label htmlFor="">Content 3</label>
                                        <CKEditorCom
                                            ckValue={formData?.editorContent3}
                                            handleEditorChange={(e) => handleEditorChange(e, 'editorContent3')}
                                        />
                                    </Col>
                                }

                                {
                                    (pageData === null || (pageData !== null && formData?.image1 !== "")) &&
                                    <Col md={6} className="mt-3">
                                        <Form.Group className="mb-3" controlId="formmainTitle">
                                            <Form.Label>Image 1</Form.Label>
                                            <Form.Control type="file" name="image1" onChange={handleChange} />
                                        </Form.Group>
                                        {imgPreview.image1 && (
                                            <img src={imgPreview.image1} style={{ height: '60px', width: '60px' }} alt="Cover Preview" />
                                        )}
                                    </Col>
                                }

                                {
                                    (pageData === null || (pageData !== null && formData?.image2 !== "")) &&
                                    <Col md={6} className="mt-3">
                                        <Form.Group className="mb-3" controlId="formmainTitle">
                                            <Form.Label>Image 2</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image2"
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        {imgPreview.image2 && (
                                            <img src={imgPreview.image2} style={{ height: '60px', width: '60px' }} alt="Cover Preview" />
                                        )}
                                    </Col>
                                }
                            </Row>
                        </div>
                    </CardBody>
                    <CardFooter>
                        {
                            submitLoading ? <BTNLoader className={"artist-btn"} /> :
                                <Button className="artist-btn" type="button" onClick={() => handleSubmit()}>{pageData?._id ? "Update" : "Create"}</Button>
                        }
                    </CardFooter>
                </>
            )}
        </Card>
    );
};

export default StaticPages;
