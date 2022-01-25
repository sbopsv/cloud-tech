const config = {
	"gatsby": {
		"pathPrefix": "/cloud-tech",
		"siteUrl": "https://sbopsv.github.io/cloud-tech",
		"gaTrackingId": "GTM-WLG6JZ3",
		"trailingSlash": false				
	},
	
	"header": {
		"logo": "https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/favicon.png",
		"logoLink": "https://sbopsv.github.io/cloud-tech/",
		"title": "テクニカルリファレンス",
		"githubUrl": "https://github.com/sbopsv/cloud-tech",
		"rss": "https://sbopsv.github.io/cloud-tech/rss.xml",
		"links": [
			{ "text": "", "link": ""}
		],
		"search": {
			"enabled": true,
			"indexName": process.env.ALGOLIA_INDEX,
			"algoliaAppId": process.env.GATSBY_ALGOLIA_APP_ID,
			"algoliaSearchKey": process.env.GATSBY_ALGOLIA_SEARCH_KEY,
			"algoliaAdminKey": process.env.ALGOLIA_ADMIN_KEY
		}
	},
	"sidebar": {
		"forcedNavOrder": [
			"/introduction",
			"/advisory",
			"/product_service",
			"/migration",
			"/DaaS",
			"/WebApplication-tutorial",
			"/DataAnalytics-tutorial",
			"/network-connect-case",
			"/usecase-serverless",
			"/usecase-computing",
			"/usecase-storage",
			"/usecase-network",
			"/usecase-Database",
			"/usecase-Application",
			"/usecase-kubernetes",
			"/usecase-PolarDB",
			"/usecase-LogService",
			"/usecase-MaxCompute",
			"/usecase-Hologres",
			"/usecase-Elasticsearch",
			"/usecase-ClickHouse",
			"/usecase-DataLakeAnalytics",
			"/usecase-datav",
			"/usecase-security",
			"/usecase-media",
			"/usecase-iot",
			"/usecase-AI",
			"/developer-tools",
			"/Terraform",
			"/usecase-3rdParty",
			"/ICP"
			],
			"collapsedNav": [
				"/introduction",
				"/advisory",
				"/product_service",
				"/migration",
				"/DaaS",
				"/WebApplication-tutorial",
				"/DataAnalytics-tutorial",
				"/network-connect-case",
				"/usecase-serverless",
				"/usecase-computing",
				"/usecase-storage",
				"/usecase-network",
				"/usecase-Database",
				"/usecase-Application",
				"/usecase-kubernetes",
				"/usecase-PolarDB",
				"/usecase-LogService",
				"/usecase-MaxCompute",
				"/usecase-Hologres",
				"/usecase-Elasticsearch",
				"/usecase-ClickHouse",
				"/usecase-DataLakeAnalytics",
				"/usecase-datav",
				"/usecase-security",
				"/usecase-media",
				"/usecase-iot",
				"/usecase-AI",
				"/developer-tools",
				"/Terraform",
				"/usecase-3rdParty",
				"/ICP"
			],			  
		"links":[{ text: 'お問い合わせ', link: 'https://tm.softbank.jp/form/cloud/iaas/index.php?ref=lp-alibaba' },
		{ text: 'ソフトバンクのAlibabaCloudへ', link: 'https://www.softbank.jp/biz/services/platform/alibabacloud/' },
		{ text: 'サービス構築はPSへ', link: 'https://www.softbank.jp/biz/services/platform/alibabacloud/about/ps/' },		
		{ text: '監視・運用代行はMSPへ', link: 'https://www.softbank.jp/biz/services/platform/alibabacloud/about/msp/' },
		{ text: 'よくある質問はTSSへ', link: 'https://www.softbank.jp/biz/services/platform/alibabacloud/about/ts/' },
		{text: 'Alibaba Cloud公式サイト', link: 'https://www.alibabacloud.com/' }],
		"frontline": false,
		"ignoreIndex": true,
	},
	"siteMetadata": {
		"title": "テクニカルリファレンス",
		"description": "これはSoftBankのクラウドエンジニアリングによるAlibaba Cloud テクニカルリファレンスです。Alibaba Cloudを知らない人や、初心者・中級者がサービス構築出来るよう、お手伝いいたします。",
		"ogImage": null,
		"docsLocation": "https://github.com/sbopsv/cloud-tech/tree/master/content",
		"favicon": "https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/favicon.png"
	},
	"pwa": {
		"enabled": false, // disabling this will also remove the existing service worker.
		"manifest": {
			"name": "Alibaba Cloud technical.site",
			"short_name": "AliCloud-technical.site",
			"start_url": "/",
			"background_color": "#6b37bf",
			"theme_color": "#6b37bf",
			"display": "standalone",
			"crossOrigin": "use-credentials",
			icons: [
				{
					src: "src/pwa-512.png",
					sizes: `512x512`,
					type: `image/png`,
				},
			],
		},
	},
	"newsletter": {
    "pdfCopyFormId": "1244"
  },
};

module.exports = config;
