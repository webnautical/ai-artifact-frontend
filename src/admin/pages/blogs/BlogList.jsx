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
} from "@mui/material";
import '../../../App.css'

import { APICALL } from "../../../helper/api/api";
import { auth, tableImg, timeAgo } from "../../../helper/Utility";
import AdminLoader from "../../components/AdminLoader";
import { TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
import { Dropdown } from "react-bootstrap";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import swal from "sweetalert";
import AddUpdBlog from "./AddUpdBlog";
import HTMLContent from "../../../components/HTMLContent";

const BlogList = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [orderBy, setOrderBy] = useState("");
    const [order, setOrder] = useState("asc");
    const [data, setData] = useState([])
    const [listLoading, setListLoading] = useState(false)
    const [addUpdPage, setAddUpdPage] = useState(false)

    useEffect(() => {
        getListFun()
    }, [])
    const getListFun = async () => {
        setListLoading(true)
        try {
            const api = auth('admin')?.user_role === 'admin' ? 'admin/allBlogs' : 'artist/notifications'
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
        (item) =>
            item.content?.toLowerCase().includes(search?.toLowerCase()) ||
            item.title?.toLowerCase().includes(search?.toLowerCase())
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

    const [editData, setEditData] = useState(null)
    const handleAction = async (item, type) => {
        if (type === 'delete') {
            // setSubmitLoading(true)
            try {
                const res = await APICALL(`admin/deleteBlog`, 'post', { id: item?._id })
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
        } else {
            setAddUpdPage(true)
            setEditData(item)
        }
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
                                    <h1 className="title-admins-table">Blog</h1>
                                    {
                                        !addUpdPage &&
                                        <div>
                                            <TextField
                                                variant="outlined"
                                                placeholder="Search..."
                                                value={search}
                                                onChange={handleSearchChange}
                                                style={{ width: "300px" }}
                                            />
                                            <button type="button" onClick={() => { setAddUpdPage(true); setEditData(null) }} className="artist-btn ms-2"> Add New</button>
                                        </div>
                                    }
                                </div>

                                {
                                    addUpdPage ? <> <AddUpdBlog addUpdPage={addUpdPage} setAddUpdPage={setAddUpdPage} getListFun={getListFun} editData={editData} setEditData={setEditData} /> </>
                                        :
                                        <>
                                            {
                                                data?.length > 0 ?
                                                    <>
                                                        <TableContainer>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>S.No</TableCell>
                                                                        <TableCell>Blog Image</TableCell>
                                                                        <TableCell>Blog Title</TableCell>
                                                                        <TableCell>Content</TableCell>
                                                                        <TableCell>Date</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {sortedData
                                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                        .map((row, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>{index + 1}</TableCell>
                                                                                <TableCell>{tableImg(row.image)}</TableCell>
                                                                                <TableCell>{row?.title}</TableCell>
                                                                                <TableCell> <div className="d-flex"><HTMLContent data={row?.content.slice(0, 70)}/> {row?.content?.length > 70 &&  <div>...</div>} </div> </TableCell>

                                                                                {/* <TableCell> <HTMLContent data={row?.content.slice(0, 70)} /> </TableCell> */}
                                                                                <TableCell>{timeAgo(row?.created_at || row?.createdAt)}</TableCell>
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

export default BlogList;
