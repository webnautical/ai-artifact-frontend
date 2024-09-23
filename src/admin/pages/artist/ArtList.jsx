import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Paper,
    TablePagination,
    Button,
} from "@mui/material";
import NoData from "../../../components/NoData";
import noDataImg from '../../../assets/images/animasi-emptystate.gif'
import { Col, Row } from "react-bootstrap";
import { Edit, MoreVert } from "@mui/icons-material";
import { Dropdown } from "react-bootstrap";
import AdminLoader from "../../components/AdminLoader";
import { APICALL } from "../../../helper/api/api";
import { auth, defaultIMG, imgBaseURL, tableImg, timeAgo } from "../../../helper/Utility";
import {
    TABLE_PAGINATION_DROPDOWN,
    TABLE_ROW_PER_PAGE,
} from "../../../helper/Constant";
import "../../../App.css";
import { StatusBtn } from "../../../components/StatusBtn";
import { useLocation, useNavigate } from "react-router";
const ArtList = () => {
    const locationData = useLocation()
    const locationDataOBJ = locationData?.state ? locationData?.state?.params : null
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
    const [data, setData] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [table, setTable] = useState(null)
    useEffect(() => {
        getDirectoryWiseArtworkFun()
    }, []);

    useEffect(() =>{
        if(locationDataOBJ){
            setTable(locationDataOBJ)
            getListFun(locationDataOBJ?._id)
        }
    },[locationDataOBJ])

    const getListFun = async (directory_id) => {
        setListLoading(true);
        try {
            const params = { directoryId: directory_id };
            const res = await APICALL("artist/artistProducts", "post", params);
            if (res?.status) {
                setData(res.data);
            } else { setData([]) }
        } catch (error) {
            console.error(error);
            setData([])
        } finally {
            setListLoading(false);
        }
    };

    const [directoryList, setDirectoryList] = useState([])
    const getDirectoryWiseArtworkFun = async () => {
        setListLoading(true);
        try {
            const res = await APICALL("artist/getDirectoryWiseArtwork", "post", {});
            if (res?.status) {
                setDirectoryList(res.data);
            } else { setDirectoryList([]) }
        } catch (error) {
            console.error(error);
            setDirectoryList([])
        } finally {
            setListLoading(false);
        }
    };

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

    const filteredData = data.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (row) => {
        navigate(`/${auth('admin')?.user_role}/art-work-upload`, { state: { data: row } })
    }

    const showTable = (item) => {
        setTable(item)
        getListFun(item?._id)
    }

    return (
        <>
            <Paper className="artis_inner_dashboard table_samepattern px-3">
                <div className="row-details py-3" style={{ display: "flex", justifyContent: "space-between" }} >
                    <div className="d-flex" style={{ gap: '10px' }}>
                        {table && <Button className="artist-btn" onClick={() => setTable(null)}><i class="fa-solid fa-arrow-left"></i></Button>}
                        <hh2 className="title-admins-table">Artworks {table && `- ${table?.name}`}</hh2>
                    </div>

                    {
                        table &&
                        <TextField
                            variant="outlined"
                            placeholder="Search..."
                            value={search}
                            onChange={handleSearchChange}
                            style={{ width: "300px" }}
                        />
                    }
                </div>
                {
                    table ?
                        <>
                            {listLoading ? (
                                <AdminLoader />
                            ) : (
                                <>
                                    {data.length > 0 ? (
                                        <>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>S.No</TableCell>
                                                            <TableCell>Image</TableCell>
                                                            <TableCell>Artwork Name</TableCell>
                                                            <TableCell>Category</TableCell>
                                                            <TableCell>Sub Category</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell align="right">Actions</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {filteredData
                                                            .slice(
                                                                page * rowsPerPage,
                                                                page * rowsPerPage + rowsPerPage
                                                            )
                                                            .map((row, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{tableImg(row.thumbnail)}</TableCell>
                                                                    <TableCell>{row.title}</TableCell>
                                                                    <TableCell>{row?.category?.name}</TableCell>
                                                                    <TableCell>{row?.subcategory?.name}</TableCell>
                                                                    <TableCell> {<StatusBtn btnName={
                                                                        row?.rejectStatus === 1 ? "Rejected" :
                                                                            row?.status ? "Approved" : "Pending"
                                                                    } status={row.status} rejectStatus={row.rejectStatus} />}   
                                                                    </TableCell>
                                                                    <TableCell>{timeAgo(row.createdAt)}</TableCell>
                                                                    <TableCell align="right">
                                                                        <Dropdown className="dorpdown-curtom">
                                                                            <Dropdown.Toggle as={IconButton} variant="link"> <MoreVert /> </Dropdown.Toggle>
                                                                            <Dropdown.Menu>
                                                                                <Dropdown.Item to="#" onClick={() => handleEdit(row)}>
                                                                                    <Edit /> Edit
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
                                                count={data.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />

                                        </>
                                    ) : (
                                        <div className="col-12 text-center mt-3">
                                            <div
                                                className="alert alert-success text-capitalize"
                                                role="alert"
                                            >
                                                There are no data to display
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                        :
                        <>
                        {

directoryList?.length > 0 ?

                        <Row className="gx-md-5 row row-cols-1 row-cols-sm-2 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 g-3 pt-1 ">
                    
                            {
                                listLoading ? <AdminLoader />
                                    :
                                    <>
                                        {
                                                directoryList?.map((item, i) => (
                                                    <Col className="mb-md-4 mb-3">
                                                        <div className="popular_box" style={{ cursor: 'pointer' }} onClick={() => showTable(item)}>
                                                            <Row>
                                                                {
                                                                    Array(4).fill(null).map((_, i) => (
                                                                        <Col xs={6} sm={6} md={6} lg={6} className="mb-4" key={i}>
                                                                            <div className="collection_grid">
                                                                                <img
                                                                                    className="w-100"
                                                                                    src={
                                                                                        item?.products?.[i]?.thumbnail
                                                                                            ? imgBaseURL() + item.products[i].thumbnail
                                                                                            : defaultIMG
                                                                                    }
                                                                                    alt="popular-collection-img"
                                                                                />
                                                                            </div>
                                                                        </Col>
                                                                    ))
                                                                }

                                                            </Row>

                                                            <div className="collection_by">
                                                                <div className="collection_by_details">
                                                                    <h4>{item?.name}</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))
                                               
                                        }
                                    </>
                            }

                        </Row>
                         :
                         <div className="text-center d-block">
                            <NoData msg={"Oops !! No Art Found"} img={noDataImg} />
                         </div>
                        }

                        </>
                }
            </Paper>


        </>
    )
}

export default ArtList