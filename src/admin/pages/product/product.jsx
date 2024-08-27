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
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import { Col, Dropdown, Form, Modal, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import AdminLoader from "../../components/AdminLoader";
import BTNLoader from "../../../components/BTNLoader";
import { APICALL } from "../../../helper/api/api";
import { timeAgo, tableImg, toastifyError, toastifySuccess } from "../../../helper/Utility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  SOMETHING_ERR,
  TABLE_PAGINATION_DROPDOWN,
  TABLE_ROW_PER_PAGE,
} from "../../../helper/Constant";
import "../../../App.css";
import ConfirmModal from "../../../helper/ConfirmModal";
import { Link } from "react-router-dom";

const Product = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [productDataOBJ, setArtDataOBJ] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null);
  const [show, setShow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    getListFun(pageNo, rowsPerPage);
  }, [pageNo, rowsPerPage]);

  const getListFun = async (pageNo, rowsPerPage) => {
    setListLoading(true);
    try {
      const parem = { page: pageNo, limit: rowsPerPage };
      const res = await APICALL("admin/allProducts", "post", parem);
      if (res?.status) {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setPageNo(newPage + 1);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [rejectModalVal, setRejectModalVal] = useState({
    approvalStatus: true,
    rejectionReason: ""
  })

  const handleClose = () => {
    setShow(false)
    setArtDataOBJ(null)
    setRejectModalVal({ ...rejectModalVal, 'approvalStatus': true, rejectionReason: '' })
  };
  const handleShow = (item) => {
    setShow(true);
    setArtDataOBJ(item)
  }

  const handleViewChange = (row, type) => {
    setActionType(type)
    if(type === 'delete'){
      setModalOpen(true)
    }
    setSelectedRow(row);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRejectModalVal({
      ...rejectModalVal,
      [name]: name === 'approvalStatus' ? (value === 'true' ? true : false) : value,
    });
  }

  const handleStatusChange = async (event) => {
    const params = { ...rejectModalVal, productId: productDataOBJ?._id }
    if (rejectModalVal.approvalStatus === '') {
      toastifyError("Please select status !");
      return false
    }
    if (rejectModalVal.approvalStatus === false && rejectModalVal.rejectionReason.trim() === '') {
      toastifyError("Reason is required when status is Reject !");
      return false
    }
    setLoading(true)
    try {
      const res = await APICALL("admin/toggleProduct", "post", params);
      if (res?.status) {
        handleClose()
        toastifySuccess(res?.message)
        setData((prevData) =>
          prevData.map((item) =>
            item._id === productDataOBJ._id ? { ...item, status: rejectModalVal.approvalStatus, rejectStatus: res?.data?.rejectStatus } : item
          )
        );
      } else {
        toastifyError(SOMETHING_ERR)
      }
    } catch (error) {
      toastifyError(SOMETHING_ERR)
      console.error("API call error:", error);
    } finally {
      setLoading(false)
    }
  };

  const deleteArtWork = async () => {
    setLoading(true)
    try {
      const res = await APICALL("/admin/deleteArtwork", "post", {productId: selectedRow?._id});
      if (res?.status) {
        toastifySuccess(res?.message)
        setModalOpen(false)
        getListFun(pageNo, rowsPerPage);
      } else {
        toastifyError(SOMETHING_ERR)
      }
    } catch (error) {
      toastifyError(SOMETHING_ERR)
      console.error("API call error:", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
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
                <h1 className="title-admins-table">Artworks</h1>
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
                          <TableCell>
                            <TableSortLabel
                              active={orderBy === "role"}
                              direction={orderBy === "role" ? order : "asc"}
                              onClick={() => handleRequestSort("role")}
                            >
                              S.No
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>
                            <TableSortLabel
                              active={orderBy === "role"}
                              direction={orderBy === "role" ? order : "asc"}
                              onClick={() => handleRequestSort("role")}
                            >
                              Artwork Name
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>Artist Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Sub Category</TableCell>
                          <TableCell>Image</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>
                            <TableSortLabel
                              active={orderBy === "admins"}
                              direction={orderBy === "admins" ? order : "asc"}
                              onClick={() => handleRequestSort("admins")}
                            >
                              Date
                            </TableSortLabel>
                          </TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>
                              {row.artist_id.first_name +
                                " " +
                                row.artist_id.last_name}
                            </TableCell>
                            <TableCell>{row?.category?.name}</TableCell>
                            <TableCell>{row?.subcategory?.name}</TableCell>
                            <TableCell>{tableImg(row.thumbnail)}</TableCell>
                            <TableCell>
                              <OverlayTrigger placement={'top'} overlay={<Tooltip id="tooltip-disabled" >Change product status to Click here!</Tooltip>}>
                                <span className="d-inline-block">
                                  <Button className={`btn btn-sm ${row?.rejectStatus === 1 ? "btn-danger" : row?.status ? 'btn-success' : 'btn-warning'}`} onClick={() => handleShow(row)}>
                                    {
                                      row?.rejectStatus === 1 ? "Rejected" :
                                        row?.status ? "Approved" : "Pending"
                                    }
                                  </Button>
                                </span>
                              </OverlayTrigger>
                            </TableCell>
                            <TableCell>{timeAgo(row.createdAt)}</TableCell>
                            <TableCell align="right">
                              <Dropdown className="dorpdown-curtom">
                                <Dropdown.Toggle
                                  as={IconButton}
                                  variant="link"
                                >
                                  <MoreVert />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item href="#" >
                                    <Link to={`/admin/product-details/${row?._id}`}>
                                    <RemoveRedEyeIcon style={{ marginRight: "8px" }} />View
                                    </Link>
                                  </Dropdown.Item>
                                  <Dropdown.Item href="#" onClick={() => handleViewChange(row, "delete")}>
                                    <Delete style={{ marginRight: "8px" }} />Delete
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

      <Modal className="modal-all" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change  Status </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor=""><strong>{productDataOBJ?.title}</strong> Uploaded By Artist: <strong>{productDataOBJ?.artist_id?.first_name}</strong></label>
              <select name="approvalStatus" onChange={handleChange} className="form-control mt-2 text-capitalize">
                <option value={true}>Approve</option>
                <option value={false}>Reject</option>
              </select>
            </div>

            {
              !rejectModalVal.approvalStatus &&
              <div className="col-12">
                <label htmlFor="">Reason</label>
                <textarea name="rejectionReason" onChange={handleChange} rows={3} className="form-control" placeholder="Write..." maxLength={150}></textarea>
                <div className="text-count mt-1 text-end">
                  <p>{rejectModalVal.rejectionReason.length}/150 characters</p>
                </div>
              </div>
            }

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}> Cancel</Button>
          {
            loading ? <BTNLoader className="artist-btn" /> :
              <Button variant="primary" className="artist-btn" onClick={() => handleStatusChange()}> Save</Button>
          }
        </Modal.Footer>
      </Modal>

      <ConfirmModal modalOpen={modalOpen} setModalOpen={setModalOpen} funCall={deleteArtWork} submitLoading={loading} msg="Are you sure? you want to delete it" btn1={"No"} btn2={"Yes"}/>
    </>
  );
};

export default Product;
