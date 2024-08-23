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
import { timeAgo, tableImg, imgBaseURL } from "../../../helper/Utility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SwitchToggle from "../../../components/SwitchToggle";
import Pagination from "react-bootstrap/Pagination";
import {
    TABLE_PAGINATION_DROPDOWN,
    TABLE_ROW_PER_PAGE,
} from "../../../helper/Constant";
import "../../../App.css";

const OrderList = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [data, setData] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getListFun(pageNo, rowsPerPage);
    }, [pageNo, rowsPerPage]);

    const getListFun = async (pageNo, rowsPerPage) => {
        setListLoading(true);
        try {
            const params = { page: pageNo, limit: rowsPerPage };
            const res = await APICALL("admin/allOrders", "post", params);
            if (res?.status) {
                setData(res.data);
                setTotalPages(res.totalCount);
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


    const itemTotal = selectedRow?.orderItems?.reduce((acc, item) => {
        return acc + (item?.price * item?.quantity || 0);
    }, 0);
    return (
        <>
            {selectedRow ? (
                <Paper className="table_samepattern p-3">
                    <div className="row-details">
                        <div className="d-flex" style={{ gap: '10px' }}>
                            <Button className="artist-btn" onClick={() => setSelectedRow(null)}>
                                <i class="fa-solid fa-arrow-left"></i>
                            </Button>
                            <h2 className="title-admins-table m-0">Orders</h2>
                        </div>
                        <Row className=" justify-content-center">
                            <Col md={7}>
                                <Row className="art_details_box">
                                    {/* <Col md={4}>
                                        <div className="art_work_image">
                                            {tableImg(selectedRow.image)}
                                        </div>
                                    </Col> */}
                                    <Col md={12}>
                                        <div>
                                            <p> <strong>Order ID:</strong> #{selectedRow._id} </p>
                                            <p> <strong>Customer Name:</strong> {selectedRow?.shippingAddress?.firstName + " " + selectedRow?.shippingAddress?.lastName}</p>
                                            <p> <strong>Payment Method:</strong> {selectedRow.paymentGateway} </p>
                                            {/* <p><strong>Status:</strong> {selectedRow.status}</p> */}
                                            <p><strong>Order Date:</strong> {timeAgo(selectedRow.createdAt)}</p>

                                            <div>
                                                <hr />
                                                <strong>Order Summary:</strong>
                                                <hr />
                                                <p> <strong>Item:</strong> {selectedRow?.orderItems?.length}</p>
                                                <p> <strong>Subtotal:</strong> ${parseInt(itemTotal)}</p>
                                                <p> <strong>Shipping:</strong> ${selectedRow?.shippingCharge}</p>
                                                <p> <strong>Discount:</strong> {selectedRow?.couponAmount ? `-$${selectedRow?.couponAmount}` : "---"}</p>
                                                <p> <strong>Total:</strong> ${selectedRow?.totalPrice}</p>
                                            </div>

                                            <div>
                                                <hr />
                                                <strong>Shipping Address:</strong>
                                                <hr />
                                                <p> <strong>Shipping Name:</strong> {selectedRow?.shippingAddress?.firstName + " " + selectedRow?.shippingAddress?.lastName}</p>
                                                <p> <strong>Contact:</strong> {selectedRow?.shippingAddress?.contactPhone}</p>
                                                <p> <strong>Email:</strong> {selectedRow?.shippingAddress?.email}</p>
                                                <p> <strong>State:</strong> {selectedRow?.shippingAddress?.state}</p>
                                                <p> <strong>City:</strong> {selectedRow?.shippingAddress?.city}</p>
                                                <p> <strong>Postal Code:</strong> {selectedRow?.shippingAddress?.postalCode}</p>
                                                <p> <strong>Addresses:</strong> {selectedRow?.shippingAddress?.addressLine1} - {selectedRow?.shippingAddress?.addressLine2}</p>
                                            </div>

                                            <div>
                                                <hr />
                                                <strong>Billing Address:</strong>
                                                <hr />
                                                <p> <strong>Billing Name:</strong> {selectedRow?.shippingAddress?.firstName + " " + selectedRow?.shippingAddress?.lastName}</p>
                                                <p> <strong>Contact:</strong> {selectedRow?.shippingAddress?.contactPhone}</p>
                                                <p> <strong>Email:</strong> {selectedRow?.shippingAddress?.email}</p>
                                                <p> <strong>State:</strong> {selectedRow?.shippingAddress?.state}</p>
                                                <p> <strong>City:</strong> {selectedRow?.shippingAddress?.city}</p>
                                                <p> <strong>Postal Code:</strong> {selectedRow?.shippingAddress?.postalCode}</p>
                                            </div>

                                            <div>
                                                <hr />
                                                <strong>Products:</strong>
                                                <hr />
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>S.No</TableCell>
                                                                <TableCell>Image</TableCell>
                                                                <TableCell>Product Name</TableCell>
                                                                <TableCell>Price</TableCell>
                                                                <TableCell align="right">QNT</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {selectedRow?.orderItems?.map((row, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{tableImg(row.productId?.thumbnail)}</TableCell>
                                                                    <TableCell>{row.productId?.title}</TableCell>
                                                                    <TableCell>{row.price}</TableCell>
                                                                    <TableCell>{row.quantity}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        </div>
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
                                <h1 className="title-admins-table">Orders</h1>
                                {/* <TextField
                                    variant="outlined"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={handleSearchChange}
                                    style={{ width: "300px" }}
                                /> */}
                            </div>

                            {data.length > 0 ? (
                                <>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>S.No</TableCell>
                                                    <TableCell>Order ID</TableCell>
                                                    <TableCell>Customer Name</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell> Date </TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data?.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{row._id}</TableCell>
                                                            <TableCell>{row.shippingAddress?.firstName + " " + row?.shippingAddress?.lastName}</TableCell>
                                                            <TableCell>{row.totalPrice}</TableCell>
                                                            {/* <TableCell>{row.status}</TableCell> */}
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

                                    {/* <div className="pagination_box">
                                        <Pagination className="justify-content-center" style={{ gap: "20px" }}>
                                            <Pagination.Prev onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} />
                                            {[...Array(totalPages)].map((_, i) => (
                                                <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                                                    {i + 1}
                                                </Pagination.Item>
                                            ))}
                                            <Pagination.Next onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} />
                                        </Pagination>
                                    </div> */}

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

export default OrderList;
