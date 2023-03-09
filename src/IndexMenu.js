import React from 'react';
import IndexImg from './components/images/backgroundimg.svg';

import './components/styles.css';

const IndexMenu = () => {
  return (
    <>
      <div className="indexImgSection">      
        <img className="backgroundimg" src={IndexImg} alt='backgroundimg'/>
      </div>
    </>
  );
};

export default IndexMenu;
