import React from 'react'
import { auth } from '../helper/Utility';
import { useFrontDataContext } from '../helper/context/FrontContextProvider';

const WishlistIcon = ({item}) => {
    const { guestWishlist,isItemInGuestWishlist } = useFrontDataContext();
    const isLoggedIn = auth('customer');

    const isWishlisted = isLoggedIn ? item?.isWishlist : isItemInGuestWishlist(item?._id);
    return (
        <>
            {isWishlisted ? (
                <i className="fa-solid fa-heart" style={{ color: '#008080' }}></i>
            ) : (
                <i className="fa-regular fa-heart"></i>
            )}
        </>
    )
}

export default WishlistIcon