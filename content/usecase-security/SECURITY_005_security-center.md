---
title: "Security Centerの紹介"
metaTitle: "Security Centerの機能の紹介"
metaDescription: "Security Centerの機能の紹介"
date: "2020-04-24"
author: "SBC engineer blog"
thumbnail: "/Security_images_26006613554361700/20200423110014.png"
---

## Security Centerの機能の紹介

# はじめに

本記事では、セキュリティ構築支援のプロダクトであるSecurity Centerの特徴と使用方法、および注意点をご紹介します。    

まずは、Security Centerについての概要について説明します。    
Security Centerは、「OSの脆弱性」「構成基準のチェック」「不正ログイン検知」「ウイルス検知」といったようなセキュリティに関する様々なリスクを防衛・一括管理するプロダクトです。    
また、Alibabaが独自に開発たビッグデータと機械学習アルゴリズムを統合しており、すべてのセキュリティ脅威をリアルタイムでチェックおよび処理しています。    

詳細は、以下の公式ドキュメントをご覧ください。  

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/42302.htm

本ブログでは、その中の「WindowsOSの脆弱性修正」「ベースラインチェック」「不正アクセス」「ウイルス検知」の機能を紹介していこうと思います。  

検証は、国際サイトで実施しSecurity CenterはEnterprise Editionを使用します。  


# コンソールトップ画面の見方

使い方を紹介する前に、まずはコンソールのトップ画面について説明していきます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110014.png "img")      


① Security Score  
  アカウントで保持しているサーバーやプロダクトに対するセキュリティの総合評価になります。    
  最小値は10点、最大値は100点となっており、OSの脆弱性が未修正なら2点減点のような減点方式です。    
  どのくらいセキュリティ対策がされているのかの目安として用いることにしましょう。    

② Asset Status  
  保護対象の総数や、リスクに晒されているサーバ数などが一目でわかるようになっています。    
  数値をクリックすることで、それぞれのページへ遷移します。    

③ Security Detection And Defense Capabilities  
  検出・防衛機能の情報です。    
  使用している保護機能などが視覚化されています。    

④ Threat statistics  
  脅威の統計がグラフ化されています。    
  左から順に、未解決アラート、未解決脆弱性、ベースライン検出、攻撃数となっています。    
  グラフが赤くなっている場合はリスク高のものがあるため早急に解決しましょう。    

⑤ Configuration Assessment  
  プロダクトの構成管理に関するアラート一覧です。    
  Security Groupの設定や、OSSのアクセス許可設定などプロダクトのセキュリティ構成に関するアラートが表示されます。    

⑥ Issue Resolved  
  直近で解決した問題の総数がグラフ化されています。    

# Security Center エージェントのインストール方法

Security Centerはインスタンスにインストールされたエージェントと通信をし、様々なセキュリティイベントを解決します。
エージェントが無いインスタンスにはSecurity Centerの機能は使用できません。そこでまずは、ECSインスタンスにSecurity Centerのエージェントをインストールする方法を説明します。

新規にインスタンスを作成する場合には、インスタンス作成時に以下のチェックを入れることで自動的にインストールされます(デフォルトでON)。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110020.png "img")      

既存のインスタンスにインストールする場合
"Setting" > "Agent" > "Client to be installed" からワンクリックでのインストールが可能です。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423112906.png "img")      


# Windowsの脆弱性の修正

続いて、コンソール上でWindowsの脆弱性を対処する方法つまりは Windows Update を実施する方法を説明していきます。
"Precaution" > "Vulnerabilities" > "Windows System" を開きます。

こちらには脆弱性が修正されていないインスタンスがある場合、修正すべき脆弱性の一覧が表示されます。
スキャン日時が表示されているため、この時間よりも後に立てたインスタンスがある場合は、"Scan now" を実行して最新化しておきましょう。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110024.png "img")      


まずは、今回修正するインスタンスのWindows Update情報を見てみましょう。  
今回は赤枠で囲っている2つの脆弱性をコンソール上から修正しようと思います。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110029.png "img")     


それでは、先ほどの一覧画面に戻りましょう。  
KB4549949のパッチをクリックし、詳細画面を開きます。  

詳細画面は、以下のように脆弱性パッチの情報を閲覧することが可能になっています。


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110034.png "img")     


詳細画面の下部には、修正対象のサーバ一覧があります。    
修正対象のサーバの "Fix" をクリックするか、チェックボックスにチェックを入れて下の "FIx" をクリックします。(複数対応時はこちらの方法)  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110039.png "img")     


Snapshotを取るかどうかの選択画面になります。  
今回の例だとは保持期間1日でSnapshotを作成して脆弱性の修正します。(保持期間は最大3日まで設定可能)  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110044.png "img")     


Snapshotを作成し終えたら修正処理が開始します。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110050.png "img")      


100%まで完了すると、再起動待ちの状態になります。<span style="color: #ff5252">勝手に再起動されることはありません</span>。  
<span style="color: #ff5252">再起動をしてよい状態であれば</span>、"restart" をクリックしましょう。インスタンスの再起動が開始します。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110056.png "img")      


再起動が完了したら、 "Verify"  をクリックしましょう。脆弱性が修正されているかのチェックが実行されます。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110101.png "img")      
↓
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110105.png "img")      


正常に修正が完了した場合、Handled と表示されます。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110109.png "img")      


もう片方の脆弱性も同様に進めました。  
完了後にインスタンスに接続し、WindowsUpdate情報を見てみましょう。  
以下のように、修正がされていることが確認できました。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110113.png "img")     

    
以上で完了です。コンソール上からWindowsUpdateすることができましたね 
また、Security Centerは <span style="color: #ff5252">private IPしか付与されていないサーバに対してもエージェントを通して通信することができる</span>ため、
public IPを必要とせずに、脆弱性確認や修正をすることが可能となっています。



# ベースラインチェック

ベースラインチェックの機能では、インスタンスに対してAlibabaの推奨するセキュリティ構成やCIS Microsoft Windows Server Benchmarksの推奨するセキュリティ構成のチェックを実施することができます。  
"Precaution"  > "Baseline Check" を開きます。  チェックに失敗したポリシーの一覧が表示されています。  
今回は、「Alibaba Cloud Standard - Windows 2016/2019 R2 Security Baseline」 を修正していきます。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110118.png "img")      


詳細画面を開くと、対象のサーバ一覧が表示されますので修正したいインスタンスの "View" をクリックしましょう。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110123.png "img")     


すると、以下のようなチェック項目一覧とそのステータスが表示されます(見やすさの都合上Chromeの翻訳機能を適用しています)。  
今回は「パスワードの有効期限設定」を修正していこうと思います。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110128.png "img")     


"details" をクリックすると、概要や修正方法を確認することができます。  
コンソール上から修正は行うことはできないので、インスタンスに接続し修正をします。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110133.png "img")     


実際に修正手順に従って、修正を行いました。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110138.png "img")     


Assets画面からの手動スキャンでBaselineチェックを実行し、先ほどのチェック項目一覧画面を見てみましょう。  
以下のように、チェックが通っていることが確認できます。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110143.png "img")     


これでベースラインチェックの修正は完了となります。  
構成面でのセキュリティリスクが一覧で見ることができる良い機能だと思います。  

# アラート
# 総当たり攻撃の防御設定  

こちらの機能は、一定時間に一定回数インスタンスのログインに失敗したクライアントのIPをブロックしアクセスできないようにする機能です。  
この機能は無料版のSecurity Centerでも使用することが可能となっています。  

なお、<span style="color: #ff0000">SSH接続でのログインが対象となっているため、Windowsのリモートデスクトップ接続には使用することはできません。  </span>

それでは実際に設定していきます。  
"Detection" > "Alert" を開き、右上の "Setting" を開きます。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110150.png "img")      


"Anti-brute Force Cracking" タブを選択し、"Add" ボタンを押します。  
なお、初回使用時は以下のようにRAMポリシーの追加を要求されますので追加しておきましょう。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110155.png "img")     


設定画面は以下のようになっています。  
大切な個所は赤枠で囲ったルール設定部分です。 
<span style="color: #0000cc">何分以内に、失敗が何回超えたら、何分ブロックするのか</span>を設定することができます。  
画像の例だと、10分以内に失敗が4回を超えたら、5分ブロックするという設定になっています。  
ここで注意点なのですが、<span style="color: #ff5252">「失敗が4回を超えたら」という点です、「以上」ではなく「超えたら」なので4回失敗した段階ではブロックされません。  
5回失敗した際にブロックされます。  </span>


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110201.png "img")     


実際に5回失敗してみました。  
Security Centerのコンソールで確認してみます。  
"Detection" > "Alert" を開きます。すると、"IP blocking / All" の左側の数値が1になっています。  
"1" をクリックして詳細画面を見てみましょう。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110206.png "img")      


詳細画面では、攻撃対象になったインスタンスや時間、ブロックしたIPアドレスなどの情報が閲覧できます。  
一番右の "Status" が "Enable" になっている間は、ブロックしたIPからはアクセスすることができません。  
純粋な打ち間違い等でブロックされてしまったら、トグルボタンを押しDisableに変更しましょう。
 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110211.png "img")      


# 不正ログイン

Security Centerの不正ログイン検出では、以下の場合にアラートを発報する設定ができます。  
総当たり攻撃とは異なり、<span style="color: #ff5252">WindowsサーバのRDP接続でも使用することが可能です。(ただし、サインアウトしている状態からの接続のみ)</span>   

* ・ 指定IP以外からのログイン   
* ・ 指定時間外のログイン  
* ・ 指定アカウント以外のログイン  

Assets画面から、検出したいインスタンスを選択し、詳細画面を開きましょう。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110215.png "img")      


"Basic Infomation" > "Login Security Setting" タブで設定を行います。  
今回は、指定時間外のログインのアラート設定します。  
トグルボタンを押し、"Add" をクリックして設定画面を開きましょう。(設定画面は時間を入力するだけなので割愛します。)  
ここで、注意点ですが<span style="color: #ff5252">日本リージョンでタイムゾーンを東京にしたのにも関わらず、中国時間での検出となっていました。  </span>
日本時間で設定した場合は -1時間で設定しましょう。 (日本09:00 ～ 18:00で設定したい場合、08:00 ～ 17:00 とする)
  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110220.png "img")     


また、個別の画面からでなくても、総当たり攻撃の設定をした時と同じ画面で、複数インスタンスを同時に設定することも可能です。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110225.png "img")     


実際に時間外でログインをすると、以下のようなアラートが発報されます。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110229.png "img")      


他の不正ログインも設定してみましょう。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110233.png "img")     


条件を1つも満たさずにログインすると、3つのアラートが同時に発砲されます。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110238.png "img")      


以上で不正ログインの説明は完了となります。  
指定IP以外からのログインに関しては、Security Groupの設定で十分ですが、時間やアカウントの制御は役に立つ場面があると思われます。  

# ウイルス対策機能についての注意点

Security Centerにはウイルス対策機能も備わっています。  
設定は簡単で、 "Settings" >" Virus Detection" をONにし、対象インスタンスを設定するだけです。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613554361700/20200423110243.png "img")      


ただし、使用する際に知っておくべき注意点があります。  
<span style="color: #ff5252">Security Centerのウイルス対策機能は、インスタンスの常駐エージェントで行うのではなく、インスタンスで起動した・しているプロセス情報をエージェントが取得してSecurity Centerに送信し、
Security Center側でスキャン、検疫命令を出すような仕様</span>となっています。  

そのため、現状はウイルス検出機能の対象はプロセスのみで、一般的なウイルス対策ソフトにあるような<span style="color: #ff5252">リアルタイムスキャンやフルスキャンのような検出方法はない点に注意しておきましょう</span>。  
しかしながら、<span style="color: #ff5252">ウイルス定義ライブラリのみでなくAlibaba独自の機械学習でのウイルス検知機能も備わっていますし、</span>すべてのインスタンスの検出・検疫結果をコンソール上から確認できる大きな利点があります。  


# 終わりに
今回は、Security Centerの主要な機能と使い方をご紹介いたしました。  

たくさんのインスタンスのセキュリティ管理を一括で実施することのできる便利なプロダクトですね。    
また、本ブログではアラートに関しては一部しか紹介しておりませんし、脆弱性やベースラインの許容設定など細かい設定も可能となっています。
Alibaba Cloud外部のサーバも管理することも可能です。ご参考に頂ければ幸いです。    
