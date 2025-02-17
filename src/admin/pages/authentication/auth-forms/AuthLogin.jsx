import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

import * as Yup from 'yup';
import { Formik } from 'formik';

import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { encryptLocalStorageData } from '../../../../helper/Utility';
import { useNavigate } from 'react-router';
import { APICALL } from '../../../../helper/api/api';

import ReCAPTCHA from "react-google-recaptcha";
import { CAPTCHA_SITE_KEY } from '../../../../helper/Constant';
export default function AuthLogin() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (values, setSubmitting, setErrors) => {
    try {
      const res = await APICALL('/admin/loginAdminUser', 'post', values)
      if (res?.status) {
        if (res?.is2FAEnabled) {
          setIs2FAEnabled(res?.is2FAEnabled)
        } else {
          const dataParam = {
            token: res?.token,
            name: res?.data?.first_name + " " + res?.data?.last_name,
            email: res?.data?.email,
            isSubadmin: res?.data?.isSubadmin,
            id: res?.data?._id,
            user_role: res?.data?.user_role,
            is2FAEnabled: res?.data?.is2FAEnabled,
          }
          encryptLocalStorageData('admin-secret', dataParam, 'DoNotTryToAccess')
          navigate('/admin/dashboard')
          window.location.reload()
        }
      } else {
        setErrors({ submit: "Invalid Username or Password" });
      }
    } catch (error) {
      console.error('Login error', error);
      setErrors({ submit: error.response?.data?.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          otp: '',
          submit: null,
          captcha: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: !is2FAEnabled
            ? Yup.string().max(255).required('Password is required')
            : Yup.string(), // Skip password validation when 2FA is enabled
          captcha: !is2FAEnabled
            ? Yup.string().required('Please complete the reCAPTCHA.')
            : Yup.string(), // Skip captcha validation when 2FA is enabled
          otp: is2FAEnabled
            ? Yup.string()
              .length(6, 'OTP must be 6 digits long')
              .matches(/^[0-9]{6}$/, 'OTP must contain only digits')
              .required('OTP is required')
            : Yup.string(), // Skip OTP validation when 2FA is not enabled
        })}

        onSubmit={(values, { setSubmitting, setErrors }) => {
          setSubmitting(true);
          handleLogin(values, setSubmitting, setErrors);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              {!is2FAEnabled ?
                <>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-login">Email Address</InputLabel>
                      <OutlinedInput
                        id="email-login"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        fullWidth
                        error={Boolean(touched.email && errors.email)}
                      />
                    </Stack>
                    {touched.email && errors.email && (
                      <FormHelperText error id="standard-weight-helper-text-email-login">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-login">Password</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="-password-login"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              color="secondary"
                            >
                              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="Enter password"
                      />
                    </Stack>
                    {touched.password && errors.password && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <ReCAPTCHA
                        sitekey={CAPTCHA_SITE_KEY}
                        onChange={(token) => setFieldValue('captcha', token)}
                        onExpired={() => setFieldValue('captcha', null)}
                      />
                    </Stack>
                    {touched.captcha && errors.captcha && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.captcha}
                      </FormHelperText>
                    )}
                  </Grid>
                </>
                :
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-login">OTP</InputLabel>
                    <OutlinedInput
                      id="email-login"
                      type="text"
                      value={values.otp}
                      name="otp"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="OTP"
                      fullWidth
                      error={Boolean(touched.otp && errors.otp)}
                    />
                  </Stack>
                  {touched.otp && errors.otp && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.otp}
                    </FormHelperText>
                  )}
                </Grid>
              }

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                {
                  isSubmitting ?
                    <Button disableElevation fullWidth size="large" type="submit" variant="contained" className='global_btn'>
                      Loading ...
                    </Button>
                    :
                    <Button fullWidth size="large" type="submit" variant="contained" className='global_btn'>Login</Button>
                }
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
