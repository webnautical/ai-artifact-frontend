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
    Paper,
    IconButton,
    Button
} from "@mui/material";
import '../../../App.css'

import { APICALL } from "../../../helper/api/api";
import { auth, tableImg, timeAgo } from "../../../helper/Utility";
import AdminLoader from "../../components/AdminLoader";
import { TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
import { Dropdown } from "react-bootstrap";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { MoreVert } from "@mui/icons-material";
import SoldArtDetails from "./SoldArtDetails";
const SoldArt = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [data, setData] = useState([])
    const [listLoading, setListLoading] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        getListFun()
    }, [])
    const getListFun = async () => {
        setListLoading(true)
        try {
            const end = auth('admin')?.user_role === "artist" ? "artist/getArtistOrders" : "affiliate/getAffiliateOrders"
            const res = await APICALL(end, 'post', {})
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
        (item) => item.productId?.title?.toLowerCase().includes(search?.toLowerCase()) || item.productId?.title?.toLowerCase().includes(search?.toLowerCase())
    );

    const handleViewChange = (row) => {
        setSelectedRow(row);
    };

    return (
        <>
            {

                <Paper className="table_samepattern">
                    {
                        listLoading ? <AdminLoader />
                            :
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", }} >
                                    <div className="d-flex" style={{ gap: '10px' }}>
                                        {selectedRow && <Button className="artist-btn" onClick={() => setSelectedRow(null)}><i class="fa-solid fa-arrow-left"></i></Button>}
                                        <h2 className="title-admins-table m-0">{selectedRow ? "Sold Art Details" : "Sold Arts"}</h2>
                                    </div>
                                    {!selectedRow &&
                                        <TextField
                                            variant="outlined"
                                            placeholder="Search..."
                                            value={search}
                                            onChange={handleSearchChange}
                                            style={{ width: "300px" }}
                                        />}
                                </div>


                                {selectedRow ? <SoldArtDetails selectedRow={selectedRow}/>
                                    :
                                    <>
                                        {data?.length > 0 ?
                                            <>
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>S.No</TableCell>
                                                                <TableCell>Img</TableCell>
                                                                <TableCell>Order ID</TableCell>
                                                                <TableCell>Title</TableCell>
                                                                <TableCell>Quantity</TableCell>
                                                                <TableCell>Price</TableCell>
                                                                <TableCell>Total Price</TableCell>
                                                                <TableCell>Discount</TableCell>
                                                                <TableCell>Commission</TableCell>
                                                                <TableCell>Status</TableCell>
                                                                <TableCell>Date</TableCell>
                                                                <TableCell align="right">Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                .map((row, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell>{tableImg(row.productId?.thumbnail)}</TableCell>
                                                                        <TableCell>{row?.orderId?._id}</TableCell>
                                                                        <TableCell>{row?.productId?.title}</TableCell>
                                                                        <TableCell>{row?.quantity}</TableCell>
                                                                        <TableCell>${row?.price?.toFixed()}</TableCell>
                                                                        <TableCell>${row?.price?.toFixed() * row?.quantity}</TableCell>
                                                                        <TableCell>{row?.discount ? `$${row?.discount?.toFixed(2)}` : "---"}</TableCell>
                                                                        <TableCell>${row?.commissionAmount}</TableCell>
                                                                        <TableCell className="text-capitalize">{row?.refundStatus}</TableCell>
                                                                        <TableCell>{timeAgo(row?.created_at || row?.createdAt)}</TableCell>
                                                                        <TableCell align="right">
                                                                            <Dropdown className="dorpdown-curtom">
                                                                                <Dropdown.Toggle as={IconButton} variant="link" > <MoreVert /></Dropdown.Toggle>
                                                                                <Dropdown.Menu>
                                                                                    <Dropdown.Item href="#" onClick={() => handleViewChange(row, "view")}>
                                                                                        <RemoveRedEyeIcon style={{ marginRight: "8px" }} /> View
                                                                                    </Dropdown.Item>
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                {/* {data?.length > rowsPerPage && */}
                                                <TablePagination
                                                    rowsPerPageOptions={TABLE_PAGINATION_DROPDOWN}
                                                    component="div"
                                                    count={data?.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                                {/* } */}
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
                            </>
                    }
                </Paper>
            }

        </>
    );
};

export default SoldArt;
