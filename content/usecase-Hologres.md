---
title: "Hologres活用パターン"
metaTitle: "Hologresプロダクトサービス活用パターンについて"
metaDescription: "Alibaba Cloud Hologresプロダクトサービス活用パターンについてを説明します"
date: "2021-09-13"
author: "Hironobu Ohara"
thumbnail: ""
---


import Titlelist from '../src/Titlelist.js';

<!-- 
query MyQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/usecase-Hologres/"}}
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

## Alibab Cloud Hologresプロダクトサービス活用パターンについて

この記事では Alibaba Cloud Hologresによる活用パターンをいくつか紹介いたします。

# Alibab Cloud Hologres とは


<Titlelist 
    metaTitle="Hologresの紹介"
    metaDescription="リアルタイムDWH・Hologresプロダクトサービスをご紹介します"
    url="https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_001_what-is-hologres"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699528800/20210319122815.png"
    date="2021/06/29"
    author="Hironobu Ohara/大原 陽宣"
/>


# Alibab Cloud Hologresによる構成例


<Titlelist 
    metaTitle="Fact・Partition Table作成方法"
    metaDescription="HologresでFact Table（単独テーブル）およびPartition Table作成について"
    url="https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_002_use-partition-hologres"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613699529800/20210630151343.png"
    date="2021/07/06"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="FCでジョブスケジューラを設定"
    metaDescription="FunctionComputeでHologresのジョブスケジューラを設定する方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_003_hologres-functioncompute"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716213110.png"
    date="2021/07/16"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="LogServiceでリアルタイムETL"
    metaDescription="LogServiceとHologres間のリアルタイムETLをする方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_004_logservice-hologres"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613791223100/20210727201328.png"
    date="2021/07/27"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="FluentdでHologresへデータ転送"
    metaDescription="FluentdでHologresへデータ転送する"
    url="https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_005_fluentd-hologres"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613795939300/20210810213446.png"
    date="2021/08/10"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="FCとAPIを使った開発方法"
    metaDescription="Hologresを使ったバッチ処理ソリューション開発方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_006_hologres-batch-sol"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613793350600/20210902092627.png"
    date="2021/09/06"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="Apache SparkからHologres連携"
    metaDescription="Apache SparkからHologresへデータ連携方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_007_spark-hologres"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798076600/20210906202810.png"
    date="2021/09/06"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="AWS S3からHologres連携"
    metaDescription="AWS S3からHologresへリアルタイムデータ連携方法（Embulk使用）"
    url="https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_008_s3-hologres"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_13574176438009000000/20210907162529.png"
    date="2021/09/08"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="Spark on k8sからHologres連携"
    metaDescription="Apache Spark on k8sからHologresへデータ連携方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_009_spark-on-k8s-hologres"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613798077100/20210909084249.png"
    date="2021/09/09"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="Flink on k8sからHologres連携"
    metaDescription="Apache Flink on k8sからHologresへデータ連携方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-Hologres/HOLOGRES_010_flink-on-k8s-hologres"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613800887600/20210910094411.png"
    date="2021/09/10"
    author="Hironobu Ohara/大原 陽宣"
/>


