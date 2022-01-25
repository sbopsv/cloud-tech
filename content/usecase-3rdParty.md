---
title: "外部3rdサービス連携パターン"
metaTitle: "Alibaba Cloudと外部3rdサービスとの連携について"
metaDescription: "Alibaba Cloudと外部3rdサービスとの連携についてを説明します"
date: "2021-09-07"
author: "Hironobu Ohara"
thumbnail: ""
---


import Titlelist from '../src/Titlelist.js';


<!-- 
query MyQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/usecase-3rdParty/"}}
    sort: {fields: fileAbsolutePath, order: ASC}
  ) {
    nodes {
      frontmatter {
        title
        metaTitle
        metaDescription
        date(formatString: "yyyy/MM/DD")
        author       
      }
      fileAbsolutePath
    }
  }
}
-->


## Alibaba Cloudと外部3rdサービスとの連携について

この記事では Alibaba Cloudと外部3rdサービスとの連携による活用パターンをいくつか紹介いたします。


<Titlelist 
    metaTitle="JP1・AJS3導入検証"
    metaDescription="AlibabaCloudでのミドルウェア導入検証【JP1/AJS3編①】～実装内容の検討～"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_001_jp1test_1"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613446336000/20191007201046.png"
    date="2019/10/08"
    author="SBC engineer blog"
/>



<Titlelist 
    metaTitle="JP1・AJS3動作検証"
    metaDescription="AlibabaCloudでのミドルウェア導入検証【JP1/AJS3編②】～動作検証～"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_002_jp1test_2"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613447461200/20191010203124.png"
    date="2019/10/24"
    author="SBC engineer blog"
/>


<Titlelist 
    metaTitle="draw.ioでアーキテクチャ図"
    metaDescription="draw.ioでAlibaba Cloudアーキテクチャ図を描こう"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_003_draw-alibaba-architecture"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613480590800/20191211193559.png"
    date="2021/09/17"
    author="bob"
/>

<Titlelist 
    metaTitle="初めてのNextcloud"
    metaDescription="NextcloudをAlibaba Cloud上で利用する"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_004_nextcloud"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613585743300/20200616101517.png"
    date="2020/06/25"
    author="SBC engineer blog"
/>


<Titlelist 
    metaTitle="複数人でNextcloud"
    metaDescription="NextcloudをAlibaba Cloud上で利用する(複数人利用)"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_005_nextcloud2"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613586559700/20200625102446.png"
    date="2020/06/30"
    author="SBC engineer blog"
/>


<Titlelist 
    metaTitle="Zabbix導入連携"
    metaDescription="Alibaba Cloud環境でZabbix導入およびCloud Monitor連携してみた"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_006_alicloud-zabbix-cloudmonitor"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613592205800/20200707124157.jpg"
    date="2020/07/09"
    author="SBC engineer blog"
/>


<Titlelist 
    metaTitle="Datadog導入連携"
    metaDescription="DatadogでのAlibaba Cloud連携について"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_007_alicloud-datadog01"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613599370900/20200722143931.png"
    date="2020/08/07"
    author="SBC engineer blog"
/>



<Titlelist 
    metaTitle="CloudflareでゼロトラストNW"
    metaDescription="クライアントVPN不要!  Cloudflareを使ってWebサーバへゼロトラストアクセスを実現"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_008_argotunnel"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613704024700/20210316182815.png"
    date="2021/03/17"
    author="斎藤 貴広"
/>



<Titlelist 
    metaTitle="CloudflareでWEBフィルタリング"
    metaDescription="Cloudflare GatewayでWebフィルタリングをやってみた"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_009_gateway"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613705046400/20210319153337.png"
    date="2021/03/25"
    author="斎藤 貴広"
/>



<Titlelist 
    metaTitle="Cloudflareで次世代VPN"
    metaDescription="Cloudflare WARPで次世代VPNを体験しよう"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_010_WARP"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613715939400/20210416105911.png"
    date="2021/04/19"
    author="斎藤 貴広"
/>

<Titlelist 
    metaTitle="日中間のゼロトラストNW"
    metaDescription="Alibaba Cloud活用で日中間のゼロトラストネットワークを実現"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_011_ZTNA"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdParty_images_26006613766108400/20210524201658.png"
    date="2021/05/24"
    author="斎藤 貴広"
/>


<Titlelist 
    metaTitle="ZPA APPコネクタでRDP接続"
    metaDescription="ZPA APPコネクタをAlibaba Cloud上に構築してRDP接続してみた"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_012_zpa"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_13574176438014200000/20210927033901.png"
    date="2021/09/27"
    author="斎藤 貴広"
/>

<Titlelist 
    metaTitle="Cloudflare Access と WARP で端末制限"
    metaDescription="Cloudflare Access と WARP でゼロトラストアクセスの端末制限が簡単に実現できるよ❗️"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_013_cloudflare-access-managed-device"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613725402600/20210513173946.png"
    date="2021/05/13"
    author="松田 悦洋"
/>

<Titlelist 
    metaTitle="Cloudflareで既存のDNSを使う"
    metaDescription="Cloudflare（クラウドフレア）で既存のDNSを使う方法を紹介するよ❗️"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_014_cloudflare-dns"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613695831800/20210303020206.png"
    date="2021/03/12"
    author="松田 悦洋"
/>

<Titlelist 
    metaTitle="Nextcloud からメールを送信する"
    metaDescription="Alibaba Cloud DirectMail を使って Nextcloud からメールを送信してみる"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_015_directmail-nextcloud"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613610400600/0000001.png"
    date="2020/08/06"
    author="松田 悦洋"
/>

<Titlelist 
    metaTitle="HARファイルを取得してみる"
    metaDescription="お客様の事象の切り分けのための参考情報 ~HARファイルを取得する~"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_016_HAR"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613543154000/20200331153228.png"
    date="2020/03/31"
    author="SBC engineer blog"
/>

<Titlelist 
    metaTitle="MTRを取得してみる"
    metaDescription="客様の事象の切り分けのための参考情報 ~MTRを取得する~"
    url="https://sbopsv.github.io/cloud-tech/usecase-3rdParty/3RDPARTY_017_MTR"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-3rdParty/3rdparty_images_26006613543123700/20200331135926.png"
    date="2020/03/31"
    author="SBC engineer blog"
/>


