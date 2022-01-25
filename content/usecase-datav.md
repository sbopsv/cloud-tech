---
title: "DataV活用パターン"
metaTitle: "Alibab CloudによるDataV活用パターン"
metaDescription: "Alibab CloudによるDataV活用パターンを説明します"
date: "2021-06-01"
author: "Hironobu Ohara"
thumbnail: ""
---


import Titlelist from '../src/Titlelist.js';

<!-- 
query MyQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/usecase-datav/"}}
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


# Alibab Cloud DataV活用パターン

この記事では Alibaba Cloud DataVのによる活用パターンをいくつか紹介いたします。

# Alibab Cloud DataV とは

<Titlelist 
    metaTitle="DataVの紹介"
    metaDescription="インパクトのあるダッシュボードを作るならDataV #1 紹介編"
    url="https://sbopsv.github.io/cloud-tech/usecase-datav/DATAV_001_Introduction"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_17680117127213200000/temp1.gif"
    date="2019/07/04"
    author="SBC engineer blog"
/>


# Alibab Cloud DataVによる構成例

<Titlelist 
    metaTitle="DataVでマップ作成"
    metaDescription="インパクトのあるダッシュボードを作るならDataV #2 3Dマップ編"
    url="https://sbopsv.github.io/cloud-tech/usecase-datav/DATAV_002_Map"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613378008500/instance_list.png"
    date="2019/12/26"
    author="SBC engineer blog"
/>

<Titlelist 
    metaTitle="DataV Proxyについて"
    metaDescription="DataVユーザーの強い味方！DataV Proxyについて"
    url="https://sbopsv.github.io/cloud-tech/usecase-datav/DATAV_003_DataVProxy"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-datav/DataV_images_26006613506519500/20200203161752.png"
    date="2020/02/05"
    author="SBC engineer blog"
/>

