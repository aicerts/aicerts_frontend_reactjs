import React from 'react';

const DashboardCard = ({ item }) => { // Destructuring item from props
  return (
    <div className='card-container'>
      {/* Badge container */}
      <div className='badge-container'>
        <img className='badge-cert' src='/icons/badge-cert.svg' alt='Badge'/> {/* Image for badge */}
      </div>
      {/* Title container */}
      <div className='title-cont'>
        <p className='title'>{item?.title}</p> {/* Title of the card */}
        <h5 className='title-value'>{item.titleValue}</h5> {/* Value of the title */}
      </div>
      {/* Value container */}
      <div className='value-container'>
        <div>
          <h2 className='item-value'>{item.value}</h2> {/* Value */}
          <p className='item-percentage'>{item.percentage}</p> {/* Percentage */}
        </div>
        <div>
          <img src='/icons/Line-chart.svg' alt='Line chart icon'/> {/* Image for line chart */}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
