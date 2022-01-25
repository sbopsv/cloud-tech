---
title: "IDaaSで2要素認証を導入"
metaTitle: "Alibaba Cloud IDaaSを使ってVPN Gatewayに2要素認証を導入してみた"
metaDescription: "Alibaba Cloud IDaaSを使ってVPN Gatewayに2要素認証を導入してみた"
date: "2021-03-19"
author: "sbc_saito"
thumbnail: "/Security_images_26006613704708200/20210318184906.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Alibaba Cloud IDaaSを使ってVPN Gatewayに2要素認証を導入してみた

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318184906.png "img")      

# はじめに
本記事では、Alibaba Cloud国際サイトにある「IDaaS」というプロダクトをVPN Gatewayと組み合わせることで、SSL-VPN接続時にID+パスワード認証を追加導入検証結果をご紹介します。    


# IDaaSとは
IDaaS（Identity as a Service）とは、クラウド上の様々なサービスのID管理を一元的に行うクラウドサービスのこと。   

クラウドサービス間でシングルサインオンが可能になったり    
利用するユーザー側においてパスワード管理が減り、利便性向上にも貢献すると言われております。   

代表サービス例：Okta、Onelogin、Azure Active Directoryなど

# 構成図
今回はこのような構成でVPN Gateway接続時に、従来の証明書認証に加えてADのユーザIDとパスワード情報も加えることで2要素認証を実現します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318185334.png "img")      

Alibaba Cloud東京リージョンにVPN Gateway(SSL-VPN)を構築して  
Windows ADサーバは別VPCの東京リージョンに配置しています。  
IDaaSはPublic Previewなのでシンガポールリージョンのみの対応となりますが  
IDaaSと各インスタンス間は接続時の認証通信のみですので、リージョンの場所で大きく不利になることは無いと思います。  

# IDaaSインスタンスを購入

Alibaba Cloudにログインし、コンソールは英語表示に切り替えておきましょう。  
プロダクト検索バーで「IDaaS」と入力すればHITするはずです。

プロダクトのコンソール画面へ遷移すると、このようなエラーが表示されるかもしれません。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318153253.png "img")      

これはリージョン選択が「東京リージョン」になっており、IDaaSがリリースされていないリージョンのためです。

なので画面左上部よりシンガポールリージョンを選択して、Webブラウザのリロードをしましょう。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318153532.png "img")      

ちゃんとIDaaSのコンソール画面が開きましたね。右側にある[Buy IDaaS]ボタンを押してインスタンス作成を進めます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318154348.png "img")      

<b>Public Preview版なので選択可能な要素はなく、価格も$0です。  
このインスタンスは1ヶ月間有効で、期限を越えると無効のインスタンスとなります。</b>  
規約同意いただけたら、右下の[Buy Now]ボタンをクリックします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318154827.png "img")      

その後決済画面になりますが、こちらも購入処理を進めます。(繰り返しですが$0です)  

IDaaSのコンソール画面に戻ると、インスタンスが正常に作成されていますね。![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318155516.png "img")      

インスタンスIDをクリックして、早速設定していきましょう。


# 認証ソース選択
IDaaSの認証ソースとしてADサーバを追加します。

1. 左カラムから「Authentication Sources」を選択
1. Add Authentication SourceからLDAPを選択

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318155646.png "img")      


続いてActive Directroyの情報を入力します。   
ADは今回Alibaba Cloud上に作成していますが、オンプレや他社クラウド上でも問題ありません。  
グローバルIPでアクセスできればOKです。           
3.「Name」は任意  
4.「LDAP URL」は`ldap://<ADのIP>`   
5.「LDAP Base」はDN形式でドメイン名を入力。  
私のADドメインはMS界隈でお馴染みの`contoso.com`としています  
6.「LDAP Account」はDomainAdmin権限のあるADユーザをDN形式で入力  
7.   上記ユーザのパスワードを入力  
8.   ユーザ名の抽出フィルタを入力します  
ADの場合は`sAMAccountName = $ username $`

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318160052.png "img")      

オプションの設定です。           

9.「Verify with userPassword」  LDAPに登録されたパスワードとIDaaSが管理するパスワードの比較を行うには有効化  
10.「Update IDaaS Password」 LDAPを経由してIDaaSにログインした後、IDaaSで管理するLDAPユーザのパスワードを更新するには有効化   
11.「Display」認証ソースロゴをログイン画面に表示するには有効化  
※今回のVPN Gateway構成では特に不要です
 
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318161850.png "img")      


設定が完了すると、Authentication Source Nameの一覧に「LDAP」が追加されます。  
追加されたLDAPの「Status」トグルをオンにします。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318162948.png "img")      


Alibaba CloudプロダクトとAD連携させるための設定を行います。            
12. 左カラムの「Security Settings」→中央タブ「Cloud Product AD Authentication」へ遷移する  
13.「AD Authentication Source」から先ほど設定したLDAP設定を選択  
14. Enableトグルをオンにして、Saveする。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318163316.png "img")      


# LDAPユーザの同期

Alibaba Cloud IDaaSはActive Directoryと同じくディレクトリ機能も有しています。  
IDaaSで認証するためには、ADのディレクトリ情報をIDaaSのディレクトリと事前に同期させる必要があります。

1. 左カラムの「Organizations and Groups」→「Configure LDAP」を選択
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318165212.png "img")      

1. [Create]ボタンをクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318165220.png "img")      

AD情報を再び入力していきます。            
3.「AD/LDAP Name」は任意の名前  
4.「Server Address」はADのIPアドレス  
5.「PortNumber」はADなら389が標準ポート  
6.「Base DN」は参照の認証を利用した際にユーザを検索するルートとなるエントリ地点を入力。  
今回は`dc=contoso,dc=com`  
7.「Administrator DN」はAdministrator権限ユーザをDNで指定する  
今回は`cn=administrator,cn=Users,dc=contoso,dc=com `   
8.「Password」は上記ユーザのパスワード  
9.「Type」はWindowsAD  
10.「From LDAP to IDaaS」はEnable  
11.「Provision from IDaaS to LDAP」はEnable
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318165421.png "img")      


続いて同期するにあたっての照合条件を設定します。          
1. タブを「Field Matching Rules」に切り替える  
2.「Username]は`cn`  
3.「External ID」は`uid`  
4.「Password Attribute」は`unicordPwd`  
5.「User Unique Identifier」は`DistinguishedName`  
6.「Email」は`mail`  
7.「Phone Number」は`telephoneNumber`  
8.「Default Password」は任意のパスワード  
最後にSaveします
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318165443.png "img")      


同期するための準備が完了しました。  

# IDaaSとADの同期


早速IDaaSとADのディレクトリを同期してみましょう。          

1. Import→LDAP-Accountを選択

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318175745.png "img")      

2.先ほど追加した同期先ADサーバ名の右にある「Import」を押下し、表示された画面で「OK」をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318171117.png "img")      

3.ユーザの追加が成功すれば、各ユーザのVerification Result列に「Success」と表示される。画面右上の「Confirm Import」ボタンをクリックしてインポートを完了させる


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318171124.png "img")      

※1ユーザでもエラーがあると下記画像の様にインポートが失敗する。  
エラーの原因を見直し再度試すか、インポートするユーザから除外(Remove)し  
「Confirm Import」ボタンを押下する  
(メールと電話番号フィールドは入力必須)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318180132.png "img")      


これでIDaaS側の設定は完了です 


# VPN Gateway側の設定

VPN GatewayとSSL Serverのインスタンスは既に作成済みです。  
ユーザ認証を導入するためにSSL Serverに下記の編集を行います。          

1.「Advanced Configuration」のトグルをオン  
2.「Two-factor Authentication」のトグルをオン  
3.「IDaaS Instance Region」からシンガポール リージョンである`ap-northeast-1`を選択  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210319093653.png "img")      

4.初回IDaaS選択時は権限が無い為「You hace no permissions…」のリンクをクリックする
  ![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318180411.png "img")      


5.VPN GatewayにIDaaSへのアクセス許可を与える
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318180417.png "img")      


6.「IDaaS Instance」から先ほど作成したIDaaSインスタンスを選択してOKをクリックして設定を完了する。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318180405.png "img")      


# さっそく接続

クライアント端末にクライアント証明書をインポートし  
OpenVPNクライアントソフトでVPN Gateway宛に通信を試行すると  
ユーザとPWを求められる画面が表示されました   
(本検証ではTunnelblick 3.8.4aを使用)
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318180426.png "img")      

IDaaSにインポートしたADユーザのユーザ名とPWを正しく入力し  
OKボタンをクリックすると接続が成功しました
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-security/Security_images_26006613704708200/20210318180430.png "img")      


# 最後に
<b>IDaaSとVPN Gatewayを連携させて、ADユーザ情報を用いてSSL-VPNの2要素認証を行えました。</b>
このようにIDaaSは色々な組み合わせが出来ますので、ご参考に頂ければ幸いです。     
 
 
  <CommunityAuthor 
    author="斎藤 貴広"
    self_introduction = "2020年からAlibaba Cloudのソリューション開発や技術支援に従事。ネットワークや基盤などのインフラ回りがメイン領域で、最近はゼロトラストセキュリティやWeb系もかじり中。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/saito.png"
    githubUrl=""
/>


