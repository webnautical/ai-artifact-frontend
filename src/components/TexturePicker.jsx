import React, { useState } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import whiteframe from '../../src/assets/images/framesSprite.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const textures = [
  { name: 'black', url: 'https://wallpaperaccess.com/full/173805.jpg', color: 'Black' },
  { name: 'white', url: whiteframe , color: 'White' },
  { name: 'wood', url: 'https://tse4.mm.bing.net/th?id=OIP.jdVkhxiOxZLMSNu5hFgTTQHaE8&pid=Api&P=0&h=220' , color: 'Wood' },
];

const TexturePicker = ({ onTextureSelect , url}) => {
  const [activeTexture, setActiveTexture] = useState(url || null);

  const handleTextureSelect = (obj) => {
    if(obj){
      setActiveTexture(obj.url);
      onTextureSelect({...obj, frame: "With Frame"});
    }else{
      setActiveTexture(null);
      onTextureSelect({frame: "No Frame"})
    }
  };

  return (
    <div className='d-flex'>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-no-frame">No Frame</Tooltip>}
      >
        <div
          onClick={() => handleTextureSelect(null)}
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#e0e0e0',
            margin: 5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100%',
            border: activeTexture === null ? '2px solid #008080' : '1px solid #ccc'
          }}
        ></div>
      </OverlayTrigger>
      {textures.map(texture => (
        <OverlayTrigger
          key={texture.name}
          placement="top"
          overlay={<Tooltip id={`tooltip-${texture.name}`}>{texture.name}</Tooltip>}
        >
          <div
            onClick={() => handleTextureSelect(texture)}
            style={{
              width: 40,
              height: 40,
              backgroundImage: `url(${texture.url})`,
              backgroundSize: 'cover',
              margin: 5,
              cursor: 'pointer',
              borderRadius: '100%',
              border: activeTexture === texture.url ? '2px solid #008080' : '1px solid #ccc'
            }}
          ></div>
        </OverlayTrigger>
      ))}
    </div>
  );
};

export default TexturePicker;
