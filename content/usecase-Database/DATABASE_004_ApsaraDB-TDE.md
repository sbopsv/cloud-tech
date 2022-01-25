---
title: "RDS SQL Serverの暗号化"
metaTitle: "ApsaraDB RDS for SQLServerでデータをTDE暗号化し、確認してみる"
metaDescription: "ApsaraDB RDS for SQLServerでデータをTDE暗号化し、確認してみる"
date: "2021-06-18"
author: "sbc_ohara"
thumbnail: "/Database_images_26006613777375500/20210618211853.png"
---

## RDS SQL Serverの暗号化


# はじめに

例えば、データベースに、氏名や生年月日、住所などの個人情報、クレジットカード、口座番号などのデータが含まれている場合、これを公開せずに運用したい場合とかありますよね？ その場合は第三者に知り渡れないようにデータベースを暗号化する必要があります。


この記事では、データベースのセキュリティ機能・暗号化の種類の説明および個人情報が含まれているデータベースのバックアップファイルを保護するプロセスを説明します。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618223325.png "img")      


Alibaba Cloud ApsaraDB（データベースサービス）には様々なセキュリティ機能があります。

※ApsaraDBは、Alibaba Cloudがクラウドコンピューティングの上で稼働するデータベースとして名付けたもので、Apsaraはインド神話にある水の妖精で、「雲の海に生きるもの」を意味するものです。だからクラウドコンピューティングのデータベースとしてApsaraDB（アプサラス）ですね。最初何かの恐竜の名前と思ったのはまた秘密。: )

[アプサラス](https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%97%E3%82%B5%E3%83%A9%E3%82%B9)

> https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%97%E3%82%B5%E3%83%A9%E3%82%B9




---


# ApsaraDBのセキュリティ・暗号化機能について
ApsaraDBのセキュリティ機能として、例えば、
  
・Firewall   
・KMS（Key Management Service）   
・TDE（Transparent Data Encryption）   
・SSL/WhiteList    
・ディスクの暗号化    

などがあります。少し説明します。   

**Firewall** はAlibaba CloudのNetworkレベル（VPC、Databaseなどのプロダクト単体）のことを指します。   
    
**KMS**は Key Management Serviceの略で、 データを暗号化する際に使用される暗号化Keyを安全に管理することを目的としたサービスです。   

> https://www.alibabacloud.com/cloud-tech/doc-detail/28935.htm

   
**TDE** は Transparent Data Encryptionの略で、データベースのデータベース・テーブルのデータに対し暗号化をする機能です。TDEを設定することで、SSDなどの物理ストレージやOSSへバックアップでもデータが書き込まれる前に暗号化されます。なので、バックアップファイルやインスタンス上のデータは全て暗号化されています。TDEはKMSのCMK（Customer Master Key）を使用してTDE 証明書を作成することで、これらのリソースを暗号化するため、KMSが必須です。注意として、TDE 証明書をエクスポートすることや、TDE 証明書を別アカウント、クラウドサービスで利用することはできません。
ApsaraDB RDS for MySQL/PostgreSQLのTDEはAlibabaCloudによって開発されたもので、ApsaraDB RDS for SQLServerはSQLServer EnterpriseEdition付帯をベースとしています。詳しくは[Microsoft SQLServerのTDE詳細](https://docs.microsoft.com/en-us/sql/relational-databases/security/encryption/transparent-data-encryption?redirectedfrom=MSDN&view=sql-server-ver15)を参照いただければ幸いです。

> https://www.alibabacloud.com/cloud-tech/doc-detail/96121.htm


**SSL/WhiteList** は名前通り、Secure Sockets Layer（SSL）およびWhitelistによるサーバールート証明によるセキュリティ機能です。
RDSはアプリケーションとデータベース間の接続を暗号化できますが、SSLはアプリケーションがサーバーで認証した後に、データベースへ接続するので、中間者攻撃（MITM:Man-In-The-Middle）など悪意ある攻撃を未然に防ぐことが出来ます。

> https://www.alibabacloud.com/cloud-tech/doc-detail/32474.htm


**ディスク暗号化** はRDSインスタンスのディスク全体を暗号化する手法です。例えデータが漏洩したとしてもデータを解読することは出来ません。

> https://www.alibabacloud.com/cloud-tech/doc-detail/135361.htm


参考：データ暗号化
> https://www.alibabacloud.com/cloud-tech/doc-detail/53620.html




これはPolarDBでのセキュリティ体系図ですが、ApsaraDB RDSシリーズとかも共通事項です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618211853.png "img")      

PolarDB-O（Oracle）には、CIA、アメリカ合衆国の中央情報局も認めるほどOracle Databaseレベルのセキュリティ機能が充実しています。例えばSQL FirewallやSQLアナライザーなど、Oracle Databaseの標準セキュリティ機能は全部実装しています。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618211908.png "img")      


# KMS作成およびRDS SQLServer作成
閑話休題、RDS SQLServerにてデータの暗号化を実施してみます。    
KMSを初めて触れる場合、まずは Key Management Service（KMS）画面に遷移し、Key Management Serviceをアクティベーションします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618211951.png "img")      

続いて、ApsaraDB RDSコンソールに遷移し、ApsaraDB RDSの購入画面画面に移ります。今回はSQL Serverを選定します。    
ここで注目したいのが、「Disk Encryption」です。「Disk Encryption」は上記説明通り、ディスク暗号化のことを意味します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212013.png "img")      

ここをクリックするとKMSがRDSに対するリソース画面が出ます。ここもポチっと承認します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212105.png "img")      

承認後はRAM（Resource Access Management）画面に遷移されますが、ここも、「Confirm Authorization Policy」をクリックして承認します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212125.png "img")      

「Create Key」から鍵を作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212140.png "img")      

Key Spec:はCMKのタイプです。Aliyun_AES_256は256bitのAES形式暗号です。ソフトウェア・HSMレベルでデータを保護します。Aliyun_SM4は128bitのSM4形式暗号でHSMレベルでデータを保護します。     

Rotation Period:はこのKMSの有効期限のことを指します。作成日から30日、90日、180日、365日、無効、カスタマイズ、と好きに選定することが出来ます。   

まずはこの感じで登録します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212211.png "img")      

登録後はApsaraDB RDSコンソールに遷移し、一度ブラウザを更新してから、「Disk Encryption」をクリックします。すると先ほど作成したKMSのCMKが選定されます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212229.png "img")      

あとはそのままApsaraDB RDS SQLServerをそのまま購入します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212244.png "img")      

インスタンス作成後、基本画面にてKMSとしてのKeyが表示されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212307.png "img")       

ただし、これはあくまでも「KMSつきRDSインスタンス作成」、だけなので暗号化の作業は未実施のため、データが見れる状態です。    
次のステップとして、データ暗号化、、の前に暗号化の対象となる「Database」「Table」の作成の作業に移ります。    


# RDS SQLServerでデータ格納
再びApsaraDB RDS画面に遷移します。ApsaraDB RDS SQLServerのインスタンス作成が終わったなら、「Account」「Database」を登録します。   

DatabaseでDatabase名は「list_db」、Supported Character Setは「Japanese_Unicode_CI_AS」（UTF-8、大文字・小文字を区別しない、アクセント文字は区別）とします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212344.png "img")      

作成したDatabaseを、作成したばかりのアカウントに紐づけます。今回はTableを新規作成する必要があるので、Ownerを選定します。    
SQL Serverは テーブルを作成する権限（Owner）、テーブルを読み書きする権限（Read/Write (DML)）、テーブルを読み取りする権限（Read-only）それぞれがあります。Adminだからといって何でもできるわけではないので注意。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212410.png "img")      

作成後はコンソール画面から「Log On to Database」でDMSへ遷移します。DMSはデータベースをGUI操作で管理するユーティリティです。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212430.png "img")      

PolarDBコンソールから直接クエリエディターを開き、SQLクエリを入力 / 外部ファイルやデータを読み込んでクエリを実行もできます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212444.png "img")      

DMSからBI Toolとして可視化もできます。しかも無料で高度なグラフやリアルタイム可視化もできます。（なぜかあまり知られてないけど、、）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212459.png "img")      

DMSにログインしたところ、SQL ServerとしてのIPアドレスが許容されてないよ、と怒られます。    
なので、そのIPアドレスをコピーし、Data Security > Whitelistに追記します。あるいは、DMSから提示されるIPアドレス一覧をそのままワンクリックでWhiteListに登録することもできます。        
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618212921.png "img")      

再び、DMSにApsaraDB RDS SQLServerとしてログインします。    
list_dbを選定し、以下SQLクエリでlist_tableを作成します。    

```SQL
CREATE TABLE list_table (
	UserID CHAR(5) PRIMARY KEY,
	GivenName VARCHAR(10) NOT NULL,
	FamilyName VARCHAR(10) NOT NULL,
	Age INT CHECK (Age >= 0) ,
    Address VARCHAR(30) NOT NULL
);
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618213000.png "img")      


個人情報付きのデータを格納します。なんでもいいんです :D
```SQL
INSERT INTO list_table (UserID, GivenName, FamilyName, Age, Address)
	VALUES ('A001', 'どらえもん', '野比', 102, '東京都練馬区月見台すすきが原');
INSERT INTO list_table (UserID, GivenName, FamilyName, Age, Address)
	VALUES ('A002', 'のび太', '野比', 10, '東京都練馬区月見台すすきが原');
INSERT INTO list_table (UserID, GivenName, FamilyName, Age, Address)
	VALUES ('A003', 'スネ夫', '細川', 11, '東京都練馬区3-10-5' );
```

格納後はSELECT文で確認してみます。    
```SQL
SELECT * FROM list_table;
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618213029.png "img")      

個人情報付きデータがあることを確認しました。    
次、このデータをTDEによる暗号化をします。     

# TDEの有効化
RDSインスタンスの「Data Security」から「TDE」タブを選定し、TDEを有効化します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618213113.png "img")      

TDE、暗号化したい対象のデータ（Database、Table）を選定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618213258.png "img")      


TDE有効化はRDSインスタンスのStatusが黄色信号でModifying TDE と表示されます。これが青色信号RunningになればOKです。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618213311.png "img")      


これで以上です。    
注意として、TDEを有効化すると、処理（データの追加・更新・抽出）の都度暗号化の処理が実施されるため、CPU使用率が少し上がります。負荷が大きい場合はSpecの高いインスタンスへ切り替えると良いです。    
ApsaraDB RDSの良いところの１つは、いつでもSpecを柔軟に変更することができるので、事前にSpecがどれぐらい必要か、といったサイジングやリソース調査が不要です。     
    


# TDEによる暗号化を確認してみる
上記、ApsaraDB RDS SQLServerでTDEによる暗号化を実施しました。   
果たして、これが有効であるかを軽く確認します。確認方法としては、以下の2つのアプローチとなります。    

> * ApsaraDB RDS SQLServerをバックアップし、他のRDSインスタンス、および他アカウントでもリストア（復元）できるか？    
> * TDEによる暗号化を有効/無効時はリストア（復元）が使えるか？    


## 確認事項1：バックアップデータ（TDE暗号化）を他RDSインスタンス（同一アカウント）でリストア（復元）できるか？

結論：できません。:'(    

検証内容としては以下通り。    


### 事前準備：RDS SQLServerをバックアップし、別のRDSで復元するための事前準備（共通事項）
RDS SQLServerのバックアップ手順は以下通りですが、今回はTDE暗号化の状況がどうなってるかを確認するために、物理バックアップします。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/95717.htm


メニューバーの「Back Up Instance」から、「Full Backup」を選定し、OKをクリックします。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618213507.png "img")      


物理バックアップが完了しました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618213525.png "img")      

バックアップしたファイルをダウンロードします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618213536.png "img")      

> https://www.alibabacloud.com/cloud-tech/doc-detail/98819.html

これを使ってKMS、暗号化されてるかを検証してみます。    
前提として、先ほどダウンロードしたファイル（バックアップデータ）はOSSに格納します。（KMSを作ったアカウント、他アカウント）

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618213615.png "img")      



### 1-1. KMSを作った同一アカウントで他RDSによるリストア（復元）

上記、OSSにあるデータ（TDE暗号化）を別のRDBでリストア（復元）できるかテストしてみます。    
上記と同じ手順に沿ってApsaraDB RDS SQL Serverインスタンスを作成します。このインスタンスはon-kmsと名付けています。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618215553.png "img")      


さっそく、Backup and Restoration > Migrate OSS backup Data to RDS をクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618215607.png "img")      

道なりにデータを選定します。注意として、ここもRAM（Resource Access Management）画面に遷移されつつ、「AliyunRDSImportRole」を承認します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618215640.png "img")      

「list_db_back_add_kms」というDatabaseを新規で作りつつ、list_db.bak、list_table.bakら database backup fileをリストア（復元）してみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618215657.png "img")      

結果、list_db.bak、list_table.bakどちらも「サーバー証明書が見つからず、異常終了、、」と画面通りに失敗しました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618215704.png "img")      


### 1-2. TDEを解除してから同一アカウントで他RDSによるリストア（復元）
今度は、TDEを解除してからバックアップし、これを使ってRDSによるリストア（復元）を試します。    
TDEを解除のうえ、上記通りOSSへバックアップします。（TDE解除、非暗号化）     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618215905.png "img")      

上記と同じ手順で、Backup and Restoration > Migrate OSS backup Data to RDS をクリックし、OSSにあるデータ（TDE解除、非暗号化）を選定します。「list_db_back_add_kms」というDatabaseにします。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618215923.png "img")      


結論として、OSSにあるデータ（TDE解除、非暗号化）は無事リストアできました。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618215941.png "img")      


DMSへ入って中身を確認します。    
※ここもDMSのIPアドレスをRDSのwhitelistへ反映をお忘れなく。   

DMSでSELECT文で確認してみます。   
```SQL
SELECT * FROM list_table;
```

結論として、テーブルの中身は見れました。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618220018.png "img")      



### 1-3. TDEを解除してから他アカウントの他RDSによるリストア（復元）
上記、データをTDEにしなければ、データは閲覧できないことは明らかになりました。
では、TDE未実施（非暗号化）かつ、「Disk Encryption」ことディスク暗号化のデータをバックアップし、他アカウントのRDSへリストア（復元）したらどうなるでしょうか。ちょっと試してみます。

まずは他アカウントのOSSにRDS SQLServerのデータ（TDE未実施（非暗号化）かつ、「Disk Encryption」を有効化した状態）を格納します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618220652.png "img")      

ちなみに「Disk Encryption」を有効化した状態というのは、上記説明通りRDSインスタンスを作成するときに、コンソール画面で「ディスク暗号化をするか」、というやつです。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618220820.png "img")      

この状態で、他アカウントのOSSから他アカウントのRDSインスタンスへデータのリストア（復元）をしてみます。    
結果、リストア成功でした。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618221140.png "img")      

もちろんDMS上でSQLクエリも回せて、個人情報も見れます。　　　
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618221537.png "img")      

この観点から、データを暗号化する場合は、「Disk Encryption」を有効化するだけでなく、TDEを有効化した状態での組み合わせが望ましいです。
なお「Disk Encryption」を有効化することによる恩恵として、例えば外部からの不正アクセスによる閲覧や、データセンターにて何かしら物理的なアクセスがあった場合に対する保護機能として有効です。

> https://www.alibabacloud.com/blog/data-encryption-at-storage-on-alibaba-cloud_594581



## 確認事項2：TDEによる暗号化済のデータを他環境で使うためには？

ざっくりで以下の方法があります。    
1. プログラミングやSDK、APIによる、RDS SQLServerから直接データをExportし、他のRDS環境へ移植    
2. 上記 [確認事項1：バックアップデータ（TDE暗号化）を他RDSインスタンス（同一アカウント）でリストア（復元）できるか？] の通り、TDE済だと移植が出来ないので、TDEを解除してから移植     
3. TDE暗号化実施済によるデータを移植するために、移植先のRDSインスタンスに対応する証明書を先に移行してからデータを移行    

3については、KMSコンソール画面から、証明書を作成し、発行する必要があります。    
.pfx（Personal Information Exchange)というバイナリファイルをエクスポートします。.pfxファイルには証明書と秘密鍵の両方が含まれます。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/211100.htm


その後、移行先のKMS画面にて、.pfxファイルをインポートします。これにより、移行先のRDSインスタンスへTDEによるデータ移植をします。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/211115.htm


これと同じ方法であれば、例えばAWS RDS SQLServerやオンプレミスのSQL ServerからでもApsaraDB RDS SQL Serverへデータを暗号化したまま、マイグレーションすることが出来ます。    

参考として、Active Directoryを跨いだマイグレーションであれば、こちらベストプラクティスが役に立つと思います。    
[Integrating RDS SQL Server with Microsoft Active Directory Domain Services](https://resource.alibabacloud.com/bestpractice/detail.html?bpId=2020102119294800001)   

> https://resource.alibabacloud.com/bestpractice/detail.html?bpId=2020102119294800001


## 確認事項3: 「Disk Encryption」を有効化してないまま、RDSインスタンスを購入した場合
この場合、既存のRDSインスタンスをバックアップしてから、別の新しいRDSインスタンス（Disk Encryptionをチェックして有効）を購入し、リストア（復元）します。
バックアップおよびリストア（復元）は上記手順にあるので、参考にはなるかなと思います。

> https://www.alibabacloud.com/cloud-tech/doc-detail/135391.htm



## 確認事項4: 途中からTDEを有効化したい場合
ご安心ください、TDE（データの暗号化）はいつでも有効化することが出来ます: )
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210618222237.png "img")      

> https://www.alibabacloud.com/cloud-tech/doc-detail/95716.htm


# サマリ
TDE・ディスク暗号化したデータの移行でまとめると、このような感じになります。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Database/Database_images_26006613777375500/20210619142430.png "img")      


# まとめ
この記事では、Alibaba CloudのKMSによる暗号化、ApsaraDB RDS SQLServerのバックアップ暗号化・復号化のためのその使用法について説明しました。    
機密性の高いデータベースバックアップを保護し、不正アクセスを防ぐためには、暗号化を利用する必要があります。





