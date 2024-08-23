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
import { timeAgo } from "../../../helper/Utility";
import {
  TABLE_PAGINATION_DROPDOWN,
  TABLE_ROW_PER_PAGE,
} from "../../../helper/Constant";
import "../../../App.css";

const Collection = () => {
  const initialFormData = {
    id: "",
    name: "",
    description: "",
  };

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [updData, setUpdate] = useState(null);

  useEffect(() => {
    getListFun();
  }, []);

  useEffect(() => {
    if (updData?._id) {
      setFormData({
        id: updData._id,
        name: updData.name,
        description: updData.description,
      });
    }
  }, [updData]);

  const getListFun = async () => {
    setListLoading(true);
    try {
      const parems = {};
      const res = await APICALL("admin/getAllCollections", "post", parems);
      if (res?.status) {
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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleShowModal = () => {
    setFormData(initialFormData); // Reset form data
    setUpdate(null); // Clear update data if any
    setShowModal(true); // Show modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditChange = (row) => {
    setUpdate(row);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      swal({
        title: "Name is required!",
        text: "Please enter the collection name.",
        icon: "warning",
        button: { text: "OK", className: "swal_btn_ok" },
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await APICALL("admin/addCollection", "post", formData);
      if (res?.status) {
        getListFun();
        handleCloseModal();
        swal({
          title: `Collection ${
            formData.id ? "Updated" : "Added"
          } Successfully !!`,
          icon: "success",
          button: { text: "OK", className: "swal_btn_ok" },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
              <h1 className="title-admins-table">Collections</h1>
         <div className="d-flex" style={{ gap:'10px'}}>
         <TextField
                variant="outlined"
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
                style={{ width: "300px" }}
              />
              <Button className="artist-btn" onClick={handleShowModal}>
                Add Collection
              </Button>
         </div>
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
                            Name
                          </TableSortLabel>
                        </TableCell>
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
                      {filteredData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{timeAgo(row.createdAt)}</TableCell>
                            <TableCell align="right">
                              <Dropdown className="dorpdown-curtom">
                                <Dropdown.Toggle as={IconButton} variant="link">
                                  <MoreVert />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={() => handleEditChange(row)}
                                  >
                                    <Edit style={{ marginRight: "8px" }} />
                                    Edit
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
                  count={data.length}
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

        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          className="modal-all"
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {updData?._id ? "Update Collection" : "Add Collection"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="cutoms-login-artist">
              <Form.Group controlId="formRoleName" className="mb-3">
                <Form.Label>Name*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter role name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
            <Row className="mt-3">
              <Col>
                <Button
                  className="line-close-btn w-100"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
              </Col>
              <Col>
                {loading ? (
                  <BTNLoader className="artist-btn w-100" />
                ) : (
                  <Button
                    className="artist-btn w-100"
                    type="button"
                    onClick={handleSubmit}
                  >
                    {updData?._id ? "Update" : "Save"}
                  </Button>
                )}
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Paper>
    </>
  );
};

export default Collection;
