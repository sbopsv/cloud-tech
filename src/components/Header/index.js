import React, { useEffect, useRef, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { trackGAEvents } from '../trackGA';
import { getUTMPagePathName } from '../../utils/getUTMPagePathName';
import { saTrack } from '../../utils/segmentAnalytics';
import SearchIcon from '../../globals/icons/Search';

import SearchOverlay from '../UnifiedSearch/SearchOverlay';


import './header.scss';

const config = require("../../../config");

const SearchAltIconLearn = ({ isDark }) => (
  <svg
    id="search-alt-icon"
    width="7"
    height="12"
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5 16.5L5.96718 1.06173"
      stroke={isDark ? 'white' : '#909DA6'}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const Header = (props) => {
  const path = props.location.pathname;

  const wrapperRef = useRef(null);

  const [showSearch, setShowSearch] = useState(false);


  const handleSearchWithKeyboard = (e) => {
    if (e.key === '/' || e.key === 'Escape') {
      e.preventDefault();
      if (e.key === '/') return setShowSearch(true);
      if (e.key === 'Escape') return onCloseSearch();
    }

    return null;
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    document.addEventListener('keydown', handleSearchWithKeyboard);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
      document.removeEventListener('keydown', handleSearchWithKeyboard);
    };
  }, [path]);


  const onCloseSearch = () => setShowSearch(false);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      var x = document.getElementById('navbar');
      
      var hamberger = document.getElementById('menuClick');

      if (x.className === 'topnav responsive') {
        x.className = 'topnav';
        hamberger.className = 'navBarToggle';
        document.body.style.overflow = null;

        const viewPortElement = document.getElementById('viewport');

        if (viewPortElement) {
          viewPortElement.style.overflow = null;
        }
      }
    }
  };

  const isDark = false;

  const utmPagePathName = getUTMPagePathName(path);

  // const isBoxShadowActive = windowScrollPosition && windowScrollPosition > 60;

  return (
    <Fragment>
      <header
        id="header"
        className={
          isDark
            ? 'DarkModeHeader box-shadow-header positionStickyHeader'
            : 'lightModeHeader box-shadow-header positionStickyHeader'
        }
      >
        <div className="learnHeader">
          <div className="headerWrapper">
            <div id="navBrand" className="navLeft">
              <div className="brand">
                <a href="https://sbopsv.github.io/cloud-tech">
                  <img
                    src="https://raw.githubusercontent.com/sbcloud/help/master/src/components/images/TechnicalSite_5.png"
                    alt="TechnicalSite Logo"
                    title="TechnicalSite Logo"
                  />
                </a>
              </div>
            </div>
            <div className="navRight hideMobile">
              <ul className="navBarUL">
                <li
                  className="search-icon-learn"
                  onClick={() => {
                    setShowSearch((preShowSearch) => !preShowSearch);
                    // setHideSearchSlow(true);
                    // setShowWriter(false);
                    // setShowMore(false);
                  }}
                >
                  <span>
                    <SearchIcon variant={isDark ? 'white' : 'grey'} size="sm" />
                    Search...
                  </span>
                  <div className="squareBox">
                    <SearchAltIconLearn isDark={isDark} />
                  </div>
                </li>
                <li>
                  <a
                    href={config.header.rss}
                    onClick={() => trackGAEvents("Learn course", "HeaderClick", "Contact Us")}
                  >
                    RSS
                  </a>
                </li>                
              </ul>
            </div>
          </div>
        </div>
        {/* Mobile Section  *******************/}
        <div id="navbar" className="topnav" ref={wrapperRef} style={{ height: '0px' }}>
          <div className="navBarToggleBg">
            <div
              className="navBarToggle search-icon"
              onClick={() => {
                setShowSearch((preShowSearch) => !preShowSearch);
              }}
            >
              <SearchIcon variant={isDark ? 'white' : 'grey100'} size="sm" />
            </div>
          </div>
          {/* Mobile Content  ********** */}
          <div className="visibleMobile">
            <div className="mobileNavListWrapper">


            </div>
          </div>
        </div>
      </header>
      <SearchOverlay showSearch={showSearch} onCloseSearch={onCloseSearch} />
    </Fragment>
  );
};

Header.propTypes = {
  location: PropTypes.object,
};

export default Header;
