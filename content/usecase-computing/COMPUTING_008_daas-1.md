---
title: "DaaS環境構築-設計編"
metaTitle: "Alibaba Cloudで実現するお手軽DaaS環境 # 設計編"
metaDescription: "Alibaba Cloudで実現するお手軽DaaS環境 # 設計編"
date: "2020-04-17"
author: "SBC engineer blog"
thumbnail: "/computing_images_26006613550281000/20200423183725.png"
---

## DaaS環境構築-設計編


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200423183725.png "img")      

## はじめに

本記事では、**<font color="Red">Alibaba Cloudで実現するお手軽DaaS環境</font>**[^1]と題して、Alibaba Cloudを利用した<font color="DodgerBlue">**セキュア**</font>で<font color="DodgerBlue">**ローコスト**</font>な仮想デスクトップ環境をご紹介します   


新型コロナウイルスの感染防止対策として、また働き方改革の一環として、  
**テレワークの導入**を検討している方々も多くいらっしゃるのではないでしょうか。  

しかしながら、セキュリティリスクや導入・運用コスト等の理由から、  
テレワークの採用に踏み切れずにいる企業も少なからず存在するかと思われます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200415123010.png "img")　　　


- イニシャルコストをなるべく抑えたい。
- パブリッククラウドは、セキュリティが心配、、、
- すぐに仮装デスクトップ環境を使い始めたい 

本記事では、上記のようなユーザのニーズに応えるためどのような設計を行なっているか、  
どのように実現しているかを紹介していきたいと思います  

[^1]: DaaS：Desktop as a Serviceの略。仮想デスクトップ環境を提供するサービスのこと。

      

## DaaS環境の構成
### 構成図
まずはじめに、本記事で紹介するDaaS環境の全体構成をご紹介します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200417073058.png "img")

### 主要コンポーネント
本DaaS環境で利用する主要コンポーネントの一覧と、それぞれの用途です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200415231954.png "img")


### 利用イメージ
簡単な利用イメージは以下になります。  

- **システム利用者**
  - ・DaaS環境の利用：仮想サーバ（Windows）にリモートデスクトップ接続し、業務を行います。    
- **システム管理者**  
  - ・DaaS環境の構築：新規で利用者を追加する際、仮想サーバの増台や、Active Directoryユーザの追加を行い、DaaS環境の構築を行います。  
  - ・DaaS環境の運用：必要に応じて、サーバスペックやストレージサイズ変更等の作業を行います。  
  - ・グループポリシー制御：Active Directoryのグループポリシーを更新することで、利用者の仮想サーバ上における操作の制御を行います。

さて、次項では本DaaS環境を使うと何が嬉しいのか、どのようなメリットがあるのかについて記載していきたいと思います。

## DaaS環境のメリット
### メリット① セキュリティ向上
在宅勤務をはじめとするテレワークの導入に際し、1番のネックとなるのが**セキュリティの担保方法** だと思われます。  
本項では、本DaaS環境におけるセキュリティ観点での訴求ポイントについて紹介していきます。  

#### 通信の暗号化と端末制御
VPN Gatewayを用い、クライアントからの通信をSSL-VPN経由で行うことで、DaaS環境への不正侵入を防ぎます。  
インターネット経由での通信は暗号化されるため、**<font color="DodgerBlue">盗聴やデータ漏洩のリスクを低減</font>**することが可能です。

また、SSL-VPN経由での通信においては、クライアント証明書のインストールが必要となるため、  
DaaS環境へのアクセスを許可した端末のみに制限することが可能です。  

![SSL-VPN①](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200416001710.png "SSL-VPN①")      

#### HTTPSプロトコルでのリモートデスクトップ接続
SSL-VPNをするもう一つメリットとして、**<font color="DodgerBlue">HTTPSプロトコル（443ポート）での通信が可能</font>**な点が挙げられます。  

社内ネットワークからDaaS環境への接続を考える際、リモートデスクトップ接続で標準的に用いられるRDPプロトコル（3389ポート）は、セキュリティ上の問題から禁止されている可能性があります。  

本構成では、<font color="Red">**社内プロキシ等でRDPプロトコル（3389ポート）が制限されている場合でも、HTTPSプロトコル(443ポート)が許可されていれば、DaaS環境へリモートデスクトップ接続を行うことが可能です。**</font>

![SSL-VPN②](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200416004936.png "SSL-VPN②")      

#### 送信元IPアドレスの固定化
多くのシステム/サービスでは、送信元IPアドレスを絞ることでアクセス制限を行なっていると思われます。   
在宅勤務社員が自宅回線からインターネット経由でアクセスする場合、グローバルIPアドレスが動的に変更されることがほとんであるため、  
**<font color="Red">システム側での送信元IPアドレス制御が困難</font>**といった課題が発生します。

![送信元IPアドレスの固定化①](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200416014517.png "送信元IPアドレスの固定化①")      

本構成では、NAT Gateway（S-NAT）を利用することで、  
**<font color="Red">仮想サーバからのインターネット向け通信を、単一のグローバルIPアドレスに固定しています。</font>**  
そのため、社内システムや他のクラウドサービスのFireWallでの**<font color="DodgerBlue">送信元IPアドレス制御を容易に実現</font>**出来ます。

![送信元IPアドレスの固定化②](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200416021149.png "送信元IPアドレスの固定化②")      

#### グループポリシーによる制限
本構成では、仮想サーバ群が属するActive Directoryのドメインコントローラとして、システム管理者のみが接続可能[^2]なサーバを用意しています。  
システム管理者がActive Directoryのグループポリシーを編集することで、利用者の仮想サーバ上での操作を制限することが可能です。

グループポリシーを用いた操作制御の一例として、**リモートデスクトップ越しにおけるクリップボードの利用禁止**を行なっており、  
**<font color="DodgerBlue">ローカル端末-仮想サーバ間のファイル持ち込み/持ち出しを禁止</font>**しています。  

この設定により、情報流出やウイルス感染のリスク低減を実現します。  

[^2]: Security GroupによるソースIP制御、およびOSログインユーザの制限によって実現。

![グループポリシー](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200416033745.png "グループポリシー")      

なお、後述のカスタムイメージ機能を用いることで、業務に必要なToolやデータ等は仮想サーバ上に予め用意されます。  
作業は全てDaaS環境上で完結するため、**クライアント端末側にデータを保有する必要がない**こともポイントです。

### メリット② 運用コストの削減
次に、本DaaS環境を利用する**最大のメリット**である、運用面でのコスト削減方針について紹介していきます。

#### 端末セットアップ工数の削減
テレワーク環境を準備する際に在宅勤務者用の端末を新たに払い出すこととなった場合、  
それら端末を利用可能な状態にセットアップするまでに**<font color="Red">膨大な工数</font>**が掛かることが予想されます。

まずは端末を調達して、OSインストールと設定を行なって...  
次にセキュリティソフトをインストールして....  
業務に必要なMW/SWを入れて.....  
...etc  

上記作業を**全端末分繰り返し**行わなければならないことを考えると、それだけで在宅勤務へのハードルがグッと上がってしまいます。  

本構成では、**<font color="DodgerBlue">ECSのカスタムイメージ機能</font>**を用いることで、端末セットアップに掛かるコストの削減を実現しています。

![カスタムイメージ](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200416041705.png "カスタムイメージ")      

Auto Scalingでローンチした仮想サーバは、各種設定やインストールが完了した状態で起動されるため、  
煩雑な設定作業は**<font color="Red">カスタムイメージ作成時のたった1回だけ</font>**で済むように設計されています。

#### 拡張性を考慮した設計
本構成では、運用時に予想される様々なケースを想定し、拡張性を考慮した設計が行われています。

例えば、以下のようなケースにも柔軟に対応可能です。

* 利用者が増えたので、仮想サーバを増台したい  
* 想定以上に高負荷が掛かるため、サーバスペックをスケールアップしたい  
* ディスクがパンパンなので、ストレージサイズを拡張したい    
* 一定の時間帯に外部通信が集中するので、インターネット帯域幅を拡張したい  

これらの操作は、<font color="Red">Alibaba Cloudの管理コンソール上からいつでも、簡単に変更可能</font>です。

![Auto Scaling台数変更](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200417070204.png "Auto Scaling台数変更")      

### メリット③ 維持コストの削減
最後に、ユーザが一番気になるであろう、DaaS環境の維持コストにフォーカスしてお話ししたいと思います。

#### 従量課金制
自前でテレワーク環境を整えようと思うと新たに端末を購入したりネットワーク機器を揃えたりと、とにかく初期費用がかさみますが、  
本構成では使った分だけの従量課金制なので、イニシャルコストはほとんど掛かりません。  

また、任意のタイミングで容易に環境を停止・破棄可能であるため、  
<font color="DodgerBlue">在宅要請がいつまで続くか予想困難な現状況に適した構成</font>となっています。 


極端な例では、在宅勤務開始の翌日に体制が解除されテレワーク環境が不要になった場合でも、<font color="Red">1日分の料金だけ</font>で利用が可能です。

#### 仮想サーバの計画停止
仮想サーバを構成するECSは、インスタンスを停止することで**課金をストップすることが可能**です。[^4]  

そのため、
夜間や休日等の利用者がDaaS環境を利用しない時間帯を見計らい、  
**<font color="DodgerBlue">計画的に仮想サーバを停止させることで、 Cloud利用費用を抑える</font>**ことが出来ます。

例えば、

  - ・平日は9時-18時で勤務  
  - ・土日祝は休み  

といった勤務体系の場合、仮想サーバの維持コストは以下のようになります。[^5]

![料金比較](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613550281000/20200417054618.png "料金比較")      

計画停止を行うことで**<font color="Red">約1/3程度コストを削減可能</font>**であることがお分り頂けたかと思います。  

本構成においては、仮想サーバ料金がDaaS環境の維持コストの主要項となるため、是非とも計画停止を検討して頂ければと思います。  
※ちなみに、計画停止を行うことで、不要不急の残業を強制シャットダウン といった副次効果も期待出来ます

なお、今回の構成ではお手軽さを重視したため、1ユーザに対し1台の仮想サーバを割り当てていますが  
セッションホストを適切に構成することで、一つの仮想サーバを複数人が同時に利用することも可能です。  
このような構成をとることで、**<font color="DodgerBlue">更なるコスト削減</font>**が見込めます。

[^4]: ディスクの課金は継続します。
[^5]: 料金は執筆時点での概算料金となります。正確な費用はお問い合わせください。

## 最後に
本記事では、Alibaba Cloudを用いたDaaS環境のポイントについて、簡単に紹介させていただきました。  
本記事がテレワーク導入とAlibaba Cloud普及のきっかけになれば幸いです。    

今回は触れませんでしたが、Fortinet社が提供するより仮想アプライアンス製品である**FortiGate**を利用することで、よりリッチな要件にも対応することが出来ます。    
Alibaba Cloudのマーケットプレイスでは、オンデマンドで利用可能な[FortiGate-VM](https://marketplace.alibabacloud.com/products/56700005/Fortinet_FortiGate_VM_On_Demand_2_vCore_CPU_-sgcmjj024285.html)も提供されていますので、エンタープライズ向けに**FortigateVM**を採択した構成も検討頂ければと思います。



