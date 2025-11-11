import React from 'react';

function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
