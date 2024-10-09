import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import logo from '../../../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { auth } from '../../../../../helper/Utility';
// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const theme = useTheme();
  return (
    <DrawerHeaderStyled  style={{ 
      justifyContent: 'center', 
      borderBottom: '1px solid #f0f0f0' ,
      padding:'7px'
    }}  theme={theme} open={!!open}>
      <Link to={`/${auth("admin")?.user_role}/dashboard`} className="sidebar_logo">
        <img src={logo} alt="logo" style={{ width: '180px' }} />
      </Link>
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
