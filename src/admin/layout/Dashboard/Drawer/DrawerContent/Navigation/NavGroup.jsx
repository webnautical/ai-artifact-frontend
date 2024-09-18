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

  const isSubadmin = auth('admin')?.isSubadmin;
  const userRole = auth('admin')?.user_role;

  useEffect(() => {
    getPermision();
  }, []);

  const filteredItems = isSubadmin
    ? item.children?.filter((menuItem) => {
        if (userRole !== 'admin' && menuItem.id === 'RolesPermission') {
          return false;
        }

        const permissionKey = Object.keys(permisionData?.permissions || {}).find(
          (key) => key.toLowerCase() === menuItem.id.toLowerCase()
        );
  
        const permission = permisionData?.permissions?.[permissionKey];

        if (!permission || !permission.read) {
          return false;
        }

        return true;
      })
    : item.children;

  console.log('permisionData', permisionData);
  console.log('filteredItems', filteredItems);

  const navCollapse = filteredItems?.map((menuItem) => {
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
