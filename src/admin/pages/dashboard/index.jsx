import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ApexCharts from "react-apexcharts";
import MainCard from "../../components/MainCard";
import AnalyticEcommerce from "../../components/cards/statistics/AnalyticEcommerce";
import UniqueVisitorCard from "./UniqueVisitorCard";
import { auth, imgBaseURL, tableImg } from "../../../helper/Utility";
import { APICALL } from "../../../helper/api/api";
import { useEffect, useState } from "react";
import AdminLoader from "../../components/AdminLoader";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
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
import { useNavigate } from "react-router-dom";
import PiaChart from "./PiaChart";

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

export default function DashboardDefault() {
  const navigate = useNavigate();
  const role = auth("admin")?.user_role;
  const [listLoading, setListLoading] = useState({
    artist_info: false,
  });

  useEffect(() => {
    getArtistInfo();
  }, []);

  const [dashboardInfo, setDashboardInfo] = useState(null);
  const getArtistInfo = async () => {
    setListLoading({ ...listLoading, artist_info: true });
    try {
      const api =
        role === "artist"
          ? "artist/ArtistDashboard"
          : role === "affiliate"
          ? "affiliate/AffiliateDashboard"
          : "admin/AdminDashboard";
      const res = await APICALL(api, "post", {});
      if (res?.status) {
        setDashboardInfo(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setListLoading({ ...listLoading, artist_info: false });
    }
  };

  const handleClick = (item) => {
    const url = `/product-details/${item?.artworkId}`;
    window.open(url, "_blank");
  };

  const pieCharData = [
    {
      label: "Artist",
      count: dashboardInfo?.totalArtists || 0,
    },
    {
      label: "Affiliate",
      count: dashboardInfo?.totalAffiliates || 0,
    },
    {
      label: "Customer",
      count: dashboardInfo?.totalCustomers || 0,
    },
  ];

  console.log("dashboardInfo",dashboardInfo)

  return (
    <>
      {listLoading?.artist_info ? (
        <AdminLoader />
      ) : (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          <>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
              <Typography variant="h5">Dashboard</Typography>
            </Grid>
            {(role === "artist" || role === "admin") && (
              <>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  <AnalyticEcommerce
                    title="Total Artwork"
                    count={<><>{dashboardInfo?.totalArtwork || 0}</>  {role === "artist" && <>/ {dashboardInfo?.rank?.maxUploads}</>} </>}
                    percentage={59.3}
                    extra="35,000"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  <AnalyticEcommerce
                    title="Approved Artworks"
                    count={dashboardInfo?.approvedArtworks || 0}
                    percentage={70.5}
                    extra="8,900"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={2}>
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
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <AnalyticEcommerce
                title="Total Sold Items"
                count={dashboardInfo?.totalSoldItems || 0}
                percentage={27.4}
                isLoss
                color="warning"
                extra="$20,395"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <AnalyticEcommerce
                title="Total Revenue"
                count={`$${
                  dashboardInfo?.totalRevenue
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
                count={`$${
                  dashboardInfo?.totalCommission
                    ? dashboardInfo?.totalCommission?.toFixed(2)
                    : 0
                }`}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <AnalyticEcommerce
                title="Total Paid"
                count={`$${
                  typeof dashboardInfo?.totalPaid === "number"
                    ? dashboardInfo.totalPaid
                    : 0
                }`}
                percentage={27.4}
                isLoss
                color="warning"
                extra="$20,395"
              />
            </Grid>

            {role === "admin" && (
              <>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  <AnalyticEcommerce
                    title="Total Artists"
                    count={dashboardInfo?.totalArtists || 0}
                    percentage={59.3}
                    extra="35,000"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  <AnalyticEcommerce
                    title="Total Affiliates"
                    count={dashboardInfo?.totalAffiliates || 0}
                    percentage={70.5}
                    extra="8,900"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  <AnalyticEcommerce
                    title="Total Customers"
                    count={dashboardInfo?.totalCustomers || 0}
                    percentage={27.4}
                    isLoss
                    color="warning"
                    extra="1,943"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  <AnalyticEcommerce
                    title="Paid Amount Artist"
                    count={`$${
                      dashboardInfo?.paidAmountArtist
                        ? dashboardInfo?.paidAmountArtist?.toFixed(2)
                        : 0
                    }`}
                    percentage={59.3}
                    extra="35,000"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  <AnalyticEcommerce
                    title="Paid Amount Affiliate"
                    count={`$${
                      dashboardInfo?.paidAmountAffiliate
                        ? dashboardInfo?.paidAmountAffiliate?.toFixed(2)
                        : 0
                    }`}
                    percentage={70.5}
                    extra="8,900"
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  <AnalyticEcommerce
                    title="Total Refunded Revenue"
                    count={`$${
                      dashboardInfo?.totalRefundedRevenue
                        ? dashboardInfo?.totalRefundedRevenue?.toFixed(2)
                        : 0
                    }`}
                    percentage={27.4}
                    isLoss
                    color="warning"
                    extra="1,943"
                  />
                </Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}></Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}></Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}></Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}></Grid>
              </>
            )}
            {role === "artist" && (
             <>
              <Grid item xs={6} sm={4} md={3} lg={2}></Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}></Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}></Grid>
              </>
            )}

            <Grid
              item
              md={6}
              sx={{ display: { sm: "none", md: "block", lg: "none" } }}
            />
            <>
              {role === "affiliate" ? (
                <Grid item xs={12} md={12} lg={12}>
                  <UniqueVisitorCard />
                </Grid>
              ) : (
                <Grid item xs={12} md={7} lg={8}>
                  <UniqueVisitorCard />
                </Grid>
              )}

              {role === "admin" && (
                <Grid item xs={12} md={7} lg={4}>
                  <PiaChart pieCharData={pieCharData} />
                </Grid>
              )}
            </>
          </>

          {role === "artist" && (
            <>
              <Grid item xs={12} md={5} lg={4}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="h5">Experince Bar</Typography>
                  </Grid>
                  <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                  {
                    <Box className="text" sx={{ p: 3, pb: 0 }}>
                      <Stack
                        className="align-items-center"
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 1, md: 3 }}
                      >
                        <ApexCharts
                          options={options}
                          series={[
                            dashboardInfo?.rank?.progressPercentage || 0,
                          ]}
                          type="radialBar"
                          height={350}
                        />
                        <div className="tier_status text-md-start text-center">
                          {dashboardInfo?.rank?.tierIcon && (
                            <div className="tier_img mb-3">
                              <img
                                style={{ width: "50px" }}
                                src={
                                  imgBaseURL() + dashboardInfo?.rank?.tierIcon
                                }
                                alt="tier-image"
                              />
                            </div>
                          )}
                          <ul>
                            <li>
                              {" "}
                              <b> Rank</b> - {dashboardInfo?.rank?.currentRank}
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
                  }
                </MainCard>
              </Grid>
            </>
          )}

          {dashboardInfo?.topArtworks?.length > 0 && (
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">Top 10 Artworks</Typography>
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
                        <TableCell>Total Commission Amount</TableCell>
                        <TableCell>Total Sales Count</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardInfo?.topArtworks.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{tableImg(row.thumbnail)}</TableCell>
                          <TableCell>{row?.title}</TableCell>
                          <TableCell>${row?.price?.toFixed()}</TableCell>
                          <TableCell>${row?.totalCommissionAmount}</TableCell>
                          <TableCell className="text-capitalize">
                            {row?.totalSalesCount}
                          </TableCell>
                          <TableCell align="right">
                            <Dropdown className="dorpdown-curtom">
                              <Dropdown.Toggle as={IconButton} variant="link">
                                {" "}
                                <MoreVert />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  href="#"
                                  onClick={() => handleClick(row)}
                                >
                                  <RemoveRedEyeIcon
                                    style={{ marginRight: "8px" }}
                                  />{" "}
                                  View
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </MainCard>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}
