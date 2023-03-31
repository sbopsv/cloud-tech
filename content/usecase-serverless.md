---
title: "サーバレス活用パターン"
metaTitle: "Alibab Cloudによるサーバレス活用・構築パターン"
metaDescription: "Alibab Cloudによるサーバレス活用・構築パターンを説明します"
date: "2021-06-20"
author: "Hironobu Ohara"
thumbnail: ""
---


import Titlelist from '../src/Titlelist.js';


<!-- 
query MyQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/usecase-Serverless/"}}
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

## Alibab Cloudによるサーバレス活用・構築パターン

この記事では Alibaba Cloud によるサーバレス活用パターンをいくつか紹介いたします。

# Alibab Cloudによるサーバレス活用・構築パターン例



<Titlelist 
    metaTitle="FCでECSを自動起動&自動停止"
    metaDescription="Alibaba CloudのFunction Compute(サーバレスアーキテクチャ)を使ってECSインスタンスを自動起動&自動停止させる"
    url="https://sbopsv.github.io/cloud-tech/usecase-serverless/SERVERLESS_001_tnoce_functioncompute"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613488886700/20191225175054.png"
    date="2019/12/25"
    author="長岡周"
/>

<Titlelist 
    metaTitle="FCにライブラリをアップロード"
    metaDescription="FunctionComputeにライブラリをアップロードする"
    url="https://sbopsv.github.io/cloud-tech/usecase-serverless/SERVERLESS_002_functioncompute"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/Serverless_images_26006613500666600/20200205134303.png"
    date="2020/02/06"
    author="SBC engineer blog"
/>



<Titlelist 
    metaTitle="KNativeによるサーバーレスK8S"
    metaDescription="Alibab Cloudによるサーバレス活用・構築パターンを説明します"
    url="https://sbopsv.github.io/cloud-tech/usecase-serverless/SERVERLESS_003_serverless_k8s_deployment"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-serverless/images/00_Use_Knative_In_ASK_Cluster.png"
    date="2021/06/09"
    author="Bob"
/>




