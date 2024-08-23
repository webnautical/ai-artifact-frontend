import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    TablePagination,
    TableSortLabel,
    IconButton,
    Paper,
} from "@mui/material";
import { Edit, MoreVert } from "@mui/icons-material";
import swal from "sweetalert";
import { Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import AdminLoader from "../../components/AdminLoader";
import BTNLoader from "../../../components/BTNLoader";
import { APICALL } from "../../../helper/api/api";
import { timeAgo, tableImg, imgBaseURL, auth } from "../../../helper/Utility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
    TABLE_PAGINATION_DROPDOWN,
    TABLE_ROW_PER_PAGE,
} from "../../../helper/Constant";
import "../../../App.css";
import { useParams } from "react-router-dom";

const Commission = () => {
    const { role } = useParams()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [data, setData] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getListFun(pageNo, role, rowsPerPage);
    }, [pageNo, role, rowsPerPage]);

    const getListFun = async (pageNo, role,rowsPerPage) => {
        setListLoading(true);
        try {
            const exParams = auth('admin')?.user_role === 'admin' ? { role: role } : { userId: auth('admin')?.id }
            const params = { page: pageNo, ...exParams, limit: rowsPerPage };
            const res = await APICALL("admin/comissionHistory", "post", params);
            if (res?.status) {
                console.log("comissionHistory", res)
                setTotalPages(res.totalCount);
                setData(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setListLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };


    const handleViewChange = (row) => {
        setSelectedRow(row);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage); 
        setPageNo(newPage + 1); 
    };

    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageNo(0); 
    };
    return (
        <>
            {selectedRow ? (
                <Paper className="table_samepattern p-3">
                    <div className="row-details">
                        <div className="d-flex" style={{ gap: '10px' }}>
                            <Button className="artist-btn" onClick={() => setSelectedRow(null)}>
                                <i class="fa-solid fa-arrow-left"></i>
                            </Button>
                            <h2 className="title-admins-table m-0">Commission Details</h2>
                        </div>
                        <Row className=" justify-content-center">
                            <Col md={7}>

                                <Row className="art_details_box">
                                    <Col md={8}>
                                        <div>
                                            <h5>Order Details:</h5>
                                            <hr />
                                            <p> <strong>Order ID:</strong> #{selectedRow.orderItemId?.orderId} </p>
                                            <p> <strong>Commission(%):</strong> {selectedRow.commissionPercentage} </p>
                                            <p><strong>Commission Amount:</strong> ${selectedRow.commissionAmount}</p>
                                            <p><strong>Date:</strong> {timeAgo(selectedRow.createdAt)}</p>

                                            <div className="my-5">
                                                <h5>Product Details:</h5>
                                                <hr />
                                                <p> <strong>Product Title:</strong> {selectedRow.orderItemId?.productId?.title}</p>
                                                <p> <strong>Product Description:</strong> {selectedRow.orderItemId?.productId?.description}</p>
                                            </div>

                                            <div>
                                                <h5>Customer Details:</h5>
                                                <hr />
                                                <p> <strong>Customer Name:</strong> {selectedRow?.userId?.first_name + " " + selectedRow?.userId?.last_name}</p>
                                                <p> <strong>Customer Email:</strong> {selectedRow?.userId?.email}</p>
                                            </div>

                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <img src={imgBaseURL() + selectedRow.orderItemId?.productId?.thumbnail} style={{ width: '100%' }} alt="" />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </div>
                </Paper>
            ) : (
                <Paper className="table_samepattern">
                    {listLoading ? (
                        <AdminLoader />
                    ) : (
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "10px",
                                }}
                            >
                                <h1 className="title-admins-table">Commission</h1>
                                <TextField
                                    variant="outlined"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={handleSearchChange}
                                    style={{ width: "300px" }}
                                />
                            </div>

                            {data.length > 0 ? (
                                <>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>S.No</TableCell>
                                                    <TableCell>Order ID</TableCell>
                                                    <TableCell>Commission Percentage</TableCell>
                                                    <TableCell>Commission Amount</TableCell>
                                                    <TableCell>Date </TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{row.orderItemId?.orderId}</TableCell>
                                                            <TableCell>{row.commissionPercentage}</TableCell>
                                                            <TableCell>{row.commissionAmount}</TableCell>
                                                            <TableCell>{timeAgo(row.createdAt)}</TableCell>
                                                            <TableCell align="right">
                                                                <Dropdown className="dorpdown-curtom">
                                                                    <Dropdown.Toggle as={IconButton} variant="link" > <MoreVert /></Dropdown.Toggle>
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item href="#" onClick={() => handleViewChange(row, "view")}>
                                                                            <RemoveRedEyeIcon style={{ marginRight: "8px" }} /> View
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <TablePagination
                                        rowsPerPageOptions={TABLE_PAGINATION_DROPDOWN}
                                        component="div"
                                        count={totalPages}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </>
                            ) : (
                                <div className="col-12 text-center px-2 mt-3">
                                    <div
                                        className="alert alert-success text-capitalize"
                                        role="alert"
                                    >
                                        There are no data to display
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </Paper>
            )}
        </>
    );
};

export default Commission;
