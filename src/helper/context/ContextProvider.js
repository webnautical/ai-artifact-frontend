import React, { createContext, useContext, useState, useEffect } from 'react';
import { APICALL } from '../api/api';
const ContextData = createContext();
export const useDataContext = () => useContext(ContextData);
export const ContextProvider = ({ children }) => {
    const [permisionData, setPermisionData] = useState(null)
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [collectionList, setCollectionList] = useState([])
    const [directoryList, setDirectoryList] = useState([])
    useEffect(() => {
        getTierImgFun()
    }, [])

    const [userInfoByID, setUserInfoByID] = useState(null)
    const [userDetailsLoading, setDetailsLoading] = useState(false)
    const getUserByIDFun = async (id) => {
        try {
            setDetailsLoading(true)
            const res = await APICALL('/user/userData', 'post', {id: id})
            if (res?.status) {
                setUserInfoByID(res?.user)
            } else {
                setUserInfoByID(null)
            }
        } catch (error) {
            console.log(error)
        }finally{
            setDetailsLoading(false)
        }
    }

    const getPermision = async () => {
        try {
            const res = await APICALL('/admin/getRoleById')
            if (res?.status) {
                setPermisionData(res?.data)
            } else {
                setPermisionData(null)
            }
        } catch (error) {
            setPermisionData(null)
        }
    }

    const getCategoryFun = async () => {
        const params = { type: 'category' }
        try {
            const res = await APICALL('admin/getAllCategory', 'post', params)
            if (res?.status) {
                setCategoryList(res?.data)
            } else {
                setCategoryList(null)
            }
        } catch (error) {
            setCategoryList(null)
        }
    }

    const getSubCategoryFun = async (id) => {
        const params = { id: id }
        try {
            const res = await APICALL('admin/getSubCategory', 'post', params)
            if (res?.status) {
                setSubCategoryList(res?.data)
            } else {
                setSubCategoryList(null)
            }
        } catch (error) {
            setSubCategoryList(null)
        }
    }
    const [getRankTier, setRankTier] = useState([])
    const getTierImgFun = async () => {
        try {
            const res = await APICALL('rank/getTiers', 'post', {})
            if (res?.status) {
                setRankTier(res?.data)
            } else {
                setRankTier(null)
            }
        } catch (error) {
            setRankTier(null)
        }
    }

    // const getCollectionFun = async (id) => {
    //     const params = { id: id }
    //     try {
    //         const res = await APICALL('admin/getAllCollections', 'post', params)
    //         if (res?.status) {
    //             setCollectionList(res?.data)
    //         } else {
    //             setCollectionList(null)
    //         }
    //     } catch (error) {
    //         setCollectionList(null)
    //     }
    // }

    console.log("getRankTier",getRankTier)

    const getDirectoryFun = async () => {
        try {
            const res = await APICALL('artist/getartistDirectories', 'post', {})
            if (res?.status) {
                setDirectoryList(res?.data)
            } else {
                setDirectoryList(null)
            }
        } catch (error) {
            setDirectoryList(null)
        }
    }

    return (
        <ContextData.Provider value={{
            getPermision, permisionData,
            getCategoryFun, categoryList,
            getSubCategoryFun, subCategoryList,
            // getCollectionFun, collectionList,
            getDirectoryFun, directoryList,
            userInfoByID, getUserByIDFun,userDetailsLoading,
            getTierImgFun,getRankTier
        }}>
            {children}
        </ContextData.Provider>
    );
};