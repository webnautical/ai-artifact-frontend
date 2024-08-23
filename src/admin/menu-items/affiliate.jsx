import { AccountCircleOutlined, AddModeratorOutlined, Dashboard, FolderSharedOutlined, NotificationsActiveOutlined, PaidOutlined, PeopleAltOutlined } from '@mui/icons-material';
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
      url: '/admin/dashboard',
      icon: icons.Dashboard,
      breadcrumbs: false
    },
    {
      id: 'sold-art',
      title: 'Sold Art',
      type: 'item',
      url: '/admin/sold-art',
      icon: icons.AddModeratorOutlined,
      breadcrumbs: false
    }, 
    // {
    //   id: 'commission',
    //   title: 'Commission',
    //   type: 'item',
    //   url: `/admin/commission/affiliat`,
    //   icon: icons.AddModeratorOutlined,
    //   breadcrumbs: false
    // },  
    {
      id: 'Withdrawal',
      title: 'Withdrawal',
      type: 'item',
      url: '/admin/withdrawal',
      icon: icons.Dashboard,
      breadcrumbs: false
    },
  ]
};

export default affiliate;
