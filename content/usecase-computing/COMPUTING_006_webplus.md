---
title: "Web App Serviceを試す"
metaTitle: "Web App Service（Web +）がリリースされていたのでさわってみた❗️"
metaDescription: "Web App Service（Web +）がリリースされていたのでさわってみた❗️"
date: "2020-01-11"
author: "sbc_y_matsuda"
thumbnail: "/computing_images_26006613495741500/20200110173415.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Web App Serviceを試す


こんにちは。   
ソリューションアーキテクトの松田([@MatYoshr](https://twitter.com/MatYoshr))です。  

Alibaba Cloud の管理コンソールをさわっていると、見慣れぬものがあることに気づきました🤔

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110174402.png "img")      

ナニコレ・・・❗️❓  
ということで一先ずさわってみました😁

今回は「さわってみた」ということで機能解説は改めて記事にする予定です❗️

      

# Web App Service（Web +） とは？

ザックリで言うとAlibaba版の AWS Elastic Beanstalk が一番近い感じでしょうか？  
ウェブアプリケーションの展開と定義された環境の構成自動化をしてくれるサービスです。  


# Web App Service（Web +） の有効化

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110150849.png "img")      


チェックボックスにチェックを入れます。  
`I have read and agree to the Terms of Service of Web App Service (Web+), Terms of Service of Object Storage Service (OSS) and Terms of Service of Auto Scaling Service.`

`Authorize and Activate Now` をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110151054.png "img")      

`同意授权`をクリックします。  
「同意する」と言う意味です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110151336.png "img")      

`关闭`をクリックします。  
「閉じる」と言う意味です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110151743.png "img")      

しばらくすると画面が変わります。  
`Get Started with Web+` をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110152043.png "img")      

こんな感じのWeb App Service（Web +）画面が表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110155011.png "img")      


執筆時点で使えるリージョンは以下です。  
日本はまだ無いので追加されるのを待ちましょう😢

* 上海
* 香港
* シンガポール
* シドニー
* ムンバイ

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110154706.png "img")      

# アプリケーションの作成

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110155127.png "img")      

`Application Name` を入力します。  
漢字とカタカナ、ひらがなはダメでした。  
`Application Description`には漢字とカタカナ、ひらがなも使えます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110160456.png "img")      

ベースのOSは Aliyun Linux2 ですね。  
あとアリババ製のJDK実装である Dragonwell も選べるようです。
ところで Java11は・・・

> https://github.com/alibaba/dragonwell8

ちなみに対応しているスタックは以下になります。  

* Tomcat:
    * Tomcat 8.5 / Java 8 / Aliyun Linux 2.1903
    * Tomcat 8.5 / Dragonwell 8 / Aliyun Linux 2.1903
* Java:
     * Java 8 / Aliyun Linux 2.1903
     * Dragonwell 8 / Aliyun Linux 2.1903
* Node.js:
     * Node.js 8.16.0 / Aliyun Linux 2.1903
     * Node.js 10.16.0 / Aliyun Linux 2.1903
* Go: 
    * Go 1.12.7 / Aliyun Linux 2.1903
* PHP: 
    * PHP 7.3 / Aliyun Linux 2.1903
* Python:
     * Python 3.7.4 / Aliyun Linux 2.1903
     * Python 2.7.16 / Aliyun Linux 2.1903
* ASP.NET Core:
    * ASP.NET Core 2.2 / Aliyun Linux 2.1903
    * ASP.NET Core 3.0 / Aliyun Linux 2.1903
* Ruby: 
     * Ruby 2.6.3 / Aliyun Linux 2.1903
* Native: 
    * Native / Aliyun Linux 2.1903

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110160903.png "img")      

各種項目を入力します。
本来は自分のアプリケーションをアップロードするのですが、今回はサンプルアプリを使用します。

サンプルアプリは以下になります。  
> https://github.com/aliyun/alibabacloud-webplus-tomcat-demo


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110161424.png "img")      

`Low-cost` `High Availability` `Custom` の３つの選択肢から構成を選択可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110165808.png "img")      

`Custom` を選択すると環境設定を画面上で変更することが可能です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110164559.png "img")      

今回はとりあえず`Low-cost` で進めてみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110170445.png "img")      

作成される環境の情報が表示されます。  
`ecs.t5-lc1m1.small` のECSインスタンスが作られるようです。

```
・Bind VPC vpc-xxxx
・Bind VSwitch vsw-xxx
・Create Security Group
・Update Scaling Group
・Creating 1 ECS instances of the following instance type by the specified priority.
　ecs.t5-lc1m1.smallYou may be charged for new resources. For more information, see ECS Pricing.
・Install the Technology Stack in the ECS Instance
・Create Monitoring Group
・Synchronize ECS Instance
・Change the application in the instance
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110172105.png "img")      

無事に作成が終わったようです、`Finish`をクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110172435.png "img")      

こんな感じでアプリケーションが表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110172659.png "img")      

`TestEnv01`をクリックすると以下のような画面が表示されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110173205.png "img")      

赤枠で囲まれている部分が展開されたアプリケーションのIPアドレスになります。  

アクセスすると以下のような画面が表示されました❗️

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110173415.png "img")      

ECSの管理画面を見に行くと実際にインスタンスが動いていました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613495741500/20200110173812.png "img")      

# おわりに

まずは一旦ここまでで機能の解説などは改めて記事にしたいと思います。  
最近はドンドン新サービスがリリースされてきていますのでみなさんイロイロさわってみて下さいね😁



 <CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>



