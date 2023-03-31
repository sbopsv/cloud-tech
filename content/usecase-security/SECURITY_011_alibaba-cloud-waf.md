---
title: "WAFの紹介"
metaTitle: "Alibaba CloudのWeb Application Firewall（WAF）を使ってみよう"
metaDescription: "Alibaba CloudのWeb Application Firewall（WAF）を使ってみよう"
date: "2021-05-31"
author: "SBC engineer blog"
thumbnail: "/Security_images_10257846132678100000/20210531175757.png"
---

## Alibaba CloudのWeb Application Firewall（WAF）を使ってみよう

# はじめに

本記事では、Alibaba CloudのWeb Application Firewall（WAF）についてをご紹介します。   

# Alibaba Cloud WAFとは
いまさら説明は不要かもしれませんが、WAFとはWeb Application Firewallの略で、Webアプリケーション特有の攻撃、例えばSQLインジェクションやXSSなどから攻撃を守るためのソリューションです。    

Alibaba Cloud WAFはAibaba Cloudが開発するWAF防御ルールを適用するセキュリティプロダクトで、Alibabaグループの様々なWebサービスを保護している実績があります。    
また、中国リージョンにWAFインスタンスを設置出来るという点が他社クラウドと比べた際の特徴と言えるでしょう。    
> https://www.alibabacloud.com/ja/product/waf

# Alibaba Cloud WAFを購入する
では早速、WAFのコンソールを開いて購入してみたいと思います。    
以下が購入画面のキャプチャですが、いくつかポイントがあるのでみていきます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_10257846132678100000/20210531175757.png "img")     



## リージョン
まずはリージョンの選択です。   
リージョンといっても、仮想サーバの購入をするように細かく別れているわけではなく、中国本土か中国本土以外から選択します。   
こちらのリージョン選択は中国向けにWeb配信するかどうかが選択のポイントです。    
ご存知の通り中国でWebコンテンツを配信するにはICP登録が必要なため、WAFでも中国リージョンの選択時にはICP登録が必要です。    
この点は中国リージョンを購入する前に気を付けてください。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_10257846132678100000/20210531185152.png "img")     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_10257846132678100000/20210531185227.png "img")     


また、WAF購入時のリージョンは2択ですが、購入後にWAF保護設定をするタイミングで、どこかのリージョンでWAFインスタンスノードが作成されます。    
このWAFノードは中国本土、日本、香港、シンガポール、マレーシア、シリコンバレー、オーストラリア、ドイツ、インド、インドネシア、ドバイにあります。   
保護するWebサービスに近いリージョンが自動的に選択されることなっています。このあたりは後のステップでもう少し詳しく見ていきます。    

## エディションとオプション
複数のエディションがあり、Pro・Business・Enterprise・Exclusiveから選択します。    
どの機能・スペックを要求するかがバージョン選択のポイントとなります。    
基本的には、"Pro", "Business", "Enterprise"から選択をし、更に細かい部分でオプションを付けたい場合にはExtra Domain, Exclusive IP, Extra Trafficなどを追加していくことができます。    
そして、保護するドメイン数が大量にある場合には"Exclusive"を検討しましょう。     

Extra Domainは、購入したWAFに設定できるドメインの数を増やすことのできるオプションです。     
例えば、Proプランを選択するとデフォルトで1つのドメインを設定できます。     
しかし、aaa.comとbbb.comの２つのドメインを防御したい場合にはExtra Domainで1つ追加することで対応が可能です。    

続いてExclusive IPですが、こちらは少し概念が難しいものになります。     
複数ドメインでWAFを運用している場合に利用します。    
片方のドメインにDosアタックしてきたクライアントはもう片方のドメインにも攻撃ができなくなるというものです。     
あまりユースケースはすくないかもしれませんが、複数ドメイン運用していて同じ攻撃元から両方のドメインに攻撃が来る場合には有効です。    

Extra Trafficですが、こちらはクリーンするパケットの量を追加することができます。     
システムの通信トラフィック量に応じて調整するといいです。    

その他にもWAFのログをLogServiceで分析や長期保存したり、Bot対策としてAnti-Bot機能を選べたりできます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_10257846132678100000/20210531193205.png "img")     

# WAF ドメインを設定する
WAFの購入が完了したらドメインの設定を行っていく必要があります。     
保護するオリジンのWebサーバは予め作成しておき、パブリックにアクセスできる状態にしておく必要があるので注意です。     
これは、保護するオリジンのWebサーバがAlibab Cloud 上にあろうが、Alibab Cloud 以外にあろうが同様でして、Alibab Cloud WAFはインターネット経由でオリジンサーバにHTTPリクエストを送信します。     
WAFのドメイン設定が完了するとCNAMEが発行されます。     
このCNAMEは重要なのでコピーしておきましょう。    
あとでDNSの設定に利用していきます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_10257846132678100000/20210531193826.png "img")     

CNAMEを手に入れたら、お使いのDNSサービスに登録しましょう。    
保護対象のFQDNがWAF経由のアクセスになれば基本設定はOKです。    
これでもうWAFを利用したWebサイトの構築は完了です。   
一般的なクラウドWAFと操作感は変わらずとても導入しやすいです。    


# WAF経由でWebサイトにアクセスする
さっそくまずは普通にアクセスしてみます。    
これは普通にアクセスできます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_10257846132678100000/20210531194318.png "img")     


WAFということで、まずは適当にSQLをパラメータに仕込んだURLにアクセスしてみます。    
例えばこんなURL（URLエンコードは今は無視してください。）    
<code class="EnlighterJSRAW" data-enlighter-language="null">https://waftesturl.sbcloud.ne.jp/?ver=../../../../../../../../../../../../../../../../etc/passwd</code>  
でアクセスします。  

HTTP 405で弾かれること確認できました。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_10257846132678100000/20210531200257.png "img")     



攻撃情報もリアルタイムで確認できるダッシュボード。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_10257846132678100000/20210531200637.png "img")     



# カスタムポリシーを設定する
デフォルトのWAFの設定を試してみましたが、Alibaba CloudではカスタムでURLポリシーを設定することも可能です。    
今回は一例として、    
<code class="EnlighterJSRAW" data-enlighter-language="null">/wp-login.php</code>  
を含むURL PATHのアクセスするとCaptchaが実行されるようにしたいと思います。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_10257846132678100000/20210531201024.png "img")     

Matching fieldはURL PATHのほかにIPやReferer、User-Agentなどが指定できます。    
<code class="EnlighterJSRAW" data-enlighter-language="null">/wp-login.php</code>  
を含むURL PATHにアクセスすると、以下のCaptchaが表示されました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_10257846132678100000/20210531201245.png "img")     


# 最後に
一般的なクラウドWAFと操作感も変わらずとても導入しやすいです。    
また、独特の概念が少しありつつも、かなり高機能な印象もあります。    
大抵のWAF要件は満たせそうで活用の幅は広そうで楽しみです。    

