import React from 'react';
import './components/styles.css';
// eslint-disable-next-line import/no-unresolved

import IndexImg from './components/images/index_background-image.svg';


const IndexMenu = () => {
  return (
    <>
      <div className="indexImgSection">      
        <img className="IndexImg" src={IndexImg} alt='Index_backgroundimage'/>
      </div>
    </>
  );
};

export default IndexMenu;
