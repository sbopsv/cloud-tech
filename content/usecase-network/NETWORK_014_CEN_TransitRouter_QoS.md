---
title: "CEN Transit RouterでQoS機能"
metaTitle: "CEN Transit RouterでQoS機能を使用してみた。"
metaDescription: "CEN Transit RouterでQoS機能を使用してみた。"
date: "2021-08-17"
author: "sbc_nishino"
thumbnail: "/Network_images_26006613796957300/20210813184155.png"
---

## CEN Transit RouterでQoS機能を使用してみた

# はじめに

本記事では、AlibabaCloud CEN Transit Routerの解説およびTransit Routerの機能の一つであるQoS機能をご紹介します。     

# CEN Transit Routerとは

Cloud Enterprise Network（以下CEN）インスタンスのコアコンポーネントです。リージョン間通信、VBR・CCNといったVPC以外のプロダクト接続をTransit Routerを使うことで実現可能です。Enterprise EditionとBasic Editionの2種類がございます。Enterprise Editionは従量課金、Basic Editionは無料のインスタンスになります。

# CEN Transit Routerの特徴

従来のCENと比較し現時点で私が理解している特徴的な機能をご紹介します。

**1.CEN従量課金プランのサポート  
2.冗長性  
3.QoS機能サポート**

**従量課金プラン**は**8/13日現在未提供**となります。従来のサブスクリプションタイプの帯域幅プランに比べ常に一定の通信をご利用しているわけではなく、データ転送など通信にバースト性があるようなご利用をされている場合、こちらのプランの方が適切そうなので今後のリリースを期待したいですね。

**冗長性**に関してはTransit Routerという概念が新たにできプライマリZoneとセカンダリZoneにVSwitchを配置し明示的にデプロイするようになりました。

**QoS**は付与されたDSCP値に従い通信を予め指定した帯域分を確保する機能となります。後述で詳しく記載させて頂きます。

# Enterprise Edition対応リージョン

QoS機能はEnterprise Editionのみ使用できる機能になります。対象リージョンは下記になります。  
・中国（杭州、深セン、北京、上海）  
・香港  
・シンガポール  
・アメリカ（バージニア、シリコンバレー）

# ご利用料金

CEN帯域幅パッケージ料金の他にEnterprise EditionでTransit Routerの接続料金、VPCからTransit Routerに出ていくアウトバンドトラフィックに対して課金が発生します。課金されるトラフィックの対象は下記図をご参照ください。

[Alibaba Cloud CEN Transit Router Billing exampleより引用](https://www.alibabacloud.com/cloud-tech/doc-detail/189833.htm?spm=a2c63.p38356.b99.226.514c46505h2LTl)
> https://www.alibabacloud.com/cloud-tech/doc-detail/189833.htm

> ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813184155.png "img")    
> 
> Transit-Router_billing

# 価格表

料金表に基づき課金されます。最新の料金に関しましては下記をご参照ください。
> https://www.alibabacloud.com/cloud-tech/doc-detail/189836.htm

|リージョン|接続料金（USD /時間/添付ファイル）|データ転送料金（USD / GB）|
|---|---|---|
|中国（北京）|0.05|0.02|
|中国（杭州）|0.05|0.02|
|中国（上海）|0.05|0.02|
|中国（深セン）|0.05|0.02|
|中国（香港）|0.06|0.02|
|アメリカ（シリコンバレー）|0.06|0.02|
|アメリカ（バージニア）|0.06|0.02|
|シンガポール|0.06|0.02|
※2021/08/13現在の料金表に基づき掲載

# QoSの仕様

QoSは購入頂いたCross-region帯域幅パッケージ単位でQoSポリシーが定義可能で、DSCP値割り当てる帯域幅を割合にて指定頂くことで帯域確保が可能となります。  
例：帯域幅パッケージ2Mbpsに対しDSCP値46が付与された通信は帯域幅を20%を確保するよう設定

注意ポイントといたしましてはQoS制御はDSCP値に従いパケットを優先して処理する優先制御ではなく、定義したQoSポリシーの帯域割合に従い帯域を占有します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210816172520.png "img")      

QoS_specification

# QoS検証環境構成図

上海リージョンのクライアントECSから香港リージョンのサーバECSへ指定したトラフィック量を、指定した時間継続的に印加可能なJperfを用いてDCSP値が有りと無しのトラフィックそれぞれ2Mbpsを印加し帯域が確保されるか確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813211001.png "img")     

検証環境構成図

# Transit Router設定の前に

1.AlibabaCloudは新しいバージョンをご利用ください。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813202244.png "img")      

新しいコンソールバージョン

2.あらかじめTransit Routerを配置するリージョンのVswitchをご用意ください。

対象のリージョンとVswitchのZoneは下記をご参照下さい。

> https://www.alibabacloud.com/cloud-tech/doc-detail/189596.htm

3.中国本土⇔アジア太平洋の帯域幅パッケージをご用意ください。  
※帯域幅パッケージ無しではQoSの定義ができません。

4.CENインスタンス、VPCなどは定義されている前提で手順は記載いたします。

# Transit Routerの作成

1.AlibabaCloudコンソールより[Cloud Enterprise Network]をクリックし、対象のCEN [Instance ID]をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813202945.png "img")      

1.Transit Router Create

2.[Create Transit Router]をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813202457.png "img")      

2.Transit Router Create

3.対象の[Region]を選択し[Name]を入力し[OK]をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813202622.png "img")      

3.Transit Router Create

4.[Create Connection]をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813202713.png "img")      

4.Transit Router Create

5.[VPC]を選択します。

6.[深セン]を選択します。

7.対象の[AZ Zone]を選択します。

8.[Attachment Name]を入力します。

9.[Network(VPC)]を選択します。

10.予め用意した[VSwitch]を選択します。

11.[OK]をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813203106.png "img")      

5-11.Transit Router Create

12.Connectionが作成完了次第、対向側香港リージョンのTransit Routerも同様の手順にて作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813204248.png "img")      

12.Transit Router Create

# Cross-region Connectionsの作成

1.2リージョン分のTransit Routerが作成されたら深センTransit Routerの[Cross-region Connections]をクリックし[Set Region Connection]を作成します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813204809.png "img")      

1.Cross-region Connectionsの作成

2.[Cross-region]を選択します。

3.[深セン]を選択します。

4.[Bandwidth Plan]を選択します。

5.[香港]を選択します。

6.購入頂いた[帯域幅パッケージ]を選択します。

7.割り当てる[帯域幅]を入力します。

8.[OK]をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813205137.png "img")      

2-8.Cross-region Connectionsの作成

9.Connectionが作成されたことを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813205226.png "img")      

9.Cross-region Connectionsの作成

# QoS Policyの作成 

1.深センTransit Routerの[Cross-region Connections]をクリックしQoS Plicy欄の[Set]をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813205415.png "img")      

1.QoS Policy Create

2.[Policy Name]を入力します。

3.作成した[Cross-region Connections]を選択します。

4.[Queue Name]、[Matching DSCP]、[Bandwidth Cap]を入力します。

5.[OK]をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813205553.png "img")      

2-5.QoS Policy Create

6.QoS Policyが[details]になったことを確認します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813205712.png "img")      

6.QoS Policy Create

7.同様の手順で対向側香港Transit RouterのQoS Policy設定を行い設定完了となります。

# Transit Routerトラフィック量の確認方法

Transit Routerのトラフィック量確認方法

1.対象のCENインスタンスIDをクリック

2.[Charts]タブをクリックし [Intra-region-Connections]タブをクリックし

3.Transit Routerに関連付けられているNWインスタンスと、NWインスタンスが展開されているリージョンを選択します。

4.上海TRと香港TRのトラフィックを確認することでQoSが効いているか確認することができます。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813210312.png "img")      

Transit Router Traffic Confirmation

# DSCP値無し2Mbpsのトラフィック印加時のグラフ

AtachmentInRateの結果から上海VPCからTransit Routerに流れるトラフィックが2Mbpsであることが確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813211801.png "img")      

上海Transit Routerのトラフィックモニター

AtachementOutRateの結果からTransit Routerから香港VPCに流れるトラフィックが1.6Mbpsに制御されたことが確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813211915.png "img")      

香港Transit Routerのトラフィックモニター

# DSCP値46付与有り2Mbpsのトラフィック印加時のグラフ

AtachmentInRateの結果から上海VPCからTransit Routerに流れるトラフィックが2Mbpsであることが確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813212347.png "img")      

上海Transit Routerのトラフィックモニター

AtachementOutRateの結果からTransit Routerから香港VPCに流れるトラフィックが0.4Mbpsに制御されたことが確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613796957300/20210813212418.png "img")      

香港Transit Routerのトラフィックモニター

# 最後に
AlibabaCloud CEN Transit Routerの解説およびTransit Routerの機能の一つであるQoS機能をご紹介しました。    
CEN内の帯域を予め確保できるのでVoIPなど業務上重要な通信を確保できるのでより安心してCloud Networkを活用できる便利な機能ですので、CENを検討している際にはご参考に頂ければ幸いです。     





