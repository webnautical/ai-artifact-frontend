import { useNavigate } from 'react-router';
import { APICALL } from './api';
import { auth } from '../Utility';
import { useDataContext } from '../context/ContextProvider';

export const useNotificationHandler = () => {
    const navigate = useNavigate();
    const {setNotificationCount} = useDataContext();

    const handleNotificationClick = async (notification) => {
        const params = { notificationId: notification?._id, type: auth('admin')?.user_role }
        const res = await APICALL('/admin/readNotification', 'post', params)
        if(res?.status){
            setNotificationCount(res?.unreadNotificationCount)
        }
        switch (notification.type) {
            case "newproduct":
                navigate(`/${auth('admin')?.user_role}/products`);
                break;
            case "productupdate":
                navigate(`/${auth('admin')?.user_role}/product-details/${notification?.typeId}`);
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
            case 'withdrawRequest':
                navigate(`/${auth('admin')?.user_role}/withdrawal`);
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


export const useTierDetails = () => {
    const { getTierDetails } = useDataContext();

    const getTierDataById = (tierId) => {
        if (!getTierDetails) {
            console.warn("getTierDetails is undefined or not loaded yet.");
            return null; 
        }
        if (getTierDetails.length > 0) {
            const tierData = getTierDetails.find((tier) => tier._id === tierId);
            return tierData || null;
        } else {
            console.warn("getTierDetails is an empty array.");
            return null;
        }
    };

    return { getTierDataById };
};
