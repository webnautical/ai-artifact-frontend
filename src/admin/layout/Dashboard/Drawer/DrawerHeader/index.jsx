import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import logo from '../../../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { width } from '@mui/system';
// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const theme = useTheme();
  return (
    <DrawerHeaderStyled theme={theme} open={!!open}>
      <Link to={'/'} className="sidebar_logo">
        <img src={logo} alt="logo" style={{ width: '180px' }} />
      </Link>
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
