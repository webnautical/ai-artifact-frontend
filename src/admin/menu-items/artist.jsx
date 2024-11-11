import { AccountCircleOutlined, AddModeratorOutlined, Dashboard, FolderSharedOutlined, NotificationsActiveOutlined, PaidOutlined, PeopleAltOutlined } from '@mui/icons-material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
const icons = {
  Dashboard,
  FolderSharedOutlined,
  PeopleAltOutlined,
  AddModeratorOutlined,
  PaidOutlined,
  NotificationsActiveOutlined,
  AccountCircleOutlined,
  WorkspacePremiumIcon
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
        {
          id: 'Pending Artworks',
          title: 'Pending Artworks',
          type: 'item',
          url: `artworks/pending`,
          breadcrumbs: false
        },
        {
          id: "collections",
          title: "Collections",
          type: "item",
          url: `collections`,
          breadcrumbs: false,
        },
       
      ]
    },
    {
      id: 'achievement',
      title: 'Achievements',
      type: 'item',
      url: '/artist/achievement',
      icon: WorkspacePremiumIcon,
      breadcrumbs: false
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
