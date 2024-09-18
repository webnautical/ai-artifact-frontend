// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
import menuItems from '../../../../../menu-items';
import artist from '../../../../../menu-items/artist';
import affiliate from './../../../../../menu-items/affiliate';
import { auth } from '../../../../../../helper/Utility';

export default function Navigation() {
  const getItems = () => {
    if(auth('admin')?.user_role === 'artist'){
      const artistItem = {items: [artist]};
      return artistItem
    }else if(auth('admin')?.user_role === 'affiliate'){
      const affiliateItem = {items: [affiliate]};
      return affiliateItem
    }else{
      return menuItems
    }
  }


  const navGroups = getItems()?.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
