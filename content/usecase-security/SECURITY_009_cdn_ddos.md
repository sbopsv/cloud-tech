---
title: "CDNをAnti-DDoSと組み合わせる"
metaTitle: "Anti-DDoS Premium と Alibaba CDN を組み合わせる"
metaDescription: "Anti-DDoS Premium と Alibaba CDN を組み合わせる"
date: "2021-02-04"
author: "sbc_akahane"
thumbnail: "/Security_images_26006613680345000/20210203161225.png"
---

## Anti-DDoS Premium と Alibaba CDN を組み合わせる

# はじめに

本記事では、**Anti-DDoS Premium**と**Alibaba Cloud CDN**との組み合わせについてご紹介します。   

この二つのプロダクトはそれぞれグローバルにノード展開されていますが、組み合わせる場合はどのようにしたらよいでしょうか。この場合、Anti-DDoS Pro/Premiumの**Security-Traffic-Manager**を使うことによってCDNと統合させることができます。     


# Security-Traffic-Manager
Security-Traffic-ManagerとはAnti-DDoS Pro/Premiumの機能の一つで、DDoS攻撃有無に応じてトラフィックの経路をコントロールしてくれるものです。通常、Anti-DDoS Premiumを導入すると、すべてのトラフィックはいったんAnti-DDoSインスタンスを経由してから、オリジンサーバへ流れます（インライン型）。シンプルな構成となりますが、例えばCDNをインライン型でAnti-DDoS Premiumと組み合わせた場合、クライアントによっては常に遠回りの経路となり、パフォーマンスが低下する可能性があります(図1参照)。Security-Traffic-ManagerでAnti-DDoS PremiumとCDNを統合させることにより、**通常時は最寄りのCDN経由、DDoS攻撃検知時はAnti-DDoS Premium経由**、というように振り分けることができます（タップ型）。   

図1    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210202160600.png "img")      

他にもECSやGlobalAcceleratorともSecurity-Traffic-Managerを使った構成が可能です。  

注意点：  
CDNと組み合わせる場合はAnti-DDoS Pro/Premiumの**Enhancedプラン(強化プラン)**が必要です。 またDNSで通信先をコントロールする仕組みなので、クライアントからIPアドレス指定でアクセスさせるような構成には使えません。


# 構成
それでは実際にSecurity-Traffic-Managerを使ったCDN統合の構成を作ってみたいと思います。

* 独自ドメインは取得済み  
* 各プロダクトは購入済み。  
* Anti-DDoS Premium Enhancedプラン  
* CDNは中国本土除くグローバルで設定  
* ネームサーバはお名前.comを利用  

【構成図】 
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210203161225.png "img")      

設定の順番は下記となります。       
1．Alibaba Cloud CDNにドメイン登録をする(ECSのIPアドレスを登録)       
2．ネームサーバにTXTレコードを登録する       
3．Anti-DDoS Premiumにドメイン設定をする(ECSのIPアドレスを登録)       
4．Security-Traffic-ManagerでCDNと統合する       
5．ネームサーバにドメイン設定をする(Security-Traffic-ManagerのCNAMEを登録)      

# 1.Alibaba Cloud CDNにドメイン登録をする(ECSのIPアドレスを登録)

【CDN設定】CDNにドメインを登録するところからはじめます。  
Alibaba Cloudコンソール　＞　Alibaba Cloud CDN　をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201183849.png "img")      

【CDN設定】 ドメイン名　＞　ドメイン名の追加をクリック      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201183525.png "img")      

【CDN設定】 下記入力して次へ。  
加速リージョンというのはCDNノードを置くエリアのことです。 中国本土を含む場合、ICP登録が必要となりますのでご注意ください。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201183751.png "img")      

【CDN設定】 この画面でドメイン検証用としてTXTレコードが払い出されます。ご利用のネームサーバにTXTレコードとして登録することで、ドメイン検証がされる仕組みになっています。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201183933.png "img")      

# 2.ネームサーバにTXTレコードを登録する  

【DNS登録①】お名前ドットコムにログインし、先ほどのTXTレコードを登録する。 ※この例はお名前ドットコムを利用。  
ホスト名:　verification  
TYPE:　TXT  
VALUE:　↑で払い出された値を入力

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201184043.png "img")      

【CDN設定】 Alibaba Cloud CDN設定画面に戻り、検証ボタンを押します。ネームサーバに登録したDNS設定に問題がなければ下記画面より先に進めるようになります。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210202174423.png "img")      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201184254.png "img")      

これでCDN側の設定は完了です。  

# 3.Anti-DDoS Premiumにドメイン設定をする(ECSのIPアドレスを登録)  

【Anti-DDoS Premium設定】Anti-DDoS Premiumコンソール　＞　ウェブサイト構成　＞ドメインの追加をクリック      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201185637.png "img")      

【Anti-DDoS Premium設定】Function PlanはEnhanced(強化)を選択。ドメインとサーバIPにそれぞれ入力して追加ボタンをクリック。プロトコルはオリジンサーバが対応しているプロトコルを選択してください。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201185643.png "img")      

ウェブサイト構成の画面に戻り、ドメインが登録されていることを確認します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210204095442.png "img")      

これでAnti-DDoS側もドメイン登録完了です。続いてCDNとの統合設定に移ります。  

# 4.Security-Traffic-ManagerでCDNと統合する

【Anti-DDoS Premium設定】Sec-Traffic Manager　＞　設定するドメインの右側、インタラクションの追加をクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210202174852.png "img")      

【Anti-DDoS Premium設定】 設定画面が表示されるので、インスタンス名にチェック、CDNを選択し、進みます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201185810.png "img")      

【Anti-DDoS Premium設定】 CNAMEが割り当てられました。後で必要になりますのでコピーしておきます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201185829.png "img")      

# 5.ネームサーバにドメイン設定をする(Security-Traffic-ManagerのCNAMEを登録)  

【DNS登録②】お名前ドットコムにログインし、DNSレコード登録画面で先ほどコピーした**Security-Traffic-ManagerのCNAME**を登録します。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201190019.png "img")      

これで完成です。


# 確認
登録したドメインがAnti-DDoSのSecurity-Traffic-ManagerのCNAMEで名前解決されるか確認します。  　　
Security-Traffic-ManagerのCNAMEで解決されましたのでOKです。  
例）Windows　nslookup   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210201190320.png "img")      

linuxのdigコマンドを使って、現在どちらのルートなのか確認することができます。

**digインストールコマンド**  
yum -y install bind-utils

**確認コマンド**  
dig　<webサイトのドメイン>

**CDN経由(通常時)**の結果です。複数のCDNノードのIPに解決されます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210204105049.png "img")      

**Anti-DDoS Premium経由(攻撃検知時)**Anti-DDoS PremiumのIPアドレスに解決されます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613680345000/20210204105054.png "img")      

攻撃検知から実際の切り替わりまでからおよそ10分程かかりました。DNSでのコントロールのため、TTLやDNSキャッシュの関係で、時間差があると思います。切り替わり後、閾値以下の状況で12時間経過すると自動で戻るようになっています。

# 最後に
Anti-DDoS PremiumのSecurity-Traffic-Managerを使ってCDNと組み合わせをしてみました。構築のポイントとしては①Security-Traffic-Managerを使うこと※Enhancedパッケージが必要②先にCDNにドメインを登録しておくこと③ネームサーバにはSecurity-Traffic-ManagerのCNAMEを登録することです。パフォーマンスにかかる重要な部分ですので、組み合わせ方にご注意ください。

（参考リンク）
> https://www.alibabacloud.com/cloud-tech/doc-detail/179122.htm


