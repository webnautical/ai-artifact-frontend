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
import { MoreVert } from "@mui/icons-material";
import { Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import AdminLoader from "../../components/AdminLoader";
import { APICALL } from "../../../helper/api/api";
import { timeAgo, tableImg, imgBaseURL } from "../../../helper/Utility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Pagination from "react-bootstrap/Pagination";
import {
  TABLE_PAGINATION_DROPDOWN,
  TABLE_ROW_PER_PAGE,
} from "../../../helper/Constant";
import "../../../App.css";

const TransactionList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  useEffect(() => {
    getListFun();
  }, []);

  const getListFun = async () => {
    setLoading(true);
    try {
      const res = await APICALL("admin/transactionHistory", "post", {});
      if (res?.status) {
        console.log("transactionHistory", res);
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (row) => {
    setSelectedRow(row);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderDetails = (data) => {
    if (typeof data === "object" && data !== null) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}: </strong>
              {Array.isArray(value) ? (
                <ul>
                  {value.map((item, index) => (
                    <li key={index}>{renderDetails(item)}</li>
                  ))}
                </ul>
              ) : (
                renderDetails(value)
              )}
            </li>
          ))}
        </ul>
      );
    }
    return data;
  };
  return (
    <>
      {selectedRow ? (
        <Paper className="table_samepattern p-3">
          <div className="row-details">
            <div className="d-flex" style={{ gap: "10px" }}>
              <Button
                className="artist-btn"
                onClick={() => setSelectedRow(null)}
              >
                <i class="fa-solid fa-arrow-left"></i>
              </Button>
              <h2 className="title-admins-table m-0">Transaction Details</h2>
            </div>
            <Row className=" justify-content-center mt-4">
              <Col md={12}>
                <Row className="">
                  <Col md={12}>
                    <div className="row">
                    <div className="col-md-9 mb-md-0 mb-3">
                        <div className="table_border tran_sec">
                          <strong>Payment Intent Details:</strong>
                          <hr />

                          <ul>
                            {Object.entries(selectedRow?.paymentResponse).map(
                              ([key, value]) => (
                                <li key={key}>
                                  <strong>{key}: </strong>
                                  {Array.isArray(value) ? (
                                    <ul>
                                      {value.map((item, index) => (
                                        <li key={index}>
                                          {renderDetails(item)}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    renderDetails(value)
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-3 ">
                        <div className="table_border tran_sec ">
                          <strong>Transaction Details:</strong>
                          <hr />

                          <p>
                            {" "}
                            <strong>Order ID:</strong> #{selectedRow._id}{" "}
                          </p>
                          {/* <p> <strong>Customer Name:</strong> {selectedRow?.shippingAddress?.firstName + " " + selectedRow?.shippingAddress?.lastName}</p> */}
                          <p>
                            {" "}
                            <strong>Transaction ID:</strong>{" "}
                            {selectedRow.transactionId}{" "}
                          </p>
                          {/* <p> <strong>Customer ID:</strong> {selectedRow.userId} </p> */}
                          <p>
                            {" "}
                            <strong>Status:</strong> {selectedRow.status}{" "}
                          </p>
                          <p>
                            {" "}
                            <strong>Payment Method:</strong>{" "}
                            {selectedRow.paymentGateway}{" "}
                          </p>
                          <p>
                            {" "}
                            <strong>Customer Name:</strong>{" "}
                            {selectedRow?.userId?.first_name +
                              " " +
                              selectedRow?.userId?.last_name}
                          </p>
                          <p>
                            {" "}
                            <strong>Customer Email:</strong>{" "}
                            {selectedRow?.userId?.email}
                          </p>
                          <p>
                            <strong>Order Date:</strong>{" "}
                            {timeAgo(selectedRow.createdAt)}
                          </p>
                        </div>
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
          {loading ? (
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
                <h1 className="title-admins-table">Transaction History</h1>
              </div>

              {data.length > 0 ? (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>S.No</TableCell>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Transaction ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Date </TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{row._id}</TableCell>
                              <TableCell>{row.transactionId}</TableCell>
                              <TableCell className="text-capitalize">
                                {row?.userId?.first_name +
                                  " " +
                                  row?.userId?.last_name}
                              </TableCell>
                              <TableCell>{row.status}</TableCell>
                              <TableCell>{timeAgo(row.createdAt)}</TableCell>
                              <TableCell align="right">
                                <Dropdown className="dorpdown-curtom">
                                  <Dropdown.Toggle
                                    as={IconButton}
                                    variant="link"
                                  >
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
                    count={data?.length}
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

export default TransactionList;
