import PropTypes from 'prop-types';
// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
 
// project import
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import { useGetMenuMaster } from '../../../../../api/menu';
import { auth } from '../../../../../../helper/Utility';
import { useDataContext } from '../../../../../../helper/context/ContextProvider';
import { useEffect } from 'react';
 
 
export default function NavGroup({ item }) {
  const { permisionData, getPermision } = useDataContext();
 
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
 
  const userRole = auth('admin')?.user_role;
  const isSubadmin = auth('admin')?.isSubadmin;
 
  useEffect(() => {
    getPermision()
  }, [])
 
  const filteredItems1 = item.children?.filter(menuItem => {
    if (userRole !== 'admin' && (menuItem.id === 'RolesPermission')) {
      return false;
    }
    return true;
  });
 
 
  const filteredItems2 = item.children?.filter((menuItem) => {
 
    const permissionKey = Object.keys(permisionData?.permissions || {}).find(
      (key) => key.toLowerCase() === menuItem.id.toLowerCase()
    );
 
    const permission = permisionData?.permissions?.[permissionKey];
 
    if (!permission || !permission.read) {
      return false;
    }
 
    return true;
  })
 
  const menuData = isSubadmin ? filteredItems2 : filteredItems1
 
  // console.log("auth", auth('admin'))
  // console.log("permisionData", permisionData)
  // console.log("filteredItems", menuData)
  // console.log("filteredItems1",filteredItems1)
  // console.log("filteredItems2",filteredItems2)
 
 
  const navCollapse = menuData?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return <NavCollapse key={menuItem.id} menu={menuItem} level={1} />;
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });
 
  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}
 
NavGroup.propTypes = { item: PropTypes.object };