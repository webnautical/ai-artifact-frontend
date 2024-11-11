import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { APICALL } from '../../../helper/api/api';
import { auth } from '../../../helper/Utility';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from '../../components/MainCard';
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

export default function IncomeAreaChart({ forCharData }) {
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const [slot, setSlot] = useState('week');

  const myGraph2 = "#80008045";
  const myGraph1 = "#269393";

  const [options, setOptions] = useState(areaChartOptions);
  const [salesHistroy, setSalesHistory] = useState([]);
  const [listLoading, setListLoading] = useState({ artwork: false });
  const [series, setSeries] = useState([]);


  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [myGraph1, myGraph2],
      xaxis: {
        categories:
          slot === 'month'
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: {
            colors: Array(12).fill(secondary)
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 11 : 7
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      }
    }));
  }, [primary, secondary, line, theme, slot]);

  const role = auth('admin')?.user_role;

  const getSalesHistroyByArtist = async () => {
    try {
      setListLoading((prevState) => ({ ...prevState, artwork: true }));
      const params =
        role === "artist" ? { artistId: auth('admin')?.id, "period": slot } :
          role === "affiliate" ? { affiliateId: auth('admin')?.id, "period": slot } :
            { "period": slot };

      const fromAdminUserDetails = forCharData?.role === "artist" ? { artistId: forCharData?.id, "period": slot } :
        forCharData?.role === "affiliate" ? { affiliateId: forCharData?.id, "period": slot } :
          {};

      const api = forCharData ? `user/getSalesHistory` : role === "admin" ? `admin/getAdminSalesHistory` : `user/getSalesHistory`
      const res = await APICALL(api, 'post', forCharData ? fromAdminUserDetails : params);
      if (res?.status) {
        setSalesHistory(res?.data);
      }
    } catch (error) {
      console.error("Error fetching sales history:", error);
    } finally {
      setListLoading((prevState) => ({ ...prevState, artwork: false }));
    }
  };

  useEffect(() => {
    getSalesHistroyByArtist();
  }, [slot]);

  useEffect(() => {
    const categories = slot === "week"? salesHistroy?.map(item => item.dayName || ''): slot === "month" ?  salesHistroy?.map(item => item.period || '')  : salesHistroy?.map(item => item.monthName || '');
    
    const salesAmounts = salesHistroy?.map(item => (item.totalSalesAmount ? item.totalSalesAmount.toFixed(2) : 0));
    setSeries([{
        name: 'Sales Amount',
        data: salesAmounts || []
      }]);
    setOptions((prevState) => ({
      ...prevState,
      xaxis: {
        ...prevState.xaxis,
        categories: categories
      }
    }));
  }, [salesHistroy, slot]);

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Growth</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={0}>
            <Button  size="small"  onClick={() => setSlot('week')} color={slot === 'week' ? 'primary' : 'secondary'}  variant={slot === 'week' ? 'outlined' : 'text'}>
              Week
            </Button>
            <Button size="small"  onClick={() => setSlot('month')} color={slot === 'month' ? 'primary' : 'secondary'} variant={slot === 'month' ? 'outlined' : 'text'}>
              Month
            </Button>
            <Button  size="small"  onClick={() => setSlot('year')} color={slot === 'year' ? 'primary' : 'secondary'}  variant={slot === 'year' ? 'outlined' : 'text'}>
              Year
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <ReactApexChart options={options} series={series} type="area" height={450} />
        </Box>
      </MainCard>
    </>
  );
}

IncomeAreaChart.propTypes = { slot: PropTypes.string };
