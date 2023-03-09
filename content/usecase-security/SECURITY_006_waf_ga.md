---
title: "WAFをGAと組み合わせる"
metaTitle: "Alibaba Cloud WAFをGlobal Accelerator（GA）と組み合わせる"
metaDescription: "Alibaba Cloud WAFをGlobal Accelerator（GA）と組み合わせる"
date: "2020-09-11"
author: "sbc_akahane"
thumbnail: "/Security_images_26006613617490700/20200911141202.png"
---

## Alibaba Cloud WAFをGlobal Accelerator（GA）と組み合わせる

# はじめに

本記事では、Alibaba Cloudのセキュリティプロダクトの一つである、Web Application Firewall（WAF）で、Alibaba Cloudの他プロダクトであるGlobal Accelerator（GA）との組み合わせについてご紹介します。


# 組み合わせ例

WAFはWEBアプリケーション防御のためのセキュリティプロダクトです。そのため、WEBアクセスに関係するプロダクトと組み合わせることができます。     


* WAF＋GA(Global Accelerator)
* WAF＋CDN (Content Delivery Network) 
* WAF＋Alibaba Cloud DNS
* WAF＋Anti-DDoS     
(※Anti-DDoS BasicはWAF立ち上げ時より有効)

など。

# WAF＋Global Accelerator（GA）

ご紹介した組み合わせの中から、今回はWAF＋Global Accelerator（GA）の構成について取り上げ、構築の流れと注意点をお話していきたいと思います。

GA(Global Accelerator)とはリージョン間の通信をアクセラレーション（高速化）する、というプロダクトです。
WEBアプリケーションと組み合わせて利用されるケースが多いです。

WAFとGAを組み合わせる場合、下記例のような配置になります。各インスタンスアイコン上の番号はデプロイの順番を記しています。     

![WAF(香港)→GA(香港)→WEBサーバ(東京)](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200911141202.png "WAF(香港)→GA(香港)→WEBサーバ(東京)")      

# 設定の流れ、注意点。

設定順番は下記となります。特に③のWAFとGAの紐づけが重要なポイントですので、
間違えないようにしましょう。

<b>① WEBサーバを立てる     
② GAを購入し、WEBサーバのIPアドレスと紐づける     
③ WAFを購入し、GAのCNAMEを紐づける     
④ ネームサーバにWAFのCNAMEを登録する     </b>

それでは早速、流れをご説明していきたいと思います。

# 前提

* WAFとGAは香港に、WEBサーバは東京に立てる
* 独自ドメインは取得済み
* ECS、GA、WAFインスタンスは購入済み
* ネームサーバはお名前.comを利用


# 手順     

※本構成をするにあたり重要なポイントを抜き出して記載していきます。
各プロダクトごとの設定方法は公式サイトのドキュメントをご参照ください。

> https://www.alibabacloud.com/cloud-tech/ja/product/28515.htm

> https://www.alibabacloud.com/cloud-tech/ja/product/55629.htm



## 1. 【GA設定】WEBサーバと紐づける
(※WEBサーバ構築、GAインスタンス購入手順は省略します)

### 帯域幅パッケージ購入     

帯域幅パッケージを購入します。
中国本土以外のリージョンにアクセラレーションエリアを置くため、
<span style="color: #ff0000"><b>プレミアム帯域プラン</b></span>を購入します。
クロスボーダ帯域幅は不要です。


<b>Global Accelerator > インスタンス > 基本帯域プランの購入</b>     
帯域タイプ、契約期間を選択し、購入。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200911171828.png "img")      


### 帯域幅パッケージバインド     

<b>Global Accelerator > 帯域幅 > インスタンスのバインド</b>     
仕様がプレミアムであることを確認。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200911172012.png "img")      


バインドするGAインスタンスをリスト内から選択する。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200910184935.png "img")      


### アクセラレーションエリアに香港を指定     　

<b>Global Accelerator > インスタンス > 対象のインスタンス > アクセラレーションエリア > アクセラレーションエリアの追加</b>     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200911165712.png "img")      

     
アクセラレーションエリア：アジア太平洋     
リージョン：中国(香港)     
帯域幅：購入パッケージ範囲内で帯域を割り当てる     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200910193854.png "img")      

### WEBサーバを紐づける     　
<b>インスタンス > 対象のインスタンス > リスナー > リスナーの作成</b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200910195525.png "img")      


各項目を入力する


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200910195542.png "img")      


エンドポイント(WEBサーバ)の情報を入力する。
バックエンドサービスにWEBサーバのIPアドレスを入力する。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200910195607.png "img")      

内容を確認して、設定を完了。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200910195626.png "img")      

GAの設定はこれで完了です。

## 2.【WAF設定】GAとの紐付け
(※WAFインスタンス購入手順は省略します)     

WAFインスタンスは紐付けするドメインに一番近いリージョンでデプロイされます（自動選択）。WAFを香港で立ち上げるには、香港のインスタンス（今回の場合、香港GAのCNAME）と紐付けする必要があります。

### ドメイン名の追加(GAのCNAMEで登録)

<b>Web Application Firewall > Webサイトアクセス > ドメイン名の追加
</b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200910200308.png "img")      


WEBサイトのドメインを入力する。(※WAF内での管理上の設定。DNS登録は別途必要です。)     宛先サーバに<span style="color: #ff0000"><b>GAのCNAME</b></span>を入力


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200911170244.png "img")      

## 3.【DNS設定】DNSレコードにWAFのCNAMEを登録する

お名前ドットコムのDNSレコード設定画面にて、
対象ドメイン・ホストのレコードにWAFのCNAMEを設定する。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200911155720.png "img")      

## 設定後の確認
### 名前解決確認
インターネット上で名前解決(ドメイン名がWAFのCNAMEで解決されること)ができれば本構成の設定完了です。
ネームサーバによって反映まで時間がかかることがあります。          
(例)nslookupコマンドで名前解決確認

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200911155510.png "img")      

### WAFの動作確認
設定したURLに対して、SQL文埋め込み、WEBアクセスしてみました。
しっかりブロックされました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613617490700/20200911161916.png "img")      


# まとめ
WAF＋GAの組み合わせ方法についてご紹介いたしました。
各インスタンスのCNAMEを紐づけていく、というのが特徴かと思います。
特に注意が必要なのは<b>2.【WAF設定】GAとの紐付け</b>の手順。このケースの場合は必ずGA(香港)のCNAMEを紐づけてください。
<span style="color: #ff0000">間違って東京リージョンのWEBサイトのIPを設定してしまうと、
WAFのインスタンスが東京で立ち上がり、WAF(東京)→GA(香港)→WEBサイト(東京)という遠回りの構成になってしまいます。</span>

WAF(香港)＋GA(香港)構築時のポイントは、     

<b>・GAの帯域幅はプレミアム帯域幅を購入すること     
・WAFに紐づけるのはGAのCNAMEにすること     </b>

です。構築の際はご注意ください。     


