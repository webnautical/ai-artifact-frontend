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
import { timeAgo, tableImg } from "../../../helper/Utility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SwitchToggle from "../../../components/SwitchToggle";
import Pagination from "react-bootstrap/Pagination";
import {
  TABLE_PAGINATION_DROPDOWN,
  TABLE_ROW_PER_PAGE,
} from "../../../helper/Constant";
import "../../../App.css";

const Review = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getListFun(pageNo, rowsPerPage);
  }, [pageNo, rowsPerPage]);

  const getListFun = async (pageNo, rowsPerPage) => {
    setListLoading(true);
    try {
      const params = { page: pageNo, limit: rowsPerPage };
      const res = await APICALL("admin/getAllreviews", "post", params);
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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setPageNo(newPage + 1);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  const handleStatusChange = async (event, row) => {
    const newStatus = event.target.checked;
    setData((prevData) =>
      prevData.map((item) =>
        item._id === row._id ? { ...item, status: newStatus } : item
      )
    );
    try {
      const res = await APICALL("admin/toggleReviewStatus", "post", {
        id: row._id,
      });
    } catch (error) {
      console.error("API call error:", error);
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
              <h1 className="title-admins-table">Reviews</h1>
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
                        <TableCell>Product Name</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Artist Name</TableCell>
                        <TableCell>Star</TableCell>
                        <TableCell>Comment</TableCell>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.product_id?.title}</TableCell>
                            <TableCell>
                              {tableImg(row.product_id?.image)}
                            </TableCell>
                            <TableCell>
                              {row.user_id?.last_name}
                            </TableCell>
                            <TableCell>
                              {row.artist_id?.first_name +
                                " " +
                                row.artist_id?.last_name}
                            </TableCell>
                            <TableCell>{row.star}</TableCell>
                            <TableCell>{row.comment}</TableCell>
                            <TableCell>
                              <SwitchToggle
                                checked={row?.status}
                                onChange={(event) =>
                                  handleStatusChange(event, row)
                                }
                              />
                            </TableCell>
                            <TableCell>{timeAgo(row.createdAt)}</TableCell>
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
    </>
  );
};

export default Review;
