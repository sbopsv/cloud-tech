---
title: "LogService活用パターン"
metaTitle: "LogServiceプロダクトサービス活用パターンについて"
metaDescription: "Alibaba Cloud のLogServiceプロダクトサービス活用パターンについてを説明します"
date: "2021-08-25"
author: "Hironobu Ohara"
thumbnail: ""
---


import Titlelist from '../src/Titlelist.js';

<!-- 
query MyQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/usecase-LogService/"}}
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


# Alibab Cloud LogService活用パターンについて

この記事では Alibaba Cloud LogServiceのによる活用パターンをいくつか紹介いたします。

## Alibab Cloud LogService とは

<Titlelist 
    metaTitle="LogServiceの紹介"
    metaDescription="オフラインデータを含めた、様々なデータソースをシームレスに収集するLogServiceのご紹介"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_001_what-is-logservice"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613653714800/20201221132239.png"
    date="2020/12/29"
    author="Hironobu Ohara/大原 陽宣"
/>


## Alibab Cloud LogService による構成例


<Titlelist 
    metaTitle="SDKでTwitterデータを収集"
    metaDescription="SDKでTwitterデータを収集するLogService"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_002_twitter-on-logservice"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613654233400/20201215140931.png"
    date="2020/12/29"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="LogtailでCSVデータを収集"
    metaDescription="LogtailでCSVデータを収集するLogService"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_003_logtail-on-logservice"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740900/20201215135145.png"
    date="2020/12/29"
    author="Hironobu Ohara/大原 陽宣"
/>

<Titlelist 
    metaTitle="OSS、AWS S3からデータを収集"
    metaDescription="OSS、AWS S3からデータを収集するLogService"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_004_oss-s3-on-logservice"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660740700/20201229131536.png"
    date="2020/12/29"
    author="Hironobu Ohara/大原 陽宣"
/>


<Titlelist 
    metaTitle="GASで株価を収集し監視する"
    metaDescription="Google Apps Script（GAS）で株価データを収集し、LogServiceの機械学習で株価予測・異常検知・監視をする"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_005_stock-on-logservice"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613670107200/20201226124040.png"
    date="2020/12/29"
    author="Hironobu Ohara/大原 陽宣"
/>


<Titlelist 
    metaTitle="SDKでExcelデータを収集"
    metaDescription="SDKでExcelデータを収集するLogService"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_006_excel-on-logservice"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613660741000/20201230152149.png"
    date="2020/12/30"
    author="Hironobu Ohara/大原 陽宣"
/>


<Titlelist 
    metaTitle="実運用を想定した構成 Part1"
    metaDescription="実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ収集編～"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_007_Actual_Operation_part1"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_17680117127215800000/20190711194237.png"
    date="2019/07/16"
    author="SBC engineer blog"
/>



<Titlelist 
    metaTitle="実運用を想定した構成 Part2"
    metaDescription="実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編①～"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_008_Actual_Operation_part2"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613376466800/20190724155702.png"
    date="2019/07/26"
    author="SBC engineer blog"
/>


<Titlelist 
    metaTitle="実運用を想定した構成 Part3"
    metaDescription="実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編②～"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_009_Actual_Operation_part3"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613403075200/20190823150645.png"
    date="2019/08/27"
    author="SBC engineer blog"
/>


<Titlelist 
    metaTitle="実運用を想定した構成 Part4"
    metaDescription="実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編③～"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_010_Actual_Operation_part4"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613407698100/20190830162906.png"
    date="2019/09/03"
    author="SBC engineer blog"
/>


<Titlelist 
    metaTitle="実運用を想定した構成 Part5"
    metaDescription="実運用を想定したAlibaba CloudのLogService構成を考えてみる～ログ検索編④～"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_011_Actual_Operation_part5"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613436206900/20190917125527.png"
    date="2019/09/19"
    author="SBC engineer blog"
/>

<Titlelist 
    metaTitle="DataVデータソース登録方法"
    metaDescription="LogServiceをDataVのデータソースに登録する"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_012_attach_DataV_data_source"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613546225700/20200408175501.png"
    date="2020/04/09"
    author="SBC engineer blog"
/> 


<Titlelist 
    metaTitle="単一時系列処理編"
    metaDescription="LogServiceで扱える機械学習の時系列分析を使ってみました ~単一時系列処理編~"
    url="https://sbopsv.github.io/cloud-tech/usecase-LogService/LOGSERVICE_015_LogServiceML_part2"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-LogService/LogService_images_26006613511942400/20200214170745.png"
    date="2020/03/05"
    author="SBC engineer blog"
/>



