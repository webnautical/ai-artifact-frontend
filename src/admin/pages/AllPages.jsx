import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import { Edit } from "@mui/icons-material";
import { useDataContext } from './../../helper/context/ContextProvider';
import { apiBaseURL, filterByKey } from "../../helper/Utility";
import { APICALL } from "../../helper/api/api";
import AdminLoader from './../components/AdminLoader';
import { Link, useNavigate } from "react-router-dom";
import SwitchToggle from "../../components/SwitchToggle";

const AllPages = () => {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [listLoading, setListLoading] = useState(false)
    const { permisionData, getPermision } = useDataContext();
    const permisionCheck = filterByKey("blogs", permisionData?.permissions);
    const [showModal, setShowModal] = useState(false)
    const [newURL, setNewURL] = useState("")
    const [newFormatedURL, setNewFormatedURL] = useState("")
    const [keyword, setKeyword] = useState({
        "msg": "",
        "isError": ""
    })
    useEffect(() => {
        getPermision()
    }, [])
    useEffect(() => {
        if (permisionCheck?.read) {
            getListFun();
        }
    }, [permisionData])

    const getListFun = async () => {
        setListLoading(true)
        try {
            const res = await APICALL("/admin/getNestedPages", 'post', { role: "admin" })
            setListLoading(false)
            if (res?.status) {
                setData(res?.data)
            }
        } catch (error) {
            setListLoading(false)
        }
    }

    const [draggedRowIndex, setDraggedRowIndex] = useState(null);

    const handleDragStart = (index) => {
        setDraggedRowIndex(index);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = async (index) => {
        const updatedData = [...data];
        const [draggedRow] = updatedData.splice(draggedRowIndex, 1);
        updatedData.splice(index, 0, draggedRow);
        setData(updatedData);
        setDraggedRowIndex(null);
        const orderedPages = updatedData.map((row, idx) => ({
            _id: row._id,
            order: idx + 1,
        }));
        const payload = { orderedPages };
        await APICALL("/admin/updatePageOrder", "post", payload)
    };

    const handleStatusChange = async (event, row) => {
        const newStatus = event.target.checked
        setData(prevData =>
            prevData.map(item =>
                item._id === row._id ? { ...item, status: newStatus } : item
            )
        );
        try {
            await APICALL('admin/togglePageStatus', 'post', { id: row._id })
        } catch (error) {
            console.error('API call error:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false)
        setKeyword((prevKeyword) => ({
            ...prevKeyword,
            msg: "",
            isError: false,
        }));
        setNewURL("")
    }
    const handleNext = () => {
        const validPattern = /^[a-zA-Z/_-]+$/;
        const formattedURL = newURL.trim().toLowerCase().replace(/[^a-zA-Z/_-]+/g, "-");
        setNewFormatedURL(formattedURL);
    
        if (newURL.trim() === "") {
            setKeyword((prevKeyword) => ({
                ...prevKeyword,
                msg: "Please enter a page route",
                isError: true,
            }));
            return false;
        }
    
        if (!validPattern.test(formattedURL.trim())) {
            setKeyword((prevKeyword) => ({
                ...prevKeyword,
                msg: "Page route can only contain letters, dashes (-), underscores (_), forward slashes (/), and dots (.)",
                isError: true,
            }));
            setNewFormatedURL("");
            return false;
        }
    
        const isDuplicate = data.some((row) => row.route.toLowerCase() === newURL.trim().toLowerCase());
        if (isDuplicate) {
            setKeyword((prevKeyword) => ({
                ...prevKeyword,
                msg: "Page route already exists",
                isError: true,
            }));
            setNewFormatedURL("");
            return false;
        }
    
        setKeyword((prevKeyword) => ({
            ...prevKeyword,
            msg: "",
            isError: false,
        }));
        navigate(`/admin/pages/${formattedURL}`);
    };
    

    return (
        <>
            {
                <Paper className="table_samepattern">
                    {
                        listLoading ? <AdminLoader /> :
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: '10px 14px 0px 14px' }} >
                                    <h1 className="title-admins-table">All Pages</h1>
                                    <button type="button" className="artist-btn btn-sm" onClick={() => setShowModal(true)}>Add New Page</button>
                                </div>
                                {
                                    data?.length > 0 ?
                                        <>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>S.No</TableCell>
                                                            <TableCell>Page Name</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell align="right">Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {data?.map((row, index) => (
                                                            <TableRow
                                                                key={index}
                                                                draggable
                                                                onDragStart={() => handleDragStart(index)}
                                                                onDragOver={handleDragOver}
                                                                onDrop={() => handleDrop(index)}
                                                                style={{
                                                                    cursor: "grab",
                                                                    backgroundColor: draggedRowIndex === index ? "#f5f5f5" : "white",
                                                                }}
                                                            >
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell><strong>{row?.name}</strong> {row?.parentId && <span style={{ fontSize: '13px', color: "red" }}>(Child of {row?.parentId?.name})</span>}</TableCell>
                                                                <TableCell>
                                                                    <SwitchToggle checked={row?.status}
                                                                        onChange={(event) => handleStatusChange(event, row)}
                                                                    />
                                                                </TableCell>
                                                                <TableCell style={{ width: 160 }} align="right">
                                                                    <Link to={`/admin/pages/${row?.route}`}><Edit style={{ marginRight: "8px", color: "#008080", fontSize: "20px" }} variant="link" /></Link>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </>
                                        :
                                        <div className="col-12 text-center px-2 mt-3">
                                            <div class="alert alert-success text-capitalize" role="alert">
                                                there are no data to display
                                            </div>
                                        </div>
                                }
                            </>
                    }
                </Paper>
            }
            <Modal
                show={showModal}
                onHide={(handleCloseModal)}
                centered
                className="modal-all"
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="cutoms-login-artist">
                        <Form.Group controlId="formRoleName" className="mb-3">
                            <Form.Label>Page Route*</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter page route"
                                name="name"
                                value={newURL}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const formattedURL = inputValue.trim().toLowerCase().replace(/[^a-zA-Z_-]+/g, "-");
                                    setNewURL(inputValue);
                                    setNewFormatedURL(formattedURL);
                                    setKeyword((prevKeyword) => ({
                                        ...prevKeyword,
                                        msg: "",
                                        isError: false,
                                    }));
                                }}
                            />
                            <p type="invalid" className="text-danger mt-2">{keyword?.msg}</p>
                            {
                                newFormatedURL &&
                                <p>Your page route will look like: {apiBaseURL()}/{newFormatedURL}</p>
                            }
                        </Form.Group>
                    </Form>
                    <Row className="mt-3">
                        <Col><Button className="line-close-btn w-100" onClick={handleCloseModal} > Close </Button></Col>
                        <Col><Button className="artist-btn  w-100 " type="button" onClick={() => handleNext()}>Next</Button></Col>
                    </Row>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default AllPages;