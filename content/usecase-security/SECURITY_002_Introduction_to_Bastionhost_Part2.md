---
title: "Bastionhostの紹介 Part2"
metaTitle: "二要素認証を用いたホストログイン管理およびユーザ操作監査が可能なプロダクト「Bastionhost」のご紹介②"
metaDescription: "二要素認証を用いたホストログイン管理およびユーザ操作監査が可能なプロダクト「Bastionhost」のご紹介②"
date: "2020-09-10"
author: "SBC engineer blog"
thumbnail: "/Security_images_26006613620914900/20200903110652.png"
---

## 二要素認証を用いたホストログイン管理およびユーザ操作監査が可能なプロダクト「Bastionhost」のご紹介②


![20200908191522](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200908191522.png "20200908191522")


本記事では、Bastionhostのユーザ操作の監査機能を中心にご紹介します。     

ユーザ操作の監査は、     
Bastionhostを経由し、ログインしたHost先での操作に対して制限もしくは記録をするといった機能となります。   

     
操作の制限の例としては、     
誤ったファイル削除によるシステムダウンを防止するため、ファイルやディレクトリを削除するrmコマンドを禁止することや、      
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200903110625.png "img")
     
安易なファイルの持ち出しを禁止するためにローカル/リモート間のクリップボードの使用を禁止したりなどができます。       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200903110641.png "img")
      
また、操作の記録の用途としては、       
なんからの操作ミスでインシデントが起きた際に誰の操作が原因だったかを探るため、常に操作記録を保持・再生できるようにするといったこととなります。       
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200903110652.png "img")
      
小規模システムであれば、上記は導入・保守コスト的に見合わないですが、     
中規模ー大規模システムになると利用ユーザが増加に伴い、人的ミスも増加するので導入するメリットが勝ります。    
      
プロダクト費用につきましては、以下をご参照下さい。


[Billing](https://www.alibabacloud.com/cloud-tech/doc-detail/52924.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/52924.htm




# 制御ポリシー
[Create a control policy](https://www.alibabacloud.com/cloud-tech/doc-detail/162859.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/162859.htm

制御ポリシーでは、WindowsとLinuxでの禁止コマンドおよび禁止操作を設定できます。     
制御ポリシーを設定することで必要なファイルが消されてしまったり、     
勝手にファイルをダウンロードされないようにするといったことが可能です。    
      
制御ポリシーは以下で構成されています。     
・Command Control（Blacklist/Whitelist）（Linux）　<span style="color: #ff0000">※禁止コマンド/許可コマンド設定 </span>           
・Command Approval（Linux）　<span style="color: #ff0000">※承認対象とするコマンド</span>      
・Protocol Control（RDP/SSH）（Windows/Linux）　<span style="color: #ff0000">※禁止操作設定</span>     
・Access Control（Blacklist/Whitelist）（Windows/Linux）　<span style="color: #ff0000">※アクセスコントロール</span>     
     
     
     
▶ Command Control     
Command Controlでは特定コマンドのBlacklist/Whitelist設定が可能です。     
アスタリスクも使用できるので、幅広くマッチします。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901183058.png "img")
     
     

▶ Command Approval     
Command Approvalでは承認対象とするコマンドを設定可能です。     
Command Controlのように単純にコマンドを禁止にするのではなく、コンソールで承認を受ければコマンドが使用できるように設定できます。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901183106.png "img")
     
     

▶ Protocol Control     
Protocol Controlでは操作に関する制御が可能です。      
例えば、ファイルのダウンロードを禁止したり、Windowsのクリップボードの使用を禁止にすることが可能です。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901183115.png "img")
     
     

▶ Access Control     
Access Controlではアクセス制限が可能です。     
BastionhostインスタンスのSecurity GroupやWhitelistとは別に設けられています。     
Bastionhostインスタンスにはアクセスできますが、その先のHostに接続する際にAccess ControlのBlacklist/Whitelist設定が適用されます。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901183124.png "img")
     
     
     
     

# 制御ポリシーの活用例①　Command Control 
作成したポリシーはHost（またはHost Group）とUser（またはUser Group）に対して付与するので、    
例えば、rootユーザをBastionhostで作成した管理者ユーザと一般ユーザで使い分けるといったことも可能です。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904115650.png "img")
     
     
Control Policyに禁止対象とするコマンドを入力し、保存します。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200907115440.png "img")
     
     

Command ControlでLinuxのrmコマンドを禁止にしたPolicyをHost GroupとUser Groupに割り当てます。
User Groupには一般ユーザのみ所属しています。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904111337.png "img")
     
     

     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904140215.png "img")![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904140204.png "img")
     

     
     
２つのターミナルで同じHostに同時ログインします。     
左がBastionhost管理者ユーザのログイン画面です。右がBastionhost一般ユーザのログイン画面です。     
左はrmコマンドが実行可能ですが、右はrmコマンドを実行すると「 [USM] permission denied by rule ～ 」と表示され、コマンドが拒否されました。     
このように制御ポリシーを使用することで、OS側で新規ユーザを作成しなくても１つのOSユーザで操作の制限をかけることが可能です。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200903145229.png "img")
     
     
     
     

# 制御ポリシーの活用例②　Command Approval

[Approve commands](https://www.alibabacloud.com/cloud-tech/doc-detail/162861.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/162861.htm

コマンド完全に禁止にすると不都合が生じる場合もあります。      
しかし、ミスを防止するため、特定コマンドの制限はしたい・・・といった場合に活用できる「コマンド承認」機能もあります。     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904152610.png "img")
     
Command Approvalに承認対象とするコマンドを入力し、保存します。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904150044.png "img")
     
     

制御ポリシーに紐づけられたHostとUserで接続し、承認対象のコマンドを入力すると、    
「 [USM] Waiting for confirmation ～」と標準出力され、待機状態となります。     
この状態はコマンド承認待ち状態となります。     
次にBastionhostコンソールを見てみます。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904150211.png "img")
     
     

先程、入力したコマンドがCommand Approvalに表示されています（<span style="color: #ff0000">入力したコマンドがコンソールへ反映される速度は体感1秒以内と高レスポンスです</span>）。     
これを承認する場合、対象行にチェックし、Allowを押下して承認します。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904150701.png "img")
     
     

承認されると自動的にコマンドの処理が進みます（<span style="color: #ff0000">こちらも1秒以のレスポンスです</span>）。    
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904150906.png "img")
     
     

 無事コマンドが成功しました。    
ファイルも削除されました。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904150952.png "img")
     
     


     
     
     

# 過去セッションの監査     

[Search for sessions and view session details](https://www.alibabacloud.com/cloud-tech/doc-detail/143792.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/143792.htm

何か問題が起きた際に原因究明として、     
どの「チーム」がどのような「操作」をしたのか、再発を防ぐにはどうしたらいいのかを調査する場合があります。    
その際に手っ取り早いのが、（必ずしも解決するとは限りませんが）障害発生時に接続していたユーザの操作を調べることです。    
     
Bastionhostの「Session Audit」では過去の操作記録を動画で見ることができます。      
     
過去のセッションはAudit⇒Session Auditから見ることができます。     
各セッションのActionsのPlayを押下することで操作内容を見ることができます。     
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901163601.png "img")
     
     

操作画面では監査動画を見ることの他に以下のようなことも可能です。     
> スクリーンショット取得およびダウンロード       
> 再生速度の変更    
> 操作待機時間のスキップ   
> 操作コマンド履歴の表示（Linuxのみ）

     
監査動画は10fps～15fps程の画像取得周期でした。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901164448.png "img")
     
     


監査動画は半年以上保存できます。      
なお、動画はOSSに保存されますが、ユーザからは見えないため改ざんはされません。 
      
[FAQ related to feature usage](https://www.alibabacloud.com/cloud-tech/doc-detail/71375.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/71375.htm

     
     
     

# 現在セッションの監査
[Search for real-time monitoring sessions and view session details](https://www.alibabacloud.com/cloud-tech/doc-detail/143793.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/143793.htm

Bastionhostでは現在Hostに接続しているUserの操作もリアルタイムで見ることも可能です。     
現在セッションがAuditのReal-Time Monitoringに表示されます。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901131018.png "img")
     
     

Actions列の「Play」で現在の操作を閲覧することが可能です。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901131203.png "img")
     
     

左画面がBastionhost、右画面がmstsc.exeで接続したWindowsサーバです（<span style="color: #ff0000">Bastionhost側の遅延は回線環境によりますが1秒以内でした</span>）。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901132837.png "img")
     
     

スクリーンショットを取ることも可能です。画像はローカルにダウンロードされます。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200904163928.png "img")
     
     

セッションの詳細を見ることもできます。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901134600.png "img")
     
     

Linuxだとコマンド履歴も見れます。
     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200901155236.png "img")
     
     
     
     

# セッションの強制切断

[Interrupt sessions](https://www.alibabacloud.com/cloud-tech/doc-detail/143799.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/143799.htm

Real-Time Monitoringで不正な操作を見つけた場合、Bastionhostであればセッションの強制切断が可能です。    
セッションの強制切断はReal-Time Monitoringの「Interrupt Sessions」で可能です。     


     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200902132314.png "img")
     
     
     
     

# 認証の種類     
前回のブログでは、Bastionhostインスタンスログイン時の2要素認証にRAMユーザのMFAを使用していました。     
しかし、上記以外でも認証方法を設定することが可能です。    
     
ログイン時の認証で以下を選択することができます。     
・SMS認証　<span style="color: #ff0000">※Local Userに設定している電話番号を用います。</span>     
・AD認証の連携　<span style="color: #ff0000">※別途ADサーバが必要です。</span>     
・LDAPの連携　<span style="color: #ff0000">※別途LDAPサーバが必要です。</span>     
     
     

▶ SMS認証    

[Enable two-factor authentication](https://www.alibabacloud.com/cloud-tech/doc-detail/162855.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/162855.htm

     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200902184616.png "img")
     
     
     
▶ AD認証の連携    

[Configure AD authentication](https://www.alibabacloud.com/cloud-tech/doc-detail/162856.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/162856.htm

      
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200902184625.png "img")
     
     
     
▶ LDAPの連携   

[Configure LDAP authentication](https://www.alibabacloud.com/cloud-tech/doc-detail/162857.htm)
> https://www.alibabacloud.com/cloud-tech/doc-detail/162857.htm

     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613620914900/20200902184633.png "img")
     
     
     
     

# おわりに
今回はBastionhostの監査機能についてご紹介させて頂きました。    
     
Bastionhostは過去セッションの録画のみならず、     
現在セッションの監査や、禁止コマンドの設定、管理者の承認を得ないと使用できないコマンドの設定なども有しています。     
     
また、OS内に別途ユーザを作らなくともBastionhostインスタンスのUserに設定をすれば、コマンドやクリップボードの利用制限なども設定できるのでとても便利です。     
        
前回ブログのアクセス権限の管理や2要素認証に加え、      
今回紹介させて頂いたような監査機能についてもBastionhostは十分に機能を備えていますので、ぜひご検討いただければ幸いです。    
      











