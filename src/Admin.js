import React, { useEffect } from 'react'
import ThemeCustomization from './admin/themes'
import ScrollTop from './admin/components/ScrollTop'
import Routes from './admin/routes'
import { auth } from './helper/Utility'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDataContext } from './helper/context/ContextProvider'
const Admin = () => {
    const authData = auth('admin')
    const pathname = useLocation()?.pathname
    const navigate = useNavigate()
    const { userInfoByID, getUserByIDFun } = useDataContext();
    useEffect(() => {
        if (authData?.token) {
            if(authData?.user_role != "admin"){
                if (userInfoByID?.status === false) {
                    navigate(`/`)
                    localStorage.removeItem("admin-secret")
                }
            }
        }else{
            navigate('/')
        }
    }, [userInfoByID]);
    useEffect(() => {
        if (authData?.token) {
            if (authData?.user_role !== "admin") {
                getUserByIDFun(authData?.id);
            }
        } else {
            navigate('/')
        }
    }, [pathname])

    return (
        <>
            <ThemeCustomization>
                <ScrollTop>
                    <Routes />
                </ScrollTop>
            </ThemeCustomization>
        </>
    )
}

export default Admin