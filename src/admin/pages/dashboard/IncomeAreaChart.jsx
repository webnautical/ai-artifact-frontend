import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { APICALL } from '../../../helper/api/api';
import { auth } from '../../../helper/Utility';

// Chart options
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

export default function IncomeAreaChart({ slot }) {
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const myGraph2 = "#80008045";
  const myGraph1 = "#269393";

  const [options, setOptions] = useState(areaChartOptions);
  const [salesHistroy, setSalesHistory] = useState([]);
  const [listLoading, setListLoading] = useState({ artwork: false });
  const [series, setSeries] = useState([]);

  // Update chart options when theme or slot changes
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

  // Fetch sales history based on the selected period (week or month)
  const getSalesHistroyByArtist = async () => {
    try {
      setListLoading((prevState) => ({ ...prevState, artwork: true }));
      const res = await APICALL(`user/getSalesHistory`, 'post', { artistId: auth('admin')?.id, period: slot });
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
    const categories = slot === "week"
      ? salesHistroy?.map(item => item.dayName || '')
      : salesHistroy?.map(item => item.monthName || '');

    const salesAmounts = salesHistroy?.map(item => (item.totalSalesAmount ? item.totalSalesAmount.toFixed(2) : 0));

    setSeries([
      {
        name: 'Sales Amount',
        data: salesAmounts || []
      }
    ]);

    setOptions((prevState) => ({
      ...prevState,
      xaxis: {
        ...prevState.xaxis,
        categories: categories
      }
    }));
  }, [salesHistroy, slot]);

  return (
    <ReactApexChart options={options} series={series} type="area" height={450} />
  );
}

IncomeAreaChart.propTypes = { slot: PropTypes.string };
