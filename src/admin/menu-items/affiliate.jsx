import { AccountCircleOutlined, AddModeratorOutlined, Dashboard, FolderSharedOutlined, NotificationsActiveOutlined, PaidOutlined, PeopleAltOutlined } from '@mui/icons-material';
import { auth } from '../../helper/Utility';
const icons = {
  Dashboard,
  FolderSharedOutlined,
  PeopleAltOutlined,
  AddModeratorOutlined,
  PaidOutlined,
  NotificationsActiveOutlined,
  AccountCircleOutlined,
};
const affiliate = {
  id: 'group-dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: `/${auth('admin')?.user_role}/dashboard`,
      icon: icons.Dashboard,
      breadcrumbs: false
    },
    {
      id: 'sold-art',
      title: 'Sold Art',
      type: 'item',
      url: `/${auth('admin')?.user_role}/sold-art`,
      icon: icons.AddModeratorOutlined,
      breadcrumbs: false
    }, 
    {
      id: 'notifications',
      title: 'Notifications',
      type: 'item',
      url: `/${auth('admin')?.user_role}/notifications`,
      icon: icons.AddModeratorOutlined,
      breadcrumbs: false
    }, 
    {
      id: 'Withdrawal',
      title: 'Withdrawal',
      type: 'item',
      url: `/${auth('admin')?.user_role}/withdrawal`,
      icon: icons.Dashboard,
      breadcrumbs: false
    },
  ]
};

export default affiliate;
