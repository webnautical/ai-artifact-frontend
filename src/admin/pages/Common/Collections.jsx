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
import { auth, timeAgo, toastifyError } from "../../../helper/Utility";
import {EditIcon,Delete} from '@mui/icons-material';
import AdminLoader from "../../components/AdminLoader";
import SwitchToggle from "../../../components/SwitchToggle";
import Form from 'react-bootstrap/Form';
import { Col, Dropdown, Row } from "react-bootstrap";
import { Edit, MoreVert } from "@mui/icons-material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from "../../../helper/Constant";
import { Link } from "react-router-dom";
const Collections = () => {


    const [pageType, setPageType] = useState(false)
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [orderBy, setOrderBy] = useState("");
    const [order, setOrder] = useState("asc");
    const [data, setData] = useState([])
    const [listLoading, setListLoading] = useState(false)
    const authCheck = auth("admin");

    useEffect(() => {
        getListFun()
    }, [])
    const getListFun = async () => {
        setListLoading(true)
        try {
            let params = { type: "all" };
            if (authCheck?.user_role !== "admin") {
                params = { artistId: authCheck?.id };
            }
            const res = await APICALL('artist/getartistDirectories', 'post', params)
            setListLoading(false)
            console.log(res?.data)
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

    const filteredData = data.filter(
        (item) =>
            item.name?.toLowerCase().includes(search?.toLowerCase())
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
    const [collectionName, setCollectionName] = useState('')
    const handleEditChange = (row, type) => {
        if(type === "delete"){
            handleUpdate(row?._id, type)
        }else{
            setPageType(type)
            setUpdate(row)
            setCollectionName(row?.name)
        }
    }

    const handleUpdate = async (id, type) => {
        try {
            const params = {
                "directoryId": id,
                "type": type,
                "name": collectionName
            }
            const res = await APICALL('artist/updateAndDeleteDirectory', 'post', params)
            if (res?.status) {
                getListFun()
                setPageType(false); 
                setUpdate(null)
            }
        } catch (error) {
            toastifyError(error.response.data?.message)
            console.error('API call error:', error);
        }
    };

    return (
        <>
            {
                pageType === 'update' ?
                    <>
                        <Paper className="table_samepattern">
                            <>
                                <Row style={{ display: "flex", justifyContent: "space-between", padding: "10px", }} >
                                    <Col md={6}>
                                        <h1 className="title-admins-table">Edit Collection</h1>
                                    </Col>
                                   <Col md={2} className="text-end">
                                   <button className="artist-btn" onClick={()=>{setPageType(false); setUpdate(null)}}>Back</button>
                                   </Col>
                                </Row>
                                   <div className="p-3">
                                   <Col md={6} className="mt-3">
                                        <TextField
                                            className="w-100"
                                            variant="outlined"
                                            value={collectionName}
                                            onChange={(e) => setCollectionName(e.target.value)}
                                            style={{ width: "300px" }}
                                        />
                                        <button className="artist-btn mt-2" onClick={()=>handleUpdate(updData?._id, pageType)}>Update</button>
                                    </Col>
                                   </div>
                            </>
                        </Paper>

                    </>
                    :
                    <Paper className="table_samepattern">
                        {
                            listLoading ? <AdminLoader />
                                :
                                <>
                                    <Row style={{ display: "flex", justifyContent: "space-between", padding: "10px", }} >
                                        <Col md={6}>
                                            <h1 className="title-admins-table">Collections</h1>
                                        </Col>

                                        <Col md={3}>
                                            <TextField
                                                className="w-100"
                                                variant="outlined"
                                                placeholder="Search..."
                                                value={search}
                                                onChange={handleSearchChange}
                                                style={{ width: "300px" }}
                                            />
                                        </Col>
                                    </Row>
                                    {
                                        data?.length > 0 ?
                                            <>
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell> S.No</TableCell>
                                                                <TableCell>Name</TableCell>
                                                                <TableCell>Artist Name</TableCell>
                                                                <TableCell align="right">Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {sortedData
                                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                .map((row, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell>{row?.name}</TableCell>
                                                                        <TableCell><Link to={`/admin/user-management-details/${row?.artistId?._id}`}>{row?.artistId?.first_name +" "+ row?.artistId?.last_name}</Link></TableCell>
                                                                        <TableCell style={{ width: 160 }} align="right">
                                                                            <Dropdown className="dorpdown-curtom">
                                                                                <Dropdown.Toggle as={IconButton} variant="link">
                                                                                    <MoreVert />
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu>
                                                                                    <Dropdown.Item href="#" onClick={() => handleEditChange(row, 'update')}>
                                                                                        <Edit style={{ marginRight: "8px" }} />Edit
                                                                                    </Dropdown.Item>
                                                                                    <Dropdown.Item href="#" onClick={() => handleEditChange(row, 'delete')}>
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
                    </Paper>
            }

        </>
    );
};

export default Collections;
