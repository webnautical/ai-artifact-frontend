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
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Rating, Stack } from "@mui/material";
import ReactApexChart from 'react-apexcharts';
import { useDataContext } from "../../../helper/context/ContextProvider";
import { useFrontDataContext } from "../../../helper/context/FrontContextProvider";
import { imgBaseURL } from "../../../helper/Utility";
import { APICALL } from "../../../helper/api/api";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
const RankingStatus = () => {
  const { getTierImgFun, getRankTier, loading } = useDataContext()
  const { getProductListFun, addRemoveWishList } = useFrontDataContext();
 
  const [listLoading, setListLoading] = useState({
    'artist': false,
    'artwork': false
  })
 
  const [topArtist, setTopArtist] = useState([])
  const [salesHistroy, setSalesHistory] = useState([])
  const [activeArtist, setActiveArtist] = useState()
 
  const [selected, setSelected] = useState();
  const [openRows, setOpenRows] = useState({});
 
  const [period, setPeriod] = useState('week');
  const [topArtwork, setTopArtwork] = useState([]);
 
  const categories = period === "week" ? salesHistroy?.map(item => item.dayName || '') : period === "month" ?  salesHistroy?.map(item => item.period || '') : salesHistroy?.map(item => item.monthName || '');
  const salesAmounts = salesHistroy?.map(item => (item.totalSalesAmount ? item.totalSalesAmount.toFixed(2) : 0));
 
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true, // set to true to show the toolbar
        tools: {
          download: false // disables the download options (CSV, PNG, SVG)
        }
      }
    

    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories
    },
    fill: {
      opacity: 1,
      colors: ['#036565'],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `$${val}`;
        },
      },
    },
  };
 
  const series = [
    {
      name: 'Revenue',
      data: salesAmounts || []
    },
  ];
  const handleSelect = (k) => {
    setSelected(k);
    getTopArtist(k?._id)
  };
  const handleChange = (event) => {
    setPeriod(event.target.value);
    getSalesHistroyByArtist(activeArtist, event.target.value)
  };
 
  const handleToggle = (artistId) => {
    setOpenRows({ [artistId]: true })
    setActiveArtist(artistId)
    getSalesHistroyByArtist(artistId, period)
    getArtworkByArtist(artistId)
  };
 
  useEffect(() => {
    if (getRankTier) {
      setSelected(getRankTier[0])
      getTopArtist(getRankTier[0]?._id)
    }
  }, [getRankTier])
 
  useEffect(() => {
    if (topArtist?.length > 0) {
      setOpenRows({ [topArtist[0]?.artistId]: true })
      setActiveArtist(topArtist[0]?.artistId)
      getSalesHistroyByArtist(topArtist[0]?.artistId, period)
      getArtworkByArtist(topArtist[0]?.artistId)
 
    }
  }, [topArtist])
 
 
  useEffect(() => {
    getTierImgFun()
  }, [])
 
  const getTopArtist = async (tierId) => {
    setListLoading({ ...listLoading, 'artist': true })
    try {
      const res = await APICALL(`user/topfiveArtist`, 'post', { tierId: tierId })
      if (res?.status) {
        setTopArtist(res?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setListLoading({ ...listLoading, 'artist': false })
    }
  }
 
  const getSalesHistroyByArtist = async (artistId, period) => {
    try {
      setListLoading({ ...listLoading, 'artwork': true })
      const res = await APICALL(`user/getSalesHistory`, 'post', { artistId: artistId, "period": period })
      console.log("getSalesHistory", res)
      if (res?.status) {
        setSalesHistory(res?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setListLoading({ ...listLoading, 'artwork': false })
    }
  }
 
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
                    {
                      getRankTier?.filter(item => item?.name !== "Unranked")?.map((item, i) => (
                        <button className={item?.name === selected?.name ? "active" : ""} onClick={() => handleSelect(item)} >
                          <img src={imgBaseURL() + item?.icon} alt="icon_tier" />
                        </button>
                      ))
                    }
                  </div>
                </Col>
              </Row>
            </div>
 
            <Tabs defaultActiveKey={selected?._id} id="uncontrolled-tab-example" className="mb-3 d-none" activeKey={selected?._id} >
              <Tab eventKey={selected?._id} title={selected?._id}>
                <Paper className="table_samepattern">
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Tier</TableCell>
                          <TableCell align="center">Artist Name</TableCell>
                          <TableCell align="center">Total Sales</TableCell>
                          <TableCell align="center">Total Revenue</TableCell>
                          <TableCell align="center">Last Month Revenue</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
 
                        {
                          listLoading?.artist ? <>
                            <TableCell colSpan={5} align="center">
                              <Spinner
                                animation="border"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
 
                            </TableCell>
                          </> :
                            topArtist?.length > 0 ?
                              topArtist.map((row, i) => (
                                <React.Fragment key={row.artistId}>
                                  <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }} onClick={() => handleToggle(row.artistId)} >
                                    <TableCell component="th" scope="row">
                                      {i + 1}
                                    </TableCell>
                                    <TableCell align="center">{row.artistName}</TableCell>
                                    <TableCell align="center">{row.totalSalesCount}</TableCell>
                                    <TableCell align="center">${row.totalCommissionAmount}</TableCell>
                                    <TableCell align="center">${row.totalMonthlySalesAmount}</TableCell>
                                  </TableRow>
                                  {openRows[row.artistId] && (
                                    <TableRow>
                                      <TableCell colSpan={7}>
                                        <Box p={2} bgcolor="white">
                                        <Box bgcolor="white">
                                            <div className="product_list_box mb-3">
                                              <h3 className="left_global_heading mb-4">Top Artworks</h3>
                                              <div className="row row-cols-5 row-cols-sm-5 row-cols-xl-5 row-cols-lg-5 row-cols-md-5 g-3 pt-1 ">
                                                {topArtwork?.length > 0 ? (
                                                  topArtwork?.slice(0, 5)?.map((item, i) => (
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
                                                    </div>
                                                  ))
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                            </div>
                                          </Box>
                                          <ReactApexChart options={options} series={series} type="bar" height={350} />
                                          <div className="d-flex justify-content-center">
                                            <div className="d-flex align-items-center">
                                              <div className="mx-3"><FormLabel id="demo-row-radio-buttons-group-label">By</FormLabel></div>
                                              <div>
                                                <FormControl>
                                                  <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group" value={period} onChange={handleChange}>
                                                    <FormControlLabel value="year" control={<Radio />} label="Year" />
                                                    <FormControlLabel value="month" control={<Radio />} label="Month" />
                                                    <FormControlLabel value="week" control={<Radio />} label="Week" />
                                                  </RadioGroup>
                                                </FormControl>
                                              </div>
                                            </div>
                                          </div>
                                         
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </React.Fragment>
                              ))
                              :
                              <>
                                <TableCell colSpan={5} align="center">
                                  <div className="text-center mt-3">
                                    <h6>There are no artist on this tier !</h6>
                                  </div>
                                </TableCell>
                              </>
                        }
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
  )
}
 
export default RankingStatus