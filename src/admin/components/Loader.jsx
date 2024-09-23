// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: 'blue', // Change the background color here
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}));

// ==============================|| Loader ||============================== //

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress sx={{ backgroundColor: 'lightblue', '& .MuiLinearProgress-bar': { backgroundColor: 'purple' } }} />
  </LoaderWrapper>
);

export default Loader;
