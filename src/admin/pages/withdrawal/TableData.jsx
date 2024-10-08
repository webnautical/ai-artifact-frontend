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
import ConfirmModal from "../../../helper/ConfirmModal";
import { APICALL } from "../../../helper/api/api";

const TableData = (props) => {
    const logedRole = auth('admin')?.user_role
    const { totalPages, data, listLoading, setRowsPerPage, setPageNo, rowsPerPage, activeTab, tabsData, modal, setModal, setRowData, getListFun } = props
    const [page, setPage] = useState(0);
    const [selectedData, setSelectedData] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setPageNo(newPage + 1);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageNo(0);
    };

    const handleShowModal = (item, type) => {
        if (type === "Decline") {
            setSelectedData(item)
            setModalOpen(true)
        } else {
            setRowData(item)
            setModal({ ...modal, adminConfirm: true })
        }
    }

    const handleViewChange = (item) => {
        setModal({ ...modal, detailsPage: true })
        const action = { type: "view" }
        setRowData({ ...item, ...action })
    }

    const [loading, setLoading] = useState(false)
    const declinePaymnet = async () => {
        setLoading(true);
        try {
            const params = {
                "userId": selectedData?.user_id?._id,
                "amount": selectedData?.amount,
                "withdrawalId": selectedData?._id
            }
            const res = await APICALL(`admin/declineWithdraw`, "post", params);
            if (res?.status) {
                setLoading(false)
                setSelectedData(null)
                setModalOpen(false)
                getListFun()
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
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
                                                activeTab === "decline" ? <></>:
                                                    logedRole === "admin" ?
                                                    <TableCell> {tabsData?.status === "pending" ? "Withdrawal" : "Transaction"}  ID</TableCell>
                                                    :
                                                    <TableCell> {activeTab === "pending" ? "Withdrawal" : "Transaction"}  ID</TableCell>
                                            }
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Status</TableCell>
                                            {
                                                activeTab === "decline" ?
                                                    <TableCell align="right"> Decline Date </TableCell>
                                                    :
                                                    <TableCell align="right"> Date </TableCell>
                                            }
                                            {
                                                activeTab !== "decline" &&
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
                                                   activeTab === "decline" ? <></>:
                                                    logedRole === "admin" ?
                                                        <TableCell>{tabsData?.status === "pending" ? row._id : row?.stripeTransactionId}</TableCell>
                                                        :
                                                        <TableCell>{activeTab === "pending" ? row._id : row?.stripeTransactionId}</TableCell>
                                                }
                                                <TableCell>${row.amount}</TableCell>
                                                <TableCell>
                                                    <Button className={`btn btn-sm ${row?.status === "pending" ? 'btn-warning' : row?.status === "decline" ? "btn-danger" : 'btn-success'}`} >
                                                        {row?.status === "pending" ? "Pending" : row?.status === "decline" ? "Decline" : "Success"}
                                                    </Button>
                                                </TableCell>
                                                {
                                                    activeTab === "decline" ?
                                                        <TableCell align="right">{timeAgo(row.declineTimestamp)}</TableCell> :
                                                        <TableCell align="right">{timeAgo(row.createdAt)}</TableCell>
                                                }
                                                {
                                                    activeTab !== "decline" &&
                                                    logedRole === "admin" &&
                                                    (tabsData?.status === "pending" ?
                                                        <TableCell align="right">
                                                            <Button className={`global_btn me-2`} style={{ background: '008080' }} onClick={() => handleShowModal(row, "Decline")}> Decline</Button>

                                                            <Button className={`global_btn`} style={{ background: '008080' }} onClick={() => handleShowModal(row)}> Transfer</Button>
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
            <ConfirmModal {...{ modalOpen, setModalOpen, }} btn1="No" btn2="YES" submitLoading={loading} funCall={declinePaymnet} msg={<div><h5>Are you are sure? You want to decline this payment.</h5></div>} />
        </>
    );
};

export default TableData;
