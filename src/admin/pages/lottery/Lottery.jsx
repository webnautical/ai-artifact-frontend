import React, { useState, useEffect } from 'react';
import { APICALL } from '../../../helper/api/api';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TablePagination,
} from "@mui/material";
import { formatdedDate, timeAgo, toastifyError, toastifySuccess } from '../../../helper/Utility';
import { SOMETHING_ERR, TABLE_PAGINATION_DROPDOWN, TABLE_ROW_PER_PAGE } from '../../../helper/Constant';
import BTNLoader from '../../../components/BTNLoader';

const Lottery = () => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_ROW_PER_PAGE);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSelectedCoupon(null)
  }
  const handleShow = () => setShow(true);
  const [rotation, setRotation] = useState(0);
  const [data, setData] = useState([]);
  const [winner, setWinner] = useState(null);
  const [spinFinished, setSpinFinished] = useState(false);
  const [spinTimeout, setSpinTimeout] = useState(null);
  const [loading, setLoading] = useState(false)
  const letsSpin = () => {
    const minRotation = 8888;
    const additionalRotation = 360 * 3;
    const newRotation = minRotation + additionalRotation + Math.floor(Math.random() * 360);

    if (spinTimeout) {
      clearTimeout(spinTimeout);
    }
    setRotation((prevRotation) => prevRotation + newRotation);
    setSpinFinished(false);
    makeSpin();
    const timeout = setTimeout(() => {
      setSpinFinished(true);
    }, 3300);
    setSpinTimeout(timeout);
  };

  useEffect(() => {
    allWinners()
    getCouponListFun()
  }, [])

  const makeSpin = async () => {
    try {
      const res = await APICALL("admin/getLotteryWinner", "post", {});
      if (res?.status) {
        setWinner(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const allWinners = async () => {
    try {
      const res = await APICALL("admin/getAllWinners", "post", {});
      if (res?.status) {
        setData(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [couponList, setCouponList] = useState([])
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const getCouponListFun = async () => {
    try {
      const res = await APICALL("admin/getAllCoupons", "post", { status: true });
      if (res?.status) {
        setCouponList(res?.data);
      }
    } catch (error) {
    }
  };
  const handleChange = (e) => {
    const selectedCode = e.target.value;
    const selectedObject = couponList.find(coupon => coupon.code === selectedCode);
    setSelectedCoupon(selectedObject);
  };
  useEffect(() => {
    return () => {
      if (spinTimeout) {
        clearTimeout(spinTimeout);
      }
    };
  }, [spinTimeout]);

  const giveCoupon = async () => {
    if (!selectedCoupon) {
      toastifyError("Please select coupon.")
      return false
    }
    setLoading(true)
    const params = {
      "winner_id": winner?.user_id,
      "coupon_code": selectedCoupon?.code
    }
    try {
      const res = await APICALL("admin/awardCouponToWinner", "post", params);
      if (res?.status) {
        allWinners();
        handleClose()
        toastifySuccess("Awarded successfully !!")
      }
    } catch (error) {
      toastifyError(SOMETHING_ERR)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper className="table_samepattern">
      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px" }}>
        <h1 className="title-admins-table">Lottery</h1>
      </div>
      <div className="lottery_outer">
        <div className="lottery_box">
          <div id="main" className="main">
            <div id="wheel" className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
              <div>
                <span className="span1"><p></p></span>
                <span className="span2"><p></p></span>
                <span className="span3"><p></p></span>
                <span className="span4"><p></p></span>
                <span className="span5"><p></p></span>
                <span className="span6"><p></p></span>
                <span className="span7"><p></p></span>
                <span className="span8"><p></p></span>
              </div>
            </div>
            <div className="pointer"></div>
            <button className="spin" onClick={letsSpin}>SPIN</button>
            {spinFinished && winner && (
              <div className="winner-spot">
                <p>{winner.winner_name}</p>
                <p>{winner.email}</p>
              </div>
            )}
          </div>
        </div>
        <div className='text-center'>
          {spinFinished && winner && (
            <Button variant="primary" onClick={handleShow}> Award Winner</Button>
          )}
        </div>
      </div>

      <TableContainer>
        <strong className='mx-3'>All Winners</strong>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Discount Type</TableCell>
              <TableCell>Discount Value</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row?.winner_id?.first_name + "" + row?.winner_id?.last_name}</TableCell>
                <TableCell>{row?.winner_id?.email}</TableCell>
                <TableCell>{row?.coupon_id?.code}</TableCell>
                <TableCell>{row?.coupon_id?.discountType}</TableCell>
                <TableCell>{row?.coupon_id?.discountValue}</TableCell>
                <TableCell align="right">{timeAgo(row?.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={TABLE_PAGINATION_DROPDOWN}
        component="div"
        count={data?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal className='modal-all' show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Award Winner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className="col-md-12">
              <select
                name="coupon_code"
                value={selectedCoupon?.code || ''}
                className="form-control"
                onChange={handleChange}
              >
                <option value="" disabled>Select a coupon</option>
                {couponList?.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code}
                  </option>
                ))}
              </select>
              {
                selectedCoupon &&
                <div className="details-box-lottery">
                  <p><strong>Discount Type : {selectedCoupon?.discountType}</strong></p>
                  {selectedCoupon?.discountValue && <p><strong>Discount Value : {selectedCoupon?.discountValue}</strong></p>}
                  <p><strong>Min Purchase Amount : ${selectedCoupon?.minPurchaseAmount}</strong></p>
                  <p><strong>Used Count : {selectedCoupon?.usedCount}</strong></p>
                  <p><strong>Total Usage Limit : {selectedCoupon?.totalUsageLimit}</strong></p>
                  <p><strong>Start Date : {formatdedDate(selectedCoupon?.startDate)}</strong></p>
                  <p><strong>End Date : {formatdedDate(selectedCoupon?.endDate)}</strong></p>
                </div>
              }
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}> Close</Button>
          {
            loading ? <BTNLoader className={"btn btn-primary"} />
              :
              <Button variant="primary" onClick={giveCoupon}>Award Winner</Button>
          }
        </Modal.Footer>
      </Modal>
    </Paper>
  );
};

export default Lottery;
