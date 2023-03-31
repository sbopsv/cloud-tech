import React from "react"
import Helmet from 'react-helmet';
import { graphql } from 'gatsby'
import GalleryLayout from "./gallery-layout"
import PostLink from "./post-link"
import HeroHeader from "./heroHeader"

export default () => (
    <div></div>
)


/*

ToDo ここがどうしてもうまくいかない。。。。！

const IndexPage = ({ data }) => {
  
  const siteMeta = data.site.siteMetadata

  const postData = data.allMdx.edges
  
  const Posts = postData
    .filter(postData => !!postData.node.frontmatter.date)
    .map(postData => <PostLink key={postData.node.id} post={postData.node} />)

  return (
    <GalleryLayout>
      <Helmet>
        <title>{siteMeta.title}</title>
        <meta name="description" content={siteMeta.description} />
      </Helmet>
      <HeroHeader/>
      
      <h2>Blog Posts &darr;</h2>
      <div className="grids">
        {Posts}
      </div>
    </GalleryLayout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    site {
        siteMetadata {
          title
          description
        }
      }
      allMdx(sort: { order: DESC, fields: [frontmatter___date] }) {
          edges {
              node {
                  id
                  excerpt(pruneLength: 250)
                  frontmatter {
                      date(formatString: "YYYY/MM/DD")
                      metaTitle
                      thumbnail
                  }
                  fields {
                      url
                      title
                      slug
                  }
              }
            }
      }
  }
`;*/



