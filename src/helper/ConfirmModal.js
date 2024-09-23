import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import BTNLoader from '../components/BTNLoader'
import removephoto from '../assets/images/remove.png'

const ConfirmModal = (props) => {
  const { modalOpen, setModalOpen, msg, btn1, btn2, funCall, submitLoading } = props

  return (
    <>
    <Modal className="modal-all" centered show={modalOpen} onHide={()=>setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title> </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            <div className='col-12 text-center'>
              <img style={{ width:'100px'}} src={removephoto} alt='delete-icon'/>
                <h5 className='mt-3'>{msg}</h5>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className='line-close-btn' onClick={()=>setModalOpen(false)}> {btn1}</Button>
          {
            submitLoading ? <BTNLoader className="artist-btn" /> :
              <Button variant="primary" className="artist-btn" onClick={() => funCall()}> {btn2}</Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ConfirmModal