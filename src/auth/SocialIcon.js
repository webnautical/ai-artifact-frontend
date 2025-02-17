import React, { useState } from 'react'
// import FacebookLogin from 'react-facebook-login-lite';
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { useGoogleLogin } from '@react-oauth/google';
import { FB_APP_ID } from "../helper/Constant";
import { APICALL } from '../helper/api/api';
import { encryptLocalStorageData } from '../helper/Utility';
import { useNavigate } from 'react-router';
import {
    GoogleLogin,
    useGoogleLogin,
} from "@react-oauth/google";
import axios from 'axios';
const SocialIcon = () => {
    const navigate = useNavigate()
    const [loader, setLoader] = useState({
        'facebook': false,
        'google': false
    })
    const responseFacebook = (response) => {
        setLoader({ ...loader, 'facebook': true })
        if (response?.userID) {
            const res = { name: response?.name, email: response?.email, provider: 'facebook', providerId: response?.accessToken }
            LoginBySoical(res)
        }
    };
    const responseGoogle = (response) => {
        if (response?.clientId) {
            const decodedToken = parseJwt(response.credential);
            const res = { name: decodedToken?.name, email: decodedToken?.email, provider: 'google', providerId: response?.clientId }
            LoginBySoical(res)
        }
    };

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Invalid token', e);
            return null;
        }
    };

    const LoginBySoical = async (params) => {
        try {
            const res = await APICALL('/user/socialLogin', 'post', params)
            if (res?.token) {
                const dataParam = {
                    token: res?.token,
                    name: res?.user?.first_name,
                    email: res?.user?.email,
                    id: res?.user?._id,
                }
                encryptLocalStorageData('customer-secret', dataParam, 'DoNotTryToAccess')
                const productURL = sessionStorage.getItem('p-url')
                if (productURL) {
                    navigate(productURL)
                    sessionStorage.removeItem('p-url')
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    function onError(error) {
        console.error('Login Failed:', error);
    }
    function CustomGoogleButton({ onClick, disabled }) {
        return (
            <button className='google_btn'
                type='button'
                onClick={onClick}
                disabled={disabled}

            >

                Log in Google
            </button>
        );
    }

    const onSuccess = (response, adf) => {
        console.log('Login Success:', response);
        console.log('Login Success: adf', adf);
        if (response?.access_token) {
            const decodedToken = parseJwt(response.access_token); // Assuming parseJwt is defined
            const res = {
                name: decodedToken?.name,
                email: decodedToken?.email,
                provider: 'google',
                providerId: response?.clientId,
            };
            console.log("result", res)
            LoginBySoical(res); // Your function to handle social login
        }
    };


    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: `Bearer ${tokenResponse?.access_token}` } },
            );
            if (userInfo?.status) {
                const res = { name: userInfo?.data?.name, email: userInfo?.data?.email, provider: 'google', providerId: tokenResponse?.access_token }
                LoginBySoical(res)
            }
            console.log(userInfo);
        },
        onError: errorResponse => console.log(errorResponse),
    });

    return (
        <>
            <div className="log_in_using mt-3">
                <ul>
                    {/* <li>
                        <GoogleLogin
                            render={(renderProps) => (
                                <CustomGoogleButton
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                />
                            )}
                            onSuccess={responseGoogle}
                            onError={onError}
                        />
                    </li>

                    <li>

                        <GoogleLogin
                            onSuccess={onGoogleSuccess}
                            onFailure={onGoogleError}
                            text="continue_with"
                            theme="outline"
                            width="100%"
                            containerProps={{
                                style: {
                                    width: "100% !important",
                                },
                            }}
                        />
                    </li> */}

                    <li>
                        <button className='google_btn' type='button' onClick={() => login()} style={{

                        }}>          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="20" height="20" x="0" y="0" viewBox="0 0 512 512" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve">
                                <g>
                                    <path d="m492.668 211.489-208.84-.01c-9.222 0-16.697 7.474-16.697 16.696v66.715c0 9.22 7.475 16.696 16.696 16.696h117.606c-12.878 33.421-36.914 61.41-67.58 79.194L384 477.589c80.442-46.523 128-128.152 128-219.53 0-13.011-.959-22.312-2.877-32.785-1.458-7.957-8.366-13.785-16.455-13.785z" style={{ fill: '#167ee6' }} data-original="#167ee6" />
                                    <path d="M256 411.826c-57.554 0-107.798-31.446-134.783-77.979l-86.806 50.034C78.586 460.443 161.34 512 256 512c46.437 0 90.254-12.503 128-34.292v-.119l-50.147-86.81c-22.938 13.304-49.482 21.047-77.853 21.047z" style={{ fill: '#12b347' }} data-original="#12b347" />
                                    <path d="M384 477.708v-.119l-50.147-86.81c-22.938 13.303-49.48 21.047-77.853 21.047V512c46.437 0 90.256-12.503 128-34.292z" style={{ fill: '#0f993e' }} data-original="#0f993e" />
                                    <path d="M100.174 256c0-28.369 7.742-54.91 21.043-77.847l-86.806-50.034C12.502 165.746 0 209.444 0 256s12.502 90.254 34.411 127.881l86.806-50.034c-13.301-22.937-21.043-49.478-21.043-77.847z" style={{ fill: '#ffd500' }} data-original="#ffd500" />
                                    <path d="M256 100.174c37.531 0 72.005 13.336 98.932 35.519 6.643 5.472 16.298 5.077 22.383-1.008l47.27-47.27c6.904-6.904 6.412-18.205-.963-24.603C378.507 23.673 319.807 0 256 0 161.34 0 78.586 51.557 34.411 128.119l86.806 50.034c26.985-46.533 77.229-77.979 134.783-77.979z" style={{ fill: '#ff4b26' }} data-original="#ff4b26" />
                                    <path d="M354.932 135.693c6.643 5.472 16.299 5.077 22.383-1.008l47.27-47.27c6.903-6.904 6.411-18.205-.963-24.603C378.507 23.672 319.807 0 256 0v100.174c37.53 0 72.005 13.336 98.932 35.519z" style={{ fill: '#d93f21' }} data-original="#d93f21" />
                                </g>
                            </svg>Log in with Google</button>
                    </li>


                    {/* <li>
                        <FacebookLogin
                            appId={FB_APP_ID}
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={responseFacebook}
                            render={renderProps => (
                                <button
                                    type='button'
                                    onClick={renderProps.onClick}
                                    className="customer_fb_btn"
                                    disabled={renderProps.isDisabled}
                                >
                                    <><i className='fab fa-facebook me-2'></i>Facebook</>
                                </button>
                            )}
                        />
                    </li> */}
                </ul>
            </div>


        </>
    )
}

export default SocialIcon