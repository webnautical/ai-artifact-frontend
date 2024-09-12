import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { useDataContext } from '../../../helper/context/ContextProvider';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { Button, Col, Row } from 'react-bootstrap';
import { imgBaseURL, timeAgo } from '../../../helper/Utility';
import MainCard from '../../components/MainCard';
import { Box } from '@mui/system';
import ApexCharts from 'react-apexcharts';
import tier from '../../../assets/images/1 - Bronze.png'
import AdminLoader from '../../components/AdminLoader';
import { Link } from 'react-router-dom';
import { APICALL } from '../../../helper/api/api';
import AnalyticEcommerce from '../../components/cards/statistics/AnalyticEcommerce';

const options = {
    chart: {
        type: 'radialBar',
        offsetY: -10,
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
                margin: 0,
                size: '70%',
                background: 'transparent',
            },
            track: {
                background: 'purple',
                strokeWidth: '97%',
            },
            dataLabels: {
                name: {
                    offsetY: 5,
                    color: '#888',
                    fontSize: '15px',
                },
                value: {
                    offsetY: -20,
                    color: '#111',
                    fontSize: '22px',
                    fontWeight: 'bold',
                },
            },
        },
    },
    fill: {
        type: 'solid',
    },
    colors: ['#800080'],
    stroke: {
        lineCap: 'round',
    },
    labels: [''],
};

const series = [75];
const ViewUserDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [listLoading, setListLoading] = useState({
        'artist_info': false
    })
    const { userInfoByID, getUserByIDFun, userDetailsLoading, loading } = useDataContext();
    useEffect(() => {
        if (id) {
            getUserByIDFun(id)
            getArtistInfo()
        }
    }, [id])

    // useEffect(() => {
    //     if (userInfoByID?.user_role === "artist") {
    //         getArtistInfo()
    //     }
    // }, [userInfoByID])

    const [artistInfo, setArtistInfo] = useState([])
    const getArtistInfo = async () => {
        setListLoading({ ...listLoading, 'artist_info': true })
        try {
            const res = await APICALL(`artist/ArtistDashboard`, 'post', { artistId: id })
            if (res?.status) {
                setArtistInfo(res?.data)
            } else {
                setArtistInfo(null)
            }
        } catch (error) {
            console.log(error)
            setArtistInfo(null)
        } finally {
            setListLoading({ ...listLoading, 'artist_info': false })
        }
    }

    return (
        <>
            {/* <Paper className=" p-3"> */}
            {userDetailsLoading ? (
                <AdminLoader />
            ) : (
                <div className="row-details">
                    <div className="d-flex mb-4" style={{ gap: "10px" }}>
                        <Link className="artist-btn" onClick={() => navigate(-1)}>
                            <i class="fa-solid fa-arrow-left"></i>
                        </Link>
                        <h2 className="title-admins-table m-0 text-capitalize">
                            {userInfoByID?.first_name + " " + userInfoByID?.last_name}'s details
                        </h2>
                    </div>

                    {userInfoByID?.user_role === "artist" &&
                        <Grid container rowSpacing={1} columnSpacing={1} className='mb-3'>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <AnalyticEcommerce title="Total Artwork" count={artistInfo?.totalArtwork || 0} percentage={59.3} extra="35,000" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <AnalyticEcommerce title="Approved Artworks" count={artistInfo?.approvedArtworks || 0} percentage={70.5} extra="8,900" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <AnalyticEcommerce title="Pending Artworks" count={artistInfo?.pendingArtworks || 0} percentage={27.4} isLoss color="warning" extra="1,943" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <AnalyticEcommerce title="Total Sold Items" count={artistInfo?.totalSoldItems || 0} percentage={27.4} isLoss color="warning" extra="$20,395" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <AnalyticEcommerce title="Total Revenue" count={`$${artistInfo?.totalRevenue ? artistInfo?.totalRevenue?.toFixed(2) : 0}`} percentage={27.4} isLoss color="warning" extra="$20,395" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <AnalyticEcommerce title="Total Paid" count={`$${typeof artistInfo?.totalPaid === 'number' ? artistInfo.totalPaid : 0}`} percentage={27.4} isLoss color="warning" extra="$20,395" />
                            </Grid>
                        </Grid>
                    }

                    <Row className="justify-content-center">
                        <Col md={7}>
                            <Row className="">
                                <Col md={12} clas>
                                    <div className="table_border mb-3">
                                        <p>
                                            {" "}
                                            <strong>Name:</strong>{" "}
                                            {userInfoByID?.first_name +
                                                " " +
                                                userInfoByID?.last_name}
                                        </p>
                                        <p>
                                            {" "}
                                            <strong>Email:</strong>{" "}
                                            {userInfoByID?.email}
                                        </p>
                                    </div>
                                    <div>
                                        {userInfoByID?.user_role === "customer" &&
                                            <Col md={12} className="mb-3 mt-2">

                                                <h5><strong>Address</strong></h5>
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
                                        }
                                    </div>
                                </Col>

                                {
                                    artistInfo?.topArtworks?.length > 0 &&
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="h5">Top Artworks</Typography>
                                            </Grid>
                                            <Grid item />
                                        </Grid>
                                        <MainCard sx={{ mt: 2 }} content={false}>
                                            <div className="row p-3 g-3">
                                                {
                                                    artistInfo?.topArtworks?.map((item, i) => (
                                                        <div className="col-md-2">
                                                            <div
                                                            // style={{cursor: 'pointer'}} 
                                                            // onClick={() =>handleClick(item)}
                                                            >
                                                                <img src={imgBaseURL() + item?.image} alt="" style={{ width: '100%' }} />
                                                                <strong className='mb-0 pb-0 text-capitalize'>{item?.title}</strong>
                                                                <p>Price: {item?.price}</p>
                                                                <p>Total Commission Amount : ${item?.totalCommissionAmount}</p>
                                                                <p>Total Sale Count : {item?.totalSalesCount}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </MainCard>
                                    </Grid>
                                }
                            </Row>
                        </Col>
                        {userInfoByID?.user_role === "artist" &&
                            <Col md={5}>
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <MainCard content={false}>
                                            <Box className="text" sx={{ p: 3, pb: 0 }}>
                                                <Stack className='align-items-center' direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
                                                    <ApexCharts options={options} series={[artistInfo?.rank?.progressPercentage || 100]} type="radialBar" height={350} />
                                                    <div className='tier_status'>
                                                        {
                                                            artistInfo?.rank?.tierIcon &&
                                                            <div className='tier_img mb-3'>
                                                                <img style={{ width: '50px' }} src={imgBaseURL() + artistInfo?.rank?.tierIcon} alt='tier-image' />
                                                            </div>
                                                        }
                                                        <ul>
                                                            <li> <b> Rank</b> - {artistInfo?.rank?.currentRank}</li>
                                                            <li> <b>Current Points </b>-  {artistInfo?.rank?.currentPoints}</li>
                                                        </ul>
                                                    </div>
                                                </Stack>
                                                <p className='chat_tier text-center'>{artistInfo?.rank?.message}</p>
                                            </Box>
                                        </MainCard>
                                    </Col>
                                </Row>
                            </Col>
                        }

                    </Row>

                </div>
            )}
            {/* </Paper> */}
        </>
    )
}

export default ViewUserDetails