import React from 'react'

const NoData = ({img, msg}) => {
  return (
    <>
        <div className='text-center'>
            <img src={img} alt="" style={{width : '400px', height: '230px', objectFit: 'cover'}}/>
            <h5>{msg}</h5>
        </div>
    </>
  )
}

export default NoData