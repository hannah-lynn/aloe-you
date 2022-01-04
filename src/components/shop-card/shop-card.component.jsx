import React from 'react';
import './shop-card.styles.css';

const ShopCard = ({ type, img }) => (
  <div className='shop-card flex flex-col mb-4 cursor-pointer hover:scale-105 md:col-span-1'>
    <div className='top-card flex justify-center rounded-t-xl'>
      <img src={img} alt='plant' className='plant-img rounded-t-xl mt-1' />
    </div>
    <div className='shop-cta text-center rounded-b-xl py-1'>
      <p className='shop-title text-white'>{type}</p>
      <span className='cta'>Shop Now</span>
    </div>
  </div>
);

export default ShopCard;
