import React from "react"
import { Link } from "gatsby"

const PostLink = ({ post }) => (
  <article className="card ">
    <Link to={post.fields.url}>
      {!!post.frontmatter.thumbnail && (
        <img src={post.frontmatter.thumbnail} alt={post.frontmatter.metaTitle} />
      )}
    </Link>
    <header>
      <h2 className="post-title">
        <Link to={post.fields.url} className="post-link">
          {post.frontmatter.metaTitle}
        </Link>
      </h2>
      <div className="post-meta">{post.frontmatter.date}</div>
    </header>
  </article>
)

export default PostLink
