import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import { useDataContext } from '../../../helper/context/ContextProvider';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { Button, Col, Row } from 'react-bootstrap';
import { timeAgo } from '../../../helper/Utility';
import MainCard from '../../components/MainCard';
import { Box } from '@mui/system';
import ApexCharts from 'react-apexcharts';
import tier from '../../../assets/images/1 - Bronze.png'
import AdminLoader from '../../components/AdminLoader';
import { Link } from 'react-router-dom';

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
    const { userInfoByID, getUserByIDFun, userDetailsLoading } = useDataContext();
    useEffect(() => {
        if (id) {
            getUserByIDFun(id)
        }
    }, [id])

    return (
        <>
            <Paper className=" p-3">
                {userDetailsLoading ? (
                    <AdminLoader />
                ) : (
                    <div className="row-details">
                        <div className="d-flex mb-4" style={{ gap: "10px" }}>
                            <Link   className="artist-btn"  onClick={() => navigate(-1)}>
                                <i class="fa-solid fa-arrow-left"></i>
                            </Link>
                            <h2 className="title-admins-table m-0 text-capitalize">
                                {userInfoByID?.first_name + " " + userInfoByID?.last_name}'s details
                            </h2>
                        </div>

                        <Row className=" justify-content-center">
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
                                                            {userInfoByID?.state  || "---"}
                                                        </p>
                                                        <p>
                                                            {" "}
                                                            <strong>City:</strong>{" "}
                                                            {userInfoByID?.city  || "---"}
                                                        </p>
                                                        <p>
                                                            {" "}
                                                            <strong>Postal Code:</strong>{" "}
                                                            {userInfoByID?.postalCode  || "---"}
                                                        </p>
                                                    </div>
                                                </Col>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            {userInfoByID?.user_role === "customer" &&
                                <Col md={5}>
                                    <Row>
                                        <Col md={12} className="mb-3">
                                            <MainCard content={false}>
                                                <Box className="text" sx={{ p: 3, pb: 0 }}>
                                                    <Stack className='align-items-center' direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
                                                        <ApexCharts options={options} series={series} type="radialBar" height={350} />
                                                        <div className='tier_status'>
                                                            <div className='tier_img mb-3'>
                                                                <img style={{ width: '50px' }} src={tier} alt='tier-image' />
                                                            </div>
                                                            <ul>
                                                                <li> <b>  Rank</b> - {userInfoByID?.currentRank?.name}</li>
                                                                <li> <b>Currunt Points </b>-  {userInfoByID?.currentRank?.commission}</li>
                                                            </ul>
                                                        </div>
                                                    </Stack>
                                                    <p className='chat_tier text-center'>Get 3000 Points To Reach Bronze</p>
                                                </Box>
                                            </MainCard>
                                        </Col>
                                    </Row>
                                </Col>
                            }

                        </Row>

                    </div>
                )}
            </Paper>
        </>
    )
}

export default ViewUserDetails