import React, { useEffect, useState } from "react";
import {
    CardHeader,
    CardBody,
    Button,
    Dropdown
} from "react-bootstrap";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    IconButton
} from "@mui/material";
import { APICALL } from "../../../helper/api/api";
import AdminLoader from "../../components/AdminLoader";
import swal from "sweetalert";
import { TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
import BTNLoader from "../../../components/BTNLoader";
import { formatdedDate, timeAgo } from "../../../helper/Utility";
import AddUpdateCoupon from "./AddUpdateCoupon";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
const CouponList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);

    const [addUpdPage, setAddUpdPage] = useState(false)
    useEffect(() => {
        getListFun();
    }, []);

    const getListFun = async () => {
        setLoading(true);
        try {
            const res = await APICALL("admin/getAllCoupons", "post", {});
            console.log("getAllCoupons", res);
            if (res?.status) {
                setData(res?.data);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [editData, setEditData] = useState(null)
    const handleAction = async (item, type) => {
        if(type === 'delete'){
            // setSubmitLoading(true)
            try {
                const res = await APICALL(`admin/deleteCoupon`, 'post', {id: item?._id})
                if (res?.status) {
                    swal({
                        title: res?.message,
                        icon: "success",
                        button: { text: "OK", className: "swal_btn_ok" },
                    });
                    getListFun()
                } else {
                    swal({
                        title: "Something Went Wrong !!",
                        icon: "error",
                        button: { text: "OK", className: "swal_btn_ok" },
                    });
                }
            } catch (error) {
                swal({
                    title: "Something Went Wrong !!",
                    icon: "error",
                    button: { text: "OK", className: "swal_btn_ok" },
                });
            } finally {
                // setSubmitLoading(false)
            }
        }else{
            setAddUpdPage(true)
            setEditData(item)
        }
    };

    const startIndex = page * rowsPerPage;
    return (
        <Paper className="table_samepattern">
            {loading ? (
                <AdminLoader />
            ) : (
                <>
                    <CardHeader>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: '10px 14px 0px 14px' }} >
                            <h1 className="title-admins-table">Coupon</h1>
                            <Button type="button" className="artist-btn btn-sm" onClick={() => {setAddUpdPage(!addUpdPage); setEditData(null)}}>Create Coupon</Button>
                        </div>
                    </CardHeader>
                    {
                        addUpdPage ?
                            <AddUpdateCoupon addUpdPage={addUpdPage} setAddUpdPage={setAddUpdPage} getListFun={getListFun} editData={editData} setEditData={setEditData} />
                            :
                            <CardBody>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>S.No</TableCell>
                                                <TableCell>Coupon</TableCell>
                                                <TableCell>Discount Type</TableCell>
                                                <TableCell>Discount Value</TableCell>
                                                <TableCell>Used/Total Coupon</TableCell>
                                                <TableCell>User Per Limit</TableCell>
                                                <TableCell>Purchase Amount</TableCell>
                                                <TableCell>Start Date</TableCell>
                                                <TableCell>End Date</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Created At</TableCell>
                                                <TableCell align="right">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{startIndex + index + 1}</TableCell>
                                                        <TableCell>{row?.code}</TableCell>
                                                        <TableCell>{row?.discountType}</TableCell>
                                                        <TableCell>{row?.discountValue}</TableCell>
                                                        <TableCell>{row?.usedCount}/{row?.totalUsageLimit}</TableCell>
                                                        <TableCell>{row?.userUsageLimit}</TableCell>
                                                        <TableCell>{row?.minPurchaseAmount}</TableCell>
                                                        <TableCell>{formatdedDate(row?.startDate)}</TableCell>
                                                        <TableCell>{formatdedDate(row?.endDate)}</TableCell>
                                                        <TableCell>{row?.status ? "ACTIVE" : "DEACTIVE"}</TableCell>
                                                        <TableCell>{timeAgo(row?.createdAt)}</TableCell>
                                                        <TableCell style={{ width: 160 }} align="right">
                                                            <Dropdown className="dorpdown-curtom">
                                                                <Dropdown.Toggle as={IconButton} variant="link">
                                                                    <MoreVert />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item href="#" onClick={() => handleAction(row, 'edit')}>
                                                                        <Edit style={{ marginRight: "8px" }} />Edit
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item href="#" onClick={() => handleAction(row, 'delete')}>
                                                                        <Delete style={{ marginRight: "8px" }} />Delete
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
                            </CardBody>
                    }
                </>
            )}
        </Paper>
    );
};

export default CouponList;
