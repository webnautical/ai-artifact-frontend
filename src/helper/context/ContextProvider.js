import React, { createContext, useContext, useState, useEffect } from 'react';
import { APICALL } from '../api/api';
const ContextData = createContext();
export const useDataContext = () => useContext(ContextData);
export const ContextProvider = ({ children }) => {
    const [permisionData, setPermisionData] = useState(null)
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [loading, setLoading] = useState({
        'ranking': false,
        'tier' : false
    })
    const [directoryList, setDirectoryList] = useState([])
    useEffect(() => {
        getPermision()
        getTierImgFun()
    }, [])

    const [userInfoByID, setUserInfoByID] = useState(null)
    const [userDetailsLoading, setDetailsLoading] = useState(false)
    const getUserByIDFun = async (id) => {
        try {
            setDetailsLoading(true)
            const res = await APICALL('/user/userData', 'post', { id: id })
            if (res?.status) {
                setUserInfoByID(res?.user)
            } else {
                setUserInfoByID(null)
            }
        } catch (error) {
            console.log(error)
        } finally {
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


    const [artistRanking, setArtistRanking] = useState(null)
    const getArtistRankingFun = async (id) => {
        const params = { artistId: id }
        setLoading({ ...loading, 'ranking': true })
        try {
            const res = await APICALL(`artist/artistRanking`, 'post', params)
            if (res) {
                setArtistRanking(res)
            } else {
                setArtistRanking(null)
            }
        } catch (error) {
            setArtistRanking(null)
        } finally {
            setLoading({ ...loading, 'ranking': false })
        }
    }

    const getDirectoryFun = async (id) => {
        try {
            const res = await APICALL('artist/getartistDirectories', 'post', {id: id})
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
            userInfoByID, getUserByIDFun, userDetailsLoading,
            getTierImgFun, getRankTier,
            artistRanking, getArtistRankingFun,loading
        }}>
            {children}
        </ContextData.Provider>
    );
};