---
title: "WAFをAnti-DDoSと組み合わせる"
metaTitle: "Alibaba Cloud WAFをAnti-DDoS Premiumと組み合わせる"
metaDescription: "Alibaba Cloud WAFをAnti-DDoS Premiumと組み合わせる"
date: "2021-01-22"
author: "sbc_akahane"
thumbnail: "/Security_images_26006613680276300/20210119143043.png"
---

## Alibaba Cloud WAFをAnti-DDoS Premiumと組み合わせる

# はじめに
本記事では、Alibaba Cloudのセキュリティプロダクトの一つである、Web Application Firewall（WAF）で、DDoS対策強化ということでAlibaba Cloudの他プロダクトであるAnti-DDoS Premiumとの組み合わせ方法についてご紹介します。

# Web Application Firewall
Web Application Firewall（WAF）の概要については過去記事のご参照をお願いします。
> https://sbopsv.github.io/cloud-tech/usecase-security/SECURITY_006_waf_ga

AlibabaCloud WAFはデフォルトで**Anti-DDoS Basic**が有効になっています。Anti-DDoS Basicでは、トラフィッククリーニングに加え、ブラックホール機能(※)により、Alibaba Cloud全体を保護しています。このブラックホール機能ですが、閾値を超える量の攻撃を受けると発動し、WEBサイトへのアクセスそのものを止めるという仕様になっています。ユーザ側でブラックホール状態の解除や、Anti-DDoS Basicの無効化はできないため、もしブラックホール機能が発動した場合は解除されるまで待つしかありません。     

（※）ブラックホール機能：トラフィックコントロールにより無効なIPへ誘導する仕組み     

有償版の**Anti-DDoS Premium**ではこの閾値によるブラックホール機能は無いため、例えばECサイトなど、WEBサイト停止による影響が大きい場合は、WAFと一緒に導入いただくことをおすすめしています。    


# Anti-DDoSプロダクトの種類

Alibaba CloudのAnti-DDoSプロダクトは大きく分けて４つあります。

* Anti-DDoS Basic　⇒　ECS、EIP、SLB、WAFに標準で装備。無料  
* Anti-DDoS Pro　 ⇒　中国本土内の複数スクラビングセンター(※)にてDDoS防御  
* Anti-DDoS Premium　⇒　グローバルに展開された複数スクラビングセンターにてDDoS防御  
* Game Shield　 ⇒　ゲームアプリケーションの防御に特化したプロダクト  

(※)スクラビングセンター：DDoS攻撃の検知やトラフィッククリーニングをしたのち、正常通信のみ透過させる

中国本土からのアクセスに特化しているプロダクトが用意されているのもAlibabaCloudの特徴です。今回はグローバルに展開しているWEBサイトを想定して、Anti-DDoS Premiumとの組み合わせをご紹介していきたいと思います。

___

(参考)Anti-DDoS BasicとAnti-DDoS Premiumをピックアップして特徴を並べてみました。  

## Anti-DDoS Basic  
* 最大5Gbpsまでの保護(東京リージョンの場合、500Mbps)  
* レイヤー3、レイヤー４のDDoS攻撃防御  
* ブラックホール閾値　有  
* 無料

## Anti-DDoS Premium  
* 10Tbps超の保護性能(グローバルで分散保護している)  
* レイヤー3、レイヤー4、**レイヤー7**のDDoS攻撃防御  
* ブラックホール閾値　無  
* 有料

Anti-DDoS Premiumではレイヤー7の保護も追加され、WEBサービスの防御に優れていることがわかります。

___

今回の構成です。①～④はインスタンスデプロイの順番です。ECS、WAFは購入済みの段階から説明しますので、②の途中から進めていくことになります。ECSとWAFは東京リージョン。Anti-DDoS premiumはエニーキャストにより、クライアントから最寄りのインスタンスを経由するため、リージョンという考えはありません。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119143043.png "img")      

* 独自ドメインは取得済み  
* ECSとWAFは購入済み。東京リージョンに立ち上がっている  
* ネームサーバはお名前.comを利用  

設定の順番は下記となります。       
1．WAFにドメイン設定をする(ECSのIPアドレスを登録)            
2．Anti-DDoS Premiumインスタンスの購入する      
3．Anti-DDoS Premiumにドメイン設定をする(WAFのCNAMEを登録)        
4．ネームサーバにドメイン設定をする(Anti-DDoS PremiumのCNAMEを登録)           

1-1 WAFコンソールにて、Website Access > Website Access ボタンをクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119113541.png "img")      

1-2 WAFコンソールの画面下段よりManually Add Other Websiteをクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119113558.png "img")      

1-3 設定画面が表示されますので、ドメインやサーバのIPアドレスを入力していきます。 IPアドレスはECS(WEBサーバー)のIPアドレスです。 今回はWAFの前段にAnti-DDoSが置かれますので、**最下段の"Does layer7 proxy exist in front o f WAF"はYESにすること**がポイントです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119113313.png "img")      

1-4 設定が完了したらドメイン一覧より対象のCNAMEをコピーしておきます。

Website Access > 対象ドメインにカーソルを合わせるとCNAMEが表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119112703.png "img")      

2-1 AlibabaCloudコンソールより、Products and Service > Anti-DDoS Proを選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119110920.png "img")      

2-2 購入するインスタンスを選択します。  
Product Type：Anti-DDoS Premium   
Mitigation Plan：Insurance   
Function Plan：Standard Function  
※帯域や更新期間等は必要に応じて選択します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119110647.png "img")      

3-1 Anti-DDoS Premiumコンソールにて、Website Config > Add Domain をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119144758.png "img")      

3-2 各種選択・入力していきます。  
Function Plan : Standard  
Domain : ドメインを入力  
Protocol : HTTP・HTTPS※必要なものにチェックしてください  
Server IP : Origine Server Domainを選択。WAFのCNAMEを入力します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119145536.png "img")      

確認したらAddボタンをクリックします。

3-3 Website Configのページより、ドメインが登録されたことを確認します。 Origin Server IP列にWAFのCNAMEが登録されていることを確認。  
DNS登録用にAnti-DDoS PremiumのCNAMEをコピーしておきます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119150050.png "img")      

お名前ドットコムのサイトでDNSレコードの登録をします。  
CNAMEにはAnti-DDoS Premiumで発行されたCNAMEを登録します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119144549.png "img")      


# 効果確認
ネームサーバ登録完了後、DNS解決ができるか、WEBサイトへアクセスできるか確認します。

* nslookup  
⇒Anti-DDoSPremiumのCNAMEで解決されました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119144216.png "img")      

* WEBブラウザでURLへアクセス  
⇒SQL埋め込みにてWAFブロックもされました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210119155416.png "img")      

* Anti-DDoSコンソール確認  
Anti-DDoS Premiumコンソールではアクセス状況が確認できます。  
ダッシュボードでサイトステータスが可視化されるのもPro/Premiumの特徴ですね。  
コンソールでは保護強度も調整可能ですが、今回は割愛いたします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680276300/20210120192958.png "img")      


# 最後に
今回はWAFとAnti-DDoS Premiumの組み合わせについてご紹介いたしました。 構築のポイントとしては、**①Anti-DDoS Premium ⇒ WAF ⇒ ECSの並びで構成する**ことと、 **②WAF設定の中で前段プロキシ有の設定にする**こと、がポイントです。

無償版のAnti-DDoS Basicでは防御能力も限られており、ブラックホールに陥る懸念がありますので、 WEBサイトの規模や重要度に合わせてAnti-DDoS Premiumの導入をご検討ください。


