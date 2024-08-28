import React, { useEffect } from 'react'
import ThemeCustomization from './admin/themes'
import ScrollTop from './admin/components/ScrollTop'
import Routes from './admin/routes'
import { auth } from './helper/Utility'
import { useLocation, useNavigate } from 'react-router-dom'
const Admin = () => {
    const pathname = useLocation()?.pathname
    const navigate = useNavigate()
    useEffect(() => {
        const authData = auth('admin')
        if (!authData?.token) {
            navigate('/admin/login')
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