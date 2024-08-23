import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import firsttier from "../../../assets/images/1 - Bronze.png";
import silver from "../../../assets/images/2 - Silver.png";
import gold from "../../../assets/images/3 - Gold.png";
import diamond from "../../../assets/images/4 - Diamond.png";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import ReactApexChart from 'react-apexcharts';

function createData(

    
  Rank,
  Username,
  Totalsales,
  TotalrevenueUSD,
  AvgmonthlyrevenueUSD,
  Topsellingartworks,
  Followers
) {
  return {
    Rank,
    Username,
    Totalsales,
    TotalrevenueUSD,
    AvgmonthlyrevenueUSD,
    Topsellingartworks,
    Followers,
  };
}


const RankingStatus = () => {

    const rows = [
        createData("1", "ArtistA", 159, 6000, 2400, 4, 1000),
        createData("2", "ArtistB", 237, 9000, 3700, 3, 1200),
        createData("3", "ArtistC", 262, 16000, 2400, 6, 1300),
        createData("4", "ArtistD", 305, 3700, 6700, 4, 1100),
        createData("5", "ArtistE", 356, 16000, 4900, 5, 1400),
      ];
    
      const [key, setKey] = useState("one");
      const [openRows, setOpenRows] = useState({});
    
      const handleSelect = (k) => {
        setKey(k);
      };
    
      const handleToggle = (username) => {
        setOpenRows((prevOpenRows) => ({
          ...prevOpenRows,
          [username]: !prevOpenRows[username],
        }));
      };

      const options = {
        chart: {
          type: 'bar',
          height: 350,
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
          categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ], // 12 categories for 12 bars
        },
        fill: {
          opacity: 1,
          colors: ['#036565'], // Set the bar color here
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return `$${val}k`;
            },
          },
        },
      };
      
      const series = [
        {
          name: 'Revenue',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 71, 78, 80], // 12 data points for 12 bars
        },
      ];

      
  return (
   <>
     <section className="ranking top_ten mt-5">
        <Container>
          <div className="shode_box">
            <div className="p-2">
              <Row className="align-items-center">
                <Col lg={6}>
                  <h1 className="left_global_heading">Ranking Status</h1>
                </Col>
                <Col lg={6} className="text-lg-end text-center">
                  <div className="tab-cus-buttons">
                    <button
                      className={key === "one" ? "active" : ""}
                      onClick={() => handleSelect("one")}
                    >
                      <img src={firsttier} alt="icon_tier" />
                    </button>
                    <button
                      className={key === "two" ? "active" : ""}
                      onClick={() => handleSelect("two")}
                    >
                      <img src={silver} alt="icon_tier" />
                    </button>
                    <button
                      className={key === "three" ? "active" : ""}
                      onClick={() => handleSelect("three")}
                    >
                      <img src={gold} alt="icon_tier" />
                    </button>
                    <button
                      className={key === "four" ? "active" : ""}
                      onClick={() => handleSelect("four")}
                    >
                      <img src={diamond} alt="icon_tier" />
                    </button>
                  </div>
                </Col>
              </Row>
            </div>

            <Tabs
              defaultActiveKey="one"
              id="uncontrolled-tab-example"
              className="mb-3 d-none"
              activeKey={key}
            >
              <Tab eventKey="one" title="One">
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
                          <TableCell align="right">Username</TableCell>
                          <TableCell align="right">Total Sales</TableCell>
                          <TableCell align="right">Total Revenue USD</TableCell>
                          <TableCell align="right">Avg. Monthly Revenue USD</TableCell>
                          <TableCell align="right">Top Selling Artworks</TableCell>
                          <TableCell align="right">Followers</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <React.Fragment key={row.Username}>
                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": { border: 0 },
                                cursor: "pointer",
                              }}
                              onClick={() => handleToggle(row.Username)}
                            >
                              <TableCell component="th" scope="row">
                                {row.Rank}
                              </TableCell>
                              <TableCell align="right">{row.Username}</TableCell>
                              <TableCell align="right">{row.Totalsales}</TableCell>
                              <TableCell align="right">{row.TotalrevenueUSD}</TableCell>
                              <TableCell align="right">{row.AvgmonthlyrevenueUSD}</TableCell>
                              <TableCell align="right">{row.Topsellingartworks}</TableCell>
                              <TableCell align="right">{row.Followers}</TableCell>
                            </TableRow>
                            {openRows[row.Username] && (
                              <TableRow>
                                <TableCell colSpan={7}>
                                  <Box p={2} bgcolor="white">
                                  <ReactApexChart options={options} series={series} type="bar" height={350} />
                                  
                                   {row.Username}.
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Tab>
              <Tab eventKey="two" title="Two"></Tab>
              <Tab eventKey="three" title="Three"></Tab>
              <Tab eventKey="four" title="Four"></Tab>
            </Tabs>
          </div>
        </Container>
      </section>
   </>
  )
}

export default RankingStatus
