import { useNavigate } from 'react-router';

export const useNotificationHandler = () => {
    const navigate = useNavigate();

    const handleNotificationClick = (notification) => {
        switch (notification.type) {
            case "newproduct":
                navigate(`/admin/products`);
                break;
            case 'order':
                navigate(`/order/${notification.typeId}`);
                break;
            case 'message':
                navigate(`/messages/${notification.user_id}`);
                break;
            default:
                console.log('Unknown notification type');
        }
    };

    return handleNotificationClick;
};