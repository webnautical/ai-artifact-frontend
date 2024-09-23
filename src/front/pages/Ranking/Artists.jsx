import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Rating, Stack } from "@mui/material";
import { useDataContext } from "../../../helper/context/ContextProvider";
import { imgBaseURL } from "../../../helper/Utility";
import Spinner from "react-bootstrap/Spinner";
import { APICALL } from "../../../helper/api/api";
import { Link } from "react-router-dom";
import { useFrontDataContext } from "../../../helper/context/FrontContextProvider";

const Artists = () => {
  const { getTierImgFun, getRankTier, loading } = useDataContext();
  const { getProductListFun, addRemoveWishList } = useFrontDataContext();

  const [listLoading, setListLoading] = useState({
    artist: false,
    artwork: false,
  });

  const [topArtist, setTopArtist] = useState([]);
  const [topArtwork, setTopArtwork] = useState([]);

  const [selected, setSelected] = useState();
  const [openRows, setOpenRows] = useState({});

  const handleSelect = (k) => {
    setSelected(k);
    getTopArtist(k?._id);
  };

  const handleToggle = (artistId) => {
    setOpenRows({ [artistId]: true });
    getArtworkByArtist(artistId);
  };

  useEffect(() => {
    if (getRankTier) {
      setSelected(getRankTier[0]);
      getTopArtist(getRankTier[0]?._id);
    }
  }, [getRankTier]);

  useEffect(() => {
    if (topArtist?.length > 0) {
      setOpenRows({ [topArtist[0]?.artistId]: true });
      getArtworkByArtist(topArtist[0]?.artistId);
    }
  }, [topArtist]);

  useEffect(() => {
    getTierImgFun();
  }, []);

  const getTopArtist = async (tierId) => {
    setListLoading({ ...listLoading, artist: true });
    try {
      const res = await APICALL(`user/topfiveArtist`, "post", {
        tierId: tierId,
      });
      if (res?.status) {
        setTopArtist(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setListLoading({ ...listLoading, artist: false });
    }
  };

  const getArtworkByArtist = async (artistId) => {
    try {
      setListLoading({ ...listLoading, artwork: true });
      const res = await APICALL(`user/topTenArtworks`, "post", {
        artistId: artistId,
      });
      if (res?.status) {
        setTopArtwork(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setListLoading({ ...listLoading, artwork: false });
    }
  };

  return (
    <>
      <section className="ranking top_ten mt-5">
        <Container>
          <div className="shode_box">
            <div className="p-2">
              <Row className="align-items-center">
                <Col lg={6}>
                  <h1 className="left_global_heading">Ranking</h1>
                </Col>
                <Col lg={6} className="text-lg-end text-center">
                  <div className="tab-cus-buttons">
                    {getRankTier
                      ?.filter((item) => item?.name !== "Unranked")
                      ?.map((item, i) => (
                        <button
                          className={
                            item?.name === selected?.name ? "active" : ""
                          }
                          onClick={() => handleSelect(item)}
                        >
                          <img
                            src={imgBaseURL() + item?.icon}
                            alt="icon_tier"
                          />
                        </button>
                      ))}
                  </div>
                </Col>
              </Row>
            </div>

            <Tabs
              defaultActiveKey={selected?._id}
              id="uncontrolled-tab-example"
              className="mb-3 d-none"
              activeKey={selected?._id}
            >
              <Tab eventKey={selected?._id} title={selected?._id}>
                <Paper className="table_samepattern">
                  <TableContainer>
                    <Table
                      sx={{ minWidth: 650 }}
                      size="small"
                      aria-label="a dense table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Rank</TableCell>
                          <TableCell align="center">Artist Name</TableCell>
                          <TableCell align="center">Total Sales</TableCell>
                          <TableCell align="center">Total Revenue</TableCell>
                          <TableCell align="center">
                            Last Month Revenue
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className="text-center w-100">
                        {listLoading?.artist ? (
                          <TableCell colSpan={5} align="center">
                            <div className="text-center">
                              <Spinner
                                animation="border"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            </div>
                          </TableCell>
                        ) : topArtist?.length > 0 ? (
                          topArtist.map((row, i) => (
                            <React.Fragment key={row.artistId}>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                  cursor: "pointer",
                                }}
                                onClick={() => handleToggle(row.artistId)}
                              >
                                <TableCell component="th" scope="row">
                                  {i + 1}
                                </TableCell>
                                <TableCell align="center">
                                  {row.artistName}
                                </TableCell>
                                <TableCell align="center">
                                  {row.totalSalesCount}
                                </TableCell>
                                <TableCell align="center">
                                  ${row.totalCommissionAmount}
                                </TableCell>
                                <TableCell align="center">
                                  ${row.totalMonthlySalesAmount}
                                </TableCell>
                              </TableRow>

                              {openRows[row.artistId] && (
                                <TableRow>
                                  <TableCell colSpan={7} className="p-0">
                                    <Box bgcolor="white">
                                      <div className="product_list_box">
                                        <div className="row row-cols-5 row-cols-sm-5 row-cols-xl-5 row-cols-lg-5 row-cols-md-5 g-3 pt-1 ">
                                          {listLoading?.artwork ? (
                                            <div className="may_loader_box">

                                              <Spinner
                                                animation="border"
                                                role="status"
                                              >
                                                <span className="visually-hidden">
                                                  Loading...
                                                </span>
                                              </Spinner>

                                            </div>
                                          ) : topArtwork?.length > 0 ? (
                                            topArtwork?.map((item, i) => (
                                              <div className="col p-0">
                                                <Link
                                                  to={`/product-details/${item?._id}`}
                                                >
                                                  <div className="product_box">
                                                    <div className="main_show_image">
                                                      <img
                                                        className="w-100"
                                                        src={
                                                          imgBaseURL() +
                                                          item?.thumbnail
                                                        }
                                                        alt="product-img"
                                                      />
                                                    </div>

                                                    <div className="product_name">
                                                      {item?.title}
                                                    </div>
                                                    <div className="product_rating">
                                                      <Stack spacing={1}>
                                                        <Rating
                                                          name="half-rating-read"
                                                          defaultValue={
                                                            item?.averageRating
                                                          }
                                                          precision={0.5}
                                                          readOnly
                                                        />
                                                      </Stack>
                                                    </div>
                                                  </div>
                                                </Link>
                                                {/* <button className="wishlist border-0" onClick={() => {
                                            addRemoveWishList(item?._id, getProductListFun, true)
                                          }}>
                                            { item?.isWishlist ?
                                                <i class="fa-solid fa-heart" style={{ color: '#008080' }}></i>
                                                :
                                                <i className="fa-regular fa-heart"></i>
                                            }
                                          </button> */}
                                              </div>
                                            ))
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                      </div>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))
                        ) : (
                          <>
                            <TableCell colSpan={5} align="center">
                              <div className="text-center mt-3">
                                <h6>There are no artist on this rank !</h6>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Tab>
            </Tabs>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Artists;
