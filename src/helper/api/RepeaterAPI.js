import { useNavigate } from 'react-router';
import { APICALL } from './api';
import { auth } from '../Utility';

export const useNotificationHandler = () => {
    const navigate = useNavigate();

    const handleNotificationClick = async (notification) => {
        const params = {notificationId: notification?._id, type: auth('admin')?.user_role}
        APICALL('/admin/readNotification', 'post', params)
        switch (notification.type) {
            case "newproduct":
                navigate(`/admin/products`);
                break;
            case 'neworder':
                navigate(`/admin/orders/list`);
                break;
            case 'registration':
                navigate(`/admin/user-management-details/${notification?.user_id}`);
                break;
            case 'newreview':
                navigate(`/admin/reviews`);
                break;
            case 'productapproval':
                navigate(`/admin/artworks`);
                break;
            case 'productdelete':
                navigate(`/admin/artworks`);
                break;
            case 'productrejection':
                navigate(`/admin/artworks`);
                break;
            case 'sale':
                navigate(`/admin/sold-art`);
                break;
            default:
                console.log('Unknown notification type');
        }
    };

    return handleNotificationClick;
};