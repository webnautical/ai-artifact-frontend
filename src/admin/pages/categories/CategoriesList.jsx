import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "react-bootstrap/Modal";
import { Col, Dropdown, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import AdminLoader from './../../components/AdminLoader';
import { IconButton, TablePagination, TableSortLabel } from "@mui/material";
import { Delete, Edit, MoreVert, TramSharp } from "@mui/icons-material";
import { SERVER_ERR, SOMETHING_ERR, TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
import { APICALL } from "../../../helper/api/api";
import { filterByKey, imgBaseURL, tableImg, timeAgo } from "../../../helper/Utility";
import swal from "sweetalert";
import BTNLoader from "../../../components/BTNLoader";
import { useDataContext } from "../../../helper/context/ContextProvider";
import TableMSG from "../../../components/TableMSG";
 
const CategoriesList = () => {
  const [loading, setLoading] = useState({
    'list': false,
    'submit': false
  })
  const [data, setData] = useState([])
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
  const [show, setShow] = useState(false);
  const [categoryList, setCategoryList] = useState([])
  const { permisionData, getPermision } = useDataContext();
  const permisionCheck = filterByKey("categories", permisionData?.permissions);
  useEffect(() => {
    getPermision()
  }, [])
  const handleClose = () => {
    setShow(false)
    setFormData(initialFormData)
    setImgPreview({ ...imgPreview, 'image': '' })
  };
  const handleShow = (type) => {
    setShow(true)
  };
 
  const [listingTab, setListingTab] = useState('category')
  useEffect(() => {
    if (permisionCheck?.read) {
      getListFun();
    }
    categoryListFun()
  }, [listingTab, permisionData])
  const getListFun = async () => {
    setLoading({ ...loading, 'list': true })
    const params = { type: listingTab }
    try {
      const res = await APICALL('admin/getAllCategory', 'post', params)
      setLoading({ ...loading, 'list': false })
      if (res?.status) { setData(res?.data) }
    } catch (error) {
      setLoading({ ...loading, 'list': false })
    }
  }
  const categoryListFun = async () => {
    setLoading({ ...loading, 'list': true })
    const params = { type: 'category' }
    try {
      const res = await APICALL('admin/getAllCategory', 'post', params)
      setLoading({ ...loading, 'list': false })
      if (res?.status) { setCategoryList(res?.data) }
    } catch (error) {
      setLoading({ ...loading, 'list': false })
    }
  }
  const filteredData = data.filter((item) => item.name?.toLowerCase().includes(search?.toLowerCase()));
 
  const initialFormData = {
    id: '',
    category_name: '',
    parentCategoryId: '',
    image: '',
  };
  const [imgPreview, setImgPreview] = useState({ image: "" });
  const [formData, setFormData] = useState(initialFormData);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, TABLE_ROW_PER_PAGE));
    setPage(0);
  };
 
  const handleEditChange = (row) => {
    setShow(true)
    console.log(row)
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
      swal({ title: `${listingTab == "category" ? "Category" : "Sub Category"} is required !!`, icon: "error", button: { text: "OK", className: "swal_btn_ok" } });
      return false
    }
 
    setLoading({ ...loading, 'submit': true })
    const params = new FormData();
    formData.id && params.append("id", formData.id);
    params.append("name", formData.category_name);
    params.append("image", formData.image);
    formData.parentCategoryId && params.append("parentCategoryId", formData.parentCategoryId);
    try {
      const apiEnd = listingTab == "category" ? "addCategory" : "addSubcategory"
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
      const params = listingTab == "category" ? { categoryId: id } : { subcategoryId: id }
      const apiEnd = listingTab == "category" ? "deleteCategory" : "deleteSubcategory"
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
 
  return (
    <>
      <Paper className="table_samepattern">
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px", }}>
          <h1 className="title-admins-table"> {listingTab == "category" ? " Categories" : "Sub Categories"}</h1>
          {
            permisionCheck?.create &&
            <button variant="primary" onClick={() => handleShow("addCategory")} className="artist-btn">  Add New</button>
          }
        </div>
        <div className="tab_design">
          <button onClick={() => setListingTab('category')} className={`${listingTab == "category" ? "acitive" : ""}`}>Category</button>
          <button onClick={() => setListingTab('subcategory')} className={`${listingTab == "subcategory" ? "acitive" : ""}`}>Sub Category</button>
        </div>
 
        {loading?.list ? <AdminLoader /> :
          <>
 
            {
              permisionCheck?.read ?
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>S.No </TableCell>
                          <TableCell>Image </TableCell>
                          <TableCell> {listingTab == "category" ? " Category Name" : "Sub Category Name"}  </TableCell>
                          {
                            listingTab == "subcategory" &&
                            <TableCell>Category Name </TableCell>
                          }
                          <TableCell>Date </TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{tableImg(row.image)}</TableCell>
                              <TableCell>{row?.name}</TableCell>
                              {
                                listingTab == "subcategory" &&
                                <TableCell>{row?.parentCategoryId?.name}</TableCell>
                              }
                              <TableCell>{timeAgo(row?.created_at)}</TableCell>
                              <TableCell style={{ width: 160 }} align="right">
                                <Dropdown className="dorpdown-curtom">
                                  <Dropdown.Toggle as={IconButton} variant="link">
                                    <MoreVert />
                                  </Dropdown.Toggle>
                                  {(permisionCheck?.edit || permisionCheck?.delete) && (
                                    <Dropdown.Menu>
                                      {
                                        permisionCheck?.edit &&
                                        <Dropdown.Item to="#" onClick={() => handleEditChange(row, 'editCategory')}>
                                          <Edit style={{ marginRight: "8px" }} />Edit
                                        </Dropdown.Item>
                                      }
                                      {
                                        permisionCheck?.delete &&
                                        <Dropdown.Item to="#" onClick={() => handleDelete(row?._id)}>
                                          <Delete style={{ marginRight: "8px" }} />Delete
                                        </Dropdown.Item>
                                      }
                                    </Dropdown.Menu>
                                  )}
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
                :
                <TableMSG msg={"You don't have permision to view this data"} type={true} />
            }
 
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
              <Modal.Title> {listingTab == "category" ? "Edit Categories" : "Edit Sub Categories"} </Modal.Title>
              :
              <Modal.Title> {listingTab == "category" ? "Add New Categories" : " Add New Sub Categories"} </Modal.Title>
          }
        </Modal.Header>
        <Modal.Body>
          <Row className="cutoms-login-artist">
            <Col md={12} className="mb-3">
              <div class="file-uploader">
                <label for="logoID" class="global_file_upload_deisgn">
                  <i class="fa-solid fa-arrow-up-from-bracket"></i>
                  Upload categories image here
                  <input type="file" id="logoID" name="image" value={formData.name} onChange={handleChange} />
                </label>
              </div>
              {imgPreview.image && (
                <div className="text-end">  <img src={imgPreview.image} style={{ height: '60px', width: '60px', marginTop: '20px' }} alt="alt" /></div>
              )}
            </Col>
 
            <Col md={12} className="mb-3">
              <Form.Group className="mb-3" controlId="formmainTitle">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
 
            {
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
            }
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
 
export default CategoriesList;