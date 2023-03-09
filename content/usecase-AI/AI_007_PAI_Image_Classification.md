---
title: "PAI-AutoLearningで画像分類"
metaTitle: "PAI-AutoLearningの紹介〜コードなし、機械学習知識不要の画像分類〜"
metaDescription: "PAI-AutoLearningの紹介〜コードなし、機械学習知識不要の画像分類〜"
date: "2020-03-31"
author: "sbc_hong"
thumbnail: "/AI_images_26006613543288200/20200331213752.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## PAI-AutoLearningの紹介〜コードなし、機械学習知識不要の画像分類〜

本記事では、Alibaba Cloudの機械学習プラットフォームPAIの最新のプロダクトAutoLearningを紹介します。

## PAI-AutoLearningとは
PAI-AutoLearning自動化モデリングプラットフォームは、PAIの最新の機能の一つです。機械学習モデリングサービスをユーザーに提供することを目的としています。 

現在、PAI-AutoLearningには画像分類と推奨リコールの２つビジネスシナリオがあります。ユーザーに対して技術スキル要件が低く、PAI-AutoLearningで基本的な構成を行うだけでよく、機械学習モデリング理論を深く理解しなくてもモデルのトレーニングと評価を完成できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613543288200/20200331213752.png "参照")

## PAI-AutoLearning特性
AutoLearning自動学習機能が現れる前に、PAIのPAI-Studio、PAI-DSWはそれぞれ中級アルゴリズムエンジニアと高級アルゴリズムエンジニアに対応して彼らの実験構築ニーズを解決しました。PAI-AutoLearningは、初級または入門レベルのアルゴリズムエンジニアの実験構築ニーズを解決し、より多くの人がマシン学習に参加し、マシン学習を利用して自分の業務に価値をもたらす。

### PAI-AutoLearningは以下のメリットがあります。
１、ゼロの敷居を使って、つまり機能は勝手に使えます、初心者に対してとても友好的です。

２、最低5枚の写真に基づいて一回の学習を行うことができます。強力な転移学習のフレームワークを通じて、少量のデータの効果的な学習を実現できます。学習訓練の結果は依然として優れています。

３、AutoLearningでワンストップソリューションを実現した。ワンストップはデータ表示、モデルトレーニング、モデルデプロイの全過程を含み、ユーザーが機械学習の実用的な応用にも素早く入ることができるように助けます。

## PAI-AutoLearning〜画像分類〜 
PAI-AutoLearningのシナリオの画像分類を紹介します。    
PAI-AutoLearningはオンラインラベリング、自動的にモデルトレーニング、スーパーパラメータの最適化とモデルの評価の機能があります。    

### 現時点で利用状況
* サポートリッジョン：中国東部（杭州）、中国北部（北京）
* サポートシナリオ：画像分類
* パブリックベータ段階にあり、モデルトレーニングはこの期間中、料金を請求しません。

### 公式提供しているテンプレート
製品のトップページでは、2つの画像分類のテンプレートの例を提供しています。動物分類と商品分類（間もなく棚に上がる）。テンプレートの例を使用して作成した例は、OSSライセンスを必要とせず、直接に製品に内蔵されたソースデータを使用してトレーニングすることができます。

### 今回使うテンプレート
ラバ、馬、アルパカの写真はそれぞれ10枚ずつあります。Autolearningプラットフォームを通じて訓練した後、正確率が80%以上の分類モデルが得られます。


「テンプレートから作成」をクリックすると、インスタンスが自動的に生成されます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613543288200/20200401072147.png "参照")

### ３つのステップでPAI-AutoLearningを体験

ステップ１：データラベリング    
データラベリング画面    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613543288200/20200401072711.png "参照")

トレニーグ時間を設定画面
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613543288200/20200331214032.png "参照")


ステップ２：モデルのトレニーグと評価     
トレーニングを開始すると、トレーニングの進行状況やトレーニング時間など、このページでモデルのトレーニングプロセスを確認したり、モデルのバージョン管理などの操作を実行したりできます。 モデルのトレーニングが終了すると、生成されたモデルの精度と精度を確認できます。 モデルの精度を向上させる必要がある場合、2つの方法があります。1つはトレーニングデータの量を増やすこと、もう1つはモデルのトレーニング時間を長くすることです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613543288200/20200401074028.png "参照")

ステップ３：モデルテスト     
画像分類モデルを取得した後、プラットフォームはモデルトライアル機能を提供します。 新しい画像をアップロードするだけで、プラットフォームは画像の分類結果を返します。 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613543288200/20200331214329.png "参照")

これらの3つのステップの後、ラバ、馬、アルパカの分類モデルを取得できます。取得されたモデルをクリックして、モデルをPAI-EASにオンラインモデルサービスとしてデプロイおよび公開できます。

## 最後に
PAI-AutoLearningの基本機能を紹介して、PAI-AutoLearningで画像分類の流れを紹介しました。コードなく、アルゴリズムの基礎が必要なく、簡単に画像分類を体験でき、是非試してください。


 <CommunityAuthor 
    author="洪亜龍"
    self_introduction = "2018年からPythonやJavaScriptをはじめとするAIやサービス基盤中心のバックエンド開発を担当。Alibaba Cloud、Google Cloudが得意。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/hon.png"
    githubUrl="https://github.com/alonhung"
/>




