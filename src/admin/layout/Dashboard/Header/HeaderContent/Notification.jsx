import { useEffect, useRef, useState } from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import MainCard from "../../../../components/MainCard";
import Transitions from "../../../../components/@extended/Transitions";

import BellOutlined from "@ant-design/icons/BellOutlined";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import MessageOutlined from "@ant-design/icons/MessageOutlined";
import { APICALL } from '../../../../../helper/api/api'
import { auth, timeAgo } from "../../../../../helper/Utility";
import { useNavigate } from "react-router";
import { useNotificationHandler } from "../../../../../helper/api/RepeaterAPI";
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

const actionSX = {
  mt: "6px",
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",

  transform: "none",
};

export default function Notification() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const handleNotificationClick = useNotificationHandler();
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

  const anchorRef = useRef(null);
  const [read, setRead] = useState(2);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    getListFun()
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = "grey.100";

  useEffect(() => {
    getListFun()
  }, [])

  const getListFun = async () => {
    try {
      const api = auth('admin')?.user_role === 'admin' ? 'admin/adminNotifications' : 'artist/notifications'
      const res = await APICALL(api, 'post', {})
      if (res?.status) { setData(res?.data); setRead(res?.data?.length) }
    } catch (error) { }
  }

  const viewAll = () =>{
    navigate(`/${auth('admin')?.user_role}/notifications`)
    setOpen(false)
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{
          color: "text.primary",
          bgcolor: open ? iconBackColorOpen : "transparent",
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={read} className="badge-color">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? "bottom" : "bottom-end"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            { name: "offset", options: { offset: [matchesXs ? -5 : 0, 9] } },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="grow"
            position={matchesXs ? "top" : "top-right"}
            in={open}
            {...TransitionProps}
          >
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: "100%",
                minWidth: 285,
                maxWidth: { xs: 285, md: 420 },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  // secondary={
                  //   <>
                  //     {read > 0 && (
                  //       <Tooltip title="Mark as all read">
                  //         <IconButton
                  //           color="success"
                  //           size="small"
                  //           onClick={() => setRead(0)}
                  //         >
                  //           <CheckCircleOutlined
                  //             style={{ fontSize: "1.15rem" }}
                  //           />
                  //         </IconButton>
                  //       </Tooltip>
                  //     )}
                  //   </>
                  // }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      "& .MuiListItemButton-root": {
                        py: 0.5,
                        "&.Mui-selected": {
                          bgcolor: "grey.50",
                          color: "text.primary",
                        },
                        "& .MuiAvatar-root": avatarSX,
                        "& .MuiListItemSecondaryAction-root": {
                          ...actionSX,
                          position: "relative",
                        },
                      },
                    }}
                  >
                    {
                      data?.slice(0,5).map((item, i) => (
                        <ListItemButton onClick={()=>{handleNotificationClick(item); setOpen(false)}} 
                        style={{ cursor: 'pointer', background: item?.status === "unread" ? "#E8FFE7": "" }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{color: "primary.main",bgcolor: "primary.lighter"}}><MessageOutlined /></Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Typography variant="h6" sx={{ color: '#000' }}>{item?.message}</Typography>}
                            secondary={timeAgo(item?.created_at)}
                          />
                        </ListItemButton>
                      ))
                    }

                    <ListItemButton sx={{ textAlign: "center", py: `${12}px !important` }} onClick={() =>viewAll()}>
                      <ListItemText primary={<Typography variant="h6" color="primary">View All</Typography>}/>
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
