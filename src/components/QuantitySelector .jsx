import React, { useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
 
const QuantitySelector = ({ initialQuantity = 1, min = 1, max = 10, onQuantityChange, product_id, uid }) => {
  const [quantity, setQuantity] = useState(initialQuantity);
 
  const handleIncrement = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      if (onQuantityChange) {
        onQuantityChange(newQuantity, product_id, uid);
      }
    }
  };
 
  const handleDecrement = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (onQuantityChange) {
        onQuantityChange(newQuantity, product_id, uid,initialQuantity);
      }
    }
  };
 
  const handleChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity >= min && newQuantity <= max) {
      setQuantity(newQuantity);
      if (onQuantityChange) {
        onQuantityChange(newQuantity, product_id, uid);
      }
    }
  };
 
  return (
    <InputGroup className='q_select'>
      <Button variant="outline-secondary" onClick={handleDecrement}>
        -
      </Button>
      <FormControl
        type="text"
        value={quantity}
        onChange={handleChange}
        min={min}
        max={max}
      />
      <Button variant="outline-secondary" onClick={handleIncrement}>
        +
      </Button>
    </InputGroup>
  );
};
 
export default QuantitySelector;