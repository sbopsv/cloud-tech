---
title: "ストレージ活用パターン"
metaTitle: "Storage系プロダクトサービス活用パターンについて"
metaDescription: "Alibaba Cloud のStorageプロダクトサービス活用パターン についてを説明します"
date: "2021-08-22"
author: "Hironobu Ohara"
thumbnail: ""
---


import Titlelist from '../src/Titlelist.js';

## Storage系プロダクトサービスの活用パターンについて

<!-- 
query MyQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/usecase-storage/"}}
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

<Titlelist 
    metaTitle="ArcserveによるOSSバックアップ"
    metaDescription="ArcserveBackupのクラウドストレージにOSSを使用してみた"
    url="https://sbopsv.github.io/cloud-tech/usecase-storage/STORAGE_001_Using_OSS_for_cloud_storage_in_ArcserveBackup"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191126152821.png"
    date="2019/11/28"
    author="SBC engineer blog"
/>


<Titlelist 
    metaTitle="Cloud Storage Gatewayのご紹介"
    metaDescription="Alibaba Cloud の Cloud Storage Gateway を試してみた"
    url="https://sbopsv.github.io/cloud-tech/usecase-storage/STORAGE_002_Cloud_Storage_Gateway"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613489252600/20191226165720.png"
    date="2019/12/27"
    author="SBC engineer blog"
/>

<Titlelist 
    metaTitle="FCで日中間のOSSファイル転送"
    metaDescription="FunctionComputeを利用して日本と中国リージョン間でOSSファイル転送を実現"
    url="https://sbopsv.github.io/cloud-tech/usecase-storage/STORAGE_003_OSS_File_Transfer_between_Japan_and_China_Region_using_FunctionCompute"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200311160651.png"
    date="2020/03/18"
    author="SBC engineer blog"
/>

<Titlelist 
    metaTitle="Storage Capacity Unitsの紹介"
    metaDescription="東京リージョンでStorage Capacity Units (SCU) が利用可能になりました"
    url="https://sbopsv.github.io/cloud-tech/usecase-storage/STORAGE_005_scu-tokyo-region-release"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925163358.png"
    date="2020/09/25"
    author="吉村 真輝"
/>

<Titlelist 
    metaTitle="Synology(NAS)とOSS連携"
    metaDescription="Synology(NAS)のCloudSync機能でAlibaba Cloud OSS連携"
    url="https://sbopsv.github.io/cloud-tech/usecase-storage/STORAGE_006_oss-synology-cloudsync"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613640530800/20201014120344.png"
    date="2020/10/14"
    author="吉村 真輝"
/>

<Titlelist 
    metaTitle="OSSバージョン管理機能"
    metaDescription="Alibaba Cloud オブジェクトストレージサービス（OSS）にバージョン管理機能が増えました❗️"
    url="https://sbopsv.github.io/cloud-tech/usecase-storage/STORAGE_007_oss-versioning"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613472801500/20191205205341.png"
    date="2019/12/07"
    author="松田 悦洋"
/>

<Titlelist 
    metaTitle="OSS Transfer Acceleration"
    metaDescription="OSSブラウザで OSS Transfer Acceleration を利用する方法"
    url="https://sbopsv.github.io/cloud-tech/usecase-storage/STORAGE_008_ossbrowser_transferacceleration"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613656822400/20201125165504.png"
    date="2020/11/25"
    author="吉村 真輝"
/>

