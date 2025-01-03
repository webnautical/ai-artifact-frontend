import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDataContext } from "../../../helper/context/ContextProvider";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { Button, Col, Row } from "react-bootstrap";
import { imgBaseURL, tableImg, timeAgo } from "../../../helper/Utility";
import MainCard from "../../components/MainCard";
import { Box } from "@mui/system";
import ApexCharts from "react-apexcharts";
import AdminLoader from "../../components/AdminLoader";
import { Link } from "react-router-dom";
import { APICALL } from "../../../helper/api/api";
import AnalyticEcommerce from "../../components/cards/statistics/AnalyticEcommerce";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import orderlisticon from '../../../assets/images/orderlist.png'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { Dropdown } from "react-bootstrap";
import IncomeAreaChart from "../dashboard/IncomeAreaChart";
import { purple } from "@mui/material/colors";
const options = {
  chart: {
    type: "radialBar",
    offsetY: -10,
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        margin: 0,
        size: "70%",
        background: "transparent",
      },
      track: {
        background: "purple",
        strokeWidth: "97%",
      },
      dataLabels: {
        name: {
          offsetY: 5,
          color: "#888",
          fontSize: "15px",
        },
        value: {
          offsetY: -20,
          color: "#111",
          fontSize: "22px",
          fontWeight: "bold",
        },
      },
    },
  },
  fill: {
    type: "solid",
  },
  colors: ["#800080"],
  stroke: {
    lineCap: "round",
  },
  labels: [""],
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


const ViewUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listLoading, setListLoading] = useState({
    artist_info: false,
  });
  const { userInfoByID, getUserByIDFun, userDetailsLoading, loading } =
    useDataContext();
  useEffect(() => {
    getUserByIDFun(id);
    getListFun()
  }, []);

  useEffect(() => {
    if (userInfoByID) {
      getArtistInfo();
    }
  }, [userInfoByID]);

  const [dashboardInfo, setDashboardInfo] = useState(null);
  const getArtistInfo = async () => {
    setListLoading({ ...listLoading, artist_info: true });
    try {
      const api =
        userInfoByID?.user_role === "artist"
          ? "artist/ArtistDashboard"
          : userInfoByID?.user_role === "affiliate"
            ? "affiliate/AffiliateDashboard"
            : "admin/AdminDashboard";

      const params =
        userInfoByID?.user_role === "artist"
          ? { artistId: id }
          : userInfoByID?.user_role === "affiliate"
            ? { affiliateId: id }
            : {};

      const res = await APICALL(api, "post", params);
      if (res?.status) {
        setDashboardInfo(res?.data);
      } else {
        setDashboardInfo(null);
      }
    } catch (error) {
      console.log(error);
      setDashboardInfo(null);
    } finally {
      setListLoading({ ...listLoading, artist_info: false });
    }
  };
  const handleClick = (item) => {
    const url = `/product-details/${item?.artworkId}`;
    window.open(url, "_blank");
  };

  const forCharData = {
    role: userInfoByID?.user_role,
    id: userInfoByID?._id,
  };
  const [orders, setOrders] = useState([])

  const getListFun = async () => {
    try {
      const res = await APICALL("admin/allOrders", "post", { customerId: id });
      if (res?.status) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleButton = (row) => {
    navigate('/admin/orders/list', { state: { orderDetails: row } })
  }

  console.log("dashboardInfo",dashboardInfo)

  return (
    <>
      {userDetailsLoading ? (
        <AdminLoader />
      ) : (
        <Row className="justify-content-center">
          <Col md={12}>
            <Paper className=" p-3">
              <div className="row-details">
                <div
                  className="d-flex justify-content-between align-items-center mb-4"
                  style={{ gap: "10px" }}
                >
                  <div>
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <Link
                        className="artist-btn d-inline-block"
                        onClick={() => navigate(-1)}
                      >
                        <i class="fa-solid fa-arrow-left"></i>
                      </Link>
                      <h2 className="title-admins-table m-0 text-capitalize">
                        {userInfoByID?.first_name +
                          " " +
                          userInfoByID?.last_name}
                      </h2>
                    </div>
                  </div>

                  <div>
                    <p className="m-0">
                      {" "}<i class="fa-solid fa-envelope" style={{ color: 'purple' }}></i>
                      <strong> {userInfoByID?.email}</strong>
                    </p>
                  </div>
                </div>

                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="mb-3"
                >
                  {userInfoByID?.user_role === "artist" && (
                    <>
                      <Grid item xs={12} sm={6} md={4} lg={2}>
                        <AnalyticEcommerce
                          title="Total Artwork"
                          count={<><>{dashboardInfo?.totalArtwork || 0}</>  {<>/ {dashboardInfo?.artistData?.highestRank?.maxUploads}</>} </>}
                          percentage={59.3}
                          extra="35,000"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={2}>
                        <AnalyticEcommerce
                          title="Approved Artworks"
                          count={dashboardInfo?.approvedArtworks || 0}
                          percentage={70.5}
                          extra="8,900"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={2}>
                        <AnalyticEcommerce
                          title="Pending Artworks"
                          count={dashboardInfo?.pendingArtworks || 0}
                          percentage={27.4}
                          isLoss
                          color="warning"
                          extra="1,943"
                        />
                      </Grid>
                    </>
                  )}
                  {(userInfoByID?.user_role === "artist" ||
                    userInfoByID?.user_role === "affiliate") && (
                      <>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                          <AnalyticEcommerce
                            title="Total Sold Items"
                            count={dashboardInfo?.totalSoldItems || 0}
                            percentage={27.4}
                            isLoss
                            color="warning"
                            extra="$20,395"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                          <AnalyticEcommerce
                            title="Total Revenue"
                            count={`$${dashboardInfo?.totalRevenue
                              ? dashboardInfo?.totalRevenue?.toFixed(2)
                              : 0
                              }`}
                            percentage={27.4}
                            isLoss
                            color="warning"
                            extra="$20,395"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} md={3} lg={2}>
                          <AnalyticEcommerce
                            title="Total Commission"
                            count={`$${dashboardInfo?.totalCommission
                              ? dashboardInfo?.totalCommission?.toFixed(2)
                              : 0
                              }`}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                          <AnalyticEcommerce
                            title="Total Paid"
                            count={`$${typeof dashboardInfo?.totalPaid === "number"
                              ? dashboardInfo.totalPaid
                              : 0
                              }`}
                            percentage={27.4}
                            isLoss
                            color="warning"
                            extra="$20,395"
                          />
                        </Grid>
                      </>
                    )}
                </Grid>

                <Row className="">
                  <Col md={12}>
                    <Row className="">
                      <Col md={12}>

                        <div>
                          {userInfoByID?.user_role === "customer" && (
                            <>
                              <Col md={12} className="mb-3 mt-2">
                                <h5>
                                  <strong>Address</strong>
                                </h5>
                                <div className="table_border">
                                  <p>
                                    {" "}
                                    <strong>Address 1:</strong>{" "}
                                    {userInfoByID?.address1 || "---"}
                                  </p>
                                  <p>
                                    {" "}
                                    <strong>Address 2:</strong>{" "}
                                    {userInfoByID?.address2 || "---"}
                                  </p>
                                  <p>
                                    {" "}
                                    <strong>State:</strong>{" "}
                                    {userInfoByID?.state || "---"}
                                  </p>
                                  <p>
                                    {" "}
                                    <strong>City:</strong>{" "}
                                    {userInfoByID?.city || "---"}
                                  </p>
                                  <p>
                                    {" "}
                                    <strong>Postal Code:</strong>{" "}
                                    {userInfoByID?.postalCode || "---"}
                                  </p>
                                </div>
                              </Col>
                              <Col md={12} className="mb-3 mt-2">
                                <div className='order_list_talbe'>
                                  {
                                    orders?.length > 0 ?
                                      <TableContainer component={Paper} className='p-0'>
                                        <Table aria-label="customized table">
                                          <TableHead>
                                            <TableRow>

                                              <StyledTableCell>S.No</StyledTableCell>
                                              <StyledTableCell>Order ID</StyledTableCell>
                                              {/* <StyledTableCell>Customer Name</StyledTableCell> */}
                                              <StyledTableCell>Price</StyledTableCell>
                                              <StyledTableCell>Status</StyledTableCell>
                                              <StyledTableCell>Payment</StyledTableCell>
                                              <StyledTableCell> Date </StyledTableCell>
                                              <StyledTableCell align="right">Actions</StyledTableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {orders?.map((row, index) => (
                                              <TableRow key={index}>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell>{row._id}</StyledTableCell>
                                                {/* <StyledTableCell>{row.shippingAddress?.firstName + " " + row?.shippingAddress?.lastName}</StyledTableCell> */}
                                                <StyledTableCell>${row.totalPrice}</StyledTableCell>
                                                <StyledTableCell>{row.status}</StyledTableCell>
                                                <StyledTableCell>{row.paymentGateway}</StyledTableCell>
                                                <StyledTableCell>{timeAgo(row.createdAt)}</StyledTableCell>
                                                <StyledTableCell align="right">
                                                  <button className='order_view_btn' onClick={() => handleButton(row)}>
                                                    <RemoveRedEyeIcon style={{ marginRight: "4px" }} /> View
                                                  </button>
                                                </StyledTableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>

                                        </Table>
                                      </TableContainer>
                                      :
                                      <>
                                        <div className='cart_em_img text-center'>
                                          <img src={orderlisticon} style={{ width: '128px ' }} alt='order-list-icon' />
                                          <h5 className='mt-2'>They haven't placed any orders yet.</h5>
                                          {/* <p> Start shopping now!</p>
                                          <Link className="global_btn d-inline-block " to="/product-list">
                                            Shop
                                          </Link> */}
                                        </div>
                                      </>
                                  }
                                </div>
                              </Col>
                            </>
                          )}
                        </div>
                      </Col>

                      <Col md={8}>
                        {(userInfoByID?.user_role === "artist" ||
                          userInfoByID?.user_role === "affiliate") && (
                            <>
                              <IncomeAreaChart forCharData={forCharData} />
                            </>
                          )}
                      </Col>

                      <Col md={4}>
                        {userInfoByID?.user_role === "artist" && (
                          <Col md={12}>
                            <Row>
                              <Typography variant="h5" className="mb-3 mt-1">
                                Top 10 Artworks
                              </Typography>
                              <Col md={12} className="mb-3">
                                <MainCard content={false} >
                                  <Box className="text " sx={{ p: 3, pb: 0 }}>
                                    <Stack
                                      className="align-items-center"
                                      direction={{ xs: "column", md: "row" }}
                                      spacing={{ xs: 1, md: 3 }}
                                    >
                                      <ApexCharts
                                        options={options}
                                        series={[
                                          dashboardInfo?.rank
                                            ?.progressPercentage || 100,
                                        ]}
                                        type="radialBar"
                                        height={350}
                                      />
                                      <div className="tier_status">
                                        {dashboardInfo?.rank?.tierIcon && (
                                          <div className="tier_img mb-3">
                                            <img
                                              style={{ width: "50px" }}
                                              src={
                                                imgBaseURL() +
                                                dashboardInfo?.rank?.tierIcon
                                              }
                                              alt="tier-image"
                                            />
                                          </div>
                                        )}
                                        <ul>
                                          <li>
                                            {" "}
                                            <b> Tier</b> -{" "}
                                            {dashboardInfo?.rank?.currentRank}
                                          </li>
                                          <li>
                                            {" "}
                                            <b>Current Points </b>-{" "}
                                            {dashboardInfo?.rank?.currentPoints}
                                          </li>
                                        </ul>
                                      </div>
                                    </Stack>
                                    <p className="chat_tier text-center">
                                      {dashboardInfo?.rank?.message}
                                    </p>
                                  </Box>
                                </MainCard>
                              </Col>
                            </Row>
                          </Col>
                        )}
                      </Col>

                      {(userInfoByID?.user_role === "artist" ||
                        userInfoByID?.user_role === "affiliate") && (
                          <>
                            {dashboardInfo?.topArtworks?.length > 0 && (
                              <Grid item xs={12} className="mt-md-5 mt-3">
                                <Grid
                                  container
                                  alignItems="center"
                                  justifyContent="space-between"
                                >
                                  <Grid item>
                                    <Typography variant="h5">
                                      Top 10 Artworks
                                    </Typography>
                                  </Grid>
                                  <Grid item />
                                </Grid>
                                <MainCard sx={{ mt: 2 }} content={false}>
                                  <TableContainer>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>S.No</TableCell>
                                          <TableCell>Img</TableCell>
                                          <TableCell>Title</TableCell>
                                          <TableCell>Price</TableCell>
                                          <TableCell>
                                            Total Commission Amount
                                          </TableCell>
                                          <TableCell>Total Sales Count</TableCell>
                                          <TableCell align="right">
                                            Actions
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {dashboardInfo?.topArtworks.map(
                                          (row, index) => (
                                            <TableRow key={index}>
                                              <TableCell>{index + 1}</TableCell>
                                              <TableCell>
                                                {tableImg(row.thumbnail)}
                                              </TableCell>
                                              <TableCell>{row?.title}</TableCell>
                                              <TableCell>
                                                ${row?.price?.toFixed()}
                                              </TableCell>
                                              <TableCell>
                                                ${row?.totalCommissionAmount}
                                              </TableCell>
                                              <TableCell className="text-capitalize">
                                                {row?.totalSalesCount}
                                              </TableCell>
                                              <TableCell align="right">
                                                <Dropdown className="dorpdown-curtom">
                                                  <Dropdown.Toggle
                                                    as={IconButton}
                                                    variant="link"
                                                  >
                                                    {" "}
                                                    <MoreVert />
                                                  </Dropdown.Toggle>
                                                  <Dropdown.Menu>
                                                    <Dropdown.Item
                                                      href="#"
                                                      onClick={() =>
                                                        handleClick(row)
                                                      }
                                                    >
                                                      <RemoveRedEyeIcon
                                                        style={{
                                                          marginRight: "8px",
                                                        }}
                                                      />{" "}
                                                      View
                                                    </Dropdown.Item>
                                                  </Dropdown.Menu>
                                                </Dropdown>
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </MainCard>
                              </Grid>
                            )}
                          </>
                        )}
                    </Row>
                  </Col>
                </Row>
              </div>
            </Paper>
          </Col>
        </Row>
      )}
      {/* </Paper> */}
    </>
  );
};

export default ViewUserDetails;
