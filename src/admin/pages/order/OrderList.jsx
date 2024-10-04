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
import { timeAgo, tableImg, imgBaseURL, toastifySuccess } from "../../../helper/Utility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SwitchToggle from "../../../components/SwitchToggle";
import Pagination from "react-bootstrap/Pagination";
import {
    TABLE_PAGINATION_DROPDOWN,
    TABLE_ROW_PER_PAGE,
} from "../../../helper/Constant";
import "../../../App.css";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const OrderList = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [data, setData] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState({
        'refund': false
    })

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

    const handleRefund = async () => {
        setLoading({ ...loading, 'refund': true })
        try {
            const params = { orderId: selectedRow._id };
            const res = await APICALL("admin/markOrderAsRefunded", "post", params);
            if (res?.status) {
                setSelectedRow(null)
                getListFun(pageNo, rowsPerPage);
                toastifySuccess(res?.message)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading({ ...loading, 'refund': false })
        }
    }

    console.log("selectedRow", selectedRow)

    const calculateProfit = (TotalPrice, geletoPrice, artistCommision,affiliateCommission, qnt) =>{
        const profit = (TotalPrice * qnt) - (geletoPrice * qnt) - affiliateCommission - artistCommision
        return profit.toFixed(2)
    }

    return (
        <>
            {selectedRow ? (
                <Paper className=" p-3">
                    <div className="row-details">
                        <div className="d-flex mb-4 justify-content-between align-items-center" style={{ gap: "10px" }}>
                            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                                <Button className="artist-btn" onClick={() => setSelectedRow(null)}  >
                                    <i class="fa-solid fa-arrow-left"></i>
                                </Button>
                                <h2 className="title-admins-table m-0">Orders</h2>
                            </div>
                            {
                                loading?.refund ?
                                    <BTNLoader className="artist-btn" />
                                    :
                                    <>
                                        {
                                            selectedRow?.status === "refunded" ?
                                                <><p className="text-uppercase text-danger"><b>{selectedRow?.status}</b></p></>
                                                :
                                                <button className="artist-btn" onClick={() => handleRefund()}>Mark as Refund</button>
                                        }
                                    </>

                            }
                        </div>
                        <Row className=" justify-content-center">
                            <Col md={9}>
                                <Row className="">
                                    <Col md={12} clas>
                                        <h5><strong>Items details</strong></h5>
                                        <div className="table_border mb-3">
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>S.No</TableCell>
                                                            <TableCell>Image</TableCell>
                                                            <TableCell>Product</TableCell>
                                                            <TableCell>Price</TableCell>
                                                            <TableCell>QNT</TableCell>
                                                            <TableCell>Total Price</TableCell>
                                                            <TableCell>Total Geleto Cost</TableCell>
                                                            <TableCell>Artist</TableCell>
                                                            <TableCell>Artist Commission</TableCell>
                                                            <TableCell>Affiliate</TableCell>
                                                            <TableCell>Affilieate Commission</TableCell>
                                                            <TableCell align="right">profit</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {selectedRow?.orderItems?.map((row, index) => (
                                                            <TableRow key={index} >
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell onClick={() => navigate(`/admin/product-details/${row.productId?._id}`)} style={{ cursor: 'pointer' }}>
                                                                    {tableImg(row.productId?.thumbnail)}
                                                                </TableCell>
                                                                <TableCell onClick={() => navigate(`/admin/product-details/${row.productId?._id}`)} style={{ cursor: 'pointer' }}>
                                                                    <strong>{row.productId?.title}</strong>
                                                                    <p className="my-0">{row?.quality}</p>
                                                                    <p className="my-0">{row?.frame}</p>
                                                                    <p className="my-0">{row?.size}</p>
                                                                    <p className="my-0">{row?.frameType}</p>
                                                                </TableCell>
                                                                <TableCell>${row.price}</TableCell>
                                                                <TableCell>{row.quantity}</TableCell>
                                                                <TableCell>${row.price * row?.quantity}</TableCell>
                                                                <TableCell>${row.gelatoPrice.toFixed(2)}</TableCell>

                                                                <TableCell><Link to={`/admin/user-management-details/${row?.artistId?._id}`}>{ row?.artistId?.first_name + " " + row?.artistId?.last_name || "---"}</Link></TableCell>

                                                                <TableCell>${row.artistCommission?.toFixed(2)}</TableCell>

                                                                <TableCell> {row?.affiliateId?.first_name ?<Link to={`/admin/user-management-details/${row?.affiliateId?._id}`}>{ row?.affiliateId?.first_name +" " +row?.affiliateId?.last_name}</Link> : "---"}</TableCell>

                                                                <TableCell>{row?.price ? `$${row?.affiliateCommission?.toFixed(2)}` : "---"}</TableCell>
                                                                <TableCell align="right">${calculateProfit(row.price, row.gelatoPrice, row.artistCommission, row?.affiliateCommission, row.quantity)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>

                                        </div>
                                        <div>
                                            <div className="mt-3">
                                                <h5><strong>Billing details</strong></h5>
                                                <div className="table_border mb-3">

                                                    <p>
                                                        {" "}
                                                        <strong>Billing Name:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.firstName +
                                                            " " +
                                                            selectedRow?.shippingAddress?.lastName}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>Contact:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.contactPhone}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>Email:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.email}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>State:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.state}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>City:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.city}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>Postal Code:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.postalCode}
                                                    </p>
                                                </div>
                                            </div>

                                            <Col md={12} className="mb-3 mt-2">

                                                <h5><strong>Shipping details</strong></h5>
                                                <div className="table_border">

                                                    <p>
                                                        {" "}
                                                        <strong>Shipping Name:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.firstName +
                                                            " " +
                                                            selectedRow?.shippingAddress?.lastName}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>Contact:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.contactPhone}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>Email:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.email}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>State:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.state}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>City:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.city}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>Postal Code:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.postalCode}
                                                    </p>
                                                    <p>
                                                        {" "}
                                                        <strong>Addresses:</strong>{" "}
                                                        {selectedRow?.shippingAddress?.addressLine1} -{" "}
                                                        {selectedRow?.shippingAddress?.addressLine2}
                                                    </p>
                                                </div>
                                            </Col>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                            <Col md={3}>
                                <Row>
                                    <Col md={12} className="mb-3">

                                        <h5><strong>Order details</strong></h5>
                                        <div className="table_border">
                                            <div>
                                                <p>
                                                    {" "}
                                                    <strong>Order ID:</strong> #{selectedRow._id}{" "}
                                                </p>
                                                <p>
                                                    <strong>Customer Name:</strong>{" "}
                                                    <Link to={`/admin/user-management-details/${selectedRow.userId?._id}`} className="text-bold">
                                                        {selectedRow?.shippingAddress?.firstName +
                                                            " " +
                                                            selectedRow?.shippingAddress?.lastName}
                                                    </Link>
                                                </p>
                                                <p>
                                                    {" "}
                                                    <strong>Payment Method:</strong>{" "}
                                                    {selectedRow.paymentGateway}{" "}
                                                </p>
                                                {/* <p><strong>Status:</strong> {selectedRow.status}</p> */}
                                                <p>
                                                    <strong>Order Date:</strong>{" "}
                                                    {timeAgo(selectedRow.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md={12}>
                                        <h5><strong>Order Amount details</strong></h5>
                                        <div className="table_border">


                                            <p>
                                                {" "}
                                                <strong>Item:</strong>{" "}
                                                {selectedRow?.orderItems?.length}
                                            </p>
                                            <p>
                                                {" "}
                                                <strong>Subtotal:</strong> ${parseInt(itemTotal)}
                                            </p>
                                            <p>
                                                {" "}
                                                <strong>Shipping:</strong> $
                                                {selectedRow?.shippingCharge}
                                            </p>
                                            <p>
                                                {" "}
                                                <strong>Discount:</strong>{" "}
                                                {selectedRow?.couponAmount
                                                    ? `-$${selectedRow?.couponAmount}`
                                                    : "---"}
                                            </p>
                                            <p>
                                                {" "}
                                                <strong>Total:</strong> ${selectedRow?.totalPrice}
                                            </p>
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
                                                    <TableCell>Order Status</TableCell>
                                                    <TableCell>Gelato Status</TableCell>
                                                    <TableCell> Date </TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data?.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{row._id}</TableCell>
                                                        <TableCell>
                                                            {row.shippingAddress?.firstName +
                                                                " " +
                                                                row?.shippingAddress?.lastName}
                                                        </TableCell>
                                                        <TableCell>{row.totalPrice}</TableCell>
                                                        <TableCell className="text-capitalize">{row.status}</TableCell>
                                                        <TableCell>
                                                            <Button className={`btn btn-sm ${row?.gelatoStatus ? 'btn-success' : 'btn-warning'}`} >
                                                                {row?.gelatoStatus ? "Success" : "Pending"}
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell>{timeAgo(row.createdAt)}</TableCell>
                                                        <TableCell align="right">
                                                            <Dropdown className="dorpdown-curtom">
                                                                <Dropdown.Toggle as={IconButton} variant="link">
                                                                    {" "}
                                                                    <MoreVert />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item
                                                                        href="#"
                                                                        onClick={() =>
                                                                            handleViewChange(row, "view")
                                                                        }
                                                                    >
                                                                        <RemoveRedEyeIcon
                                                                            style={{ marginRight: "8px" }}
                                                                        />{" "}
                                                                        View
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

export default OrderList;