
import Grid from '@mui/material/Grid';
import tier from '../../../assets/images/1 - Bronze.png'

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ApexCharts from 'react-apexcharts';
import MainCard from '../../components/MainCard';
import AnalyticEcommerce from '../../components/cards/statistics/AnalyticEcommerce';
import UniqueVisitorCard from './UniqueVisitorCard';
import { auth, imgBaseURL } from '../../../helper/Utility';
import { APICALL } from "../../../helper/api/api";
import { useEffect, useState } from 'react';
import AdminLoader from '../../components/AdminLoader';
import { useDataContext } from '../../../helper/context/ContextProvider';

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

export default function DashboardDefault() {
  const { artistRanking, getArtistRankingFun, loading } = useDataContext()


  useEffect(() => {
    if (auth('admin')?.user_role === "artist") {
      getArtistRankingFun()
    }
  }, [])

  console.log("artistRanking", artistRanking)

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <>
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Dashboard</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Total Page Views" count="4,42,236" percentage={59.3} extra="35,000" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Total Users" count="78,250" percentage={70.5} extra="8,900" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Total Order" count="18,800" percentage={27.4} isLoss color="warning" extra="1,943" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Total Sales" count="$35,078" percentage={27.4} isLoss color="warning" extra="$20,395" />
        </Grid>

        <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
        {
          auth('admin')?.user_role == "artist" &&
          <Grid item xs={12} md={7} lg={8}>
            <UniqueVisitorCard />
          </Grid>
        }
      </>

      {
        auth('admin')?.user_role == "artist" &&
        <Grid item xs={12} md={5} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Experince Bar</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            {
              // loading?.ranking ? <AdminLoader /> :
              <Box className="text" sx={{ p: 3, pb: 0 }}>
                <Stack className='align-items-center' direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
                  <ApexCharts options={options} series={[artistRanking?.progressPercentage || 100]} type="radialBar" height={350} />
                  <div className='tier_status'>
                    {
                      artistRanking?.tierIcon &&
                      <div className='tier_img mb-3'>
                        <img style={{ width: '50px' }} src={imgBaseURL() + artistRanking?.tierIcon} alt='tier-image' />
                      </div>
                    }
                    <ul>
                      <li> <b> Rank</b> - {artistRanking?.currentRank}</li>
                      <li> <b>Currunt Points </b>-  {artistRanking?.currentPoints}</li>
                    </ul>
                  </div>
                </Stack>
                <p className='chat_tier text-center'>{artistRanking?.message}</p>
              </Box>
            }
          </MainCard>
        </Grid>
      }

    </Grid>
  );
}
