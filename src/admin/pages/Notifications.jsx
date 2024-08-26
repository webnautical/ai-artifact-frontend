import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    TablePagination,
    TableSortLabel,
    Paper,
} from "@mui/material";
import '../../App.css'

import { APICALL } from "../../helper/api/api";
import { auth, timeAgo } from "../../helper/Utility";
import AdminLoader from "../components/AdminLoader";
import { TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../helper/Constant";
const Notifications = () => {
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
            const api = auth('admin')?.user_role === 'admin' ? 'admin/adminNotifications' : 'artist/notifications'
            const res = await APICALL(api, 'post', {})
            setListLoading(false)
            console.log("notification", res)
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
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = data.filter(
        (item) =>
            item.user_name?.toLowerCase().includes(search?.toLowerCase()) ||
            item.message?.toLowerCase().includes(search?.toLowerCase())
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



    return (
        <>
            {

                <Paper className="table_samepattern">
                    {
                        listLoading ? <AdminLoader />
                            :
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", }} >
                                    <h1 className="title-admins-table">Notification</h1>
                                    <TextField
                                        variant="outlined"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={handleSearchChange}
                                        style={{ width: "300px" }}
                                    />
                                </div>

                                {
                                    data?.length > 0 ?
                                        <>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>S.No</TableCell>
                                                            {
                                                                auth('admin')?.user_role === 'admin' &&
                                                                <TableCell>Name</TableCell>
                                                            }
                                                            <TableCell>Notification</TableCell>
                                                            <TableCell> Date</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {sortedData
                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                            .map((row, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    {
                                                                        auth('admin')?.user_role === 'admin' &&
                                                                        <TableCell>{row?.user_name}</TableCell>
                                                                    }
                                                                    <TableCell>{row?.message}</TableCell>
                                                                    <TableCell>{timeAgo(row?.created_at || row?.createdAt)}</TableCell>
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

export default Notifications;
