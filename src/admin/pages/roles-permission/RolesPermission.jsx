import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  TablePagination,
  TableSortLabel,
  IconButton,
} from "@mui/material";
import { Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { APICALL } from "../../../helper/api/api";
import { filterByKey, timeAgo } from "../../../helper/Utility";
import BTNLoader from "../../../components/BTNLoader";
import TextMessage from "../../../components/TextMessage";
import AdminLoader from "../../components/AdminLoader";
import { TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
import { Edit, MoreVert } from "@mui/icons-material";
import { useDataContext } from "../../../helper/context/ContextProvider";
import TableMSG from "../../../components/TableMSG";
 
const RolesPermission = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [resMsg, setResMsg] = useState(null)
  const { permisionData, getPermision } = useDataContext();
  const permisionCheck = filterByKey("rolesPermission", permisionData?.permissions);
 
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
      const res = await APICALL('admin/roles')
      setListLoading(false)
      if (res?.status) {
        setData(res?.data)
      }
    } catch (error) {
      setListLoading(false)
    }
  }
 
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, TABLE_ROW_PER_PAGE));
    setPage(0);
  };
 
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const filteredData = data.filter(
    (item) =>
      item.roles.name?.toLowerCase().includes(search?.toLowerCase())
  );
 
  const sortedData = React.useMemo(() => {
    if (orderBy === "") return filteredData;
    return [...filteredData].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    });
  }, [orderBy, order, filteredData]);
 
  const handleShowModal = () => setShowModal(true);
 
  const initialFormData = {
    name: '',
    description: '',
    permissions: {
      // dashboard: {
      //   edit: false,
      //   read: false,
      // },
      withdrawal: {
        edit: false,
        read: false,
      },
      userManagement: {
        edit: false,
        read: false,
      },
      products: {
        edit: false,
        read: false,
      },
      categories: {
        edit: false,
        read: false,
      },
      reviews: {
        edit: false,
        read: false,
      },
      orders: {
        edit: false,
        read: false,
      },
      // transaction: {
      //   edit: false,
      //   read: false,
      // },
      // subAdmin: {
      //   edit: false,
      //   read: false,
      // },
      pages: {
        edit: false,
        read: false,
      },
      contactQuery: {
        edit: false,
        read: false,
      },
      subscribers: {
        edit: false,
        read: false,
      },
      blogs: {
        edit: false,
        read: false,
      },
      notifications: {
        edit: false,
        read: false,
      },
      generalSettings: {
        edit: false,
        read: false,
      },
      gelatoPrice: {
        edit: false,
        read: false,
      },
      bannerImages: {
        edit: false,
        read: false,
      },
      coupon: {
        edit: false,
        read: false,
      },
    },
  };
 
  const [formData, setFormData] = useState(initialFormData);
 
  const [errors, setErrors] = useState({});
 
  const validate = (name, value) => {
    let error = '';
    if (name === 'name' && value.trim() === '') {
      error = 'Role Name is required';
    }
    if (name === 'description' && value.trim() === '') {
      error = 'Description is required';
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const [category, permission] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        permissions: {
          ...prevData.permissions,
          [category]: {
            ...prevData.permissions[category],
            [permission]: checked,
          },
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      validate(name, value);
    }
  };
 
  const handleSubmit = async () => {
    let isValid = true;
    let newErrors = {};
 
    if (formData.name.trim() === '') {
      newErrors.name = 'Role Name is required';
      isValid = false;
    }
    if (formData.description.trim() === '') {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    setErrors(newErrors);
    if (isValid) {
      setLoading(true)
      try {
        const res = await APICALL('admin/createRole', 'post', formData)
        setLoading(false)
        if (res?.status) {
          getListFun()
          if (formData._id) {
            setResMsg(true)
          } else {
            handleCloseModal()
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  };
 
  const handleCloseModal = () => {
    setShowModal(false)
    setFormData(initialFormData);
    setResMsg(false)
  };
 
  const handleEditChange = (row) => {
    const updatedPermissions = {
      ...formData.permissions,
      ...row?.roles?.permissions,
    };
 
    setFormData((prevFormData) => ({
      ...prevFormData,
      name: row?.roles?.name || prevFormData.name,
      description: row?.roles?.description || prevFormData.description,
      permissions: {
        ...prevFormData.permissions,
        // dashboard: { ...prevFormData.permissions.dashboard, ...updatedPermissions.dashboard },
        withdrawal: { ...prevFormData.permissions.withdrawal, ...updatedPermissions.withdrawal },
        // rolesPermission: { ...prevFormData.permissions.rolesPermission, ...updatedPermissions.rolesPermission },
        userManagement: { ...prevFormData.permissions.userManagement, ...updatedPermissions.userManagement },
        products: { ...prevFormData.permissions.products, ...updatedPermissions.products },
        categories: { ...prevFormData.permissions.categories, ...updatedPermissions.categories },
        reviews: { ...prevFormData.permissions.reviews, ...updatedPermissions.reviews },
        orders: { ...prevFormData.permissions.orders, ...updatedPermissions.orders },
        // transaction: { ...prevFormData.permissions.transaction, ...updatedPermissions.transaction },
        // subAdmin: { ...prevFormData.permissions.subAdmin, ...updatedPermissions.subAdmin },
        pages: { ...prevFormData.permissions.pages, ...updatedPermissions.pages },
        contactQuery: { ...prevFormData.permissions.contactQuery, ...updatedPermissions.contactQuery },
        subscribers: { ...prevFormData.permissions.subscribers, ...updatedPermissions.subscribers },
        blogs: { ...prevFormData.permissions.blogs, ...updatedPermissions.blogs },
        notifications: { ...prevFormData.permissions.notifications, ...updatedPermissions.notifications },
        generalSettings: { ...prevFormData.permissions.generalSettings, ...updatedPermissions.generalSettings },
        gelatoPrice: { ...prevFormData.permissions.gelatoPrice, ...updatedPermissions.gelatoPrice },
        bannerImages: { ...prevFormData.permissions.bannerImages, ...updatedPermissions.bannerImages },
        coupon: { ...prevFormData.permissions.coupon, ...updatedPermissions.coupon },
      },
    }));
 
    setShowModal(true);
  };
 
  const checkBoxShow = {
    name: '',
    description: '',
    permissions: {
      withdrawal: {
        read: true,
      },
      userManagement: {
        read: true,
      },
      products: {
        delete: true,
        read: true,
      },
      categories: {
        create: true,
        edit: true,
        read: true,
        delete: true,
      },
      reviews: {
        read: true,
      },
      orders: {
        read: true,
      },
      pages: {
        read: true,
      },
      contactQuery: {
        read: true,
      },
      subscribers: {
        read: true,
      },
      blogs: {
        create: true,
        edit: true,
        read: true,
        delete: true,
      },
      notifications: {
        read: true,
      },
      generalSettings: {
        edit: true,
        read: true,
      },
      gelatoPrice: {
        edit: true,
        read: true,
      },
      bannerImages: {
        create: true,
        edit: true,
        read: true,
        delete: true,
      },
      coupon: {
        create: true,
        edit: true,
        read: true,
        delete: true,
      },
    },
  };
 
  return (
    <Paper className="table_samepattern">
      {
        listLoading ? <AdminLoader />
          :
          <>
            <Row
              style={{
             
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <Col md={6}>
              <h1 className="title-admins-table">Roles</h1>
              </Col>
              <Col md={3}>
              <div className=" align-items-center" style={{ gap: '10px' }}>
                <TextField
                className="w-100"
                  variant="outlined"
                  placeholder="Search..."
                  value={search}
                  onChange={handleSearchChange}
                  style={{ width: "300px" }}
                />
              <div className="mt-3 text-end">
              {
                  permisionCheck?.create &&
                  <Button className="artist-btn " onClick={handleShowModal}> Add Roles </Button>
                }
              </div>
              </div>
              </Col>
            </Row>
            <TableContainer>
              {
                permisionCheck?.read ?
                  <>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <TableSortLabel active={orderBy === "role"} direction={orderBy === "role" ? order : "asc"} onClick={() => handleRequestSort("role")}>
                              S.No
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>
 
                            <TableSortLabel active={orderBy === "role"} direction={orderBy === "role" ? order : "asc"} onClick={() => handleRequestSort("role")}>
                              Role Name
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>
                            <TableSortLabel
                              active={orderBy === "description"}
                              direction={orderBy === "description" ? order : "asc"}
                              onClick={() => handleRequestSort("description")}
                            >
                              Description
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>
 
                            <TableSortLabel active={orderBy === "role"} direction={orderBy === "role" ? order : "asc"} onClick={() => handleRequestSort("role")}>
                              Users
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
                        {sortedData
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{row?.roles.name}</TableCell>
                              <TableCell>{row?.roles.description}</TableCell>
                              <TableCell>{row?.total}</TableCell>
                              <TableCell>{timeAgo(row?.roles.created_at)}</TableCell>
                              <TableCell style={{ width: 160 }} align="right">
                                <Dropdown className="dorpdown-curtom">
                                  <Dropdown.Toggle as={IconButton} variant="link">
                                    <MoreVert />
                                  </Dropdown.Toggle>
                                  {
                                    permisionCheck?.edit &&
                                    <Dropdown.Menu>
                                      <Dropdown.Item to="#" onClick={() => handleEditChange(row)}>
                                        <Edit style={{ marginRight: "8px" }} />
                                        Edit
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  }
                                </Dropdown>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
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
 
                  :
                  <TableMSG msg={"You don't have permision to view this data"} type={true} />
              }
            </TableContainer>
 
          </>
      }
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="modal-all"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{formData._id ? "Update Role" : "Add New Role"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="cutoms-login-artist">
            <Form.Group controlId="formRoleName" className="mb-3">
              <Form.Label>Role Name*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter role name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
 
            <Form.Group controlId="formPermissions" className="mb-3">
              <Form.Label className="mb-2">Permissions*</Form.Label>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th width="30%">Page</th>
                    <th>Create</th>
                    <th>Edit</th>
                    <th>Read</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(formData.permissions).map((category) => (
                    <tr key={category}>
                      <td width="30%">{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          id={`${category}.create`}
                          name={`${category}.create`}
                          checked={formData.permissions[category].create}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          id={`${category}.edit`}
                          name={`${category}.edit`}
                          checked={formData.permissions[category].edit}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          id={`${category}.read`}
                          name={`${category}.read`}
                          checked={formData.permissions[category].read}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          id={`${category}.delete`}
                          name={`${category}.delete`}
                          checked={formData.permissions[category].delete}
                          onChange={handleChange}
                        />
                      </td>
 
                    </tr>
                  ))}
                </tbody>
              </Table>
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
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>
 
          </Form>
          <div className="col-12">
            {
              resMsg &&
              <TextMessage type={true} msg={"Roles updated successfully"} />
            }
          </div>
          <Row className="mt-3">
            <Col><Button className="line-close-btn w-100" onClick={handleCloseModal} > Close </Button></Col>
            <Col>
              {
                loading ?
                  <BTNLoader className={"artist-btn  w-100"} />
                  :
                  <Button className="artist-btn  w-100" type="button" onClick={() => handleSubmit()}> {formData._id ? "Update" : "Save"}</Button>
              }
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Paper>
  );
};
 
export default RolesPermission;