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
import '../../../App.css'

import MainCard from "../../components/MainCard";
import { APICALL } from "../../../helper/api/api";
import { auth, timeAgo } from "../../../helper/Utility";
import EditIcon from '@mui/icons-material/Edit';
import AdminLoader from "../../components/AdminLoader";
import AddAdmin from "./AddAdmin";
import ViewAdmin from "./ViewAdmin";
import SwitchToggle from "../../../components/SwitchToggle";
import Form from 'react-bootstrap/Form';
import { Dropdown } from "react-bootstrap";
import { Edit, MoreVert } from "@mui/icons-material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
const SubAdmin = () => {


    const [pageType, setPageType] = useState(false)
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [orderBy, setOrderBy] = useState("");
    const [order, setOrder] = useState("asc");
    const [data, setData] = useState([])
    const [listLoading, setListLoading] = useState(false)
    useEffect(() => {
        getListFun()
    }, [])
    const getListFun = async () => {
        setListLoading(true)
        try {
            const res = await APICALL('admin/subAdmins')
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
            item.first_name?.toLowerCase().includes(search?.toLowerCase())
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

    const [updData, setUpdate] = useState(null)
    const handleEditChange = (row, type) => {
        setPageType(type)
        setUpdate(row)
    }

    const handleStatusChange = async (event, row) => {
        const newStatus = event.target.checked ? 'inactive' : 'active';

        setData(prevData =>
            prevData.map(item =>
                item._id === row._id ? { ...item, status: newStatus } : item
            )
        );
        try {
            const res = await APICALL('admin/toggleSubAdminStatus', 'post', { id: row._id })
            if (res?.status) {
                getListFun()
            }
        } catch (error) {
            console.error('API call error:', error);
        }
    };

    return (
        <>
            {
                pageType === 'edit' ?
                    <AddAdmin setPageType={setPageType} updData={updData} setUpdate={setUpdate} getListFun={getListFun} />
                    :
                    pageType === 'view' ?
                        <ViewAdmin setPageType={setPageType} updData={updData} setUpdate={setUpdate} />
                        :
                        <Paper className="table_samepattern">
                            {
                                listLoading ? <AdminLoader />
                                    :
                                    <>
                                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", }} >
                                            <h1 className="title-admins-table">Sub Admins</h1>
                                            <TextField
                                                variant="outlined"
                                                placeholder="Search..."
                                                value={search}
                                                onChange={handleSearchChange}
                                                style={{ width: "300px" }}
                                            />

                                            <Button className="artist-btn " onClick={() => setPageType("edit")}>
                                                Create Sub Admin
                                            </Button>
                                        </div>

                                        {
                                            data?.length > 0 ?
                                                <>
                                                    <TableContainer>
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
                                                                            Name
                                                                        </TableSortLabel>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <TableSortLabel
                                                                            active={orderBy === "description"}
                                                                            direction={orderBy === "description" ? order : "asc"}
                                                                            onClick={() => handleRequestSort("description")}
                                                                        >
                                                                            Email
                                                                        </TableSortLabel>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <TableSortLabel active={orderBy === "role"} direction={orderBy === "role" ? order : "asc"} onClick={() => handleRequestSort("role")}>
                                                                            Assigned Role
                                                                        </TableSortLabel>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <TableSortLabel active={orderBy === "role"} direction={orderBy === "role" ? order : "asc"} onClick={() => handleRequestSort("role")}>
                                                                            Status
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
                                                                            <TableCell>{row?.first_name + row?.last_name}</TableCell>
                                                                            <TableCell>{row?.email}</TableCell>
                                                                            <TableCell>{row?.user_role}</TableCell>
                                                                            <TableCell>
                                                                                <SwitchToggle
                                                                                    checked={row?.status}
                                                                                    onChange={(event) => handleStatusChange(event, row)} />
                                                                            </TableCell>
                                                                            <TableCell>{timeAgo(row?.created_at)}</TableCell>
                                                                            <TableCell style={{ width: 160 }} align="right">
                                                                                <Dropdown className="dorpdown-curtom">
                                                                                    <Dropdown.Toggle as={IconButton} variant="link">
                                                                                        <MoreVert />
                                                                                    </Dropdown.Toggle>
                                                                                    <Dropdown.Menu>
                                                                                        <Dropdown.Item href="#" onClick={() => handleEditChange(row, 'edit')}>
                                                                                            <Edit style={{ marginRight: "8px" }} />Edit
                                                                                        </Dropdown.Item>
                                                                                        <Dropdown.Item href="#" onClick={() => handleEditChange(row, 'view')}>
                                                                                            <RemoveRedEyeIcon style={{ marginRight: "8px" }} />View
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
                                                :
                                                <div className="col-12 text-center px-2 mt-3">
                                                    <div class="alert alert-success text-capitalize" role="alert">
                                                        there are no data to display
                                                    </div>
                                                </div>
                                        }


                                    </>
                            }
                        </Paper>
            }

        </>
    );
};

export default SubAdmin;
