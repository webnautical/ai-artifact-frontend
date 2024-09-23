import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import { APICALL } from '../../../helper/api/api';
import { TABLE_ROW_PER_PAGE } from '../../../helper/Constant';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { timeAgo } from '../../../helper/Utility';
import { Link, useNavigate } from 'react-router-dom';
import FrontLoader from '../../../components/FrontLoader';
import { styled } from '@mui/material/styles';
import  { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import orderlisticon from '../../../assets/images/orderlist.png'



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        getListFun();
    }, []);

    const getListFun = async () => {
        setLoading(true);
        try {
            const res = await APICALL("user/getuserOrders", "post", {});
            if (res?.status) {
                console.log("Order", res)
                setOrders(res.data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleButton = (row) => {
        navigate('/customer/order-details', { state: { order_id: row?._id } })
    }


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

    return (
        <>
            <div className="order_page">
                {
                    loading ? <FrontLoader /> :
                    
                          <Container>
                            <div className='account-profile-title'>
                             <h1>Order List</h1>
                             </div>
                      <div className='order_list_talbe account-content-box '>
                         
                            <Row>
                                {
                                    orders?.length > 0 ?
                                        <TableContainer  component={Paper} className='p-0'>
                                            <Table aria-label="customized table">
                                                <TableHead>
                                                    <TableRow>
                                                        
                                                        <StyledTableCell>S.No</StyledTableCell>
                                                        <StyledTableCell>Order ID</StyledTableCell>
                                                        {/* <StyledTableCell>Customer Name</StyledTableCell> */}
                                                        <StyledTableCell>Price</StyledTableCell>
                                                        <StyledTableCell>Status</StyledTableCell>
                                                        <StyledTableCell>Payment</StyledTableCell>
                                                        <StyledTableCell> Date </StyledTableCell>
                                                        <StyledTableCell align="right">Actions</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {orders?.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <StyledTableCell>{index + 1}</StyledTableCell>
                                                            <StyledTableCell>{row._id}</StyledTableCell>
                                                            {/* <StyledTableCell>{row.shippingAddress?.firstName + " " + row?.shippingAddress?.lastName}</StyledTableCell> */}
                                                            <StyledTableCell>${row.totalPrice?.toFixed(2)}</StyledTableCell>
                                                            <StyledTableCell>{row.status}</StyledTableCell>
                                                            <StyledTableCell>{row.paymentGateway}</StyledTableCell>
                                                            <StyledTableCell>{timeAgo(row.createdAt)}</StyledTableCell>
                                                            <StyledTableCell align="right">
                                                                <button className='order_view_btn' onClick={() => handleButton(row)}>
                                                                    <RemoveRedEyeIcon style={{ marginRight: "4px" }} /> View
                                                                </button>
                                                            </StyledTableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>

                                            </Table>
                                        </TableContainer>
                                        :
                                      <>
                                      <div className='cart_em_img text-center'>
<img src={orderlisticon} style={{ width:'128px '}} alt='order-list-icon'/>
                                      <h5 className='mt-2'>You haven't placed any orders yet.</h5>
                                      <p> Start shopping now!</p>
                                      <Link className="global_btn d-inline-block " to="/product-list">
                        Shop
                      </Link>
                                      </div>
                                      </>
                                }

                            </Row>
                      </div>
                        </Container>
                }

            </div>

        </>
    )
}

export default Orders