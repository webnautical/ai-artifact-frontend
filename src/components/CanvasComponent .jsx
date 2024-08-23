import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
 
const CanvasComponent = ({ imageSrc, frameTexture, frameSize, imgSize, brightness }) => {
  const canvasRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imgZoom, setImgZoom] = useState(1);
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    ctx.filter = `brightness(${brightness})`; // Apply brightness filter
    img.src = imageSrc;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
 
      if (frameTexture) {
        const frameImg = new Image();
        frameImg.src = frameTexture;
 
        frameImg.onload = () => {
 
          // Draw frame image as border
          const pattern = ctx.createPattern(frameImg, 'repeat');
          ctx.lineWidth = 30; // Adjust width as needed
          ctx.strokeStyle = pattern;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
        };
      }
    };
  }, [imageSrc, frameTexture, frameSize, imgSize, brightness]);
 
  const openModal = () => {
    setModalIsOpen(true);
  };
 
  const closeModal = () => {
    setModalIsOpen(false);
    setImgZoom(1);
    setImgPos({ x: 0, y: 0 });
  };
 
  const handleWheel = (event) => {
    event.preventDefault();
    const scaleAmount = 0.1;
    if (event.deltaY < 0) {
      setImgZoom((prevZoom) => Math.min(prevZoom + scaleAmount, 3));
    } else {
      setImgZoom((prevZoom) => Math.max(prevZoom - scaleAmount, 1));
    }
  };
 
  const handleMouseDown = (event) => {
    setDragging(true);
    setStartPos({ x: event.clientX - imgPos.x, y: event.clientY - imgPos.y });
    document.body.style.cursor = 'grabbing';
  };
 
  const handleMouseMove = (event) => {
    if (dragging) {
      setImgPos({ x: event.clientX - startPos.x, y: event.clientY - startPos.y });
    }
  };
 
  const handleMouseUp = () => {
    setDragging(false);
    document.body.style.cursor = 'default';
  };
 
  const handleSizeSelect = (item) => {
    setCanvasScale(item.scale); // Set the canvas scale based on the selected item
  };
 
  return (
    <>
      <canvas
        className="canvas-container"
        ref={canvasRef}
        width={imgSize.width}
        height={imgSize.height}
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transform: `scale(${imgSize.transform})`, // Apply scale transformation
          transformOrigin: 'top', // Set the transform origin as needed
          transition: 'transform 0.5s ease-in-out', // Add transition effect for scale change
        }}
        onClick={openModal}
        onMouseMove={handleMouseMove}
      ></canvas>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Zoomed Image"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className="close-button" onClick={closeModal}>
          <i className="fa fa-close"></i>
        </button>
        <div className="fullheight">
          <div
            className="zoom-container"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              transform: `scale(${imgZoom})`,
              left: imgPos.x,
              top: imgPos.y,
              transition: dragging ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            <img src={imageSrc} alt="Zoomed" className="zoomed-img" />
          </div>
        </div>
      </Modal>
    </>
  );
};
 
export default CanvasComponent;