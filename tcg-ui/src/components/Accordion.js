// this code comes from this article: https://www.freecodecamp.org/news/build-accordion-menu-in-react-without-external-libraries/
// 12/1/2022

import React, { useState } from 'react';

export default function Accordion ({ title, content }) {

  const [isActive, setIsActive] = useState(false);
  
  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div><h3>{title}</h3></div>
        <div className="expand-form">{isActive ? '-' : '+'}</div>
      </div>
      {isActive && <div className="accordion-content">{content}</div>}
    </div>
  );
};