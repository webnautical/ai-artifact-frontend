import React, { useEffect, useState } from "react";
import {
    CardHeader,
    CardBody,
    Button
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
} from "@mui/material";
import { APICALL } from "../../../helper/api/api";
import AdminLoader from "../../components/AdminLoader";
import swal from "sweetalert";
import { TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
import BTNLoader from "../../../components/BTNLoader";
const GelatoPrice = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    useEffect(() => {
        getGelatoPriceFun();
    }, []);

    const getGelatoPriceFun = async () => {
        setLoading(true);
        try {
            const res = await APICALL("admin/getProductUid", "post", {});
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

    const [editIndex, setEditIndex] = useState(-1);
    const handleEditClick = (item, index) => {
        setPrice(item?.price)
        setEditIndex(index);
    };

    const handleSaveClick = async (item, index) => {
        setEditIndex(-1);
        try {
            const res = await APICALL('admin/updateProductUid', 'post', { price: parseInt(price), id: item?._id })
            if (res?.status) {
                const updatedList = [...data];
                updatedList[index].price = price;
                setData(updatedList);
                swal({
                    title: "Price Updated Successfully !!",
                    icon: "success",
                    button: { text: "OK", className: "swal_btn_ok" },
                });
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
        }
    };

    const refresh = async () => {
        setSubmitLoading(true)
        const res = await APICALL('admin/updateGelatoPrice', 'post', {})
        if (res?.status) {
            getGelatoPriceFun()
            setSubmitLoading(false)
        } else {
            setSubmitLoading(false)
        }
    }
    const startIndex = page * rowsPerPage;
    return (
        <Paper className="table_samepattern">
            {loading ? (
                <AdminLoader />
            ) : (
                <>
                    <CardHeader>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: '10px 14px 0px 14px' }} >
                            <h1 className="title-admins-table">Gelato Price</h1>
                            {
                                submitLoading ? <BTNLoader className={"artist-btn btn-sm"} /> :
                                    <Button type="button" className="artist-btn btn-sm" onClick={() => refresh()}>Refresh</Button>
                            }
                        </div>
                    </CardHeader>

                    <CardBody>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>S.No</TableCell>
                                        <TableCell>UID</TableCell>
                                        <TableCell>Gelato Price</TableCell>
                                        <TableCell>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{startIndex + index + 1}</TableCell>
                                                <TableCell>{row?.productUid}</TableCell>
                                                <TableCell>{row?.gelato_price?.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    {editIndex === index ? (
                                                        <div className="price_set d-flex justify-content-between">
                                                            <input type="text" className="" value={price} onChange={(e) => { setPrice(e.target.value) }} />
                                                            <button type="button" className="global_light_btn" onClick={() => handleSaveClick(row, index)}>
                                                                <i className="fa fa-save"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="d-flex price_set justify-content-between m-0">
                                                            <span >{row?.price}</span>
                                                            <button className="global_light_btn" onClick={() => handleEditClick(row, index)} >
                                                                <i className="fa fa-edit"></i>
                                                            </button>
                                                        </p>
                                                    )}
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
                </>
            )}
        </Paper>
    );
};

export default GelatoPrice;
