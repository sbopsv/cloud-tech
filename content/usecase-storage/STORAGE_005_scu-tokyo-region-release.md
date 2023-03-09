---
title: "Storage Capacity Unitsの紹介"
metaTitle: "東京リージョンでStorage Capacity Units (SCU) が利用可能になりました"
metaDescription: "東京リージョンでStorage Capacity Units (SCU) が利用可能になりました"
date: "2020-09-25"
author: "sbc_yoshimura"
thumbnail: "/Storage_images_26006613632265400/20200925163358.png"
---


import CommunityAuthor from '../../src/CommunityAuthor.js';

## Storage Capacity Units (SCU) の紹介

# はじめに

本記事は、Storage Capacity Units (SCU)が東京リージョンでもリリースされたのでStorage Capacity Units (SCU)をご紹介します。     

SCUは一言でいうとストレージのReserved Instanceのようなものです。
こちらのスライドによると他社のクラウドにはない提供プランらしいです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925134427.png "img")      

Digital Alibaba Cloud Day APAC でのスライドより

# SCUの概要

Alibaba Cloudで利用しているPay as You Goのストレージをコスト最適化するためのプランです。

一定のストレージ利用券を先払いで購入すると、対象ストレージの消費に自動的に適用されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925163358.png "img")      

詳細はこちらのドキュメントから確認できます。

[www.alibabacloud.com](https://www.alibabacloud.com/cloud-tech/doc-detail/137896.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/137896.htm

# SCUの対象ストレージ

対象は以下のストレージプロダクトのPay as You Goです。ほとんどのストレージプロダクトが適用されますね。

- ESSD (PL1、PL2、PL3)
- Standard SSD
- Ultra Cloud Disk
- Capacity NAS
- Performance NAS
- Snapshots　(ECS)
- OSS Standard
- OSS Infrequent Access
- OSS Archive storage

# SCUの控除係数

SCUには控除係数という考え方があり、ストレージプロダクトによって係数が決まっています。

以下の表は東京リージョンで20GBのSCUを購入した際の基準です。

ESSD PL1 が基準 1 (=20GB)となっていて、例えば Ultra Cloud Disk なら119.76GB分の消費ができますが、ESSD PL2 なら10GB分の消費となります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925151351.png "img")      

[https://www.alibabacloud.com/product/ecs](https://www.alibabacloud.com/product/ecs) より

# ストレージのリソースプラン(サブスクリプション)との併用

今回紹介しているSCU以外にも、ECSのBlock Storage や OSS や NAS にはサブスクリプションやストレージプランという前払いの料金プランがあります。

SCUとこれらの料金プランと併用する場合には、リソースプランの方が優先されます。

つまり、SCUは Pay as You Go のストレージにのみ消費されるものだと考えて良いでしょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925152838.png "img")      

参考例 : Alibaba Cloud NASの購入画面

> 控除の優先度  
> 特定リソースのリソースプランとSCUの両方が同じアカウントにある場合、指定されたリソースのリソースプランが最初に適用されます。たとえば、アカウントにOSSリソースプランとSCUが同時にある場合、OSSリソースプランが最初に適用されます。

[www.alibabacloud.com](https://www.alibabacloud.com/cloud-tech/doc-detail/140636.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/140636.htm


# SCUの購入

SCUの購入は、ECSのコンソールから **Storage ＆ Snaphots** → **Storage Capacity Units** → **\[ Create Storage Capacity Unit \]**から可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925160919.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925161142.png "img")      

リージョン、容量、期間、適用開始(購入後180日以内)を選んで購入してください。

# コンソールからSCUの適用を確認

**User Center** → **Manage Reserved Instances** からSCUの適用状況が確認できます。

RIと同じ扱いのようです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925155457.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925155651.png "img")      

詳細はSCUが消費された6時間後に表示されます。

例えば上図は 2020-09-25 9時ごろのコンソール画面ですが、表示されているのは 2020-09-25 2時までの情報です。

また、コンソール上からはどのストレージにどれくらい適用されたのかが分からなかったのですが、データをExportをすると**RiUtilizationRate(%)**が確認できました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925160020.png "img")      

下図の赤枠1時間の合計が100％になっています。

なお、このアカウントではSnapshotやNAS(PAYG)といくつかのECSのBlock Storage(PAYG)でSCUが消費されたようですが、実際には他にもストレージのプロダクトを利用しています。

どこから優先的に適用されるのか、細かい適用ルールは分かりませんでした。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613632265400/20200925160214.png "img")     

# 最後に
本記事では、torage Capacity Units (SCU) についてをご紹介しました。例えば検証環境などで Pay as You Go のECSやNASを使っている方にはコストを削減したり定額利用にする良い料金プランだと思いますので、是非参考に頂ければ幸いです。     


 <CommunityAuthor 
    author="吉村 真輝"
    self_introduction = "Alibaba Cloud プロフェッショナルエンジニア。中国ｘクラウドが得意。趣味は日本語ラップのDJ。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yoshimura_pic.jpeg"
    githubUrl="https://github.com/masaki-coba"
/>



