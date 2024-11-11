import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    TableFooter,
    Button,
    TablePagination,
    TableSortLabel,
    IconButton,
    Paper,
    Autocomplete,
    Box,
} from "@mui/material";
import { Edit, MoreVert } from "@mui/icons-material";
import swal from "sweetalert";
import { Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import AdminLoader from "../../components/AdminLoader";
import BTNLoader from "../../../components/BTNLoader";
import { APICALL } from "../../../helper/api/api";
import {
    timeAgo,
    tableImg,
    imgBaseURL,
    toastifySuccess,
} from "../../../helper/Utility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SwitchToggle from "../../../components/SwitchToggle";
import Pagination from "react-bootstrap/Pagination";
import {
    TABLE_PAGINATION_DROPDOWN,
    TABLE_ROW_PER_PAGE,
} from "../../../helper/Constant";
import "../../../App.css";
import { useNavigate, useLocation } from "react-router";
import { Link } from "react-router-dom";

const OrderList = () => {
    const navigate = useNavigate();
    const locationData = useLocation()
    const orderDetails = locationData?.state ? locationData?.state?.orderDetails : null
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [data, setData] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);

    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState({
        refund: false,
    });
    const [searchParams, setSearchParams] = useState({
        'order_id': "",
        'customer_id': "",
        'artist_id': "",
    })
    useEffect(() => {
        getListFun(pageNo, rowsPerPage, searchParams);
    }, [pageNo, rowsPerPage]);

    useEffect(() => {
        if (orderDetails) {
            setSelectedRow(orderDetails)
        }
    }, [orderDetails])


    const getListFun = async (pageNo, rowsPerPage, searchParams) => {
        setListLoading(true);
        try {
            const params = { page: pageNo, limit: rowsPerPage, ...searchParams };
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

    const [itemQnt, setItemQnt] = useState(1)
    const handleRefund = async (itemID) => {
        setLoading({ ...loading, refund: true });
        try {
            const params = { orderItemId: itemID, quantity: itemQnt };
            const res = await APICALL("admin/refundByAdmin", "post", params);
            if (res?.status) {
                setSelectedRow(null);
                getListFun(pageNo, rowsPerPage);
                toastifySuccess(res?.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading({ ...loading, refund: false });
        }
    };


    const calculateProfit = (
        TotalPrice,
        geletoPrice,
        artistCommision,
        affiliateCommission,
        qnt,
        status
    ) => {
        const profit = status === "refunded" ? 0 :  (TotalPrice * qnt) - (geletoPrice + affiliateCommission + artistCommision);
        return parseFloat(profit);
    };

    useEffect(() => {
        getCustomerList()
        getArtistList()
    }, [])

    const [customerList, setCustomerList] = useState([])
    const [artistList, setArtistList] = useState([])

    const getCustomerList = async () => {
        try {
            const res = await APICALL("admin/allUsers", "post", { role: "customer" });
            if (res?.status) { setCustomerList(res?.Users); }
        } catch (error) {
            console.log(error);
        }
    };
    const getArtistList = async () => {
        try {
            const res = await APICALL("admin/allUsers", "post", { role: "artist" });
            if (res?.status) { setArtistList(res?.Users); }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = () => {
        getListFun(pageNo, rowsPerPage, searchParams)
    };

    return (
        <>
            {selectedRow ? (
                <Paper className=" p-3">
                    <div className="row-details">
                        <div
                            className="d-flex mb-4 justify-content-between align-items-center"
                            style={{ gap: "10px" }}
                        >
                            <div
                                className="d-flex align-items-center"
                                style={{ gap: "10px" }}
                            >
                                <Button
                                    className="artist-btn"
                                    onClick={() => setSelectedRow(null)}
                                >
                                    <i class="fa-solid fa-arrow-left"></i>
                                </Button>
                                <h2 className="title-admins-table m-0">Orders</h2>
                            </div>
                            {/* {loading?.refund ? (
                                <BTNLoader className="artist-btn" />
                            ) : (
                                <>
                                    {selectedRow?.status === "refunded" ? (
                                        <>
                                            <p className="text-uppercase text-danger">
                                                <b>{selectedRow?.status}</b>
                                            </p>
                                        </>
                                    ) : (
                                        <button
                                            className="artist-btn"
                                            onClick={() => handleRefund()}
                                        >
                                            Mark as Refund
                                        </button>
                                    )}
                                </>
                            )} */}
                        </div>
                        <Row className=" justify-content-center">
                            <Col md={12}>
                                <Row className="">
                                    <Col md={12} clas>
                                        <h5>
                                            <strong>Items details</strong>
                                        </h5>
                                        <div className="table_border mb-5">
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
                                                            <TableCell>Affiliate Commission</TableCell>
                                                            <TableCell>Profit</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell align="right">Refund</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {selectedRow?.orderItems?.map((row, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/admin/product-details/${row.productId?._id}`
                                                                        )
                                                                    }
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    {tableImg(row.productId?.thumbnail)}
                                                                </TableCell>
                                                                <TableCell
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/admin/product-details/${row.productId?._id}`
                                                                        )
                                                                    }
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <strong>{row.productId?.title}</strong>
                                                                    <p className="my-0">{row?.quality}</p>
                                                                    <p className="my-0">{row?.frame}</p>
                                                                    <p className="my-0">{row?.size}</p>
                                                                    <p className="my-0">{row?.frameType}</p>
                                                                </TableCell>
                                                                <TableCell>${row.price}</TableCell>
                                                                <TableCell>{row.quantity}</TableCell>
                                                                <TableCell>
                                                                    ${row.price * row?.quantity}
                                                                </TableCell>
                                                                <TableCell>
                                                                    ${row?.gelatoPrice?.toFixed(2)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Link
                                                                        to={`/admin/user-management-details/${row?.artistId?._id}`}
                                                                    >
                                                                        {row?.artistId?.first_name +
                                                                            " " +
                                                                            row?.artistId?.last_name || "---"}
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell>
                                                                    ${row.artistCommission?.toFixed(2)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {row?.affiliateId?.first_name ? (
                                                                        <Link
                                                                            to={`/admin/user-management-details/${row?.affiliateId?._id}`}
                                                                        >
                                                                            {row?.affiliateId?.first_name +
                                                                                " " +
                                                                                row?.affiliateId?.last_name}
                                                                        </Link>
                                                                    ) : (
                                                                        "---"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {row?.price
                                                                        ? `$${row?.affiliateCommission?.toFixed(2)}`
                                                                        : "---"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    $
                                                                    {calculateProfit(
                                                                        row.price,
                                                                        row.gelatoPrice,
                                                                        row.artistCommission,
                                                                        row?.affiliateCommission,
                                                                        row.quantity,
                                                                        row?.refundStatus
                                                                    ).toFixed(2)}
                                                                </TableCell>
                                                                <TableCell className="text-capitalize">{row?.refundStatus}</TableCell>
                                                                <TableCell>
                                                                    <div className="d-flex gap-2">
                                                                        <select name="" onChange={(e) => setItemQnt(e.target.value)}>
                                                                            {Array.from({ length: row?.quantity - row?.refundedQuantity }, (_, index) => (
                                                                                <option key={index + 1} value={index + 1}>
                                                                                    {index + 1}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        {
                                                                            row?.refundStatus === "refunded" ?
                                                                                <button className="btn btn-danger btn-sm" disabled>Refund</button>
                                                                                :
                                                                                <button onClick={() => handleRefund(row?._id)} className="btn btn-danger btn-sm">Refund</button>
                                                                        }
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>

                                                    <TableFooter>
                                                        <TableRow>
                                                            <TableCell colSpan={2}>&nbsp;</TableCell>{" "}
                                                            {/* Empty row */}
                                                            <TableCell colSpan={2}>
                                                                <span style={{ color: 'black', fontWeight: 'bold' }}> Total</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                {selectedRow?.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                                                            </TableCell>

                                                            <TableCell> ${parseInt(itemTotal)}</TableCell>
                                                            <TableCell>
                                                                {" "}
                                                                $
                                                                {selectedRow?.orderItems
                                                                    ?.reduce((total, row) => {
                                                                        return total + (row.gelatoPrice || 0);
                                                                    }, 0)
                                                                    .toFixed(2)}
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell>
                                                                $
                                                                {selectedRow?.orderItems
                                                                    ?.reduce((total, row) => {
                                                                        return total + (row.artistCommission || 0);
                                                                    }, 0)
                                                                    .toFixed(2)}
                                                            </TableCell>
                                                            <TableCell>--</TableCell>
                                                            <TableCell>
                                                                {" "}
                                                                $
                                                                {selectedRow?.orderItems
                                                                    ?.reduce((total, row) => {
                                                                        return (
                                                                            total + (row.affiliateCommission || 0)
                                                                        );
                                                                    }, 0)
                                                                    .toFixed(2)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {" "}
                                                                $
                                                                {selectedRow?.orderItems
                                                                    ?.reduce((total, row) => {
                                                                        return (
                                                                            parseFloat(total) +
                                                                            calculateProfit(
                                                                                row.price,
                                                                                row.gelatoPrice,
                                                                                row.artistCommission,
                                                                                row.affiliateCommission,
                                                                                row.quantity,
                                                                                row?.refundStatus
                                                                            )
                                                                        );
                                                                    }, 0).toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell colSpan={2}></TableCell>
                                                            <TableCell colSpan={3}>    <span style={{ color: 'black', fontWeight: 'bold' }}>Shipping</span></TableCell>

                                                            <TableCell colSpan={7}>$
                                                                {selectedRow?.shippingCharge}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell colSpan={2}></TableCell>
                                                            <TableCell colSpan={3}>    <span style={{ color: 'black', fontWeight: 'bold' }}>Discount</span></TableCell>

                                                            <TableCell colSpan={7}>   {selectedRow?.couponAmount
                                                                ? `-$${selectedRow?.couponAmount}`
                                                                : "---"}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell colSpan={2}></TableCell>
                                                            <TableCell colSpan={3}>  <span style={{ color: 'black', fontWeight: 'bold' }}>Order Total</span></TableCell>

                                                            <TableCell colSpan={7}>  <span style={{ color: 'black', fontWeight: 'bold' }}> ${selectedRow?.totalPrice}</span></TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                            </TableContainer>
                                        </div>
                                        {selectedRow?.refundedItems.length !== 0 &&
                                            <>
                                                <h5>
                                                    <strong>Refund History</strong>
                                                </h5>
                                                <div className="table_border mb-5">
                                                    <TableContainer>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>S.No</TableCell>
                                                                    <TableCell>Product</TableCell>
                                                                    <TableCell>Artist</TableCell>
                                                                    <TableCell>Artist Cancelled Commission</TableCell>
                                                                    <TableCell>Affiliate Name</TableCell>
                                                                    <TableCell>Affiliate Cancelled Commission</TableCell>
                                                                    <TableCell>Total Quantity</TableCell>
                                                                    <TableCell>Refunded Quantity</TableCell>
                                                                    <TableCell>Date</TableCell>
                                                                    <TableCell>Status</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {selectedRow?.refundedItems?.map((item, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell>{item?.productName}</TableCell>
                                                                        <TableCell>{item?.artistName}</TableCell>
                                                                        <TableCell>${item?.artistCancelledAmount.toFixed(2)}</TableCell>
                                                                        <TableCell>{item?.affiliateName}</TableCell>
                                                                        <TableCell>${item?.affiliateCancelledAmount.toFixed(2)}</TableCell>
                                                                        <TableCell>{item?.totalQuantity}</TableCell>
                                                                        <TableCell>{item?.refundedQuantity}</TableCell>
                                                                        <TableCell>{timeAgo(item?.updatedAt)}</TableCell>
                                                                        <TableCell className="text-capitalize">{item?.status}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </div>
                                            </>
                                        }
                                        <Row>
                                            <div className="col-md-4">
                                                <div className="mt-3">
                                                    <h5>
                                                        <strong>Billing details</strong>
                                                    </h5>
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


                                            </div>

                                            <Col md={4} className="mb-3 mt-2">
                                                <h5>
                                                    <strong>Shipping details</strong>
                                                </h5>
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

                                            <Col md={4} className="mb-3">
                                                <h5>
                                                    <strong>Order details</strong>
                                                </h5>
                                                <div className="table_border">
                                                    <div>
                                                        <p>
                                                            {" "}
                                                            <strong>Order ID:</strong> #{selectedRow._id}{" "}
                                                        </p>
                                                        <p>
                                                            <strong>Customer Name:</strong>{" "}
                                                            <Link
                                                                to={`/admin/user-management-details/${selectedRow.userId?._id}`}
                                                                className="text-bold"
                                                            >
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
                                        </Row>
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
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", }}>
                                <h1 className="title-admins-table">Orders</h1>
                            </div>
                            <div className="row px-3 cutoms-login-artist  ship_address  ">
                                <div className="col-md-4">
                                    <Form.Label>Select Customer</Form.Label>
                                    <input type="text" className="form-control" name="order_id" value={searchParams?.order_id} onChange={(e) => setSearchParams((prevValue) => ({ ...prevValue, order_id: e.target.value }))} />
                                </div>

                                <div className="col-md-4">
                                    <Form.Label>Select Customer</Form.Label>
                                    <Autocomplete
                                        options={customerList}
                                        autoComplete="off"
                                        getOptionLabel={(option) => option.first_name + " " + option.last_name}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props}>
                                                {option.first_name + " " + option.last_name}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField {...params} variant="outlined" />
                                        )}
                                        value={customerList.find((option) => option._id === searchParams.customer_id) || null}
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                const customerId = newValue._id;
                                                setSearchParams((prevValue) => ({ ...prevValue, customer_id: customerId }));
                                            } else {
                                                setSearchParams((prevValue) => ({ ...prevValue, customer_id: '' }));
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <Form.Label>Select Artist</Form.Label>
                                    <Autocomplete
                                        options={artistList}
                                        autoComplete="off"
                                        getOptionLabel={(option) => option.first_name + " " + option.last_name}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props}>
                                                {option.first_name + " " + option.last_name}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField {...params} variant="outlined" />
                                        )}
                                        value={artistList.find((option) => option._id === searchParams.artist_id) || null}
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                const customerId = newValue._id;
                                                setSearchParams((prevValue) => ({ ...prevValue, artist_id: customerId }));
                                            } else {
                                                setSearchParams((prevValue) => ({ ...prevValue, artist_id: '' }));
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-md-12 text-end mt-2">
                                    <button className="global_btn" onClick={() => handleSearch()}>Search</button>
                                </div>

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
                                                        <TableCell className="text-capitalize">
                                                            {row.status}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                className={`btn btn-sm ${row?.gelatoStatus
                                                                    ? "btn-success"
                                                                    : "btn-warning"
                                                                    }`}
                                                            >
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