import React, { createContext, useContext, useEffect, useState } from 'react';
import { APICALL } from '../api/api';
import { auth, toastifySuccess } from '../Utility';
import { useNavigate } from 'react-router';
const ContextData = createContext();
export const useFrontDataContext = () => useContext(ContextData);
export const FrontContextProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([])
    const [cartList, setCartList] = useState([])
    const [productList, setProductList] = useState([])
    const [generalSetting, setGeneralSetting] = useState(null)
    const [headerContent, setHeaderContent] = useState(null)
    const [gelatoPriceArr, setGelatoPriceArr] = useState([])
    const [customerInfo, setCustomerInfo] = useState(null)
    const navigate = useNavigate()
    const [contextLoader, setContextLoader] = useState({
        'wishlist': false,
        'cartList': false,
        'product': false,
        'addToCart': {},
    })
    const customer_id = auth('customer')?.id
    useEffect(() => {
        if (auth('customer')) {
            getCustomerInfoFun()
        }
    }, [customer_id])
    useEffect(() =>{
        getGelatoPriceArrayFun()
    },[])
 
    const getCustomerInfoFun = async () => {
        try {
            const res = await APICALL('user/getuserData', 'post', {})
            if (res?.status) {
                setCustomerInfo(res?.data)
            } else {
                setCustomerInfo(null)
            }
        } catch (error) {
            setCustomerInfo(null)
        }
    }

    const [userInfoByID, setUserInfoByID] = useState(null)
    const getUserByIDFun = async (id) => {
        try {
            const res = await APICALL('/user/userData', 'post', {id: id})
            if (res?.status) {
                setUserInfoByID(res?.user)
            } else {
                setUserInfoByID(null)
            }
        } catch (error) {
            console.log(error)
        }
    }
 
 
    const getProductListFun = async (obj) => {
        setContextLoader({ ...contextLoader, 'product': true })
        try {
            const params = {
                limit: obj?.limit || 10,
                categoryId: obj?.category_id
            };
            const res = await APICALL("user/allArtwork", "post", params);
            if (res?.status) {
                setProductList(res?.data);
                setContextLoader({ ...contextLoader, 'product': false })
            } else {
                setProductList([]);
                setContextLoader({ ...contextLoader, 'product': false })
            }
        } catch (error) {
            setProductList([]);
            setContextLoader({ ...contextLoader, 'product': false })
        }
    };
 
    const addRemoveWishList = async (product_id, getArtWorkListFun, call = false) => {
        if (auth('customer')) {
            try {
                const param = { product_id: product_id }
                const res = await APICALL('user/addremoveWishlist', 'post', param)
                if (res?.status) {
                    getCustomerInfoFun()
                    if (call) {
                        getArtWorkListFun()
                        getProductListFun()
                        getWishListFun()
                    }
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            navigate('/login/customer')
        }
    }
 
    const getWishListFun = async () => {
        setContextLoader({ ...contextLoader, 'wishlist': true })
        try {
            const res = await APICALL('user/getWishlist', 'post', {})
            if (res?.status) {
                setWishlist(res?.data)
                getCustomerInfoFun()
            } else {
                setWishlist([])
            }
        } catch (error) {
            setWishlist([])
        } finally {
            setContextLoader({ ...contextLoader, 'wishlist': false })
        }
    }
 
    const getCartListFun = async (loader) => {
        if(!loader){
            setContextLoader({ ...contextLoader, 'cartList': true })
        }
        try {
            const res = await APICALL('user/getCart', 'post', {})
            if (res?.status) {
                setCartList(res?.data)
            } else {
                setCartList([])
            }
        } catch (error) {
            setCartList([])
        } finally {
            setContextLoader({ ...contextLoader, 'cartList': false })
        }
    }
 
    const addToCartFun = async (product_id, qnt, puid, p_obj, type) => {
        if (auth('customer')) {
            if(type !== "qntChange"){
                setContextLoader((prevLoader) => ({
                    ...prevLoader,
                    addToCart: { ...prevLoader.addToCart, [product_id]: true },
                }));
            }
            try {
                const param = { product_id: product_id, quantity: qnt, puid: puid, ...p_obj }
                const res = await APICALL('user/addToCart', 'post', param)
                if (res?.status) {
                    getCustomerInfoFun()
                    toastifySuccess(res?.message)
                    getCartListFun(true)
                    // if(qnt !== 0){
                    //     if(type === undefined){
                    //         await addRemoveWishList(product_id)
                    //     }
                    // }
                    await getWishListFun()
                }
            } catch (error) {
                console.log(error)
            } finally {
                setContextLoader((prevLoader) => ({
                    ...prevLoader,
                    addToCart: { ...prevLoader.addToCart, [product_id]: false },
                }));
            }
        } else {
            navigate('/login/customer')
        }
    }
 
    const getGeneralSettingFun = async () => {
        try {
            const res = await APICALL('user/getgeneralSettings', 'post', {})
            if (res?.status) {
                setGeneralSetting(res?.data)
            } else {
                setGeneralSetting(null)
            }
        } catch (error) {
            setGeneralSetting(null)
        }
    }
 
    const getHeaderContent = async () => {
        try {
            const res = await APICALL('admin/getAllCategoriesWithSubcategories', 'post', {})
            if (res?.status) {
                setHeaderContent(res?.data)
            } else {
                setHeaderContent(null)
            }
        } catch (error) {
            setHeaderContent(null)
        }
    }
 
    const getGelatoPriceArrayFun = async () => {
        try {
            const res = await APICALL('admin/getProductUid', 'post', {})
            if (res?.status) {
                setGelatoPriceArr(res?.data)
            } else {
                setGelatoPriceArr(null)
            }
        } catch (error) {
            setGelatoPriceArr(null)
        }
    }
 
    return (
        <ContextData.Provider value={{
            contextLoader,
            addRemoveWishList,
            getWishListFun, wishlist,
            addToCartFun,
            getCartListFun, cartList,
            getProductListFun, productList,
            getGeneralSettingFun, generalSetting,
            getHeaderContent, headerContent,
            getGelatoPriceArrayFun, gelatoPriceArr,
            customerInfo, getCustomerInfoFun,
            userInfoByID, getUserByIDFun
        }}>
            {children}
        </ContextData.Provider>
    );
};