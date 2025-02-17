import React, { useEffect, useState } from "react";
import {
    Row,
    Button,
    CardHeader,
    Card,
    CardBody,
    Col,
    Form,
} from "react-bootstrap";
import { APICALL, axiosInstance } from "../../../helper/api/api";
import BTNLoader from "../../../components/BTNLoader";
import CKEditorCom from '.././../../components/CKEditorCom';
import { useParams } from "react-router";
import { imgBaseURL } from "../../../helper/Utility";
import AdminLoader from "../../components/AdminLoader";
import { Edit } from "@mui/icons-material";

import swal from "sweetalert";
import {
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";
import HTMLContent from './../../../components/HTMLContent';
function TabPanel({ children, value, name, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== name}
            id={`tabpanel-${name}`}
            aria-labelledby={`tab-${name}`}
            {...other}
        >
            {value === name && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
const ProductGuide = () => {
    const { route } = useParams()
    const [isForm, setIsForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [pageData, setPageDaa] = useState(null)
    const [activeTab, setActiveTab] = useState("productType");
    const [formData, setFormData] = useState({
        name: "",
        infoType: "",
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
                'infoType': pageData?.infoType,
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
                'infoType': '',
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

    const handleEditClick = (row) => {
        setPageDaa(row)
        setIsForm(true)
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
        if (pageData?._id) {
            params.append("id", pageData._id);
        }
        params.append("name", formData.name);
        params.append("editorContent1", formData.editorContent1);
        params.append("image1", formData.image1);
        params.append("infoType", formData?.infoType);
        try {
            const res = await axiosInstance.post('/admin/addOrUpdateProductGuide', params, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSubmitLoading(false)
            if (res?.status) {
                getListFun()
                setIsForm(false)
                swal({ title: "Successfully !!", icon: "success", button: { text: "OK", className: "swal_btn_ok" } });
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
    const [pageList, setPageList] = useState(null)
    const getListFun = async () => {
        try {
            const res = await APICALL("/admin/getProductGuide", 'post', { role: "admin" })
            if (res?.status) { setPageList(res?.data); setData(res?.data?.productType); } else setPageList(null)
        } catch (error) {
            setPageList(null)
        }
    }

    const [data, setData] = useState([])
    const handleTabChange = (event, newValue) => {
        if (newValue === "size") {
            setData(pageList?.size);
        } else if (newValue === "productType") {
            setData(pageList?.productType)
        } else if (newValue === "frame") {
            setData(pageList?.frame)
        } else {
            setData([])
        }
        setActiveTab(newValue);
    };

    const handleBack = () => {
        setPageDaa(null)
        setIsForm(false)
    }

    const handleNew = () => {
        setIsForm(true)
        setPageDaa(null)
        setImgPreview({ ...imgPreview, image1: "" });
    }

    return (
        <Card className="card-cusotom ">
            {loading ? (
                <AdminLoader />
            ) : (
                <>
                    <CardHeader>
                        <div className="d-flex justify-content-between align-item-center">
                            <h5>Product Guide</h5>
                            <button className="artist-btn mx-2 btn btn-primary" onClick={() => handleNew()}>Add New</button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="cutoms-login-artist">
                            {
                                isForm ?
                                    <Row className="mb-md-3 mb-2">
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="formFirstName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId="formSelect">
                                                <Form.Label>Select Parent Menu</Form.Label>
                                                <Form.Select value={formData?.infoType} name="infoType" onChange={handleChange}>
                                                    <option value="">-- Select an type --</option>
                                                    <option value={"productType"}>productType</option>
                                                    <option value={"size"}>size</option>
                                                    <option value={"frame"}>frame</option>
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


                                        <Col md={6} className="mt-3">
                                            <Form.Group className="mb-3" controlId="formmainTitle">
                                                <Form.Label>Image Or Video</Form.Label>
                                                <Form.Control type="file" name="image1" onChange={handleChange} />
                                            </Form.Group>
                                            {imgPreview.image1 && (
                                                imgPreview.image1.endsWith(".mp4") || imgPreview.image1.endsWith(".webm") || imgPreview.image1.endsWith(".ogg") ? (
                                                    <video
                                                        src={imgPreview.image1}
                                                        controls
                                                        style={{ height: '200px', width: '120px' }}
                                                        alt="Video Preview"
                                                    />
                                                ) : (
                                                    <img
                                                        src={imgPreview.image1}
                                                        style={{ height: '60px', width: '60px' }}
                                                        alt="Image Preview"
                                                    />
                                                )
                                            )}
                                        </Col>

                                        <Col md={12} className="mt-3 text-end">
                                            <Button className="artist-btn mx-2" type="button" onClick={() => handleBack()}>Back</Button>

                                            {submitLoading ? <BTNLoader className={"artist-btn"} /> :
                                                <Button className="artist-btn" type="button" onClick={() => handleSubmit()}>{pageData?._id ? "Update" : "Create"}</Button>
                                            }
                                        </Col>
                                    </Row> :
                                    <Row className="mb-md-3 mb-2">
                                        <div>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <Tabs value={activeTab} onChange={handleTabChange} aria-label="product tabs">
                                                    <Tab label="Product Type" value="productType" />
                                                    <Tab label="Size" value="size" />
                                                    <Tab label="Frame" value="frame" />
                                                </Tabs>
                                            </Box>
                                        </div>
                                        {
                                            data?.length > 0 ?
                                                <>
                                                    <TabPanel value={activeTab} name={activeTab}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>S.No</TableCell>
                                                                    {activeTab !== "frame" &&
                                                                        <TableCell>Name</TableCell>
                                                                    }
                                                                    <TableCell>Type</TableCell>
                                                                    {activeTab !== "size" &&
                                                                        <TableCell>Content</TableCell>
                                                                    }
                                                                    <TableCell align="right">Action</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {data?.map((row, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        {activeTab !== "frame" &&
                                                                            <TableCell><strong>{row?.name}</strong></TableCell>
                                                                        }
                                                                        <TableCell><strong className="text-capitalize">{row?.infoType}</strong></TableCell>
                                                                        {activeTab !== "size" &&
                                                                            <TableCell>
                                                                                <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "pre" }}>
                                                                                    <HTMLContent data={row?.editorContent1} />
                                                                                </div>
                                                                            </TableCell>
                                                                        }
                                                                        <TableCell style={{ width: 160 }} align="right">
                                                                            <Edit onClick={() => handleEditClick(row)} style={{ marginRight: "8px", color: "#008080", fontSize: "20px", cursor: "pointer" }} variant="link" />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TabPanel>

                                                </>
                                                :
                                                <div className="col-12 text-center px-2 mt-3">
                                                    <div class="alert alert-success text-capitalize" role="alert">
                                                        there are no data to display
                                                    </div>
                                                </div>
                                        }
                                    </Row>
                            }
                        </div>
                    </CardBody>
                </>
            )}
        </Card>
    );
};

export default ProductGuide;
