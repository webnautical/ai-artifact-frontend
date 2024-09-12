
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
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate()
  const [listLoading, setListLoading] = useState({
    'artist_info': false
  })

  useEffect(() => {
    if (auth('admin')?.user_role === "artist") {
      getArtistInfo()
    }
  }, [])

  const [artistInfo, setArtistInfo] = useState([])
  const getArtistInfo = async () => {
    setListLoading({ ...listLoading, 'artist_info': true })
    try {
      const res = await APICALL(`artist/ArtistDashboard`, 'post', {})
      if (res?.status) {
        setArtistInfo(res?.data)
        console.log("first",res?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setListLoading({ ...listLoading, 'artist_info': false })
    }
  }

  const handleClick = (item) => {
    const params = {
      name: item?.title,
      _id: item?._id
    }
    navigate(`/${auth('admin')?.user_role}/artworks`, { state: { params } });
  }

  return (
    <>
    {
      listLoading?.artist_info ? <AdminLoader /> : 
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <>
          <Grid item xs={12} sx={{ mb: -2.25 }}>
            <Typography variant="h5">Dashboard</Typography>
          </Grid>
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

          <Grid item md={6} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
          {
            auth('admin')?.user_role == "artist" &&
            <Grid item xs={12} md={7} lg={8}>
              <UniqueVisitorCard />
            </Grid>
          }
        </>

        {
          auth('admin')?.user_role == "artist" &&
          <>
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
                }
              </MainCard>
            </Grid>

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
          </>
        }
      </Grid>
    }
    </>

  );
}
