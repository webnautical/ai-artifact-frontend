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
                navigate(`/${auth('admin')?.user_role}/products`);
                break;
            case 'neworder':
                navigate(`/${auth('admin')?.user_role}/orders/list`);
                break;
            case 'registration':
                navigate(`/${auth('admin')?.user_role}/user-management-details/${notification?.user_id}`);
                break;
            case 'newreview':
                navigate(`/${auth('admin')?.user_role}/reviews`);
                break;
            case 'productapproval':
                navigate(`/${auth('admin')?.user_role}/artworks`);
                break;
            case 'productdelete':
                navigate(`/${auth('admin')?.user_role}/artworks`);
                break;
            case 'productrejection':
                navigate(`/${auth('admin')?.user_role}/artworks`);
                break;
            case 'sale':
                navigate(`/${auth('admin')?.user_role}/sold-art`);
                break;
            default:
                console.log('Unknown notification type');
        }
    };

    return handleNotificationClick;
};