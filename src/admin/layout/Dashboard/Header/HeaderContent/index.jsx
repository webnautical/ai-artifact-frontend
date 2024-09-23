// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
 
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import Message from './Message';
import { auth } from '../../../../../helper/Utility';
 
export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
 
  return (
    <>
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
 
      {/* <Message /> */}
      {
        !auth('admin')?.isSubadmin &&
        <Notification />
      }
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
 