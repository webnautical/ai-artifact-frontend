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
const artist = {
  id: 'group-dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/artist/dashboard',
      icon: icons.Dashboard,
      breadcrumbs: false
    },
    {
      id: 'Product Management',
      title: 'Product Management',
      type: 'collapse',
      icon: icons.PeopleAltOutlined,
      children: [
        {
          id: 'Add Artwork',
          title: 'Add Artwork',
          type: 'item',
          url: `art-work-upload`,
          breadcrumbs: false
        },
        {
          id: 'Artworks',
          title: 'Artworks',
          type: 'item',
          url: `artworks`,
          breadcrumbs: false
        },
       
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      type: 'item',
      url: '/artist/notifications',
      icon: icons.AddModeratorOutlined,
      breadcrumbs: false
    }, 
    {
      id: 'sold-art',
      title: 'Sold Art',
      type: 'item',
      url: '/artist/sold-art',
      icon: icons.AddModeratorOutlined,
      breadcrumbs: false
    }, 
    {
      id: 'withdrawal',
      title: 'Withdrawal',
      type: 'item',
      url: '/artist/withdrawal',
      icon: icons.Dashboard,
      breadcrumbs: false
    },
    
  ]
};

export default artist;
