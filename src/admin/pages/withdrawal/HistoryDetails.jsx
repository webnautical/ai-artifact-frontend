import React from 'react'
import { timeAgo } from '../../../helper/Utility';

const HistoryDetails = ({ data }) => {
  const renderDetails = (data) => {
    if (typeof data === 'object' && data !== null) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}: </strong>
              {Array.isArray(value) ? (
                <ul>
                  {value.map((item, index) => (
                    <li key={index}>{renderDetails(item)}</li>
                  ))}
                </ul>
              ) : (
                renderDetails(value)
              )}
            </li>
          ))}
        </ul>
      );
    }
    return data;
  };
  return (
    <>
      <div>
        <strong>Transaction Details:</strong><hr />

        <p> <strong>Withdrawal ID:</strong> #{data._id} </p>
        <p> <strong>Transaction ID:</strong> {data.stripeTransactionId} </p>
        <p> <strong>Amount:</strong> ${data.amount} </p>
        <p className='text-capitalize'> <strong>Status:</strong> {data.status} </p>
        <p> <strong>Customer Name:</strong> {data?.user_id?.first_name + " " + data?.user_id?.last_name}</p>
        <p> <strong>Customer Email:</strong> {data?.user_id?.email}</p>
        <p><strong>Withdrawal Request Date:</strong> {timeAgo(data.createdAt)}</p>
        <p><strong>Transaction Date:</strong> {timeAgo(data.approvalTimestamp)}</p>
        <hr />
        <ul>
          {Object.entries(data?.paymentResponse).map(([key, value]) => (
            <li key={key}>
              <strong>{key}: </strong>
              {Array.isArray(value) ? (
                <ul>
                  {value.map((item, index) => (
                    <li key={index}>{renderDetails(item)}</li>
                  ))}
                </ul>
              ) : (
                renderDetails(value)
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default HistoryDetails