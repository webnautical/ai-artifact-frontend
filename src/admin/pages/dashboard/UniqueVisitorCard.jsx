import { useEffect, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from '../../components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';
import { APICALL } from '../../../helper/api/api';
import { auth } from '../../../helper/Utility';

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard() {
  const [slot, setSlot] = useState('week');
  const [salesHistroy, setSalesHistory] = useState([])
  const [listLoading, setListLoading] = useState({
    artwork : false
  })
  const categories = slot === "week" ? salesHistroy?.map(item => item.dayName || '') : salesHistroy?.map(item => item.monthName || '');
  const salesAmounts = salesHistroy?.map(item => (item.totalSalesAmount ? item.totalSalesAmount.toFixed(2) : 0));
  const getSalesHistroyByArtist = async () => {
    try {
      setListLoading({ ...listLoading, 'artwork': true })
      const res = await APICALL(`user/getSalesHistory`, 'post', { artistId: auth('admin')?.id, "period": slot })
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

  useEffect(() =>{
    getSalesHistroyByArtist()
  },[slot])

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Growth</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={0}>
            <Button
              size="small"
              onClick={() => setSlot('month')}
              color={slot === 'month' ? 'primary' : 'secondary'}
              variant={slot === 'month' ? 'outlined' : 'text'}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => setSlot('week')}
              color={slot === 'week' ? 'primary' : 'secondary'}
              variant={slot === 'week' ? 'outlined' : 'text'}
            >
              Week
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          {
          listLoading?.artwork ? <>Loading...</>:
          <IncomeAreaChart slot={slot} categories={categories} salesAmounts={salesAmounts}/>
          }
        </Box>
      </MainCard>
    </>
  );
}
