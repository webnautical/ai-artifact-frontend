import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import EditOutlined from '@ant-design/icons/EditOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import { auth, getTokenType } from '../../../../../../helper/Utility';
import { useNavigate } from 'react-router';

export default function ProfileTab({setOpen}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate()

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    setOpen(false)
    navigate('/admin/edit-profile')
  };

  const handleLogout = (type) => {
    if (auth('admin')?.user_role === 'admin') {
      navigate('/admin/login')
    } else if (auth('admin')?.user_role === 'artist') {
      navigate('/login/artist')
    } else if (auth('admin')?.user_role === 'affiliate') {
      navigate('/login/affiliate')
    }
    localStorage.removeItem(getTokenType(type))
  }

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }} className="profile_tabs w-100">
      {
        auth('admin')?.user_role !== 'admin' &&
        <ListItemButton selected={selectedIndex === 0} onClick={() => handleListItemClick()}>
          <ListItemIcon sx={{ fontSize: '18px', color: '#000' }}>
            <EditOutlined />
          </ListItemIcon>
          <ListItemText primary="Edit Profile" />
        </ListItemButton>
      }

      <ListItemButton selected={selectedIndex === 2} onClick={() => handleLogout('admin')}>
        <ListItemIcon sx={{ fontSize: '18px', color: '#000' }}>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
