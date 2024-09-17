import { AccountCircleOutlined, AddModeratorOutlined, Dashboard, FolderSharedOutlined, NotificationsActiveOutlined, PaidOutlined, PeopleAltOutlined } from '@mui/icons-material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BookIcon from '@mui/icons-material/Book';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { auth } from '../../helper/Utility';
const icons = {
  Dashboard,
  FolderSharedOutlined,
  PeopleAltOutlined,
  AddModeratorOutlined,
  PaidOutlined,
  NotificationsActiveOutlined,
  AccountCircleOutlined,
  PermMediaIcon
};
const dashboard = {
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
      id: 'withdrawal',
      title: 'Withdrawal',
      type: 'item',
      url: '/admin/withdrawal',
      icon: icons.Dashboard,
      breadcrumbs: false
    },
    {
      id: 'RolesPermission',
      title: 'Roles & Permission',
      type: 'item',
      url: '/admin/roles-permission',
      icon: icons.FolderSharedOutlined,
      breadcrumbs: false
    },
    {
      id: 'UserManagement',
      title: 'User Management',
      type: 'collapse',
      icon: icons.PeopleAltOutlined,
      children: [
        {
          id: 'customer',
          title: 'Customer',
          type: 'item',
          url: `/admin/user-management/customer`,
          breadcrumbs: false
        },
        {
          id: 'artist',
          title: 'Artist',
          type: 'item',
          url: `/admin/user-management/artist`,
          breadcrumbs: false
        },
        {
          id: 'affiliate',
          title: 'Affiliate',
          type: 'item',
          url: `/admin/user-management/affiliate`,
          breadcrumbs: false
        }
      ] 
    },

    {
      id: 'Product Management',
      title: 'Product Management',
      type: 'collapse',
      icon: icons.PeopleAltOutlined,
      children: [
        {
          id: "Products",
          title: "Products",
          type: "item",
          url: `products`,
          breadcrumbs: false,
        },
        {
          id: 'Categories List',
          title: 'Categories List',
          type: 'item',
          url: `categories-list`,
          breadcrumbs: false
        },
        {
          id: "Reviews",
          title: "Reviews",
          type: "item",
          url: `reviews`,
          breadcrumbs: false,
        },
      ] 
    },
    {
      id: 'orders',
      title: 'Orders',
      type: 'collapse',
      icon: icons.PeopleAltOutlined,
      children: [
        {
          id: 'all_orders',
          title: 'All Orders',
          type: 'item',
          url: `/admin/orders/list`,
          breadcrumbs: false
        },

        {
          id: 'transaction',
          title: 'Transaction History',
          type: 'item',
          url: `/admin/orders/transaction`,
          breadcrumbs: false
        },  
      ] 
    },
    {
      id: 'SubAdmin',
      title: 'Sub Admin',
      type: 'item',
      url: '/admin/sub-admin',
      icon: icons.PeopleAltOutlined,
      breadcrumbs: false
    }, 
    {
      id: 'pages',
      title: 'Pages',
      type: 'collapse',
      icon: icons.AddModeratorOutlined,
      children: [
        {
          id: 'contact-us',
          title: 'Contact Us',
          type: 'item',
          url: `/admin/pages/contact-us`,
          breadcrumbs: false
        },
        {
          id: 'about-us',
          title: 'About Us',
          type: 'item',
          url: `/admin/pages/about-us`,
          breadcrumbs: false
        },
        {
          id: 'shipping',
          title: 'Shipping',
          type: 'item',
          url: `/admin/pages/shipping`,
          breadcrumbs: false
        },
        {
          id: 'copyright',
          title: 'Copyright',
          type: 'item',
          url: `/admin/pages/copyright-complaints`,
          breadcrumbs: false
        },
        {
          id: 'terms-of-use',
          title: 'Terms Of Use',
          type: 'item',
          url: `/admin/pages/terms-of-use`,
          breadcrumbs: false
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          type: 'item',
          url: `/admin/pages/privacy-policy`,
          breadcrumbs: false
        },
        {
          id: 'what-is-aiartifact',
          title: 'What is AiArtifact',
          type: 'item',
          url: `/admin/pages/what-is-aiartifact`,
          breadcrumbs: false
        },
 
        {
          id: 'aiartifact-club',
          title: 'Aiartifact club',
          type: 'item',
          url: `/admin/pages/aiartifact-club`,
          breadcrumbs: false
        },
 
        {
          id: 'mounting-instructions',
          title: 'Mounting Instructions',
          type: 'item',
          url: `/admin/pages/mounting-instructions`,
          breadcrumbs: false
        },
        {
          id: 'faq',
          title: 'Faq',
          type: 'item',
          url: `/admin/faq`,
          breadcrumbs: false
        },
      ] 
    },
    {
      id: 'contactQuery',
      title: 'Contact Query',
      type: 'item',
      url: '/admin/contact-query',
      icon: icons.AddModeratorOutlined,
      breadcrumbs: false
    },  
    {
      id: 'Subscribers',
      title: 'Subscribers',
      type: 'item',
      url: '/admin/subscribers',
      icon: icons.AddModeratorOutlined,
      breadcrumbs: false
    },  
    {
      id: 'blogs',
      title: 'Blogs',
      type: 'item',
      url: '/admin/blogs',
      icon: BookIcon,
      breadcrumbs: false
    },  
    {
      id: 'notifications',
      title: 'Notifications',
      type: 'item',
      url: '/admin/notifications',
      icon: icons.AddModeratorOutlined,
      breadcrumbs: false
    },  
    {
      id: "general-settings",
      title: "General Settings",
      type: "item",
      url: "/admin/general-settings",
      icon: icons.AddModeratorOutlined,
      breadcrumbs: false,
    },
    {
      id: "gelato-price",
      title: "Gelato Price",
      type: "item",
      url: "/admin/gelato-price",
      icon: AttachMoneyIcon,
      breadcrumbs: false,
    },
    {
      id: "banner-images",
      title: "Banner & Images",
      type: "item",
      url: `/${auth('admin')?.user_role}/banner-images`,
      icon: icons.PermMediaIcon,
      breadcrumbs: false,
    },
    {
      id: "coupon",
      title: "Coupon",
      type: "item",
      url: "/admin/coupon",
      icon: LocalOfferIcon,
      breadcrumbs: false,
    },
    {
      id: "lottery",
      title: "Lottery",
      type: "item",
      url: "/admin/lottery",
      icon: LocalOfferIcon,
      breadcrumbs: false,
    },
  ]
};

export default dashboard;
