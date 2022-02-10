require('dotenv').config({
  path: '.env',
})

const queries = require("./src/utils/algolia");

const config = require("./config");

const plugins = [
  'gatsby-plugin-sitemap',
  'gatsby-plugin-sharp',
  {
    resolve: `gatsby-plugin-layout`,
    options: {
        component: require.resolve(`./src/templates/docs.js`)
    }
  },
  `gatsby-plugin-sass`,
  'gatsby-plugin-emotion',
  //'gatsby-plugin-preact',
  'gatsby-plugin-react-helmet',
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "docs",
      path: `${__dirname}/content/`
    }
  },
  {
    resolve: 'gatsby-plugin-preconnect',
    options: {
      domains: ['https://APGJ5PHUST-dsn.algolia.net'],///{Application-ID}-dsn.algolia.net
    },
  },
  
  {
    resolve: `gatsby-plugin-feed`,
    options: {
      query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
            }
          }
        }
      `,
      feeds: [
      {
      serialize: ({ query: { allMdx } }) => {
        return allMdx.edges.map(edge => {
          return Object.assign({}, edge.node.frontmatter, {
            description: edge.node.frontmatter.metaDescription,
            date: edge.node.frontmatter.date,
            url: edge.node.fields.url,
            guid: edge.node.fields.url,
            custom_elements: [{ "content:encoded": edge.node.excerpt }],
            })
          })
        },
        query: `
          {
            allMdx(sort: {order: DESC, fields: frontmatter___date}) {
              edges {
                node {
                  fields {
                    title
                    url
                  }
                  excerpt
                  frontmatter {
                    date(formatString: "YYYY/MM/DD"),
                    metaDescription
                  }
                }
              }
            }            
          }
        `,
        output: "/rss.xml",
        title: "テクニカルサイト",
      },
      ],
    },
  },  
  
  
  
  
  {
    resolve: 'gatsby-plugin-mdx',
    options: {
      plugins: [
        "gatsby-remark-images",
        "gatsby-remark-images-medium-zoom",
        "gatsby-remark-embed-youtube",
      ],
      gatsbyRemarkPlugins:[
        {
          resolve: "gatsby-remark-images",
          options: {
            maxWidth: 1035,
            linkImagesToOriginal: false,
          }
        },
        {
          resolve: "gatsby-remark-images-medium-zoom",
          options: {
            background: "rgba(26,26,26,0.75)",
          }
        },
        {
          resolve: "gatsby-remark-embed-youtube",
          options: {
            width: 800,
            height: 400
          }
        },        
        {
          resolve: 'gatsby-remark-copy-linked-files'
        }
      ],
      extensions: [".mdx", ".md"]
    }
  },
  {
    resolve: `gatsby-plugin-google-gtag`,
    options: {
      trackingIds: ["UA-85904527-10"],
      pluginConfig: {
        head: true,
      },
    },
  }
];

console.log("Note: algoliaに反映し、なおかつ検索をフルに生かすならgatesby build");
// check and add algolia
if (config.header.search.enabled && config.header.search.algoliaAppId && config.header.search.algoliaAdminKey) {
  plugins.push({
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: config.header.search.algoliaAppId, 
      apiKey: config.header.search.algoliaAdminKey, 
      indexName: config.header.search.indexName, 
      queries,
      chunkSize: 10000, // default: 1000
    }}
  )
}
// check and add google tag manager
if (config.gatsby.gaTrackingId) {
  plugins.push({
    resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: config.gatsby.gaTrackingId,
        includeInDevelopment: false,
      },
  })
}
// check and add pwa functionality
if (config.pwa && config.pwa.enabled && config.pwa.manifest) {
  plugins.push({
      resolve: `gatsby-plugin-manifest`,
      options: {...config.pwa.manifest},
  });
  plugins.push({
    resolve: 'gatsby-plugin-offline',
    options: {
      appendScript: require.resolve(`./src/custom-sw-code.js`),
    },
  });
} else {
  plugins.push('gatsby-plugin-remove-serviceworker');
}

// check and remove trailing slash
if (config.gatsby && !config.gatsby.trailingSlash) {
  plugins.push('gatsby-plugin-remove-trailing-slashes');
}

module.exports = {
  pathPrefix: config.gatsby.pathPrefix,
  siteMetadata: {
    title: config.siteMetadata.title,
    description: config.siteMetadata.description,
    docsLocation: config.siteMetadata.docsLocation,
    ogImage: config.siteMetadata.ogImage,
    favicon: config.siteMetadata.favicon,
    logo: { link: config.header.logoLink ? config.header.logoLink : '/', image: config.header.logo }, // backwards compatible
    headerTitle: config.header.title,
    githubUrl: config.header.githubUrl,
    helpUrl: config.header.helpUrl,
    tweetText: config.header.tweetText,
    headerLinks: config.header.links,
    siteUrl: config.gatsby.siteUrl,
  },
  plugins: plugins
};
