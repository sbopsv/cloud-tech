---
title: "kubernetes活用パターン"
metaTitle: "kubernetes系プロダクトサービス活用パターンについて"
metaDescription: "Alibaba Cloud のkubernetes系プロダクトサービス活用パターンについてを説明します"
date: "2021-08-26"
author: "Hironobu Ohara"
thumbnail: ""
---


import Titlelist from '../src/Titlelist.js';

<!-- 
query MyQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/usecase-kubernetes/"}}
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
    metaTitle="ECIでサーバレスなコンテナ環境"
    metaDescription="Elastic Container Instance (ECI)でサーバレスなコンテナ環境を利用する"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_001_elastic-container-instance"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613532355000/20200310135808.png"
    date="2020/03/11"
    author="有馬 茂人"
/>

<Titlelist 
    metaTitle="ASKでデプロイとService接続"
    metaDescription="Serverless Kubernetes (ASK) を使用したPodのデプロイとServiceへの接続について"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_002_serverless-kubernetes"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613536114600/20200318150238.png"
    date="2020/03/19"
    author="有馬 茂人"
/>


<Titlelist 
    metaTitle="ACRでビルドパイプラインを実装"
    metaDescription="Alibaba Cloud Container Registry (ACR) でコンテナイメージのビルドパイプラインを実装する"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_003_container_registry"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613540700100/20200330185020.png"
    date="2020/04/01"
    author="有馬 茂人"
/>


<Titlelist 
    metaTitle="ACK と Alibaba Cloud プロダクトを連携する Part 1  (SLB, Cloud Disk, NAS, OSS)"
    metaDescription="Container Service for Kubernetes (ACK) と Alibaba Cloud プロダクトを連携する Part 1  (SLB, Cloud Disk, NAS, OSS)"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_004_ack_and_product_part1"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613544081200/20200409170716.png"
    date="2020/04/13"
    author="有馬 茂人"
/>


<Titlelist 
    metaTitle="ACK と Alibaba Cloud プロダクトを連携する Part 2 (Log Service, RAM, DingTalk)"
    metaDescription="Container Service for Kubernetes (ACK) と Alibaba Cloud プロダクトを連携する Part 2 (Log Service, RAM, DingTalk)"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_005_ack_and_product_part2"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613563493300/20200514190005.png"
    date="2020/05/15"
    author="有馬 茂人"
/>


<Titlelist 
    metaTitle="ACKクラスターをARMSで監視"
    metaDescription="ARMS Prometheus MonitoringでACKクラスターを監視する"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_006_arms-prometheus"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613701553900/20210322180252.png"
    date="2021/03/23"
    author="有馬 茂人"
/>


<Titlelist 
    metaTitle="ACKでOpenKruise"
    metaDescription="ACK で OpenKruise をためしてみた"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_007_openkruise"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613715945600/20210414114035.png"
    date="2021/04/26"
    author="有馬 茂人"
/>


<Titlelist 
    metaTitle="ACK@Edge でエッジ連携"
    metaDescription="ACK@Edge でエッジ連携"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_008_ack-edge"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613787317700/20210721093350.png"
    date="2021/07/21"
    author="有馬 茂人"
/>


<Titlelist 
    metaTitle="ACKで外部k8sクラスタ連携"
    metaDescription="ACK Register Cluster で外部 k8s クラスタ連携"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_009_ack-register"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613803150700/20210902163459.png"
    date="2021/09/03"
    author="有馬 茂人"
/>

<Titlelist 
    metaTitle="ACKをバックアップ"
    metaDescription="VeleroでContainer Service for Kubernetes (ACK) をバックアップする"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_010_ack_backup"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_26006613549307100/20200416144229.png"
    date="2020/04/17"
    author="有馬 茂人"
/>


<Titlelist 
    metaTitle="RancherでKubernetes管理"
    metaDescription="Rancher🐮でKubernetes (ACK) を管理しよう❗️ - 検証編 -"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_011_rancher"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127180000000/20190604205052.png"
    date="2019/06/06"
    author="松田 悦洋"
/>


<Titlelist 
    metaTitle="ACKをアップグレードしよう"
    metaDescription="Container Service for Kubernetes (ACK)をアップグレードしよう❗️"
    url="https://sbopsv.github.io/cloud-tech/usecase-kubernetes/K8S_012_ack-upgrade"
    imageurl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-kubernetes/Container_images_17680117127198400000/20190612172152.png"
    date="2019/07/01"
    author="松田 悦洋"
/>



