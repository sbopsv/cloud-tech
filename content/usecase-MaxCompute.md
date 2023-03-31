---
title: "MaxCompute活用パターン"
metaTitle: "MaxComputeプロダクトサービス活用パターンについて"
metaDescription: "Alibaba Cloud のMaxComputeプロダクトサービス活用パターンについてを説明します"
date: "2021-08-25"
author: "Hironobu Ohara"
thumbnail: ""
---


import Titlelist from '../src/Titlelist.js';

<!-- 
query MyQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/usecase-MaxCompute/"}}
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

## Alibab Cloud MaxComputeプロダクトサービス活用パターンについて

この記事では Alibaba Cloud MaxComputeによる活用パターンをいくつか紹介いたします。

# Alibab Cloud MaxCompute とは

<Titlelist 
    metaTitle="MaxComputeの紹介"
    metaDescription="毎年世界No.1のTPC-BB（Big Data処理ベンチマーク）を記録し続けるMaxComputeのご紹介"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_001_what-is-maxcompute"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674376800/20210104122110.png"
    date="2021/03/03"
    author="Hironobu Ohara/大原 陽宣"
/>

# Alibab Cloud DataWorks とは

<Titlelist 
    metaTitle="DataWorksの紹介"
    metaDescription="MaxComputeをハンドリングするDataWorksについて"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_002_what-is-dataworks"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379500/20210224110305.png"
    date="2021/03/04"
    author="Hironobu Ohara/大原 陽宣"
/>


# Alibab Cloud MaxCompute の機能について

<Titlelist 
    metaTitle="DataWorksにおける基本モードと標準モード、開発環境と本番環境について"
    metaDescription="DataWorksにおける基本モードと標準モード、開発環境と本番環境について"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_003_what-is-basic-mode-and-standard-mode-and-production-environment"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613700889100/20210310114634.png"
    date="2021/03/05"
    author="Hironobu Ohara/大原 陽宣"
/>


<Titlelist 
    metaTitle="MaxComputeのセキュリティ"
    metaDescription="MaxComputeのセキュリティについて"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_004_what-is-maxcompute-security"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379100/20210310153057.png"
    date="2021/03/08"
    author="Hironobu Ohara/大原 陽宣"
/>

# Alibab Cloud MaxCompute を支えるツール・ユーティリティについて

<Titlelist 
    metaTitle="TunnelとIntelliJ IDEAについて"
    metaDescription="MaxComputeを支えるツール・TunnelとIntelliJ IDEAについて"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_005_tools-on-maxcompute"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311210828.png"
    date="2021/03/09"
    author="Hironobu Ohara/大原 陽宣"
/>


# Alibab Cloud MaxComputeによる構成例

<Titlelist 
    metaTitle="CSVファイルをテーブルに格納"
    metaDescription="CSVファイルをMaxComputeの内部テーブルに格納する"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_006_csv-on-maxcompute"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674379900/20210305024831.png"
    date="2021/03/10"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="CSVファイルを外部テーブルへ"
    metaDescription="CSVファイルをMaxComputeの外部テーブルとして処理する"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_007_csv-on-maxcompute-externaltable"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380300/20210305030713.png"
    date="2021/03/11"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="JSONファイルをテーブルに格納"
    metaDescription="JSONファイルをMaxComputeの内部テーブルに格納する"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_008_json-on-maxcompute"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520700/20210314104120.png"
    date="2021/03/12"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="JSONファイルを外部テーブルへ"
    metaDescription="JSONファイルをMaxComputeの外部テーブルとして処理する"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_009_json-on-maxcompute-externaltable"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699520900/20210315154903.png"
    date="2021/03/15"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="HDFS_Parquetを外部テーブルへ"
    metaDescription="HDFS_ParquetファイルをMaxComputeの外部テーブルとして処理する（外部テーブル・partitionつき）"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_010_parquet-on-maxcompute"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613674380700/20210315194025.png"
    date="2021/03/16"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="Jobを設定する方法"
    metaDescription="MaxComputeでJobを設定する方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_011_job-on-maxcompute"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521700/20210316121020.png"
    date="2021/03/17"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="RDS for MySQL連携方法"
    metaDescription="RDS for MySQL からMaxComputeへ連携する方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_012_rds-maxcompute-sol"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699522100/20210311220708.png"
    date="2021/03/12"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="LogServiceから連携する方法"
    metaDescription="LogServiceからMaxComputeへ連携する方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_013_logservice-maxcompute-sol"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210312004454.png"
    date="2021/03/18"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="Elasticsearchから連携する方法"
    metaDescription="ElasticsearchからMaxComputeへ連携する方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_014_elasticsearch-maxcompute-sol"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699523700/20210311234150.png"
    date="2021/03/22"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="TableStoreから連携する方法"
    metaDescription="TableStoreからMaxComputeへ連携する方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-MaxCompute/MAXCOMPUTE_015_tablestore-maxcompute-sol"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312012000.png"
    date="2021/03/23"
    author="Hironobu Ohara/大原 陽宣"
/>




