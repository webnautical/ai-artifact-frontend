import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Paper from "@mui/material/Paper";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import AdminLoader from './../../components/AdminLoader';
import { SERVER_ERR, SOMETHING_ERR, TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
import { APICALL } from "../../../helper/api/api";
import { imgBaseURL, tableImg, timeAgo } from "../../../helper/Utility";
import swal from "sweetalert";
import BTNLoader from "../../../components/BTNLoader";

const BannerAndImages = () => {
    const [loading, setLoading] = useState({
        'list': false,
        'submit': false
    })
    const [bannerList, setBannerList] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)
        setFormData(initialFormData)
        setImgPreview({ ...imgPreview, 'image': '' })
    };
    const handleShow = (type) => {
        setShow(true)
    };

    useEffect(() => {
        getListFun()
    }, [])
    const getListFun = async () => {
        setLoading({ ...loading, 'list': true })
        try {
            const res = await APICALL('admin/getActiveBanners', 'post', {})
            setLoading({ ...loading, 'list': false })
            console.log("List", res?.data)
            if (res?.status) { setBannerList(res?.data) }
        } catch (error) {
            setLoading({ ...loading, 'list': false })
        }
    }

    const initialFormData = {
        id: '',
        redirectUrl: '',
        title: '',
        status: false,
        image: '',
    };
    const [imgPreview, setImgPreview] = useState({ image: "" });
    const [formData, setFormData] = useState(initialFormData);


    const handleEditChange = (row) => {
        setShow(true)
        setFormData({ ...formData, 'category_name': row?.name, 'id': row?._id, 'image': row.image, parentCategoryId: row.parentCategoryId?._id })
        setImgPreview({ ...imgPreview, 'image': imgBaseURL() + row?.image })
    }

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


    const handleSubmit = async () => {
        if (formData.category_name == "") {
            swal({ title: `Banner is required !!`, icon: "error", button: { text: "OK", className: "swal_btn_ok" } });
            return false
        }
        setLoading({ ...loading, 'submit': true })
        const params = new FormData();
        formData.id && params.append("id", formData.id);
        params.append("title", formData.title);
        params.append("redirectUrl", formData.redirectUrl);
        params.append("status", formData.status);
        params.append("image", formData.image);
        try {
            const apiEnd = `addBanner`
            const res = await APICALL(`/admin/${apiEnd}`, 'post', params);
            setLoading({ ...loading, 'submit': false })
            if (res?.status) {
                getListFun()
                setShow(false)
                swal({ title: "Updated Successfully !!", icon: "success", button: { text: "OK", className: "swal_btn_ok" } });
            } else {
                swal({ title: "Something Went Wrong !!", icon: "error", button: { text: "OK", className: "swal_btn_ok" } });
            }
        } catch (error) {
            console.log(error)
            setLoading({ ...loading, 'submit': false })
            swal({ title: error?.response?.data?.message, icon: "error", button: { text: "OK", className: "swal_btn_ok" } });
        }
    };

    const handleDelete = async (id) => {
        try {
            const params = 0 == "category" ? { categoryId: id } : { subcategoryId: id }
            const apiEnd = 0 == "category" ? "deleteCategory" : "deleteSubcategory"
            const res = await APICALL(`admin/${apiEnd}`, 'post', params);
            if (res?.status) {
                getListFun()
                swal({ title: "Delete Successfully !!", icon: "success", button: { text: "OK", className: "swal_btn_ok" } });
            } else {
                swal({ title: SOMETHING_ERR, icon: "error", button: { text: "OK", className: "swal_btn_ok" } });
            }
        } catch (error) {
            swal({ title: SERVER_ERR, icon: "error", button: { text: "OK", className: "swal_btn_ok" } });
        }
    }

    console.log("bannerList", bannerList)


    return (
        <>
            <Paper className="table_samepattern">
                <div style={{ display: "flex", justifyContent: "space-between", padding: "16px", }}>
                    <h1 className="title-admins-table">Banner</h1>
                    <button variant="primary" onClick={() => handleShow("addCategory")} className="artist-btn">  Add New Banner</button>
                </div>
                {loading?.list ? <AdminLoader /> :
                    <>
                        <div className="row g-3 my-3 px-3">
                            {
                                bannerList?.map((item, i) => (
                                    <div className="col-md-4">
                                        <div className="banner-box">
                                            <div className="img-box">
                                                <img src={imgBaseURL() + item?.image} alt="" style={{ width: '100%' }} />
                                            </div>
                                            <div >
                                                <div className="bannar-btn-box">
                                                    <button>Active</button>
                                                    <button>Edit</button>
                                                    <button>Del</button>
                                                </div>
                                                <h6 className="bannar-title">{item?.title}</h6>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                }
            </Paper>

            <Modal
                className="modal-all"
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    {
                        formData?.id ?
                            <Modal.Title> {`Update Banner`} </Modal.Title>
                            :
                            <Modal.Title> {`Add New Banner`} </Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body>
                    <Row className="cutoms-login-artist">
                        <Col md={12} className="mb-3">
                            <div class="file-uploader">
                                <label for="logoID" class="global_file_upload_deisgn">
                                    <i class="fa-solid fa-arrow-up-from-bracket"></i>
                                    Upload  image here
                                    <input type="file" id="logoID" name="image" value={formData.name} onChange={handleChange} />
                                </label>
                            </div>
                            {imgPreview.image && (
                                <div className="text-end">  <img src={imgPreview.image} style={{ height: '60px', width: '60px', marginTop: '20px' }} alt="alt" /></div>
                            )}
                        </Col>

                        <Col md={12} className="mb-3">
                            <Form.Group className="mb-3" controlId="formmainTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12} className="mb-3">
                            <Form.Group className="mb-3" controlId="formmainTitle">
                                <Form.Label>Redirect Url</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="redirectUrl"
                                    value={formData.redirectUrl}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                        {/* {
                            listingTab == "subcategory" &&
                            <Col md={12} className="mb-3">
                                <Form.Label>Parent Category</Form.Label>
                                <Form.Select aria-label="Default select example" name="parentCategoryId" value={formData.parentCategoryId} onChange={handleChange}>
                                    <option value="1">Select Parent Category</option>
                                    {categoryList?.map((item, i) => (
                                        <option value={item._id}>{item?.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        } */}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="line-close-btn" variant="secondary" onClick={handleClose}>Close</Button>
                    {
                        loading.submit ?
                            <BTNLoader className={"artist-btn"} /> :
                            <Button className="artist-btn" variant="primary" onClick={() => handleSubmit()}>
                                {formData?.id ? "Update" : "Add"}
                            </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default BannerAndImages;
