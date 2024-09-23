import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from '../../components/MainCard';
import Grid from '@mui/material/Grid';

const PiaChart = ({ pieCharData }) => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: [],
            colors: ['#008080b5', '#8e24aa', '#008080', '#008080b5', '#008080b5'], // Different shades of purple
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    });

    useEffect(() => {
        if (pieCharData && pieCharData.length > 0) {
            const seriesData = pieCharData.map(item => item.count);
            const labelsData = pieCharData.map(item => item.label);
            setChartData(prevState => ({
                ...prevState,
                series: seriesData,
                options: {
                    ...prevState.options,
                    labels: labelsData
                }
            }));
        }
    }, [pieCharData]);

    return (
        <>
            <Grid container alignItems="center" justifyContent="space-between" >
                <Grid item>
                    <Typography variant="h5">Users</Typography>
                </Grid>
            </Grid>
            <MainCard content={false} sx={{ mt: 2.5 }} className='box_pie'>
                <Box sx={{ pt: 1, pr: 2 }} >
                    <ReactApexChart options={chartData.options} series={chartData.series} type="pie" width={380} />
                </Box>
            </MainCard>
        </>
    );
};

export default PiaChart;
