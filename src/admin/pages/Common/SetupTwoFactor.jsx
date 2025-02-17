import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { APICALL } from "../../../helper/api/api";
import { auth, encryptLocalStorageData } from "../../../helper/Utility";
import { Card, CardContent, CardHeader, CardActions } from "@mui/material";
import { Button, Switch, TextField, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { SERVER_ERR, SOMETHING_ERR } from "../../../helper/Constant";
const SetupTwoFactor = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [errMsg, setErrMsg] = useState("")

  useEffect(() => {
    if (auth("admin")?.is2FAEnabled) {
      setIs2FAEnabled(true)
      setQrCode(auth("admin")?.qrCode)
    }
  }, [])

  const handleToggle2FA = async () => {
    setIs2FAEnabled(!is2FAEnabled);
    try {
      const params = !is2FAEnabled ? { type: "enable" } : { type: "disable" }
      const res = await APICALL("/admin/enableAndDisable2FA", "post", params);
      if (res?.status) {
        setQrCode(res?.qrCode);
        const dataParam = {
          token: auth("admin")?.token,
          name: auth("admin")?.name,
          email: auth("admin")?.email,
          isSubadmin: auth("admin")?.isSubadmin,
          id: auth("admin")?.id,
          user_role: auth("admin")?.user_role,
          is2FAEnabled: res?.qrCode ? true : false,
          qrCode: res?.qrCode ? res?.qrCode : null
        }
        encryptLocalStorageData('admin-secret', dataParam, 'DoNotTryToAccess')
      }else{
        setErrMsg(res?.message || SOMETHING_ERR)
      }
    } catch (error) {
      console.error(error);
      setErrMsg(error?.response?.data?.message || SERVER_ERR)
    }finally{
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Paper className="table_samepattern py-5">
        <Box display="flex" justifyContent="center" alignItems="center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ width: 400, p: 3, boxShadow: 3 }}>
              <CardHeader title="Two-Factor Authentication" titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }} />
              <CardContent>
                <Typography variant="body1" mb={2}>
                  {is2FAEnabled
                    ? "Two-factor authentication is currently enabled. This ensures enhanced security for your account during login."
                    : "Protect your account by enabling two-factor authentication. This adds an extra step to verify your identity during login."}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="body1">Enable 2FA</Typography>
                  <Switch checked={is2FAEnabled} onChange={handleToggle2FA} />
                </Box>

                {qrCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="body1" color="textSecondary" mb={2}>Scan this QR code with your authentication app:</Typography>
                    {errMsg &&
                    <Typography variant="body1" color="error" mb={2}>{errMsg}</Typography>
                    }
                    <Box display="flex" justifyContent="center" mb={2}>
                      <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px' }} />
                    </Box>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Paper>
    </>
  );
};

export default SetupTwoFactor;