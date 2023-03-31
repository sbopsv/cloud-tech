import React from "react"
import { StaticQuery, graphql } from "gatsby"
// eslint-disable-next-line react/display-name
export default () => (
  <StaticQuery
    query={graphql`
      query HeadingQuery {
        site {
          siteMetadata {
              title
              description
          }
        }
      }
    `} 
    render={data => (
      <div className="hero-header">
        <div className="headline">{data.site.siteMetadata.title}</div>
        <div 
          className="primary-content" 
          dangerouslySetInnerHTML={{ __html: data.site.siteMetadata.message}}
        /> 
      </div>
    )}
  />
)