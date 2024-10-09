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

import { APICALL } from "../../../helper/api/api";
import AdminLoader from "../../components/AdminLoader";
import { SERVER_ERR, SOMETHING_ERR, TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
import { formatdedDate, handleDownloadExcel, timeAgo, toastifyError, toastifySuccess } from "../../../helper/Utility";
import { Row, Col } from "react-bootstrap";

const SubscribersList = () => {
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
            const api = `admin/getAllSubscribers`
            const res = await APICALL(api, 'post', {})
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
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = data.filter(
        (item) => item.email?.toLowerCase().includes(search?.toLowerCase())
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

    const changeArrFilterData = (filteredData) => {
        const result = filteredData?.map((sponsor, i) =>
        ({
            "S.No": i+1,
            "EMAIL": sponsor.email,
            "Date": formatdedDate(sponsor.createdAt),
        })
        )
        return result
    }

    const downloadExcel = (type) => {
        handleDownloadExcel(changeArrFilterData(data), "Subscribers", "subscribers")
    };

    const handleDelete = async (id) => {
        try {
            const api = `admin/deleteSubscriber`
            const res = await APICALL(api, 'post', {id: id})
            if (res?.status) {
                getListFun()
                toastifySuccess(res?.message)
            }
        } catch (error) {
            toastifyError(SERVER_ERR)
        }
    }

    return (
        <>
            {

                <Paper className="table_samepattern">
                    {
                        listLoading ? <AdminLoader />
                            :
                            <>
                                <Row style={{ display: "flex", justifyContent: "space-between", padding: "10px", }} >
                                <Col md={6}>
                                <h1 className="title-admins-table">Subscribers</h1>
                                </Col>
                                <Col md={3}>
                                    <div>
                                    <TextField
                                    className="w-100"
                                        variant="outlined"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={handleSearchChange}
                                        style={{ width: "300px" }}
                                    />
                                  <div className="mt-3 text-end">
                                  <button onClick={downloadExcel} className="artist-btn ms-2">Export</button>
                                  </div>
                                    </div>

                                    </Col>
                                </Row>

                                {
                                    data?.length > 0 ?
                                        <>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>S.No</TableCell>
                                                            <TableCell>Email</TableCell>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell align="right">Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {sortedData
                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                            .map((row, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{row?.email}</TableCell>
                                                                    <TableCell>{timeAgo(row?.created_at || row?.createdAt)}</TableCell>
                                                                    <TableCell align="right"><button className="global_light_btn text-danger" onClick={() => handleDelete(row?._id)}><i className="fa fa-trash"></i></button></TableCell>
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

export default SubscribersList;
