import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project import
import {useGetMenuMaster,handlerActiveItem} from '../../../../../api/menu';

export default function NavItem({ item, level }) {

  const theme = useTheme();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const openItem = menuMaster.openedItem;

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }
  let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '22px' : '1.25rem' }} /> : false;

  const { pathname } = useLocation();
  const isSelected = !!matchPath({ path: item.url, end: false }, pathname) || openItem === item.id;

  useEffect(() => {
    if (pathname === item.url) handlerActiveItem(item.id);
  }, [pathname]);

  const textColor = '#800080';
  const iconSelectedColor = '#fff';

  return (
    <ListItemButton
    className="menu-item-sidebar"
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => handlerActiveItem(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        marginBottom:'5px',
        padding:'8px 15px',
        fontSize: '16px',
        borderRadius: `10px`,
        ...(drawerOpen && {
          '&:hover': {
            bgcolor: '#008080',
            color: '#fff'
          },
          '&.Mui-selected': {
            bgcolor: '#008080',
            borderRadius: `10px`,
            color:' #fff!important',
            '&:hover': {
              color: '#fff',
              bgcolor: '#008080',
            }
          }
        }),
        ...(!drawerOpen && {
          '&:hover': {
            borderRadius: `10px`,
            bgcolor: 'transparent',
            color: '#fff'
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: 'transparent',
            color: '#fff'

            },
            bgcolor: 'transparent',
            color: '#fff'
          }
        })
      }}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: isSelected ? iconSelectedColor : textColor,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                color: '#fff'
              }
            }),
            ...(!drawerOpen &&
              isSelected && {
                color:' #fff!important',
                '&:hover': {
                  bgcolor: '#008080',
            borderRadius: `10px`,
            color:' #fff!important',
                }
              })
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor, fontSize: '16px',
              '&:hover': {
                color: '#fff'
              }
            }}>
              {item.title}
            </Typography>
          }
        />
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
}

NavItem.propTypes = { item: PropTypes.object, level: PropTypes.number };
