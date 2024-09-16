import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TablePagination,
    IconButton,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { Dropdown } from "react-bootstrap";
import AdminLoader from "../../components/AdminLoader";
import { auth, timeAgo } from "../../../helper/Utility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
    TABLE_PAGINATION_DROPDOWN,
} from "../../../helper/Constant";
import "../../../App.css";

const TableData = (props) => {
    const logedRole = auth('admin')?.user_role
    const { totalPages, data, listLoading, setRowsPerPage, setPageNo, rowsPerPage, activeTab, tabsData , modal, setModal,setRowData} = props
    const [page, setPage] = useState(0);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setPageNo(newPage + 1);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageNo(0);
    };

    const handleShowModal = (item) => {
        setRowData(item)
        setModal({...modal, adminConfirm: true})
    }

    const handleViewChange = (item) => {
        setModal({...modal, detailsPage: true})
        const action = {type: "view"}
        setRowData({...item, ...action})
    }

    return (
        <>

            {listLoading ? (
                <AdminLoader />
            ) : (
                <>
                    {data?.length > 0 ? (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>S.No</TableCell>
                                            {
                                                logedRole === "admin" ?
                                                    <TableCell> {tabsData?.status === "pending" ? "Withdrawal" : "Transaction"}  ID</TableCell>
                                                    :
                                                    <TableCell> {activeTab === "pending" ? "Withdrawal" : "Transaction"}  ID</TableCell>
                                            }
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right"> Date </TableCell>
                                            {
                                                auth('admin')?.user_role === "admin" &&
                                                <TableCell align="right">Actions</TableCell>
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                {
                                                    logedRole === "admin" ?
                                                        <TableCell>{tabsData?.status === "pending" ? row._id : row?.stripeTransactionId}</TableCell>
                                                        :
                                                        <TableCell>{activeTab === "pending" ? row._id : row?.stripeTransactionId}</TableCell>
                                                }
                                                <TableCell>${row.amount}</TableCell>
                                                <TableCell>
                                                    <Button className={`btn btn-sm ${row?.status === "pending" ? 'btn-warning' : 'btn-success'}`} >
                                                        {row?.status === "pending" ? "Pending" : "Success"}
                                                    </Button>
                                                </TableCell>
                                                <TableCell align="right">{timeAgo(row.createdAt)}</TableCell>
                                                {
                                                    logedRole === "admin" &&
                                                    (tabsData?.status === "pending" ?
                                                        <TableCell align="right">
                                                            <Button className={`global_btn`} style={{ background: '008080' }} onClick={()=>handleShowModal(row)}> Trasnfer</Button>
                                                        </TableCell>
                                                        :
                                                        <TableCell align="right">
                                                            <Dropdown className="dorpdown-curtom">
                                                                <Dropdown.Toggle as={IconButton} variant="link">
                                                                    {" "}
                                                                    <MoreVert />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item href="#" onClick={() => handleViewChange(row)}>
                                                                        <RemoveRedEyeIcon style={{ marginRight: "8px" }} />View
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </TableCell>)
                                                }
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
                            <div className="alert alert-success text-capitalize" role="alert" >There are no data to display </div>
                        </div>
                    )}
                </>
            )}
            
        </>
    );
};

export default TableData;
