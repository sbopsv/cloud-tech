---
title: "マイグレーション"
metaTitle: "Alibab Cloudによるマイグレーション"
metaDescription: "Alibab Cloudによるマイグレーションを説明します"
date: "2021-03-01"
author: "Hironobu Ohara"
thumbnail: ""
---


import Titlelist from '../src/Titlelist.js';


<!-- 
query MyQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/migration/"}}
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

## Alibab Cloudによるマイグレーション紹介

<Titlelist 
    metaTitle="マイグレーションソリューション"
    metaDescription="Alibaba Cloud マイグレーションソリューション"
    url="https://sbopsv.github.io/cloud-tech/migration/MIGRATION_001_Migration_Solutions"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613696236900/20210226171512.png"
    date="2021/03/02"
    author="有馬 茂人"
/>

## Alibab Cloudによるマイグレーション例


<Titlelist 
    metaTitle="Oracle 移行ツールADAMの紹介"
    metaDescription="Alibaba Cloud Oracle 移行ツールADAM（データベース診断）"
    url="https://sbopsv.github.io/cloud-tech/migration/MIGRATION_002_ADAM_Database_Diagnostics"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200218104848.png"
    date="2020/02/21"
    author="SBC engineer blog"
/>


<Titlelist 
    metaTitle="ADAMによる移行方法"
    metaDescription="Alibaba Cloud Oracle 移行ツールADAM（データベース移行仕組み紹介）"
    url="https://sbopsv.github.io/cloud-tech/migration/MIGRATION_003_ADAM_Database_Migration_System"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613530385900/20200306164949.png"
    date="2020/03/19"
    author="SBC engineer blog"
/>

<Titlelist 
    metaTitle="Hybrid Backup Serviceの紹介"
    metaDescription="Hybrid Backup Serviceについてのご紹介"
    url="https://sbopsv.github.io/cloud-tech/migration/MIGRATION_004_what_is_Hybrid_Backup_Servic"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613628578200/20200916133659.jpg"
    date="2020/10/01"
    author="SBC engineer blog"
/>

<Titlelist 
    metaTitle="AWS S3からAlibaba Cloud OSSへ"
    metaDescription="AWS S3からAlibaba Cloud OSSへマイグレーションの手順を説明します"
    url="https://sbopsv.github.io/cloud-tech/migration/MIGRATION_005_Migrate_from_S3_to_OSS"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/images/00_overview.png"
    date="2021/05/11"
    author="Nancy"
/>


<Titlelist 
    metaTitle="Data Online Migration Service"
    metaDescription="Data Online Migration Serviceを使用して、AWS S3からAlibaba Cloud OSSにデータを転送する"
    url="https://sbopsv.github.io/cloud-tech/migration/MIGRATION_005_S3-OSS"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_13574176438009000000/20210916232211.png"
    date="2021/09/17"
    author="bob"
/>




