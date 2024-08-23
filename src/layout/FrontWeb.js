import React from 'react'
import Header from '../front/include/Header';
import Footer from '../front/include/Footer';
import { useLocation } from 'react-router';
import { FrontContextProvider } from './../helper/context/FrontContextProvider';
const FrontWeb = ({ cmp, header }) => {
    const Component = cmp;
    const pathname = useLocation()?.pathname
    return (
        <>
        <FrontContextProvider>
            {
                // (pathname != "/login/artist" && pathname != "/signup/artist" && pathname != "/signup/affiliate" && pathname != "/login/affiliate") &&
                <Header />
            }
            <Component />
            {
                (pathname != "/login/artist" && pathname != "/signup/artist" && pathname != "/signup/affiliate" && pathname != "/login/affiliate") &&
                <Footer />
            }
        </FrontContextProvider>

        </>
    )
}

export default FrontWeb