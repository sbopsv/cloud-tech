import React, { Fragment, useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './floatingStyles.scss';

import IconHover from './IconHover';
import closeSubscribe from './images/close-subscribe.svg';

import pocketsImg from './images/pockets-share.svg';

import copyImg from './images/copy-share.svg';

import twitterImg from './images/twitter-sahre.svg';

import linkedinImg from './images/linkedin-share.svg';

import pocketsHoverImg from './images/pockets-share-hover.svg';

import copyHoverImg from './images/copy-share-hover.svg';

import twitterHoverImg from './images/twitter-sahre-hover.svg';

import facebookImg from './images/facebook.svg';

import hatenaImg from './images/hatenabookmark-logomark.svg';

import linkedinHoverImg from './images/linkedin-share-hover.svg';

import alibabacloud from './images/alibabacloud.svg';

import alibabacloudGray from './images/alibabacloudGray.svg';

const FloatingSubscribeNewsletter = ({ title, canonicalUrl, location }) => {
  const [isCopied, setIsCopiedToggle] = useState(false);

  const [isAlibabaCloud, setisAlibabaCloud] = useState(false);

  /*
  const handleNewsletterClose = () => {
    setHideNewsletter(true);
  };
  */

  const onCopy = () => {
    setIsCopiedToggle(true);
    setTimeout(() => setIsCopiedToggle(false), 3000);
  };

  const renderCopyIcon = () => {
    if (isCopied) {
      return <div className="copiedWrapper">Copied</div>;
    }
    return null;
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      window.onscroll = function () {
        var currentScrollPos = window.pageYOffset;

        var floatingClass = document.getElementById('floating-subscribe');

        if (currentScrollPos > 90) {
          floatingClass.className = 'floatingSubscribeVisible floatingTransition';
        } else {
          floatingClass.className = 'floatingSubscribeVisible';
        }
      };
    }
    return () => {
      window.onscroll = null;
    };
  });
  return (
    <Fragment>
      <div id="floating-subscribe" className="floatingSubscribeVisible">
        {}
        {!isAlibabaCloud ? (
          <div className="floating-subscribe-wrapper mt-16">
            <div
              role="button"
              tabIndex="0"
              className="floating-subscribe-close"
              onClick={() => {
                setisAlibabaCloud(true);
              }}
              onKeyDown={() => {
                setisAlibabaCloud(true);
              }}
            >
              <img src={closeSubscribe} alt="Close" />
            </div>
            <h2 className="pr-40">Alibaba Cloudを始めてみましょう</h2>
            <div className="post-subscription-description">
            ソフトバンクは、Alibaba Cloudのアカウント開設から、サービス展開までをお手伝いします。
            </div>
            <div className="buttonWrapper">
            <a href="https://tm.softbank.jp/form/cloud/iaas/index.php?ref=lp-alibaba" target="_blank" rel="noopener noreferrer">
                <button className="subscribeBtn">お問い合わせ窓口</button>
              </a>
            </div>
          </div>
        ) : null}
      </div>
      <div className="floatingShareWrapper">
        <a
          className="shareIcon"
          href={`https://getpocket.com/save?url=${canonicalUrl}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          data-save-url={`${canonicalUrl}`}
          data-pocket-count="vertical"
          data-pocket-align="left"
        >
          <IconHover baseImgSrc={pocketsImg} hoverImgSrc={pocketsHoverImg} altText="Pocket" />
          {/*<img src={isMouseOver ? pocketsImg : pocketsHoverImg} alt='Pocket' />*/}
        </a>
        <CopyToClipboard text={`${canonicalUrl}`} onCopy={onCopy}>
          <div className="shareIcon">
            <IconHover baseImgSrc={copyImg} hoverImgSrc={copyHoverImg} altText="Copy" />
            {renderCopyIcon()}
          </div>
        </CopyToClipboard>
        <a
         className="HatenaShareButton"
         href={`http://b.hatena.ne.jp/add?mode=confirm&url=${canonicalUrl}+&title=${title}`}
         target="_blank"
         rel="nofollow noopener noreferrer"
        >
          <IconHover baseImgSrc={hatenaImg} hoverImgSrc={hatenaImg} altText="Hatena" />
        </a>

        <a
          className="shareIcon"
          href={`https://www.facebook.com/sharer/sharer.php?u=${canonicalUrl}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconHover baseImgSrc={facebookImg} hoverImgSrc={facebookImg} altText="Facebook" />
        </a>
        <a
          className="shareIcon"
          href={`https://twitter.com/intent/tweet?&text=${title}&url=${canonicalUrl}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconHover baseImgSrc={twitterImg} hoverImgSrc={twitterHoverImg} altText="Twitter" />
        </a>
        <a
          className="shareIcon"
          href={`http://www.linkedin.com/shareArticle?mini=true&url=${canonicalUrl}&title=${title}&summary=${title}&source=${canonicalUrl}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconHover baseImgSrc={linkedinImg} hoverImgSrc={linkedinHoverImg} altText="Linkedin" />
        </a>
      </div>
      {isAlibabaCloud ? (
        <div className="subscribeIcon">
          <div className="shareIcon" role="button" tabIndex="0" onClick={() => setisAlibabaCloud(false)} onKeyDown={() => setisAlibabaCloud(false)}>
            <IconHover baseImgSrc={alibabacloudGray} hoverImgSrc={alibabacloud} altText="Mail" />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FloatingSubscribeNewsletter;
