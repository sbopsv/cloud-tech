import React, {useState} from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Link from './link';
import './styles.css';

import logoImg from './images/logo.svg';

const Header = ({ location, title }) => (
  <StaticQuery
    query={graphql`
      query headerTitleQuery {
        site {
          siteMetadata {
            headerTitle
            githubUrl
            logo {
              link
              image
            }
          }
        }
      }
    `}
    render={(data) => {

      const {
        site: {
          siteMetadata: { headerTitle, logo },
        },
      } = data;

      const finalLogoLink = logo.link !== '' ? logo.link : '/';

      const breadCrumb = headerTitle + "<img src='https://raw.githubusercontent.com/sbcloud/help/master/src/components/images/chevron-right.svg' alt='Chevron Right' />" + title;

      return (
        <div className="navBarWrapper">
          <nav className="navBarDefault">
            <div className="navBarHeader">
              <Link to={finalLogoLink} className="navBarBrand">
                <img
                  className="img-responsive displayInline"
                  src={logo.image !== '' ? logo.image : logoImg}
                  alt='logo'
                />
              </Link>
              <div
                className="headerTitle displayInline"
                dangerouslySetInnerHTML={{ __html: breadCrumb }}
              />
            </div>
          </nav>
        </div>
      );
    }}
  />
);

export default Header;
