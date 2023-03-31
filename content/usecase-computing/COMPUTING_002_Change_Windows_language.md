---
title: "Windows Serverの日本語化手順"
metaTitle: "Alibaba Cloud ECS の Windows Server の 言語変更方法（日本語化手順）"
metaDescription: "Alibaba Cloud ECS の Windows Server の 言語変更方法（日本語化手順）"
date: "2019-07-19"
author: "SBC engineer blog"
thumbnail: "/computing_images_17680117127220100000/20190718173602.png"
---

## Alibaba Cloud ECS の Windows Server の 言語変更方法（日本語化手順）

本記事では、Alibaba Cloud が提供している ECS (Elastic Compute Service) のWindows Server の言語変更方法（日本語化手順）を紹介します。     

## 初めに
以前、Alibaba Cloud 日本サイトでは、日本語版のWindows Serverを提供していましたが、     
残念ながら、2019年7月5日をもって、その選択肢がなくなりました。

現時点（2019年7月18日）で日本サイトが提供しているWindows系のECSは以下となります。          

* ・<span style="color: #dd830c">2008 R2 Enterprise 64bit (英語版・中国版)</span> 
* ・<span style="color: #dd830c">2012 R2 Data Center Edition 64bit (英語版・中国版)</span>
* ・<span style="color: #dd830c">2016 R2 Data Center Edition 64bit (英語版・中国版)</span>
* ・<span style="color: #dd830c">2019 R2 Data Center Edition  64bit (英語版・中国版)</span>
* ・2019 version 1809 Data Center Edition 64bit UI なし(英語版・中国版)

     
今回は、上記で<span style="color: #dd830c">オレンジ色</span>に表示されている「英語版」のWindow Serverを日本語に言語変更する方法を紹介します。
          
大まかなながれとしては、はじめに、エディションごとの言語の変更方法、
     
次に、毎回言語変更を行うのが時間がかかりますので、日本語に設定されたインスタンスのイメージを作成し、
     
最後に、イメージから新規（日本語設定済みの）インスタンスを作成したいと思います。
     
     
前提としては

* ・英語版のWindows Serverをすでに購入済みであること
* ・RDP接続で Windows 環境にログインできること

となります。


## 2008 R2 Enterprise 64bitの言語変更方法
作業ステップとしては次の通りになります。    

1. 事前準備（IEでダウンロードを行う場合）
1. Microsoft社から言語パッケージをダウンロード
1. Windowsの言語を変更

     
## 1. 事前準備（IEでダウンロードを行う場合）

インスタンスを購入した直後の初期状態では、ブラウザーは「Internet Explorer (IE)」しかありません。    
このため、ここではIEでダウンロードを行う場合の手順を紹介します。    
Mozilla FirefoxやOperaなどのブラウザーで言語パッケージをダウンロードする場合は、このステップをスキップしてください。    
なお、中国リージョンでインスタンスを作成された場合、Google Chromeを使用できませんのでご注意ください。    
IEブラウザーでダウンロードを行う場合は以下の手順を行います。    
以下の手順を行わなかった場合、IEで検索・ダウンロードするたびにホワイトリストする必要があります。     

1. 「Start」を押下し、「Server Manager」を検索し、押下します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718164620.png "img")     


2. 「Server Summary」内の「Security Information」にスクロール、「 Security Information 」の「Configure IE ESC」を押下します    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718164324.png "img")     

3. 「Internet Explorer Enhanced Security Configuration」内の「Administrator」と「Users」を「Off」に変更し、「OK」を押下します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718164715.png "img")     



## 2. Microsoft社から言語パッケージをダウンロード
   
1. ブラウザーから「 Windows Server 2008 R2 Service Pack 1 複数言語ユーザー インターフェイス言語パック 」を検索、もしくは以下をクリックします     

> https://www.microsoft.com/ja-jp/download/details.aspx?id=2634


2. Microsoft社のダウンロードページに遷移し、「日本語」を選択したあとに、「ダウンロード」を押下します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718170110.png "img")     

3. ポップアップとして、ダウンロードを実行するかを確認されますので、「Run」を押下します     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718170231.png "img")     

4. インストールが完了するまで待ちます     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718170325.png "img")     


## 3. Windowsの言語を変更   
1. 「Start」を押下し、「Control Panel」を開き、「Clock, Language, and Region」を押下します     

2. 「Region and Language」内の「Change display language」を押下します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718170618.png "img")     

3. 「Choose a display language」から「日本語」を選択し、「OK」を押下します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718171130.png "img")     

4. ポップアップから「Log off now」を押下します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718171258.png "img")


## Windows Server 2008 R2 Enterprise 64bit言語変更完了   
インスタンスにログインし、言語が変わっていることが確認できます。

--- 

## 2012 R2 Data Center Edition 64bit 及び、2016 Data Center Edition 64bitの言語変更方法     

Alibaba Cloud が提供しているドキュメントを参考に言語変更を行ってください。     
ただし、ドキュメント上は英語からドイツ語への手順が記載されていますが、日本語に変更するには同じ手順で行うことができます。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/92725.htm


## Windows Server 2019 Data Center Edition 64bitの言語変更方法
作業ステップとしては次の通りになります。   
 
1. PowershellからWSUS を一時的に無効
1. 日本語のパッケージをインストール
1. インスタンスを再起動
1. PowershellからWSUS を有効化

     
## 1. PowershellからWSUS を一時的に無効 
1. 「Powershell」を起動します     
2. 以下のコードを実行します

```
> Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU' -Name UseWUServer -Value 0      
> Restart-Service -Name wuauserv
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718172930.png "img")     


## 2. 日本語のパッケージをインストール
   
1. 「Windows Settings」から「Time & Language」を押下します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718173036.png "img")     

2. 「Language」タブから「Add a language」を押下します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718173114.png "img")     

3. 「日本語」を検索し、選択し、「Next」を押下します     

4. 「Install language feature」画面で「Install language pack and set my Windows display language」がチェックされていること確認し、「Install」を押下します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718173234.png "img")     


## 3. インスタンスを再起動
1. インストールが完了されますと、「Windows display language」が「日本語」に変更されていることを確認します

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718173602.png "img")     

2. ECSコンソールからインスタンスを再起動を行います     
ECSの再起動の手順はドキュメントを参考にしてください。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/25440.htm

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718173911.png "img")

3. インスタンスにログインし、言語が変わっていることを確認します

## 4. PowershellからWSUS を有効化    
1. 「Powershell」を起動します     
2. 以下のコードを実行します

```
> Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU' -Name UseWUServer -Value 1      
> Restart-Service -Name wuauserv
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718174049.png "img")     


## Windows Server 2019 Data Center Edition 64bit言語変更完了   


---

## カスタムイメージを作成


上記手順で言語設定を変更したOSから『カスタムイメージ』を作成することで、
     
その後、同じ手順を繰り返すことなく、同じ環境・言語のインスタンスを作成することができるようになります。          
1. [ECS コンソール](https://ecs.console.aliyun.com/)にログインします     
2. 対象のリージョンを選択します。     
3. 左側のナビゲーションウィンドウで、<strong>[インスタンス]</strong> をクリックします。     
4. 対象のインスタンスを検索し、<strong>[詳細] > [ディスクとイメージ] > [カスタムイメージを作成]</strong> をクリックします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718175629.png "img")     

5. イメージの名前と説明を入力します。     
6. <strong>[作成]</strong> をクリックします。     


## カスタムイメージからインスタンスを作成
### ECSインスタンス購入画面からインスタンス作成

1. ECSコンソールからECSインスタンス購入ページに遷移します     
2. 「イメージ」枠の「カスタムイメージ」を選択します     
3. ドロップダウンから作成したいイメージを選択します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718180200.png "img")

### ECSイメージリスト画面からインスタンス作成

1. ECSコンソールから左にある「イメージ」を選択します     
2. 作成したいイメージから「インスタンス作成」を押下します     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127220100000/20190718180251.png "img")



