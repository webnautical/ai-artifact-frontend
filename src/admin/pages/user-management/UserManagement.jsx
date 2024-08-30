import PropTypes from "prop-types";
import MainCard from "../../components/MainCard";
import { APICALL } from "../../../helper/api/api";
import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import "../../../assets/css/admin.css";
import AdminLoader from "../../components/AdminLoader";
import { useDataContext } from './../../../helper/context/ContextProvider';
import TableMSG from "../../../components/TableMSG";
import { filterByKey, getTierImg } from "../../../helper/Utility";
import { TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from './../../../helper/Constant';
import { useParams } from "react-router";
import { Dropdown } from "react-bootstrap";
import { Edit, MoreVert } from "@mui/icons-material";
import { EyeFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

function TablePaginationActions(props) {

  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function UserManagement() {
  const { type } = useParams()
  const { permisionData, getPermision } = useDataContext();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
  const permisionCheck = filterByKey("userManagement", permisionData?.permissions);

  useEffect(() => {
    getPermision()
  }, [])
  useEffect(() => {
    if (permisionCheck?.read) {
      getListFun();
    }
  }, [type]);

  const getListFun = async () => {
    setLoading(true);
    try {
      const res = await APICALL("admin/allUsers", "post", { role: type });
      setLoading(false);
      if (res?.status) {
        setList(res?.Users);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, TABLE_ROW_PER_PAGE));
    setPage(0);
  };

  const filteredList = list.filter(
    (user) =>
      user.first_name.toLowerCase().includes(search.toLowerCase()) ||
      user.last_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredList.length) : 0;

  return (
    <Paper className="table_samepattern table_image_container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px",
        }}
      >
        <h1 className="title-admins-table">User Management</h1>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          style={{ width: "300px" }}
        />
      </div>
      {loading ? (
        <AdminLoader />
      ) : (
        <>
          <TableContainer component={Paper}>

            {
              permisionCheck?.read ?
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">S.NO</TableCell>
                      {
                        type === "artist" &&
                        <TableCell>Tier</TableCell>
                      }
                      <TableCell>User Name</TableCell>
                      <TableCell>Email Address</TableCell>
                      <TableCell>Assigned Roles</TableCell>
                      {/* <TableCell>Date</TableCell> */}
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? filteredList.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        : filteredList
                      ).map((row, i) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row" align="center">
                            {i + 1}
                          </TableCell>
                          {
                            type === "artist" &&
                          <TableCell>{getTierImg(row?.currentRank)?.icon}</TableCell>
                          }
                          <TableCell component="th" scope="row">
                            {row.first_name + " " + row.last_name}
                          </TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>
                            <div sx={{ textTransform: "capitalize" }}>
                              {row.user_role}
                            </div>
                          </TableCell>
                          {/* <TableCell>{row.status}</TableCell> */}

                          {/* <TableCell>{timeAgo(row.created_at)}</TableCell> */}
                          <TableCell>
                            <Dropdown className="dorpdown-curtom">
                              <Dropdown.Toggle as={IconButton} variant="link">
                                <MoreVert />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item>
                                  <Link to={`/admin/user-management-details/${row?._id}`}>
                                    <EyeFilled style={{ marginRight: "8px" }} />Views Details
                                  </Link>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </TableCell>
                        </TableRow>
                      ))}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={TABLE_PAGINATION_DROPDOWN}
                          count={filteredList.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          slotProps={{
                            select: {
                              inputProps: {
                                "aria-label": "rows per page",
                              },
                              native: true,
                            },
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </>

                </Table>
                :
                <TableMSG msg={"You Don't have permision to view this data"} type={true} />
            }
          </TableContainer>
        </>
      )}
    </Paper>
  );
}
