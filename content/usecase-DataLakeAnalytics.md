---
title: "DataLakeAnalytics活用パターン"
metaTitle: "DataLakeAnalyticsプロダクトサービス活用パターンについて"
metaDescription: "Alibaba Cloud のDataLakeAnalyticsプロダクトサービス活用パターンについてを説明します"
date: "2021-09-07"
author: "Hironobu Ohara"
thumbnail: ""
---


import Titlelist from '../src/Titlelist.js';


<!-- 
query MyQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/usecase-DataLakeAnalytics/"}}
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


## Alibab Cloud DataLake Analyticsプロダクトサービス活用パターンについて

この記事では Alibaba Cloud DataLake Analyticsによる活用パターンをいくつか紹介いたします。

# Alibab Cloud DataLake Analyticsによる構成例

<Titlelist 
    metaTitle="Table Store/OSS連携"
    metaDescription="Data Lake Analyticsを利用したTable StoreおよびObject Storage Serviceのデータ参照 [ DLA + OTS + OSS ]"
    url="https://sbopsv.github.io/cloud-tech/usecase-DataLakeAnalytics/DLA_001_OSS_OTS"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613585463700/20200623175024.png"
    date="2020/06/26"
    author="SBC engineer blog"
/>


<Titlelist 
    metaTitle="AWS RDS/FC/OSS/DataV連携"
    metaDescription="Alibaba CloudデータソースおよびAmazon RDSのData Lake Analytics共用利用とFunction Computeを利用したテーブル結合結果のOSSアウトプットおよびDataV連携について [ DLA + OTS + RDS + Function Compute + OSS + DataV ]"
    url="https://sbopsv.github.io/cloud-tech/usecase-DataLakeAnalytics/DLA_002_FC_OSS_AWSRDS_DataV"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-DataLakeAnalytics/DataAnalytics_images_26006613592304300/20200710165233.png"
    date="2020/07/13"
    author="SBC engineer blog"
/>
