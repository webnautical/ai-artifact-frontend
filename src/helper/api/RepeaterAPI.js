export const handleNotificationClick = (notification, navigate) => {
    switch (notification.type) {
        case 'newproduct':
            navigate(`/admin/product`);
            break;
        case 'order':
            navigate(`/order/${notification.typeId}`);
            break;
        case 'message':
            navigate(`/messages/${notification.user_id}`);
            break;
        // Add more cases as needed
        default:
            console.log('Unknown notification type');
    }
};